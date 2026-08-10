import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { userRoutes } from "../worker/userRoutes";
import type { StoredProfile, StoredSession } from "../worker/types";

class MemoryStub {
  profile: StoredProfile | null = null;
  reserved = new Set<string>();
  limits = new Map<string, { count: number; resetAt: number }>();

  async isSlugReserved(slug: string) { return this.reserved.has(slug); }
  async reserveSlug(slug: string) {
    if (this.reserved.has(slug)) return false;
    this.reserved.add(slug);
    return true;
  }
  async releaseSlug(slug: string) { this.reserved.delete(slug); }
  async getProfile() { return this.profile; }
  async createProfile(profile: StoredProfile) { this.profile = structuredClone(profile); }
  async updateProfile(updates: Partial<StoredProfile>) {
    if (!this.profile) return null;
    this.profile = { ...this.profile, ...structuredClone(updates) };
    return this.profile;
  }
  async replaceSessions(sessions: StoredSession[]) { return this.updateProfile({ managementSessions: sessions }); }
  async captureSnapshot(label: string) {
    if (!this.profile) return;
    this.profile.history = [{
      timestamp: new Date().toISOString(),
      label,
      variants: structuredClone(this.profile.variants),
    }, ...(this.profile.history || [])];
  }
  async restoreSnapshot(timestamp: string) {
    if (!this.profile) return null;
    const snapshot = this.profile.history?.find((item) => item.timestamp === timestamp);
    if (!snapshot) return null;
    this.profile = {
      ...this.profile,
      variants: structuredClone(snapshot.variants),
      primaryVariantId: snapshot.variants[0]?.id || this.profile.primaryVariantId,
    };
    return this.profile;
  }
  async incrementProfileViews(variantSlug?: string, source?: string) {
    if (!this.profile) return;
    const target = variantSlug
      ? this.profile.variants.find((variant) => variant.variantSlug === variantSlug)
      : this.profile.variants.find((variant) => variant.id === this.profile?.primaryVariantId);
    if (!target) return;
    target.views = (target.views || 0) + 1;
    this.profile.analytics = [{ timestamp: new Date().toISOString(), variantId: target.id, source: source || "direct" }, ...(this.profile.analytics || [])];
  }
  async getPhoto() { return null; }
  async storePhoto() {}
  async clearPhoto() {}
  async checkRateLimit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const state = this.limits.get(key);
    if (!state || state.resetAt <= now) {
      this.limits.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterMs: 0 };
    }
    if (state.count >= limit) return { allowed: false, retryAfterMs: state.resetAt - now };
    state.count += 1;
    return { allowed: true, retryAfterMs: 0 };
  }
}

const createHarness = () => {
  const stubs = new Map<string, MemoryStub>();
  const namespace = {
    idFromName: (name: string) => name,
    get: (id: string) => {
      if (!stubs.has(id)) stubs.set(id, new MemoryStub());
      return stubs.get(id)!;
    },
  };
  const app = new Hono();
  userRoutes(app as never);
  const request = (path: string, init?: RequestInit) => app.request(`https://b4wemeet.test${path}`, init, { GlobalDurableObject: namespace } as never);
  return { request, stubs };
};

const profileInput = {
  fullName: "Jane Example",
  jobTitle: "Product Lead",
  company: "Example Co",
  profilePhoto: "",
  linkedinUrl: "",
  websiteUrl: "",
  videoUrl: "",
  twitterUrl: "",
  githubUrl: "",
  phone: "",
  customSlug: "jane-example",
  password: "",
  variantName: "Default",
  variantSlug: "intro",
  bio: "I help teams arrive prepared for useful meetings.",
  focus: "Better meetings",
  topics: "Product strategy, collaboration",
  meetingNote: "Bring the decision that needs to be made.",
};

const jsonRequest = (method: string, body: unknown, cookie?: string): RequestInit => ({
  method,
  headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
  body: JSON.stringify(body),
});

describe("critical API workflows", () => {
  test("creates a profile, exposes public data, and exchanges its management token", async () => {
    const { request } = createHarness();
    const created = await request("/api/profiles", jsonRequest("POST", profileInput));
    expect(created.status).toBe(200);
    expect(created.headers.get("set-cookie")).toContain("SameSite=Strict");
    const createdBody = await created.json() as { data: { slug: string; editToken: string } };
    expect(createdBody.data.slug).toBe("jane-example");

    const publicResponse = await request("/api/profiles/jane-example?src=test");
    expect(publicResponse.status).toBe(200);
    const publicBody = await publicResponse.json() as { data: Record<string, unknown> };
    expect(publicBody.data.fullName).toBe("Jane Example");
    expect(publicBody.data.editTokenHash).toBeUndefined();

    const exchanged = await request(
      "/api/profiles/jane-example/session",
      jsonRequest("POST", { editToken: createdBody.data.editToken }),
    );
    expect(exchanged.status).toBe(200);
    const cookie = exchanged.headers.get("set-cookie")?.split(";")[0];
    expect(cookie).toContain("meetingme_manage_jane-example=");

    const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie: cookie! } });
    expect(managed.status).toBe(200);
  });

  test("updates and restores a profile through an authenticated session", async () => {
    const { request } = createHarness();
    const created = await request("/api/profiles", jsonRequest("POST", profileInput));
    const createdBody = await created.json() as { data: { editToken: string } };
    const exchanged = await request("/api/profiles/jane-example/session", jsonRequest("POST", { editToken: createdBody.data.editToken }));
    const cookie = exchanged.headers.get("set-cookie")!.split(";")[0];

    const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    const managedBody = await managed.json() as { data: StoredProfile };
    const originalVariant = managedBody.data.variants[0];
    const { password: _password, customSlug: _customSlug, variantName: _variantName, variantSlug: _variantSlug, bio: _bio, focus: _focus, topics: _topics, meetingNote: _meetingNote, ...baseFields } = profileInput;
    const update = {
      ...baseFields,
      fullName: "Jane Updated",
      primaryVariantId: originalVariant.id,
      variants: [{ ...originalVariant, bio: "This updated biography is long enough to pass validation." }],
      removePassword: false,
    };
    const updated = await request("/api/profiles/jane-example", jsonRequest("PUT", update, cookie));
    expect(updated.status).toBe(200);

    const afterUpdate = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    const afterUpdateBody = await afterUpdate.json() as { data: StoredProfile };
    expect(afterUpdateBody.data.fullName).toBe("Jane Updated");
    expect(afterUpdateBody.data.variants[0].bio).toContain("updated biography");
    const snapshot = afterUpdateBody.data.history![0];

    const restored = await request(
      "/api/profiles/jane-example/history/restore",
      jsonRequest("POST", { timestamp: snapshot.timestamp }, cookie),
    );
    expect(restored.status).toBe(200);
    const restoredBody = await restored.json() as { data: StoredProfile };
    expect(restoredBody.data.variants[0].bio).toBe(profileInput.bio);
  });

  test("rotates a recovery code and redeems it once", async () => {
    const { request } = createHarness();
    const created = await request("/api/profiles", jsonRequest("POST", profileInput));
    const cookie = created.headers.get("set-cookie")!.split(";")[0];
    const revealed = await request(
      "/api/profiles/jane-example/recovery-code/reveal",
      { method: "POST", headers: { cookie } },
    );
    expect(revealed.status).toBe(200);
    const revealedBody = await revealed.json() as { data: { code: string } };

    const redeemed = await request(
      "/api/profiles/jane-example/recovery-code/redeem",
      jsonRequest("POST", { code: revealedBody.data.code }),
    );
    expect(redeemed.status).toBe(200);
    expect(redeemed.headers.get("set-cookie")).toContain("SameSite=Strict");

    const replay = await request(
      "/api/profiles/jane-example/recovery-code/redeem",
      jsonRequest("POST", { code: revealedBody.data.code }),
    );
    expect(replay.status).toBe(401);
  });
});
