(() => {
  const endpoint = "https://zoanalytics-thomstech.zocomputer.io/api/analytics/collect";
  const siteId = "cloudflare-meetingme-page";
  if (window.__zoanalyticsLoaded || navigator.webdriver) return;
  window.__zoanalyticsLoaded = true;

  const sessionKey = "zoanalytics_session";
  const sessionTtl = 30 * 60 * 1000;

  const getSession = () => {
    const now = Date.now();
    try {
      const saved = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
      if (saved?.id && now - saved.touched < sessionTtl) {
        saved.touched = now;
        sessionStorage.setItem(sessionKey, JSON.stringify(saved));
        return saved.id;
      }
      const next = { id: crypto.randomUUID(), touched: now };
      sessionStorage.setItem(sessionKey, JSON.stringify(next));
      return next.id;
    } catch {
      return null;
    }
  };

  const sessionId = getSession();
  const params = new URLSearchParams(location.search);
  const campaign = {
    source: params.get("utm_source") || null,
    medium: params.get("utm_medium") || null,
    campaign: params.get("utm_campaign") || null,
    content: params.get("utm_content") || null,
    term: params.get("utm_term") || null,
  };

  const payload = (extra) => ({
    siteId,
    path: location.pathname + location.search,
    title: document.title,
    url: location.href,
    referrer: document.referrer || null,
    screen: `${screen.width}x${screen.height}`,
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    sessionId,
    campaign,
    ...extra,
  });

  const send = (extra = {}) => {
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(payload(extra)),
      credentials: "omit",
      keepalive: true,
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    }).catch(() => {});
  };

  let lastPath = "";
  const pageview = () => {
    const path = location.pathname + location.search;
    if (path === lastPath) return;
    lastPath = path;
    send();
  };

  const pushState = history.pushState;
  const replaceState = history.replaceState;
  history.pushState = function () {
    pushState.apply(this, arguments);
    queueMicrotask(pageview);
  };
  history.replaceState = function () {
    replaceState.apply(this, arguments);
    queueMicrotask(pageview);
  };
  addEventListener("popstate", pageview);
  window.zoanalytics = { track: (event, data) => send({ event, data }) };
  pageview();

  let cls = 0;
  let inp = 0;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const entry = entries[entries.length - 1];
      if (entry) send({ event: "web-vital", data: { metric: "LCP", value: Math.round(entry.startTime) } });
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) if (entry.interactionId && entry.duration > inp) inp = entry.duration;
    }).observe({ type: "event", buffered: true, durationThreshold: 40 });
  } catch {}

  addEventListener("load", () => {
    const navigation = performance.getEntriesByType("navigation")[0];
    if (navigation) send({ event: "web-vital", data: { metric: "TTFB", value: Math.round(navigation.responseStart) } });
  }, { once: true });
  addEventListener("pagehide", () => {
    send({ event: "web-vital", data: { metric: "CLS", value: Math.round(cls * 1000) / 1000 } });
    if (inp > 0) send({ event: "web-vital", data: { metric: "INP", value: Math.round(inp) } });
  }, { once: true });
})();
