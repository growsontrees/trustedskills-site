"use client";

import { useState } from "react";
import { PlatformKey } from "../hooks/usePlatform";
import { CopyButton } from "./CopyButton";
import { usePlatform } from "../hooks/usePlatform";

interface Props {
  slug: string;
  installCmd: string;
  repoUrl: string;
  platforms: string[];
}

const ALL_TABS: { key: PlatformKey; emoji: string; label: string }[] = [
  { key: "openclaw", emoji: "🦀", label: "OpenClaw" },
  { key: "claude", emoji: "💬", label: "Claude Desktop" },
  { key: "claudecode", emoji: "⌨️", label: "Claude Code" },
  { key: "cursor", emoji: "🖱️", label: "Cursor / VS Code" },
  { key: "codex", emoji: "🐙", label: "GitHub Copilot / Codex" },
  { key: "opencode", emoji: "🔓", label: "OpenCode" },
  { key: "mcp", emoji: "🔌", label: "MCP (generic)" },
  { key: "openai", emoji: "🤖", label: "OpenAI" },
];

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/50 border border-purple-800 text-purple-300 text-xs flex items-center justify-center font-bold mt-0.5">
      {n}
    </span>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <span className="text-xs text-gray-500 font-mono">{label}</span>
        <CopyButton text={code} label="Copy" />
      </div>
      <pre className="p-4 text-sm font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
        {code}
      </pre>
    </div>
  );
}

function OpenClawGuide({ installCmd }: { installCmd: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <span>Run this command in your terminal. The skill is immediately available.</span>
      </div>
      <CodeBlock label="terminal" code={installCmd} />
    </div>
  );
}

function ClaudeDesktopGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <div>
          <p className="mb-2 font-medium text-gray-300">Find your config file</p>
          <div className="text-xs font-mono bg-gray-950 rounded-lg p-3 border border-gray-700 space-y-1">
            <div><span className="text-blue-400">Mac:</span> <span className="text-gray-300 select-all">~/Library/Application Support/Claude/claude_desktop_config.json</span></div>
            <div><span className="text-cyan-400">Windows:</span> <span className="text-gray-300 select-all">%APPDATA%\Claude\claude_desktop_config.json</span></div>
            <div><span className="text-green-400">Linux:</span> <span className="text-gray-300 select-all">~/.config/Claude/claude_desktop_config.json</span></div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">
            Add this to the <code className="text-purple-300 bg-gray-800 px-1 rounded">mcpServers</code> section
          </p>
          <CodeBlock label="claude_desktop_config.json" code={configJson} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={3} />
        <span>Save the file and <strong className="text-gray-200">restart Claude Desktop</strong>. The skill will appear in the tools menu.</span>
      </div>
      <p className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
        Requires Claude Desktop ≥ v0.10 with Developer mode enabled.
      </p>
    </div>
  );
}

function ClaudeCodeGuide({ slug }: { slug: string }) {
  const cliCmd = `claude mcp add ${slug} npx -- -y @trustedskills/${slug}`;
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">Run in terminal (recommended)</p>
          <CodeBlock label="terminal" code={cliCmd} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 text-gray-400">
            Or manually add to <code className="text-purple-300 bg-gray-800 px-1 rounded">~/.claude/settings.json</code>
          </p>
          <CodeBlock label="~/.claude/settings.json" code={configJson} />
        </div>
      </div>
      <p className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
        Requires Claude Code (claude CLI). Run <code className="text-gray-400">claude --version</code> to verify your install.
      </p>
    </div>
  );
}

function CursorGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcp: { servers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } } },
    null, 2
  );
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <div>
          <p className="font-medium text-gray-300">Open (or create) your MCP config file</p>
          <div className="mt-2 text-xs font-mono bg-gray-950 rounded-lg p-3 border border-gray-700 space-y-1">
            <div><span className="text-cyan-400">Cursor:</span> <span className="text-gray-300 select-all">~/.cursor/mcp.json</span> <span className="text-gray-500">(create if missing)</span></div>
            <div><span className="text-blue-400">VS Code:</span> <span className="text-gray-300 select-all">~/.vscode/settings.json</span> <span className="text-gray-500">(under mcp.servers)</span></div>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">Paste this into the file</p>
          <CodeBlock label="~/.cursor/mcp.json" code={configJson} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={3} />
        <span>Save and <strong className="text-gray-200">restart Cursor</strong> (or reload VS Code window). The skill tools appear in the AI pane.</span>
      </div>
    </div>
  );
}

function McpGuide({ slug }: { slug: string }) {
  const configJson = JSON.stringify(
    { mcpServers: { [slug]: { command: "npx", args: ["-y", `@trustedskills/${slug}`] } } },
    null, 2
  );
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <span>Locate your MCP host config file (e.g. <code className="text-gray-300 bg-gray-800 px-1 rounded">mcp.json</code> or your client settings).</span>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2">Add this to the <code className="text-purple-300 bg-gray-800 px-1 rounded">mcpServers</code> section</p>
          <CodeBlock label="mcp config" code={configJson} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={3} />
        <span>Restart your MCP host to pick up the new skill.</span>
      </div>
      <div className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
        Works with: <span className="text-gray-400">Claude Desktop, Cursor, VS Code, Zed, Continue,</span> and any MCP-compatible client. Requires Node.js 18+.
      </div>
    </div>
  );
}

function CodexGuide({ slug, repoUrl }: { slug: string; repoUrl: string }) {
  const configJson = JSON.stringify(
    {
      "name": slug,
      "description": `Agent skill for ${slug}`,
      "type": "git",
      "git": {
        "url": repoUrl,
        "branch": "main"
      },
      "install": {
        "command": "npm install",
        "workingDirectory": "."
      },
      "tools": ["*"]
    },
    null, 2
  );
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <div>
          <p className="font-medium text-gray-300">Open GitHub Copilot Chat in VS Code</p>
          <p className="mt-1 text-xs text-gray-500">Click the Copilot icon or press <kbd className="bg-gray-800 px-1 rounded">Ctrl</kbd>+<kbd className="bg-gray-800 px-1 rounded">Alt</kbd>+<kbd className="bg-gray-800 px-1 rounded">I</kbd></p>
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">Add this skill configuration to your workspace</p>
          <p className="mb-2 text-xs text-gray-500">Create or edit <code className="text-gray-300 bg-gray-800 px-1 rounded">.github/copilot/skills.json</code></p>
          <CodeBlock label="skills.json" code={configJson} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={3} />
        <span>Copilot will automatically install and register the skill. You can now invoke it with <code className="text-purple-300 bg-gray-800 px-1 rounded">@{slug}</code> in chat.</span>
      </div>
      <div className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
        Requires: <span className="text-gray-400">GitHub Copilot Workspace (preview) or VS Code Insiders with Copilot Chat.</span>
      </div>
    </div>
  );
}

function OpenCodeGuide({ slug }: { slug: string }) {
  const installCmd = `opencode skill install ${slug}`;
  const configYaml = `skills:
  - name: ${slug}
    enabled: true`;
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={1} />
        <div>
          <p className="font-medium text-gray-300">Install OpenCode CLI</p>
          <CodeBlock label="terminal" code={"npm install -g @opencode/agent"} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={2} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">Install this skill</p>
          <CodeBlock label="terminal" code={installCmd} />
        </div>
      </div>
      <div className="flex items-start gap-3 text-sm text-gray-400">
        <StepNumber n={3} />
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-medium text-gray-300">Or add to your project config</p>
          <p className="mb-2 text-xs text-gray-500">Create or edit <code className="text-gray-300 bg-gray-800 px-1 rounded">opencode.yaml</code> in your project root</p>
          <CodeBlock label="opencode.yaml" code={configYaml} />
        </div>
      </div>
      <div className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3">
        Requires: <span className="text-gray-400">OpenCode Agent CLI or Codium IDE with OpenCode extension.</span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OpenAIGuide({ repoUrl, slug }: { repoUrl: string; slug: string }) {
  return (
    <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-5 space-y-3">
      <p className="text-sm text-yellow-400/90 font-medium">⏳ OpenAI direct integration coming soon</p>
      <p className="text-sm text-gray-400">
        OpenAI does not yet have a universal skill install flow. Meanwhile, use this skill via the{" "}
        <strong className="text-gray-300">MCP (generic) tab</strong> — it works with Claude Desktop, Cursor, VS Code, and any MCP-compatible client.
      </p>
      {repoUrl && (
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          📥 View repository / download spec →
        </a>
      )}
    </div>
  );
}

export function PlatformInstallTabs({ slug, installCmd, repoUrl, platforms }: Props) {
  const { platform: storedPlatform } = usePlatform();
  const defaultTab = (storedPlatform as PlatformKey | null) ?? "openclaw";
  const [activeTab, setActiveTab] = useState<PlatformKey>(defaultTab);

  function renderGuide() {
    switch (activeTab) {
      case "openclaw":   return <OpenClawGuide installCmd={installCmd} />;
      case "claude":     return <ClaudeDesktopGuide slug={slug} />;
      case "claudecode": return <ClaudeCodeGuide slug={slug} />;
      case "cursor":     return <CursorGuide slug={slug} />;
      case "codex":      return <CodexGuide slug={slug} repoUrl={repoUrl} />;
      case "opencode":   return <OpenCodeGuide slug={slug} />;
      case "mcp":        return <McpGuide slug={slug} />;
      case "openai":     return <OpenAIGuide repoUrl={repoUrl} slug={slug} />;
      default:           return <OpenClawGuide installCmd={installCmd} />;
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <h2 className="font-semibold text-white mb-4">Install on your platform</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-gray-800 -mx-5 px-5 pb-0">
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isSupported =
              (platforms || []).includes(tab.key) ||
              tab.key === "openclaw" ||
              tab.key === "mcp" ||
              tab.key === "claudecode";
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                  isActive
                    ? "border-purple-500 text-purple-300"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                } ${!isSupported ? "opacity-60" : ""}`}
                title={!isSupported ? "Not listed as supported — may still work" : undefined}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
                {!isSupported && <span className="text-gray-700 text-[10px]">?</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5">{renderGuide()}</div>
    </div>
  );
}
