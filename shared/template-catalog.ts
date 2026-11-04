// Small, dependency-free catalog shared by the SPA (prefill), the Worker
// (routing + sitemap) and the static template page generator.

export type TemplatePrefill = {
  variantName: "Default" | "Client Meeting" | "Interview" | "Investor";
  variantSlug: string;
  focus: string;
  topics: string;
  meetingNote: string;
};

export type TemplateCatalogEntry = {
  id: string;
  title: string;
  prefill: TemplatePrefill;
};

export const TEMPLATE_CATALOG: readonly TemplateCatalogEntry[] = [
  {
    id: "meeting-agenda-template",
    title: "Meeting agenda template",
    prefill: {
      variantName: "Default",
      variantSlug: "intro",
      focus: "Goal and agenda for our meeting",
      topics: "Goal, Agenda topics, Decisions needed, Next steps",
      meetingNote: "Please read the agenda before we meet and send me anything you want to add.",
    },
  },
  {
    id: "one-on-one-meeting-template",
    title: "One-on-one meeting template",
    prefill: {
      variantName: "Default",
      variantSlug: "intro",
      focus: "Our one-on-one meetings",
      topics: "Priorities, Blockers, Feedback, Growth",
      meetingNote: "Add your topics before we meet so we can start with what matters most to you.",
    },
  },
  {
    id: "client-onboarding-questionnaire",
    title: "Client onboarding questionnaire",
    prefill: {
      variantName: "Client Meeting",
      variantSlug: "client-meeting",
      focus: "Getting your project started",
      topics: "Goals, Scope, Timeline, Stakeholders, Communication",
      meetingNote: "Before our kickoff, please answer the onboarding questions so we can use the call for decisions.",
    },
  },
  {
    id: "pre-meeting-questionnaire",
    title: "Pre-meeting questionnaire",
    prefill: {
      variantName: "Client Meeting",
      variantSlug: "client-meeting",
      focus: "Preparing for our first meeting",
      topics: "Your goals, Background, Questions, Next steps",
      meetingNote: "A few short answers before we meet will help me prepare and make our time more useful.",
    },
  },
  {
    id: "meeting-prep-template",
    title: "Meeting prep template",
    prefill: {
      variantName: "Default",
      variantSlug: "intro",
      focus: "What I'd like us to cover",
      topics: "Purpose, Key points, Questions, Next steps",
      meetingNote: "Here is some context on me and what I hope we can cover when we meet.",
    },
  },
  {
    id: "interview-preparation-template",
    title: "Interview preparation template",
    prefill: {
      variantName: "Interview",
      variantSlug: "interview",
      focus: "Interview preparation",
      topics: "Background, Relevant experience, Questions for the team",
      meetingNote: "Thanks for meeting with me. Here is a short overview of my background before our interview.",
    },
  },
];

export const TEMPLATE_IDS = TEMPLATE_CATALOG.map((entry) => entry.id);

export const TEMPLATES_BASE_PATH = "/templates/";

export const templatePath = (id: string) => `${TEMPLATES_BASE_PATH}${id}/`;

export const templateDownloadPath = (id: string) => `${templatePath(id)}${id}.txt`;

/** Every static path the template library serves (hub, pages, downloads). */
export const TEMPLATE_STATIC_PATHS: ReadonlySet<string> = new Set([
  TEMPLATES_BASE_PATH,
  ...TEMPLATE_IDS.flatMap((id) => [templatePath(id), templateDownloadPath(id)]),
]);

export const getTemplatePrefill = (id: string | null | undefined): TemplatePrefill | null => {
  if (!id) return null;
  return TEMPLATE_CATALOG.find((entry) => entry.id === id)?.prefill ?? null;
};

export const isTemplateLibraryPath = (pathname: string) =>
  pathname === "/templates" || pathname.startsWith(TEMPLATES_BASE_PATH);

export type TemplateLibraryResolution =
  | { kind: "asset" }
  | { kind: "redirect"; location: string }
  | { kind: "not-found" };

/** How the Worker answers a /templates* path: static asset, trailing-slash redirect, or 404. */
export const resolveTemplateLibraryPath = (pathname: string): TemplateLibraryResolution => {
  if (TEMPLATE_STATIC_PATHS.has(pathname)) return { kind: "asset" };
  const withSlash = `${pathname}/`;
  if (TEMPLATE_STATIC_PATHS.has(withSlash)) return { kind: "redirect", location: withSlash };
  return { kind: "not-found" };
};
