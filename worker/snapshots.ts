import type { ProfileVariant, VersionSnapshot } from "@shared/types";
import type { StoredProfile } from "./types";

/**
 * Full-profile version snapshots.
 *
 * A snapshot captures everything a visitor can see — identity, links, photo
 * reference, audience variants and which variant is primary — so restoring
 * one is a real rollback. Credentials and owner-only state (edit-token hash,
 * visitor password hash, sessions, passkeys, recovery code, analytics and
 * the history list itself) are never copied into a snapshot and are never
 * touched by a restore.
 *
 * Optional fields are recorded as "" when unset so a restore can also
 * *remove* a link or photo that was added after the snapshot was taken.
 * Snapshots written before this change have no identity fields at all;
 * restoring one of those leaves the current identity untouched.
 */

const REQUIRED_FIELDS = ["fullName", "jobTitle", "company"] as const;

const OPTIONAL_FIELDS = [
  "profilePhoto",
  "linkedinUrl",
  "websiteUrl",
  "videoUrl",
  "twitterUrl",
  "githubUrl",
  "phone",
] as const;

const cloneVariants = (variants: ProfileVariant[]): ProfileVariant[] =>
  JSON.parse(JSON.stringify(variants)) as ProfileVariant[];

export function buildSnapshot(
  profile: StoredProfile,
  label: string,
  timestamp: string = new Date().toISOString(),
): VersionSnapshot {
  const snapshot: VersionSnapshot = {
    timestamp,
    label,
    variants: cloneVariants(profile.variants),
    primaryVariantId: profile.primaryVariantId,
  };

  for (const field of REQUIRED_FIELDS) snapshot[field] = profile[field];
  for (const field of OPTIONAL_FIELDS) snapshot[field] = profile[field] ?? "";

  return snapshot;
}

export function applySnapshot(profile: StoredProfile, snapshot: VersionSnapshot): StoredProfile {
  const variants = cloneVariants(snapshot.variants);

  // Preserve the current primary when the snapshot's primary no longer
  // exists among the restored variants; only fall back to the first
  // restored variant when neither is available.
  const primaryVariantId =
    snapshot.primaryVariantId && variants.some((variant) => variant.id === snapshot.primaryVariantId)
      ? snapshot.primaryVariantId
      : profile.primaryVariantId && variants.some((variant) => variant.id === profile.primaryVariantId)
        ? profile.primaryVariantId
        : variants[0]?.id || profile.primaryVariantId;

  const restored: StoredProfile = {
    ...profile,
    variants,
    primaryVariantId,
  };

  for (const field of REQUIRED_FIELDS) {
    const value = snapshot[field];
    if (value !== undefined) restored[field] = value;
  }
  for (const field of OPTIONAL_FIELDS) {
    const value = snapshot[field];
    if (value !== undefined) restored[field] = value === "" ? undefined : value;
  }

  return restored;
}
