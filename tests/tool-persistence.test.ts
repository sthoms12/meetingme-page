import { afterEach, describe, expect, test } from 'bun:test';
import { flushSave, isDirty, loadWorkspace, onSaveStatus, scheduleSave, type SaveStatus } from '../src/tool/db';
import { assemblePitch, estimateSpokenSeconds, formatPackHeading } from '../src/tool/main';
import { emptyWorkspace } from '../src/tool/types';

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
