export const HOME_TITLE = "B4WeMeet | Pre-meeting intro pages for better meetings";

export const HOME_DESCRIPTION =
  "B4WeMeet helps you create a concise pre-meeting intro page with your bio, role, links, focus areas, and talking points so people arrive prepared.";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const absoluteUrl = (request: Request, path: string) => new URL(path, request.url).toString();

const landingCss = `
:root {
  color-scheme: light;
  --bg: hsl(44 38% 97%);
  --fg: hsl(220 30% 8%);
  --muted: hsl(218 12% 38%);
  --card: hsl(0 0% 100%);
  --line: hsl(42 18% 84%);
  --primary: hsl(166 56% 28%);
  --primary-fg: hsl(44 38% 97%);
  --soft: hsl(166 56% 28% / 0.08);
}
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
    --bg: hsl(218 28% 8%);
    --fg: hsl(42 24% 92%);
    --muted: hsl(42 12% 68%);
    --card: hsl(218 25% 11%);
    --line: hsl(216 18% 20%);
    --primary: hsl(158 48% 58%);
    --primary-fg: hsl(218 28% 8%);
    --soft: hsl(158 48% 58% / 0.12);
  }
}
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background-color: var(--bg);
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--line) 55%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--line) 45%, transparent) 1px, transparent 1px);
  background-size: 44px 44px;
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
}
.skip {
  position: fixed;
  left: 1rem;
  top: 1rem;
  z-index: 5;
  transform: translateY(-150%);
  background: var(--primary);
  color: var(--primary-fg);
  min-height: 44px;
  padding: 0 1rem;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.75rem;
}
.skip:focus { transform: none; }
.wrap { max-width: 72rem; margin: 0 auto; padding: 2.5rem 1.25rem 3rem; }
.hero { display: grid; gap: 1.5rem; align-items: end; }
.eyebrow {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  margin: 0 0 1rem;
  padding: 0 1rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: color-mix(in srgb, var(--card) 88%, transparent);
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  max-width: 14ch;
  font-family: Georgia, "Iowan Old Style", "Palatino Linotype", serif;
  font-size: clamp(2.7rem, 8vw, 5.6rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 0.94;
}
.lead { max-width: 40rem; margin: 1.25rem 0 0; color: var(--muted); font-size: 1.125rem; }
.actions, .link-row { display: flex; flex-wrap: wrap; gap: 0.25rem 0.5rem; align-items: center; }
.actions { margin-top: 1.5rem; }
a { color: var(--primary); }
.tap, .link-row a, .actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  padding: 0 0.9rem;
  border-radius: 0.85rem;
  font-weight: 700;
  text-decoration: none;
}
.actions a.cta {
  background: var(--primary);
  color: var(--primary-fg);
  min-height: 48px;
  padding: 0 1.15rem;
}
.cta:hover { filter: brightness(1.05); }
.steps {
  border: 1px solid var(--line);
  background: color-mix(in srgb, var(--card) 92%, transparent);
  border-radius: 1rem;
  padding: 1.25rem;
}
.steps ol { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin: 0; padding: 0; list-style: none; }
.steps li { border: 1px solid var(--line); border-radius: 0.85rem; background: color-mix(in srgb, var(--bg) 70%, var(--card)); padding: 0.9rem 0.5rem; text-align: center; }
.steps strong { display: block; font-family: Georgia, serif; font-size: 1.7rem; color: var(--primary); font-weight: 500; }
.steps span { display: block; margin-top: 0.2rem; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.steps p { margin: 1rem 0 0; color: var(--muted); font-size: 0.95rem; }
section { margin-top: 2.75rem; }
h2 { margin: 0 0 0.75rem; font-family: Georgia, serif; font-size: clamp(1.8rem, 3vw, 2.4rem); font-weight: 500; }
.panel { border: 1px solid var(--line); background: color-mix(in srgb, var(--card) 92%, transparent); border-radius: 1.25rem; padding: 1.25rem 1.35rem; }
ol.steps-list { margin: 0; padding-left: 1.2rem; }
ol.steps-list li { margin: 0.55rem 0; }
.faq { display: grid; gap: 0.75rem; }
details { border: 1px solid var(--line); border-radius: 1rem; background: var(--card); padding: 0 1rem; }
summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; font-weight: 700; }
details p { margin: 0 0 1rem; color: var(--muted); }
.note { margin-top: 1rem; color: var(--muted); font-size: 0.85rem; }
footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid var(--line); }
footer p { color: var(--muted); font-size: 0.9rem; }
a:focus-visible, summary:focus-visible { outline: 3px solid var(--primary); outline-offset: 3px; }
@media (min-width: 900px) {
  .hero { grid-template-columns: minmax(0, 1fr) 22rem; gap: 2.5rem; }
  .wrap { padding-top: 4.5rem; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
`.trim();

export const buildLandingDocument = (request: Request) => {
  const canonical = absoluteUrl(request, "/");
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "B4WeMeet",
    applicationCategory: "BusinessApplication",
    description: HOME_DESCRIPTION,
    url: canonical,
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(HOME_TITLE)}</title>
  <meta name="description" content="${escapeHtml(HOME_DESCRIPTION)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta name="robots" content="index,follow" />
  <meta property="og:title" content="${escapeHtml(HOME_TITLE)}" />
  <meta property="og:description" content="${escapeHtml(HOME_DESCRIPTION)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="B4WeMeet" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(HOME_TITLE)}" />
  <meta name="twitter:description" content="${escapeHtml(HOME_DESCRIPTION)}" />
  <link rel="icon" type="image/svg+xml" href="/b4wemeet-icon.svg" />
  <script type="application/ld+json">${structuredData}</script>
  <style>${landingCss}</style>
  <script defer src="/zowa.js"></script>
</head>
<body>
  <a class="skip" href="#how-it-works">Skip to how it works</a>
  <div class="wrap">
    <header class="hero">
      <div>
        <p class="eyebrow">B4WeMeet</p>
        <h1>Send the context before the calendar invite.</h1>
        <p class="lead">Send the context before the meeting starts. ${escapeHtml(HOME_DESCRIPTION)}</p>
        <nav class="actions" aria-label="Primary">
          <a class="cta" href="/create#create-page">Create your page</a>
          <a href="#how-it-works">How it works</a>
          <a href="#security">Review security</a>
        </nav>
      </div>
      <aside class="steps">
        <ol>
          <li><strong>01</strong><span>Create</span></li>
          <li><strong>02</strong><span>Share</span></li>
          <li><strong>03</strong><span>Meet</span></li>
        </ol>
        <p>Designed for warm intros, client calls, interviews, advisory chats, and any meeting where a short briefing beats a long bio.</p>
      </aside>
    </header>
    <section id="how-it-works" class="panel">
      <h2>How B4WeMeet works</h2>
      <ol class="steps-list">
        <li>Create a public handle and short profile.</li>
        <li>Add the links, focus areas, and meeting notes people need.</li>
        <li>Share one clean URL before a client call, interview, intro, or advisory conversation.</li>
      </ol>
    </section>
    <section id="visitors" class="panel">
      <h2>What visitors see</h2>
      <p>Each page is built for pre-meeting context rather than just social links. Visitors can scan a short bio, understand what you work on, open relevant links, and export a calendar note.</p>
    </section>
    <section id="security">
      <h2>Security and privacy</h2>
      <p class="lead">B4WeMeet uses a privacy-first architecture. Open a topic to read how a page is stored and who can edit it.</p>
      <div class="faq">
        <details>
          <summary>Where is my data stored?</summary>
          <p>Profile data is persisted with Cloudflare Durable Objects, close to visitors and encrypted at rest.</p>
        </details>
        <details>
          <summary>How are passwords handled?</summary>
          <p>Plain-text passwords are not stored. A password is hashed at the edge with PBKDF2-SHA256, a unique salt, and a high iteration count.</p>
        </details>
        <details>
          <summary>Who can edit my page?</summary>
          <p>Editing requires the private management link created with the page. Public visitors only get the read-only intro.</p>
        </details>
        <details>
          <summary>What about visitor privacy?</summary>
          <p>Pages log anonymous view counts. They do not collect visitor email addresses or use cross-site tracking cookies.</p>
        </details>
        <details>
          <summary>How secure is the infrastructure?</summary>
          <p>The app runs on Cloudflare's network, with the platform's DDoS protection in front of every request.</p>
        </details>
      </div>
      <p class="note">Keep the private management link. It is the way back in after you leave this browser.</p>
    </section>
    <footer>
      <nav class="link-row" aria-label="Footer">
        <a href="#how-it-works">How it works</a>
        <a href="#visitors">What visitors see</a>
        <a href="#security">Security</a>
        <a href="/create#create-page">Create your page</a>
      </nav>
      <p>B4WeMeet. Pre-meeting intro pages.</p>
    </footer>
  </div>
</body>
</html>`;
};
