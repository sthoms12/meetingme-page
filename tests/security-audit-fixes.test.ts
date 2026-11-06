import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { buildMeetingICS, escapeICSText } from "../src/lib/calendar-utils";
import { buildProfileBody, buildStructuredData } from "../worker/profile-render";
import { escapeJsonForScript } from "../worker/security";
import { userRoutes } from "../worker/userRoutes";
import type { StoredPhotoAsset, StoredProfile, StoredSession } from "../worker/types";

/**
 * Regression tests for the security-audit run 1 fix batch.
 * The API harness mirrors tests/api-workflows.test.ts with photo storage.
 */
class MemoryStub {
  profile: StoredProfile | null = null;
  photo: StoredPhotoAsset | null = null;
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
  async getPhoto() { return this.photo; }
  async storePhoto(asset: StoredPhotoAsset) { this.photo = structuredClone(asset); }
  async clearPhoto() { this.photo = null; }
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
  linkedinUrl: "https://www.linkedin.com/in/jane-example",
  websiteUrl: "",
  videoUrl: "",
  twitterUrl: "",
  githubUrl: "",
  phone: "+1 555 010 2030",
  customSlug: "jane-example",
  password: "",
  variantName: "Default",
  variantSlug: "intro",
  bio: "I help teams arrive prepared for useful meetings.",
  focus: "Better meetings",
  topics: "Product strategy, collaboration",
  meetingNote: "Bring the decision that needs to be made.",
};

const PNG_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAwMCAO+ip1sAAAAASUVORK5CYII=";

const jsonRequest = (method: string, body: unknown, cookie?: string): RequestInit => ({
  method,
  headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
  body: JSON.stringify(body),
});

const cookieOf = (response: Response) => response.headers.get("set-cookie")!.split(";")[0];

const createProfile = async (request: ReturnType<typeof createHarness>["request"], overrides: Record<string, unknown> = {}) => {
  const created = await request("/api/profiles", jsonRequest("POST", { ...profileInput, ...overrides }));
  expect(created.status).toBe(200);
  const body = await created.json() as { data: { slug: string; editToken: string } };
  return { created, body, cookie: cookieOf(created) };
};

const exchange = async (request: ReturnType<typeof createHarness>["request"], editToken: string) => {
  const exchanged = await request("/api/profiles/jane-example/session", jsonRequest("POST", { editToken }));
  expect(exchanged.status).toBe(200);
  return cookieOf(exchanged);
};

describe("JSON-LD script-context escaping", () => {
  test("escapeJsonForScript neutralises a </script> payload and round-trips", () => {
    const payload = "x</script><script>alert(document.domain)</script>";
    const escaped = escapeJsonForScript(JSON.stringify({ jobTitle: payload }));
    expect(escaped).not.toContain("</script");
    expect(escaped).not.toContain("<script");
    expect(escaped).toContain("\\u003c/script\\u003e");
    expect(JSON.parse(escaped)).toEqual({ jobTitle: payload });
  });

  test("escapeJsonForScript escapes &, U+2028 and U+2029 losslessly", () => {
    const value = { text: "a & b c d" };
    const escaped = escapeJsonForScript(JSON.stringify(value));
    expect(escaped).toContain("\\u0026");
    expect(escaped).toContain("\\u2028");
    expect(escaped).toContain("\\u2029");
    expect(JSON.parse(escaped)).toEqual(value);
  });

  test("buildStructuredData cannot break out of the script element", () => {
    const payload = "x</script><script>alert(document.domain)</script>";
    const variant = {
      id: "v1",
      name: "Default",
      variantSlug: "intro",
      bio: profileInput.bio,
      focus: profileInput.focus,
      topics: ["Product strategy"],
      views: 0,
    };
    const profile = {
      slug: "jane-example",
      fullName: "Jane Example",
      jobTitle: payload,
      company: "Example Co",
      linkedinUrl: profileInput.linkedinUrl,
      createdAt: new Date().toISOString(),
      variants: [variant],
      primaryVariantId: "v1",
      editTokenHash: "unused",
      managementSessions: [],
    } as unknown as StoredProfile;

    const structuredData = buildStructuredData(
      new Request("https://b4wemeet.app/jane-example"),
      profile,
      variant,
      "/jane-example",
    );
    expect(structuredData).not.toContain("</script");
    expect(JSON.parse(structuredData).jobTitle).toBe(payload);
  });
});

describe("locked-profile HTML parity", () => {
  const variant = {
    id: "v1",
    name: "Default",
    variantSlug: "intro",
    bio: profileInput.bio,
    focus: profileInput.focus,
    topics: ["Product strategy"],
    meetingNote: profileInput.meetingNote,
    views: 0,
  };
  const profile = {
    slug: "jane-example",
    fullName: "Jane Example",
    jobTitle: "Product Lead",
    company: "Example Co",
    profilePhoto: "/api/profiles/jane-example/photo?v=1",
    linkedinUrl: profileInput.linkedinUrl,
    phone: profileInput.phone,
    createdAt: new Date().toISOString(),
    variants: [variant],
    primaryVariantId: "v1",
    passwordHash: "set",
    editTokenHash: "unused",
    managementSessions: [],
  } as unknown as StoredProfile;
  const request = new Request("https://b4wemeet.app/jane-example");

  test("locked body exposes only the name and the locked notice", () => {
    const html = buildProfileBody(request, profile, variant, true, "/jane-example");
    expect(html).toContain("Jane Example");
    expect(html).toContain("password protected");
    expect(html).not.toContain("Product Lead");
    expect(html).not.toContain("Example Co");
    expect(html).not.toContain("linkedin.com");
    expect(html).not.toContain("tel:");
    expect(html).not.toContain(profileInput.phone);
    expect(html).not.toContain(profileInput.bio);
  });

  test("unlocked body still renders role, links and bio", () => {
    const html = buildProfileBody(request, profile, variant, false, "/jane-example");
    expect(html).toContain("Product Lead at Example Co");
    expect(html).toContain("linkedin.com");
    expect(html).toContain(`tel:${profileInput.phone}`);
    expect(html).toContain(profileInput.bio);
  });
});

describe("session lifecycle revocation", () => {
  test("regenerating the management link revokes old sessions but keeps the owner signed in", async () => {
    const { request } = createHarness();
    const { body } = await createProfile(request);
    const cookieA = await exchange(request, body.data.editToken);
    const cookieB = await exchange(request, body.data.editToken);

    for (const cookie of [cookieA, cookieB]) {
      const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
      expect(managed.status).toBe(200);
    }

    const regenerated = await request(
      "/api/profiles/jane-example/manage/regenerate",
      { method: "POST", headers: { cookie: cookieA } },
    );
    expect(regenerated.status).toBe(200);
    const regeneratedBody = await regenerated.json() as { data: { editToken: string } };
    expect(regeneratedBody.data.editToken).not.toBe(body.data.editToken);
    const freshCookie = cookieOf(regenerated);

    // Sessions minted from the old link are dead.
    for (const cookie of [cookieA, cookieB]) {
      const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
      expect(managed.status).toBe(401);
    }

    // The regenerating owner continues with the freshly issued session.
    const ownManaged = await request("/api/profiles/jane-example/manage", { headers: { cookie: freshCookie } });
    expect(ownManaged.status).toBe(200);

    // The old edit token no longer exchanges; the new one does.
    const stale = await request("/api/profiles/jane-example/session", jsonRequest("POST", { editToken: body.data.editToken }));
    expect(stale.status).toBe(401);
    await exchange(request, regeneratedBody.data.editToken);
  });

  test("sign-out revokes the session server-side", async () => {
    const { request } = createHarness();
    const { body } = await createProfile(request);
    const cookie = await exchange(request, body.data.editToken);

    const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    expect(managed.status).toBe(200);

    const signedOut = await request("/api/profiles/jane-example/session", { method: "DELETE", headers: { cookie } });
    expect(signedOut.status).toBe(200);

    const after = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    expect(after.status).toBe(401);
  });
});

describe("locked-profile API behaviour", () => {
  test("locked gate runs before variant resolution (no variant-existence oracle)", async () => {
    const { request } = createHarness();
    await createProfile(request, { password: "correct horse battery" });

    const unknownVariant = await request("/api/profiles/jane-example?variant=does-not-exist");
    expect(unknownVariant.status).toBe(200);
    const unknownBody = await unknownVariant.json() as { data: { isLocked?: boolean; fullName?: string } };
    expect(unknownBody.data.isLocked).toBe(true);
    expect(unknownBody.data.fullName).toBe("Jane Example");

    const knownVariant = await request("/api/profiles/jane-example?variant=intro");
    expect(knownVariant.status).toBe(200);
    const knownBody = await knownVariant.json() as { data: { isLocked?: boolean } };
    expect(knownBody.data.isLocked).toBe(true);
  });

  test("unlocked profiles still 404 for unknown variants", async () => {
    const { request } = createHarness();
    await createProfile(request);
    const response = await request("/api/profiles/jane-example?variant=does-not-exist");
    expect(response.status).toBe(404);
  });

  test("photo route enforces the lock and drops the public immutable cache", async () => {
    const { request } = createHarness();
    const { cookie } = await createProfile(request, {
      password: "correct horse battery",
      profilePhoto: PNG_DATA_URL,
    });

    const anonymous = await request("/api/profiles/jane-example/photo");
    expect(anonymous.status).toBe(404);

    const managed = await request("/api/profiles/jane-example/photo", { headers: { cookie } });
    expect(managed.status).toBe(200);
    expect(managed.headers.get("content-type")).toBe("image/png");
    expect(managed.headers.get("cache-control")).toBe("private, no-store");
  });

  test("unlocked profile photos stay publicly cacheable", async () => {
    const { request } = createHarness();
    await createProfile(request, { profilePhoto: PNG_DATA_URL });

    const response = await request("/api/profiles/jane-example/photo");
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("immutable");
  });

  test("switching to an external photo URL retires the uploaded asset", async () => {
    const { request, stubs } = createHarness();
    const { cookie } = await createProfile(request, { profilePhoto: PNG_DATA_URL });
    const stub = stubs.get("profile:jane-example")!;
    expect(stub.photo).not.toBeNull();

    const managed = await request("/api/profiles/jane-example/manage", { headers: { cookie } });
    const managedBody = await managed.json() as { data: StoredProfile };
    const originalVariant = managedBody.data.variants[0];
    const update = {
      fullName: profileInput.fullName,
      jobTitle: profileInput.jobTitle,
      company: profileInput.company,
      profilePhoto: "https://example.com/jane.png",
      linkedinUrl: profileInput.linkedinUrl,
      websiteUrl: "",
      videoUrl: "",
      twitterUrl: "",
      githubUrl: "",
      phone: profileInput.phone,
      primaryVariantId: originalVariant.id,
      variants: [originalVariant],
      removePassword: false,
    };
    const updated = await request("/api/profiles/jane-example", jsonRequest("PUT", update, cookie));
    expect(updated.status).toBe(200);
    expect(stub.photo).toBeNull();

    const photo = await request("/api/profiles/jane-example/photo");
    expect(photo.status).toBe(404);
  });
});

describe("view-source analytics sanitisation", () => {
  test("only short token sources are stored; anything else becomes 'direct'", async () => {
    const { request } = createHarness();
    const { cookie } = await createProfile(request);

    const readTopSource = async () => {
      const analytics = await request("/api/profiles/jane-example/analytics", { headers: { cookie } });
      const body = await analytics.json() as { data: { analytics: { source: string }[] } };
      return body.data.analytics[0]?.source;
    };

    await request("/api/profiles/jane-example?src=linkedin");
    expect(await readTopSource()).toBe("linkedin");

    await request(`/api/profiles/jane-example?src=${encodeURIComponent("Evil Source <script>alert(1)</script>")}`);
    expect(await readTopSource()).toBe("direct");

    await request(`/api/profiles/jane-example?src=${"a".repeat(64)}`);
    expect(await readTopSource()).toBe("direct");
  });
});

describe("passkey ceremony isolation", () => {
  test("an unauthenticated auth ceremony cannot clobber an in-progress registration", async () => {
    const { request, stubs } = createHarness();
    const { cookie } = await createProfile(request);
    const stub = stubs.get("profile:jane-example")!;
    stub.profile!.passkeys = [{
      id: "existing-cred",
      publicKey: "AAAA",
      counter: 0,
      createdAt: new Date().toISOString(),
    }];

    const registerStart = await request(
      "/api/profiles/jane-example/passkey/register/start",
      { method: "POST", headers: { cookie } },
    );
    expect(registerStart.status).toBe(200);
    const registerOptions = await registerStart.json() as { data: { challenge: string } };
    expect(stub.profile!.pendingRegistrationChallenge?.challenge).toBe(registerOptions.data.challenge);

    const authStart = await request("/api/profiles/jane-example/passkey/auth/start", { method: "POST" });
    expect(authStart.status).toBe(200);
    expect(stub.profile!.pendingAuthChallenge?.type).toBe("auth");
    // The registration challenge survived the unauthenticated auth ceremony.
    expect(stub.profile!.pendingRegistrationChallenge?.challenge).toBe(registerOptions.data.challenge);

    // Completing the registration reaches verification (and fails there on
    // the bogus response) instead of dying on a clobbered challenge.
    const complete = await request(
      "/api/profiles/jane-example/passkey/register/complete",
      jsonRequest("POST", {
        response: {
          id: "new-cred",
          rawId: "new-cred",
          type: "public-key",
          response: { attestationObject: "AAAA", clientDataJSON: "AAAA" },
        },
      }, cookie),
    );
    expect(complete.status).toBe(400);
    const completeBody = await complete.json() as { error?: string };
    expect(completeBody.error).not.toContain("Registration expired");
  });
});

describe("ICS generation escaping", () => {
  test("escapeICSText escapes separators and folds line breaks", () => {
    expect(escapeICSText("a;b,c\\d\r\ne")).toBe("a\\;b\\,c\\\\d\\ne");
    expect(escapeICSText("plain")).toBe("plain");
  });

  test("a CRLF-bearing company cannot inject a VALARM component", () => {
    const ics = buildMeetingICS({
      fullName: "Jane, Doe",
      jobTitle: "Product Lead",
      company: "Acme\r\nBEGIN:VALARM\r\nTRIGGER:-PT0S\r\nEND:VALARM",
      bio: "First line\nSecond line",
      url: "https://b4wemeet.app/jane-example",
    });
    const lines = ics.split("\r\n");
    // The intro card carries no VALARM of its own (P0 batch: it is a VTODO
    // note, not a timed event), so any VALARM would be an injection.
    expect(lines.filter((line) => line === "BEGIN:VALARM")).toHaveLength(0);
    expect(lines.filter((line) => line.startsWith("TRIGGER:"))).toHaveLength(0);
    const summary = lines.find((line) => line.startsWith("SUMMARY:"));
    expect(summary).toContain("Jane\\, Doe");
    expect(summary).toContain("Acme\\nBEGIN:VALARM");
    expect(ics).not.toContain("\r\nTRIGGER:-PT0S");
  });
});
