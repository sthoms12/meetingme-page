# B4WeMeet Production Readiness Remediation

Date: 2026-08-10
Status: Approved

## Scope

Resolve the code-controlled production blockers found in the August 2026 review without changing the Cloudflare Durable Object identity, stored profile schema, public routes, or account-free ownership model.

## Compatibility boundary

Existing management links using `/:slug/edit?token=...` must continue to work. Newly created and regenerated links use `/:slug/edit#token=...`, which keeps the ownership secret out of HTTP requests, Cloudflare logs, referrer data, and server-rendered markup. The edit page accepts either format, exchanges the token for the existing cookie-backed session, and removes the secret from browser-visible navigation immediately. Query links are retained only as a migration path.

## Security changes

- Change recovery-code reveal from `GET` to `POST` because it rotates persistent security state.
- Change management cookies from `SameSite=Lax` to `SameSite=Strict` while retaining `Secure`, `HttpOnly`, the current path, and the current lifetime.
- Preserve all current rate limits, password hashing, passkey flows, edit-token hashes, and recovery-code rotation behavior.
- Add regression tests for strict session cookies and the link parsing/building compatibility contract.

## Dependency strategy

Keep React 18, React Router 6, Tailwind 3, TypeScript 5, and Vite 6. Apply patched releases within the current architecture and update `bun.lock` atomically. Do not merge the existing grouped major-upgrade Dependabot PRs. The CI frozen-lockfile and high-severity audit gates must both pass.

## Cloudflare boundary

The blanket managed challenge is a Cloudflare configuration issue rather than a repository change. Code remediation must not change Worker or Durable Object identifiers. Once Cloudflare access is restored, narrow the challenge away from public pages, `/api/health`, static assets, and ordinary profile reads, while retaining targeted protection for abusive write traffic.

## Verification

Run lint, TypeScript validation, all Bun tests, production build, frozen dependency installation, and the high-severity audit. Confirm the working tree contains only intended changes and record any Cloudflare-side blocker separately.
