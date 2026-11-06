// Backup export / import for the Prep Pack workspace.
//
// The invariant (spec §4.3): import validates the ENTIRE file first and only
// returns a workspace when every check passes. The caller replaces current
// data only on { ok: true } — a failed import never modifies existing data.

import type { Pack, Pitch, Story, Workspace } from './types';
import { INTERVIEW_TYPE_LABELS } from './types';

export const BACKUP_KIND = 'b4wemeet-prep-backup';

export interface BackupFile {
  app: 'b4wemeet';
  kind: typeof BACKUP_KIND;
  version: 1;
  exportedAt: string;
  warning: string;
  data: Workspace;
}

export function buildBackup(ws: Workspace, now = new Date()): BackupFile {
  return {
    app: 'b4wemeet',
    kind: BACKUP_KIND,
    version: 1,
    exportedAt: now.toISOString(),
    warning:
      'This file contains your job search — interviews, stories and notes. Store it somewhere private.',
    data: ws,
  };
}

export const serializeBackup = (ws: Workspace) => JSON.stringify(buildBackup(ws), null, 2);

export type ValidationResult =
  | { ok: true; workspace: Workspace }
  | { ok: false; error: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === 'string';
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

function validateStory(v: unknown): Story | null {
  if (!isRecord(v)) return null;
  if (!isString(v.id) || !isString(v.title)) return null;
  for (const k of ['situation', 'task', 'action', 'result', 'createdAt', 'updatedAt'] as const) {
    if (!isString(v[k])) return null;
  }
  if (!isStringArray(v.tags)) return null;
  return v as unknown as Story;
}

function validatePack(v: unknown): Pack | null {
  if (!isRecord(v)) return null;
  if (!isString(v.id) || !isString(v.roleTitle) || !isString(v.company)) return null;
  if (!isString(v.type) || !(v.type in INTERVIEW_TYPE_LABELS)) return null;
  for (const k of ['dateTime', 'location', 'pitchOverride', 'researchNotes', 'debrief', 'createdAt', 'updatedAt'] as const) {
    if (!isString(v[k])) return null;
  }
  if (typeof v.archived !== 'boolean') return null;
  if (!Array.isArray(v.questions) || !Array.isArray(v.asks)) return null;
  for (const q of v.questions) {
    if (!isRecord(q) || !isString(q.question) || !isString(q.notes)) return null;
    if (q.storyId !== undefined && !isString(q.storyId)) return null;
  }
  for (const a of v.asks) {
    if (!isRecord(a) || !isString(a.question) || !isString(a.notes)) return null;
  }
  return v as unknown as Pack;
}

function validatePitch(v: unknown): Pitch | null {
  if (!isRecord(v)) return null;
  if (!isString(v.present) || !isString(v.past) || !isString(v.future)) return null;
  return v as unknown as Pitch;
}

/** Validate a parsed backup object. Pure — touches nothing. */
export function validateBackupData(parsed: unknown): ValidationResult {
  if (!isRecord(parsed)) return { ok: false, error: 'That file is not a B4WeMeet backup.' };
  if (parsed.app !== 'b4wemeet' || parsed.kind !== BACKUP_KIND) {
    return { ok: false, error: 'That file is not a B4WeMeet prep backup.' };
  }
  if (parsed.version !== 1) {
    return { ok: false, error: `Unsupported backup version: ${String(parsed.version)}` };
  }
  const data = parsed.data;
  if (!isRecord(data) || data.version !== 1) {
    return { ok: false, error: 'Backup data is missing or has an unsupported version.' };
  }
  if (!Array.isArray(data.stories) || !Array.isArray(data.packs)) {
    return { ok: false, error: 'Backup data is incomplete (stories/packs missing).' };
  }
  const stories: Story[] = [];
  for (const s of data.stories) {
    const story = validateStory(s);
    if (!story) return { ok: false, error: 'Backup contains an invalid story entry.' };
    stories.push(story);
  }
  const packs: Pack[] = [];
  for (const p of data.packs) {
    const pack = validatePack(p);
    if (!pack) return { ok: false, error: 'Backup contains an invalid prep pack entry.' };
    packs.push(pack);
  }
  const pitch = validatePitch(data.pitch);
  if (!pitch) return { ok: false, error: 'Backup contains an invalid pitch entry.' };
  if (data.lastBackupAt !== null && !isString(data.lastBackupAt)) {
    return { ok: false, error: 'Backup contains an invalid backup timestamp.' };
  }
  return {
    ok: true,
    workspace: { version: 1, stories, packs, pitch, lastBackupAt: data.lastBackupAt as string | null },
  };
}

/** Validate raw backup file text. Pure — touches nothing. */
export function validateBackupText(text: string): ValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  return validateBackupData(parsed);
}
