import { DurableObject } from "cloudflare:workers";
import type { DemoItem, Profile, ProfileVariant, ViewLog, VersionSnapshot } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    async getProfile(slug: string): Promise<Profile | null> {
      const profile = await this.ctx.storage.get<Profile>(`profile_${slug}`);
      return profile || null;
    }
    async createProfile(profile: Profile): Promise<void> {
      await this.ctx.storage.put(`profile_${profile.slug}`, profile);
    }
    async incrementProfileViews(slug: string, variantSlug?: string, source?: string): Promise<void> {
      const profile = await this.getProfile(slug);
      if (!profile) return;
      const variant = variantSlug 
        ? profile.variants.find(v => v.variantSlug === variantSlug)
        : profile.variants.find(v => v.id === profile.primaryVariantId);
      if (!variant) return;
      const updatedVariants = profile.variants.map(v => {
        if (v.id === variant.id) {
          return { ...v, views: (v.views || 0) + 1 };
        }
        return v;
      });
      const newLog: ViewLog = {
        timestamp: new Date().toISOString(),
        variantId: variant.id,
        source: source || 'direct'
      };
      const analytics = profile.analytics || [];
      const updatedAnalytics = [newLog, ...analytics].slice(0, 500); // Cap at 500 entries
      await this.ctx.storage.put(`profile_${slug}`, { 
        ...profile, 
        variants: updatedVariants,
        analytics: updatedAnalytics
      });
    }
    async captureSnapshot(slug: string, label: string): Promise<void> {
      const profile = await this.getProfile(slug);
      if (!profile) return;
      const snapshot: VersionSnapshot = {
        timestamp: new Date().toISOString(),
        label,
        variants: JSON.parse(JSON.stringify(profile.variants))
      };
      const history = profile.history || [];
      const updatedHistory = [snapshot, ...history].slice(0, 10); // Keep last 10
      await this.ctx.storage.put(`profile_${slug}`, { ...profile, history: updatedHistory });
    }
    async restoreSnapshot(slug: string, token: string, timestamp: string): Promise<Profile | null> {
      const profile = await this.getProfile(slug);
      if (!profile || profile.editToken !== token || !profile.history) return null;
      const snapshot = profile.history.find(s => s.timestamp === timestamp);
      if (!snapshot) return null;
      const updatedProfile: Profile = {
        ...profile,
        variants: snapshot.variants,
        primaryVariantId: snapshot.variants[0]?.id || profile.primaryVariantId
      };
      await this.ctx.storage.put(`profile_${slug}`, updatedProfile);
      return updatedProfile;
    }
    async updateProfile(slug: string, token: string, updates: Partial<Profile>): Promise<Profile | null> {
      const profile = await this.getProfile(slug);
      if (!profile || profile.editToken !== token) {
        return null;
      }
      const updatedProfile: Profile = { ...profile, ...updates };
      await this.ctx.storage.put(`profile_${slug}`, updatedProfile);
      return updatedProfile;
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