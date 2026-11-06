import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES, mirrorPathFor } from '../src/lib/pages';
import { MARKDOWN_PAGE_PATHS } from '../worker/markdown';

// The four-lists discipline: canonical registry (src/lib/pages.ts), worker
// route list (worker/markdown.ts), generator output (dist/*.md) and
// llms.txt must all agree. Requires `bun run build` first (CI runs build
// before tests via `bun run check`).
const DIST = join(import.meta.dir, '..', 'dist');

describe('markdown mirror sync', () => {
  test('worker route list matches the canonical registry exactly', () => {
    expect([...MARKDOWN_PAGE_PATHS].sort()).toEqual(PAGES.map((p) => p.path).sort());
  });

  test('every registered page has a built mirror in dist', () => {
    for (const page of PAGES) {
      const file = join(DIST, mirrorPathFor(page.path));
      expect(existsSync(file)).toBe(true);
      const md = readFileSync(file, 'utf8');
      expect(md.length).toBeGreaterThan(200);
      expect(md).toContain(page.title.replace(/ \| B4WeMeet$/, ''));
    }
  });

  test('llms.txt lists every page', () => {
    const llms = readFileSync(join(DIST, 'llms.txt'), 'utf8');
    for (const page of PAGES) {
      expect(llms).toContain(`https://b4wemeet.app${page.path}`);
    }
  });
});
