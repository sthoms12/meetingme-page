import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { buildIntroCardICS } from "../src/lib/calendar-utils";
import { parseCreateDraft, serializeCreateDraft, CREATE_DRAFT_KEY } from "../src/lib/draft";
import { validatePhotoFile } from "../src/lib/photo-upload";
import { applySnapshot, buildSnapshot } from "../worker/snapshots";
import { userRoutes } from "../worker/userRoutes";
import type { StoredProfile, StoredSession } from "../worker/types";

/**
 * Regression tests for the P0 robustness batch:
 * 1. Edit dashboard edits everything create collects (photo validation is
 *    shared; the password API contract is exercised end-to-end below).
 * 2. Create-draft persistence never stores the password or photo.
 * 3. Version snapshots capture and restore the full public profile.
 * 4. The .ics export is an intro card (VTODO), not a fake timed event.
 */

const baseProfile = (): StoredProfile => ({
  slug: "jane-example",
  fullName: "Jane Example",
  jobTitle: "Product Lead",
  company: "Example Co",
  profilePhoto: "/api/profiles/jane-example/photo?v=1",
  linkedinUrl: "https://linkedin.com/in/jane",
  websiteUrl: "https://jane.example",
  videoUrl: "",
  twitterUrl: "https://x.com/jane",
  githubUrl: "",
  phone: "+1 555 0100",
  createdAt: "2026-01-01T00:00:00.000Z",
  variants: [
    { id: "v1", name: "Default", variantSlug: "intro", bio: "Original bio for meetings.", focus: "Focus A", topics: ["One"], views: 3 },
    { id: "v2", name: "Clients", variantSlug: "clients", bio: "Client-facing bio here.", focus: "Focus B", topics: ["Two"], views: 1 },
  ],
  primaryVariantId: "v2",
  analytics: [{ timestamp: "2026-01-02T00:00:00.000Z", variantId: "v1", source: "direct" }],
  history: [],
  editTokenHash: "edit-hash",
  passwordHash: "password-hash",
  managementSessions: [],
  recoveryCode: { codeHash: "recovery-hash", createdAt: "2026-01-01T00:00:00.000Z" },
});

describe("intro card ICS (P0-4)", () => {
  const ics = buildIntroCardICS({
    fullName: "Jane, Doe",
    jobTitle: "Product Lead",
    company: "Acme",
    bio: "First line\nSecond line",
    url: "https://b4wemeet.app/jane-example",
  });

  test("contains no fake event timing", () => {
    expect(ics).not.toContain("DTSTART");
    expect(ics).not.toContain("DTEND");
    expect(ics).not.toContain("BEGIN:VEVENT");
    expect(ics).not.toContain("BEGIN:VALARM");
  });

  test("is a VTODO note carrying the intro details", () => {
    expect(ics).toContain("BEGIN:VTODO");
    expect(ics).toContain("END:VTODO");
    expect(ics).toContain("SUMMARY:Intro card: Jane\\, Doe");
    expect(ics).toContain("https://b4wemeet.app/jane-example");
    expect(ics).toContain("STATUS:NEEDS-ACTION");
  });

  test("keeps the PR #25 escaping (no component injection)", () => {
    const hostile = buildIntroCardICS({
      fullName: "Jane",
      jobTitle: "Lead",
      company: "Acme\r\nBEGIN:VALARM\r\nTRIGGER:-PT0S",
      bio: "bio",
      url: "https://b4wemeet.app/jane",
    });
    const lines = hostile.split("\r\n");
    expect(lines.filter((line) => line === "BEGIN:VALARM")).toHaveLength(0);
    expect(lines.filter((line) => line.startsWith("TRIGGER:"))).toHaveLength(0);
  });
});

describe("create draft serialization (P0-2)", () => {
  test("never includes the visitor password or the photo data URL", () => {
    const serialized = serializeCreateDraft({
      fullName: "Jane Example",
      bio: "A bio",
      password: "<redacted>",
      profilePhoto: "data:image/png;base64,AAAA",
    });
    expect(serialized).not.toContain("draft-secret");
    expect(serialized).not.toContain("data:image");
    const parsed = JSON.parse(serialized) as Record<string, unknown>;
    expect(parsed.fullName).toBe("Jane Example");
    expect("password" in parsed).toBe(false);
    expect("profilePhoto" in parsed).toBe(false);
  });

  test("parse drops excluded fields even from a hand-edited stored draft", () => {
    const parsed = parseCreateDraft(JSON.stringify({ fullName: "Jane", password: "<redacted>", profilePhoto: "data:x" }));
    expect(parsed).toEqual({ fullName: "Jane" });
  });

  test("parse rejects garbage and empty drafts", () => {
    expect(parseCreateDraft(null)).toBeNull();
    expect(parseCreateDraft("not json")).toBeNull();
    expect(parseCreateDraft(JSON.stringify({ fullName: "  " }))).toBeNull();
    expect(CREATE_DRAFT_KEY).toContain("create-draft");
  });
});

describe("photo upload validation (P0-1)", () => {
  test("accepts supported types within the size cap", () => {
    expect(validatePhotoFile({ type: "image/png", size: 500_000 })).toBeNull();
    expect(validatePhotoFile({ type: "image/jpeg", size: 1024 * 1024 })).toBeNull();
  });

  test("rejects unsupported types and oversize files with a message", () => {
    expect(validatePhotoFile({ type: "image/svg+xml", size: 100 })).toContain("Unsupported");
    expect(validatePhotoFile({ type: "image/png", size: 1024 * 1024 + 1 })).toContain("1MB");
  });
});

describe("full-profile snapshots (P0-3)", () => {
  test("capture includes identity, links, photo and primary — and no credentials", () => {
    const snapshot = buildSnapshot(baseProfile(), "Update test", "2026-02-01T00:00:00.000Z");
    expect(snapshot.fullName).toBe("Jane Example");
    expect(snapshot.company).toBe("Example Co");
    expect(snapshot.profilePhoto).toContain("/photo");
    expect(snapshot.linkedinUrl).toContain("linkedin.com");
    expect(snapshot.primaryVariantId).toBe("v2");
    const serialized = JSON.stringify(snapshot);
    expect(serialized).not.toContain("edit-hash");
    expect(serialized).not.toContain("password-hash");
    expect(serialized).not.toContain("recovery-hash");
  });

  test("restore round-trips the full profile and removes fields added later", () => {
    const before = baseProfile();
    const snapshot = buildSnapshot(before, "before", "2026-02-01T00:00:00.000Z");

    const after: StoredProfile = {
      ...before,
      fullName: "Janet Changed",
      company: "Other Co",
      linkedinUrl: undefined,
      githubUrl: "https://github.com/janet",
      profilePhoto: undefined,
      primaryVariantId: "v1",
      variants: [{ id: "v1", name: "Default", variantSlug: "intro", bio: "Edited bio, quite different.", focus: "", topics: [], views: 9 }],
    };

    const restored = applySnapshot(after, snapshot);
    expect(restored.fullName).toBe("Jane Example");
    expect(restored.company).toBe("Example Co");
    expect(restored.linkedinUrl).toBe("https://linkedin.com/in/jane");
    expect(restored.githubUrl).toBeUndefined();
    expect(restored.profilePhoto).toContain("/photo");
    expect(restored.variants).toHaveLength(2);
    expect(restored.primaryVariantId).toBe("v2");
    // Owner-only state is untouched by a restore.
    expect(restored.editTokenHash).toBe("edit-hash");
    expect(restored.passwordHash).toBe("password-hash");
    expect(restored.analytics).toEqual(before.analytics);
  });

  test("restore preserves the current primary when the snapshot's primary is gone", () => {
    const profile = baseProfile();
    const legacy = {
      timestamp: "2025-01-01T00:00:00.000Z",
      label: "legacy",
      primaryVariantId: "deleted-variant",
      variants: [profile.variants[0]],
    };
    const restored = applySnapshot(profile, legacy);
    // Current primary v2 is not among restored variants, snapshot primary is
    // unknown too — falls back to the first restored variant.
    expect(restored.primaryVariantId).toBe("v1");

    const keepCurrent = applySnapshot(profile, {
      timestamp: "2025-01-01T00:00:00.000Z",
      label: "legacy-2",
      variants: profile.variants,
    });
    expect(keepCurrent.primaryVariantId).toBe("v2");
  });

  test("legacy variants-only snapshots leave identity untouched", () => {
    const profile = baseProfile();
    const restored = applySnapshot(profile, {
      timestamp: "2025-01-01T00:00:00.000Z",
      label: "legacy",
      variants: [{ id: "v9", name: "Old", variantSlug: "old", bio: "Old bio from before.", focus: "", topics: [], views: 0 }],
    });
    expect(restored.fullName).toBe("Jane Example");
    expect(restored.company).toBe("Example Co");
    expect(restored.variants[0].id).toBe("v9");
    expect(restored.primaryVariantId).toBe("v9");
  });
});

/** API harness whose stub uses the real snapshot helpers, mirroring the DO. */
class SnapshotStub {
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
  async listReservedSlugs() { return [...this.reserved]; }
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
    this.profile.history = [buildSnapshot(this.profile, label), ...(this.profile.history || [])].slice(0, 10);
  }
  async restoreSnapshot(timestamp: string) {
    if (!this.profile?.history) return null;
    const snapshot = this.profile.history.find((item) => item.timestamp === timestamp);
    if (!snapshot) return null;
    const preRestore = buildSnapshot(this.profile, "Before restore");
    this.profile = { ...applySnapshot(this.profile, snapshot), history: [preRestore, ...this.profile.history].slice(0, 10) };
    return this.profile;
  }
  async incrementProfileViews() {}
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

describe("edit + restore API flow (P0-1 password, P0-3 restore)", () => {
  test("manager can set/change/remove the visitor password and restore a full snapshot", async () => {
    const stubs = new Map<string, SnapshotStub>();
    const namespace = {
      idFromName: (name: string) => name,
      get: (id: string) => {
        if (!stubs.has(id)) stubs.set(id, new SnapshotStub());
        return stubs.get(id)!;
      },
    };
    const app = new Hono();
    userRoutes(app as never);
    const request = (path: string, init?: RequestInit) =>
      app.request(`https://b4wemeet.test${path}`, init, { GlobalDurableObject: namespace } as never);
    const json = (method: string, body: unknown, cookie?: string): RequestInit => ({
      method,
      headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
      body: JSON.stringify(body),
    });

    const createInput = {
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
      topics: "Product strategy",
      meetingNote: "Bring the decision.",
    };
    const created = await request("/api/profiles", json("POST", createInput));
    expect(created.status).toBe(200);
    const cookie = created.headers.get("set-cookie")?.split(";")[0] ?? "";
    expect(cookie).toContain("meetingme_manage_jane-example=");

    const updateBody = {
      fullName: "Jane Example",
      jobTitle: "Product Lead",
      company: "Renamed Co",
      profilePhoto: "",
      linkedinUrl: "",
      websiteUrl: "",
      videoUrl: "",
      twitterUrl: "",
      githubUrl: "https://github.com/jane",
      phone: "",
      primaryVariantId: "primary",
      variants: [{
        id: "primary",
        name: "Default",
        variantSlug: "intro",
        bio: "I help teams arrive prepared for useful meetings.",
        focus: "Better meetings",
        topics: ["Product strategy"],
        meetingNote: "Bring the decision.",
        views: 0,
      }],
    };

    // Set a visitor password via update; /manage reports it exists (not the hash).
    const setPw = await request("/api/profiles/jane-example", json("PUT", { ...updateBody, password: "<redacted>" }, cookie));
    expect(setPw.status).toBe(200);
    const manage = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    const manageBody = await manage.json() as { data: { hasVisitorPassword: boolean; company: string; githubUrl?: string } };
    expect(manageBody.data.hasVisitorPassword).toBe(true);
    expect(manageBody.data.company).toBe("Renamed Co");
    expect(manageBody.data.githubUrl).toBe("https://github.com/jane");

    // The pre-update snapshot (company "Example Co") was captured by the PUT.
    const stub = stubs.get("profile:jane-example")!;
    expect(stub.profile?.history?.length).toBeGreaterThan(0);
    const snapshotTimestamp = stub.profile!.history![0].timestamp;

    // Remove the password, then restore — company/github roll back, and the
    // restore itself is captured so it can be undone.
    const removePw = await request("/api/profiles/jane-example", json("PUT", { ...updateBody, removePassword: true }, cookie));
    expect(removePw.status).toBe(200);
    const manageAfterRemove = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    const manageAfterRemoveBody = await manageAfterRemove.json() as { data: { hasVisitorPassword: boolean } };
    expect(manageAfterRemoveBody.data.hasVisitorPassword).toBe(false);

    const restored = await request("/api/profiles/jane-example/history/restore", json("POST", { timestamp: snapshotTimestamp }, cookie));
    expect(restored.status).toBe(200);
    const restoredBody = await restored.json() as { data: { company: string; githubUrl?: string } };
    expect(restoredBody.data.company).toBe("Example Co");
    expect(restoredBody.data.githubUrl).toBeUndefined();
    expect(stub.profile?.history?.[0].label).toContain("Before restore");
  });
});
