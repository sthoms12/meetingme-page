import { DurableObject } from "cloudflare:workers";
import type { DemoItem, Profile, ViewLog, VersionSnapshot } from "@shared/types";
import { MOCK_ITEMS } from "@shared/mock-data";
import type {
  ProfileAnalytics,
  ProfileHistory,
  RateLimitState,
  StoredPhotoAsset,
  StoredProfile,
  StoredSession,
} from "./types";

const PROFILE_KEY = "profile";
const PHOTO_KEY = "profile_photo";

export class GlobalDurableObject extends DurableObject {
  async listReservedSlugs(): Promise<string[]> {
    const entries = await this.ctx.storage.list<boolean>({ prefix: "slug_" });
    return Array.from(entries.keys()).map((key) => key.replace(/^slug_/, ""));
  }

  async isSlugReserved(slug: string): Promise<boolean> {
    return (await this.ctx.storage.get<boolean>(`slug_${slug}`)) ?? false;
  }

  async reserveSlug(slug: string): Promise<boolean> {
    const key = `slug_${slug}`;
    const existing = await this.ctx.storage.get<boolean>(key);

    if (existing) return false;

    await this.ctx.storage.put(key, true);
    return true;
  }

  async releaseSlug(slug: string): Promise<void> {
    await this.ctx.storage.delete(`slug_${slug}`);
  }

  async getProfile(): Promise<StoredProfile | null> {
    return (await this.ctx.storage.get<StoredProfile>(PROFILE_KEY)) ?? null;
  }

  async createProfile(profile: StoredProfile): Promise<void> {
    await this.ctx.storage.put(PROFILE_KEY, profile);
  }

  async getPhoto(): Promise<StoredPhotoAsset | null> {
    return (await this.ctx.storage.get<StoredPhotoAsset>(PHOTO_KEY)) ?? null;
  }

  async storePhoto(asset: StoredPhotoAsset): Promise<void> {
    await this.ctx.storage.put(PHOTO_KEY, asset);
  }

  async clearPhoto(): Promise<void> {
    await this.ctx.storage.delete(PHOTO_KEY);
  }

  async incrementProfileViews(variantSlug?: string, source?: string): Promise<void> {
    const profile = await this.getProfile();
    if (!profile) return;

    const variant = variantSlug
      ? profile.variants.find((value) => value.variantSlug === variantSlug)
      : profile.variants.find((value) => value.id === profile.primaryVariantId);

    if (!variant) return;

    const updatedVariants = profile.variants.map((value) =>
      value.id === variant.id ? { ...value, views: (value.views || 0) + 1 } : value,
    );

    const newLog: ViewLog = {
      timestamp: new Date().toISOString(),
      variantId: variant.id,
      source: source || "direct",
    };

    const analytics = profile.analytics || [];
    const updatedAnalytics: ProfileAnalytics = [newLog, ...analytics].slice(0, 500);

    await this.ctx.storage.put(PROFILE_KEY, {
      ...profile,
      variants: updatedVariants,
      analytics: updatedAnalytics,
    });
  }

  async captureSnapshot(label: string): Promise<void> {
    const profile = await this.getProfile();
    if (!profile) return;

    const snapshot: VersionSnapshot = {
      timestamp: new Date().toISOString(),
      label,
      variants: JSON.parse(JSON.stringify(profile.variants)),
    };

    const history = profile.history || [];
    const updatedHistory: ProfileHistory = [snapshot, ...history].slice(0, 10);

    await this.ctx.storage.put(PROFILE_KEY, { ...profile, history: updatedHistory });
  }

  async restoreSnapshot(timestamp: string): Promise<StoredProfile | null> {
    const profile = await this.getProfile();
    if (!profile || !profile.history) return null;

    const snapshot = profile.history.find((value) => value.timestamp === timestamp);
    if (!snapshot) return null;

    const updatedProfile: StoredProfile = {
      ...profile,
      variants: snapshot.variants,
      primaryVariantId: snapshot.variants[0]?.id || profile.primaryVariantId,
    };

    await this.ctx.storage.put(PROFILE_KEY, updatedProfile);
    return updatedProfile;
  }

  async updateProfile(updates: Partial<StoredProfile>): Promise<StoredProfile | null> {
    const profile = await this.getProfile();
    if (!profile) return null;

    const updatedProfile: StoredProfile = { ...profile, ...updates };
    await this.ctx.storage.put(PROFILE_KEY, updatedProfile);
    return updatedProfile;
  }

  async replaceSessions(sessions: StoredSession[]): Promise<StoredProfile | null> {
    const profile = await this.getProfile();
    if (!profile) return null;

    const updatedProfile = { ...profile, managementSessions: sessions };
    await this.ctx.storage.put(PROFILE_KEY, updatedProfile);
    return updatedProfile;
  }

  async checkRateLimit(
    key: string,
    limit: number,
    windowMs: number,
  ): Promise<{ allowed: boolean; retryAfterMs: number }> {
    const storageKey = `ratelimit_${key}`;
    const now = Date.now();
    const state = await this.ctx.storage.get<RateLimitState>(storageKey);

    if (!state || state.resetAt <= now) {
      await this.ctx.storage.put(storageKey, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }

    if (state.count >= limit) {
      return { allowed: false, retryAfterMs: state.resetAt - now };
    }

    await this.ctx.storage.put(storageKey, { ...state, count: state.count + 1 });
    return { allowed: true, retryAfterMs: 0 };
  }

  toPublicProfile(profile: StoredProfile): Profile {
    const { editTokenHash: _editTokenHash, passwordHash: _passwordHash, managementSessions: _sessions, ...publicProfile } = profile;
    return publicProfile;
  }

  // Template Methods
  async getCounterValue(): Promise<number> {
    return (await this.ctx.storage.get<number>("counter_value")) || 0;
  }

  async increment(amount = 1): Promise<number> {
    let value: number = (await this.ctx.storage.get<number>("counter_value")) || 0;
    value += amount;
    await this.ctx.storage.put("counter_value", value);
    return value;
  }

  async getDemoItems(): Promise<DemoItem[]> {
    const items = await this.ctx.storage.get<DemoItem[]>("demo_items");
    if (items) return items;

    await this.ctx.storage.put("demo_items", MOCK_ITEMS);
    return MOCK_ITEMS;
  }

  async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
    const items = await this.getDemoItems();
    const updatedItems = [...items, item];
    await this.ctx.storage.put("demo_items", updatedItems);
    return updatedItems;
  }
}
