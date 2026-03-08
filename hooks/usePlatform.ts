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

/** Returns the install command/config for a skill on a given platform. */
export function getPlatformInstall(
  slug: string,
  installCmd: string,
  repoUrl: string,
  platform: PlatformKey | null
): { label: string; cmd: string; isJson: boolean; lang: string; isComingSoon?: boolean } {
  switch (platform) {
    case "mcp":
      return {
        label: "MCP (generic)",
        cmd: JSON.stringify(
          {
            mcpServers: {
              [slug]: {
                command: "npx",
                args: ["-y", `@trustedskills/${slug}`],
              },
            },
          },
          null,
          2
        ),
        isJson: true,
        lang: "json",
      };
    case "cursor":
      return {
        label: "Cursor / VS Code",
        cmd: JSON.stringify(
          {
            mcp: {
              servers: {
                [slug]: {
                  command: "npx",
                  args: ["-y", `@trustedskills/${slug}`],
                },
              },
            },
          },
          null,
          2
        ),
        isJson: true,
        lang: "json",
      };
    case "claude":
      return {
        label: "Claude Desktop",
        cmd: JSON.stringify(
          {
            mcpServers: {
              [slug]: {
                command: "npx",
                args: ["-y", `@trustedskills/${slug}`],
              },
            },
          },
          null,
          2
        ),
        isJson: true,
        lang: "json",
      };
    case "claudecode":
      return {
        label: "Claude Code",
        cmd: `claude mcp add ${slug} npx -- -y @trustedskills/${slug}`,
        isJson: false,
        lang: "bash",
      };
    case "openai":
      return {
        label: "OpenAI / ChatGPT",
        cmd: `Coming soon — OpenAI plugin support is on our roadmap.\nIn the meantime, download the skill spec to use manually:\n${repoUrl || `https://github.com/trustedskills/${slug}`}`,
        isJson: false,
        lang: "text",
        isComingSoon: true,
      };
    case "other":
      return {
        label: "Generic",
        cmd: `# Download directly from GitHub:\ncurl -sL ${repoUrl || `https://github.com/trustedskills/${slug}`}/archive/refs/heads/main.zip -o ${slug}.zip`,
        isJson: false,
        lang: "bash",
      };
    case "openclaw":
    default:
      return {
        label: "OpenClaw",
        cmd: installCmd,
        isJson: false,
        lang: "bash",
      };
  }
}
