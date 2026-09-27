// Skill types and display config. Safe to import from client components:
// nothing here touches the skills index, so it never pulls registry data into
// the browser bundle. Server code that needs the data uses lib/skills.ts.

export type VerificationTier = "unverified" | "community" | "verified" | "featured" | "official";

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

export interface Skill {
  slug: string;
  name: string;
  description: string;
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
  repoUrl: string;
  published_at: string;
  updated_at: string;
  installs: number;
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
  official: {
    label: "Official",
    icon: "🏢",
    color: "text-sky-400",
    bg: "bg-sky-900/30",
    border: "border-sky-700",
    description: "Published by the company or team that built the technology.",
  },
};

export const PLATFORM_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  openclaw:    { label: "OpenClaw",              color: "text-purple-400", bg: "bg-purple-900/30" },
  mcp:         { label: "MCP",                   color: "text-blue-400",   bg: "bg-blue-900/30" },
  openai:      { label: "OpenAI / ChatGPT",      color: "text-green-400",  bg: "bg-green-900/30" },
  claude:      { label: "Claude Desktop",        color: "text-orange-400", bg: "bg-orange-900/30" },
  claudecode:  { label: "Claude Code",           color: "text-amber-300",  bg: "bg-amber-900/30" },
  cursor:      { label: "Cursor / VS Code",      color: "text-cyan-400",   bg: "bg-cyan-900/30" },
  codex:       { label: "GitHub Copilot / Codex",color: "text-sky-400",    bg: "bg-sky-900/30" },
  opencode:    { label: "OpenCode",              color: "text-emerald-400",bg: "bg-emerald-900/30" },
  huggingface: { label: "HuggingFace",           color: "text-yellow-400", bg: "bg-yellow-900/30" },
};
