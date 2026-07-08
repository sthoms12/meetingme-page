# Before We Meet Durability and Recovery Spec

## Goal

Keep the current no-account creation flow, but make ownership and recovery dependable enough that users can trust the product over time.

This spec assumes the current architecture stays in place:

- React SPA
- Cloudflare Worker API
- Cloudflare Durable Object storage per profile
- Owner auth via edit token -> session cookie
- Optional public-page password separate from owner access

## Current State

### What already exists

- Profile creation returns a private `editToken`
- `editToken` is stored only as `editTokenHash`
- The edit token can be exchanged for a cookie-backed owner session
- Owner sessions are stored on the profile record and capped to 5 active sessions
- Public pages can optionally be password protected
- Profile history, analytics, photo storage, and variants already live in the same Durable Object

### Current weaknesses

1. Ownership is not explained clearly enough in the UI
2. Losing the private management link or browser storage is recoverable only if the user saved the link
3. Password protection can be mistaken for ownership/authentication
4. There is no export or backup mechanism
5. Cross-device management exists only through the private link, which is fragile

## Product Principles

1. No account remains the default path
2. Password protects viewers, not owners
3. Recovery is optional durability, not mandatory signup
4. The private management link remains a first-class ownership mechanism
5. No outbound email dependency. Recovery is handled with a passkey as the primary durable mechanism and a silently generated recovery code as a background safety net

## Scope

### In scope

- Ownership/recovery UX
- Management-link safeguards
- Optional passkey claim as the primary recovery mechanism
- Background recovery code as a secondary safety net
- Export and backup
- Cross-device continuation
- Minimal storage/schema changes

### Out of scope

- Mandatory accounts
- Social login
- Multi-user collaboration
- Billing
- Team workspaces

## Delivery Plan

## Phase 1: Ownership Clarity and Safeguards

### User-visible changes

Add explicit ownership language in three places:

1. Create flow after publish
   - "This page is managed from this device."
   - "Save your private management link."
   - "Password protects visitors, not editing access."

2. Edit dashboard
   - Ownership status panel
   - Last verified access method
   - Session/device count

3. Password settings
   - Rename/describe as visitor privacy
   - Avoid language that implies owner sign-in

### Functional changes

1. Improve the post-publish success state
   - Require the user to explicitly acknowledge they saved the private link
   - Add a second "copy private link" surface
   - Add "download recovery sheet" as a text file or markdown file

2. Add management-link tools in the dashboard
   - Copy current management link
   - Regenerate management link
   - Show warning before regeneration that old unsaved links may stop working if one-time mode is later enabled

3. Add destructive-action warnings
   - Before removing password
   - Before clearing photo
   - Before rotating recovery details
   - Before ending all other sessions

### API changes

Add:

- `POST /api/profiles/:slug/manage/regenerate`
  - Requires owner session
  - Issues new edit token
  - Replaces `editTokenHash`
  - Returns fresh management URL payload

- `GET /api/profiles/:slug/manage/access`
  - Requires owner session
  - Returns ownership metadata:
    - active session count
    - recovery enabled state
    - last recovery verification timestamp
    - whether current session came from edit token exchange

### Data model additions

Extend `StoredProfile` with:

```ts
interface RecoveryState {
  passkeyEnabled: boolean;
  recoveryCodeEnabled: boolean;
  editTokenRotatedAt?: string;
  lastManagementAccessMethod?: "initial" | "edit-token" | "passkey" | "recovery-code";
}
```

Add to `StoredProfile`:

```ts
recovery?: RecoveryState;
```

## Phase 2: Passkey Claim (Default) with Recovery Code Safety Net

### Why this replaces email recovery

No outbound email dependency, no third-party provider, and no secret for the user to store or lose. WebAuthn credentials are origin-bound, sync automatically across a user's own devices through the platform's own keychain, and the private key never leaves the device. This solves the actual failure mode: users do not reliably save recovery emails or one-time codes for a tool they touch a few times a year.

The recovery code is kept, but demoted to a background safety net rather than a user-facing setup step. It is generated silently at creation time and stored hashed, so a user who never sets up a passkey still has one fallback path, without adding a decision or a "save this now" moment to the create flow.

### User story

"I created a page with no account. I added a passkey when prompted. I lost my device or the private link. I open the page on a new device, choose 'Recover access', and approve with Face ID or my fingerprint. I'm back in, no email, no code to dig up."

### Default behavior (no user decision required)

1. At page creation, the Worker silently generates a recovery code, stores only its hash, and never surfaces the raw value to the user unless they explicitly ask for it later in the dashboard (Access section, "reveal backup recovery code").
2. After the first successful publish, the UI shows one optional prompt: "Secure this page with a passkey." Skippable, not blocking.
3. If skipped, the page still has the private management link plus the silent recovery code as fallback. No further nagging.

### UX flow, passkey path

1. Owner is on an authenticated session (either fresh from create, or from the management link)
2. Owner taps "Secure this page with a passkey"
3. Browser's WebAuthn prompt runs (Face ID, fingerprint, or platform key)
4. Public key credential is registered and bound to the profile
5. Later, from any device, owner opens `/:slug/edit`, chooses "Recover access with passkey"
6. Successful WebAuthn assertion creates a new owner session and can rotate the edit token

### UX flow, recovery code fallback

1. Owner without a passkey opens `/:slug/edit` with no valid session
2. Owner chooses "Use backup recovery code"
3. If they never viewed it, this path has nothing to offer, so the dashboard should nudge users toward passkey setup precisely because the code is not guaranteed to have been saved
4. If they had revealed and saved it, they enter the code, it is hashed and compared, and a new owner session is issued

### API additions

- `POST /api/profiles/:slug/passkey/register/start`
  - Requires owner session
  - Returns WebAuthn registration options (challenge, rp id, user handle)

- `POST /api/profiles/:slug/passkey/register/complete`
  - Requires owner session
  - Verifies attestation, stores public key credential
  - Returns success plus credential nickname/device label

- `POST /api/profiles/:slug/passkey/auth/start`
  - Unauthenticated, slug-scoped
  - Returns WebAuthn assertion options for registered credentials on that profile
  - Always returns a challenge shape even if no credential exists, to avoid confirming passkey enrollment by response shape

- `POST /api/profiles/:slug/passkey/auth/complete`
  - Verifies assertion signature against stored public key
  - Creates owner session cookie
  - Optionally rotates `editTokenHash`

- `GET /api/profiles/:slug/recovery-code/reveal`
  - Requires owner session
  - Returns the raw recovery code exactly once per explicit reveal action, regenerating it immediately after reveal so a leaked view cannot be reused silently
  - Rate-limited hard, this is a sensitive read

- `POST /api/profiles/:slug/recovery-code/redeem`
  - Unauthenticated, slug-scoped
  - Accepts a code, hashes and compares
  - Creates owner session cookie on match, rotates the recovery code and optionally the edit token

### Data model additions

Add:

```ts
interface PasskeyCredential {
  id: string;
  publicKey: string;
  counter: number;
  deviceLabel?: string;
  createdAt: string;
  lastUsedAt?: string;
}

interface RecoveryCodeState {
  codeHash: string;
  createdAt: string;
  lastRotatedAt?: string;
  revealedAt?: string;
}
```

Add to `StoredProfile`:

```ts
passkeys?: PasskeyCredential[];
recoveryCode?: RecoveryCodeState;
```

### Storage behavior

- Never store a raw recovery code, only its hash
- Rotate the recovery code every time it is revealed or redeemed, so a single exposure has a short shelf life
- Store WebAuthn public keys only, never private key material (WebAuthn never sends private keys to the server by design)
- Keep the signature counter per credential to detect cloned authenticators

### Abuse controls

Add rate limits for:

- passkey auth attempts per profile and per IP/user-agent
- recovery code reveal per owner session
- recovery code redemption attempts per profile and per IP/user-agent

Optional:

- require Turnstile only after repeated failed recovery-code redemption attempts, not on the passkey path and not on the happy path

## Phase 3: Export and Backup

### User-visible changes

In the dashboard, add:

- Export as JSON
- Export as Markdown
- Copy public page data
- Download all variants

### API additions

- `GET /api/profiles/:slug/export.json`
  - Requires owner session
  - Returns normalized profile payload, excluding secrets

- `GET /api/profiles/:slug/export.md`
  - Requires owner session
  - Returns markdown snapshot of profile, variants, links, and metadata

### Notes

- Export should include recovery metadata status, not secret values
- Export should include created timestamp, variant data, and URLs
- Markdown export should be human-readable first

## Phase 4: Cross-Device Continuation

### User story

"I am still the owner, still no account, but I want to continue editing on my laptop after creating on my phone."

### UX flow

1. Authenticated owner clicks "Open on another device"
2. They choose:
   - copy private link
   - authenticate with passkey on the new device directly
   - temporary one-time handoff link (displayed as text/QR to transfer manually)
3. New device opens the handoff link, or completes a passkey assertion if that platform credential is available there too
4. Worker creates a fresh owner session on that device

### API additions

- `POST /api/profiles/:slug/handoff`
  - Requires owner session
  - Creates a short-lived one-time token
  - Returns a handoff URL

- `POST /api/profiles/:slug/handoff/complete`
  - Exchanges one-time handoff token for owner session
  - Invalidates token after use

### Data model additions

Add:

```ts
interface HandoffToken {
  id: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}
```

Add to `StoredProfile`:

```ts
handoffTokens?: HandoffToken[];
```

## Phase 5: Optional Account Layer

Do not start here.

Only add accounts if usage proves a need for:

- multiple pages per owner
- stronger long-term ownership identity
- team management
- centralized analytics across pages

If this phase happens later, accounts should wrap the existing no-account model rather than replace it.

## UI Touchpoints

## Home page

Update post-publish panel to include:

- Save private link
- Explain local ownership
- Optional "secure this page with a passkey"
- Download backup/export

## Edit page

Add a new "Access" tab or section:

- Ownership status
- Active sessions
- Passkey setup and registered devices
- Reveal backup recovery code
- Regenerate management link
- Export tools
- Cross-device handoff

Keep the current Builder / Analytics / Embed / History structure if desired, but "Access" should become a first-class area.

## Public profile page

Add a light recovery entry only where appropriate:

- not on the public profile by default
- recovery entry belongs on `/:slug/edit` when access is missing

When a user reaches the edit page without session access:

- show "Use private link"
- show "Recover access"
- avoid implying password unlock can help them manage the page

## Detailed Backend Changes

## `worker/types.ts`

Add:

- `RecoveryState`
- `PasskeyCredential`
- `RecoveryCodeState`
- `HandoffToken`

and extend `StoredProfile`.

## `worker/userRoutes.ts`

Add routes for:

- management link regeneration
- access metadata
- passkey register start/complete
- passkey auth start/complete
- recovery code reveal/redeem
- handoff start/complete
- export json/markdown

Refactor repeated auth/rate-limit logic into small helpers once these routes exist. The file is already carrying enough route-specific logic that recovery will otherwise make it sprawl.

## `worker/auth.ts`

Add helpers for:

- WebAuthn challenge generation, attestation verification, and assertion verification (via a small server-side WebAuthn library or hand-rolled per WebAuthn spec)
- recovery code generation and hashing
- recovery code rotation on reveal/redemption

Keep owner session cookies as-is. The session-cookie model is fine.

## Durable Object behavior

Still store profile, sessions, history, analytics, passkey credentials, and recovery code state in the profile Durable Object.

No new persistence layer is required for this phase.

## Recommended Technical Decisions

1. Keep `editTokenHash` as the root ownership secret
2. Add a passkey (WebAuthn) as the primary durable recovery path
3. Keep a silently generated, hashed recovery code as a secondary safety net, rotated on every reveal or redemption
4. Rotate edit token on successful recovery, whether by passkey or recovery code
5. Keep viewer password entirely separate from owner recovery
6. Keep all recovery metadata, including passkey public keys and recovery code hashes, on the profile Durable Object for now
7. No outbound email dependency for recovery

## Cloudflare Infra Assessment

## What can stay exactly as-is

You do not need new Cloudflare infrastructure for:

- ownership copy/safeguards
- regeneration of management links
- export tools
- cross-device handoff tokens
- recovery state storage
- challenge storage
- session tracking

The current Worker + Durable Object setup is enough for all of that.

## What you need for passkey recovery

Nothing new on the Cloudflare side. WebAuthn registration and assertion verification run entirely inside the Worker using standard crypto primitives, and public key credentials are just another field on the profile record in the same Durable Object. There is no outbound network dependency and no third-party provider to add.

The one library decision is whether to hand-roll WebAuthn verification or use a small server-side WebAuthn library (for example `@simplewebauthn/server`) inside the Worker to handle challenge generation and attestation/assertion verification correctly. That is a dependency choice, not an infrastructure one.

Since this phase no longer needs email, there is no outbound transactional email provider to add at all for the default recovery path.

## Optional Cloudflare additions

These are optional, not required for the first implementation:

1. Turnstile
   - Add only if recovery abuse becomes an issue
   - Best used on repeated recovery attempts, not default flow

2. D1
   - Not needed now
   - Consider only if you later need cross-profile queries, admin tooling, or reporting that is awkward in Durable Objects

3. R2
   - Not needed now
   - Consider only if photo uploads get larger or asset storage requirements expand

4. Queues
   - Not needed now
   - Consider only if you want async email dispatch or audit/event processing

## Recommendation

Ship Phases 1 through 3 on the current Cloudflare architecture. No new provider or infrastructure is required, since passkey recovery stays entirely inside the existing Worker and Durable Object.

Do not add D1, R2, or account infrastructure yet.

## Implementation Order

1. Ownership copy and post-publish safeguards
2. Access section in edit dashboard
3. Management-link regeneration
4. Export endpoints and UI
5. Silent recovery code generation at creation time
6. Passkey registration flow
7. Passkey and recovery code recovery/auth flow
8. Cross-device handoff
9. Optional Turnstile if recovery-code abuse appears

## Acceptance Criteria

### Phase 1

- User clearly understands that the page is managed from this device and/or private link
- User sees at least two chances to save the private link
- User can regenerate the management link from the dashboard

### Phase 2

- Authenticated owner can register a passkey and see it listed in the Access section
- Unauthenticated user with a registered passkey can regain an owner session via WebAuthn assertion
- A recovery code exists for every profile from creation, without requiring the user to set anything up
- Recovery-code and passkey auth-start responses do not expose whether a given mechanism is enrolled
- Successful recovery, by either path, can rotate the edit token
- Revealing or redeeming the recovery code rotates it immediately after use

### Phase 3

- Owner can export page data as JSON and Markdown
- Export excludes secrets and internal token hashes

### Phase 4

- Owner can move editing to another device without creating an account
- One-time handoff links expire and cannot be reused

## Suggested First Build Slice

If you want the highest-value first slice, do this:

1. Add Access section in the dashboard
2. Add management-link regeneration
3. Add JSON/Markdown export
4. Add silent recovery code generation at creation time
5. Add passkey registration and recovery/auth flow

That gets you from fragile no-account MVP to durable no-account product without changing the core product philosophy.
