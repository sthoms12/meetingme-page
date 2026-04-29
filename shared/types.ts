export interface ProfileVariant {
  id: string;
  name: string;
  variantSlug: string; // e.g. "default", "client", "interview"
  bio: string;
  focus: string;
  topics: string[];
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
  createdAt: string;
  passwordHash?: string;
  variants: ProfileVariant[];
  primaryVariantId: string;
}
export type ProfileFormData = Omit<Profile, 'slug' | 'editToken' | 'createdAt' | 'variants' | 'primaryVariantId' | 'passwordHash'> & {
  password?: string;
  variantName: string;
  variantSlug: string;
  bio: string;
  focus: string;
  topics: string; // Comma-separated for form input
};
export interface ProfilePublicResponse {
  fullName: string;
  isLocked: boolean;
  profile?: Omit<Profile, 'editToken' | 'passwordHash' | 'variants'> & {
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