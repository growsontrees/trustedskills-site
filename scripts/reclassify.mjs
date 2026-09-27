#!/usr/bin/env node
/**
 * reclassify.mjs
 * Assigns every skill in data/skills-index.json a category and recounts the
 * category list.
 *
 * Runs as part of `scripts/sync-index.mjs`, so it re-derives categories for the
 * whole catalogue on every registry sync. It calls no LLM and needs no network.
 *
 * The classification itself lives in scripts/lib/classify-category.mjs — see
 * that file for how the evidence is weighed, and scripts/eval-classifier.mjs to
 * measure a lexicon change before shipping it.
 *
 * Run: node scripts/reclassify.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { classify, OTHER } from "./lib/classify-category.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, "../data/skills-index.json");
const DRY_RUN = process.argv.includes("--dry-run");

const idx = JSON.parse(readFileSync(indexPath, "utf8"));

// Display metadata for categories the index hasn't seen before. Keeps the
// browse UI from falling back to a bare slug and a box emoji.
const CATEGORY_META = {
  frontend:      { name: "Frontend & UI",           emoji: "🎨" },
  backend:       { name: "Backend & APIs",          emoji: "⚙️" },
  cloud:         { name: "Cloud & Infrastructure",  emoji: "☁️" },
  database:      { name: "Database",                emoji: "🗄️" },
  devops:        { name: "DevOps & CI/CD",          emoji: "🔧" },
  testing:       { name: "Testing & Debugging",     emoji: "🧪" },
  security:      { name: "Security & Auth",         emoji: "🔒" },
  "ai-ml":       { name: "AI & Machine Learning",   emoji: "🤖" },
  agents:        { name: "Agents & Orchestration",  emoji: "🕹️" },
  marketing:     { name: "Marketing & SEO",         emoji: "📈" },
  writing:       { name: "Writing & Docs",          emoji: "✍️" },
  data:          { name: "Data & Analytics",        emoji: "📊" },
  "video-media": { name: "Video & Media",           emoji: "🎬" },
  productivity:  { name: "Productivity",            emoji: "✅" },
  utilities:     { name: "Utilities",               emoji: "🧰" },
  other:         { name: "Other",                   emoji: "📦" },
};

// ── Classify ────────────────────────────────────────────────────────────────
const before = {};
const after = {};
let changed = 0;
let weak = 0;

for (const skill of idx.skills) {
  const original = skill.category ?? OTHER;
  before[original] = (before[original] ?? 0) + 1;

  const { category, confident } = classify(skill);
  if (!confident) weak++;
  if (category !== original) changed++;

  skill.category = category;
  after[category] = (after[category] ?? 0) + 1;
}

// ── Recount the category list ───────────────────────────────────────────────
// Kept in step here rather than left to the caller so a standalone run leaves
// the index self-consistent.
const existing = new Map((idx.categories ?? []).map((c) => [c.slug, c]));
idx.categories = Object.entries(after)
  .sort((a, b) => b[1] - a[1])
  .map(([slug, count]) => {
    const prior = existing.get(slug);
    const meta = CATEGORY_META[slug];
    return {
      slug,
      name: prior?.name ?? meta?.name ?? slug,
      emoji: prior?.emoji ?? meta?.emoji ?? "📦",
      count,
    };
  });

// ── Report ──────────────────────────────────────────────────────────────────
const total = idx.skills.length;
const pct = (n) => ((100 * n) / total).toFixed(1).padStart(5);

console.log("\n📊 Category distribution:\n");
console.log("     before    after          category");
for (const { slug, count } of idx.categories) {
  const b = before[slug] ?? 0;
  const delta = count - b;
  const bar = "█".repeat(Math.round(count / 150));
  console.log(
    `  ${String(b).padStart(6)}  ${String(count).padStart(6)} ${pct(count)}%  ` +
      `${slug.padEnd(13)} ${delta === 0 ? "     " : (delta > 0 ? "+" : "") + delta} ${bar}`
  );
}

const otherCount = after[OTHER] ?? 0;
console.log(`\n  Total: ${total}`);
console.log(`  Changed: ${changed}`);
console.log(`  Below the evidence threshold → "${OTHER}": ${weak} (${pct(weak).trim()}%)`);

if (DRY_RUN) {
  console.log("\n⚠️  DRY RUN — not written.\n");
  const others = idx.skills
    .filter((s) => s.category === OTHER)
    .sort((a, b) => (b.installs ?? 0) - (a.installs ?? 0));
  console.log(`Top 30 by installs still in "${OTHER}" (${otherCount} total):`);
  for (const s of others.slice(0, 30)) {
    console.log(`  [${String(s.installs ?? 0).padStart(6)}] ${s.slug}`);
  }
  console.log();
} else {
  writeFileSync(indexPath, JSON.stringify(idx, null, 2));
  console.log("\n✅ Written to data/skills-index.json\n");
}
