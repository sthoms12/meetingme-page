import { Hono } from "hono";
import { nanoid } from "nanoid";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import {
  createProfileInputSchema,
  normalizeTwitterInput,
  passkeyAuthCompleteInputSchema,
  passkeyRegisterCompleteInputSchema,
  recoveryCodeRedeemInputSchema,
  restoreSnapshotInputSchema,
  sessionExchangeInputSchema,
  slugSchema,
  updateProfileInputSchema,
  verifyPasswordInputSchema,
} from "@shared/schemas";
import type {
  AccessInfo,
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
  deriveExpectedOrigin,
  deriveRpId,
  fromBase64Url,
  generateRecoveryCode,
  hashRecoveryCode,
  isSessionExpired,
  parseCookies,
  randomToken,
  sessionCookie,
  sessionCookieName,
  sha256Hex,
  toBase64Url,
  verifyPassword,
} from "./auth";
import type { PasskeyCredential, StoredPhotoAsset, StoredProfile, StoredSession } from "./types";

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
const MAX_PASSKEYS = 5;
const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const PASSKEY_CEREMONY_LIMIT = 10;
const PASSKEY_CEREMONY_WINDOW_MS = 15 * 60 * 1000;
const RECOVERY_CODE_ATTEMPT_LIMIT = 5;
const RECOVERY_CODE_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const RP_NAME = "B4WeMeet";
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
    editTokenRotatedAt: _editTokenRotatedAt,
    passwordHash: _passwordHash,
    managementSessions: _managementSessions,
    passkeys: _passkeys,
    recoveryCode: _recoveryCode,
    pendingChallenge: _pendingChallenge,
    lastManagementAccessMethod: _lastManagementAccessMethod,
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
  cookieHeader: string | null | undefined,
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

const getWebauthnUserId = async (slug: string) => {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`webauthn:${slug}`));
  return new Uint8Array(buffer);
};

const toAccessInfo = (profile: StoredProfile): AccessInfo => ({
  passkeys: (profile.passkeys || []).map((passkey) => ({
    id: passkey.id,
    deviceLabel: passkey.deviceLabel,
    createdAt: passkey.createdAt,
    lastUsedAt: passkey.lastUsedAt,
  })),
  recoveryCodeConfigured: Boolean(profile.recoveryCode),
  recoveryCodeLastRotatedAt: profile.recoveryCode?.lastRotatedAt,
  editTokenRotatedAt: profile.editTokenRotatedAt,
  lastManagementAccessMethod: profile.lastManagementAccessMethod,
  sessions: cleanSessions(profile.managementSessions || []).map((session) => ({
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    lastUsedAt: session.lastUsedAt,
  })),
});

const isChallengeExpired = (createdAt: string) =>
  Date.now() - new Date(createdAt).getTime() > CHALLENGE_TTL_MS;

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
    const recoveryCode = generateRecoveryCode();

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
        twitterUrl: normalizeTwitterInput(body.twitterUrl) || undefined,
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
        recoveryCode: {
          codeHash: await hashRecoveryCode(recoveryCode),
          createdAt: new Date().toISOString(),
        },
        lastManagementAccessMethod: "initial",
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
        twitterUrl: normalizeTwitterInput(body.twitterUrl) || undefined,
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

  app.get("/api/profiles/:slug/manage/access", async (c) => {
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

    return c.json({ success: true, data: toAccessInfo(managerState.profile) satisfies AccessInfo });
  });

  app.post("/api/profiles/:slug/manage/regenerate", async (c) => {
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
      `regenerate:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      UPDATE_LIMIT,
      UPDATE_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const editToken = randomToken(32);
    await profileStub.updateProfile({
      editTokenHash: await sha256Hex(editToken),
      editTokenRotatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, data: { slug: parsedSlug.data, editToken } satisfies ProfileCreateResponse });
  });

  app.get("/api/profiles/:slug/export.json", async (c) => {
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

    const payload = JSON.stringify(toPublicProfile(managerState.profile), null, 2);
    return new Response(payload, {
      headers: {
        "content-type": "application/json",
        "content-disposition": `attachment; filename="${parsedSlug.data}.json"`,
      },
    });
  });

  app.get("/api/profiles/:slug/export.md", async (c) => {
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

    const publicProfile = toPublicProfile(managerState.profile);
    const lines = [
      `# ${publicProfile.fullName}`,
      "",
      `${publicProfile.jobTitle} at ${publicProfile.company}`,
      "",
    ];

    if (publicProfile.linkedinUrl) lines.push(`- LinkedIn: ${publicProfile.linkedinUrl}`);
    if (publicProfile.websiteUrl) lines.push(`- Website: ${publicProfile.websiteUrl}`);
    if (publicProfile.videoUrl) lines.push(`- Video: ${publicProfile.videoUrl}`);
    if (publicProfile.twitterUrl) lines.push(`- Twitter: ${publicProfile.twitterUrl}`);
    if (publicProfile.githubUrl) lines.push(`- GitHub: ${publicProfile.githubUrl}`);
    if (publicProfile.phone) lines.push(`- Phone: ${publicProfile.phone}`);

    lines.push("", "## Variants", "");

    for (const variant of publicProfile.variants) {
      lines.push(`### ${variant.name} (/${variant.variantSlug})`, "", variant.bio, "");
      if (variant.focus) lines.push(`Focus: ${variant.focus}`, "");
      if (variant.topics.length) lines.push(`Topics: ${variant.topics.join(", ")}`, "");
      if (variant.meetingNote) lines.push(`Meeting note: ${variant.meetingNote}`, "");
    }

    return new Response(lines.join("\n"), {
      headers: {
        "content-type": "text/markdown",
        "content-disposition": `attachment; filename="${parsedSlug.data}.md"`,
      },
    });
  });

  app.post("/api/profiles/:slug/passkey/register/start", async (c) => {
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
      `passkey-ceremony:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      PASSKEY_CEREMONY_LIMIT,
      PASSKEY_CEREMONY_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    if ((managerState.profile.passkeys || []).length >= MAX_PASSKEYS) {
      return c.json({ success: false, error: "Passkey limit reached" } satisfies ApiResponse, 400);
    }

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: deriveRpId(c.req.raw),
      userName: parsedSlug.data,
      userID: await getWebauthnUserId(parsedSlug.data),
      userDisplayName: managerState.profile.fullName,
      attestationType: "none",
      excludeCredentials: (managerState.profile.passkeys || []).map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports as AuthenticatorTransportFuture[] | undefined,
      })),
      authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
    });

    await profileStub.updateProfile({
      pendingChallenge: { challenge: options.challenge, type: "register", createdAt: new Date().toISOString() },
    });

    return c.json({ success: true, data: options });
  });

  app.post("/api/profiles/:slug/passkey/register/complete", async (c) => {
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

    const pendingChallenge = managerState.profile.pendingChallenge;
    if (!pendingChallenge || pendingChallenge.type !== "register" || isChallengeExpired(pendingChallenge.createdAt)) {
      return c.json({ success: false, error: "Registration expired. Try again." } satisfies ApiResponse, 400);
    }

    const parsedBody = passkeyRegisterCompleteInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid passkey response" } satisfies ApiResponse, 400);
    }

    try {
      const verification = await verifyRegistrationResponse({
        response: parsedBody.data.response as unknown as RegistrationResponseJSON,
        expectedChallenge: pendingChallenge.challenge,
        expectedOrigin: deriveExpectedOrigin(c.req.raw),
        expectedRPID: deriveRpId(c.req.raw),
      });

      if (!verification.verified || !verification.registrationInfo) {
        return c.json({ success: false, error: "Could not verify passkey" } satisfies ApiResponse, 400);
      }

      const { credential } = verification.registrationInfo;
      const newPasskey: PasskeyCredential = {
        id: credential.id,
        publicKey: toBase64Url(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports,
        deviceLabel: parsedBody.data.deviceLabel || undefined,
        createdAt: new Date().toISOString(),
      };

      const passkeys = [...(managerState.profile.passkeys || []), newPasskey].slice(-MAX_PASSKEYS);
      const updated = await profileStub.updateProfile({ passkeys, pendingChallenge: undefined });

      return c.json({ success: true, data: updated ? toAccessInfo(updated) : null });
    } catch (error) {
      return c.json(
        { success: false, error: error instanceof Error ? error.message : "Could not verify passkey" } satisfies ApiResponse,
        400,
      );
    }
  });

  app.post("/api/profiles/:slug/passkey/auth/start", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile || !(profile.passkeys || []).length) {
      return c.json({ success: false, error: "No passkey configured" } satisfies ApiResponse, 400);
    }

    const limiter = await profileStub.checkRateLimit(
      `passkey-ceremony:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      PASSKEY_CEREMONY_LIMIT,
      PASSKEY_CEREMONY_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const options = await generateAuthenticationOptions({
      rpID: deriveRpId(c.req.raw),
      allowCredentials: (profile.passkeys || []).map((passkey) => ({
        id: passkey.id,
        transports: passkey.transports as AuthenticatorTransportFuture[] | undefined,
      })),
      userVerification: "preferred",
    });

    await profileStub.updateProfile({
      pendingChallenge: { challenge: options.challenge, type: "auth", createdAt: new Date().toISOString() },
    });

    c.header("Set-Cookie", clearSessionCookie(parsedSlug.data, secureCookies), { append: true });
    return c.json({ success: true, data: options });
  });

  app.post("/api/profiles/:slug/passkey/auth/complete", async (c) => {
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

    const pendingChallenge = profile.pendingChallenge;
    if (!pendingChallenge || pendingChallenge.type !== "auth" || isChallengeExpired(pendingChallenge.createdAt)) {
      return c.json({ success: false, error: "Authentication expired. Try again." } satisfies ApiResponse, 400);
    }

    const parsedBody = passkeyAuthCompleteInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid passkey response" } satisfies ApiResponse, 400);
    }

    const response = parsedBody.data.response as unknown as AuthenticationResponseJSON;
    const matchedPasskey = (profile.passkeys || []).find((passkey) => passkey.id === response.id);
    if (!matchedPasskey) {
      return c.json({ success: false, error: "Passkey not recognized" } satisfies ApiResponse, 400);
    }

    try {
      const verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: pendingChallenge.challenge,
        expectedOrigin: deriveExpectedOrigin(c.req.raw),
        expectedRPID: deriveRpId(c.req.raw),
        credential: {
          id: matchedPasskey.id,
          publicKey: fromBase64Url(matchedPasskey.publicKey),
          counter: matchedPasskey.counter,
          transports: matchedPasskey.transports as AuthenticatorTransportFuture[] | undefined,
        },
      });

      if (!verification.verified) {
        return c.json({ success: false, error: "Could not verify passkey" } satisfies ApiResponse, 400);
      }

      const now = new Date().toISOString();
      const passkeys = (profile.passkeys || []).map((passkey) =>
        passkey.id === matchedPasskey.id
          ? { ...passkey, counter: verification.authenticationInfo.newCounter, lastUsedAt: now }
          : passkey,
      );

      const sessionToken = randomToken(32);
      const sessions = cleanSessions([...(profile.managementSessions || []), await createSessionRecord(sessionToken)]);

      await profileStub.updateProfile({
        passkeys,
        managementSessions: sessions,
        pendingChallenge: undefined,
        lastManagementAccessMethod: "passkey",
      });

      c.header("Set-Cookie", sessionCookie(parsedSlug.data, sessionToken, secureCookies), { append: true });
      return c.json({ success: true, data: { authenticated: true } });
    } catch (error) {
      return c.json(
        { success: false, error: error instanceof Error ? error.message : "Could not verify passkey" } satisfies ApiResponse,
        400,
      );
    }
  });

  app.get("/api/profiles/:slug/recovery-code/reveal", async (c) => {
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
      `recovery-reveal:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      UPDATE_LIMIT,
      UPDATE_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const code = generateRecoveryCode();
    const now = new Date().toISOString();
    await profileStub.updateProfile({
      recoveryCode: {
        codeHash: await hashRecoveryCode(code),
        createdAt: managerState.profile.recoveryCode?.createdAt || now,
        lastRotatedAt: now,
        revealedAt: now,
      },
    });

    return c.json({ success: true, data: { code } });
  });

  app.post("/api/profiles/:slug/recovery-code/redeem", async (c) => {
    const secureCookies = new URL(c.req.url).protocol === "https:";
    const parsedSlug = slugSchema.safeParse(c.req.param("slug"));
    if (!parsedSlug.success) {
      return c.json({ success: false, error: "Invalid slug" } satisfies ApiResponse, 400);
    }

    const profileStub = getProfileStub(c.env, parsedSlug.data);
    const profile = await profileStub.getProfile();
    if (!profile || !profile.recoveryCode) {
      return c.json({ success: false, error: "Invalid recovery code" } satisfies ApiResponse, 400);
    }

    const limiter = await profileStub.checkRateLimit(
      `recovery-redeem:${getClientKey(c.req.header("CF-Connecting-IP"), c.req.header("User-Agent"))}`,
      RECOVERY_CODE_ATTEMPT_LIMIT,
      RECOVERY_CODE_ATTEMPT_WINDOW_MS,
    );

    if (!limiter.allowed) {
      return c.json(
        { success: false, error: "Too many attempts. Try again later." } satisfies ApiResponse,
        429,
      );
    }

    const parsedBody = recoveryCodeRedeemInputSchema.safeParse(await c.req.json());
    if (!parsedBody.success) {
      return c.json({ success: false, error: "Invalid recovery code" } satisfies ApiResponse, 400);
    }

    const isValidCode = (await hashRecoveryCode(parsedBody.data.code)) === profile.recoveryCode.codeHash;
    if (!isValidCode) {
      return c.json({ success: false, error: "Invalid recovery code" } satisfies ApiResponse, 401);
    }

    const sessionToken = randomToken(32);
    const sessions = cleanSessions([...(profile.managementSessions || []), await createSessionRecord(sessionToken)]);

    await profileStub.updateProfile({
      managementSessions: sessions,
      recoveryCode: {
        codeHash: await hashRecoveryCode(generateRecoveryCode()),
        createdAt: profile.recoveryCode.createdAt,
        lastRotatedAt: new Date().toISOString(),
      },
      lastManagementAccessMethod: "recovery-code",
    });

    c.header("Set-Cookie", sessionCookie(parsedSlug.data, sessionToken, secureCookies), { append: true });
    return c.json({ success: true, data: { authenticated: true } });
  });
}
