// Canonical registry of the site's public pages.
//
// This list is the single source of truth consumed by:
//   - src/pages/sitemap.xml.ts (sitemap generation)
//   - scripts/build-markdown.ts (.md mirrors + llms.txt)
//   - worker/markdown.ts carries its own copy of the path list; tests pin
//     the two lists in sync (tests/markdown-sync.test.ts), and also pin
//     that every path here has a built page and a built mirror in dist/.

export interface PageEntry {
  /** Absolute path with trailing slash, e.g. "/common-interview-questions/". */
  path: string;
  title: string;
  description: string;
}

export const SITE_NAME = 'B4WeMeet';
export const SITE_ORIGIN = 'https://b4wemeet.app';
export const TAGLINE = 'Interview prep that never leaves your device.';

export const PAGES: PageEntry[] = [
  {
    path: '/',
    title: 'B4WeMeet | Interview prep that never leaves your device',
    description:
      'Free interview prep guides, question libraries and a private prep-pack builder that runs entirely in your browser. No account, nothing uploaded — your job search stays on your device.',
  },
  {
    path: '/interview-prep/',
    title: 'Interview Prep Pack Builder | B4WeMeet',
    description:
      'Build a prep pack for your next interview: likely questions, your STAR stories, questions to ask and a morning-of brief. Free, private, and stored only on your device.',
  },
  {
    path: '/how-to-prepare-for-an-interview/',
    title: 'How to Prepare for an Interview: A Practical Guide | B4WeMeet',
    description:
      'A practical, step-by-step guide to preparing for a job interview: research, practice, questions, logistics, the day itself and the follow-up that gets remembered.',
  },
  {
    path: '/interview-prep-checklist/',
    title: 'Interview Prep Checklist | B4WeMeet',
    description:
      'A printable interview preparation checklist: what to do a week before, the day before, the morning of, during the interview and after it.',
  },
  {
    path: '/common-interview-questions/',
    title: 'Common Interview Questions and How to Answer Them | B4WeMeet',
    description:
      'The interview questions almost every candidate gets asked — why interviewers ask them, how to structure a strong answer, examples and the mistakes that weaken one.',
  },
  {
    path: '/behavioral-interview-questions/',
    title: 'Behavioral Interview Questions and STAR Answers | B4WeMeet',
    description:
      'Behavioral interview questions with the STAR structure for answering them: what interviewers are screening for, how to answer, and worked framing for each question.',
  },
  {
    path: '/star-method-interview/',
    title: 'The STAR Method for Interviews, With a Worked Example | B4WeMeet',
    description:
      'How the STAR method works — Situation, Task, Action, Result — with a fully worked example and a free story-bank builder that keeps your stories on your device.',
  },
  {
    path: '/questions-to-ask-in-an-interview/',
    title: 'Questions to Ask in an Interview | B4WeMeet',
    description:
      'Smart questions to ask your interviewer about the role, the team, the manager, growth and next steps — and what each question tells you about the job.',
  },
  {
    path: '/questions-to-ask-at-the-end-of-an-interview/',
    title: 'Questions to Ask at the End of an Interview | B4WeMeet',
    description:
      'The questions to ask when the interviewer says "do you have any questions for us?" — including the one that surfaces concerns while there is still time to answer them.',
  },
  {
    path: '/tell-me-about-yourself/',
    title: 'How to Answer "Tell Me About Yourself" | B4WeMeet',
    description:
      'A simple present, past, future structure for the "tell me about yourself" answer, with examples for career changers, graduates and experienced specialists.',
  },
  {
    path: '/elevator-pitch-examples/',
    title: 'Elevator Pitch Examples and a Simple Formula | B4WeMeet',
    description:
      'A four-part elevator pitch formula with examples for job seekers, career changers, graduates and specialists — each under 30 seconds spoken aloud.',
  },
  {
    path: '/questions-to-ask-in-a-nursing-interview/',
    title: 'Nursing Interview Questions: What You Will Be Asked and What to Ask | B4WeMeet',
    description:
      'Nursing interview questions on patient safety, prioritization and difficult situations — with answer guidance — plus the questions to ask about the unit before you accept.',
  },
  {
    path: '/questions-to-ask-in-a-teacher-interview/',
    title: 'Teacher Interview Questions: What You Will Be Asked and What to Ask | B4WeMeet',
    description:
      'Teacher interview questions on classroom management, differentiation and parents — with answer guidance — plus the questions to ask about the school before you accept.',
  },
  {
    path: '/software-engineer-interview-questions-to-ask/',
    title: 'Software Engineer Interview Questions to Ask (and Expect) | B4WeMeet',
    description:
      'The questions software engineers should ask about the team, stack, code review and on-call — plus the questions you will be asked and how to answer them.',
  },
  {
    path: '/customer-service-interview-questions-to-ask/',
    title: 'Customer Service Interview Questions to Ask (and Expect) | B4WeMeet',
    description:
      'Customer service interview questions on de-escalation, difficult customers and juggling queues — with answer guidance — plus what to ask about training, tools and support.',
  },
  {
    path: '/manager-interview-questions-to-ask/',
    title: 'Manager Interview Questions to Ask (and Expect) | B4WeMeet',
    description:
      'Manager interview questions on leadership style, difficult conversations and underperformance — with answer guidance — plus what to ask about the team you would inherit.',
  },
  {
    path: '/interview-prep-template/',
    title: 'Interview Prep Template (Free, Fill-In) | B4WeMeet',
    description:
      'A free fill-in interview preparation template: research notes, likely questions, your stories, questions to ask and day-of logistics — copy it or build it in the free prep-pack tool.',
  },
  {
    path: '/privacy/',
    title: 'Security and Privacy | B4WeMeet',
    description:
      'How B4WeMeet handles your data: everything you prepare is stored only in your browser, on your device. No accounts, no uploads, no tracking of your job search.',
  },
  {
    path: '/templates/',
    title: 'Meeting Templates | B4WeMeet',
    description:
      'Free meeting templates: agendas, one-on-ones, onboarding questionnaires and meeting prep — copy them or download as text files.',
  },
  {
    path: '/templates/meeting-agenda-template/',
    title: 'Meeting Agenda Template (Free Copy and Download) | B4WeMeet',
    description:
      'Free meeting agenda template with a goal, timed topics, owners, decisions and action items. Copy it or download it as a text file.',
  },
  {
    path: '/templates/one-on-one-meeting-template/',
    title: 'One-on-One Meeting Template (Free Copy and Download) | B4WeMeet',
    description:
      'Free one-on-one meeting template covering priorities, blockers, feedback and growth. Copy it or download it as a text file.',
  },
  {
    path: '/templates/client-onboarding-questionnaire/',
    title: 'Client Onboarding Questionnaire (Free Copy and Download) | B4WeMeet',
    description:
      'Free client onboarding questionnaire covering goals, scope, timeline, stakeholders and communication. Copy it or download it as a text file.',
  },
  {
    path: '/templates/pre-meeting-questionnaire/',
    title: 'Pre-Meeting Questionnaire (Free Copy and Download) | B4WeMeet',
    description:
      'Free pre-meeting questionnaire to send before a first meeting so everyone arrives prepared. Copy it or download it as a text file.',
  },
  {
    path: '/templates/meeting-prep-template/',
    title: 'Meeting Prep Template (Free Copy and Download) | B4WeMeet',
    description:
      'Free meeting prep template: purpose, key points, questions and next steps. Copy it or download it as a text file.',
  },
  {
    path: '/templates/interview-preparation-template/',
    title: 'Interview Preparation Template (Free Copy and Download) | B4WeMeet',
    description:
      'Free interview preparation template: the original B4WeMeet template for preparing what to say and ask before an interview. Copy it or download it as a text file.',
  },
];

/** Content pages (everything except the templates library) — used for nav and llms.txt grouping. */
export const CONTENT_PAGES = PAGES.filter((p) => !p.path.startsWith('/templates'));
export const TEMPLATE_PAGES = PAGES.filter((p) => p.path.startsWith('/templates'));

/** Map a page path to its markdown mirror path in dist: "/" -> "/index.md", "/x/" -> "/x.md". */
export const mirrorPathFor = (path: string) =>
  path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`;

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path);
