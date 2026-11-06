import { describe, expect, test } from 'bun:test';
import {
  behavioralQuestions,
  checklist,
  commonQuestions,
  elevatorPitch,
  generalFaqs,
  questionsToAsk,
  questionsToAskEnd,
  starMethod,
  tellMeAboutYourself,
} from '../src/data/general';
import { customerService } from '../src/data/role-customer-service';
import { manager } from '../src/data/role-manager';
import { nursing } from '../src/data/role-nursing';
import { softwareEngineer } from '../src/data/role-software-engineer';
import { teacher } from '../src/data/role-teacher';
import type { RoleDataset } from '../src/data/types';
import { PAGES } from '../src/lib/pages';
import { GENERAL_SET, ROLE_SETS } from '../src/tool/role-sets';

const ROLES: RoleDataset[] = [nursing, teacher, softwareEngineer, customerService, manager];

describe('general datasets', () => {
  test('common and behavioral sets are substantial', () => {
    expect(commonQuestions.length).toBeGreaterThanOrEqual(18);
    expect(behavioralQuestions.length).toBeGreaterThanOrEqual(15);
  });

  test('every question entry is fully written', () => {
    for (const q of [...commonQuestions, ...behavioralQuestions]) {
      expect(q.question.length).toBeGreaterThan(5);
      expect(q.whyAsked.length).toBeGreaterThan(30);
      expect(q.guidance.length).toBeGreaterThan(60);
    }
  });

  test('questions to ask are categorized and plentiful', () => {
    expect(questionsToAsk.length).toBeGreaterThanOrEqual(5);
    const total = questionsToAsk.reduce((n, c) => n + c.items.length, 0);
    expect(total).toBeGreaterThanOrEqual(25);
    expect(questionsToAskEnd.length).toBeGreaterThanOrEqual(8);
  });

  test('STAR has four steps and a complete worked example', () => {
    expect(starMethod.steps.map((s) => s.letter).join('')).toBe('STAR');
    const ex = starMethod.workedExample;
    for (const part of [ex.situation, ex.task, ex.action, ex.result]) {
      expect(part.length).toBeGreaterThan(30);
    }
  });

  test('pitch and elevator content have structure, examples and FAQs', () => {
    expect(tellMeAboutYourself.structure.length).toBeGreaterThanOrEqual(3);
    expect(tellMeAboutYourself.examples.length).toBeGreaterThanOrEqual(3);
    expect(elevatorPitch.examples.length).toBeGreaterThanOrEqual(6);
  });

  test('checklist covers five phases', () => {
    expect(checklist).toHaveLength(5);
    for (const phase of checklist) expect(phase.items.length).toBeGreaterThanOrEqual(5);
  });

  test('page FAQ sets exist', () => {
    expect(generalFaqs.common.length).toBeGreaterThanOrEqual(4);
    expect(generalFaqs.behavioral.length).toBeGreaterThanOrEqual(4);
    expect(generalFaqs.questionsToAsk.length).toBeGreaterThanOrEqual(4);
  });
});

describe('role datasets', () => {
  test('five roles, each within the spec shape (15–25 questions, 5–8 asks)', () => {
    expect(ROLES).toHaveLength(5);
    for (const role of ROLES) {
      expect(role.questions.length).toBeGreaterThanOrEqual(15);
      expect(role.questions.length).toBeLessThanOrEqual(25);
      expect(role.questionsToAsk.length).toBeGreaterThanOrEqual(5);
      expect(role.questionsToAsk.length).toBeLessThanOrEqual(8);
      expect(role.faqs.length).toBeGreaterThanOrEqual(4);
      expect(role.intro.length).toBeGreaterThanOrEqual(2);
      for (const q of role.questions) {
        expect(q.whyAsked.length).toBeGreaterThan(20);
        expect(q.guidance.length).toBeGreaterThan(50);
      }
    }
  });

  test('every role pagePath is in the canonical page registry, and titles are unique', () => {
    const registryPaths = new Set(PAGES.map((p) => p.path));
    for (const role of ROLES) expect(registryPaths.has(role.pagePath)).toBe(true);
    const titles = new Set(ROLES.map((r) => r.title));
    expect(titles.size).toBe(ROLES.length);
  });

  test('tool role sets are derived from the same datasets', () => {
    expect(ROLE_SETS).toHaveLength(5);
    for (const set of ROLE_SETS) {
      const role = ROLES.find((r) => r.slug === set.slug)!;
      expect(set.questions).toEqual(role.questions.map((q) => q.question));
      expect(set.asks).toEqual(role.questionsToAsk.map((q) => q.question));
    }
    expect(GENERAL_SET.questions.length).toBeGreaterThanOrEqual(12);
  });
});
