# B4WeMeet Reliability Hardening

## Scope

This pass adds regression protection and edge abuse controls without changing the product contract, stored profile data, Durable Object bindings, or ordinary public traffic.

## Design

- Exercise critical API workflows through the actual Hono route handlers with in-memory Durable Object substitutes. Cover creation, public reads, management-token exchange, authenticated updates, history restoration, recovery-code rotation, and one-time redemption.
- Keep application-level Durable Object throttles as the authoritative per-profile safeguards.
- Attempt Cloudflare edge rate limits only for profile creation and authentication/recovery write endpoints. Do not challenge or limit the homepage, public profile reads, static assets, robots.txt, sitemap.xml, or the health endpoint. If the zone's rule quota is already consumed by stronger protection, preserve that rule and rely on the existing Durable Object throttles until the Cloudflare quota changes.
- Enable Dependabot security updates and vulnerability alerts, then close superseded dependency pull requests after the current dependency state passes the audit gate.

## Verification

Run lint, TypeScript, all tests, the production build, frozen-lockfile installation, and the high-severity dependency audit. Verify Cloudflare rules after creation and smoke-test production after deployment.

## Cloudflare result

Cloudflare rejected both proposed rules during dry-run because the zone permits one rate-limit rule and the existing leaked-credential rule occupies that slot. No Cloudflare rule changed. The leaked-credential rule remains enabled, and the existing application-level limits remain the active safeguards for profile creation, session exchange, password verification, passkeys, updates, restores, and recovery.
