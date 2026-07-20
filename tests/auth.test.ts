import { describe, expect, test } from "bun:test";
import {
  clearSessionCookie,
  createPasswordHash,
  createSessionRecord,
  generateRecoveryCode,
  hashRecoveryCode,
  isSessionExpired,
  normalizeRecoveryCode,
  sessionCookie,
  verifyPassword,
} from "../worker/auth";

describe("password and recovery security", () => {
  test("hashes passwords with salted PBKDF2 and verifies them", async () => {
    const stored = await createPasswordHash("correct horse battery staple");

    expect(stored).toStartWith("pbkdf2_sha256$310000$");
    expect(stored).not.toContain("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", stored)).toBe(true);
    expect(await verifyPassword("incorrect", stored)).toBe(false);
  });

  test("normalizes and hashes recovery codes consistently", async () => {
    const code = generateRecoveryCode();
    const normalized = normalizeRecoveryCode(code);

    expect(code).toMatch(/^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    expect(await hashRecoveryCode(code.toLowerCase())).toBe(await hashRecoveryCode(normalized));
  });
});

describe("management sessions", () => {
  test("sets production cookie security attributes", () => {
    const cookie = sessionCookie("jane-doe", "secret", true);
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Max-Age=2592000");
    expect(clearSessionCookie("jane-doe", true)).toContain("Max-Age=0");
  });

  test("creates a live session record", async () => {
    const session = await createSessionRecord("secret");
    expect(session.tokenHash).not.toBe("secret");
    expect(isSessionExpired(session)).toBe(false);
  });
});
