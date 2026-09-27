#!/usr/bin/env node
/**
 * Bring data/skills-index.json up to date with the registry without losing the
 * site's own enrichment.
 *
 * The registry is the source of truth for which skills exist, their installs
 * and their verification data. The site adds work the registry does not have:
 * rewritten descriptions, longDescriptions, the official tier and the
 * 16-category taxonomy. This script keeps that work for every skill it already
 * knows, then runs the same (LLM-free) passes over the new skills.
 *
 * Usage: node scripts/sync-index.mjs <path-to-registry-skills-index.json>
 */

import { readFileSync, writeFileSync } from "fs";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_INDEX = join(__dirname, "../data/skills-index.json");

// A registry that suddenly shrinks is far more likely broken than pruned.
// Dropping skills removes live pages, so refuse rather than guess.
const MIN_KEEP_RATIO = 0.9;

// Fields the site owns. Registry values for these are stubs or absent.
const SITE_FIELDS = [
  "description",
  "descriptionSource",
  "longDescription",
  "longDescriptionSource",
  "longDescriptionAt",
  "longDescriptionModel",
  "category",
  "installOverrides",
  "preferredPlatform",
];

// Tiers the site assigns (mark-official) or curates by hand. The registry
// reports nearly everything as "community", so it must not demote these.
const CURATED_TIERS = new Set(["official", "featured", "verified"]);

const registryPath = process.argv[2];
if (!registryPath) {
  console.error("Usage: node scripts/sync-index.mjs <registry skills-index.json>");
  process.exit(1);
}

const registry = JSON.parse(readFileSync(resolve(registryPath), "utf8"));
const site = JSON.parse(readFileSync(SITE_INDEX, "utf8"));

if (!Array.isArray(registry.skills) || registry.skills.length === 0) {
  console.error("Registry index has no skills array.");
  process.exit(1);
}
if (registry.skills.length < site.skills.length * MIN_KEEP_RATIO) {
  console.error(
    `Registry has ${registry.skills.length} skills, site has ${site.skills.length}. ` +
      `That is below the ${MIN_KEEP_RATIO * 100}% floor, so nothing was changed.`
  );
  process.exit(1);
}

const previous = new Map(site.skills.map((skill) => [skill.slug, skill]));
const seen = new Set();
let kept = 0;
let added = 0;

const skills = [];
for (const fresh of registry.skills) {
  if (!fresh?.slug || seen.has(fresh.slug)) continue;
  seen.add(fresh.slug);

  const old = previous.get(fresh.slug);
  const merged = { ...fresh };
  if (old) {
    kept++;
    for (const field of SITE_FIELDS) {
      if (old[field] !== undefined) merged[field] = old[field];
    }
    if (CURATED_TIERS.has(old.verified)) merged.verified = old.verified;
  } else {
    added++;
  }
  skills.push(merged);
}

const dropped = site.skills.length - kept;
site.skills = skills;
writeFileSync(SITE_INDEX, JSON.stringify(site, null, 2));
console.log(`Merged: ${kept} kept, ${added} new, ${dropped} no longer in the registry.`);

// Same passes the March import used. None of them call an LLM.
const run = (script, ...args) =>
  execFileSync(process.execPath, [join(__dirname, script), ...args], { stdio: ["ignore", "ignore", "inherit"] });
run("enrich-descriptions.mjs", "--no-checkpoint"); // template descriptions for stub skills
run("mark-official.mjs"); // official tier for known publisher orgs
run("reclassify.mjs"); // category taxonomy + category counts
// Checked describes a specific commit, so it is reapplied from the stored scan
// on every build rather than carried through the merge. A skill the scan has
// not reached stays Listed.
run("apply-safety-tiers.mjs");

const final = JSON.parse(readFileSync(SITE_INDEX, "utf8"));
final.generated_at = registry.generated_at ?? new Date().toISOString();

// reclassify.mjs assigns categories but leaves the category list's counts as
// they were, so recount from the skills themselves.
const counts = new Map();
for (const skill of final.skills) counts.set(skill.category, (counts.get(skill.category) ?? 0) + 1);
final.categories = final.categories
  .map((category) => ({ ...category, count: counts.get(category.slug) ?? 0 }))
  .filter((category) => category.count > 0);
for (const [slug, count] of counts) {
  if (!final.categories.some((category) => category.slug === slug)) {
    final.categories.push({ slug, name: slug, emoji: "📦", count });
  }
}

final.stats = {
  total_skills: final.skills.length,
  total_installs: final.skills.reduce((sum, skill) => sum + (skill.installs || 0), 0),
  total_authors: new Set(final.skills.map((skill) => skill.author)).size,
  last_updated: registry.stats?.last_updated ?? final.generated_at,
};
writeFileSync(SITE_INDEX, JSON.stringify(final, null, 2));
console.log(`Wrote ${final.stats.total_skills} skills (${final.stats.total_authors} authors).`);
