import { z } from "zod";

export const MAX_API_BODY_BYTES = 1_600_000;
export const MAX_CLIENT_ERROR_BODY_BYTES = 16_384;
export const CLIENT_ERROR_LIMIT = 20;
export const CLIENT_ERROR_WINDOW_MS = 60 * 1000;

export const clientErrorReportSchema = z.object({
  message: z.string().max(2_000),
  url: z.string().max(2_000),
  timestamp: z.string().max(100).optional(),
  stack: z.string().max(8_000).nullish(),
  componentStack: z.string().max(8_000).nullish(),
  errorBoundary: z.string().max(200).nullish(),
});

export const getClientKey = (request: Request) => {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  return ip;
};

export const retryAfterSeconds = (retryAfterMs: number) =>
  Math.max(1, Math.ceil(retryAfterMs / 1000)).toString();

export const securityHeaders = (request: Request) => {
  const isEmbed = new URL(request.url).searchParams.get("embed") === "1";
  const frameAncestors = isEmbed ? "*" : "'self'";

  return {
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      `frame-ancestors ${frameAncestors}`,
      "script-src 'self' 'unsafe-inline' https://zoanalytics-thomstech.zocomputer.io",
      "connect-src 'self' https://zoanalytics-thomstech.zocomputer.io",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  };
};

export const withSecurityHeaders = (response: Response, request: Request) => {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders(request))) {
    headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
