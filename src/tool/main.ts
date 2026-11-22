// Prep Pack builder island (vanilla TypeScript, spec §4 + §6).
// Hydrates only on the tool page. All state lives in IndexedDB on this
// device; the only network activity this module can trigger is opening the
// user's own AI chat in a new tab with a short prompt (ai-handoff.ts).

import './tool.css';
import { runHandoff, type HandoffTask } from './ai-handoff';
import { serializeBackup, validateBackupText } from './backup';
import {
  flushSave,
  getSaveStatus,
  isDirty,
  loadWorkspace,
  onSaveStatus,
  requestPersistence,
  scheduleSave,
  storageEstimate,
  type SaveStatus,
} from './db';
import { buildBriefMarkdown, buildBriefPrintHtml, buildChecklistPrintHtml, buildPackICS } from './exporters';
import { GENERAL_SET, ROLE_SETS, type RoleSet } from './role-sets';
import { downloadICS } from '../lib/ics';
import {
  INTERVIEW_TYPE_LABELS,
  emptyWorkspace,
  newId,
  type InterviewType,
  type Pack,
  type Pitch,
  type Story,
  type Workspace,
} from './types';

export function assemblePitch(pitch: Pitch): string {
  return [pitch.present, pitch.past, pitch.future].map((s) => s.trim()).filter(Boolean).join(' ');
}

export function estimateSpokenSeconds(text: string): { words: number; seconds: number } {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average conversational speaking pace ~140 words per minute (~2.33 words/sec).
  const seconds = words ? Math.max(1, Math.round((words / 140) * 60)) : 0;
  return { words, seconds };
}

export function formatPackHeading(pack: Pick<Pack, 'roleTitle' | 'company'>): string {
  return `${pack.roleTitle || 'Untitled interview'}${pack.company ? ` at ${pack.company}` : ''}`;
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('prep-tool');
  if (root) void init(root);
}

type View = 'packs' | 'stories' | 'pitch' | 'settings';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ALL_SETS: RoleSet[] = [GENERAL_SET, ...ROLE_SETS];
const setBySlug = (slug: string) => ALL_SETS.find((s) => s.slug === slug);

function saveStatusLabel(status: SaveStatus, loadError: string | null): string {
  if (loadError && status.state !== 'saved') return 'Temporary session (storage unavailable)';
  if (status.state === 'saving') return 'Saving…';
  if (status.state === 'saved') return 'Saved locally';
  if (status.state === 'error') return 'Save failed — export a backup';
  return 'Ready';
}

function renderPitchPreviewInner(pitch: Pitch): string {
  const combined = assemblePitch(pitch);
  if (!combined) return '';
  const { words, seconds } = estimateSpokenSeconds(combined);
  return `<h3>Your pitch, assembled</h3><div class="card">${esc(combined)}</div><p class="meta">${words} ${
    words === 1 ? 'word' : 'words'
  } · ~${seconds}s spoken aloud</p>`;
}

async function init(el: HTMLElement) {
  let ws: Workspace;
  let storageLoadError: string | null = null;
  try {
    ws = await loadWorkspace();
  } catch (err) {
    ws = emptyWorkspace();
    storageLoadError =
      err instanceof Error && err.message
        ? err.message
        : 'Browser local storage (IndexedDB) is unavailable or blocked.';
  }

  let view: View = 'packs';
  let editingPackId: string | null = null;
  let editingStoryId: string | null = null;
  let bannerDismissed = false;
  let importCandidate: Workspace | null = null;
  let wipeConfirmPending = false;
  let saveStatus: SaveStatus = getSaveStatus();

  if (!storageLoadError) void requestPersistence();

  const save = () => scheduleSave(ws);
  const packById = (id: string) => ws.packs.find((p) => p.id === id);
  const storyById = (id: string) => ws.stories.find((s) => s.id === id);

  // ---------- toasts ----------
  const toastHost = document.createElement('div');
  toastHost.id = 'prep-toasts';
  toastHost.setAttribute('role', 'status');
  toastHost.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastHost);
  function toast(message: string, opts: { undo?: () => void; ms?: number; alert?: boolean } = {}) {
    const node = document.createElement('div');
    node.className = opts.alert ? 'prep-toast prep-toast-error' : 'prep-toast';
    if (opts.alert) node.setAttribute('role', 'alert');
    const span = document.createElement('span');
    span.textContent = message;
    node.appendChild(span);
    let timer: ReturnType<typeof setTimeout>;
    const dismiss = () => {
      clearTimeout(timer);
      node.remove();
    };
    if (opts.undo) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Undo';
      btn.addEventListener('click', () => {
        opts.undo?.();
        dismiss();
      });
      node.appendChild(btn);
    }
    toastHost.appendChild(node);
    timer = setTimeout(dismiss, opts.ms ?? (opts.undo ? 30_000 : 5000));
  }

  function withUndo(message: string, mutate: () => void) {
    const snapshot = structuredClone(ws);
    mutate();
    save();
    render();
    toast(message, {
      undo: () => {
        ws = snapshot;
        save();
        render();
      },
    });
  }

  function storageAlertBanner(): string {
    if (storageLoadError) {
      return `<div class="banner banner-error" role="alert"><span><strong>Local storage unavailable:</strong> ${esc(
        storageLoadError,
      )} You can still use this temporary session — export a JSON backup or Markdown brief before closing this tab.</span>
      <button class="btn small primary" data-action="retry-storage">Retry storage</button>
      <button class="btn small" data-action="export-backup">Export backup (JSON)</button></div>`;
    }
    if (saveStatus.state === 'error') {
      return `<div class="banner banner-error" role="alert"><span><strong>Could not save changes locally:</strong> ${esc(
        saveStatus.error || 'Browser storage write failed.',
      )} Export a JSON backup so you don’t lose your work.</span>
      <button class="btn small primary" data-action="retry-save">Retry save</button>
      <button class="btn small" data-action="export-backup">Export backup (JSON)</button></div>`;
    }
    return '';
  }

  function updatePersistenceUi() {
    const statusEl = el.querySelector<HTMLElement>('#save-status');
    if (statusEl) statusEl.textContent = saveStatusLabel(saveStatus, storageLoadError);
    const alertHost = el.querySelector<HTMLElement>('#storage-alert-host');
    if (alertHost) alertHost.innerHTML = storageAlertBanner();
  }

  onSaveStatus((next) => {
    const prevWasError = saveStatus.state === 'error';
    saveStatus = next;
    if (next.state === 'saved') storageLoadError = null;
    updatePersistenceUi();
    if (next.state === 'error' && !prevWasError) {
      toast(`Could not save locally: ${next.error || 'storage error'}. Export a JSON backup.`, {
        alert: true,
        ms: 8000,
      });
    }
  });

  // ---------- downloads / print ----------
  function downloadText(filename: string, text: string, type: string) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  function openPrint(html: string) {
    const win = window.open('', '_blank');
    if (!win) {
      toast('Pop-up blocked — allow pop-ups to print.');
      return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  }
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'interview';

  // ---------- pack creation ----------
  function createPack(setSlug: string): Pack {
    const set = setBySlug(setSlug) ?? GENERAL_SET;
    const now = new Date().toISOString();
    const pack: Pack = {
      id: newId(),
      roleTitle: set.slug === 'general' ? '' : set.roleName,
      company: '',
      type: 'hiring-manager',
      dateTime: '',
      location: '',
      questions: set.questions.map((question) => ({ question, notes: '' })),
      asks: set.asks.map((question) => ({ question, notes: '' })),
      pitchOverride: '',
      researchNotes: '',
      debrief: '',
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    ws.packs.unshift(pack);
    return pack;
  }

  // ---------- rendering ----------
  function backupBanner(): string {
    if (bannerDismissed) return '';
    const hasData = ws.packs.length > 0 || ws.stories.length > 0;
    if (!hasData) return '';
    const last = ws.lastBackupAt ? new Date(ws.lastBackupAt).getTime() : 0;
    const stale = !last || Date.now() - last > 30 * 24 * 3600 * 1000;
    if (!stale) return '';
    return `<div class="banner"><span>Your prep lives only in this browser. ${
      last ? 'Your last backup is over 30 days old.' : 'You have not exported a backup yet.'
    }</span><button class="btn small primary" data-action="goto-settings">Back up now</button>
    <button class="btn small" data-action="dismiss-banner">Later</button></div>`;
  }

  function render() {
    const tabs: { id: View; label: string }[] = [
      { id: 'packs', label: `Prep packs (${ws.packs.filter((p) => !p.archived).length})` },
      { id: 'stories', label: `Story bank (${ws.stories.length})` },
      { id: 'pitch', label: 'My pitch' },
      { id: 'settings', label: 'Backup & storage' },
    ];
    let body = '';
    if (view === 'packs') body = editingPackId && packById(editingPackId) ? packEditor(packById(editingPackId)!) : packList();
    else if (view === 'stories') body = storyView();
    else if (view === 'pitch') body = pitchView();
    else body = settingsView();

    el.innerHTML = `
      <div id="storage-alert-host">${storageAlertBanner()}</div>
      ${backupBanner()}
      <div class="tabs" role="tablist">${tabs
        .map((t) => `<button role="tab" aria-selected="${view === t.id}" data-action="tab" data-view="${t.id}">${t.label}</button>`)
        .join('')}</div>
      ${body}
      <p class="saved">Stored only in this browser, on this device. Nothing is uploaded. · <span id="save-status" aria-live="polite">${esc(saveStatusLabel(saveStatus, storageLoadError))}</span></p>`;
    if (view === 'settings') void fillStorageMeter();
  }

  function packList(): string {
    const active = ws.packs.filter((p) => !p.archived);
    const archived = ws.packs.filter((p) => p.archived);
    const item = (p: Pack) => `
      <div class="packitem">
        <div>
          <h3>${esc(p.roleTitle || 'Untitled interview')}${p.company ? ` <span class="meta">at ${esc(p.company)}</span>` : ''}</h3>
          <div class="meta">${esc(INTERVIEW_TYPE_LABELS[p.type])}${p.dateTime ? ` · ${esc(new Date(p.dateTime).toLocaleString())}` : ' · no date set'} · ${p.questions.length} questions</div>
        </div>
        <div class="actions">
          <button class="btn small primary" data-action="open-pack" data-id="${p.id}">Open prep pack</button>
          <button class="btn small" data-action="delete-pack" data-id="${p.id}">Delete</button>
        </div>
      </div>`;
    return `
      <h2>Your prep packs</h2>
      <p class="hint">One pack per interview. Start from a role's question set — it pre-fills the likely questions and the questions to ask.</p>
      <div class="actions">
        ${ALL_SETS.map((s) => `<button class="btn" data-action="new-pack" data-set="${s.slug}">New: ${esc(s.roleName)}</button>`).join('')}
      </div>
      ${active.length ? active.map(item).join('') : '<p class="hint">No prep packs yet. Create your first one above.</p>'}
      ${archived.length ? `<h3>Archived</h3>${archived.map(item).join('')}` : ''}`;
  }

  function questionRows(pack: Pack): string {
    return pack.questions
      .map(
        (q, i) => `
      <div class="qrow">
        <div class="qhead"><strong>${i + 1}. ${esc(q.question)}</strong>
          <button class="btn small danger" data-action="remove-question" data-i="${i}">Remove</button></div>
        <label>Your answer notes</label>
        <textarea data-bind="question-notes" data-i="${i}" placeholder="Draft your answer here, in your own words">${esc(q.notes)}</textarea>
        <label>Story to use</label>
        <select data-bind="question-story" data-i="${i}">
          <option value="">— none —</option>
          ${ws.stories.map((s) => `<option value="${s.id}" ${q.storyId === s.id ? 'selected' : ''}>${esc(s.title)}</option>`).join('')}
        </select>
      </div>`,
      )
      .join('');
  }

  function askRows(pack: Pack): string {
    return pack.asks
      .map(
        (a, i) => `
      <div class="qrow">
        <div class="qhead"><strong>${esc(a.question)}</strong>
          <button class="btn small danger" data-action="remove-ask" data-i="${i}">Remove</button></div>
        <label>What you want to learn / notes</label>
        <textarea data-bind="ask-notes" data-i="${i}">${esc(a.notes)}</textarea>
      </div>`,
      )
      .join('');
  }

  function packEditor(pack: Pack): string {
    return `
      <button class="btn small" data-action="back-packs">← All prep packs</button>
      <h2 id="pack-editor-heading">${esc(formatPackHeading(pack))}</h2>
      <div class="row">
        <div><label>Role title</label><input type="text" data-bind="roleTitle" value="${esc(pack.roleTitle)}" placeholder="e.g. Staff Nurse"></div>
        <div><label>Company / organization</label><input type="text" data-bind="company" value="${esc(pack.company)}"></div>
      </div>
      <div class="row">
        <div><label>Interview type</label>
          <select data-bind="type">${(Object.keys(INTERVIEW_TYPE_LABELS) as InterviewType[])
            .map((t) => `<option value="${t}" ${pack.type === t ? 'selected' : ''}>${INTERVIEW_TYPE_LABELS[t]}</option>`)
            .join('')}</select></div>
        <div><label>Date and time</label><input type="datetime-local" data-bind="dateTime" value="${esc(pack.dateTime)}"></div>
      </div>
      <label>Location or video link</label>
      <input type="text" data-bind="location" value="${esc(pack.location)}">
      <h3>Your pitch for this interview</h3>
      <p class="hint">Leave blank to use your default pitch from the “My pitch” tab.</p>
      <textarea class="tall" data-bind="pitchOverride" placeholder="Your 'tell me about yourself' answer for this interview">${esc(pack.pitchOverride)}</textarea>
      <h3>Likely questions</h3>
      ${questionRows(pack)}
      <div class="actions">
        <input type="text" id="custom-question" placeholder="Add your own question" style="flex:1;min-width:200px">
        <button class="btn" data-action="add-question">Add question</button>
      </div>
      <h3>Questions you will ask</h3>
      ${askRows(pack)}
      <div class="actions">
        <input type="text" id="custom-ask" placeholder="Add your own question to ask" style="flex:1;min-width:200px">
        <button class="btn" data-action="add-ask">Add question to ask</button>
      </div>
      <h3>Research notes</h3>
      <p class="hint">Paste the job posting, the recruiter's email, your company research. Paste-in only — this app fetches nothing.</p>
      <textarea class="tall" data-bind="researchNotes">${esc(pack.researchNotes)}</textarea>
      <h3>AI handoff</h3>
      <p class="hint">Copies a prep pack to your clipboard and opens your AI with a short instruction. Paste with Ctrl/Cmd+V. The AI tab never receives your data from us — you paste it yourself.</p>
      <div class="actions">
        <button class="btn" data-action="handoff" data-task="mock" data-target="chatgpt">Mock prep — ChatGPT</button>
        <button class="btn" data-action="handoff" data-task="mock" data-target="claude">Mock prep — Claude</button>
        <button class="btn" data-action="handoff" data-task="polish" data-target="chatgpt">Polish stories — ChatGPT</button>
        <button class="btn" data-action="handoff" data-task="polish" data-target="claude">Polish stories — Claude</button>
        <button class="btn" data-action="handoff" data-task="gap" data-target="chatgpt">Gap check — ChatGPT</button>
        <button class="btn" data-action="handoff" data-task="gap" data-target="claude">Gap check — Claude</button>
      </div>
      <h3>Export</h3>
      <div class="actions">
        <button class="btn primary" data-action="export-brief">Download brief (Markdown)</button>
        <button class="btn" data-action="print-brief">Print brief</button>
        <button class="btn" data-action="print-checklist">Print checklist</button>
        <button class="btn" data-action="export-ics" ${pack.dateTime ? '' : 'disabled title="Set a date first"'}>Add to calendar (.ics)</button>
      </div>
      <h3>After the interview</h3>
      <label>Debrief — what was asked, how it went, follow-ups</label>
      <textarea class="tall" data-bind="debrief">${esc(pack.debrief)}</textarea>
      <div class="actions">
        <button class="btn" data-action="toggle-archive">${pack.archived ? 'Unarchive pack' : 'Archive pack'}</button>
        <button class="btn danger" data-action="delete-pack" data-id="${pack.id}">Delete pack</button>
      </div>`;
  }

  function storyView(): string {
    const editing = editingStoryId ? storyById(editingStoryId) : undefined;
    const list = ws.stories
      .map(
        (s) => `
      <div class="storyitem">
        <div><h3>${esc(s.title || 'Untitled story')}</h3>
        <div class="meta">${s.tags.map(esc).join(' · ') || 'No tags'}</div></div>
        <div class="actions">
          <button class="btn small primary" data-action="open-story" data-id="${s.id}">Edit</button>
          <button class="btn small" data-action="delete-story" data-id="${s.id}">Delete</button>
        </div>
      </div>`,
      )
      .join('');
    const form = editing
      ? `
      <div class="card">
        <label>Story title</label>
        <input type="text" data-story="title" value="${esc(editing.title)}" placeholder="e.g. The release that broke on a Friday">
        <label>Situation</label><textarea data-story="situation">${esc(editing.situation)}</textarea>
        <label>Task</label><textarea data-story="task">${esc(editing.task)}</textarea>
        <label>Action</label><textarea data-story="action">${esc(editing.action)}</textarea>
        <label>Result</label><textarea data-story="result">${esc(editing.result)}</textarea>
        <label>Tags (comma-separated: leadership, conflict, failure, teamwork…)</label>
        <input type="text" data-story="tags" value="${esc(editing.tags.join(', '))}">
        <div class="actions"><button class="btn" data-action="close-story">Done</button></div>
      </div>`
      : '';
    return `
      <h2>Your STAR story bank</h2>
      <p class="hint">Stories are your career capital: write each one once, attach it to any interview question in any pack. Structure: Situation, Task, Action, Result.</p>
      <div class="actions"><button class="btn primary" data-action="new-story">New story</button></div>
      ${form}
      ${list || '<p class="hint">No stories yet. Your first story is the hardest — start with a project you are proud of.</p>'}`;
  }

  function pitchView(): string {
    return `
      <h2>Your “tell me about yourself” pitch</h2>
      <p class="hint">Present, then past, then future: where you are now, the path that got you here, and why this role is the next step. Aim for about a minute spoken aloud.</p>
      <label>Present — what you do now</label>
      <textarea data-pitch="present" placeholder="I'm currently a …">${esc(ws.pitch.present)}</textarea>
      <label>Past — how you got here</label>
      <textarea data-pitch="past" placeholder="Before that I …">${esc(ws.pitch.past)}</textarea>
      <label>Future — why this role, why now</label>
      <textarea data-pitch="future" placeholder="What I'm looking for next is …">${esc(ws.pitch.future)}</textarea>
      <div id="pitch-preview-region">${renderPitchPreviewInner(ws.pitch)}</div>`;
  }

  function settingsView(): string {
    const last = ws.lastBackupAt ? new Date(ws.lastBackupAt).toLocaleString() : 'never';
    return `
      <h2>Backup &amp; storage</h2>
      <div class="card">
        <h3>Storage on this device</h3>
        <div class="meter"><div id="storage-fill" style="width:0%"></div></div>
        <p class="meta" id="storage-text">Measuring…</p>
        <p class="hint">Data lives in this browser's local storage (IndexedDB). Clearing browser data for this site would erase it — export a backup first.</p>
      </div>
      <div class="card">
        <h3>Backup</h3>
        <p class="meta">Last backup: ${esc(last)}</p>
        <p class="hint">The backup file contains your job search — interviews, stories and notes. Store it somewhere private.</p>
        <div class="actions">
          <button class="btn primary" data-action="export-backup">Export backup (JSON)</button>
          <label class="btn" style="margin:0;cursor:pointer">Import backup<input type="file" id="import-file" accept="application/json" hidden></label>
        </div>
        ${
          importCandidate
            ? `<div class="banner"><span>This backup is valid. Importing <strong>replaces</strong> everything currently stored on this device.</span>
               <button class="btn small primary" data-action="confirm-import">Replace my data</button>
               <button class="btn small" data-action="cancel-import">Cancel</button></div>`
            : ''
        }
      </div>
      <div class="card">
        <h3>Start over</h3>
        <p class="hint">Erase every pack, story and your pitch from this device. You get 30 seconds to undo.</p>
        ${
          wipeConfirmPending
            ? `<div class="banner banner-error" role="alert"><span>Erase all ${ws.packs.length} prep ${
                ws.packs.length === 1 ? 'pack' : 'packs'
              }, ${ws.stories.length} ${ws.stories.length === 1 ? 'story' : 'stories'}, and your pitch from this device?</span>
               <button class="btn small danger" data-action="confirm-wipe">Confirm erase everything</button>
               <button class="btn small" data-action="cancel-wipe">Cancel</button></div>`
            : `<button class="btn danger" data-action="wipe">Erase everything on this device</button>`
        }
      </div>`;
  }

  async function fillStorageMeter() {
    const est = await storageEstimate();
    const text = document.getElementById('storage-text');
    const fill = document.getElementById('storage-fill') as HTMLElement | null;
    if (!text) return;
    if (!est || !est.quota) {
      text.textContent = 'Storage estimate is not available in this browser.';
      return;
    }
    const mb = (n: number) => `${(n / 1_000_000).toFixed(2)} MB`;
    text.textContent = `Using ${mb(est.usage)} of about ${mb(est.quota)} available to this site.`;
    if (fill) fill.style.width = `${Math.min(100, Math.max(1, (est.usage / est.quota) * 100))}%`;
  }

  // ---------- events ----------
  el.addEventListener('click', (ev) => {
    const target = (ev.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const pack = editingPackId ? packById(editingPackId) : undefined;

    switch (action) {
      case 'tab': {
        const nextView = target.dataset.view as View;
        if (nextView === 'packs' && view === 'packs') editingPackId = null;
        view = nextView;
        wipeConfirmPending = false;
        render();
        break;
      }
      case 'retry-storage': {
        void loadWorkspace()
          .then((loaded) => {
            const isEmpty = ws.packs.length === 0 && ws.stories.length === 0 && !assemblePitch(ws.pitch);
            if (isEmpty) {
              ws = loaded;
            } else {
              save();
            }
            storageLoadError = null;
            toast('Local browser storage connected.');
            render();
          })
          .catch((err: unknown) => {
            storageLoadError =
              err instanceof Error && err.message
                ? err.message
                : 'Browser local storage (IndexedDB) is still unavailable.';
            toast(`Storage still unavailable: ${storageLoadError}`, { alert: true });
            updatePersistenceUi();
          });
        break;
      }
      case 'retry-save': {
        save();
        void flushSave()
          .then(() => {
            storageLoadError = null;
            toast('Saved locally.');
            updatePersistenceUi();
          })
          .catch(() => {
            // Save error status and alert banner are already updated via onSaveStatus.
          });
        break;
      }
      case 'dismiss-banner':
        bannerDismissed = true;
        render();
        break;
      case 'goto-settings':
        view = 'settings';
        render();
        break;
      case 'new-pack': {
        const p = createPack(target.dataset.set || 'general');
        editingPackId = p.id;
        save();
        render();
        break;
      }
      case 'open-pack':
        editingPackId = target.dataset.id!;
        view = 'packs';
        render();
        break;
      case 'back-packs':
        editingPackId = null;
        render();
        break;
      case 'delete-pack': {
        const id = target.dataset.id!;
        const victim = packById(id);
        if (!victim) break;
        if (editingPackId === id) editingPackId = null;
        withUndo(`Deleted prep pack “${victim.roleTitle || 'Untitled'}”.`, () => {
          ws.packs = ws.packs.filter((p) => p.id !== id);
        });
        break;
      }
      case 'toggle-archive':
        if (pack) {
          pack.archived = !pack.archived;
          pack.updatedAt = new Date().toISOString();
          save();
          toast(pack.archived ? 'Pack archived.' : 'Pack unarchived.');
          editingPackId = null;
          render();
        }
        break;
      case 'add-question': {
        const input = document.getElementById('custom-question') as HTMLInputElement | null;
        if (pack && input && input.value.trim()) {
          pack.questions.push({ question: input.value.trim(), notes: '' });
          pack.updatedAt = new Date().toISOString();
          save();
          render();
        }
        break;
      }
      case 'remove-question': {
        const idx = Number(target.dataset.i);
        if (pack && Number.isInteger(idx) && idx >= 0 && idx < pack.questions.length) {
          const removed = pack.questions[idx];
          const label = removed.question.length > 48 ? `${removed.question.slice(0, 48)}…` : removed.question;
          withUndo(`Removed question “${label}”.`, () => {
            const current = packById(pack.id);
            if (current) {
              current.questions.splice(idx, 1);
              current.updatedAt = new Date().toISOString();
            }
          });
        }
        break;
      }
      case 'add-ask': {
        const input = document.getElementById('custom-ask') as HTMLInputElement | null;
        if (pack && input && input.value.trim()) {
          pack.asks.push({ question: input.value.trim(), notes: '' });
          pack.updatedAt = new Date().toISOString();
          save();
          render();
        }
        break;
      }
      case 'remove-ask': {
        const idx = Number(target.dataset.i);
        if (pack && Number.isInteger(idx) && idx >= 0 && idx < pack.asks.length) {
          const removed = pack.asks[idx];
          const label = removed.question.length > 48 ? `${removed.question.slice(0, 48)}…` : removed.question;
          withUndo(`Removed question to ask “${label}”.`, () => {
            const current = packById(pack.id);
            if (current) {
              current.asks.splice(idx, 1);
              current.updatedAt = new Date().toISOString();
            }
          });
        }
        break;
      }
      case 'new-story': {
        const now = new Date().toISOString();
        const story: Story = {
          id: newId(), title: '', situation: '', task: '', action: '', result: '', tags: [],
          createdAt: now, updatedAt: now,
        };
        ws.stories.unshift(story);
        editingStoryId = story.id;
        save();
        render();
        break;
      }
      case 'open-story':
        editingStoryId = target.dataset.id!;
        render();
        break;
      case 'close-story':
        editingStoryId = null;
        render();
        break;
      case 'delete-story': {
        const id = target.dataset.id!;
        const victim = storyById(id);
        if (!victim) break;
        if (editingStoryId === id) editingStoryId = null;
        withUndo(`Deleted story “${victim.title || 'Untitled'}”.`, () => {
          ws.stories = ws.stories.filter((s) => s.id !== id);
          for (const p of ws.packs) {
            for (const q of p.questions) if (q.storyId === id) delete q.storyId;
          }
        });
        break;
      }
      case 'handoff': {
        if (!pack) break;
        const task = target.dataset.task as HandoffTask;
        const targetAi = target.dataset.target as 'chatgpt' | 'claude';
        void runHandoff(task, targetAi, pack, ws.stories, ws.pitch).then((res) => {
          toast(
            res.copied
              ? 'Prep pack copied. Paste it into the AI tab (Ctrl/Cmd+V).'
              : 'Clipboard blocked — the AI tab is open; copy your brief from Export instead.',
          );
        });
        break;
      }
      case 'export-brief':
        if (pack) {
          downloadText(`${slugify(pack.roleTitle)}-prep-brief.md`, buildBriefMarkdown(pack, ws.stories, ws.pitch), 'text/markdown');
          toast('Brief downloaded.');
        }
        break;
      case 'print-brief':
        if (pack) openPrint(buildBriefPrintHtml(pack, ws.stories, ws.pitch));
        break;
      case 'print-checklist':
        if (pack) openPrint(buildChecklistPrintHtml(pack));
        break;
      case 'export-ics': {
        if (!pack) break;
        const ics = buildPackICS(pack);
        if (ics) {
          downloadICS(`${slugify(pack.roleTitle)}-interview.ics`, ics);
          toast('Calendar file downloaded.');
        } else {
          toast('Set the interview date first.');
        }
        break;
      }
      case 'export-backup': {
        ws.lastBackupAt = new Date().toISOString();
        save();
        downloadText('b4wemeet-prep-backup.json', serializeBackup(ws), 'application/json');
        toast('Backup downloaded. Store it somewhere private — it contains your job search.');
        render();
        break;
      }
      case 'confirm-import':
        if (importCandidate) {
          ws = importCandidate;
          importCandidate = null;
          editingPackId = null;
          editingStoryId = null;
          save();
          void flushSave()
            .then(() => {
              toast('Backup restored on this device.');
            })
            .catch(() => {
              // Error banner and toast are surfaced via onSaveStatus.
            });
          render();
        }
        break;
      case 'cancel-import':
        importCandidate = null;
        render();
        break;
      case 'wipe':
        wipeConfirmPending = true;
        render();
        break;
      case 'cancel-wipe':
        wipeConfirmPending = false;
        render();
        break;
      case 'confirm-wipe':
        wipeConfirmPending = false;
        withUndo('Everything on this device was erased.', () => {
          ws = emptyWorkspace();
          editingPackId = null;
          editingStoryId = null;
        });
        break;
    }
  });

  el.addEventListener('change', (ev) => {
    const target = ev.target as HTMLElement;
    if (target.id === 'import-file') {
      const input = target as HTMLInputElement;
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then((text) => {
        const result = validateBackupText(text);
        if (result.ok) {
          importCandidate = result.workspace;
          render();
        } else {
          // §4.3 invariant: a failed import never touches current data.
          toast(`Import failed — your current data is untouched. ${result.error}`, { alert: true });
        }
        input.value = '';
      });
      return;
    }
    handleBind(target);
  });
  el.addEventListener('input', (ev) => handleBind(ev.target as HTMLElement));

  function handleBind(target: HTMLElement) {
    const pack = editingPackId ? packById(editingPackId) : undefined;
    const bind = target.getAttribute('data-bind');
    const storyField = target.getAttribute('data-story');
    const pitchField = target.getAttribute('data-pitch');
    const value = (target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value ?? '';
    if (bind && pack) {
      const i = Number(target.getAttribute('data-i'));
      if (bind === 'question-notes') pack.questions[i].notes = value;
      else if (bind === 'question-story') {
        if (value) pack.questions[i].storyId = value;
        else delete pack.questions[i].storyId;
      } else if (bind === 'ask-notes') pack.asks[i].notes = value;
      else if (bind === 'type') pack.type = value as InterviewType;
      else (pack as unknown as Record<string, string>)[bind] = value;
      pack.updatedAt = new Date().toISOString();
      if (bind === 'dateTime') {
        const icsBtn = el.querySelector<HTMLButtonElement>('[data-action="export-ics"]');
        if (icsBtn) {
          const hasDate = Boolean(pack.dateTime.trim());
          icsBtn.disabled = !hasDate;
          if (hasDate) icsBtn.removeAttribute('title');
          else icsBtn.title = 'Set a date first';
        }
      } else if (bind === 'roleTitle' || bind === 'company') {
        const heading = el.querySelector<HTMLElement>('#pack-editor-heading');
        if (heading) heading.textContent = formatPackHeading(pack);
      }
      save();
    } else if (storyField && editingStoryId) {
      const story = storyById(editingStoryId);
      if (story) {
        if (storyField === 'tags') story.tags = value.split(',').map((t) => t.trim()).filter(Boolean);
        else (story as unknown as Record<string, string>)[storyField] = value;
        story.updatedAt = new Date().toISOString();
        save();
      }
    } else if (pitchField) {
      (ws.pitch as unknown as Record<string, string>)[pitchField] = value;
      const preview = el.querySelector<HTMLElement>('#pitch-preview-region');
      if (preview) preview.innerHTML = renderPitchPreviewInner(ws.pitch);
      save();
    }
  }

  // beforeunload guard: never lose an in-flight edit (§4.3).
  window.addEventListener('beforeunload', (ev) => {
    if (isDirty()) {
      void flushSave().catch(() => {
        // Save error status is surfaced via onSaveStatus.
      });
      ev.preventDefault();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void flushSave().catch(() => {
        // Save error status is surfaced via onSaveStatus.
      });
    }
  });

  // Pre-load a pack from a content page (?role=nursing etc.).
  const roleParam = new URLSearchParams(window.location.search).get('role');
  if (roleParam && setBySlug(roleParam)) {
    const existing = ws.packs.find((p) => !p.archived && p.roleTitle === setBySlug(roleParam)!.roleName);
    if (!existing) {
      const p = createPack(roleParam);
      editingPackId = p.id;
      save();
    } else {
      editingPackId = existing.id;
    }
  }

  render();
}
