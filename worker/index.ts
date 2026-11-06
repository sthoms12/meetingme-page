// B4WeMeet thin worker (spec §6, post-pivot).
//
// Responsibilities, in order:
//  1. Retired routes from the hosted-profile era (/api/*, /create, /manage,
//     and any single- or two-segment path that is not a real page or asset)
//     return 410 Gone — the Durable Object system is detached and gone.
//  2. Markdown negotiation: pages in MARKDOWN_PAGE_PATHS serve their
//     build-time .md mirror on Accept: text/markdown, and at the mirror
//     path directly, with agent-discovery Link headers on HTML responses.
//  3. Everything else is served from the static Astro build (ASSETS).
//  4. Security headers on every response.

import { MARKDOWN_PAGE_PATHS, mirrorPathFor } from './markdown';

export { GlobalDurableObject } from './durable-object';

interface Env {
  ASSETS: Fetcher;
}

const securityHeaders = (request: Request) => {
  const isEmbed = new URL(request.url).searchParams.get('embed') === '1';
  const frameAncestors = isEmbed ? '*' : "'self'";
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `frame-ancestors ${frameAncestors}`,
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://glass-portfolio.sthoms105.workers.dev",
      "connect-src 'self' https://cloudflareinsights.com https://glass-portfolio.sthoms105.workers.dev",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  } as Record<string, string>;
};

const withHeaders = (response: Response, request: Request, extra: Record<string, string> = {}) => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders(request))) headers.set(name, value);
  for (const [name, value] of Object.entries(extra)) headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const GONE_BODY = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Page retired | B4WeMeet</title></head>
<body><main>
<h1>This page has been retired</h1>
<p>B4WeMeet used to host intro pages at addresses like this one. Hosted intro pages were retired in November 2026, when B4WeMeet became a private, on-device interview prep tool — nothing is hosted here
any more, and the old profile data has been deleted.</p>
<p><a href="/">Go to B4WeMeet — interview prep that never leaves your device</a></p>
</main></body></html>`;

const gone = (request: Request) =>
  withHeaders(
    new Response(GONE_BODY, {
      status: 410,
      headers: { 'content-type': 'text/html; charset=UTF-8', 'x-robots-tag': 'noindex' },
    }),
    request,
  );

const notFound = (request: Request) =>
  withHeaders(
    new Response(
      '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found | B4WeMeet</title></head><body><main><h1>Not found</h1><p><a href="/">Go to B4WeMeet</a></p></main></body></html>',
      {
        status: 404,
        headers: { 'content-type': 'text/html; charset=UTF-8', 'x-robots-tag': 'noindex' },
      },
    ),
    request,
  );

const wantsMarkdown = (request: Request) =>
  (request.headers.get('Accept') || '').toLowerCase().includes('text/markdown');

const appendVary = (headers: Headers, value: string) => {
  const values = new Set(
    (headers.get('Vary') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  );
  values.add(value);
  headers.set('Vary', [...values].join(', '));
};

/** Paths that look like static asset files shipped in dist (not pages). */
const isAssetPath = (pathname: string) =>
  pathname.startsWith('/assets/') ||
  pathname.startsWith('/_astro/') ||
  /\.(?:css|js|mjs|map|svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|webmanifest|woff2?|ttf|otf|md)$/i.test(pathname);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // 1. Retired API surface and app routes from the profile era.
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return gone(request);
    }
    if (pathname === '/create' || pathname === '/create/' || pathname === '/manage' || pathname === '/manage/') {
      return gone(request);
    }

    const isMarkdownPage = MARKDOWN_PAGE_PATHS.includes(pathname);
    const canonicalUrl = new URL(pathname, url.origin).toString();

    // 2a. Direct mirror request: /index.md or /<page>.md for a known page.
    if (pathname.endsWith('.md')) {
      const pagePath = pathname === '/index.md' ? '/' : `${pathname.slice(0, -3)}/`;
      if (MARKDOWN_PAGE_PATHS.includes(pagePath)) {
        const asset = await env.ASSETS.fetch(new Request(new URL(pathname, url.origin), request));
        if (asset.status !== 404) {
          return withHeaders(asset, request, {
            'content-type': 'text/markdown; charset=UTF-8',
            'cache-control': 'public, max-age=300',
            Link: `<${new URL(pagePath, url.origin).toString()}>; rel="canonical"`,
          });
        }
      }
      return notFound(request);
    }

    // 2b. Content negotiation for known pages.
    if (isMarkdownPage && wantsMarkdown(request)) {
      const mirrorUrl = new URL(mirrorPathFor(pathname), url.origin);
      const asset = await env.ASSETS.fetch(new Request(mirrorUrl, request));
      if (asset.status !== 404) {
        const headers = new Headers(asset.headers);
        headers.set('content-type', 'text/markdown; charset=UTF-8');
        headers.set('cache-control', 'public, max-age=300');
        appendVary(headers, 'Accept');
        headers.set(
          'Link',
          `<${canonicalUrl}>; rel="canonical", <${mirrorUrl.toString()}>; rel="alternate"; type="text/markdown"`,
        );
        const mdResponse = new Response(asset.body, { status: 200, headers });
        return withHeaders(mdResponse, request);
      }
    }

    // 3. Static assets.
    const asset = await env.ASSETS.fetch(request);
    if (asset.status !== 404) {
      const extra: Record<string, string> = {};
      if (isMarkdownPage) {
        extra.Link = `<${new URL(mirrorPathFor(pathname), url.origin).toString()}>; rel="alternate"; type="text/markdown"`;
        extra.Vary = 'Accept';
      }
      return withHeaders(asset, request, extra);
    }

    // 4. Unknown paths: retired profile-style routes are 410, the rest 404.
    const parts = pathname.split('/').filter(Boolean);
    if (!isAssetPath(pathname) && parts.length >= 1 && parts.length <= 2 && !pathname.startsWith('/templates/')) {
      return gone(request);
    }
    return notFound(request);
  },
};
