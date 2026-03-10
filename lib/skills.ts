import skillsData from "../data/skills-index.json";

export type VerificationTier = "unverified" | "community" | "verified" | "featured";

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
