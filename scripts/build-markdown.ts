// Post-build step: write the Markdown mirror for every page in the
// canonical registry (src/lib/pages.ts) into dist/, plus llms.txt.
// Run automatically as part of `bun run build` (see package.json).
// tests/markdown-sync.test.ts pins registry ↔ worker route list ↔ dist.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildLlmsTxt, buildMirrorMarkdown } from '../src/lib/mirrors';
import { PAGES, mirrorPathFor } from '../src/lib/pages';

const dist = join(import.meta.dir, '..', 'dist');

for (const page of PAGES) {
  const mirrorPath = mirrorPathFor(page.path);
  const file = join(dist, mirrorPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buildMirrorMarkdown(page));
}

writeFileSync(join(dist, 'llms.txt'), buildLlmsTxt());
console.log(`Wrote ${PAGES.length} markdown mirrors + llms.txt`);
