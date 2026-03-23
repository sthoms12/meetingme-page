import { DurableObject } from "cloudflare:workers";
import type { DemoItem, Profile } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
export class GlobalDurableObject extends DurableObject {
    // Profile Methods
    async getProfile(slug: string): Promise<Profile | null> {
      const profile = await this.ctx.storage.get<Profile>(`profile_${slug}`);
      return profile || null;
    }
    async createProfile(profile: Profile): Promise<void> {
      await this.ctx.storage.put(`profile_${profile.slug}`, { ...profile, views: 0 });
    }
    async incrementProfileViews(slug: string): Promise<number> {
      const profile = await this.getProfile(slug);
      if (!profile) return 0;
      const currentViews = profile.views || 0;
      const newViews = currentViews + 1;
      await this.ctx.storage.put(`profile_${slug}`, { ...profile, views: newViews });
      return newViews;
    }
    async updateProfile(slug: string, token: string, updates: Partial<Profile>): Promise<Profile | null> {
      const profile = await this.getProfile(slug);
      if (!profile || profile.editToken !== token) {
        return null;
      }
      // Ensure we don't accidentally overwrite views if not provided in updates
      const updatedProfile: Profile = { ...profile, ...updates };
      await this.ctx.storage.put(`profile_${slug}`, updatedProfile);
      return updatedProfile;
    }
    // Existing Template Methods
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get<number>("counter_value")) || 0;
      return value;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get<number>("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get<DemoItem[]>("demo_items");
      if (items) {
        return items;
      }
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