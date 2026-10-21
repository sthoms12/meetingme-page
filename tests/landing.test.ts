import { describe, expect, test } from "bun:test";
import { gzipSync } from "node:zlib";
import { buildLandingDocument } from "../worker/landing";

describe("static landing page", () => {
  test("ships the marketing page without the app bundle", () => {
    const html = buildLandingDocument(new Request("https://b4wemeet.app/?utm_source=test"));

    expect(html).toContain("Send the context before the calendar invite.");
    expect(html).toContain("Send the context before the meeting starts.");
    expect(html).toContain('href="/create#create-page"');
    expect(html).toContain("Create your page");
    expect(html).toContain("How B4WeMeet works");
    expect(html).toContain("What visitors see");
    expect(html).toContain('rel="canonical" href="https://b4wemeet.app/"');
    expect(html).toContain("application/ld+json");
    expect(html).toContain('content="index,follow"');
    expect(html).toContain('aria-label="Footer"');
    expect(html).toContain("min-height: 44px");
    expect(html).not.toContain("/src/main.tsx");
    expect(html).not.toContain('type="module"');
    expect(html).toContain('defer src="/zowa.js"');
    expect(gzipSync(Buffer.from(html)).length).toBeLessThan(20_000);
    expect(Buffer.byteLength(html)).toBeLessThan(50_000);
  });
});