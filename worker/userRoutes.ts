import { Hono } from "hono";
import { nanoid } from "nanoid";
import {
  createProfileInputSchema,
  restoreSnapshotInputSchema,
  sessionExchangeInputSchema,
  slugSchema,
  updateProfileInputSchema,
  verifyPasswordInputSchema,
} from "@shared/schemas";
import type {
  ApiResponse,
  Profile,
  ProfileCreateResponse,
  ProfilePublicResponse,
  ProfileVariant,
} from "@shared/types";
import { Env } from "./core-utils";
import {
  clearSessionCookie,
  createPasswordHash,
  createSessionRecord,
  isSessionExpired,
  parseCookies,
  randomToken,
  sessionCookie,
  sessionCookieName,
  sha256Hex,
  verifyPassword,
} from "./auth";
import type { StoredPhotoAsset, StoredProfile, StoredSession } from "./types";

const INDEX_DO_NAME = "__meetingme_slug_index__";
const PASSWORD_ATTEMPT_LIMIT = 5;
const PASSWORD_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const SESSION_EXCHANGE_LIMIT = 10;
const SESSION_EXCHANGE_WINDOW_MS = 15 * 60 * 1000;
const UPDATE_LIMIT = 20;
const UPDATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_ACTIVE_SESSIONS = 5;
const MAX_IMAGE_BYTES = 1024 * 1024;
const SUPPORTED_IMAGE_PREFIXES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const generateSlugCandidate = () => nanoid(12).toLowerCase().replace(/_/g, "x").slice(0, 10);

const getIndexStub = (env: Env) =>
  env.GlobalDurableObject.get(env.GlobalDurableObject.idFromName(INDEX_DO_NAME));

const getProfileStub = (env: Env, slug: string) =>
  env.GlobalDurableObject.get(env.GlobalDurableObject.idFromName(`profile:${slug}`));

const getClientKey = (ip: string | undefined, userAgent: string | undefined) =>
  `${ip ?? "unknown"}:${userAgent ?? "unknown"}`;

const buildPhotoUrl = (slug: string, version: number) =>
  `/api/profiles/${slug}/photo?v=${version}`;

const cleanSessions = (sessions: StoredSession[]) =>
  sessions
    .filter((session) => !isSessionExpired(session))
    .sort(
      (left, right) =>
        new Date(right.lastUsedAt).getTime() - new Date(left.lastUsedAt).getTime(),
    )
    .slice(0, MAX_ACTIVE_SESSIONS);

const toPublicProfile = (profile: StoredProfile): Profile => {
  const {
    editTokenHash: _editTokenHash,
    passwordHash: _passwordHash,
    managementSessions: _managementSessions,
    ...publicProfile
  } = profile;

  return publicProfile;
};

const toProfileResponse = (
  profile: StoredProfile,
  variant: ProfileVariant,
  canManage: boolean,
): ProfilePublicResponse & Omit<Profile, "variants" | "primaryVariantId" | "analytics" | "history"> => {
  const publicProfile = toPublicProfile(profile);
  const { variants: _variants, primaryVariantId: _primaryVariantId, analytics: _analytics, history: _history, ...rest } = publicProfile;

  return {
    ...rest,
    activeVariant: variant,
    isLocked: false,
    canManage,
  };
};

const parseDataUrl = (value: string): StoredPhotoAsset | null => {
  const match = value.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) return null;

  const [, contentType, base64Payload] = match;
  if (!SUPPORTED_IMAGE_PREFIXES.includes(contentType.toLowerCase())) return null;

  const bytes = Uint8Array.from(atob(base64Payload), (char) => char.charCodeAt(0));
  if (bytes.byteLength > MAX_IMAGE_BYTES) return null;

  return {
    contentType,
    bytes: Array.from(bytes),
    updatedAt: new Date().toISOString(),
  };
};

const resolvePhotoInput = async (
  slug: string,
  incomingValue: string | undefined,
  profileStub: ReturnType<typeof getProfileStub>,
) => {
  const trimmed = (incomingValue ?? "").trim();

  if (!trimmed) {
    await profileStub.clearPhoto();
    return undefined;
  }

  if (trimmed.startsWith("data:image/")) {
    const asset = parseDataUrl(trimmed);
    if (!asset) throw new Error("Unsupported image upload");
    const version = Date.now();
    await profileStub.storePhoto(asset);
    return buildPhotoUrl(slug, version);
  }

  return trimmed;
};

const resolveManager = async (
  cookieHeader: string | null,
  profile: StoredProfile,
  profileStub: ReturnType<typeof getProfileStub>,
) => {
  const cookieValue = parseCookies(cookieHeader).get(sessionCookieName(profile.slug));
  if (!cookieValue) {
    const sessions = cleanSessions(profile.managementSessions || []);
    if (sessions.length !== (profile.managementSessions || []).length) {
      await profileStub.updateProfile({ managementSessions: sessions });
    }
    return { isManager: false, profile: { ...profile, managementSessions: sessions } };
  }

  const sessions = cleanSessions(profile.managementSessions || []);
  const tokenHash = await sha256Hex(cookieValue);
  const matchedSession = sessions.find((session) => session.tokenHash === tokenHash);

  if (!matchedSession) {
    if (sessions.length !== (profile.managementSessions || []).length) {
      await profileStub.updateProfile({ managementSessions: sessions });
    }
    return { isManager: false, profile: { ...profile, managementSessions: sessions } };
  }

  const refreshedSessions = sessions.map((session) =>
    session.tokenHash === tokenHash
      ? { ...session, lastUsedAt: new Date().toISOString() }
      : session,
  );

  await profileStub.updateProfile({ managementSessions: refreshedSessions });

  return {
    isManager: true,
    profile: { ...profile, managementSessions: refreshedSessions },
  };
};

const getVariant = (profile: StoredProfile, variantSlug?: string) =>
  variantSlug
    ? profile.variants.find((variant) => variant.variantSlug === variantSlug)
    : profile.variants.find((variant) => variant.id === profile.primaryVariantId);

export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get("/api/profiles/availability/:slug", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: true, data: { available: false, error: "Invalid format" } });
    }

    const reserved = await getIndexStub(c.env).isSlugReserved(parsedSlug.data);
    return c.json({ success: true, data: { available: !reserved } });
  });

  app.post("/api/profiles", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedBody = createProfileInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json(
        {
          success: false,
          error: parsedBody.error.issues[0]?.message || "Invalid profile payload",
        } satisfies ApiResponse,
        400,
      );
    }

    const body = parsedBody.data;
    const indexStub = getIndexStub(c.env);

    let slug = body.customSlug || "";
    let reserved = false;

    if (slug) {
      reserved = await indexStub.reserveSlug(slug);
      if (!reserved) {
        return c.json({ success: false, error: "Taken" } satisfies ApiResponse, 409);
      }
    } else {
      for (let attempt = 0; attempt < 5 && !reserved; attempt += 1) {
        slug = generateSlugCandidate();
        reserved = await indexStub.reserveSlug(slug);
      }

      if (!reserved) {
        return c.json(
          { success: false, error: "Could not allocate a profile handle" } satisfies ApiResponse,
          500,
        );
      }
    }

    const profileStub = getProfileStub(c.env, slug);
    const variantId = nanoid();
    const editToken = randomToken(32);
    const sessionToken = randomToken(32);
    const passwordHash = body.password ? await createPasswordHash(body.password) : undefined;

    try {
      const initialVariant: ProfileVariant = {
        id: variantId,
        name: body.variantName || "Default",
        variantSlug: body.variantSlug || "intro",
        bio: body.bio,
        focus: body.focus || "",
        topics: body.topics
          ? body.topics.split(",").map((topic) => topic.trim()).filter(Boolean)
          : [],
        meetingNote: body.meetingNote || "",
        views: 0,
      };

      const profilePhoto = await resolvePhotoInput(slug, body.profilePhoto, profileStub);
      const storedProfile: StoredProfile = {
        slug,
        fullName: body.fullName,
        jobTitle: body.jobTitle,
        company: body.company,
        profilePhoto,
        linkedinUrl: body.linkedinUrl || undefined,
        websiteUrl: body.websiteUrl || undefined,
        videoUrl: body.videoUrl || undefined,
        twitterUrl: body.twitterUrl || undefined,
        githubUrl: body.githubUrl || undefined,
        phone: body.phone || undefined,
        createdAt: new Date().toISOString(),
        variants: [initialVariant],
        primaryVariantId: variantId,
        history: [],
        analytics: [],
        editTokenHash: await sha256Hex(editToken),
        passwordHash,
        managementSessions: [await createSessionRecord(sessionToken)],
      };

      await profileStub.createProfile(storedProfile);
      c.header("Set-Cookie", sessionCookie(slug, sessionToken, secureCookies), { append: true });

      return c.json({
        success: true,
        data: { slug, editToken } satisfies ProfileCreateResponse,
      });
    } catch (error) {
      await indexStub.releaseSlug(slug);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to create profile",
        } satisfies ApiResponse,
        400,
      );
    }
  });

  app.post("/api/profiles/:slug/session", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const limiter = await profileStub.checkRateLimit(
      `session:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      SESSION_EXCHANGE_LIMIT,
      SESSION_EXCHANGE_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many session attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const parsedBody = sessionExchangeInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid management link" } satisfies ApiResponse, 400);
    }

    const isValidToken = (await sha256Hex(parsedBody.data.editToken)) === profile.editTokenHash;
    if (!isValidToken) {
      return c.json({ success: false, error: "Invalid management link" } satisfies ApiResponse, 401);
    }

    const sessionToken = randomToken(32);
    const sessions = cleanSessions([
      ...(profile.managementSessions || []),
      await createSessionRecord(sessionToken),
    ]);
    await profileStub.updateProfile({ managementSessions: sessions });
    c.header("Set-Cookie", sessionCookie(parsedSlug.data, sessionToken, secureCookies), { append: true });

    return c.json({ success: true, data: { authenticated: true } });
  });

  app.delete("/api/profiles/:slug/session", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    c.header("Set-Cookie", clearSessionCookie(parsedSlug.data, secureCookies), { append: true });
    return c.json({ success: true });
  });

  app.get("/api/profiles/:slug/photo", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const asset = await profileStub.getPhoto();
    if (!asset) {
      return c.json({ success: false, error: "Photo not found" } satisfies ApiResponse, 404);
    }

    return new Response(Uint8Array.from(asset.bytes), {
      headers: {
        "content-type": asset.contentType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  });

  app.get("/api/profiles/:slug/manage", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const managerState = await resolveManager(c.req.header("Cookie"), profile, profileStub);
    if (!managerState.isManager) {
      c.header("Set-Cookie", clearSessionCookie(parsedSlug.data, secureCookies), { append: true });
      return c.json({ success: false, error: "Unauthorized" } satisfies ApiResponse, 401);
    }

    return c.json({
      success: true,
      data: { ...toPublicProfile(managerState.profile), canManage: true },
    });
  });

  app.get("/api/profiles/:slug/analytics", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const managerState = await resolveManager(c.req.header("Cookie"), profile, profileStub);
    if (!managerState.isManager) {
      return c.json({ success: false, error: "Unauthorized" } satisfies ApiResponse, 401);
    }

    return c.json({
      success: true,
      data: {
        analytics: managerState.profile.analytics || [],
        variants: managerState.profile.variants,
      },
    });
  });

  app.post("/api/profiles/:slug/history/restore", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const managerState = await resolveManager(c.req.header("Cookie"), profile, profileStub);
    if (!managerState.isManager) {
      return c.json({ success: false, error: "Unauthorized" } satisfies ApiResponse, 401);
    }

    const limiter = await profileStub.checkRateLimit(
      `restore:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      UPDATE_LIMIT,
      UPDATE_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many restore attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const parsedBody = restoreSnapshotInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid restore request" } satisfies ApiResponse, 400);
    }

    const updated = await profileStub.restoreSnapshot(parsedBody.data.timestamp);
    if (!updated) {
      return c.json({ success: false, error: "Failed to restore" } satisfies ApiResponse, 400);
    }

    return c.json({ success: true, data: { ...toPublicProfile(updated), canManage: true } });
  });

  app.get("/api/profiles/:slug", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const managerState = await resolveManager(c.req.header("Cookie"), profile, profileStub);
    const variantSlug = c.req.query("variant");
    const source = c.req.query("src");
    const variant = getVariant(managerState.profile, variantSlug);

    if (!variant) {
      return c.json({ success: false, error: "Variant not found" } satisfies ApiResponse, 404);
    }

    if (managerState.isManager) {
      return c.json({
        success: true,
        data: toProfileResponse(managerState.profile, variant, true),
      });
    }

    if (managerState.profile.passwordHash) {
      return c.json({
        success: true,
        data: {
          fullName: managerState.profile.fullName,
          isLocked: true,
          canManage: false,
        } satisfies ProfilePublicResponse,
      });
    }

    await profileStub.incrementProfileViews(variant.variantSlug, source);

    return c.json({
      success: true,
      data: toProfileResponse(managerState.profile, variant, false),
    });
  });

  app.post("/api/profiles/:slug/verify", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile || !profile.passwordHash) {
      return c.json({ success: false, error: "Invalid request" } satisfies ApiResponse, 400);
    }

    const limiter = await profileStub.checkRateLimit(
      `password:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      PASSWORD_ATTEMPT_LIMIT,
      PASSWORD_ATTEMPT_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many password attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const parsedBody = verifyPasswordInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid password payload" } satisfies ApiResponse, 400);
    }

    const isValidPassword = await verifyPassword(parsedBody.data.password, profile.passwordHash);
    if (!isValidPassword) {
      return c.json({ success: false, error: "Incorrect password" } satisfies ApiResponse, 401);
    }

    const variant = getVariant(profile, parsedBody.data.variantSlug);
    if (!variant) {
      return c.json({ success: false, error: "Variant not found" } satisfies ApiResponse, 404);
    }

    await profileStub.incrementProfileViews(variant.variantSlug);

    return c.json({
      success: true,
      data: toProfileResponse(profile, variant, false),
    });
  });

  app.put("/api/profiles/:slug", async (c) => {
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile) {
      return c.json({ success: false, error: "Profile not found" } satisfies ApiResponse, 404);
    }

    const managerState = await resolveManager(c.req.header("Cookie"), profile, profileStub);
    if (!managerState.isManager) {
      return c.json({ success: false, error: "Forbidden" } satisfies ApiResponse, 403);
    }

    const limiter = await profileStub.checkRateLimit(
      `update:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      UPDATE_LIMIT,
      UPDATE_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many update attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const parsedBody = updateProfileInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json(
        {
          success: false,
          error: parsedBody.error.issues[0]?.message || "Invalid profile payload",
        } satisfies ApiResponse,
        400,
      );
    }

    try {
      const body = parsedBody.data;
      const photoValue = await resolvePhotoInput(parsedSlug.data, body.profilePhoto, profileStub);
      await profileStub.captureSnapshot(`Update ${new Date().toLocaleTimeString()}`);

      const updates: Partial<StoredProfile> = {
        fullName: body.fullName,
        jobTitle: body.jobTitle,
        company: body.company,
        profilePhoto: photoValue,
        linkedinUrl: body.linkedinUrl || undefined,
        websiteUrl: body.websiteUrl || undefined,
        videoUrl: body.videoUrl || undefined,
        twitterUrl: body.twitterUrl || undefined,
        githubUrl: body.githubUrl || undefined,
        phone: body.phone || undefined,
        primaryVariantId: body.primaryVariantId,
        variants: body.variants.map((variant) => ({
          ...variant,
          topics:
            typeof variant.topics === "string"
              ? variant.topics.split(",").map((topic) => topic.trim()).filter(Boolean)
              : variant.topics,
        })),
      };

      if (body.removePassword) {
        updates.passwordHash = undefined;
      } else if (body.password) {
        updates.passwordHash = await createPasswordHash(body.password);
      }

      const updated = await profileStub.updateProfile(updates);
      return c.json({ success: true, data: updated ? { ...toPublicProfile(updated), canManage: true } : null });
    } catch (error) {
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : "Failed to update profile",
        } satisfies ApiResponse,
        400,
      );
    }
  });
}
