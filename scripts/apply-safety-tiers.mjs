#!/usr/bin/env node
/**
 * Turn safety-scan verdicts into the Checked tier.
 *
 * Runs after the registry merge, in the same place as mark-official.mjs. A skill
 * that passed every check at its pinned commit becomes `checked`; one that
 * failed, or that has never been scanned, falls back to the honest default.
 *
 * Deliberately not preserved by sync-index.mjs: Checked describes a specific
 * commit, so it is recomputed from the report file on every build rather than
 * carried forward. If the scan has not seen a skill, the site does not claim it
 * was checked.
 *
 * Curated tiers (official, featured, verified) are left alone — they say who
 * published a skill or that we pinned it, which is a different claim from
 * "we scanned it". Their pages still show the full check results.
 *
 * Usage: node scripts/apply-safety-tiers.mjs [--index path] [--reports path]
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const indexPath = valueOf("--index") ?? join(ROOT, "data", "skills-index.json");
const reportPath = valueOf("--reports") ?? join(ROOT, "data", "safety-reports.json");

function valueOf(flag) {
  const at = args.indexOf(flag);
  return at === -1 ? null : args[at + 1];
}

/** Tiers that mean something other than "we scanned it", so they are kept. */
const CURATED = new Set(["official", "featured", "verified"]);

/** What a skill is when the scan has not cleared it. */
const DEFAULT_TIER = "community"; // displayed as "Listed"

if (!existsSync(reportPath)) {
  console.log(`No safety report at ${reportPath} — leaving tiers untouched.`);
  process.exit(0);
}

const index = JSON.parse(readFileSync(indexPath, "utf8"));
const { reports = {}, generated_at: generatedAt } = JSON.parse(readFileSync(reportPath, "utf8"));

const tally = { checked: 0, flagged: 0, unscannable: 0, unscanned: 0, curated: 0, demoted: 0 };

for (const skill of index.skills) {
  const report = reports[skill.slug];

  if (CURATED.has(skill.verified)) {
    tally.curated += 1;
    continue;
  }

  if (!report) {
    tally.unscanned += 1;
    if (skill.verified === "checked") {
      // The scan no longer covers it, so the claim has to go with it.
      skill.verified = DEFAULT_TIER;
      tally.demoted += 1;
    }
    continue;
  }

  if (report.verdict === "checked") {
    skill.verified = "checked";
    tally.checked += 1;
    continue;
  }

  tally[report.verdict === "flagged" ? "flagged" : "unscannable"] += 1;
  if (skill.verified === "checked") tally.demoted += 1;
  if (skill.verified !== "unverified") skill.verified = DEFAULT_TIER;
}

index.safety = {
  report_generated_at: generatedAt ?? null,
  applied_at: new Date().toISOString(),
  checked: tally.checked,
  flagged: tally.flagged,
  unscannable: tally.unscannable,
  unscanned: tally.unscanned,
};

writeFileSync(indexPath, JSON.stringify(index, null, 2));

console.log(
  `Safety tiers applied: ${tally.checked} checked, ${tally.flagged} flagged, ` +
    `${tally.unscannable} unscannable, ${tally.unscanned} not yet scanned, ` +
    `${tally.curated} curated tiers left as they were${tally.demoted ? `, ${tally.demoted} demoted` : ""}.`
);
