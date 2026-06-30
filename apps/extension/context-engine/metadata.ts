export function getMeta(name: string): string {
  const el = document.querySelector(
    `meta[name="${name}"], meta[property="og:${name}"], meta[name="twitter:${name}"]`,
  );
  return (el as HTMLMetaElement)?.content || "";
}

export function getSiteMeta() {
  return {
    url: window.location.href,
    hostname: window.location.hostname,
    title: getMeta("title") || document.title,
    description: getMeta("description") || "",
    favicon:
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement)?.href ||
      "/favicon.ico",
    siteName: getMeta("site_name") || window.location.hostname,
    ogImage: getMeta("image") || "",
    selectedText: window.getSelection()?.toString() || "",
  };
}
