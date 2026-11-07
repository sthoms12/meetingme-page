// Compact question sets for the Prep Pack tool, derived from the same
// datasets that generate the public pages (spec §5.1: one source, two uses).
// The hub page serializes this into the page for the island.

import { behavioralQuestions, commonQuestions, questionsToAsk } from '../data/general';
import { customerService } from '../data/role-customer-service';
import { manager } from '../data/role-manager';
import { nursing } from '../data/role-nursing';
import { projectManager } from '../data/role-project-manager';
import { softwareEngineer } from '../data/role-software-engineer';
import { teacher } from '../data/role-teacher';
import type { RoleDataset } from '../data/types';

export interface RoleSet {
  slug: string;
  roleName: string;
  pagePath: string;
  questions: string[];
  asks: string[];
}

const toSet = (r: RoleDataset): RoleSet => ({
  slug: r.slug,
  roleName: r.roleName,
  pagePath: r.pagePath,
  questions: r.questions.map((q) => q.question),
  asks: r.questionsToAsk.map((q) => q.question),
});

export const ROLE_SETS: RoleSet[] = [nursing, teacher, softwareEngineer, customerService, manager, projectManager].map(toSet);

export const GENERAL_SET: RoleSet = {
  slug: 'general',
  roleName: 'General',
  pagePath: '/interview-prep/',
  questions: [
    ...commonQuestions.slice(0, 10).map((q) => q.question),
    ...behavioralQuestions.slice(0, 6).map((q) => q.question),
  ],
  asks: questionsToAsk.flatMap((c) => c.items).slice(0, 8).map((q) => q.question),
};
