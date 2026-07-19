import { describe, expect, test } from "bun:test";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import {
  MAX_CLIENT_ERROR_BODY_BYTES,
  clientErrorReportSchema,
  getClientKey,
  retryAfterSeconds,
  securityHeaders,
  withSecurityHeaders,
} from "../worker/security";

describe("response security", () => {
  test("sets the expected browser protections", () => {
    const headers = securityHeaders(new Request("https://b4wemeet.example/profile"));
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'self'");
    expect(headers["Content-Security-Policy"]).toContain("zoanalytics-thomstech.zocomputer.io");
    expect(headers["Strict-Transport-Security"]).toContain("max-age=31536000");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  test("preserves explicit profile embedding", () => {
    const headers = securityHeaders(new Request("https://b4wemeet.example/profile?embed=1"));
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors *");
  });

  test("applies headers while preserving the response", async () => {
    const secured = withSecurityHeaders(
      new Response("ok", { status: 201, headers: { "x-existing": "yes" } }),
      new Request("https://b4wemeet.example/"),
    );
    expect(secured.status).toBe(201);
    expect(secured.headers.get("x-existing")).toBe("yes");
    expect(secured.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(await secured.text()).toBe("ok");
  });
});

describe("request hardening", () => {
  test("rejects oversized error reports", async () => {
    const app = new Hono();
    app.use("/errors", bodyLimit({
      maxSize: MAX_CLIENT_ERROR_BODY_BYTES,
      onError: (c) => c.json({ success: false }, 413),
    }));
    app.post("/errors", async (c) => c.json(await c.req.json()));

    const response = await app.request("/errors", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "x".repeat(20_000) }),
    });
    expect(response.status).toBe(413);
  });

  test("validates the error-report contract", () => {
    expect(clientErrorReportSchema.safeParse({ message: "boom", url: "https://example.com" }).success).toBe(true);
    expect(clientErrorReportSchema.safeParse({ message: "x".repeat(2_001), url: "https://example.com" }).success).toBe(false);
    expect(clientErrorReportSchema.safeParse({ unexpected: true }).success).toBe(false);
  });

  test("uses stable client keys and retry values", () => {
    const request = new Request("https://example.com", {
      headers: { "CF-Connecting-IP": "192.0.2.1", "User-Agent": "test-agent" },
    });
    expect(getClientKey(request)).toBe("192.0.2.1");
    expect(retryAfterSeconds(60_001)).toBe("61");
  });
});
