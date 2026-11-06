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

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
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
      req.onerror = () => reject(req.error);
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
      tx.onerror = () => reject(tx.error);
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
  chain = chain.then(() => putWorkspace(ws)).catch(() => undefined);
  return chain;
}

/** Debounced save — call on every edit. */
export function scheduleSave(ws: Workspace) {
  pending = ws;
  dirty = true;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    if (pending) {
      const toWrite = pending;
      pending = null;
      void enqueue(toWrite).then(() => {
        if (!pending) dirty = false;
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
    await enqueue(toWrite);
    if (!pending) dirty = false;
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
