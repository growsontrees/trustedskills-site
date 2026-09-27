#!/usr/bin/env node
/**
 * eval-classifier.mjs
 *
 * Measures the category classifier against the live catalogue without writing
 * anything. Use this before changing the lexicon or MIN_SCORE, so tuning is
 * driven by what the numbers do rather than by how a rule reads.
 *
 *   node scripts/eval-classifier.mjs                 distribution + agreement
 *   node scripts/eval-classifier.mjs --sample [n]    random newly-classified skills
 *   node scripts/eval-classifier.mjs --sample-cat frontend [n]
 *   node scripts/eval-classifier.mjs --explain <slug> full evidence for one skill
 *   node scripts/eval-classifier.mjs --sweep         "other" rate across thresholds
 *
 * Agreement is the honest regression check: of the skills the old slug-only
 * rules placed confidently, how many does the new classifier put in the same
 * category? A high "other" reduction with low agreement would mean we traded
 * one kind of wrong for another.
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { classify } from "./lib/classify-category.mjs";
import { legacySlugCategory } from "./lib/legacy-slug-rules.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const idx = JSON.parse(readFileSync(join(__dirname, "../data/skills-index.json"), "utf8"));
const skills = idx.skills;

const argv = process.argv.slice(2);
const flag = (name) => argv.indexOf(name);

// ── --explain <slug> ────────────────────────────────────────────────────────
if (flag("--explain") !== -1) {
  const slug = argv[flag("--explain") + 1];
  const skill = skills.find((s) => s.slug === slug);
  if (!skill) {
    console.error(`No skill with slug "${slug}".`);
    process.exit(1);
  }
  const r = classify(skill);
  console.log(`\n${skill.slug}`);
  console.log(`  currently:  ${skill.category}`);
  console.log(`  classified: ${r.category}  (score ${r.score}, confident: ${r.confident})`);
  console.log(`  legacy rule: ${r.legacy === undefined ? "no match" : r.legacy ?? "deliberate other"}`);
  console.log(`  description: ${(skill.description ?? "").slice(0, 200)}`);
  console.log(`\n  ranked: ${r.ranked.map(([c, s]) => `${c}=${s}`).join("  ")}`);
  console.log(`\n  evidence:`);
  const byCat = {};
  for (const m of r.matched) (byCat[m.category] ??= []).push(m);
  for (const [cat, ms] of Object.entries(byCat).sort(
    (a, b) => b[1].reduce((t, m) => t + m.points, 0) - a[1].reduce((t, m) => t + m.points, 0)
  )) {
    const total = Math.round(ms.reduce((t, m) => t + m.points, 0) * 100) / 100;
    console.log(`    ${cat.padEnd(13)} ${String(total).padStart(6)}  ${ms.map((m) => `${m.phrase}[${m.tier}]`).join(", ")}`);
  }
  console.log();
  process.exit(0);
}

// ── Classify everything once ────────────────────────────────────────────────
const results = skills.map((s) => ({ skill: s, r: classify(s) }));

// ── --sweep ─────────────────────────────────────────────────────────────────
if (flag("--sweep") !== -1) {
  console.log("\nthreshold   other    other%   (score of the winning category)\n");
  for (const t of [2, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10]) {
    const other = results.filter(({ r }) => r.score < t).length;
    console.log(`  ${String(t).padStart(5)}   ${String(other).padStart(6)}   ${((100 * other) / skills.length).toFixed(1)}%`);
  }
  console.log();
  process.exit(0);
}

// ── --sample / --sample-cat ─────────────────────────────────────────────────
function show(list, n) {
  for (const { skill, r } of list.slice(0, n)) {
    console.log(`\n  ${skill.slug}`);
    console.log(`    ${skill.category}  ->  ${r.category}   (score ${r.score}, runner-up ${r.runnerUp ?? "-"} ${r.runnerUpScore})`);
    console.log(`    ${(skill.description ?? "").slice(0, 150)}`);
  }
}

if (flag("--sample") !== -1) {
  const n = Number(argv[flag("--sample") + 1]) || 25;
  const moved = results.filter(({ skill, r }) => skill.category === "other" && r.category !== "other");
  console.log(`\n${moved.length} skills move out of "other". Random ${n}:`);
  shuffle(moved);
  show(moved, n);
  console.log();
  process.exit(0);
}

if (flag("--sample-cat") !== -1) {
  const cat = argv[flag("--sample-cat") + 1];
  const n = Number(argv[flag("--sample-cat") + 2]) || 25;
  const inCat = results.filter(({ skill, r }) => r.category === cat && skill.category === "other");
  console.log(`\n${inCat.length} skills newly classified as "${cat}". Random ${n}:`);
  shuffle(inCat);
  show(inCat, n);
  console.log();
  process.exit(0);
}

// ── Default report ──────────────────────────────────────────────────────────
const before = tally(results.map(({ skill }) => skill.category));
const after = tally(results.map(({ r }) => r.category));

console.log("\n  category          before     after     delta");
console.log("  " + "-".repeat(46));
const cats = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort(
  (a, b) => (after[b] ?? 0) - (after[a] ?? 0)
);
for (const c of cats) {
  const b = before[c] ?? 0;
  const a = after[c] ?? 0;
  const d = a - b;
  console.log(`  ${c.padEnd(16)} ${String(b).padStart(6)}    ${String(a).padStart(6)}    ${(d > 0 ? "+" : "") + d}`);
}

const otherBefore = before.other ?? 0;
const otherAfter = after.other ?? 0;
console.log(`\n  "other": ${otherBefore} (${pct(otherBefore)}%) -> ${otherAfter} (${pct(otherAfter)}%)`);

// Regression check: do we still agree with the old rules where they were confident?
let agreed = 0;
let disagreed = 0;
const disagreements = {};
for (const { skill, r } of results) {
  const legacy = legacySlugCategory(skill.slug);
  if (!legacy) continue;
  if (r.category === legacy) agreed++;
  else {
    disagreed++;
    const key = `${legacy} -> ${r.category}`;
    disagreements[key] = (disagreements[key] ?? 0) + 1;
  }
}
const total = agreed + disagreed;
console.log(
  `\n  Agreement with the hand-tuned slug rules where they matched: ` +
    `${agreed}/${total} (${((100 * agreed) / total).toFixed(1)}%)`
);
console.log("\n  Largest disagreements:");
for (const [k, v] of Object.entries(disagreements).sort((a, b) => b[1] - a[1]).slice(0, 12)) {
  console.log(`    ${String(v).padStart(5)}  ${k}`);
}

// How much of the catalogue now rests on strong (tier-a/b) evidence?
const strong = results.filter(({ r }) => r.category !== "other" && r.score >= 6).length;
console.log(
  `\n  Classified on a score of 6+ (strong evidence): ${strong} (${pct(strong)}%)`
);
console.log();

function tally(list) {
  const t = {};
  for (const x of list) t[x] = (t[x] ?? 0) + 1;
  return t;
}
function pct(n) {
  return ((100 * n) / skills.length).toFixed(1);
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}
