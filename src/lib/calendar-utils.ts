export function downloadMeetingICS(profile: {
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  url: string;
}) {
  const { fullName, jobTitle, company, bio, url } = profile;
  // Format ICS content
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MeetingMe//Professional Intro//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:Meeting with ${fullName} (${jobTitle} @ ${company})`,
    'DTSTART:20250101T090000Z', // Placeholder
    'DTEND:20250101T093000Z',   // Placeholder
    `DESCRIPTION:Introduction for ${fullName}. \n\nProfessional Bio: ${bio.replace(/\n/g, '\\n')} \n\nView Profile: ${url}`,
    `LOCATION:${url}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];
  const icsString = icsLines.join('\r\n');
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${fullName.replace(/\s+/g, '_')}_MeetingMe.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}