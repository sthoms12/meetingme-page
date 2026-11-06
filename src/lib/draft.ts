/**
 * Create-form draft persistence.
 *
 * The create form is long; losing it to a refresh, a navigation, or a crash
 * loses real work. Drafts are kept in localStorage, but only ever the
 * non-sensitive fields: the visitor password is a credential and the photo
 * is a (potentially large) data URL, so both are structurally excluded
 * here — they can never be written to storage, even by accident.
 */

export const CREATE_DRAFT_KEY = 'b4wemeet:create-draft:v1';

export const DRAFT_EXCLUDED_FIELDS: ReadonlySet<string> = new Set(['password', 'profilePhoto']);

export function serializeCreateDraft(values: Record<string, unknown>): string {
  const draft: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (DRAFT_EXCLUDED_FIELDS.has(key)) continue;
    draft[key] = value;
  }
  return JSON.stringify(draft);
}

export function parseCreateDraft(raw: string | null): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const draft: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
      // Defence in depth: even a hand-edited stored draft cannot smuggle an
      // excluded field back into the form.
      if (DRAFT_EXCLUDED_FIELDS.has(key)) continue;
      if (typeof value === 'string') draft[key] = value;
    }
    return Object.values(draft).some((value) => value.trim() !== '') ? draft : null;
  } catch {
    return null;
  }
}
