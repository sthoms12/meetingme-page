import type { StoredSession } from "./types";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_HASH_ITERATIONS = 310_000;
const PASSWORD_HASH_PREFIX = "pbkdf2_sha256";

const textEncoder = new TextEncoder();

export const toBase64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const fromBase64 = (value: string) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

export const fromBase64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  return fromBase64(padded + "=".repeat(padLength));
};

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
};

const derivePasswordHash = async (password: string, salt: Uint8Array) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: PASSWORD_HASH_ITERATIONS,
    },
    keyMaterial,
    256,
  );

  return toBase64Url(new Uint8Array(bits));
};

export const sha256Hex = async (value: string) => {
  const buffer = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return toHex(new Uint8Array(buffer));
};

export const randomToken = (bytes = 32) => {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return toBase64Url(value);
};

export const createPasswordHash = async (password: string) => {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const hash = await derivePasswordHash(password, salt);
  return `${PASSWORD_HASH_PREFIX}$${PASSWORD_HASH_ITERATIONS}$${toBase64Url(salt)}$${hash}`;
};

export const verifyPassword = async (password: string, storedHash?: string) => {
  if (!storedHash) return false;

  if (!storedHash.startsWith(`${PASSWORD_HASH_PREFIX}$`)) {
    return timingSafeEqual(await sha256Hex(password), storedHash);
  }

  const [, iterationsRaw, saltRaw, hashRaw] = storedHash.split("$");
  const iterations = Number(iterationsRaw);

  if (!Number.isFinite(iterations) || iterations !== PASSWORD_HASH_ITERATIONS) {
    return false;
  }

  const derivedHash = await derivePasswordHash(password, fromBase64Url(saltRaw));
  return timingSafeEqual(derivedHash, hashRaw);
};

export const parseCookies = (cookieHeader: string | null | undefined) => {
  const cookies = new Map<string, string>();

  if (!cookieHeader) return cookies;

  for (const chunk of cookieHeader.split(";")) {
    const separator = chunk.indexOf("=");
    if (separator === -1) continue;
    const key = chunk.slice(0, separator).trim();
    const value = chunk.slice(separator + 1).trim();
    cookies.set(key, value);
  }

  return cookies;
};

export const sessionCookieName = (slug: string) => `meetingme_manage_${slug}`;

const cookieSecurityAttributes = (secure: boolean) =>
  `${secure ? "Secure; " : ""}HttpOnly; SameSite=Lax; Path=/`;

export const sessionCookie = (slug: string, token: string, secure: boolean) =>
  `${sessionCookieName(slug)}=${token}; ${cookieSecurityAttributes(secure)}; Max-Age=${SESSION_TTL_SECONDS}`;

export const clearSessionCookie = (slug: string, secure: boolean) =>
  `${sessionCookieName(slug)}=; ${cookieSecurityAttributes(secure)}; Max-Age=0`;

export const createSessionRecord = async (token: string): Promise<StoredSession> => {
  const now = new Date();
  return {
    tokenHash: await sha256Hex(token),
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString(),
    lastUsedAt: now.toISOString(),
  };
};

export const isSessionExpired = (session: StoredSession) =>
  new Date(session.expiresAt).getTime() <= Date.now();

const RECOVERY_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const generateRecoveryCode = () => {
  const groups: string[] = [];

  for (let group = 0; group < 3; group += 1) {
    let chunk = "";
    const bytes = new Uint8Array(4);
    crypto.getRandomValues(bytes);
    for (const byte of bytes) {
      chunk += RECOVERY_CODE_ALPHABET[byte % RECOVERY_CODE_ALPHABET.length];
    }
    groups.push(chunk);
  }

  return groups.join("-");
};

export const normalizeRecoveryCode = (code: string) =>
  code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

export const hashRecoveryCode = (code: string) => sha256Hex(normalizeRecoveryCode(code));

export const deriveRpId = (request: Request) => new URL(request.url).hostname;

export const deriveExpectedOrigin = (request: Request) => new URL(request.url).origin;

export const generateWebauthnChallenge = () => randomToken(32);
