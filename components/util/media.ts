// TinaCloud rewrites image fields to its media CDN (assets.tina.io) when it
// serves a query. Our media is committed to the repo and served from /public,
// and images added by the blog pipeline never get synced to the CDN — so those
// CDN URLs 404. Map them back to the local /uploads path (mediaRoot is
// "uploads", which TinaCloud strips) so every git-committed image resolves and
// Next optimises it locally. Non-Tina URLs and already-local paths pass through.
const TINA_CDN = /^https?:\/\/assets\.tina\.io\/[^/]+\//;

export function localMedia(src?: string | null): string {
  if (!src) return "";
  return src.replace(TINA_CDN, "/uploads/");
}

// Same mapping but returns an absolute URL, for og:image / JSON-LD where an
// absolute, publicly fetchable URL is required.
export function localMediaAbsolute(
  src?: string | null,
  origin = "https://parmipicks.com"
): string {
  const local = localMedia(src);
  if (!local) return "";
  return local.startsWith("http") ? local : `${origin}${local}`;
}
