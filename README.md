# B4WeMeet

B4WeMeet is a lightweight personal intro page for people who want to give useful context before a meeting.

It is a bit like Linktree, but the intent is different. Linktree is mainly a list of outbound links. B4WeMeet is a short briefing page: who you are, what you work on, what the meeting is about, and the links someone may need before they talk to you.

## How users use it

1. A user creates a B4WeMeet page from the homepage.
2. They choose a public handle, such as `/jane-doe`.
3. They add their name, role, company, photo, short bio, focus area, discussion topics, and optional meeting note.
4. They add links like LinkedIn, website, video intro, GitHub, X, or phone.
5. They publish the page and get:
   - A public page URL
   - A QR code
   - A private management link
   - Copy-ready blurbs for calendar invites, email, and chat
6. They share the page before meetings so the other person can get oriented quickly.

A visitor sees a polished profile card with the user's role, focus, topics, meeting note, and links. They can add the intro to their calendar, open links, scan/share a QR code, or view a password prompt if the page is protected.

The page owner can return through the private management link to update the page, create audience-specific variants, view basic analytics, embed the card elsewhere, and restore previous versions.

## Linktree comparison

B4WeMeet overlaps with Linktree in one way: both give someone a single URL that collects useful links.

The difference is the job-to-be-done:

- Linktree answers: "Where can people find me?"
- B4WeMeet answers: "What should someone know before they meet me?"

B4WeMeet is better suited for warm intros, sales calls, interviews, client meetings, advisory calls, and networking follow-ups. The page can still include links, but the core product is context.

## Features

- Public intro pages at `/:slug`
- Audience-specific variants at `/:slug/:variant`
- Private edit sessions through a secure management link
- Optional password protection for public pages
- QR code sharing
- Calendar invite export
- Copy-ready blurbs for email, calendar invites, and chat
- Embeddable profile card
- Basic view analytics by variant/source
- Up to three profile variants
- Version snapshots and restore
- Profile photo upload or external image URL
- Persistent storage on Cloudflare Durable Objects

## Architecture

B4WeMeet is a full-stack React app deployed to Cloudflare Workers.

- Frontend: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide, Framer Motion, TanStack Query, React Router
- Backend: Hono routes running inside a Cloudflare Worker
- Storage: Cloudflare Durable Objects
- Validation: Zod schemas shared between frontend and backend
- Build/deploy: Bun, Vite, Wrangler, Cloudflare Workers Builds

The Worker serves both the React app and the API. Cloudflare's SPA asset handling serves the frontend while `/api/*` routes run through Hono.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Create a new B4WeMeet page |
| `/:slug` | Public profile page |
| `/:slug/:variant` | Public page for a specific audience variant |
| `/:slug/edit` | Owner dashboard, unlocked by session or management token |

## API routes

All API responses use this shape:

```ts
{
  success: boolean;
  data?: unknown;
  error?: string;
}
```

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Health check |
| `/api/profiles/availability/:slug` | GET | Check whether a public handle is available |
| `/api/profiles` | POST | Create a new profile and return `slug` plus private `editToken` |
| `/api/profiles/:slug` | GET | Fetch public profile data |
| `/api/profiles/:slug` | PUT | Update a profile as the owner |
| `/api/profiles/:slug/session` | POST | Exchange an edit token for a secure owner session |
| `/api/profiles/:slug/session` | DELETE | Clear the owner session cookie |
| `/api/profiles/:slug/manage` | GET | Fetch owner-only management data |
| `/api/profiles/:slug/verify` | POST | Unlock a password-protected public profile |
| `/api/profiles/:slug/photo` | GET | Serve stored profile photo assets |
| `/api/profiles/:slug/analytics` | GET | Fetch owner-only analytics |
| `/api/profiles/:slug/history/restore` | POST | Restore a saved version snapshot |
| `/api/profiles/:slug/recovery-code/reveal` | POST | Rotate and reveal the owner backup code |
| `/api/client-errors` | POST | Report client-side errors |

## Local development

Prerequisites:

- Bun
- Wrangler, if deploying manually

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

The app runs at:

```text
http://localhost:3000/
```

Run checks:

```bash
bun run check
bun audit --audit-level=high
```

`bun run check` runs linting, TypeScript validation, the automated test suite, and a production build.

## Deployment

The app is deployed through Cloudflare Workers Builds from GitHub. Pushing to `main` triggers the Cloudflare build/deploy pipeline.

Manual deploy is also supported if `CLOUDFLARE_API_TOKEN` is available:

```bash
bun run deploy
```

The public product name is B4WeMeet. Some Cloudflare infrastructure identifiers still use the original `meetingme-page` name so the live Worker, Durable Object data, existing profile slugs, and auto-deploy pipeline stay connected. Rename those only as part of a planned Cloudflare migration.

## Security notes

- The edit token is generated at creation time and only the hash is stored.
- New management links keep the edit token in the URL fragment and exchange it for a cookie-backed owner session. Existing query-token links remain compatible.
- Owner sessions are capped and expired server-side.
- Optional public page passwords are hashed before storage.
- Password verification, session exchange, restore, and update flows are rate-limited.
- Uploaded photos are limited to supported image types and 1 MB.

## License

MIT
