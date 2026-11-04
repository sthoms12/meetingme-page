import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// Fails if the retired analytics host or its owner label reappears in sources or build output.
const ROOT = join(import.meta.dir, "..");
const SELF = relative(ROOT, import.meta.path);
const PATTERN = new RegExp(["thoms" + "tech", "zo" + "computer"].join("|"), "i");
const SKIP = new Set(["node_modules", ".git", ".wrangler", ".eslintcache"]);
const DIRS = ["src", "worker", "public", "shared", "scripts", "tests", "index.html", "dist"];

function walk(path: string, out: string[]): void {
  if (!existsSync(path)) return;
  if (statSync(path).isDirectory()) {
    for (const name of readdirSync(path)) if (!SKIP.has(name)) walk(join(path, name), out);
  } else out.push(path);
}

describe("no legacy analytics references", () => {
  test("sources, public files and build output are clean", () => {
    const files: string[] = [];
    for (const d of DIRS) walk(join(ROOT, d), files);
    const hits = files
      .filter((f) => relative(ROOT, f) !== SELF)
      .filter((f) => PATTERN.test(readFileSync(f).toString("latin1")))
      .map((f) => relative(ROOT, f));
    expect(hits).toEqual([]);
  });
});
