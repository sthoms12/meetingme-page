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
const sanitizeICSLineValue = (value: string) => value.replace(/[\r\n]+/g, '');

export interface IntroCardProfile {
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  url: string;
}

/**
 * Build an "intro card" ICS for a profile.
 *
 * This is deliberately NOT a meeting event: B4WeMeet does not know when the
 * recipient's actual meeting is, so inventing a start time (the previous
 * behaviour — now + 1 hour for 30 minutes) put a fake event on the
 * recipient's calendar. Instead the file carries a single VTODO — the form
 * calendar/task apps (Apple Reminders, Google Tasks, Outlook To Do,
 * Thunderbird) accept for a dateless note — holding the intro details and
 * the profile link, with no DTSTART/DTEND anywhere in the document.
 */
export function buildIntroCardICS(profile: IntroCardProfile) {
  const { fullName, jobTitle, company, bio, url } = profile;
  const escapedFullName = escapeICSText(fullName);
  const escapedUrl = escapeICSText(url);
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
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
    'END:VCALENDAR'
  ];
  return icsLines.join('\r\n');
}

/** @deprecated Use buildIntroCardICS — the export is an intro card, not a meeting event. */
export const buildMeetingICS = buildIntroCardICS;

export function downloadIntroCardICS(profile: IntroCardProfile) {
  const { fullName } = profile;
  const icsString = buildIntroCardICS(profile);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_Intro_Card.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}

/** @deprecated Use downloadIntroCardICS. */
export const downloadMeetingICS = downloadIntroCardICS;
