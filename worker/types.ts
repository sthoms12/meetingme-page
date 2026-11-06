import type { Profile, VersionSnapshot, ViewLog } from "@shared/types";

export interface StoredSession {
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
}

export interface PasskeyCredential {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
  deviceLabel?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface RecoveryCodeState {
  codeHash: string;
  createdAt: string;
  lastRotatedAt?: string;
  revealedAt?: string;
}

export interface PendingChallenge {
  challenge: string;
  type: "register" | "auth";
  createdAt: string;
}

export interface StoredProfile extends Omit<Profile, "canManage"> {
  editTokenHash: string;
  editTokenRotatedAt?: string;
  passwordHash?: string;
  managementSessions: StoredSession[];
  passkeys?: PasskeyCredential[];
  recoveryCode?: RecoveryCodeState;
  /**
   * Legacy single-slot challenge. Registration and authentication ceremonies
   * used to share this slot, so an unauthenticated auth/start could overwrite
   * an in-progress manager registration. New ceremonies write the per-type
   * slots below; this field is only read as a fallback for records written
   * before the split and is cleared whenever a new ceremony starts.
   */
  pendingChallenge?: PendingChallenge;
  pendingRegistrationChallenge?: PendingChallenge;
  pendingAuthChallenge?: PendingChallenge;
  lastManagementAccessMethod?: "initial" | "edit-token" | "passkey" | "recovery-code";
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
