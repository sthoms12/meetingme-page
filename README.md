# MeetingMe Page

A full-stack web application built on Cloudflare Workers with a modern React frontend, featuring persistent storage via Durable Objects, beautiful UI components, and seamless deployment.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)]  
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sthoms12/meetingme-page)

## ✨ Features

- **Full-Stack Architecture**: React + Vite frontend served via Cloudflare Pages with Hono-powered API backend on Cloudflare Workers.
- **Durable Objects**: Stateful storage for counters, lists, and custom data with global consistency.
- **Modern UI**: Tailwind CSS + shadcn/ui components, dark mode, animations, and responsive design.
- **TypeScript Everywhere**: End-to-end type safety with shared types between frontend and backend.
- **Developer Experience**: Hot reload, error reporting, TanStack Query, React Router, and more.
- **Production-Ready**: CORS, logging, health checks, client error reporting, and automatic SPA routing.
- **Demo Endpoints**: Counter increment/decrement, CRUD for demo items using Durable Objects.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Lucide React, Framer Motion, TanStack Query, React Router, Sonner (toasts), Zod
- **Backend**: Hono, Cloudflare Workers, Durable Objects
- **Styling**: Tailwind CSS + Tailwind Animate, CSS Variables for theming
- **Utilities**: Immer, clsx, tw-merge, date-fns, UUID
- **Build Tools**: Bun, Wrangler, Cloudflare Vite Plugin
- **Dev Tools**: ESLint, TypeScript ESLint, Prettier (via shadcn)

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Bun](https://bun.sh/) installed
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bun install -g wrangler`)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd meetingme-page-wm3fzj4fjmxrlnrsxaxep
bun install
```

### 2. Generate Types (Workers)
```bash
bun run cf-typegen
```

### 3. Development Server
```bash
bun run dev
```
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/*

Access:
- `/` - Demo home page
- `/api/health` - Health check
- `/api/counter` - Get counter value
- `/api/counter/increment` - Increment counter
- `/api/demo` - Get demo items (CRUD available)

## 🔨 Build & Preview
```bash
bun run build
bun run preview
```

## ☁️ Deployment

Deploy to Cloudflare with one command:

```bash
bun run deploy
```

Or use the [Cloudflare Dashboard](https://dash.cloudflare.com/) to deploy directly.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/sthoms12/meetingme-page)

**Notes**:
- Custom domain: Update `wrangler.jsonc` and run `wrangler deploy`.
- Environment variables/bindings: Add via Wrangler secrets or Dashboard.
- Durable Objects: Automatically migrated on deploy.

## 📚 API Reference

All API routes under `/api/*` with JSON responses `{ success: boolean, data?: T, error?: string }`.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/counter` | GET | Get counter value |
| `/api/counter/increment` | POST | Increment counter |
| `/api/demo` | GET | List demo items |
| `/api/demo` | POST | Add demo item |
| `/api/demo/:id` | PUT | Update demo item |
| `/api/demo/:id` | DELETE | Delete demo item |
| `/api/test` | GET | Test endpoint |
| `/api/client-errors` | POST | Report client errors |

**Example (fetch)**:
```ts
const res = await fetch('/api/demo');
const { data } = await res.json();
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Questions? Open an issue!

Built with ❤️ for Cloudflare's edge platform.