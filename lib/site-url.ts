export const SITE_URL = "https://trustedskills.dev";

/**
 * Absolute URL for a route, in the form the sitemap lists it: no trailing
 * slash (next.config has trailingSlash: false, so a slashed URL 308s).
 * Canonical tags, og:url and JSON-LD all use this so they agree.
 */
export function canonicalUrl(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? SITE_URL : `${SITE_URL}${trimmed}`;
}

/**
 * Path to a skill's detail page. Registry slugs can hold ":", "&", "%",
 * spaces or CJK, so the slug is always percent-encoded, the same way the
 * sitemap encodes it. The page decodes it again before the lookup.
 */
export function skillPath(slug: string): string {
  return `/skills/${encodeURIComponent(slug)}`;
}
