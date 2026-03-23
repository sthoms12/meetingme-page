export function downloadMeetingICS(profile: {
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
  const escapedBio = bio
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
  // Format ICS content
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MeetingMe//Professional Intro//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Introduction: ${fullName} (${jobTitle} @ ${company})`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `DESCRIPTION:Meeting preparation for ${fullName}.\\n\\nProfessional Bio: ${escapedBio}\\n\\nView Profile: ${url}`,
    `LOCATION:${url}`,
    'TRANSP:TRANSPARENT', // Don't block time as busy
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:MeetingMe Intro Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const icsString = icsLines.join('\r\n');
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