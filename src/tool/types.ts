// Prep Pack workspace model. Everything in here lives in the user's browser
// (IndexedDB) — it is never sent anywhere (spec §2, §4.1).

export type InterviewType = 'recruiter-screen' | 'hiring-manager' | 'panel' | 'final' | 'other';

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  'recruiter-screen': 'Recruiter screen',
  'hiring-manager': 'Hiring manager',
  panel: 'Panel',
  final: 'Final round',
  other: 'Other',
};

export interface Story {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  /** Competency tags: leadership, conflict, failure, teamwork, pressure, initiative… */
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PackQuestion {
  question: string;
  notes: string;
  storyId?: string;
}

export interface PackAsk {
  question: string;
  notes: string;
}

export interface Pack {
  id: string;
  roleTitle: string;
  company: string;
  type: InterviewType;
  /** datetime-local value as entered by the user, "" when not set. */
  dateTime: string;
  location: string;
  questions: PackQuestion[];
  asks: PackAsk[];
  /** Per-pack "tell me about yourself" override; "" means use the default pitch. */
  pitchOverride: string;
  researchNotes: string;
  debrief: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Pitch {
  present: string;
  past: string;
  future: string;
}

export interface Workspace {
  version: 1;
  stories: Story[];
  packs: Pack[];
  pitch: Pitch;
  lastBackupAt: string | null;
}

export const emptyWorkspace = (): Workspace => ({
  version: 1,
  stories: [],
  packs: [],
  pitch: { present: '', past: '', future: '' },
  lastBackupAt: null,
});

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
