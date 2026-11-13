const fs = require("node:fs");
const path = require("node:path");

const SITE_URL = "https://trustedskills.dev";
const SITEMAP_SIZE = 5000;
const ROOT_DIR = path.resolve(__dirname, "..");

// This is the public, canonical discovery contract. Keep private registry fields
// out of this module: sitemap generation needs routes, not enriched records.
const CANONICAL_ROUTE_FAMILIES = Object.freeze([
  "/",
  "/skills",
  "/skills/:slug",
  "/skills/category/:category",
  "/platform/:platform",
  "/tier/:tier",
  "/docs",
  "/docs/:section/:article",
  "/reviews",
  "/reviews/:slug",
  "/collections",
  "/collections/:slug",
  "/trending",
  "/submit",
  "/contact",
  "/privacy",
]);

const INTENTIONAL_EXCLUSIONS = Object.freeze({
  "/category/**": "Legacy duplicate; canonical category pages live under /skills/category/.",
  "/skills?...": "Filtered search views canonicalize to /skills and are not sitemap entries.",
  "/skills/category/:category/:page, /platform/:platform/:page, /tier/:tier/:page":
    "Pagination pages still load and link through, but are thin lists; only page 1 is listed.",
  "/skills/:slug (weak)":
    "Skill pages that are not strong (see isStrongSkill) still load and stay indexable, but are left out so crawl goes to the strong ones.",
  "/api/**": "No public registry API is approved; enriched registry data remains private.",
  "/_api_disabled/**": "Source-only disabled route handlers are not public routes.",
});

// Mirrors TIER_ORDER, which is what /tier/[tier] accepts. Hardcoding the list
// here meant a new tier (Checked) shipped pages the sitemap did not describe.
function extractTierSlugs() {
  const source = readText("lib/skill-config.ts");
  const listBlock = source.match(/export const TIER_ORDER:\s*VerificationTier\[\]\s*=\s*\[([^\]]*)\]/);
  if (!listBlock) {
    throw new Error("Discovery contract could not find TIER_ORDER.");
  }

  const tiers = (listBlock[1].match(/["']([^"']+)["']/g) ?? []).map((value) => value.slice(1, -1));
  if (tiers.length === 0) {
    throw new Error("Discovery contract could not find any tier slugs in TIER_ORDER.");
  }

  return tiers;
}
const STATIC_ROUTES = Object.freeze([
  "/",
  "/skills",
  "/docs",
  "/reviews",
  "/collections",
  "/trending",
  "/submit",
  "/contact",
  "/privacy",
]);

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

/**
 * Editorial content lives as one JSON file per item under content/. Only
 * published items are canonical: a draft is not served in production, so
 * putting it in the sitemap would advertise a 404.
 */
function extractEditorialRoutes(dirName, basePath) {
  const dir = path.join(ROOT_DIR, "content", dirName);
  if (!fs.existsSync(dir)) return [];

  const routes = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const item = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (item.status !== "published") continue;
    if (!item.slug) {
      throw new Error(`Editorial content ${dirName}/${file} has no slug.`);
    }
    routes.push(`${basePath}/${routeSegment(item.slug)}`);
  }
  return routes;
}

function extractReviewRoutes() {
  return extractEditorialRoutes("reviews", "/reviews");
}

function extractCollectionRoutes() {
  return extractEditorialRoutes("collections", "/collections");
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

// Only page 1 of a paginated list goes in the sitemap. Pages 2 and later are
// thin lists of links. They still load, and Google can follow them, but
// listing ~5,000 of them told Google most of the site was low value.
function addListRoute(routes, basePath) {
  routes.add(basePath);
}

// A skill page goes in the sitemap only when it is strong: it passed or skipped
// the safety scan (not flagged), it has written content of its own, and its
// registry Signal Score is in roughly the top quarter. Weak pages still load
// and stay indexable; they are just not advertised. With ~45,000 thin URLs in
// the sitemap, Google indexed almost none of them (GSC, 2026-10-16).
const MIN_SIGNAL_SCORE = 30;
const MIN_LONG_DESCRIPTION_CHARS = 300;

function readSafetyVerdicts() {
  const file = path.join(ROOT_DIR, "data", "safety-reports.json");
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8")).reports ?? {};
}

function isStrongSkill(skill, safetyVerdicts) {
  if (safetyVerdicts[skill.slug]?.verdict === "flagged") return false;
  if ((skill.longDescription ?? "").length <= MIN_LONG_DESCRIPTION_CHARS) return false;
  return (skill.signal?.score ?? 0) >= MIN_SIGNAL_SCORE;
}

/** Skill slugs named by published reviews and collections. They always stay listed. */
function extractEditorialSkillSlugs() {
  const slugs = new Set();
  for (const dirName of ["reviews", "collections"]) {
    const dir = path.join(ROOT_DIR, "content", dirName);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      const item = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
      if (item.status !== "published") continue;
      collectSkillSlugs(item, slugs);
    }
  }
  return slugs;
}

function collectSkillSlugs(value, slugs) {
  if (Array.isArray(value)) {
    for (const entry of value) collectSkillSlugs(entry, slugs);
  } else if (value && typeof value === "object") {
    for (const [key, entry] of Object.entries(value)) {
      if (key === "skillSlug" && typeof entry === "string") slugs.add(entry);
      collectSkillSlugs(entry, slugs);
    }
  }
}

// Mirrors isUnlisted() in lib/skill-config.ts: both registry checks could not
// find the skill in its repository, at the same commit. Those pages are
// noindex, so the sitemap must not list them. The canary test's frozen slugs
// are never unlisted (ONE-139).
const CANARY_FROZEN_SLUGS = new Set(require("../lib/canary-frozen-slugs.json").slugs);

function isUnlisted(skill) {
  return (
    !CANARY_FROZEN_SLUGS.has(skill.slug) &&
    skill.skill_path_status === "not_found" &&
    skill.install_status === "missing" &&
    !!skill.install_checked_sha &&
    skill.install_checked_sha === skill.skill_path_checked_sha
  );
}

function getCanonicalRoutes() {
  const full = readSkillsIndex();
  const index = { ...full, skills: full.skills.filter((skill) => !isUnlisted(skill)) };
  const routes = new Set(STATIC_ROUTES);

  const safetyVerdicts = readSafetyVerdicts();
  const editorialSlugs = extractEditorialSkillSlugs();
  for (const skill of index.skills) {
    const pinned = CANARY_FROZEN_SLUGS.has(skill.slug) || editorialSlugs.has(skill.slug);
    if (pinned || isStrongSkill(skill, safetyVerdicts)) {
      routes.add(`/skills/${routeSegment(skill.slug)}`);
    }
  }

  for (const category of index.categories) {
    const count = index.skills.filter((skill) => skill.category === category.slug).length;
    if (count === 0) continue;
    addListRoute(routes, `/skills/category/${routeSegment(category.slug)}`);
  }

  for (const platform of extractBrowsablePlatforms()) {
    const count = index.skills.filter((skill) =>
      skill.platforms?.some((value) => platform.registryValues.includes(value))
    ).length;
    if (count > 0) addListRoute(routes, `/platform/${routeSegment(platform.slug)}`);
  }

  for (const tier of extractTierSlugs()) {
    addListRoute(routes, `/tier/${routeSegment(tier)}`);
  }

  for (const route of extractDocRoutes()) routes.add(route);
  for (const route of extractReviewRoutes()) routes.add(route);
  for (const route of extractCollectionRoutes()) routes.add(route);

  return [...routes].sort((a, b) => a.localeCompare(b));
}

module.exports = {
  CANARY_FROZEN_SLUGS,
  CANONICAL_ROUTE_FAMILIES,
  INTENTIONAL_EXCLUSIONS,
  SITE_URL,
  SITEMAP_SIZE,
  getCanonicalRoutes,
};
