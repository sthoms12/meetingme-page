import { buildLlmsTxt } from '../lib/mirrors';

// llms.txt generated from the canonical page registry at build time.
export const prerender = true;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { 'content-type': 'text/plain; charset=UTF-8' },
  });
}
