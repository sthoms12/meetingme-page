// Dataset types for the B4WeMeet interview prep content library.
//
// Every public content page is generated from these datasets (spec §5.1).
// The same datasets feed the Prep Pack tool's question sets, so a question
// written once appears on its page and in the tool. FAQ JSON-LD is generated
// from the same `faqs` arrays that render as visible Q&A on the page, so
// schema and page text can never drift apart.

export interface QuestionEntry {
  /** The interview question, as an interviewer would phrase it. */
  question: string;
  /** Why interviewers ask it — what they are really screening for. */
  whyAsked: string;
  /** How to answer: structure and substance, 2–4 sentences. Practical, not generic. */
  guidance: string;
  /** A short illustrative example answer or opening. Framed as an illustration to adapt, never a script. */
  example?: string;
  /** Common mistakes that weaken an answer to this question. */
  pitfalls?: string;
}

export interface AskEntry {
  /** A question the candidate asks the interviewer. */
  question: string;
  /** Why asking it helps / what it signals or reveals. */
  why: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface RoleDataset {
  /** URL slug segment, e.g. "nursing". */
  slug: string;
  /** Display name, e.g. "Nursing". */
  roleName: string;
  /** Optional cross-link to a companion page (e.g. a role's questions page
   *  pointing at its questions-to-ask page, and back). Rendered by RolePage. */
  companion?: { href: string; heading: string; text: string };
  /** Full page path with trailing slash, e.g. "/questions-to-ask-in-a-nursing-interview/". */
  pagePath: string;
  /** <title> for the page. */
  title: string;
  metaDescription: string;
  h1: string;
  /** Intro paragraphs (answer-first summary of what this interview screens for). */
  intro: string[];
  /** Questions the candidate will likely be asked: 15–25. */
  questions: QuestionEntry[];
  /** Questions the candidate should ask: 5–8. */
  questionsToAsk: AskEntry[];
  faqs: FaqEntry[];
}

/** A titled prose section: heading + paragraphs. Used by guide datasets. */
export interface GuideSection {
  heading: string;
  body: string[];
}

/** A copy-ready email template for the post-interview guides. */
export interface EmailTemplate {
  /** Template name, e.g. "The standard thank-you (hiring manager)". */
  name: string;
  /** When to use this variant. */
  when: string;
  /** A ready-to-adapt subject line. */
  subject: string;
  /** Body paragraphs, with [bracketed] placeholders the reader replaces. */
  body: string[];
}

export interface EmailGuide {
  intro: string[];
  /** Timing, structure and judgment guidance, as prose sections. */
  sections: GuideSection[];
  templates: EmailTemplate[];
  /** Mistakes that weaken the email, one line each with the why. */
  mistakes: string[];
  faqs: FaqEntry[];
}

/** A single interview question treated at full-page depth. */
export interface PerQuestionGuide {
  /** The question as interviewers phrase it. */
  question: string;
  intro: string[];
  /** The answer framework: ordered steps with detail. */
  framework: { step: string; detail: string }[];
  /** Worked example answers, framed as illustrations to adapt. */
  examples: { context: string; text: string }[];
  /** Other phrasings of the same question, and how the answer shifts. */
  variations: { question: string; note: string }[];
  pitfalls: string[];
  faqs: FaqEntry[];
}

export interface BringCategory {
  name: string;
  note?: string;
  items: { item: string; why: string }[];
}

export interface BringGuide {
  intro: string[];
  categories: BringCategory[];
  /** Things to leave at home, one line each with the why. */
  notToBring: string[];
  /** The virtual-interview version of the list. */
  virtual: string[];
  faqs: FaqEntry[];
}

/** An interview-format guide (phone screen, second round, …): how the
 *  format works, plus the questions it actually uses. */
export interface InterviewTypeGuide {
  intro: string[];
  sections: GuideSection[];
  questions: QuestionEntry[];
  faqs: FaqEntry[];
}
