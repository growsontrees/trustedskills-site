"use client";
import { useState, useEffect, useCallback } from "react";
import {
  isPlatformKey,
  PLATFORM_DEFINITIONS,
  PlatformKey,
  resolvePlatformKey,
} from "../lib/platforms";

export type { PlatformKey } from "../lib/platforms";

const STORAGE_KEY = "ts-platform-pref";
const EVENT_NAME = "ts-platform-change";

export function usePlatform() {
  const [platform, setPlatformState] = useState<PlatformKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const normalized = resolvePlatformKey(stored);
      if (normalized) {
        setPlatformState(normalized);
        if (stored !== normalized) localStorage.setItem(STORAGE_KEY, normalized);
      } else if (stored) {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  }, []);

  // Listen for changes emitted by other mounted components on this page
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<unknown>).detail;
      setPlatformState(detail === null || isPlatformKey(detail) ? detail : null);
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
    case "vscode":
      return {
        label: PLATFORM_DEFINITIONS.vscode.label,
        cmd: installCmd,
        isJson: false,
        lang: "bash",
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
        cmd: installCmd,
        isJson: false,
        lang: "bash",
      };
    case "nanoclaw":
      return {
        label: PLATFORM_DEFINITIONS.nanoclaw.label,
        cmd: installCmd,
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
    case "codex":
      return {
        label: "GitHub Copilot / Codex",
        cmd: JSON.stringify(
          {
            skills: [
              {
                name: slug,
                enabled: true,
              },
            ],
          },
          null,
          2
        ),
        isJson: true,
        lang: "json",
      };
    case "opencode":
      return {
        label: "OpenCode",
        cmd: `npm install -g @opencode/agent\n\n# Add to your opencode.yaml:\nskills:\n  - name: ${slug}\n    enabled: true`,
        isJson: false,
        lang: "bash",
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
