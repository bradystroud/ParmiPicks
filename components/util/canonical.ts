// The site has one public origin. Every page derives its canonical URL from its
// route so authors never type it by hand (20 of 94 hand-typed values had drifted:
// stale file extensions, misspelled slugs, or bare slugs with no origin).
export const SITE_URL = "https://parmipicks.com";

export function canonicalUrl(path: string): string {
  const normalized = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
  return `${SITE_URL}${normalized}`;
}

// Tina relativePath values look like "some-post.mdx"; routes use the bare slug.
export function slugFromRelativePath(relativePath: string): string {
  return relativePath.replace(/\.mdx?$/, "");
}
