import type { FaqEntry } from '../data/types';
import { SITE_NAME, SITE_ORIGIN } from './pages';

/**
 * Escape a JSON string for safe embedding inside a <script> block.
 * Ported from the old worker/security.ts (security audit run 1, PR #25):
 * prevents a stored string from breaking out of the script context.
 */
export const escapeJsonForScript = (json: string) =>
  json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * FAQPage JSON-LD built from the exact FaqEntry array that renders as
 * visible Q&A on the page — schema and page text match by construction.
 */
export function faqJsonLd(faqs: FaqEntry[]) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return escapeJsonForScript(JSON.stringify(data));
}

export function articleJsonLd(input: { path: string; title: string; description: string }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title.replace(/ \| B4WeMeet$/, ''),
    description: input.description,
    mainEntityOfPage: `${SITE_ORIGIN}${input.path}`,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_ORIGIN },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_ORIGIN },
  };
  return escapeJsonForScript(JSON.stringify(data));
}

export function webSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_ORIGIN,
  };
  return escapeJsonForScript(JSON.stringify(data));
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path}`,
    })),
  };
  return escapeJsonForScript(JSON.stringify(data));
}

export function breadcrumbsForPath(path: string, title: string): string | null {
  if (path === '/') return null;
  const cleanTitle = title.replace(/ \| B4WeMeet$/, '');
  if (path === '/templates/') {
    return breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Meeting Templates', path: '/templates/' },
    ]);
  }
  if (path.startsWith('/templates/')) {
    return breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Templates', path: '/templates/' },
      { name: cleanTitle, path },
    ]);
  }
  return breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: cleanTitle, path },
  ]);
}

