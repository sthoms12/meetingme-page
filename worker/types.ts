import type { Profile, VersionSnapshot, ViewLog } from "@shared/types";

export interface StoredSession {
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
}

export interface StoredProfile extends Omit<Profile, "canManage"> {
  editTokenHash: string;
  passwordHash?: string;
  managementSessions: StoredSession[];
}

export interface StoredPhotoAsset {
  contentType: string;
  bytes: number[];
  updatedAt: string;
}

export interface RateLimitState {
  count: number;
  resetAt: number;
}

export interface PublicProfileResponse {
  slug: string;
  fullName: string;
  jobTitle?: string;
  company?: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  phone?: string;
  createdAt?: string;
  activeVariant?: Profile["variants"][number];
  isLocked: boolean;
  canManage?: boolean;
}

export type ProfileHistory = VersionSnapshot[];
export type ProfileAnalytics = ViewLog[];
