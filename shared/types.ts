export interface ViewLog {
  timestamp: string;
  variantId: string;
  source?: string;
  country?: string;
}
export interface VersionSnapshot {
  timestamp: string;
  label: string;
  variants: ProfileVariant[];
}
export interface ProfileVariant {
  id: string;
  name: string;
  variantSlug: string; // e.g. "default", "client", "interview"
  bio: string;
  focus: string;
  topics: string[];
  meetingNote?: string;
  views: number;
}
export interface Profile {
  slug: string;
  editToken: string;
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
  passwordHash?: string;
  variants: ProfileVariant[];
  primaryVariantId: string;
  analytics?: ViewLog[];
  history?: VersionSnapshot[];
}
export type ProfileFormData = Omit<Profile, 'slug' | 'editToken' | 'createdAt' | 'variants' | 'primaryVariantId' | 'passwordHash' | 'analytics' | 'history'> & {
  password?: string;
  variantName: string;
  variantSlug: string;
  bio: string;
  focus: string;
  topics: string; // Comma-separated for form input
  meetingNote?: string;
};
export interface ProfilePublicResponse {
  fullName: string;
  isLocked: boolean;
  profile?: Omit<Profile, 'editToken' | 'passwordHash' | 'variants' | 'history' | 'analytics'> & {
    activeVariant: ProfileVariant;
  };
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