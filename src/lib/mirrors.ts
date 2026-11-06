// Markdown mirrors of every public page, generated from the same datasets
// and copy modules as the HTML pages (agent-readiness: mirrors must not
// drift from the pages). the [...mirror] static endpoint writes
// them into dist/ during the Astro build; worker/index.ts serves them on Accept:
// text/markdown and at the mirror paths.

import {
  behavioralQuestions,
  checklist,
  commonQuestions,
  elevatorPitch,
  generalFaqs,
  prepareGuide,
  questionsToAsk,
  questionsToAskEnd,
  starMethod,
  tellMeAboutYourself,
} from '../data/general';
import { customerService } from '../data/role-customer-service';
import { manager } from '../data/role-manager';
import { nursing } from '../data/role-nursing';
import { softwareEngineer } from '../data/role-software-engineer';
import { teacher } from '../data/role-teacher';
import type { AskEntry, FaqEntry, QuestionEntry, RoleDataset } from '../data/types';
import { INTERVIEW_PREP_TEMPLATE_BODY, LANDING_FAQS, PRIVACY_FAQS } from './copy';
import { PAGES, SITE_ORIGIN, type PageEntry } from './pages';
import { TEMPLATE_CONTENT } from './template-content';

const qList = (qs: QuestionEntry[]) =>
  qs
    .map(
      (q, i) =>
        `### ${i + 1}. ${q.question}\n\n**Why they ask:** ${q.whyAsked}\n\n**How to answer:** ${q.guidance}` +
        (q.example ? `\n\n**Example approach:** ${q.example}` : '') +
        (q.pitfalls ? `\n\n**Watch out:** ${q.pitfalls}` : ''),
    )
    .join('\n\n');

const askList = (items: AskEntry[]) =>
  items.map((a) => `### ${a.question}\n\n${a.why}`).join('\n\n');

const faqList = (faqs: FaqEntry[]) =>
  `## Frequently asked questions\n\n${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}`;

const header = (page: PageEntry) => `# ${page.title.replace(/ \| B4WeMeet$/, '')}\n\n${page.description}\n\nCanonical: ${SITE_ORIGIN}${page.path}\n`;

function roleMirror(page: PageEntry, r: RoleDataset) {
  return `${header(page)}
${r.intro.join('\n\n')}

## Questions you will be asked — and how to answer them

${qList(r.questions)}

## Questions to ask them

${askList(r.questionsToAsk)}

${faqList(r.faqs)}

Build a prep pack for this role in the free builder: ${SITE_ORIGIN}/interview-prep/?role=${r.slug}
`;
}

const ROLES: Record<string, RoleDataset> = {
  '/questions-to-ask-in-a-nursing-interview/': nursing,
  '/questions-to-ask-in-a-teacher-interview/': teacher,
  '/software-engineer-interview-questions-to-ask/': softwareEngineer,
  '/customer-service-interview-questions-to-ask/': customerService,
  '/manager-interview-questions-to-ask/': manager,
};

export function buildMirrorMarkdown(page: PageEntry): string {
  const role = ROLES[page.path];
  if (role) return roleMirror(page, role);

  switch (page.path) {
    case '/':
      return `${header(page)}
Interview prep that never leaves your device. Prepare with free guides and question libraries, then build a prep pack with your stories, answers and questions to ask — all in your browser. No account, nothing uploaded.

## How it works

1. **Learn the questions** — each guide explains why interviewers ask what they ask, how to structure a strong answer, and the mistakes that weaken one.
2. **Build your prep pack** — pick your role and the builder pre-fills the likely questions. Add STAR stories once, attach them to questions, draft your pitch, paste in research.
3. **Walk in ready** — export a one-page brief, print the checklist, add the interview to your calendar, and optionally hand the pack to your own AI for a mock interview.

${faqList(LANDING_FAQS)}
`;
    case '/interview-prep/':
      return `${header(page)}
The Prep Pack builder runs entirely in your browser. One pack per interview: likely questions pre-filled from your role's question set, a reusable STAR story bank, a present-past-future pitch builder, questions to ask, paste-in research notes, a debrief section, and exports — a Markdown or printable brief, a printable checklist, and a calendar file built from the date you enter.

AI handoff: the builder can copy your pack to your clipboard and open ChatGPT or Claude with a short coaching prompt (mock prep, story polish, gap check). B4WeMeet runs no AI itself.

Privacy: everything is stored only in your browser's local storage (IndexedDB). There are no accounts and nothing is uploaded. Export a JSON backup from the tool and keep it somewhere private.
`;
    case '/how-to-prepare-for-an-interview/':
      return `${header(page)}
${prepareGuide.sections.map((s) => `## ${s.heading}\n\n${s.body.join('\n\n')}`).join('\n\n')}

${faqList(prepareGuide.faqs)}
`;
    case '/interview-prep-checklist/':
      return `${header(page)}
${checklist.map((phase) => `## ${phase.phase}\n\n${phase.items.map((i) => `- [ ] ${i}`).join('\n')}`).join('\n\n')}

${faqList(prepareGuide.faqs.slice(0, 3))}
`;
    case '/common-interview-questions/':
      return `${header(page)}
${qList(commonQuestions)}

${faqList(generalFaqs.common)}
`;
    case '/behavioral-interview-questions/':
      return `${header(page)}
Behavioral questions rest on a simple idea: how you handled something before is the best evidence of how you will handle it again. Answer them with the STAR structure — Situation, Task, Action, Result.

${qList(behavioralQuestions)}

${faqList(generalFaqs.behavioral)}
`;
    case '/star-method-interview/':
      return `${header(page)}
${starMethod.steps.map((s) => `## ${s.letter} — ${s.name}\n\n${s.detail}`).join('\n\n')}

## A fully worked example

**${starMethod.workedExample.title}**

- **Situation:** ${starMethod.workedExample.situation}
- **Task:** ${starMethod.workedExample.task}
- **Action:** ${starMethod.workedExample.action}
- **Result:** ${starMethod.workedExample.result}

${faqList(starMethod.faqs)}
`;
    case '/questions-to-ask-in-an-interview/':
      return `${header(page)}
${questionsToAsk.map((c) => `## ${c.category}\n\n${askList(c.items)}`).join('\n\n')}

${faqList(generalFaqs.questionsToAsk)}
`;
    case '/questions-to-ask-at-the-end-of-an-interview/':
      return `${header(page)}
${askList(questionsToAskEnd)}

${faqList(generalFaqs.questionsToAsk)}
`;
    case '/tell-me-about-yourself/':
      return `${header(page)}
${tellMeAboutYourself.structure.map((s) => `## ${s.step}\n\n${s.detail}`).join('\n\n')}

## Examples

${tellMeAboutYourself.examples.map((e) => `### ${e.context}\n\n${e.text}`).join('\n\n')}

${faqList(tellMeAboutYourself.faqs)}
`;
    case '/elevator-pitch-examples/':
      return `${header(page)}
## The formula

${elevatorPitch.formula.map((s) => `### ${s.step}\n\n${s.detail}`).join('\n\n')}

## Examples

${elevatorPitch.examples.map((e) => `### ${e.context}\n\n${e.text}`).join('\n\n')}

${faqList(elevatorPitch.faqs)}
`;
    case '/interview-prep-template/':
      return `${header(page)}
\`\`\`
${INTERVIEW_PREP_TEMPLATE_BODY}
\`\`\`
`;
    case '/privacy/':
      return `${header(page)}
## Your prep stays on your device

Everything you create in the Prep Pack builder is stored in your browser's local storage (IndexedDB) on the device you are using. There is no B4WeMeet server database for user content, no account system, and no sync. Clearing this site's browser data erases your prep, so export a backup and keep it somewhere private.

## AI is bring-your-own

The handoff copies your pack to your clipboard and opens ChatGPT or Claude with a short coaching prompt. You paste the pack yourself, into your own AI account. B4WeMeet holds no AI keys and sends nothing to any AI service.

## Downloads are files, not links

Briefs, checklists, calendar files and backups are generated in your browser and downloaded as files. Nothing you create is published at a b4wemeet.app address.

## Site analytics

This site uses Dataflare, a cookieless analytics tool self-hosted in our own Cloudflare account. It records pageviews, the referring site, and basic device and browser information; data is kept for 90 days and never sold or shared. It measures pages, not people, and has no access to anything you prepare in the tool.

## What changed in November 2026

Hosted intro pages were retired in November 2026 when B4WeMeet became a private, on-device tool. The previous system — stored profiles, photos and all — has been shut down and its data deleted.

${faqList(PRIVACY_FAQS)}
`;
    case '/templates/':
      return `${header(page)}
${TEMPLATE_CONTENT.map((t) => `## ${t.h1}\n\n${t.hubBlurb}\n\n${SITE_ORIGIN}/templates/${t.id}/`).join('\n\n')}
`;
    default: {
      const template = TEMPLATE_CONTENT.find((t) => page.path === `/templates/${t.id}/`);
      if (template) {
        return `${header(page)}
${template.summary}

\`\`\`
${template.body}
\`\`\`

## How to use it

${template.howTo.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;
      }
      return `${header(page)}\n`;
    }
  }
}

export function buildLlmsTxt(): string {
  const lines = [
    '# B4WeMeet',
    '',
    '> Interview prep that never leaves your device. Free interview guides, question libraries and a prep-pack builder that runs entirely in the visitor\u2019s browser — no accounts, nothing uploaded. Every page below also has a Markdown mirror (append .md to the path, or request it with Accept: text/markdown).',
    '',
    '## Pages',
    '',
    ...PAGES.map((p) => `- [${p.title.replace(/ \| B4WeMeet$/, '')}](${SITE_ORIGIN}${p.path}): ${p.description}`),
    '',
  ];
  return lines.join('\n');
}
