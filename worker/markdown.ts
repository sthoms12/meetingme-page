// The Worker's copy of the markdown-mirror route list.
//
// The canonical page registry lives in src/lib/pages.ts (used by Astro and
// by the [...mirror] endpoint). This file is the Worker's independent copy;
// tests/markdown-sync.test.ts pins the two lists — and the built dist/
// mirrors — in sync. If you add a page, add it in both places and the test
// will prove all three agree.

export const MARKDOWN_PAGE_PATHS: string[] = [
  '/',
  '/interview-prep/',
  '/how-to-prepare-for-an-interview/',
  '/interview-prep-checklist/',
  '/common-interview-questions/',
  '/behavioral-interview-questions/',
  '/star-method-interview/',
  '/questions-to-ask-in-an-interview/',
  '/questions-to-ask-at-the-end-of-an-interview/',
  '/tell-me-about-yourself/',
  '/elevator-pitch-examples/',
  '/questions-to-ask-in-a-nursing-interview/',
  '/questions-to-ask-in-a-teacher-interview/',
  '/software-engineer-interview-questions-to-ask/',
  '/customer-service-interview-questions-to-ask/',
  '/manager-interview-questions-to-ask/',
  '/interview-prep-template/',
  '/privacy/',
  '/templates/',
  '/templates/meeting-agenda-template/',
  '/templates/one-on-one-meeting-template/',
  '/templates/client-onboarding-questionnaire/',
  '/templates/pre-meeting-questionnaire/',
  '/templates/meeting-prep-template/',
  '/templates/interview-preparation-template/',
];

/** "/" -> "/index.md", "/x/" -> "/x.md" (same rule as src/lib/pages.ts). */
export const mirrorPathFor = (path: string) =>
  path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`;
