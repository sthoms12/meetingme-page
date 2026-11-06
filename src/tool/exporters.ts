// Pure export builders for a prep pack: the morning-of brief (Markdown) and
// the printable brief/checklist HTML. All output is a file or a print view —
// nothing is hosted anywhere (spec §2.3).

import { checklist } from '../data/general';
import { buildInterviewEventICS } from '../lib/ics';
import { INTERVIEW_TYPE_LABELS, type Pack, type Pitch, type Story } from './types';

export const pitchText = (pack: Pack, pitch: Pitch) => {
  if (pack.pitchOverride.trim()) return pack.pitchOverride.trim();
  return [pitch.present, pitch.past, pitch.future].map((s) => s.trim()).filter(Boolean).join(' ');
};

export function buildBriefMarkdown(pack: Pack, stories: Story[], pitch: Pitch): string {
  const storyById = new Map(stories.map((s) => [s.id, s]));
  const lines: string[] = [];
  lines.push(`# Interview prep: ${pack.roleTitle}${pack.company ? ` at ${pack.company}` : ''}`);
  lines.push('');
  lines.push(`- Type: ${INTERVIEW_TYPE_LABELS[pack.type]}`);
  if (pack.dateTime) lines.push(`- When: ${new Date(pack.dateTime).toLocaleString()}`);
  if (pack.location) lines.push(`- Where: ${pack.location}`);
  lines.push('');
  const pitchValue = pitchText(pack, pitch);
  if (pitchValue) {
    lines.push('## Tell me about yourself');
    lines.push('');
    lines.push(pitchValue);
    lines.push('');
  }
  if (pack.questions.length) {
    lines.push('## Likely questions and my prep');
    lines.push('');
    for (const q of pack.questions) {
      lines.push(`### ${q.question}`);
      if (q.notes.trim()) lines.push(`\n${q.notes.trim()}`);
      const story = q.storyId ? storyById.get(q.storyId) : undefined;
      if (story) {
        lines.push(`\n**Story: ${story.title}**`);
        if (story.situation) lines.push(`- Situation: ${story.situation}`);
        if (story.task) lines.push(`- Task: ${story.task}`);
        if (story.action) lines.push(`- Action: ${story.action}`);
        if (story.result) lines.push(`- Result: ${story.result}`);
      }
      lines.push('');
    }
  }
  if (pack.asks.length) {
    lines.push('## Questions I will ask');
    lines.push('');
    for (const a of pack.asks) {
      lines.push(`- ${a.question}${a.notes.trim() ? ` — ${a.notes.trim()}` : ''}`);
    }
    lines.push('');
  }
  if (pack.researchNotes.trim()) {
    lines.push('## Research notes');
    lines.push('');
    lines.push(pack.researchNotes.trim());
    lines.push('');
  }
  lines.push('---');
  lines.push('Prepared with B4WeMeet. Example answers in your prep are illustrations — say it in your own words.');
  return lines.join('\n');
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const paragraphs = (text: string) =>
  text.split(/\n{2,}/).map((p) => `<p>${esc(p.trim()).replace(/\n/g, '<br>')}</p>`).join('\n');

function printShell(title: string, body: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; max-width: 700px; margin: 2rem auto; padding: 0 1rem; line-height: 1.55; }
  h1 { font-size: 1.5rem; } h2 { font-size: 1.15rem; margin-top: 1.6rem; } h3 { font-size: 1rem; margin-bottom: 0.2rem; }
  ul { padding-left: 1.2rem; } .meta { color: #444; } .story { background: #f4f4f0; padding: 0.5rem 0.8rem; border-radius: 6px; }
  @media print { body { margin: 0 auto; } }
</style></head><body>${body}</body></html>`;
}

export function buildBriefPrintHtml(pack: Pack, stories: Story[], pitch: Pitch): string {
  const storyById = new Map(stories.map((s) => [s.id, s]));
  const parts: string[] = [];
  parts.push(`<h1>Interview prep: ${esc(pack.roleTitle)}${pack.company ? ` at ${esc(pack.company)}` : ''}</h1>`);
  parts.push(
    `<p class="meta">${esc(INTERVIEW_TYPE_LABELS[pack.type])}` +
      (pack.dateTime ? ` · ${esc(new Date(pack.dateTime).toLocaleString())}` : '') +
      (pack.location ? ` · ${esc(pack.location)}` : '') +
      `</p>`,
  );
  const pitchValue = pitchText(pack, pitch);
  if (pitchValue) parts.push(`<h2>Tell me about yourself</h2>${paragraphs(pitchValue)}`);
  if (pack.questions.length) {
    parts.push('<h2>Likely questions and my prep</h2>');
    for (const q of pack.questions) {
      parts.push(`<h3>${esc(q.question)}</h3>`);
      if (q.notes.trim()) parts.push(paragraphs(q.notes));
      const story = q.storyId ? storyById.get(q.storyId) : undefined;
      if (story) {
        parts.push(
          `<div class="story"><strong>Story: ${esc(story.title)}</strong><br>` +
            (story.situation ? `Situation: ${esc(story.situation)}<br>` : '') +
            (story.task ? `Task: ${esc(story.task)}<br>` : '') +
            (story.action ? `Action: ${esc(story.action)}<br>` : '') +
            (story.result ? `Result: ${esc(story.result)}` : '') +
            `</div>`,
        );
      }
    }
  }
  if (pack.asks.length) {
    parts.push('<h2>Questions I will ask</h2><ul>');
    for (const a of pack.asks) parts.push(`<li>${esc(a.question)}${a.notes.trim() ? ` — ${esc(a.notes.trim())}` : ''}</li>`);
    parts.push('</ul>');
  }
  if (pack.researchNotes.trim()) parts.push(`<h2>Research notes</h2>${paragraphs(pack.researchNotes)}`);
  return printShell(`Interview prep: ${pack.roleTitle}`, parts.join('\n'));
}

export function buildChecklistPrintHtml(pack: Pack): string {
  const parts: string[] = [];
  parts.push(`<h1>Interview checklist: ${esc(pack.roleTitle)}${pack.company ? ` at ${esc(pack.company)}` : ''}</h1>`);
  if (pack.dateTime) parts.push(`<p class="meta">${esc(new Date(pack.dateTime).toLocaleString())}${pack.location ? ` · ${esc(pack.location)}` : ''}</p>`);
  for (const phase of checklist) {
    parts.push(`<h2>${esc(phase.phase)}</h2><ul>`);
    for (const item of phase.items) parts.push(`<li>☐ ${esc(item)}</li>`);
    parts.push('</ul>');
  }
  return printShell(`Interview checklist: ${pack.roleTitle}`, parts.join('\n'));
}

/** ICS for the pack's interview — only when the user entered a date. */
export function buildPackICS(pack: Pack): string | null {
  if (!pack.dateTime) return null;
  const start = new Date(pack.dateTime);
  if (Number.isNaN(start.getTime())) return null;
  return buildInterviewEventICS({
    roleTitle: pack.roleTitle,
    company: pack.company,
    start,
    location: pack.location || undefined,
    notes: pack.researchNotes || undefined,
  });
}
