import { defineConfig } from 'astro/config';

// Static content site + one local tool island (spec §6). No server adapter:
// the thin Worker in worker/index.ts serves dist/ as static assets and
// handles markdown negotiation, security headers and 410s for retired
// profile/API routes.
export default defineConfig({
  site: 'https://b4wemeet.app',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
