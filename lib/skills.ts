import skillsData from "../data/skills-index.json";

export type VerificationTier = "unverified" | "community" | "verified" | "featured";

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
  featured:   15,
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
    _maxInstalls = Math.max(...(skillsData as SkillsIndex).skills.map((s) => s.installs || 0), 1);
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
export function scoreSkill(skill: Skill): number {
  const maxInstalls = getMaxInstalls();

  // Log-scaled popularity: log10(installs+1) / log10(maxInstalls+1) * 50
  const popularityScore =
    (Math.log10((skill.installs || 0) + 1) / Math.log10(maxInstalls + 1)) * 50;

  const authorBonus = TRUSTED_AUTHOR_BONUS[skill.author?.toLowerCase() ?? ""] ?? 0;

  const tierBonus = TIER_BONUS[skill.verified as VerificationTier] ?? 0;

  const descScore = DESCRIPTION_SCORE(skill.description ?? "");

  return popularityScore + authorBonus + tierBonus + descScore;
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
  const all = sortByScore(skillsIndex.skills);
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

export interface Skill {
  slug: string;
  name: string;
  description: string;
  version: string;
  author: string;
  homepage: string;
  source_repo: string;
  tags: string[];
  category: string;
  emoji: string;
  license: string;
  platforms: string[];
  requires: {
    bins: string[];
    env: string[];
    config: string[];
  };
  installCmd: string;
  repoUrl: string;
  published_at: string;
  updated_at: string;
  installs: number;
  verified: VerificationTier;
  verifiedCommit?: string;
  verifiedAt?: string;
  verifiedChangedAt?: string;
  installArchiveUrl?: string;
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  count: number;
}

export interface SkillsIndex {
  skills: Skill[];
  categories: Category[];
  stats: {
    total_skills: number;
    total_installs: number;
    total_authors: number;
    last_updated: string;
  };
}

export const skillsIndex = skillsData as SkillsIndex;

export function getAllSkills(): Skill[] {
  return skillsIndex.skills;
}

export function getSkillBySlug(slug: string): Skill | undefined {
  return skillsIndex.skills.find((s) => s.slug === slug);
}

export function getFeaturedSkills(): Skill[] {
  return skillsIndex.skills.filter((s) => s.verified === "featured").slice(0, 6);
}

/** @deprecated Use getTopRankedSkills() for the homepage instead. */
export function getFeaturedSkillsLegacy(): Skill[] {
  return getFeaturedSkills();
}

export function getCategories(): Category[] {
  return skillsIndex.categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return skillsIndex.categories.find((category) => category.slug === slug);
}

export function getStats() {
  return skillsIndex.stats;
}

export const TIER_CONFIG: Record<VerificationTier, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}> = {
  unverified: {
    label: "Unverified",
    icon: "🔓",
    color: "text-gray-400",
    bg: "bg-gray-800/50",
    border: "border-gray-700",
    description: "Not yet reviewed. Use with caution.",
  },
  community: {
    label: "Community",
    icon: "🌐",
    color: "text-blue-400",
    bg: "bg-blue-900/30",
    border: "border-blue-800",
    description: "Passed automated security scans.",
  },
  verified: {
    label: "Verified",
    icon: "✅",
    color: "text-emerald-400",
    bg: "bg-emerald-900/30",
    border: "border-emerald-800",
    description: "Manually reviewed by the TrustedSkills team.",
  },
  featured: {
    label: "Featured",
    icon: "⭐",
    color: "text-yellow-400",
    bg: "bg-yellow-900/30",
    border: "border-yellow-800",
    description: "Editorially selected — recommended for any platform.",
  },
};

export const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  openclaw:    { label: "OpenClaw",       color: "text-purple-400",  bg: "bg-purple-900/30" },
  mcp:         { label: "MCP",            color: "text-blue-400",    bg: "bg-blue-900/30" },
  openai:      { label: "OpenAI",         color: "text-green-400",   bg: "bg-green-900/30" },
  claude:      { label: "Claude",         color: "text-orange-400",  bg: "bg-orange-900/30" },
  cursor:      { label: "Cursor / VS Code", color: "text-cyan-400",  bg: "bg-cyan-900/30" },
  huggingface: { label: "HuggingFace",    color: "text-yellow-400",  bg: "bg-yellow-900/30" },
};
