import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { renderTemplateLibrary } from "./render";

/** Writes the prebuilt template library under `<staticRoot>/templates/`. */
export const writeTemplateLibrary = (staticRoot: string) => {
  rmSync(join(staticRoot, "templates"), { recursive: true, force: true });
  const files = renderTemplateLibrary();
  for (const [relativePath, contents] of files) {
    const target = join(staticRoot, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
  return files;
};
