# B4WeMeet

**Interview prep that never leaves your device.**

B4WeMeet is a free interview-prep content library plus a local-first prep-pack
builder. The guides and question libraries are static pages generated from
datasets; the builder runs entirely in the visitor's browser — prep packs,
STAR stories, pitch and notes are stored only in IndexedDB on the user's
device. There are no accounts, no uploads and no hosted user pages.

> History: until November 2026 B4WeMeet hosted public pre-meeting intro
> pages. That system was retired in a hard cutover (no profiles had ever
> been created) and replaced with this product. Retired routes return
> 410 Gone.

## Architecture

- **Astro static site** (`output: 'static'`) — pages generated from typed
  datasets in `src/data/` through shared templates. The same datasets feed
  the tool's question sets.
- **Prep Pack tool** — a vanilla TypeScript island (`src/tool/`) that
  hydrates only on `/interview-prep/`: packs, story bank, pitch builder,
  bring-your-own-AI handoff (clipboard-first; the chat URL carries only a
  short prompt), Markdown/print/ICS exports, JSON backup with
  validate-before-replace import, PWA service worker + manifest.
- **Thin Worker** (`worker/index.ts`) — serves `dist/` via the ASSETS
  binding, adds security headers, negotiates Markdown mirrors
  (`Accept: text/markdown` / `.md` paths), and returns 410 for retired
  profile/API routes. No Durable Objects are bound.
- **Markdown mirrors + llms.txt** — generated at build time
  (the `[...mirror]` static endpoint) from the canonical page registry
  (`src/lib/pages.ts`). The Worker's route list (`worker/markdown.ts`),
  the registry, the generator output and `llms.txt` are pinned in sync by
  `tests/markdown-sync.test.ts`.
- **Analytics** — Dataflare (cookieless, self-hosted) pageview tag only;
  it has no access to tool data.

## Develop

```sh
bun install
bun run dev        # Astro dev server
bun run check      # typecheck + build + full test suite
bun run deploy     # build + wrangler deploy (Workers Builds does this on merge)
```

## Tests

`bun test` covers ICS escaping/behaviour (ported from the retired app),
dataset shape and counts, backup import validation, worker routing
(410s, markdown negotiation, headers), and — against `dist/` — page
presence, sitemap/robots, FAQ JSON-LD ↔ visible-Q&A parity, markdown
mirror sync and PWA assets.
