// Shared copy used by both the .astro pages and the markdown mirrors
// (src/lib/mirrors.ts) so the two can never drift apart.

import type { FaqEntry } from '../data/types';

export const LANDING_FAQS: FaqEntry[] = [
  {
    q: 'Is B4WeMeet really private? Where does my prep go?',
    a: 'Everything you prepare — your packs, stories, pitch and notes — is stored only in your browser, on your device (IndexedDB). There are no accounts and no uploads: our servers never see your job search. You can export a backup file any time and keep it wherever you like.',
  },
  {
    q: 'Does B4WeMeet use AI?',
    a: 'Only yours. The builder can copy a prep pack to your clipboard and open ChatGPT or Claude with a short coaching prompt, so you can run a mock interview or polish your stories with the AI you already use. B4WeMeet itself runs no model and holds no AI keys.',
  },
  {
    q: 'What does it cost?',
    a: 'Nothing. The guides, the question libraries and the prep-pack builder are free.',
  },
  {
    q: 'What happened to the old B4WeMeet intro pages?',
    a: 'Hosted intro pages were retired in November 2026 when B4WeMeet became a private, on-device interview prep tool. Nothing is hosted here any more — what you prepare lives on your device and leaves only as files you choose to send.',
  },
  {
    q: 'Can I use this while I am currently employed?',
    a: "That is exactly who it is built for. Because nothing is uploaded and there is no account, there is no profile, feed or notification that could reveal your job search. Export a backup somewhere private and your prep exists only where you put it.",
  },
];

export const PRIVACY_FAQS: FaqEntry[] = [
  {
    q: 'Where is my interview prep stored?',
    a: 'Only in your browser, on your device, in local storage (IndexedDB). Your prep packs, STAR stories, pitch and notes never leave your device unless you export a file or copy a handoff pack into your own AI chat yourself.',
  },
  {
    q: 'Do I need an account?',
    a: 'No. There are no accounts, no sign-ups, no passwords and no user database. The tool simply works, and your data is tied to this browser on this device.',
  },
  {
    q: 'What happens if I clear my browser data?',
    a: 'Your prep would be erased, because it lives in the browser. That is why the builder nags you to export a backup: the backup is a JSON file you keep wherever you trust — and it contains your job search, so store it somewhere private.',
  },
  {
    q: 'Does B4WeMeet use AI on my data?',
    a: "No. B4WeMeet runs no AI and makes no AI calls. The optional handoff copies your pack to your clipboard and opens ChatGPT or Claude with a short coaching prompt in the address bar — the pack itself is pasted by you, into your own account, under that service's terms.",
  },
  {
    q: 'What analytics do you run?',
    a: "This site uses Dataflare, an analytics tool we self-host in our own Cloudflare account. It is cookieless — it sets no cookies and stores nothing on your device. It records pageviews, the referring site, and basic device and browser information so we can understand which content is useful. Analytics data is kept for 90 days and is never sold or shared. It cannot see your prep: the tool's data never leaves your browser, and the analytics script only sees that a page was viewed.",
  },
  {
    q: 'What happened to the old hosted intro pages?',
    a: 'Hosted intro pages were retired in November 2026 when B4WeMeet became a private, on-device tool. The old pages are gone; nothing you create here is published at a B4WeMeet address.',
  },
];

export const INTERVIEW_PREP_TEMPLATE_BODY = `INTERVIEW PREP — [Role] at [Company]

THE BASICS
Interview type: [Recruiter screen / Hiring manager / Panel / Final]
Date and time: [Date, time, time zone]
Location or link: [Address or video link]
Interviewer(s): [Names and titles, if known]

MY PITCH (tell me about yourself — present, past, future)
Present: [What I do now, in one or two lines]
Past: [The experience that makes me credible for this role]
Future: [Why this role, why now]

LIKELY QUESTIONS AND MY ANSWERS
1. [Question] — [My answer notes / story I will use]
2. [Question] — [My answer notes / story I will use]
3. [Question] — [My answer notes / story I will use]
(Add the questions from the role guide for this job)

MY STAR STORIES
- [Story title] — Situation / Task / Action / Result in one line each
- [Story title] — Situation / Task / Action / Result in one line each

QUESTIONS I WILL ASK
- [Question about the role]
- [Question about the team]
- [Question about success in the first months]
- Is there anything about my background that gives you pause?

RESEARCH NOTES
[Job posting highlights, company notes, names, anything to reference]

DAY OF
- [ ] Route / link tested, arrive or log in 10 minutes early
- [ ] Copies of my resume, something to take notes with
- [ ] Water, phone silenced
- [ ] Thank-you note sent the same day`;
