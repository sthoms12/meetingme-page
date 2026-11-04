// Prebuilds the static /templates/ library into public/templates/ so Vite
// copies it into the asset bundle. Runs before `vite build` and `vite`.
import { join, resolve } from "node:path";
import { writeTemplateLibrary } from "./templates/write";

const root = resolve(process.argv[2] ?? "public");
const files = writeTemplateLibrary(root);
console.log(`Prebuilt ${files.size} template library files into ${join(root, "templates")}`);
