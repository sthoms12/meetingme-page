import { afterEach, describe, expect, test } from 'bun:test';
import { flushSave, isDirty, loadWorkspace, onSaveStatus, scheduleSave, type SaveStatus } from '../src/tool/db';
import {
  assemblePitch,
  estimateSpokenSeconds,
  formatPackHeading,
  reconcileRecoveredWorkspace,
} from '../src/tool/main';
import { emptyWorkspace, type Pack, type Story, type Workspace } from '../src/tool/types';

const originalIndexedDB = globalThis.indexedDB;

afterEach(() => {
  Object.defineProperty(globalThis, 'indexedDB', {
    value: originalIndexedDB,
    configurable: true,
    writable: true,
  });
});

function setFakeIndexedDB(fake: unknown) {
  Object.defineProperty(globalThis, 'indexedDB', {
    value: fake,
    configurable: true,
    writable: true,
  });
}

describe('IndexedDB persistence error handling (B4WM-C1)', () => {
  test('loadWorkspace rejects cleanly when IndexedDB is unavailable', async () => {
    setFakeIndexedDB(undefined);
    await expect(loadWorkspace()).rejects.toThrow(/IndexedDB is not available/i);
  });

  test('flushSave propagates write failures, preserves dirty state, emits error status, and recovers on retry', async () => {
    const statuses: SaveStatus[] = [];
    const unsubscribe = onSaveStatus((status) => statuses.push(status));

    try {
      // 1. Simulate a failing IndexedDB open/write (e.g., private browsing or quota error).
      setFakeIndexedDB({
        open() {
          const req: Record<string, unknown> = { error: new Error('QuotaExceededError: disk full') };
          queueMicrotask(() => {
            if (typeof req.onerror === 'function') (req.onerror as () => void)();
          });
          return req;
        },
      });

      const ws = emptyWorkspace();
      scheduleSave(ws);
      await expect(flushSave()).rejects.toThrow(/QuotaExceededError/i);
      expect(isDirty()).toBe(true);
      expect(statuses.some((s) => s.state === 'error' && s.error?.includes('QuotaExceededError'))).toBe(true);

      // 2. Simulate storage recovery and verify subsequent flushSave succeeds and clears dirty state.
      let storedValue: unknown = null;
      setFakeIndexedDB({
        open() {
          const db = {
            objectStoreNames: { contains: () => true },
            transaction() {
              const tx: Record<string, unknown> = {
                objectStore: () => ({
                  put(value: unknown) {
                    storedValue = value;
                    queueMicrotask(() => {
                      if (typeof tx.oncomplete === 'function') (tx.oncomplete as () => void)();
                    });
                  },
                }),
              };
              return tx;
            },
            close() {},
          };
          const req: Record<string, unknown> = { result: db };
          queueMicrotask(() => {
            if (typeof req.onsuccess === 'function') (req.onsuccess as () => void)();
          });
          return req;
        },
      });

      scheduleSave(ws);
      await flushSave();
      expect(isDirty()).toBe(false);
      expect(storedValue).toEqual(ws);
      expect(statuses[statuses.length - 1]?.state).toBe('saved');
    } finally {
      unsubscribe();
    }
  });
});

describe('live pitch preview and heading helpers (B4WM-H2)', () => {
  test('assemblePitch joins non-empty trimmed segments', () => {
    expect(assemblePitch({ present: '', past: '  ', future: '' })).toBe('');
    expect(
      assemblePitch({
        present: '  I lead platform reliability. ',
        past: '',
        future: 'Looking to scale SRE at your company.',
      }),
    ).toBe('I lead platform reliability. Looking to scale SRE at your company.');
  });

  test('estimateSpokenSeconds computes word count and speaking estimate', () => {
    expect(estimateSpokenSeconds('')).toEqual({ words: 0, seconds: 0 });
    expect(estimateSpokenSeconds('one two three')).toEqual({ words: 3, seconds: 1 });
    const seventyWords = Array.from({ length: 70 }, () => 'word').join(' ');
    expect(estimateSpokenSeconds(seventyWords)).toEqual({ words: 70, seconds: 30 });
  });

  test('formatPackHeading handles untitled, role-only, and role+company packs', () => {
    expect(formatPackHeading({ roleTitle: '', company: '' })).toBe('Untitled interview');
    expect(formatPackHeading({ roleTitle: 'Staff Nurse', company: '' })).toBe('Staff Nurse');
    expect(formatPackHeading({ roleTitle: 'Staff Nurse', company: 'General Hospital' })).toBe(
      'Staff Nurse at General Hospital',
    );
  });
});

function makeStory(id: string, title: string): Story {
  return {
    id,
    title,
    situation: 'S',
    task: 'T',
    action: 'A',
    result: 'R',
    tags: [],
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

function makePack(id: string, roleTitle: string, storyId?: string): Pack {
  return {
    id,
    roleTitle,
    company: 'Acme',
    type: 'hiring-manager',
    dateTime: '',
    location: '',
    questions: [{ question: 'Tell me about a challenge', notes: '', ...(storyId ? { storyId } : {}) }],
    asks: [],
    pitchOverride: '',
    researchNotes: '',
    debrief: '',
    archived: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('reconcileRecoveredWorkspace', () => {
  test('restores saved workspace when temporary workspace is empty', () => {
    const saved: Workspace = {
      version: 1,
      stories: [makeStory('s1', 'Saved Story')],
      packs: [makePack('p1', 'Staff Engineer', 's1')],
      pitch: { present: 'Saved present', past: '', future: '' },
      lastBackupAt: '2026-01-02T00:00:00.000Z',
    };
    const result = reconcileRecoveredWorkspace(saved, emptyWorkspace());
    expect(result.merged).toBe(false);
    expect(result.workspace).toEqual(saved);
  });

  test('keeps temporary workspace when saved storage is empty', () => {
    const temp: Workspace = {
      version: 1,
      stories: [makeStory('s-temp', 'Temp Story')],
      packs: [makePack('p-temp', 'Product Manager', 's-temp')],
      pitch: { present: 'Temp present', past: '', future: '' },
      lastBackupAt: null,
    };
    const result = reconcileRecoveredWorkspace(emptyWorkspace(), temp);
    expect(result.merged).toBe(false);
    expect(result.workspace).toEqual(temp);
  });

  test('preserves both saved and temporary packs, stories, and pitch on recovery', () => {
    const saved: Workspace = {
      version: 1,
      stories: [makeStory('s1', 'Saved Story')],
      packs: [makePack('p1', 'Staff Engineer', 's1')],
      pitch: { present: 'Saved present', past: 'Saved past', future: '' },
      lastBackupAt: '2026-01-02T00:00:00.000Z',
    };
    const temp: Workspace = {
      version: 1,
      stories: [makeStory('s2', 'Temp Story')],
      packs: [makePack('p2', 'Principal Engineer', 's2')],
      pitch: { present: 'Temp present', past: '', future: 'Temp future' },
      lastBackupAt: null,
    };

    const result = reconcileRecoveredWorkspace(saved, temp);
    expect(result.merged).toBe(true);
    expect(result.workspace.stories.map((s) => s.title)).toEqual(['Saved Story', 'Temp Story']);
    expect(result.workspace.packs.map((p) => p.roleTitle)).toEqual(['Staff Engineer', 'Principal Engineer']);
    expect(result.workspace.pitch).toEqual({
      present: 'Saved present\n\nTemp present',
      past: 'Saved past',
      future: 'Temp future',
    });
    expect(result.workspace.lastBackupAt).toBe('2026-01-02T00:00:00.000Z');
  });

  test('remaps colliding IDs so temporary items never overwrite saved items', () => {
    const saved: Workspace = {
      version: 1,
      stories: [makeStory('dup', 'Saved Story')],
      packs: [makePack('dup-pack', 'Saved Role', 'dup')],
      pitch: { present: '', past: '', future: '' },
      lastBackupAt: null,
    };
    const temp: Workspace = {
      version: 1,
      stories: [makeStory('dup', 'Temp Story')],
      packs: [makePack('dup-pack', 'Temp Role', 'dup')],
      pitch: { present: '', past: '', future: '' },
      lastBackupAt: null,
    };

    const result = reconcileRecoveredWorkspace(saved, temp);
    expect(result.merged).toBe(true);
    expect(result.workspace.stories).toHaveLength(2);
    expect(result.workspace.stories[0]?.id).toBe('dup');
    expect(result.workspace.stories[1]?.id).not.toBe('dup');
    expect(result.workspace.packs).toHaveLength(2);
    expect(result.workspace.packs[0]?.id).toBe('dup-pack');
    expect(result.workspace.packs[1]?.id).not.toBe('dup-pack');
    expect(result.workspace.packs[1]?.questions[0]?.storyId).toBe(result.workspace.stories[1]?.id);
  });
});

