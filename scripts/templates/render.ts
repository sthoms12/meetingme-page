// Renders the /templates/ library to static HTML at build time.
// Pages are self-contained (inline CSS + a tiny inline copy script) so the
// Worker only proxies static assets for them and does no per-request rendering.

import {
  TEMPLATES_BASE_PATH,
  TEMPLATE_CATALOG,
  templateDownloadPath,
  templatePath,
} from "../../shared/template-catalog";
import { TEMPLATE_CONTENT, type TemplateContent } from "./content";

export const SITE_ORIGIN = "https://b4wemeet.app";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const ORGANIZATION_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "B4WeMeet",
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/b4wemeet-icon.svg`,
});

const CSS = `:root{--bg:#faf8f3;--fg:#1c2430;--muted:#5b6472;--card:#fff;--line:#e3ded2;--pri:#1f7066;--pri-fg:#faf8f3}
@media (prefers-color-scheme:dark){:root{--bg:#0f141b;--fg:#e8eaee;--muted:#a3abb8;--card:#161d27;--line:#2a3442;--pri:#5fd1a8;--pri-fg:#0f141b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
a{color:var(--pri)}.wrap{max-width:860px;margin:0 auto;padding:0 20px}
.top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 0;border-bottom:1px solid var(--line)}
.brand{font-weight:800;text-decoration:none;color:var(--fg)}.top nav a{margin-left:16px;font-weight:600;text-decoration:none}
h1,h2{font-family:Georgia,ui-serif,serif;line-height:1.15;font-weight:600}h1{font-size:clamp(2rem,6vw,3rem);margin:28px 0 12px}h2{font-size:1.5rem;margin:36px 0 12px}
.crumbs{font-size:.875rem;color:var(--muted);margin-top:20px}.crumbs a{color:var(--muted)}
.lead{font-size:1.125rem;color:var(--fg)}
.box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}
.tools{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 12px}
.btn{display:inline-block;border:0;border-radius:10px;padding:10px 16px;font-family:inherit;font-size:15px;font-weight:600;line-height:1.2;background:var(--pri);color:var(--pri-fg);text-decoration:none;cursor:pointer}
.btn.alt{background:transparent;color:var(--pri);border:1px solid var(--pri)}
pre{margin:0;white-space:pre-wrap;word-wrap:break-word;font:14px/1.55 ui-monospace,Consolas,monospace;max-height:70vh;overflow:auto}
ol li{margin:6px 0}.cta{margin:40px 0;border-color:var(--pri)}.cta h2{margin-top:0}
.grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));padding:0;list-style:none}
.grid a{font-weight:700}.grid p{margin:6px 0 0;color:var(--muted);font-size:.95rem}
footer{margin:48px 0 32px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:.875rem}`;

const COPY_JS = `document.addEventListener("click",function(e){var b=e.target.closest("[data-copy]");if(!b)return;var t=document.getElementById(b.getAttribute("data-copy")).textContent;var d=function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy template"},2000)};if(navigator.clipboard){navigator.clipboard.writeText(t).then(d,function(){b.textContent="Select the text to copy"})}else{b.textContent="Select the text to copy"}});`;

type PageShell = {
  path: string;
  title: string;
  description: string;
  main: string;
  includeCopyScript?: boolean;
};

/** "Meeting agenda template" -> "Meeting Agenda Template" ("One-on-One" keeps a lowercase "on"). */
export const templatePageName = (id: string) =>
  (TEMPLATE_CATALOG.find((entry) => entry.id === id)?.title ?? id)
    .replace(/(^|[\s-])([a-z])/g, (_m: string, sep: string, ch: string) => sep + ch.toUpperCase())
    .replace(/-On-/g, "-on-");

const renderShell = ({ path, title, description, main, includeCopyScript }: PageShell) => {
  const canonical = `${SITE_ORIGIN}${path}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="B4WeMeet">
<meta name="twitter:card" content="summary">
<link rel="icon" type="image/svg+xml" href="/b4wemeet-icon.svg">
<script type="application/ld+json">${ORGANIZATION_JSON_LD}</script>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<header class="top"><a class="brand" href="/">B4WeMeet</a><nav aria-label="Primary"><a href="${TEMPLATES_BASE_PATH}">Templates</a><a href="/#create-page">Create your page</a></nav></header>
<main>
${main}
</main>
<footer><a href="${TEMPLATES_BASE_PATH}">All meeting templates</a> · <a href="/">B4WeMeet home</a></footer>
</div>
${includeCopyScript ? `<script>${COPY_JS}</script>` : ""}
</body>
</html>
`;
};

const contentFor = (id: string): TemplateContent => {
  const content = TEMPLATE_CONTENT.find((entry) => entry.id === id);
  if (!content) throw new Error(`Missing template content for ${id}`);
  return content;
};

export const renderTemplatePage = (id: string) => {
  const c = contentFor(id);
  const others = TEMPLATE_CATALOG.filter((entry) => entry.id !== id)
    .map((entry) => `<li><a href="${templatePath(entry.id)}">${esc(entry.title)}</a></li>`)
    .join("");
  const main = `<p class="crumbs"><a href="/">Home</a> › <a href="${TEMPLATES_BASE_PATH}">Templates</a> › ${esc(c.h1)}</p>
<h1>${esc(c.h1)}</h1>
<p class="lead">${esc(c.summary)}</p>
<section aria-labelledby="tpl-h">
<h2 id="tpl-h">The template</h2>
<div class="box">
<div class="tools"><button class="btn" type="button" data-copy="tpl">Copy template</button><a class="btn alt" href="${templateDownloadPath(id)}" download>Download (.txt)</a></div>
<pre id="tpl">${esc(c.body)}</pre>
</div>
</section>
<section aria-labelledby="how-h">
<h2 id="how-h">How to use it</h2>
<ol>${c.howTo.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>
</section>
<section class="box cta" aria-labelledby="cta-h">
<h2 id="cta-h">Turn this into your B4WeMeet page</h2>
<p>${esc(c.ctaText)} We'll fill in the focus, topics and pre-meeting note from this template; you add your name and details.</p>
<a class="btn" href="/create?template=${esc(id)}#create-page">Turn this into your B4WeMeet page</a>
</section>
<section aria-labelledby="more-h">
<h2 id="more-h">More meeting templates</h2>
<ul>${others}</ul>
</section>`;
  return renderShell({
    path: templatePath(id),
    title: `${templatePageName(id)} | Free Template`,
    description: c.metaDescription,
    main,
    includeCopyScript: true,
  });
};

export const renderHubPage = () => {
  const cards = TEMPLATE_CATALOG.map((entry) => {
    const c = contentFor(entry.id);
    return `<li class="box"><a href="${templatePath(entry.id)}">${esc(entry.title)}</a><p>${esc(c.hubBlurb)}</p></li>`;
  }).join("");
  const main = `<p class="crumbs"><a href="/">Home</a> › Templates</p>
<h1>Free meeting templates</h1>
<p class="lead">Free, copy-and-paste templates for meeting agendas, one-on-ones, client onboarding, pre-meeting questionnaires, meeting prep and interview preparation. Each one can be copied, downloaded as a text file, or turned into a B4WeMeet page you share before the meeting.</p>
<ul class="grid">${cards}</ul>
<section class="box cta" aria-labelledby="cta-h">
<h2 id="cta-h">Share the context before you meet</h2>
<p>B4WeMeet turns your intro, links, focus areas and talking points into one page people can open before a meeting.</p>
<a class="btn" href="/#create-page">Create your B4WeMeet page</a>
</section>`;
  return renderShell({
    path: TEMPLATES_BASE_PATH,
    title: "Free Meeting Templates | B4WeMeet",
    description:
      "Free meeting templates: agenda, one-on-one, client onboarding questionnaire, pre-meeting questionnaire, meeting prep and interview preparation.",
    main,
  });
};

export const renderDownload = (id: string) => contentFor(id).body;

/** Map of output path (relative to the static root, no leading slash) to file contents. */
export const renderTemplateLibrary = (): Map<string, string> => {
  const files = new Map<string, string>();
  files.set("templates/index.html", renderHubPage());
  for (const entry of TEMPLATE_CATALOG) {
    files.set(`templates/${entry.id}/index.html`, renderTemplatePage(entry.id));
    files.set(`templates/${entry.id}/${entry.id}.txt`, renderDownload(entry.id));
  }
  return files;
};
