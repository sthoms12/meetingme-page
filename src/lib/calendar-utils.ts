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

export function buildMeetingICS(profile: {
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  url: string;
}) {
  const { fullName, jobTitle, company, bio, url } = profile;
  // Create dynamic dates for the placeholder event
  const now = new Date();
  const start = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour from now
  const end = new Date(start.getTime() + 1000 * 60 * 30); // 30 mins duration
  const formatICSDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const escapedFullName = escapeICSText(fullName);
  const escapedUrl = escapeICSText(url);
  // Format ICS content
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//B4WeMeet//Professional Intro//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Introduction: ${escapedFullName} (${escapeICSText(jobTitle)} @ ${escapeICSText(company)})`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `DESCRIPTION:Meeting preparation for ${escapedFullName}.\\n\\nProfessional Bio: ${escapeICSText(bio)}\\n\\nView Profile: ${escapedUrl}`,
    `LOCATION:${escapedUrl}`,
    'TRANSP:TRANSPARENT', // Don't block time as busy
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:B4WeMeet Intro Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  return icsLines.join('\r\n');
}

export function downloadMeetingICS(profile: {
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  url: string;
}) {
  const { fullName } = profile;
  const icsString = buildMeetingICS(profile);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_Introduction.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
