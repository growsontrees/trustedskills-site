export const PLATFORM_DEFINITIONS = {
  openclaw: {
    label: "OpenClaw",
    emoji: "🦀",
    sublabel: "openclaw skills install",
    registryValues: ["openclaw"],
    routeAliases: [],
    color: "text-purple-400",
    bg: "bg-purple-900/30",
  },
  claudecode: {
    label: "Claude Code",
    emoji: "⌨️",
    sublabel: "Skills CLI",
    registryValues: ["claudecode"],
    routeAliases: ["claude-code"],
    color: "text-amber-400",
    bg: "bg-amber-900/30",
  },
  vscode: {
    label: "VS Code / Cursor",
    emoji: "🖱️",
    sublabel: "Skills CLI or MCP",
    registryValues: ["vscode", "cursor"],
    routeAliases: ["cursor"],
    color: "text-cyan-400",
    bg: "bg-cyan-900/30",
  },
  mcp: {
    label: "MCP",
    emoji: "🔌",
    sublabel: "Generic MCP config",
    registryValues: ["mcp"],
    routeAliases: [],
    color: "text-blue-400",
    bg: "bg-blue-900/30",
  },
  claude: {
    label: "Claude Desktop",
    emoji: "💬",
    sublabel: "claude_desktop_config.json",
    registryValues: ["claude"],
    routeAliases: [],
    color: "text-orange-400",
    bg: "bg-orange-900/30",
  },
  nanoclaw: {
    label: "NanoClaw",
    emoji: "🔬",
    sublabel: "Registry install command",
    registryValues: ["nanoclaw"],
    routeAliases: [],
    color: "text-pink-400",
    bg: "bg-pink-900/30",
  },
  openai: {
    label: "OpenAI / ChatGPT",
    emoji: "🤖",
    sublabel: "Manual installation",
    registryValues: ["openai"],
    routeAliases: [],
    color: "text-green-400",
    bg: "bg-green-900/30",
  },
  codex: {
    label: "GitHub Copilot / Codex",
    emoji: "🧩",
    sublabel: "Skills config",
    registryValues: [],
    routeAliases: [],
    color: "text-gray-400",
    bg: "bg-gray-800",
  },
  opencode: {
    label: "OpenCode",
    emoji: "🛠️",
    sublabel: "opencode.yaml",
    registryValues: [],
    routeAliases: [],
    color: "text-gray-400",
    bg: "bg-gray-800",
  },
  other: {
    label: "Other / Exploring",
    emoji: "🔎",
    sublabel: "Generic download",
    registryValues: [],
    routeAliases: [],
    color: "text-gray-400",
    bg: "bg-gray-800",
  },
} as const;

export type PlatformKey = keyof typeof PLATFORM_DEFINITIONS;

export interface PlatformFilter {
  key: PlatformKey;
  label: string;
  count: number;
}

const PLATFORM_KEYS = Object.keys(PLATFORM_DEFINITIONS) as PlatformKey[];

export const BROWSABLE_PLATFORM_KEYS: readonly PlatformKey[] = PLATFORM_KEYS.filter(
  (key) => PLATFORM_DEFINITIONS[key].registryValues.length > 0
);

const REGISTRY_PLATFORM_MAP: Readonly<Record<string, PlatformKey>> = PLATFORM_KEYS.reduce(
  (result, key) => {
    for (const value of PLATFORM_DEFINITIONS[key].registryValues) {
      result[value] = key;
    }
    return result;
  },
  {} as Record<string, PlatformKey>
);

const ROUTE_PLATFORM_MAP: Readonly<Record<string, PlatformKey>> = PLATFORM_KEYS.reduce(
  (result, key) => {
    result[key] = key;
    for (const alias of PLATFORM_DEFINITIONS[key].routeAliases) {
      result[alias] = key;
    }
    return result;
  },
  {} as Record<string, PlatformKey>
);

export function isPlatformKey(value: unknown): value is PlatformKey {
  return typeof value === "string" && Object.prototype.hasOwnProperty.call(PLATFORM_DEFINITIONS, value);
}

export function resolvePlatformKey(value: string | null | undefined): PlatformKey | null {
  if (!value) return null;
  return ROUTE_PLATFORM_MAP[value.toLowerCase()] ?? null;
}

export function normalizeRegistryPlatform(value: string): PlatformKey | null {
  return REGISTRY_PLATFORM_MAP[value.toLowerCase()] ?? null;
}

export function normalizeRegistryPlatforms(values: readonly string[] | null | undefined): PlatformKey[] {
  const normalized = new Set<PlatformKey>();

  for (const value of values ?? []) {
    const platform = normalizeRegistryPlatform(value);
    if (platform) normalized.add(platform);
  }

  return [...normalized];
}

export function countSkillsByPlatform(
  skills: readonly { platforms?: readonly string[] }[]
): Record<PlatformKey, number> {
  const counts = Object.fromEntries(PLATFORM_KEYS.map((key) => [key, 0])) as Record<PlatformKey, number>;

  for (const skill of skills) {
    for (const platform of normalizeRegistryPlatforms(skill.platforms)) {
      counts[platform] += 1;
    }
  }

  return counts;
}

export function getPlatformFilters(
  skills: readonly { platforms?: readonly string[] }[]
): PlatformFilter[] {
  const counts = countSkillsByPlatform(skills);

  return BROWSABLE_PLATFORM_KEYS.flatMap((key) => {
    const count = counts[key];
    return count > 0
      ? [{ key, label: PLATFORM_DEFINITIONS[key].label, count }]
      : [];
  });
}

export function isBrowsablePlatformKey(value: unknown): value is PlatformKey {
  return isPlatformKey(value) && BROWSABLE_PLATFORM_KEYS.includes(value);
}

export function getBrowsablePlatformKey(
  value: string | null | undefined,
  skills: readonly { platforms?: readonly string[] }[]
): PlatformKey | null {
  const platform = resolvePlatformKey(value);
  if (!platform) return null;

  return countSkillsByPlatform(skills)[platform] > 0 ? platform : null;
}

export function getPlatformBrowsePath(platform: PlatformKey): string {
  return `/platform/${platform}/`;
}

export function getPlatformQueryPath(platform: PlatformKey): string {
  return `/skills?platform=${encodeURIComponent(platform)}`;
}
