"use client";
import { useState, useEffect, useCallback } from "react";

export type PlatformKey = "openclaw" | "mcp" | "claude" | "claudecode" | "openai" | "cursor" | "codex" | "opencode" | "other";

const STORAGE_KEY = "ts-platform-pref";
const EVENT_NAME = "ts-platform-change";

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

export function usePlatform() {
  const [platform, setPlatformState] = useState<PlatformKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as PlatformKey | null;
      if (stored) setPlatformState(stored);
    } catch {}
  }, []);

  // Listen for changes emitted by other mounted components on this page
  useEffect(() => {
    function handler(e: Event) {
      setPlatformState((e as CustomEvent<PlatformKey | null>).detail);
    }
    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const setPlatform = useCallback((p: PlatformKey | null) => {
    setPlatformState(p);
    try {
      if (p) localStorage.setItem(STORAGE_KEY, p);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: p }));
  }, []);

  return { platform, setPlatform, mounted };
}

/**
 * Agent ids the `skills` CLI accepts after `-a`, for the platforms it installs
 * into. The CLI copies a SKILL.md into that agent's skills folder.
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
