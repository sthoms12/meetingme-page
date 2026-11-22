// IndexedDB persistence for the Prep Pack workspace.
//
// §4.3 requirements implemented here:
//  - writes are serialized through a single promise chain (no overlapping
//    puts, no lost updates from concurrent edits)
//  - callers use scheduleSave(), which debounces bursts of edits into one
//    write; flushSave() forces the pending write (used by beforeunload)

import { emptyWorkspace, type Workspace } from './types';

const DB_NAME = 'b4wemeet-prep';
const STORE = 'workspace';
const KEY = 'main';

export type SaveStatus = {
  state: 'idle' | 'saving' | 'saved' | 'error';
  error?: string;
  updatedAt?: number;
};

type SaveStatusListener = (status: SaveStatus) => void;
const statusListeners = new Set<SaveStatusListener>();
let lastStatus: SaveStatus = { state: 'idle' };

function emitStatus(next: SaveStatus) {
  lastStatus = next;
  for (const listener of statusListeners) {
    try {
      listener(next);
    } catch {
      // Listener errors must never break persistence.
    }
  }
}

export function getSaveStatus(): SaveStatus {
  return lastStatus;
}

export function onSaveStatus(listener: SaveStatusListener): () => void {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
}

function errorMessage(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err) return err;
  return 'Could not save to browser storage.';
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    let req: IDBOpenDBRequest;
    try {
      req = indexedDB.open(DB_NAME, 1);
    } catch (err) {
      reject(err instanceof Error ? err : new Error(errorMessage(err)));
      return;
    }
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open local storage database.'));
    req.onblocked = () => reject(new Error('Local storage database is blocked by another tab.'));
  });
}

export async function loadWorkspace(): Promise<Workspace> {
  const db = await openDb();
  try {
    return await new Promise<Workspace>((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(KEY);
      req.onsuccess = () => {
        const value = req.result as Workspace | undefined;
        resolve(value && value.version === 1 ? value : emptyWorkspace());
      };
      req.onerror = () => reject(req.error ?? new Error('Failed to read workspace from local storage.'));
    });
  } finally {
    db.close();
  }
}

async function putWorkspace(ws: Workspace): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(ws, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error('Failed to write workspace to local storage.'));
      tx.onabort = () => reject(tx.error ?? new Error('Local storage write was aborted (quota may be full).'));
    });
  } finally {
    db.close();
  }
}

// Serialized write chain: each save queues behind the previous one.
let chain: Promise<void> = Promise.resolve();
let pending: Workspace | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
let dirty = false;

export const isDirty = () => dirty;

function enqueue(ws: Workspace): Promise<void> {
  const writePromise = chain.then(() => putWorkspace(ws));
  // Keep the serialized chain healthy for future retries while propagating this write's error.
  chain = writePromise.catch(() => undefined);
  return writePromise;
}

/** Debounced save — call on every edit. */
export function scheduleSave(ws: Workspace) {
  pending = ws;
  dirty = true;
  emitStatus({ state: 'saving' });
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    if (pending) {
      const toWrite = pending;
      pending = null;
      void enqueue(toWrite)
        .then(() => {
          if (!pending) {
            dirty = false;
            emitStatus({ state: 'saved', updatedAt: Date.now() });
          }
        })
        .catch((err: unknown) => {
          dirty = true;
          emitStatus({ state: 'error', error: errorMessage(err) });
        });
    }
  }, 400);
}

/** Force any pending save now (beforeunload / explicit save points). */
export async function flushSave(): Promise<void> {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  if (pending) {
    const toWrite = pending;
    pending = null;
    emitStatus({ state: 'saving' });
    try {
      await enqueue(toWrite);
      if (!pending) {
        dirty = false;
        emitStatus({ state: 'saved', updatedAt: Date.now() });
      }
    } catch (err) {
      dirty = true;
      emitStatus({ state: 'error', error: errorMessage(err) });
      throw err;
    }
  } else {
    await chain;
  }
}

/** Ask the browser to keep this data (best-effort, no prompt in most browsers). */
export async function requestPersistence() {
  try {
    if (navigator.storage?.persist) {
      const persisted = await navigator.storage.persisted?.();
      if (!persisted) await navigator.storage.persist();
    }
  } catch {
    // Persistence is a nice-to-have; failure changes nothing functionally.
  }
}

export async function storageEstimate(): Promise<{ usage: number; quota: number } | null> {
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
    }
  } catch {
    // ignore
  }
  return null;
}
