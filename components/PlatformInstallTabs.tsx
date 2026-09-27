"use client";

import { useEffect, useState } from "react";
import { PlatformKey, usePlatform } from "../hooks/usePlatform";
import { InstallBlock } from "./InstallBlock";
import { AlertTriangle, Clock, ExternalLink, Github, platformIcon } from "./icons";
import { Note, cx } from "./ui";

type InstallOverride = {
  supported?: boolean;
  mode?: "generated" | "custom";
  command?: string;
  note?: string;
};

interface Props {
  slug: string;
  installCmd: string;
  repoUrl: string;
  platforms: string[];
  preferredPlatform?: PlatformKey;
  installOverrides?: Partial<Record<PlatformKey, InstallOverride>>;
}

const PLATFORM_PRIORITY: PlatformKey[] = [
  "claudecode",
  "claude",
  "mcp",
  "cursor",
  "codex",
  "opencode",
  "openai",
  "openclaw",
];

function supportsPlatform(platforms: string[] = [], key: PlatformKey): boolean {
  return platforms.includes(key);
}

function looksLikeTrustedSkillsNpm(slug: string, installCmd: string): boolean {
  const cmd = installCmd.toLowerCase();
  return cmd.includes(`@trustedskills/${slug}`.toLowerCase()) || cmd.includes(`openclaw skills install ${slug}`.toLowerCase());
}

function inferBestPlatform(
  platforms: string[] = [],
  slug: string,
  installCmd: string,
  preferredPlatform?: PlatformKey,
  installOverrides?: Partial<Record<PlatformKey, InstallOverride>>
): PlatformKey {
  const available = new Set<PlatformKey>(platforms.filter(Boolean) as PlatformKey[]);

  if (looksLikeTrustedSkillsNpm(slug, installCmd)) {
    available.add("claudecode");
  }

  if (installOverrides?.claudecode?.supported) {
    available.add("claudecode");
  }

  const cmd = installCmd.toLowerCase();
  const isDirectMcpStyle = available.has("mcp") && !cmd.includes("openclaw skills install");

  if (preferredPlatform && available.has(preferredPlatform)) return preferredPlatform;
  if (preferredPlatform === "claudecode" && installOverrides?.claudecode?.supported) return "claudecode";
  if (isDirectMcpStyle) return "mcp";

  for (const key of PLATFORM_PRIORITY) {
    if (key === "openclaw") continue;
    if (available.has(key)) return key;
  }

  return "openclaw";
}

const ALL_TABS: { key: PlatformKey; label: string }[] = [
  { key: "openclaw", label: "OpenClaw" },
  { key: "claude", label: "Claude Desktop" },
  { key: "claudecode", label: "Claude Code" },
  { key: "cursor", label: "Cursor / VS Code" },
  { key: "codex", label: "Copilot / Codex" },
  { key: "opencode", label: "OpenCode" },
  { key: "mcp", label: "MCP (generic)" },
  { key: "openai", label: "OpenAI" },
];

/** A numbered step in an install guide. */
function Step({ n, title, children }: { n: number; title?: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="tabular mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink-700 bg-ink-850 text-2xs font-semibold text-ink-400">
        {n}
      </span>
      <div className="min-w-0 flex-1 text-sm text-ink-400">
        {title ? <p className="mb-2 font-medium text-ink-200">{title}</p> : null}
        {children}
      </div>
    </li>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <ol className="space-y-stack-lg">{children}</ol>;
}

/** A file path the reader has to go and find. */
function PathList({ rows }: { rows: { os: string; path: string; note?: string }[] }) {
  return (
    <div className="space-y-1 rounded-lg border border-ink-750 bg-ink-1000 p-3 font-mono text-2xs">
      {rows.map((row) => (
        <div key={row.os} className="flex flex-wrap gap-x-2">
          <span className="text-ink-500">{row.os}</span>
          <span className="select-all text-ink-200">{row.path}</span>
          {row.note ? <span className="text-ink-600">{row.note}</span> : null}
        </div>
      ))}
    </div>
  );
}

function Requirement({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-l-2 border-ink-750 pl-3 text-xs leading-relaxed text-ink-500">{children}</p>
  );
}

function RepoLink({ repoUrl }: { repoUrl: string }) {
  if (!repoUrl) return null;
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-accent-400 transition-colors hover:text-accent-300"
    >
      <Github className="h-3.5 w-3.5" />
      Repository install instructions
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function OpenClawGuide({ installCmd }: { installCmd: string }) {
  return (
    <Steps>
      <Step n={1} title="Run this in your terminal">
        <InstallBlock label="terminal" code={installCmd} prompt />
      </Step>
    </Steps>
  );
}

function ClaudeDesktopGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );
  return (
    <Steps>
      <Step n={1} title="Find your config file">
        <PathList
          rows={[
            { os: "macOS", path: "~/Library/Application Support/Claude/claude_desktop_config.json" },
            { os: "Windows", path: "%APPDATA%\\Claude\\claude_desktop_config.json" },
            { os: "Linux", path: "~/.config/Claude/claude_desktop_config.json" },
          ]}
        />
      </Step>
      <Step n={2} title="Add this to the mcpServers section">
        <InstallBlock label="claude_desktop_config.json" code={configJson} />
      </Step>
      <Step n={3}>
        Save the file and <strong className="font-medium text-ink-200">restart Claude Desktop</strong>.
        The skill appears in the tools menu.
      </Step>
      <li>
        <Requirement>Requires Claude Desktop v0.10 or later with Developer mode enabled.</Requirement>
      </li>
    </Steps>
  );
}

function ClaudeCodeGuide({ slug, installCmd, repoUrl, supported, override }: { slug: string; installCmd: string; repoUrl: string; supported: boolean; override?: InstallOverride }) {
  const cliCmd = `claude mcp add ${slug} npx -- -y @trustedskills/${slug}`;
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );

  if (override?.supported && override.mode === "custom") {
    return (
      <div className="space-y-stack-lg">
        <Note tone="warn" icon={AlertTriangle}>
          <span className="font-medium">Claude Code uses a custom install flow for this skill.</span>{" "}
          {override.note ||
            "It works with Claude Code, but not through a generated one-command TrustedSkills installer."}
        </Note>
        <Steps>
          <Step n={1} title="Use the upstream install command">
            <InstallBlock label="terminal" code={override.command || installCmd} prompt />
          </Step>
        </Steps>
        <RepoLink repoUrl={repoUrl} />
      </div>
    );
  }

  if (!supported) {
    return (
      <div className="space-y-stack-lg">
        <Note tone="warn" icon={AlertTriangle}>
          <span className="font-medium">
            No one-command Claude Code install is recorded for this skill.
          </span>{" "}
          We won&apos;t invent a <code className="rounded-xs bg-ink-800 px-1 font-mono">claude mcp add</code>{" "}
          line that we haven&apos;t seen work — use the upstream flow below.
        </Note>
        <Steps>
          <Step n={1} title="Use the upstream install command">
            <InstallBlock label="terminal" code={installCmd} prompt />
          </Step>
        </Steps>
        <RepoLink repoUrl={repoUrl} />
      </div>
    );
  }

  return (
    <Steps>
      <Step n={1} title="Run in your terminal (recommended)">
        <InstallBlock label="terminal" code={cliCmd} prompt />
      </Step>
      <Step n={2} title="Or add it to ~/.claude/settings.json by hand">
        <InstallBlock label="~/.claude/settings.json" code={configJson} />
      </Step>
      <li>
        <Requirement>
          Requires the <code className="font-mono text-ink-400">claude</code> CLI. Check yours with{" "}
          <code className="font-mono text-ink-400">claude --version</code>.
        </Requirement>
      </li>
    </Steps>
  );
}

function CursorGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcp: { servers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } } },
    null, 2
  );
  return (
    <Steps>
      <Step n={1} title="Open (or create) your MCP config file">
        <PathList
          rows={[
            { os: "Cursor", path: "~/.cursor/mcp.json", note: "(create if missing)" },
            { os: "VS Code", path: "~/.vscode/settings.json", note: "(under mcp.servers)" },
          ]}
        />
      </Step>
      <Step n={2} title="Paste this into the file">
        <InstallBlock label="~/.cursor/mcp.json" code={configJson} />
      </Step>
      <Step n={3}>
        Save, then <strong className="font-medium text-ink-200">restart Cursor</strong> (or reload
        the VS Code window). The skill&apos;s tools appear in the AI pane.
      </Step>
    </Steps>
  );
}

function McpGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );
  return (
    <Steps>
      <Step n={1}>
        Locate your MCP host&apos;s config file — usually{" "}
        <code className="rounded-xs bg-ink-800 px-1 font-mono text-ink-300">mcp.json</code> or your
        client&apos;s settings.
      </Step>
      <Step n={2} title="Add this to the mcpServers section">
        <InstallBlock label="mcp config" code={configJson} />
      </Step>
      <Step n={3}>Restart your MCP host so it picks up the new server.</Step>
      <li>
        <Requirement>
          Works with Claude Desktop, Cursor, VS Code, Zed, Continue and any other MCP-compatible
          client. Requires Node.js 18 or later.
        </Requirement>
      </li>
    </Steps>
  );
}

function CodexGuide({ slug, repoUrl }: { slug: string; repoUrl: string }) {
  const configJson = JSON.stringify(
    {
      name: slug,
      description: `Agent skill for ${slug}`,
      type: "git",
      git: { url: repoUrl, branch: "main" },
      install: { command: "npm install", workingDirectory: "." },
      tools: ["*"],
    },
    null, 2
  );
  return (
    <Steps>
      <Step n={1} title="Open GitHub Copilot Chat in VS Code">
        Click the Copilot icon, or press{" "}
        <kbd className="rounded-xs border border-ink-700 bg-ink-850 px-1 font-mono text-2xs">Ctrl</kbd>
        {" + "}
        <kbd className="rounded-xs border border-ink-700 bg-ink-850 px-1 font-mono text-2xs">Alt</kbd>
        {" + "}
        <kbd className="rounded-xs border border-ink-700 bg-ink-850 px-1 font-mono text-2xs">I</kbd>.
      </Step>
      <Step n={2} title="Add the skill to your workspace">
        <p className="mb-2 text-xs text-ink-500">
          Create or edit{" "}
          <code className="rounded-xs bg-ink-800 px-1 font-mono text-ink-300">
            .github/copilot/skills.json
          </code>
        </p>
        <InstallBlock label="skills.json" code={configJson} />
      </Step>
      <Step n={3}>
        Copilot registers the skill, and you can invoke it with{" "}
        <code className="rounded-xs bg-ink-800 px-1 font-mono text-ink-300">@{slug}</code> in chat.
      </Step>
      <li>
        <Requirement>
          Requires GitHub Copilot Workspace (preview) or VS Code Insiders with Copilot Chat.
        </Requirement>
      </li>
    </Steps>
  );
}

function OpenCodeGuide({ slug }: { slug: string }) {
  const configYaml = `skills:\n  - name: ${slug}\n    enabled: true`;
  return (
    <Steps>
      <Step n={1} title="Install the OpenCode CLI">
        <InstallBlock label="terminal" code="npm install -g @opencode/agent" prompt />
      </Step>
      <Step n={2} title="Install this skill">
        <InstallBlock label="terminal" code={`opencode skill install ${slug}`} prompt />
      </Step>
      <Step n={3} title="Or add it to your project config">
        <p className="mb-2 text-xs text-ink-500">
          Create or edit{" "}
          <code className="rounded-xs bg-ink-800 px-1 font-mono text-ink-300">opencode.yaml</code> in
          your project root.
        </p>
        <InstallBlock label="opencode.yaml" code={configYaml} />
      </Step>
    </Steps>
  );
}

function OpenAIGuide({ repoUrl }: { repoUrl: string }) {
  return (
    <div className="space-y-stack-lg">
      <Note icon={Clock}>
        <span className="font-medium text-ink-200">No direct OpenAI install yet.</span> OpenAI has no
        universal skill install flow. In the meantime the{" "}
        <strong className="font-medium text-ink-200">MCP (generic)</strong> tab works with any
        MCP-compatible client.
      </Note>
      <RepoLink repoUrl={repoUrl} />
    </div>
  );
}

export function PlatformInstallTabs({ slug, installCmd, repoUrl, platforms, preferredPlatform, installOverrides }: Props) {
  const { platform: storedPlatform } = usePlatform();
  const hasClaudeCode = installOverrides?.claudecode?.supported || supportsPlatform(platforms, "claudecode") || looksLikeTrustedSkillsNpm(slug, installCmd);
  const inferredDefaultTab = inferBestPlatform(platforms, slug, installCmd, preferredPlatform, installOverrides);
  const storedSupported = storedPlatform && (storedPlatform === "claudecode" ? hasClaudeCode : supportsPlatform(platforms, storedPlatform as PlatformKey));
  const [activeTab, setActiveTab] = useState<PlatformKey>(storedSupported ? (storedPlatform as PlatformKey) : inferredDefaultTab);

  useEffect(() => {
    if (storedPlatform && (storedPlatform === "claudecode" ? hasClaudeCode : supportsPlatform(platforms, storedPlatform as PlatformKey))) {
      setActiveTab(storedPlatform as PlatformKey);
      return;
    }
    setActiveTab(inferredDefaultTab);
  }, [storedPlatform, hasClaudeCode, inferredDefaultTab, platforms]);

  function renderGuide() {
    switch (activeTab) {
      case "openclaw":   return <OpenClawGuide installCmd={installCmd} />;
      case "claude":     return <ClaudeDesktopGuide slug={slug} />;
      case "claudecode": return <ClaudeCodeGuide slug={slug} installCmd={installCmd} repoUrl={repoUrl} supported={hasClaudeCode} override={installOverrides?.claudecode} />;
      case "cursor":     return <CursorGuide slug={slug} />;
      case "codex":      return <CodexGuide slug={slug} repoUrl={repoUrl} />;
      case "opencode":   return <OpenCodeGuide slug={slug} />;
      case "mcp":        return <McpGuide slug={slug} />;
      case "openai":     return <OpenAIGuide repoUrl={repoUrl} />;
      default:           return <OpenClawGuide installCmd={installCmd} />;
    }
  }

  const activeLabel = ALL_TABS.find((t) => t.key === activeTab)?.label ?? "OpenClaw";

  return (
    <div className="overflow-hidden rounded-xl border border-ink-750 bg-ink-900 shadow-e1">
      <div className="border-b border-ink-800 px-gutter-lg pt-gutter-lg">
        <h2 className="text-sm font-semibold text-ink-50">Install on your platform</h2>
        <p className="mt-1 text-sm text-ink-450">
          Showing <span className="font-medium text-ink-200">{activeLabel}</span>, picked from this
          skill&apos;s recorded platforms.
        </p>

        <div role="tablist" aria-label="Install platform" className="-mb-px mt-4 flex flex-wrap gap-0.5">
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isSupported =
              supportsPlatform(platforms, tab.key) ||
              tab.key === "openclaw" ||
              tab.key === "mcp" ||
              (tab.key === "claudecode" && hasClaudeCode);
            const Icon = platformIcon(tab.key);
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={cx(
                  "-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-2 text-xs font-medium",
                  "transition duration-fast ease-out",
                  isActive
                    ? "border-accent-500 text-ink-50"
                    : "border-transparent text-ink-500 hover:border-ink-700 hover:text-ink-200",
                  !isSupported && !isActive && "opacity-60"
                )}
                title={isSupported ? undefined : "Not listed as supported by this skill — the snippet may still work"}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                {!isSupported ? <span className="text-ink-600">?</span> : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-gutter-lg">{renderGuide()}</div>
    </div>
  );
}
