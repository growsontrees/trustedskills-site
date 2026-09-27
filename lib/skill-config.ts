// Skill types and display config. Safe to import from client components:
// nothing here touches the skills index, so it never pulls registry data into
// the browser bundle. Server code that needs the data uses lib/skills.ts.

import {
  Award,
  Building,
  Circle,
  GitCommit,
  Package,
  Shield,
  type IconComponent,
} from "../components/icons";

export type VerificationTier = "unverified" | "community" | "checked" | "verified" | "featured" | "official";

// Official orgs from skills.sh/official
export const OFFICIAL_ORGS = new Set([
  'anthropics','apify','apollographql','auth0','automattic','axiomhq','base','better-auth',
  'bitwarden','brave','browser-use','browserbase','callstackincubator','clerk','clickhouse',
  'cloudflare','coderabbitai','coinbase','dagster-io','datadog-labs','dbt-labs','denoland',
  'elevenlabs','encoredev','expo','facebook','figma','firebase','firecrawl','flutter',
  'getsentry','github','google-gemini','google-labs-code','hashicorp','huggingface','kotlin',
  'langchain-ai','langfuse','launchdarkly','livekit','makenotion','mapbox','mastra-ai',
  'mcp-use','medusajs','microsoft','n8n-io','neondatabase','nuxt','openai','openshift',
  'planetscale','posthog','prisma','pulumi','pytorch','redis','remotion-dev','resend',
  'rivet-dev','runwayml','sanity-io','semgrep','streamlit','stripe','supabase','sveltejs',
  'tinybirdco','tldraw','triggerdotdev','upstash','vercel','vercel-labs','webflow','wix','wordpress',
]);

/**
 * Show only descriptions the publisher wrote in their own SKILL.md. The site's
 * generated text (template and LLM descriptions, and every longDescription)
 * was wrong often enough to mislead, so it stays in the index but is not read.
 * Set to false to put the generated text back. Applied once, in loadIndex.
 */
export const PUBLISHER_DESCRIPTIONS_ONLY = true;

export interface Skill {
  slug: string;
  name: string;
  /** Empty when PUBLISHER_DESCRIPTIONS_ONLY is on and the publisher wrote none. */
  description: string;
  /** "skill-md" when description is the publisher's SKILL.md text, verbatim. */
  descriptionSource?: string;
  longDescription?: string;
  version: string;
  author: string;
  homepage: string;
  source_repo: string;
  sourceUrl?: string;
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
  /**
   * Result of the registry's install check (check-installs.mjs): does
   * `installCmd` still find this skill's SKILL.md under the listed name?
   * Absent means the registry could not check it, so make no claim.
   */
  install_status?: InstallStatus;
  /** renamed only: the name upstream now gives this skill. */
  install_name?: string;
  /** Why the skill does not install, in one line. */
  install_reason?: string;
  install_checked_at?: string;
  repoUrl: string;
  published_at: string;
  updated_at: string;
  installs: number;
  /** Upstream repository stars. Present for ~1% of the index. */
  stars?: number;
  /** Primary language of the upstream repository, when known. */
  language?: string;
  verified: VerificationTier;
  verifiedCommit?: string;
  verifiedAt?: string;
  verifiedChangedAt?: string;
  installArchiveUrl?: string;
  preferredPlatform?: string;
  installOverrides?: Record<string, {
    supported?: boolean;
    mode?: "generated" | "custom";
    command?: string;
    note?: string;
  }>;
}

export type InstallStatus = "ok" | "renamed" | "invalid" | "missing" | "repo_gone";

/** The registry checked this skill and its install command cannot work. */
export function installIsBroken(skill: Pick<Skill, "install_status">): boolean {
  return (
    skill.install_status === "invalid" ||
    skill.install_status === "missing" ||
    skill.install_status === "repo_gone"
  );
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

/**
 * Verification tiers.
 *
 * Every string here has to be defensible against what the index actually
 * holds. As of this writing that is: 26,001 listings, 1,149 matched to a
 * vendor's own GitHub org, 127 pinned to a commit with a stored snapshot, and
 * zero code reviews. The labels and descriptions say exactly that and no more
 * — the previous copy ("passed automated security scans", "manually reviewed
 * by the TrustedSkills team") described work nobody has done.
 *
 * `tone` selects the chip styling; keys are frozen because they appear in
 * URLs (`/tier/<key>/`) and in the registry payload.
 */
export type TierTone = "neutral" | "muted" | "accent" | "ok" | "warn";

export const TIER_CONFIG: Record<VerificationTier, {
  label: string;
  icon: IconComponent;
  tone: TierTone;
  /** One line, shown in chips as a tooltip and on tier listing pages. */
  description: string;
  /** Longer form for the skill detail page. */
  detail: string;
  // Retained so existing call sites keep compiling; prefer `tone`.
  color: string;
  bg: string;
  border: string;
}> = {
  official: {
    label: "Official",
    icon: Building,
    tone: "accent",
    description: "Published by the vendor's own GitHub organisation.",
    detail:
      "This skill comes from a GitHub organisation we match to the company that builds the underlying product. That tells you who published it — it is not a review of the code.",
    color: "text-accent-300",
    bg: "bg-accent-950",
    border: "border-accent-800",
  },
  featured: {
    label: "Featured",
    icon: Award,
    tone: "warn",
    description: "Hand-picked by us as a good place to start.",
    detail:
      "An editorial pick — we think this is a good first skill to try on a new setup. It is a recommendation, not a security review.",
    color: "text-warn-300",
    bg: "bg-warn-950",
    border: "border-warn-800",
  },
  verified: {
    label: "Pinned",
    icon: GitCommit,
    tone: "ok",
    description: "Install is pinned to one commit and served from a stored snapshot.",
    detail:
      "We recorded a specific commit for this skill and serve a stored copy of it. What you install today is that exact snapshot rather than whatever the repository happens to contain now. We have not audited the code in it.",
    color: "text-ok-300",
    bg: "bg-ok-950",
    border: "border-ok-800",
  },
  checked: {
    label: "Checked",
    icon: Shield,
    tone: "ok",
    description: "Passed every automated safety check at a pinned commit.",
    // Rendered both in the skill sidebar and as the /tier/checked intro, so it
    // avoids "this skill" / "this page".
    detail:
      "A Checked skill was pulled at a named commit and statically scanned: the manifest parses, nothing reads credential stores, nothing contacts a host outside a published allowlist, nothing decodes and runs an encoded payload, and there is no curl-pipe-to-shell installer. Each skill's page lists its individual check results and the lines behind them. It is a machine reading the code as published, not a judgement that the skill is any good.",
    color: "text-ok-300",
    bg: "bg-ok-950",
    border: "border-ok-800",
  },
  community: {
    label: "Listed",
    icon: Package,
    tone: "neutral",
    description: "Indexed from a public source. Not reviewed.",
    detail:
      "We found this skill on a public source and recorded where it came from, who publishes it and how to install it. Nobody has reviewed the code — read the repository before you run it.",
    color: "text-ink-300",
    bg: "bg-ink-850",
    border: "border-ink-700",
  },
  unverified: {
    label: "Unverified",
    icon: Circle,
    tone: "muted",
    description: "Listed with no additional signal recorded.",
    detail:
      "This entry is in the index but we hold nothing beyond the basic listing — no matched publisher, no pinned commit. Treat it as an unknown and read the source first.",
    color: "text-ink-450",
    bg: "bg-ink-900",
    border: "border-ink-750",
  },
};

/** Display order, strongest signal first. Used by filters and legends. */
export const TIER_ORDER: VerificationTier[] = [
  "official",
  "featured",
  "verified",
  "checked",
  "community",
  "unverified",
];

export function tierOf(skill: Pick<Skill, "verified">) {
  return TIER_CONFIG[skill.verified as VerificationTier] ?? TIER_CONFIG.community;
}

/**
 * Platforms. Deliberately uncoloured: a card can carry five of these at once,
 * and giving each its own hue turned every listing into a swatch chart.
 * Colour in this system means verification state, nothing else.
 */
export const PLATFORM_CONFIG: Record<string, { label: string; short: string; color: string; bg: string }> = {
  openclaw:    { label: "OpenClaw",               short: "OpenClaw", color: "text-ink-300", bg: "bg-ink-850" },
  mcp:         { label: "MCP",                    short: "MCP",      color: "text-ink-300", bg: "bg-ink-850" },
  openai:      { label: "OpenAI / ChatGPT",       short: "OpenAI",   color: "text-ink-300", bg: "bg-ink-850" },
  claude:      { label: "Claude Desktop",         short: "Claude",   color: "text-ink-300", bg: "bg-ink-850" },
  claudecode:  { label: "Claude Code",            short: "Claude Code", color: "text-ink-300", bg: "bg-ink-850" },
  cursor:      { label: "Cursor / VS Code",       short: "Cursor",   color: "text-ink-300", bg: "bg-ink-850" },
  codex:       { label: "GitHub Copilot / Codex", short: "Copilot",  color: "text-ink-300", bg: "bg-ink-850" },
  opencode:    { label: "OpenCode",               short: "OpenCode", color: "text-ink-300", bg: "bg-ink-850" },
  huggingface: { label: "HuggingFace",            short: "HF",       color: "text-ink-300", bg: "bg-ink-850" },
};

/* ── Formatting helpers ───────────────────────────────────────────────────
   The index is uneven: 101 of 26,001 skills carry a usable `updated_at`, 350
   carry a licence, 336 carry a star count. These helpers all return null for
   missing data so callers can omit the row rather than render "undefined". */

export function formatCount(n: number | undefined | null): string | null {
  if (typeof n !== "number" || !Number.isFinite(n) || n <= 0) return null;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function formatDate(value: string | undefined | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

/** ISO date for a <time datetime="…"> attribute, or null when unusable. */
export function isoDate(value: string | undefined | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Most of the index has no licence field; a few carry prose instead of an SPDX id. */
export function formatLicense(value: string | undefined | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "noassertion" || trimmed.length > 40) return null;
  return trimmed;
}
