"use client";

import { useState } from "react";
import { getPlatformInstall, PlatformKey } from "@/hooks/usePlatform";
import { CopyButton } from "@/components/CopyButton";
import { usePlatform } from "@/hooks/usePlatform";

interface Props {
  slug: string;
  installCmd: string;
  repoUrl: string;
  platforms: string[];
}

const ALL_TABS: { key: PlatformKey; emoji: string; label: string }[] = [
  { key: "openclaw", emoji: "🦀", label: "OpenClaw" },
  { key: "claude", emoji: "💬", label: "Claude Desktop" },
  { key: "cursor", emoji: "🖱️", label: "Cursor / VS Code" },
  { key: "mcp", emoji: "🔌", label: "MCP (generic)" },
  { key: "openai", emoji: "🤖", label: "OpenAI" },
];

const STEP_GUIDES: Record<PlatformKey, { steps: string[]; note?: string }> = {
  openclaw: {
    steps: [
      "Open your terminal.",
      "Run the install command below.",
      "The skill is immediately available to your OpenClaw agent.",
    ],
  },
  claude: {
    steps: [
      'Open Claude Desktop → Settings → "Developer" tab.',
      'Click "Edit Config" to open claude_desktop_config.json.',
      'Add the JSON block below into the mcpServers section.',
      "Save the file and restart Claude Desktop.",
    ],
    note: "Claude Desktop MCP integration requires Claude Desktop ≥ v0.10.",
  },
  cursor: {
    steps: [
      "Open your project root or global Cursor/VS Code config.",
      "Create or edit ~/.cursor/mcp.json (Cursor) or add to VS Code settings.json.",
      "Paste the JSON block below into your MCP servers config.",
      "Reload Cursor or VS Code — the skill tools will appear in the AI pane.",
    ],
    note: "For VS Code, add the mcp.servers block to your settings.json under the MCP extension.",
  },
  mcp: {
    steps: [
      "Locate your MCP host's config file (e.g. mcp.json or server config).",
      "Add the JSON block below to the mcpServers section.",
      "Restart your MCP host to pick up the new server.",
    ],
    note: "Works with any MCP-compatible client. Requires Node.js 18+.",
  },
  openai: {
    steps: [
      "OpenAI plugin support is coming soon.",
      "In the meantime, download the skill spec from the repository link below and use it manually as a function definition.",
    ],
    note: "OpenAI's plugin/GPT store model doesn't have a universal install command. We'll update this page when support is available.",
  },
  other: {
    steps: [
      "Download the skill source from the GitHub repository.",
      "Follow the README for platform-specific setup.",
      "Open an issue on the repo if you need help with your platform.",
    ],
  },
};

export function PlatformInstallTabs({ slug, installCmd, repoUrl, platforms }: Props) {
  const { platform: storedPlatform } = usePlatform();
  const defaultTab = (storedPlatform as PlatformKey | null) ?? "openclaw";
  const [activeTab, setActiveTab] = useState<PlatformKey>(defaultTab);

  const install = getPlatformInstall(slug, installCmd, repoUrl, activeTab);
  const guide = STEP_GUIDES[activeTab] ?? STEP_GUIDES["openclaw"];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <h2 className="font-semibold text-white mb-4">Install on your platform</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-gray-800 -mx-5 px-5 pb-0">
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const isSupported = platforms.includes(tab.key) || tab.key === "openclaw";
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
                {!isSupported && (
                  <span className="text-gray-700 text-[10px]">?</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Steps */}
        <ol className="space-y-2">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-900/50 border border-purple-800 text-purple-300 text-xs flex items-center justify-center font-bold mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        {/* Command / config block or coming soon */}
        {install.isComingSoon ? (
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4 space-y-3">
            <p className="text-sm text-yellow-400/90 font-medium">⏳ Coming soon</p>
            <p className="text-sm text-gray-400">
              OpenAI plugin support is on our roadmap. In the meantime, you can download
              the skill spec to use manually as a function definition.
            </p>
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                📥 Download OpenAPI spec / view repository →
              </a>
            )}
          </div>
        ) : (
          <div className="bg-gray-950 border border-gray-700 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              <span className="text-xs text-gray-500 font-mono">
                {install.isJson
                  ? activeTab === "claude"
                    ? "claude_desktop_config.json"
                    : activeTab === "cursor"
                    ? "~/.cursor/mcp.json  or  settings.json"
                    : "JSON config"
                  : "terminal"}
              </span>
              <CopyButton text={install.cmd} label="Copy" />
            </div>
            <pre className="p-4 text-sm font-mono overflow-x-auto text-emerald-400 whitespace-pre-wrap leading-relaxed">
              {install.cmd}
            </pre>
            {activeTab === "mcp" && (
              <div className="px-4 pb-3">
                <span className="text-xs text-gray-500">Works with any MCP-compatible client</span>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        {guide.note && (
          <p className="text-xs text-gray-500 border-l-2 border-gray-700 pl-3 leading-relaxed">
            {guide.note}
          </p>
        )}
      </div>
    </div>
  );
}
