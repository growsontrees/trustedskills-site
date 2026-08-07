const fs = require("node:fs");
const path = require("node:path");

const SITE_URL = "https://trustedskills.dev";
const SITEMAP_SIZE = 5000;
const PAGE_SIZE = 25;
const ROOT_DIR = path.resolve(__dirname, "..");

// This is the public, canonical discovery contract. Keep private registry fields
// out of this module: sitemap generation needs routes, not enriched records.
const CANONICAL_ROUTE_FAMILIES = Object.freeze([
  "/",
  "/skills",
  "/skills/:slug",
  "/skills/category/:category",
  "/skills/category/:category/:page",
  "/platform/:platform",
  "/platform/:platform/:page",
  "/tier/:tier",
  "/tier/:tier/:page",
  "/docs",
  "/docs/:section/:article",
  "/reviews",
  "/reviews/:slug",
  "/submit",
]);

const INTENTIONAL_EXCLUSIONS = Object.freeze({
  "/category/**": "Legacy duplicate; canonical category pages live under /skills/category/.",
  "/skills?...": "Filtered search views canonicalize to /skills and are not sitemap entries.",
  "/api/**": "No public registry API is approved; enriched registry data remains private.",
  "/_api_disabled/**": "Source-only disabled route handlers are not public routes.",
});

const TIER_SLUGS = Object.freeze(["featured", "verified", "community", "unverified"]);
const STATIC_ROUTES = Object.freeze(["/", "/skills", "/docs", "/reviews", "/submit"]);

function readText(relativePath) {
  return fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
}

function readSkillsIndex() {
  return JSON.parse(readText("data/skills-index.json"));
}

function routeSegment(value) {
  return encodeURIComponent(String(value));
}

function extractDocRoutes() {
  const source = readText("lib/docs-content.ts");
  const routes = [];
  const slugPattern = /slug:\s*\[\s*["']([^"']+)["']\s*,\s*["']([^"']+)["']\s*\]/g;

  for (const match of source.matchAll(slugPattern)) {
    routes.push(`/docs/${routeSegment(match[1])}/${routeSegment(match[2])}`);
  }

  if (routes.length === 0) {
    throw new Error("Discovery contract could not find any DOC_ARTICLES slugs.");
  }

  return routes;
}

function extractReviewRoutes() {
  const source = readText("lib/reviews-content.ts");
  const reviewsBlock = source.match(/export const reviews:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
  if (!reviewsBlock) {
    throw new Error("Discovery contract could not find the reviews array.");
  }

  const routes = [];
  const slugPattern = /slug:\s*["']([^"']+)["']/g;
  for (const match of reviewsBlock[1].matchAll(slugPattern)) {
    routes.push(`/reviews/${routeSegment(match[1])}`);
  }

  return routes;
}

// Mirrors the route's own VALID_PLATFORMS rather than the richer platform
// taxonomy: /platform/[platform] 404s on anything outside this list, and the
// sitemap must describe what the app actually serves.
function extractBrowsablePlatforms() {
  const source = readText("app/platform/[platform]/page.tsx");
  const listBlock = source.match(/const VALID_PLATFORMS\s*=\s*\[([^\]]*)\]/);
  if (!listBlock) {
    throw new Error("Discovery contract could not find VALID_PLATFORMS.");
  }

  const platforms = (listBlock[1].match(/["']([^"']+)["']/g) ?? [])
    .map((value) => value.slice(1, -1))
    // The route filters with skill.platforms.includes(slug), so the slug is
    // matched against registry values directly.
    .map((slug) => ({ slug, registryValues: [slug] }));

  if (platforms.length === 0) {
    throw new Error("Discovery contract could not find any browsable platform definitions.");
  }

  return platforms;
}

function addPaginatedRoutes(routes, basePath, itemCount) {
  const totalPages = Math.max(1, Math.ceil(itemCount / PAGE_SIZE));
  routes.add(basePath);
  for (let page = 2; page <= totalPages; page += 1) {
    routes.add(`${basePath}/${page}`);
  }
}

function getCanonicalRoutes() {
  const index = readSkillsIndex();
  const routes = new Set(STATIC_ROUTES);

  for (const skill of index.skills) {
    routes.add(`/skills/${routeSegment(skill.slug)}`);
  }

  for (const category of index.categories) {
    const count = index.skills.filter((skill) => skill.category === category.slug).length;
    addPaginatedRoutes(routes, `/skills/category/${routeSegment(category.slug)}`, count);
  }

  for (const platform of extractBrowsablePlatforms()) {
    const count = index.skills.filter((skill) =>
      skill.platforms?.some((value) => platform.registryValues.includes(value))
    ).length;
    if (count > 0) addPaginatedRoutes(routes, `/platform/${routeSegment(platform.slug)}`, count);
  }

  for (const tier of TIER_SLUGS) {
    const count = index.skills.filter((skill) => skill.verified === tier).length;
    addPaginatedRoutes(routes, `/tier/${routeSegment(tier)}`, count);
  }

  for (const route of extractDocRoutes()) routes.add(route);
  for (const route of extractReviewRoutes()) routes.add(route);

  return [...routes].sort((a, b) => a.localeCompare(b));
}

module.exports = {
  CANONICAL_ROUTE_FAMILIES,
  INTENTIONAL_EXCLUSIONS,
  SITE_URL,
  SITEMAP_SIZE,
  getCanonicalRoutes,
};
