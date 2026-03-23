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
}
export type ProfileFormData = Omit<Profile, 'slug' | 'editToken' | 'createdAt' | 'views'>;
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