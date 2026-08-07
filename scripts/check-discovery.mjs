import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const {
  CANONICAL_ROUTE_FAMILIES,
  INTENTIONAL_EXCLUSIONS,
  SITE_URL,
  getCanonicalRoutes,
} = require("./discovery-routes.cjs");

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
}

function extractLocations(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function routeFromUrl(value) {
  const url = new URL(value, SITE_URL);
  assert.equal(url.origin, SITE_URL, `Unexpected discovery origin: ${value}`);
  return url.pathname === "/" ? "/" : url.pathname.replace(/\/$/, "");
}

const expectedRoutes = getCanonicalRoutes();
const expectedSet = new Set(expectedRoutes);
assert.equal(expectedSet.size, expectedRoutes.length, "Canonical route inventory contains duplicates.");

const sitemapIndex = read("public/sitemap.xml");
const partitionUrls = extractLocations(sitemapIndex);
assert.ok(partitionUrls.length > 0, "public/sitemap.xml does not reference any sitemap partitions.");
assert.equal(new Set(partitionUrls).size, partitionUrls.length, "Sitemap index contains duplicate partitions.");

const actualUrls = [];
for (const partitionUrl of partitionUrls) {
  const partitionPath = routeFromUrl(partitionUrl);
  const filename = path.basename(partitionPath);
  const absolutePath = path.join(PUBLIC_DIR, filename);
  assert.ok(fs.existsSync(absolutePath), `Sitemap partition is missing locally: ${filename}`);

  const partition = fs.readFileSync(absolutePath, "utf8");
  assert.match(partition, /<urlset\b/, `${filename} is not a sitemap URL set.`);
  actualUrls.push(...extractLocations(partition));
}

const actualRoutes = actualUrls.map(routeFromUrl);
const actualSet = new Set(actualRoutes);
assert.equal(actualSet.size, actualRoutes.length, "Generated sitemap contains duplicate URLs.");

const missing = expectedRoutes.filter((route) => !actualSet.has(route));
const unexpected = actualRoutes.filter((route) => !expectedSet.has(route));
assert.deepEqual(missing, [], `Sitemap is missing canonical routes:\n${missing.slice(0, 20).join("\n")}`);
assert.deepEqual(unexpected, [], `Sitemap contains non-canonical routes:\n${unexpected.slice(0, 20).join("\n")}`);

const robots = read("public/robots.txt");
const robotsSitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
assert.deepEqual(robotsSitemaps, [`${SITE_URL}/sitemap.xml`], "robots.txt must advertise the generated sitemap index.");

const llms = read("public/llms.txt");
const advertisedUrls = [...llms.matchAll(/https:\/\/trustedskills\.dev(?:\/[^\s)>]*)?/g)].map((match) => match[0].replace(/[.,;:]$/, ""));
for (const advertisedUrl of advertisedUrls) {
  const route = routeFromUrl(advertisedUrl);
  const publicFilename = route === "/" ? null : path.join(PUBLIC_DIR, route.slice(1));
  const existsAsPublicFile = publicFilename && fs.existsSync(publicFilename);
  assert.ok(expectedSet.has(route) || existsAsPublicFile, `llms.txt advertises a route outside the local public contract: ${route}`);
}
assert.doesNotMatch(llms, /(?:https:\/\/trustedskills\.dev)?\/api\//, "llms.txt must not advertise an unapproved public API.");

const skillsPage = read("app/skills/page.tsx");
const rootLayout = read("app/layout.tsx");
assert.match(rootLayout, /template:\s*["']%s \| TrustedSkills["']/, "The root metadata template must supply the brand suffix.");
assert.match(
  skillsPage,
  /export const metadata:[\s\S]*?title:\s*["']Browse Agent Skills["']\s*,\s*\r?\n\s*description:/,
  "/skills must supply exactly one unbranded title to the root metadata template."
);

const activeApiDir = path.join(ROOT_DIR, "app", "api");
assert.ok(!fs.existsSync(activeApiDir), "An active public API directory exists but is not part of the approved discovery contract.");

console.log(`Discovery check passed: ${actualRoutes.length} canonical URLs across ${partitionUrls.length} sitemap partitions.`);
console.log(`Canonical families: ${CANONICAL_ROUTE_FAMILIES.join(", ")}`);
console.log(`Intentional exclusions: ${Object.keys(INTENTIONAL_EXCLUSIONS).join(", ")}`);
