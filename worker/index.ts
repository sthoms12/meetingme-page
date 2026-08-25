import { Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { logger } from 'hono/logger';
import { Env as CoreEnv } from './core-utils';
import type { ProfileVariant } from '@shared/types';
import type { StoredProfile } from './types';
import { userRoutes } from './userRoutes';
import {
  CLIENT_ERROR_LIMIT,
  CLIENT_ERROR_WINDOW_MS,
  MAX_API_BODY_BYTES,
  MAX_CLIENT_ERROR_BODY_BYTES,
  clientErrorReportSchema,
  getClientKey,
  retryAfterSeconds,
  securityHeaders,
  withSecurityHeaders,
} from './security';

export * from './core-utils';

type AssetEnv = CoreEnv & { ASSETS: Fetcher };

export type ClientErrorReport = { message: string; url: string; timestamp: string } & Record<string, unknown>;

const app = new Hono<{ Bindings: CoreEnv }>();
const INDEX_DO_NAME = '__meetingme_slug_index__';
const ASSET_EXTENSIONS = /\.(?:css|js|mjs|map|svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json|woff2?|ttf|otf)$/i;

app.use('*', logger());

app.use('*', async (c, next) => {
  await next();
  for (const [name, value] of Object.entries(securityHeaders(c.req.raw))) {
    c.header(name, value);
  }
});

app.use('/api/*', bodyLimit({
  maxSize: MAX_API_BODY_BYTES,
  onError: (c) => c.json({ success: false, error: 'Request body too large' }, 413),
}));

app.use('/api/client-errors', bodyLimit({
  maxSize: MAX_CLIENT_ERROR_BODY_BYTES,
  onError: (c) => c.json({ success: false, error: 'Error report too large' }, 413),
}));

app.get('/api/health', (c) => c.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } }));

app.post('/api/client-errors', async (c) => {
  try {
    const limiter = await getIndexStub(c.env).checkRateLimit(
      `client-error:${getClientKey(c.req.raw)}`,
      CLIENT_ERROR_LIMIT,
      CLIENT_ERROR_WINDOW_MS,
    );
    if (!limiter.allowed) {
      c.header('Retry-After', retryAfterSeconds(limiter.retryAfterMs));
      return c.json({ success: false, error: 'Too many error reports' }, 429);
    }

    const parsed = clientErrorReportSchema.safeParse(await c.req.json());
    if (!parsed.success) {
      return c.json({ success: false, error: 'Invalid error report' }, 400);
    }

    const e = parsed.data;
    console.error('[CLIENT ERROR]', JSON.stringify({ timestamp: e.timestamp || new Date().toISOString(), message: e.message, url: e.url, stack: e.stack, componentStack: e.componentStack, errorBoundary: e.errorBoundary }, null, 2));
    return c.json({ success: true });
  } catch (error) {
    console.error('[CLIENT ERROR HANDLER] Failed:', error);
    return c.json({ success: false, error: 'Invalid error report' }, 400);
  }
});

userRoutes(app);

app.notFound((c) => c.json({ success: false, error: 'Not Found' }, 404));
app.onError((err, c) => {
  if (err instanceof SyntaxError) {
    return c.json({ success: false, error: 'Invalid JSON' }, 400);
  }
  console.error(`[ERROR] ${err}`);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

const getIndexStub = (env: CoreEnv) =>
  env.GlobalDurableObject.get(env.GlobalDurableObject.idFromName(INDEX_DO_NAME));

const getProfileStub = (env: CoreEnv, slug: string) =>
  env.GlobalDurableObject.get(env.GlobalDurableObject.idFromName(`profile:${slug}`));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

const shorten = (value: string, maxLength = 160) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

const absoluteUrl = (request: Request, path: string) => new URL(path, request.url).toString();

const isAssetRequest = (pathname: string) =>
  pathname.startsWith('/assets/') ||
  pathname.startsWith('/src/') ||
  pathname.startsWith('/@vite/') ||
  pathname === '/@react-refresh' ||
  pathname === '/favicon.ico' ||
  pathname === '/b4wemeet-icon.svg' ||
  ASSET_EXTENSIONS.test(pathname);

const getPrimaryVariant = (profile: StoredProfile, variantSlug?: string) =>
  variantSlug
    ? profile.variants.find((variant) => variant.variantSlug === variantSlug)
    : profile.variants.find((variant) => variant.id === profile.primaryVariantId);

const buildHomeDescription = () =>
  'B4WeMeet helps you create a concise pre-meeting intro page with your bio, role, links, focus areas, and talking points so people arrive prepared.';

const buildProfileDescription = (profile: StoredProfile, variant: ProfileVariant) => {
  const pieces = [
    `${profile.fullName}`,
    profile.jobTitle ? `${profile.jobTitle} at ${profile.company}` : profile.company,
    variant.focus || '',
    variant.bio || '',
  ].filter(Boolean);

  return shorten(pieces.join('. '));
};

const linkItem = (href: string, label: string) =>
  `<li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`;

const buildHomeBody = () => `
<main>
  <header>
    <p>B4WeMeet</p>
    <h1>Send the context before the meeting starts.</h1>
    <p>${escapeHtml(buildHomeDescription())}</p>
    <nav aria-label="Primary">
      <a href="#create-page">Create your page</a>
      <a href="#preview">See the preview</a>
      <a href="#security">Review security</a>
    </nav>
  </header>
  <section>
    <h2>How B4WeMeet works</h2>
    <ol>
      <li>Create a public handle and short profile.</li>
      <li>Add the links, focus areas, and meeting notes people need.</li>
      <li>Share one clean URL before a client call, interview, intro, or advisory conversation.</li>
    </ol>
  </section>
  <section>
    <h2>What visitors see</h2>
    <p>Each page is built for pre-meeting context rather than just social links. Visitors can scan a short bio, understand what you work on, open relevant links, and export a calendar note.</p>
  </section>
</main>`;

const buildProfileBody = (
  request: Request,
  profile: StoredProfile,
  variant: ProfileVariant,
  locked: boolean,
  canonicalPath: string,
) => {
  const links = [
    profile.linkedinUrl && linkItem(profile.linkedinUrl, 'LinkedIn'),
    profile.websiteUrl && linkItem(profile.websiteUrl, 'Website'),
    profile.videoUrl && linkItem(profile.videoUrl, 'Video intro'),
    profile.twitterUrl && linkItem(profile.twitterUrl, 'X / Twitter'),
    profile.githubUrl && linkItem(profile.githubUrl, 'GitHub'),
    profile.phone && linkItem(`tel:${profile.phone}`, 'Phone'),
  ].filter(Boolean).join('');

  return `
<main>
  <p><a href="${escapeHtml(absoluteUrl(request, '/'))}">B4WeMeet</a></p>
  <article>
    <h1>${escapeHtml(profile.fullName)}</h1>
    <p>${escapeHtml(`${profile.jobTitle} at ${profile.company}`)}</p>
    ${locked ? '<p>This introduction is password protected.</p>' : `<p>${escapeHtml(variant.bio)}</p>`}
    ${!locked && variant.focus ? `<p><strong>Primary focus:</strong> ${escapeHtml(variant.focus)}</p>` : ''}
    ${!locked && variant.topics.length ? `<p><strong>Topics:</strong> ${escapeHtml(variant.topics.join(', '))}</p>` : ''}
    ${!locked && variant.meetingNote ? `<p><strong>Pre-meeting note:</strong> ${escapeHtml(variant.meetingNote)}</p>` : ''}
    ${links ? `<section><h2>Links</h2><ul>${links}</ul></section>` : ''}
    <p><a href="${escapeHtml(absoluteUrl(request, canonicalPath))}">Open this introduction</a></p>
  </article>
</main>`;
};

const buildNotFoundBody = () => `
<main>
  <h1>Introduction not found</h1>
  <p>This B4WeMeet page is unavailable or the handle has changed.</p>
  <p><a href="/">Create your own intro page</a></p>
</main>`;

const buildEditBody = (slug: string) => `
<main>
  <h1>Manage your B4WeMeet page</h1>
  <p>This dashboard is private and should not be indexed.</p>
  <p><a href="/${escapeHtml(slug)}">View public page</a></p>
</main>`;

const buildStructuredData = (request: Request, profile?: StoredProfile, variant?: ProfileVariant, canonicalPath?: string) => {
  if (!profile || !variant || !canonicalPath || profile.passwordHash) {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'SoftwareApplication', name: 'B4WeMeet', applicationCategory: 'BusinessApplication', description: buildHomeDescription(), url: absoluteUrl(request, '/'), creator: { '@id': `${absoluteUrl(request, '/')}#creator` } },
        { '@type': 'Person', '@id': `${absoluteUrl(request, '/')}#creator`, name: 'Steve Thoms', url: 'https://www.linkedin.com/in/steve-thoms-81381990', sameAs: ['https://www.linkedin.com/in/steve-thoms-81381990', 'https://x.com/thomstech12'] },
      ],
    });
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.jobTitle,
    worksFor: { '@type': 'Organization', name: profile.company },
    description: buildProfileDescription(profile, variant),
    url: absoluteUrl(request, canonicalPath),
    sameAs: [profile.linkedinUrl, profile.websiteUrl, profile.videoUrl, profile.twitterUrl, profile.githubUrl].filter(Boolean),
  });
};

const rewriteHtml = async (
  response: Response,
  request: Request,
  options: {
    title: string;
    description: string;
    canonicalPath: string;
    bodyHtml: string;
    robots?: string;
    status?: number;
    imageUrl?: string;
    structuredData?: string;
  },
) => {
  const metaTags = [
    `<meta name="description" content="${escapeHtml(options.description)}">`,
    `<link rel="canonical" href="${escapeHtml(absoluteUrl(request, options.canonicalPath))}">`,
    `<meta name="robots" content="${escapeHtml(options.robots || 'index,follow')}">`,
    `<meta property="og:title" content="${escapeHtml(options.title)}">`,
    `<meta property="og:description" content="${escapeHtml(options.description)}">`,
    `<meta property="og:url" content="${escapeHtml(absoluteUrl(request, options.canonicalPath))}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="B4WeMeet">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(options.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(options.description)}">`,
    options.imageUrl ? `<meta property="og:image" content="${escapeHtml(options.imageUrl)}">` : '',
    options.imageUrl ? `<meta name="twitter:image" content="${escapeHtml(options.imageUrl)}">` : '',
    options.structuredData ? `<script type="application/ld+json">${options.structuredData}</script>` : '',
  ].filter(Boolean).join('');

  const transformed = new HTMLRewriter()
    .on('title', {
      element(element) {
        element.setInnerContent(options.title);
      },
    })
    .on('head', {
      element(element) {
        element.append(metaTags, { html: true });
      },
    })
    .on('#root', {
      element(element) {
        element.setInnerContent(options.bodyHtml, { html: true });
      },
    })
    .transform(response);

  const rewritten = new Response(transformed.body, transformed);
  if (options.robots) rewritten.headers.set('x-robots-tag', options.robots);
  rewritten.headers.set('content-type', 'text/html; charset=UTF-8');
  return new Response(rewritten.body, {
    status: options.status || rewritten.status,
    statusText: rewritten.statusText,
    headers: rewritten.headers,
  });
};

const getShellResponse = (_request: Request, env: AssetEnv) =>
  env.ASSETS.fetch('https://assets.local/index.html');

const buildRobots = (request: Request) => `User-agent: *
Allow: /
Disallow: /api/
Disallow: /*/edit

Sitemap: ${absoluteUrl(request, '/sitemap.xml')}
`;

const buildSitemap = async (request: Request, env: AssetEnv) => {
  const entries: string[] = [
    `<url><loc>${escapeHtml(absoluteUrl(request, '/'))}</loc></url>`,
  ];

  const slugs = await getIndexStub(env).listReservedSlugs();
  for (const slug of slugs) {
    const profile = await getProfileStub(env, slug).getProfile();
    if (!profile || profile.passwordHash) continue;

    entries.push(
      `<url><loc>${escapeHtml(absoluteUrl(request, `/${slug}`))}</loc><lastmod>${escapeHtml(profile.createdAt)}</lastmod></url>`,
    );

    for (const variant of profile.variants) {
      if (variant.id === profile.primaryVariantId) continue;
      entries.push(
        `<url><loc>${escapeHtml(absoluteUrl(request, `/${slug}/${variant.variantSlug}`))}</loc><lastmod>${escapeHtml(profile.createdAt)}</lastmod></url>`,
      );
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;
};

console.log('Server is running');

const handleRequest = async (request: Request, env: AssetEnv, ctx: ExecutionContext) => {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }

    if (url.pathname === '/robots.txt') {
      return new Response(buildRobots(request), {
        headers: {
          'content-type': 'text/plain; charset=UTF-8',
          'cache-control': 'public, max-age=3600',
        },
      });
    }

    if (url.pathname === '/sitemap.xml') {
      return new Response(await buildSitemap(request, env), {
        headers: {
          'content-type': 'application/xml; charset=UTF-8',
          'cache-control': 'public, max-age=3600',
        },
      });
    }

    if (isAssetRequest(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length === 0) {
      const shell = await getShellResponse(request, env);
      return rewriteHtml(shell, request, {
        title: 'B4WeMeet | Pre-meeting intro pages for better meetings',
        description: buildHomeDescription(),
        canonicalPath: '/',
        bodyHtml: buildHomeBody(),
        structuredData: buildStructuredData(request),
      });
    }

    if (parts.length === 2 && parts[1] === 'edit') {
      const shell = await getShellResponse(request, env);
      return rewriteHtml(shell, request, {
        title: `Manage ${parts[0]} | B4WeMeet`,
        description: 'Private B4WeMeet dashboard for managing your meeting intro page.',
        canonicalPath: `/${parts[0]}/edit`,
        bodyHtml: buildEditBody(parts[0]),
        robots: 'noindex, nofollow',
        structuredData: buildStructuredData(request),
      });
    }

    if (parts.length === 1 || parts.length === 2) {
      const [slug, variantSlug] = parts;
      const profile = await getProfileStub(env, slug).getProfile();
      const shell = await getShellResponse(request, env);

      if (!profile) {
        return rewriteHtml(shell, request, {
          title: 'Introduction Not Found | B4WeMeet',
          description: 'This B4WeMeet page is unavailable or no longer exists.',
          canonicalPath: url.pathname,
          bodyHtml: buildNotFoundBody(),
          robots: 'noindex, nofollow',
          status: 404,
          structuredData: buildStructuredData(request),
        });
      }

      const variant = getPrimaryVariant(profile, variantSlug);
      if (!variant) {
        return rewriteHtml(shell, request, {
          title: 'Introduction Not Found | B4WeMeet',
          description: 'This B4WeMeet page variant is unavailable or no longer exists.',
          canonicalPath: url.pathname,
          bodyHtml: buildNotFoundBody(),
          robots: 'noindex, nofollow',
          status: 404,
          structuredData: buildStructuredData(request),
        });
      }

      const canonicalPath = variant.id === profile.primaryVariantId ? `/${slug}` : `/${slug}/${variant.variantSlug}`;
      const locked = Boolean(profile.passwordHash);
      const title = locked
        ? `${profile.fullName} | Protected intro | B4WeMeet`
        : `${profile.fullName} | ${profile.jobTitle} at ${profile.company} | B4WeMeet`;
      const description = locked
        ? `${profile.fullName} has shared a password-protected B4WeMeet intro page.`
        : buildProfileDescription(profile, variant);

      return rewriteHtml(shell, request, {
        title: shorten(title, 65),
        description,
        canonicalPath,
        bodyHtml: buildProfileBody(request, profile, variant, locked, canonicalPath),
        robots: locked ? 'noindex, nofollow' : 'index,follow',
        imageUrl: profile.profilePhoto ? absoluteUrl(request, profile.profilePhoto) : undefined,
        structuredData: buildStructuredData(request, profile, variant, canonicalPath),
      });
    }

    return env.ASSETS.fetch(request);
};

export default {
  async fetch(request: Request, env: AssetEnv, ctx: ExecutionContext) {
    return withSecurityHeaders(await handleRequest(request, env, ctx), request);
  },
} satisfies ExportedHandler<AssetEnv>;
