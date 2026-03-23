export interface Profile {
  slug: string;
  editToken: string;
  fullName: string;
  jobTitle: string;
  company: string;
  bio: string;
  profilePhoto?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  createdAt: string;
  views?: number;
  passwordHash?: string; // SHA-256 hash of the optional page password
}
export type ProfileFormData = Omit<Profile, 'slug' | 'editToken' | 'createdAt' | 'views' | 'passwordHash'> & {
  password?: string;
};
export interface ProfilePublicResponse {
  fullName: string;
  isLocked: boolean;
  profile?: Omit<Profile, 'editToken' | 'passwordHash'>;
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