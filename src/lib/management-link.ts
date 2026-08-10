export const buildManagementUrl = (origin: string, slug: string, editToken: string) =>
  `${origin.replace(/\/$/, "")}/${slug}/edit#token=${encodeURIComponent(editToken)}`;

export const readManagementToken = (url: URL) => {
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
  return hashParams.get("token") || url.searchParams.get("token");
};

export const stripManagementToken = (url: URL) => {
  const cleanUrl = new URL(url.toString());
  cleanUrl.searchParams.delete("token");

  const hashParams = new URLSearchParams(cleanUrl.hash.replace(/^#/, ""));
  hashParams.delete("token");
  cleanUrl.hash = hashParams.toString();

  return `${cleanUrl.pathname}${cleanUrl.search}${cleanUrl.hash}`;
};

export const consumeManagementToken = () => {
  if (typeof window === "undefined") return null;

  const bootstrappedToken = window.__b4wemeetEditToken;
  if (bootstrappedToken) {
    delete window.__b4wemeetEditToken;
    return bootstrappedToken;
  }

  const url = new URL(window.location.href);
  const token = readManagementToken(url);
  if (token) window.history.replaceState(null, "", stripManagementToken(url));
  return token;
};
