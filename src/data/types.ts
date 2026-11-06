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
