/**
 * Install-command generation, with no React and no `"use client"`.
 *
 * `hooks/usePlatform.ts` re-exports everything here, so client components keep
 * importing from there. Server code — `lib/docs-content.ts` builds the commands
 * printed on the `install-a-skill` doc pages — imports this file directly.
 * A `"use client"` module's exports become client references on the server, so
 * calling `getPlatformInstall()` through the hook file would throw at build time.
 * One definition, two callers: the docs and the listings cannot drift apart.
 */

export type PlatformKey = "openclaw" | "mcp" | "claude" | "claudecode" | "openai" | "cursor" | "codex" | "opencode" | "other";

export const PLATFORM_LABELS: Record<PlatformKey, string> = {
  openclaw: "OpenClaw",
  mcp: "MCP",
  claude: "Claude Desktop",
  claudecode: "Claude Code",
  openai: "OpenAI / ChatGPT",
  cursor: "Cursor / VS Code",
  codex: "GitHub Copilot / Codex",
  opencode: "OpenCode",
  other: "Other / Exploring",
};

/**
 * Values a skill can list in its `platforms` field and have the site act on.
 * The docs and submit pages print this list, so they name only platforms the
 * site renders an install for.
 */
export const DECLARABLE_PLATFORMS = (Object.keys(PLATFORM_LABELS) as PlatformKey[]).filter(
  (key) => key !== "other"
);

/**
 * Agent ids the `skills` CLI accepts after `-a`, for the platforms it installs
 * into. The CLI copies a SKILL.md into that agent's skills folder.
 *
 * Claude Desktop is absent on purpose: `skills add -a claude-desktop` answers
 * "Invalid agents: claude-desktop" and lists its valid targets, none of which is
 * Claude Desktop. Verified against skills CLI 2026-09-27.
 */
export const SKILLS_CLI_AGENTS: Partial<Record<PlatformKey, string>> = {
  claudecode: "claude-code",
  cursor: "cursor",
  codex: "codex",
  opencode: "opencode",
  openclaw: "openclaw",
};

/** `npx skills add owner/repo --skill name`: a SKILL.md skill, installed by the skills CLI. */
export function isSkillsCliCommand(installCmd: string): boolean {
  return /^npx skills add \S+/.test(installCmd.trim());
}

/** The skills CLI command, aimed at one agent when the platform is one it supports. */
export function skillsCliCommand(installCmd: string, platform: PlatformKey | null): string {
  const agent = platform ? SKILLS_CLI_AGENTS[platform] : undefined;
  return agent ? `${installCmd} -a ${agent}` : installCmd;
}

export function supportsInstallPlatform(platforms: string[] = [], platform: PlatformKey | null): boolean {
  if (!platform) return true;
  if (platform === "openclaw") return true;
  return platforms.includes(platform);
}

/**
 * The one-line install command to copy for a skill on the reader's platform.
 *
 * Only commands that exist are returned. SKILL.md skills get the skills CLI,
 * aimed at the reader's agent. Anything else gets the command the registry
 * recorded. This used to generate npm package names under a TrustedSkills scope and
 * `claude mcp add` lines for every skill; no such package has ever been
 * published, so every one of those commands failed.
 *
 * `isFallback` is true when the reader named a platform the CLI cannot target —
 * Claude Desktop is the one that matters — so the caller must say so rather than
 * print a command that looks aimed and is not.
 */
export function getPlatformInstall(
  installCmd: string,
  platform: PlatformKey | null
): { label: string; cmd: string; isFallback: boolean } {
  if (isSkillsCliCommand(installCmd)) {
    const agent = platform ? SKILLS_CLI_AGENTS[platform] : undefined;
    return {
      label: agent && platform ? PLATFORM_LABELS[platform] : "skills CLI",
      cmd: skillsCliCommand(installCmd, platform),
      isFallback: Boolean(platform) && !agent,
    };
  }
  return { label: "OpenClaw", cmd: installCmd, isFallback: platform !== null && platform !== "openclaw" };
}
