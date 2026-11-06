// Bring-your-own-AI handoff (spec §4.2, SolveStack F3 pattern).
//
// Rules, ported from F3:
//  - clipboard-primary: the full paste pack (task prompt + the user's pack)
//    is copied to the clipboard FIRST, because the chat URL prefills are
//    undocumented vendor conventions.
//  - the URL carries only the short task prompt — never pack data.
//  - the app makes no AI network calls and holds no keys.

import { buildBriefMarkdown } from './exporters';
import { INTERVIEW_TYPE_LABELS, type Pack, type Pitch, type Story } from './types';

export type AiTarget = 'chatgpt' | 'claude';
export type HandoffTask = 'mock' | 'polish' | 'gap';

const TARGET_URLS: Record<AiTarget, (prompt: string) => string> = {
  chatgpt: (prompt) => `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
  claude: (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
};

/** Short instruction prompts — the only thing that ever rides in a URL. */
export const HANDOFF_URL_PROMPTS: Record<HandoffTask, string> = {
  mock: 'I am about to paste my interview prep pack. When I do, interview me one question at a time and critique each answer against the stories in the pack.',
  polish: 'I am about to paste my STAR interview stories. When I do, tighten each story and flag gaps.',
  gap: 'I am about to paste my interview prep pack and research notes. When I do, list the likely questions my pack does not cover.',
};

const TASK_INSTRUCTIONS: Record<HandoffTask, string> = {
  mock: [
    'You are my interview coach. Below is my prep pack for a real interview.',
    'Interview me one question at a time, starting with the most likely question from the pack.',
    'After each of my answers, give brief, specific critique: did I use the attached story well,',
    'was my structure clear (situation, task, action, result), and what one change would most improve it?',
    'Do not move to the next question until I say "next".',
  ].join(' '),
  polish: [
    'You are my interview coach. Below are my STAR stories.',
    'For each story: check it has a clear Situation, Task, Action and Result; tighten the wording',
    'without inventing facts; flag any missing result or vague action; and suggest which interview',
    'questions this story could answer. Keep my voice — do not make the stories sound scripted.',
  ].join(' '),
  gap: [
    'You are my interview coach. Below is my prep pack and my research notes (including the job posting).',
    'List the questions this interviewer is most likely to ask that my pack does NOT cover, with a',
    'one-line reason for each, ordered by likelihood. Do not rewrite my existing answers.',
  ].join(' '),
};

/** The full paste pack: task instructions + the user's own material. Goes to the clipboard only. */
export function buildPastePack(task: HandoffTask, pack: Pack, stories: Story[], pitch: Pitch): string {
  const parts: string[] = [TASK_INSTRUCTIONS[task], ''];
  if (task === 'polish') {
    parts.push('# My STAR stories', '');
    for (const s of stories) {
      parts.push(`## ${s.title}`);
      if (s.situation) parts.push(`- Situation: ${s.situation}`);
      if (s.task) parts.push(`- Task: ${s.task}`);
      if (s.action) parts.push(`- Action: ${s.action}`);
      if (s.result) parts.push(`- Result: ${s.result}`);
      parts.push('');
    }
  } else {
    parts.push(buildBriefMarkdown(pack, stories, pitch));
    if (task === 'gap') {
      parts.push('', `# Interview: ${pack.roleTitle} — ${INTERVIEW_TYPE_LABELS[pack.type]}`);
    }
  }
  return parts.join('\n');
}

export interface HandoffResult {
  copied: boolean;
  url: string;
}

/**
 * Copy the paste pack to the clipboard, then open the chosen AI with only
 * the short prompt in the URL. Returns what happened so the UI can guide
 * the user ("paste with Ctrl/Cmd+V").
 */
export async function runHandoff(
  task: HandoffTask,
  target: AiTarget,
  pack: Pack,
  stories: Story[],
  pitch: Pitch,
): Promise<HandoffResult> {
  const pastePack = buildPastePack(task, pack, stories, pitch);
  let copied = false;
  try {
    await navigator.clipboard.writeText(pastePack);
    copied = true;
  } catch {
    copied = false;
  }
  const url = TARGET_URLS[target](HANDOFF_URL_PROMPTS[task]);
  window.open(url, '_blank', 'noopener');
  return { copied, url };
}
