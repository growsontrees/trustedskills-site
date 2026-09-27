import { readFileSync } from "fs";
import { join } from "path";
import { TIER_ORDER } from "./skill-config";
import type { Category, Skill, SkillsIndex, VerificationTier } from "./skill-config";

// Server-only. The index is read from disk on first use instead of being
// imported as a module: a JSON import gets inlined into every route bundle
// (and into the browser bundle of any client component that touched this
// file), which is what made /skills so heavy.
export * from "./skill-config";

let _index: SkillsIndex | null = null;
function loadIndex(): SkillsIndex {
  if (!_index) {
    const file = join(process.cwd(), "data", "skills-index.json");
    _index = JSON.parse(readFileSync(file, "utf8")) as SkillsIndex;
  }
  return _index;
}

// ---------------------------------------------------------------------------
// Composite ranking
// ---------------------------------------------------------------------------

/**
 * Known official / trusted authors and their bonus points (0-30).
 * These are organisations publishing skills for the platforms they own or
 * maintain — a strong quality signal independent of raw install counts.
 */
const TRUSTED_AUTHOR_BONUS: Record<string, number> = {
  "vercel-labs":       30,
  "anthropics":        28,
  "microsoft":         25,
  "google-labs-code":  25,
  "google-gemini":     25,
  "remotion-dev":      22,
  "openai":            28,
  "huggingface":       20,
  "aws-samples":       20,
  "github":            20,
  "stripe-dev":        18,
  "supabase-community":18,
  "prisma-labs":       18,
  "cloudflare":        18,
  "shopify-dev":       18,
  "nextlevelbuilder":   8,
  "sleekdotdesign":     8,
  "openclaw":          10,
};

const TIER_BONUS: Record<VerificationTier, number> = {
  official: 30,
  featured:   15,
  // Ranked above `verified` (pinned only): a checked skill is pinned *and*
  // has passed the automated scans, so it carries strictly more signal.
  checked:    12,
  verified:   10,
  community:   5,
  unverified:  0,
};

const DESCRIPTION_SCORE = (desc: string): number => {
  if (!desc) return 0;
  if (desc.length >= 80) return 5;
  if (desc.length >= 30) return 2;
  return 0;
};

let _maxInstalls: number | null = null;
function getMaxInstalls(): number {
  if (_maxInstalls === null) {
    _maxInstalls = loadIndex().skills.reduce((max, s) => Math.max(max, s.installs || 0), 1);
  }
  return _maxInstalls;
}

/**
 * Composite score (0–100) for a skill.
 *
 * Components:
 *   0–50  install popularity  (log-scaled)
 *   0–30  official author bonus
 *   0–15  verification tier bonus
 *   0–5   description quality
 */
const _scores = new WeakMap<Skill, number>();

export function scoreSkill(skill: Skill): number {
  const cached = _scores.get(skill);
  if (cached !== undefined) return cached;
  const maxInstalls = getMaxInstalls();

  // Log-scaled popularity: log10(installs+1) / log10(maxInstalls+1) * 50
  const popularityScore =
    (Math.log10((skill.installs || 0) + 1) / Math.log10(maxInstalls + 1)) * 50;

  const authorBonus = TRUSTED_AUTHOR_BONUS[skill.author?.toLowerCase() ?? ""] ?? 0;

  const tierBonus = TIER_BONUS[skill.verified as VerificationTier] ?? 0;

  const descScore = DESCRIPTION_SCORE(skill.description ?? "");

  const score = popularityScore + authorBonus + tierBonus + descScore;
  _scores.set(skill, score);
  return score;
}

/**
 * Sort an array of skills by composite score, descending.
 * Pure function — returns a new array.
 */
export function sortByScore(skills: Skill[]): Skill[] {
  return [...skills].sort((a, b) => scoreSkill(b) - scoreSkill(a));
}

/**
 * Return top-ranked skills with author diversity cap applied.
 *
 * Author cap prevents any single publisher dominating the homepage
 * (e.g. 6 Microsoft Azure skills). Category cap is intentionally
 * omitted because the top skills legitimately cluster in "dev" —
 * forcing artificial category variety would surface lower-quality skills.
 *
 * @param limit         Max skills to return (default 6)
 * @param maxPerAuthor  Max skills per author slug (default 2)
 */
export function getTopRankedSkills(
  limit = 6,
  maxPerAuthor = 2
): Skill[] {
  const all = sortByScore(loadIndex().skills);
  const result: Skill[] = [];
  const authorCount: Record<string, number> = {};

  for (const skill of all) {
    if (result.length >= limit) break;

    const author = skill.author?.toLowerCase() ?? "unknown";

    // Hard filter: skip stubs with no meaningful description
    if (!skill.description || skill.description.length < 15) continue;

    if ((authorCount[author] ?? 0) >= maxPerAuthor) continue;

    result.push(skill);
    authorCount[author] = (authorCount[author] ?? 0) + 1;
  }

  return result;
}

let _bySlug: Map<string, Skill> | null = null;

export function getAllSkills(): Skill[] {
  return loadIndex().skills;
}

export function getSkillBySlug(slug: string): Skill | undefined {
  if (!_bySlug) _bySlug = new Map(loadIndex().skills.map((s) => [s.slug, s]));
  return _bySlug.get(slug);
}

export function getFeaturedSkills(): Skill[] {
  return loadIndex().skills.filter((s) => s.verified === "featured").slice(0, 6);
}

/** @deprecated Use getTopRankedSkills() for the homepage instead. */
export function getFeaturedSkillsLegacy(): Skill[] {
  return getFeaturedSkills();
}

export function getCategories(): Category[] {
  return loadIndex().categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return loadIndex().categories.find((category) => category.slug === slug);
}

export function getStats() {
  return loadIndex().stats;
}

/**
 * How many skills sit in each verification tier.
 *
 * The homepage leads on these numbers rather than on a claim, so they are
 * counted from the index instead of being written into copy. Entries with no
 * `verified` field are counted as `community` — the same fallback `tierOf()`
 * applies when rendering them.
 */
let _tierCounts: Record<VerificationTier, number> | null = null;

export function getTierCounts(): Record<VerificationTier, number> {
  if (!_tierCounts) {
    // Seeded from TIER_ORDER rather than a literal, so adding a tier to
    // skill-config.ts cannot silently leave it uncounted here.
    const counts = Object.fromEntries(
      TIER_ORDER.map((tier) => [tier, 0])
    ) as Record<VerificationTier, number>;
    for (const skill of loadIndex().skills) {
      const tier = (skill.verified as VerificationTier) in counts
        ? (skill.verified as VerificationTier)
        : "community";
      counts[tier] += 1;
    }
    _tierCounts = counts;
  }
  return _tierCounts;
}

/** Skills whose install is pinned to a recorded commit and stored snapshot. */
let _pinnedCount: number | null = null;

export function getPinnedCount(): number {
  if (_pinnedCount === null) {
    _pinnedCount = loadIndex().skills.filter((s) => !!s.verifiedCommit).length;
  }
  return _pinnedCount;
}
