import { describe, expect, test } from 'bun:test';
import worker from '../worker/index';

// Fake ASSETS binding: serves a fixed set of "built" files, 404 otherwise.
const FILES: Record<string, string> = {
  '/': '<html>home</html>',
  '/index.html': '<html>home</html>',
  '/common-interview-questions/': '<html>questions</html>',
  '/common-interview-questions/index.html': '<html>questions</html>',
  '/common-interview-questions.md': '# Common Interview Questions\n\nMirror body',
  '/index.md': '# B4WeMeet\n\nHome mirror',
  '/robots.txt': 'User-agent: *',
};

const env = {
  ASSETS: {
    fetch: async (input: RequestInfo | URL) => {
      const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input : input.url);
      const body = FILES[url.pathname];
      if (body === undefined) return new Response('not found', { status: 404 });
      return new Response(body, { status: 200, headers: { 'content-type': 'text/html' } });
    },
  } as unknown as Fetcher,
};

const get = (path: string, headers: Record<string, string> = {}) =>
  worker.fetch(new Request(`https://b4wemeet.app${path}`, { headers }), env);

describe('retired routes return 410 Gone', () => {
  test('/api/* is gone', async () => {
    expect((await get('/api/health')).status).toBe(410);
    expect((await get('/api/profiles/availability/steve')).status).toBe(410);
  });
  test('/create and /manage are gone', async () => {
    expect((await get('/create')).status).toBe(410);
    expect((await get('/manage')).status).toBe(410);
  });
  test('a profile URL is gone, with the retirement explanation', async () => {
    const res = await get('/steve-thoms');
    expect(res.status).toBe(410);
    expect(await res.text()).toContain('retired in November 2026');
  });
  test('a profile edit URL is gone', async () => {
    expect((await get('/steve-thoms/edit')).status).toBe(410);
  });
});

describe('live routes', () => {
  test('a known page serves its asset with security headers', async () => {
    const res = await get('/common-interview-questions/');
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
    expect(res.headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
    expect(res.headers.get('Link')).toContain('rel="alternate"; type="text/markdown"');
  });

  test('Accept: text/markdown negotiates the mirror', async () => {
    const res = await get('/common-interview-questions/', { Accept: 'text/markdown' });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/markdown');
    expect(await res.text()).toContain('Mirror body');
  });

  test('the mirror path serves markdown directly', async () => {
    const res = await get('/common-interview-questions.md');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/markdown');
  });

  test('/index.md serves the home mirror', async () => {
    const res = await get('/index.md');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('Home mirror');
  });

  test('a deep unknown path is a plain 404, not a 410', async () => {
    expect((await get('/some/deep/unknown/path')).status).toBe(404);
  });
});
