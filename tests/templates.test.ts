import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  TEMPLATE_CATALOG,
  TEMPLATE_IDS,
  getTemplatePrefill,
  isTemplateLibraryPath,
  resolveTemplateLibraryPath,
} from "../shared/template-catalog";
import { createProfileInputSchema, isReservedSlug } from "../shared/schemas";
import { TEMPLATE_CONTENT } from "../scripts/templates/content";
import { writeTemplateLibrary } from "../scripts/templates/write";

const EXPECTED_IDS = [
  "meeting-agenda-template",
  "one-on-one-meeting-template",
  "client-onboarding-questionnaire",
  "pre-meeting-questionnaire",
  "meeting-prep-template",
  "interview-preparation-template",
];

const FORBIDDEN = [/steve\s*thoms/i, /thomstech/i];

const buildToTemp = () => {
  const root = mkdtempSync(join(tmpdir(), "b4wm-templates-"));
  writeTemplateLibrary(root);
  return root;
};

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

describe("template library build", () => {
  test("catalog and content cover exactly the six launch templates", () => {
    expect([...TEMPLATE_IDS]).toEqual(EXPECTED_IDS);
    expect(TEMPLATE_CONTENT.map((c) => c.id)).toEqual(EXPECTED_IDS);
  });

  test("each template URL builds to static HTML with its canonical, Organization-only JSON-LD, copy, download and CTA", () => {
    const root = buildToTemp();
    try {
      for (const id of EXPECTED_IDS) {
        const html = readFileSync(join(root, "templates", id, "index.html"), "utf8");
        expect(html.startsWith("<!doctype html>")).toBe(true);
        expect(html).toContain(`<link rel="canonical" href="https://b4wemeet.app/templates/${id}/">`);
        expect(html).not.toContain('<div id="root">');
        expect(html).toContain('data-copy="tpl"');
        expect(html).toContain(`href="/templates/${id}/${id}.txt" download`);
        expect(html).toContain(`href="/?template=${id}#create-page"`);
        expect(html).toContain("Turn this into your B4WeMeet page");
        const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
        expect(ld).toEqual([expect.objectContaining({ "@type": "Organization", name: "B4WeMeet" })]);
        expect(html).not.toContain('"Person"');
        expect(readFileSync(join(root, "templates", id, `${id}.txt`), "utf8").length).toBeGreaterThan(200);
      }
      const hub = readFileSync(join(root, "templates", "index.html"), "utf8");
      expect(hub).toContain('<link rel="canonical" href="https://b4wemeet.app/templates/">');
      for (const id of EXPECTED_IDS) expect(hub).toContain(`href="/templates/${id}/"`);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("pages stay lean: under 50KB total and under 20KB of JS each", () => {
    const root = buildToTemp();
    try {
      for (const file of walk(join(root, "templates")).filter((f) => f.endsWith(".html"))) {
        const html = readFileSync(file, "utf8");
        const inlineJs = [...html.matchAll(/<script(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
          .reduce((sum, m) => sum + Buffer.byteLength(m[1]), 0);
        expect(Buffer.byteLength(html)).toBeLessThan(50_000);
        expect(inlineJs).toBeLessThan(20_000);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  test("template output (and dist/client, when built) never mentions a personal name or thomstech", () => {
    const root = buildToTemp();
    try {
      for (const file of walk(join(root, "templates"))) {
        const text = readFileSync(file, "utf8");
        for (const pattern of FORBIDDEN) expect({ file, hit: pattern.test(text) }).toEqual({ file, hit: false });
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
    const built = join(import.meta.dir, "..", "dist", "client", "templates");
    if (existsSync(built)) {
      for (const file of walk(built)) {
        const text = readFileSync(file, "utf8");
        for (const pattern of FORBIDDEN) expect({ file, hit: pattern.test(text) }).toEqual({ file, hit: false });
      }
    }
  });
});

describe("template routing", () => {
  test("/templates paths are handled before profile slugs", () => {
    expect(isTemplateLibraryPath("/templates")).toBe(true);
    expect(isTemplateLibraryPath("/templates/meeting-agenda-template/")).toBe(true);
    expect(isTemplateLibraryPath("/jane-doe")).toBe(false);
    expect(resolveTemplateLibraryPath("/templates/")).toEqual({ kind: "asset" });
    expect(resolveTemplateLibraryPath("/templates/meeting-agenda-template/meeting-agenda-template.txt")).toEqual({ kind: "asset" });
    expect(resolveTemplateLibraryPath("/templates")).toEqual({ kind: "redirect", location: "/templates/" });
    expect(resolveTemplateLibraryPath("/templates/meeting-prep-template")).toEqual({ kind: "redirect", location: "/templates/meeting-prep-template/" });
    expect(resolveTemplateLibraryPath("/templates/not-a-template/")).toEqual({ kind: "not-found" });
  });

  test("'templates' is a reserved handle", () => {
    expect(isReservedSlug("templates")).toBe(true);
    expect(isReservedSlug("Templates")).toBe(true);
    const result = createProfileInputSchema.safeParse({
      fullName: "Jane Doe", jobTitle: "Product Lead", company: "Example Co", customSlug: "templates",
      variantName: "Default", variantSlug: "intro", bio: "I help teams make better product decisions.",
    });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((i) => i.path[0] === "customSlug")).toBe(true);
  });
});

describe("template prefill", () => {
  test("every template id maps to create-form defaults that pass validation", () => {
    for (const entry of TEMPLATE_CATALOG) {
      const prefill = getTemplatePrefill(entry.id);
      expect(prefill).not.toBeNull();
      const result = createProfileInputSchema.safeParse({
        fullName: "Jane Doe", jobTitle: "Product Lead", company: "Example Co",
        bio: "I help teams make better product decisions.",
        ...prefill,
      });
      expect(result.success).toBe(true);
      expect(["Default", "Client Meeting", "Interview", "Investor"]).toContain(prefill!.variantName);
    }
  });

  test("unknown or missing template ids do not prefill", () => {
    expect(getTemplatePrefill(null)).toBeNull();
    expect(getTemplatePrefill("")).toBeNull();
    expect(getTemplatePrefill("__proto__")).toBeNull();
    expect(getTemplatePrefill("nope")).toBeNull();
  });
});
