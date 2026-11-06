/**
 * ICS (RFC 5545) helpers.
 *
 * escapeICSText and the dateless-VTODO intro card are ported from the old
 * app's src/lib/calendar-utils.ts (PR #26) — the escaping behaviour and its
 * tests carry over unchanged. buildInterviewEventICS is new for the pivot:
 * the Prep Pack tool knows the user's real interview date because the user
 * entered it, so the export is a real VEVENT built from that date — never an
 * invented one.
 */

/**
 * Escape a value for an ICS TEXT property per RFC 5545: backslashes,
 * semicolons and commas are backslash-escaped, and any CR/LF sequence is
 * converted to the literal "\n" escape. Raw line breaks must never reach
 * the document — they would let a stored field inject new properties or
 * whole components (e.g. a VALARM) into the downloaded calendar file.
 */
export function escapeICSText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/** Strip anything that could break out of a single ICS content line. */
export const sanitizeICSLineValue = (value: string) => value.replace(/[\r\n]+/g, '');

/** Fold a content line at 75 octets per RFC 5545 §3.1 (continuation = CRLF + space). */
export function foldICSLine(line: string) {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const chunks: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of line) {
    const chBytes = new TextEncoder().encode(ch).length;
    // Continuation lines carry a leading space, so budget 74 after the first.
    const limit = chunks.length === 0 ? 75 : 74;
    if (currentBytes + chBytes > limit) {
      chunks.push(current);
      current = '';
      currentBytes = 0;
    }
    current += ch;
    currentBytes += chBytes;
  }
  if (current) chunks.push(current);
  return chunks.join('\r\n ');
}

const formatICSDateTime = (date: Date) =>
  date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

const buildDocument = (component: string[]) =>
  [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//B4WeMeet//Interview Prep//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...component.flatMap((line) => foldICSLine(line).split('\r\n')),
    'END:VCALENDAR',
  ].join('\r\n');

export interface InterviewEvent {
  /** Role title, e.g. "Staff Nurse". */
  roleTitle: string;
  company: string;
  /** Interview start, as entered by the user. */
  start: Date;
  /** Duration in minutes; defaults to 60. */
  durationMinutes?: number;
  location?: string;
  /** Free-text notes that ride along in the event description. */
  notes?: string;
}

/** A real calendar event for the user's interview, built only from data they entered. */
export function buildInterviewEventICS(event: InterviewEvent) {
  const end = new Date(event.start.getTime() + (event.durationMinutes ?? 60) * 60_000);
  const uid = `b4wemeet-interview-${event.start.getTime()}@b4wemeet.app`;
  const summary = `Interview: ${event.roleTitle}${event.company ? ` at ${event.company}` : ''}`;
  const descriptionParts = [
    `Interview for ${event.roleTitle}${event.company ? ` at ${event.company}` : ''}.`,
    event.notes ? `\nPrep notes:\n${event.notes}` : '',
    '\nPrepared with B4WeMeet — prep pack stays on your device.',
  ];
  return buildDocument([
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatICSDateTime(new Date())}`,
    `DTSTART:${formatICSDateTime(event.start)}`,
    `DTEND:${formatICSDateTime(end)}`,
    `SUMMARY:${escapeICSText(summary)}`,
    `DESCRIPTION:${escapeICSText(descriptionParts.join(''))}`,
    ...(event.location ? [`LOCATION:${escapeICSText(event.location)}`] : []),
    'STATUS:CONFIRMED',
    'END:VEVENT',
  ]);
}

export interface IntroCardProfile {
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  url: string;
}

/**
 * Build an "intro card" ICS (ported from the old app).
 *
 * This is deliberately NOT a meeting event: it carries a single VTODO — the
 * form calendar/task apps accept for a dateless note — with no DTSTART/DTEND
 * anywhere in the document.
 */
export function buildIntroCardICS(profile: IntroCardProfile) {
  const { fullName, jobTitle, company, bio, url } = profile;
  const escapedFullName = escapeICSText(fullName);
  const escapedUrl = escapeICSText(url);
  const dtStamp = formatICSDateTime(new Date());
  const uid = `b4wemeet-intro-${sanitizeICSLineValue(fullName).replace(/\s+/g, '-').toLowerCase()}@b4wemeet.app`;
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//B4WeMeet//Professional Intro//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTODO',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:Intro card: ${escapedFullName} (${escapeICSText(jobTitle)} @ ${escapeICSText(company)})`,
    `DESCRIPTION:Meeting preparation for ${escapedFullName}.\\n\\nProfessional Bio: ${escapeICSText(bio)}\\n\\nView Profile: ${escapedUrl}`,
    `LOCATION:${escapedUrl}`,
    `URL:${sanitizeICSLineValue(url)}`,
    'STATUS:NEEDS-ACTION',
    'END:VTODO',
    'END:VCALENDAR',
  ];
  return icsLines.join('\r\n');
}

/** Trigger a browser download of an ICS string. Browser-only helper. */
export function downloadICS(filename: string, icsString: string) {
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
