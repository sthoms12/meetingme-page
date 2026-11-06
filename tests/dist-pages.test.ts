import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PAGES } from '../src/lib/pages';

// Verifies the built site (dist/) against the launch requirements.
// Requires `bun run build` first (CI runs build before tests via `bun run check`).
const DIST = join(import.meta.dir, '..', 'dist');
const read = (path: string) => readFileSync(join(DIST, path), 'utf8');

describe('built pages', () => {
  test('every registered page was built', () => {
    for (const page of PAGES) {
      const file = page.path === '/' ? 'index.html' : join(page.path, 'index.html');
      expect(existsSync(join(DIST, file))).toBe(true);
    }
  });

  test('sitemap lists exactly the registered pages', () => {
    const sitemap = read('sitemap.xml');
    for (const page of PAGES) {
      expect(sitemap).toContain(`<loc>https://b4wemeet.app${page.path}</loc>`);
    }
    expect((sitemap.match(/<url>/g) || []).length).toBe(PAGES.length);
  });

  test('robots.txt carries the Content-Signal and sitemap', () => {
    const robots = read('robots.txt');
    expect(robots).toContain('Content-Signal: ai-train=no, search=yes, ai-input=yes');
    expect(robots).toContain('Sitemap: https://b4wemeet.app/sitemap.xml');
  });

  test('landing has the required headline, Dataflare tag and manifest link', () => {
    const html = read('index.html');
    expect(html).toContain('Interview prep that never leaves your device');
    expect(html).toContain('glass-portfolio.sthoms105.workers.dev/s.js');
    expect(html).toContain('data-project="b4wemeet"');
    expect(html).toContain('rel="manifest"');
    expect(html).toContain('rel="canonical"');
  });

  test('privacy page carries the §7.4 transparency sentence', () => {
    const html = read(join('privacy', 'index.html'));
    expect(html).toContain('retired in November 2026');
    expect(html).toContain('Dataflare');
    expect(html).not.toContain('Durable Object');
    expect(html.toLowerCase()).not.toContain('visitor password');
  });

  test('PWA assets shipped: manifest icons and a versioned service worker', () => {
    for (const icon of ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png']) {
      expect(existsSync(join(DIST, icon))).toBe(true);
    }
    const sw = read('sw.js');
    expect(sw).toMatch(/const CACHE = 'b4wemeet-v\d+';/);
    const manifest = JSON.parse(read('manifest.webmanifest')) as { icons: { src: string }[] };
    expect(manifest.icons.map((i) => i.src)).toContain('/icon-maskable-512.png');
  });

  test('no page references the retired profile system', () => {
    for (const page of PAGES) {
      const file = page.path === '/' ? 'index.html' : join(page.path, 'index.html');
      const html = read(file);
      expect(html).not.toContain('/api/profiles');
      expect(html).not.toContain('management token');
    }
  });
});

describe('FAQ JSON-LD parity', () => {
  const decode = (s: string) =>
    s
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  const stripTags = (html: string) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

  test('every FAQ in JSON-LD appears as visible Q&A on the same page', () => {
    let pagesWithFaq = 0;
    for (const page of PAGES) {
      const file = page.path === '/' ? 'index.html' : join(page.path, 'index.html');
      const html = read(file);
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
        (m) => m[1],
      );
      const text = stripTags(html);
      for (const block of blocks) {
        const data = JSON.parse(block) as { '@type'?: string; mainEntity?: { name: string }[] };
        if (data['@type'] !== 'FAQPage') continue;
        pagesWithFaq++;
        expect(data.mainEntity!.length).toBeGreaterThan(0);
        for (const entity of data.mainEntity!) {
          expect(text).toContain(entity.name.replace(/\s+/g, ' '));
        }
      }
    }
    // Landing, privacy, role pages and most guide pages carry FAQs.
    expect(pagesWithFaq).toBeGreaterThanOrEqual(12);
  });
});
