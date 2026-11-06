import type { ProfileVariant } from "@shared/types";
import { HOME_DESCRIPTION } from "./landing";
import { escapeJsonForScript } from "./security";
import type { StoredProfile } from "./types";

/**
 * Server-side rendering helpers for profile pages. These live outside
 * worker/index.ts so the test suite can exercise them directly (the
 * worker entry re-exports the Durable Object class, which cannot be
 * imported outside the Workers runtime).
 */

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

export const shorten = (value: string, maxLength = 160) => {
  const normalized = normalizeText(value);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

export const absoluteUrl = (request: Request, path: string) => new URL(path, request.url).toString();

const buildHomeDescription = () => HOME_DESCRIPTION;

export const buildProfileDescription = (profile: StoredProfile, variant: ProfileVariant) => {
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

export const buildProfileBody = (
  request: Request,
  profile: StoredProfile,
  variant: ProfileVariant,
  locked: boolean,
  canonicalPath: string,
) => {
  // Locked profiles expose only fullName + locked state here, matching the
  // JSON API: no job/company line and no links (including the phone number).
  const links = locked ? '' : [
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
    ${locked ? '' : `<p>${escapeHtml(`${profile.jobTitle} at ${profile.company}`)}</p>`}
    ${locked ? '<p>This introduction is password protected.</p>' : `<p>${escapeHtml(variant.bio)}</p>`}
    ${!locked && variant.focus ? `<p><strong>Primary focus:</strong> ${escapeHtml(variant.focus)}</p>` : ''}
    ${!locked && variant.topics.length ? `<p><strong>Topics:</strong> ${escapeHtml(variant.topics.join(', '))}</p>` : ''}
    ${!locked && variant.meetingNote ? `<p><strong>Pre-meeting note:</strong> ${escapeHtml(variant.meetingNote)}</p>` : ''}
    ${links ? `<section><h2>Links</h2><ul>${links}</ul></section>` : ''}
    <p><a href="${escapeHtml(absoluteUrl(request, canonicalPath))}">Open this introduction</a></p>
  </article>
</main>`;
};

export const buildStructuredData = (request: Request, profile?: StoredProfile, variant?: ProfileVariant, canonicalPath?: string) => {
  if (!profile || !variant || !canonicalPath || profile.passwordHash) {
    return escapeJsonForScript(JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'B4WeMeet',
      applicationCategory: 'BusinessApplication',
      description: buildHomeDescription(),
      url: absoluteUrl(request, '/'),
    }));
  }

  return escapeJsonForScript(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.fullName,
    jobTitle: profile.jobTitle,
    worksFor: { '@type': 'Organization', name: profile.company },
    description: buildProfileDescription(profile, variant),
    url: absoluteUrl(request, canonicalPath),
    sameAs: [profile.linkedinUrl, profile.websiteUrl, profile.videoUrl, profile.twitterUrl, profile.githubUrl].filter(Boolean),
  }));
};
