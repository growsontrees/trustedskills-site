#!/usr/bin/env node
/**
 * Validates editorial content — reviews and collections — before a build.
 *
 * This is the enforcement point for the rule that matters most on this site:
 * a review of a skill nobody ran does not get published as a hands-on test.
 * The schema can express "we only read the source" honestly, but it cannot
 * express "we ran it" without saying what was run and what happened.
 *
 * Runs as `prebuild`, so bad editorial content fails the deploy rather than
 * shipping quietly. Drafts are checked structurally but are held to the looser
 * rules: they're work in progress and they never reach production.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { installStatusWarning } from "./lib/editorial-checks.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REVIEWS_DIR = path.join(ROOT, "content", "reviews");
const COLLECTIONS_DIR = path.join(ROOT, "content", "collections");

const STATUSES = new Set(["draft", "published"]);
const BASES = new Set(["hands-on", "source-review"]);
const VERDICTS = new Set([
  "Highly Recommended",
  "Recommended",
  "Use With Caution",
  "Not Recommended",
]);
const SCORE_KEYS = ["installation", "documentation", "depth", "maintenance", "platformSupport"];

/**
 * Phrases that turn a run report into a prediction. These are fine in analysis
 * prose — "it would suit an agency" is a judgement — but inside a run's task or
 * outcome they mean the run didn't happen.
 */
const SPECULATIVE = [
  /\bwould (?:find|report|flag|detect|catch|fail|likely|probably)\b/i,
  /\bwe'?d expect\b/i,
  /\bexpected to\b/i,
  /\b(?:predicted|hypothetical|presumably)\b/i,
  /\blikely findings?\b/i,
];

const errors = [];
const warnings = [];

function fail(file, message) {
  errors.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function readJsonDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const file = path.join(dir, name);
      try {
        return { name, data: JSON.parse(fs.readFileSync(file, "utf8")) };
      } catch (error) {
        errors.push(`${name}: not valid JSON — ${error.message}`);
        return null;
      }
    })
    .filter(Boolean);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  return nonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function loadRegistryIndex() {
  const file = path.join(ROOT, "data", "skills-index.json");
  if (!fs.existsSync(file)) {
    warnings.push("data/skills-index.json is missing — skipping registry slug checks.");
    return { slugs: null, bySlug: null };
  }
  const index = JSON.parse(fs.readFileSync(file, "utf8"));
  const bySlug = new Map(index.skills.map((skill) => [skill.slug, skill]));
  return { slugs: new Set(bySlug.keys()), bySlug };
}

const { slugs: registrySlugs, bySlug: registryBySlug } = loadRegistryIndex();

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

const reviews = readJsonDir(REVIEWS_DIR);

for (const { name, data } of reviews) {
  const published = data.status === "published";

  if (data.slug !== name.replace(/\.json$/, "")) {
    fail(name, `slug "${data.slug}" does not match the filename`);
  }
  if (!STATUSES.has(data.status)) {
    fail(name, `status must be "draft" or "published", got ${JSON.stringify(data.status)}`);
  }
  if (!BASES.has(data.evidenceBasis)) {
    fail(
      name,
      `evidenceBasis must be "hands-on" or "source-review", got ${JSON.stringify(data.evidenceBasis)}`
    );
  }
  if (!VERDICTS.has(data.verdict)) {
    fail(name, `verdict must be one of the four defined verdicts, got ${JSON.stringify(data.verdict)}`);
  }

  for (const field of ["title", "description", "skillSlug", "summary"]) {
    if (!nonEmptyString(data[field])) fail(name, `${field} is required`);
  }
  for (const field of ["publishedAt", "lastUpdated"]) {
    if (!isIsoDate(data[field])) fail(name, `${field} must be a parseable date`);
  }
  if (!nonEmptyString(data.author?.name) || !nonEmptyString(data.author?.bio)) {
    fail(name, "author.name and author.bio are required");
  }

  // Scores
  const scores = data.scores ?? {};
  for (const key of SCORE_KEYS) {
    const value = scores[key];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      fail(name, `scores.${key} must be an integer 1-5, got ${JSON.stringify(value)}`);
    }
  }
  if (SCORE_KEYS.every((key) => Number.isInteger(scores[key]))) {
    const mean = SCORE_KEYS.reduce((sum, key) => sum + scores[key], 0) / SCORE_KEYS.length;
    const expected = Math.round(mean * 10) / 10;
    if (typeof data.overallScore !== "number" || Math.abs(data.overallScore - expected) > 0.001) {
      fail(
        name,
        `overallScore ${data.overallScore} does not match the mean of the five dimensions (${expected}). ` +
          `The overall score is derived, not a separate judgement.`
      );
    }
  }

  // Registry linkage
  if (registrySlugs && nonEmptyString(data.skillSlug) && !registrySlugs.has(data.skillSlug)) {
    fail(name, `skillSlug "${data.skillSlug}" is not in the registry index`);
  }

  // The evidence rule
  const runs = Array.isArray(data.runs) ? data.runs : [];
  if (!Array.isArray(data.runs)) fail(name, "runs must be an array (use [] for a source review)");

  if (data.evidenceBasis === "hands-on") {
    if (published && runs.length === 0) {
      fail(
        name,
        "a published hands-on review must record at least one run. A review of a skill nobody ran " +
          'cannot ship as hands-on — either add the run, or set evidenceBasis to "source-review".'
      );
    }
    runs.forEach((run, i) => {
      for (const field of ["platform", "task", "outcome"]) {
        if (!nonEmptyString(run?.[field])) fail(name, `runs[${i}].${field} is required`);
      }
      if (!isIsoDate(run?.testedAt)) fail(name, `runs[${i}].testedAt must be a parseable date`);
      for (const pattern of SPECULATIVE) {
        for (const field of ["task", "outcome"]) {
          if (typeof run?.[field] === "string" && pattern.test(run[field])) {
            fail(
              name,
              `runs[${i}].${field} reads as a prediction, not a result (matched ${pattern}). ` +
                "A run report says what happened."
            );
          }
        }
      }
    });
  } else if (data.evidenceBasis === "source-review") {
    if (runs.length > 0) {
      warn(name, 'has runs recorded but is marked "source-review" — should it be "hands-on"?');
    }
    if (!nonEmptyString(data.basisNote)) {
      fail(
        name,
        "a source review must carry a basisNote saying what was and wasn't done, so the page " +
          "never implies testing that didn't happen"
      );
    }
  }

  // Structured body
  if (published) {
    const hasStructure =
      (Array.isArray(data.strengths) && data.strengths.length > 0) ||
      nonEmptyString(data.legacyHtml);
    if (!hasStructure) {
      fail(name, "a published review needs strengths (or legacyHtml for un-migrated content)");
    }
    if (Array.isArray(data.limitations) && data.limitations.length === 0) {
      warn(name, "has no limitations — a review with nothing critical to say is rarely a review");
    }
  }

  for (const field of ["strengths", "limitations", "bestFor"]) {
    if (data[field] === undefined) continue;
    if (!Array.isArray(data[field])) {
      fail(name, `${field} must be an array`);
      continue;
    }
    data[field].forEach((point, i) => {
      if (!nonEmptyString(point?.title)) fail(name, `${field}[${i}].title is required`);
      if (!nonEmptyString(point?.body)) fail(name, `${field}[${i}].body is required`);
    });
  }

  (data.sections ?? []).forEach((section, i) => {
    if (!nonEmptyString(section?.heading)) fail(name, `sections[${i}].heading is required`);
    if (!nonEmptyString(section?.body)) fail(name, `sections[${i}].body is required`);
  });

  (data.faq ?? []).forEach((item, i) => {
    if (!nonEmptyString(item?.question)) fail(name, `faq[${i}].question is required`);
    if (!nonEmptyString(item?.answer)) fail(name, `faq[${i}].answer is required`);
  });

  (data.links ?? []).forEach((link, i) => {
    if (!nonEmptyString(link?.label)) fail(name, `links[${i}].label is required`);
    if (!nonEmptyString(link?.href) || !/^https?:\/\//.test(link.href)) {
      fail(name, `links[${i}].href must be an absolute http(s) URL`);
    }
  });
}

const reviewSlugs = reviews.map(({ data }) => data.slug);
const duplicateReviewSlugs = reviewSlugs.filter((slug, i) => reviewSlugs.indexOf(slug) !== i);
if (duplicateReviewSlugs.length > 0) {
  errors.push(`Duplicate review slugs: ${[...new Set(duplicateReviewSlugs)].join(", ")}`);
}

// One review per skill, or the Reviewed badge becomes ambiguous.
const bySkill = new Map();
for (const { name, data } of reviews) {
  if (!nonEmptyString(data.skillSlug)) continue;
  if (bySkill.has(data.skillSlug)) {
    errors.push(
      `Two reviews target the same skill "${data.skillSlug}": ${bySkill.get(data.skillSlug)} and ${name}`
    );
  } else {
    bySkill.set(data.skillSlug, name);
  }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const collections = readJsonDir(COLLECTIONS_DIR);

for (const { name, data } of collections) {
  const published = data.status === "published";

  if (data.slug !== name.replace(/\.json$/, "")) {
    fail(name, `slug "${data.slug}" does not match the filename`);
  }
  if (!STATUSES.has(data.status)) {
    fail(name, `status must be "draft" or "published", got ${JSON.stringify(data.status)}`);
  }
  for (const field of ["title", "description", "emoji", "intro"]) {
    if (!nonEmptyString(data[field])) fail(name, `${field} is required`);
  }
  for (const field of ["publishedAt", "lastUpdated"]) {
    if (!isIsoDate(data[field])) fail(name, `${field} must be a parseable date`);
  }
  if (!nonEmptyString(data.curator?.name) || !nonEmptyString(data.curator?.bio)) {
    fail(name, "curator.name and curator.bio are required");
  }

  // A curated list has to say what its judgement rests on.
  if (published) {
    if (!nonEmptyString(data.criteria)) {
      fail(name, "a published collection must explain its criteria — how the list was built");
    }
    if (!nonEmptyString(data.evidenceNote)) {
      fail(
        name,
        "a published collection must carry an evidenceNote distinguishing what was tested from " +
          "what was shortlisted from registry signals"
      );
    }
  }

  const entries = Array.isArray(data.entries) ? data.entries : [];
  if (!Array.isArray(data.entries)) {
    fail(name, "entries must be an array");
  } else if (entries.length === 0) {
    fail(name, "a collection with no entries is not a collection");
  }

  const seen = new Set();
  entries.forEach((entry, i) => {
    if (!nonEmptyString(entry?.skillSlug)) {
      fail(name, `entries[${i}].skillSlug is required`);
      return;
    }
    if (!nonEmptyString(entry?.note)) {
      fail(name, `entries[${i}].note is required — an entry without a reason is just a listing`);
    }
    if (seen.has(entry.skillSlug)) {
      fail(name, `entries[${i}] duplicates skill "${entry.skillSlug}"`);
    }
    seen.add(entry.skillSlug);
    if (registrySlugs && !registrySlugs.has(entry.skillSlug)) {
      fail(
        name,
        `entries[${i}].skillSlug "${entry.skillSlug}" is not in the registry index — the page would ` +
          "silently drop it"
      );
    } else if (registryBySlug) {
      const message = installStatusWarning(entry, registryBySlug.get(entry.skillSlug));
      if (message) warn(name, `entries[${i}].skillSlug ${message}`);
    }
  });

  // A title promising a count should deliver it.
  const promised = /\b(\d{1,3})\b/.exec(data.title ?? "");
  if (promised && entries.length > 0) {
    const count = Number(promised[1]);
    if (count !== entries.length) {
      fail(
        name,
        `title promises ${count} skills but the collection has ${entries.length}`
      );
    }
  }

  // An evidence note saying nothing was tested goes stale the moment one of
  // the entries gets a published hands-on review. Fail then, so the note is
  // rewritten in the same change that publishes the review.
  const saysNoneTested = /\b(none|no one|not one)\b[^.]*\btested\b/i.test(data.evidenceNote ?? "");
  if (data.status === "published" && saysNoneTested) {
    const tested = entries.filter((entry) =>
      reviews.some(
        ({ data: review }) =>
          review.skillSlug === entry?.skillSlug &&
          review.status === "published" &&
          review.evidenceBasis === "hands-on"
      )
    );
    if (tested.length > 0) {
      fail(
        name,
        "evidenceNote says none of the entries has been tested, but these have published hands-on " +
          `reviews: ${tested.map((entry) => entry.skillSlug).join(", ")}. Rewrite the note.`
      );
    }
  }
}

const collectionSlugs = collections.map(({ data }) => data.slug);
const duplicateCollectionSlugs = collectionSlugs.filter(
  (slug, i) => collectionSlugs.indexOf(slug) !== i
);
if (duplicateCollectionSlugs.length > 0) {
  errors.push(`Duplicate collection slugs: ${[...new Set(duplicateCollectionSlugs)].join(", ")}`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const publishedReviews = reviews.filter(({ data }) => data.status === "published");
const handsOn = publishedReviews.filter(({ data }) => data.evidenceBasis === "hands-on");
const sourceReviews = publishedReviews.filter(({ data }) => data.evidenceBasis === "source-review");
const publishedCollections = collections.filter(({ data }) => data.status === "published");

console.log("Editorial content");
console.log(
  `  reviews:     ${reviews.length} on disk · ${handsOn.length} published hands-on · ` +
    `${sourceReviews.length} published source-review · ` +
    `${reviews.length - publishedReviews.length} draft`
);
console.log(
  `  collections: ${collections.length} on disk · ${publishedCollections.length} published · ` +
    `${collections.length - publishedCollections.length} draft`
);

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} editorial validation error(s):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}

console.log("  ✓ editorial content valid");
