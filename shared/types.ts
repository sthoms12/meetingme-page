export interface ViewLog {
  timestamp: string;
  variantId: string;
  source?: string;
  country?: string;
}

export interface VersionSnapshot {
  timestamp: string;
  label: string;
  /**
   * Full public profile as of the snapshot. The identity/link fields are
   * optional only because snapshots written before the full-profile change
   * captured variants alone; restoring one of those legacy snapshots leaves
   * the current identity fields untouched. Credentials are never snapshotted.
   */
  fullName?: string;
  jobTitle?: string;
  company?: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  phone?: string;
  primaryVariantId?: string;
  variants: ProfileVariant[];
}

export interface ProfileVariant {
  id: string;
  name: string;
  variantSlug: string;
  bio: string;
  focus: string;
  topics: string[];
  meetingNote?: string;
  views: number;
}

export interface Profile {
  slug: string;
  fullName: string;
  jobTitle: string;
  company: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  phone?: string;
  createdAt: string;
  variants: ProfileVariant[];
  primaryVariantId: string;
  analytics?: ViewLog[];
  history?: VersionSnapshot[];
  canManage?: boolean;
  /** Manager-only responses: whether a visitor password is currently set. The hash itself is never exposed. */
  hasVisitorPassword?: boolean;
}

export type ProfileFormData = {
  fullName: string;
  jobTitle: string;
  company: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  twitterUrl?: string;
  githubUrl?: string;
  phone?: string;
  password?: string;
  variantName: string;
  variantSlug: string;
  bio: string;
  focus: string;
  topics: string;
  meetingNote?: string;
};

export interface ProfileCreateResponse {
  slug: string;
  editToken: string;
}

export interface ProfilePublicResponse {
  fullName: string;
  isLocked: boolean;
  canManage?: boolean;
  activeVariant?: ProfileVariant;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface DemoItem {
  id: string;
  name: string;
  value: number;
}

export interface PasskeySummary {
  id: string;
  deviceLabel?: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface SessionSummary {
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
}

export interface AccessInfo {
  passkeys: PasskeySummary[];
  recoveryCodeConfigured: boolean;
  recoveryCodeLastRotatedAt?: string;
  editTokenRotatedAt?: string;
  lastManagementAccessMethod?: string;
  sessions: SessionSummary[];
}
