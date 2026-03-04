"use client";

import { useState } from "react";
import { usePlatform, getPlatformInstall } from "@/hooks/usePlatform";

const EXAMPLE_SLUG = "weather";
const EXAMPLE_REPO = "https://github.com/trustedskills/weather";

const MCP_COMING_SOON_PLATFORMS = ["mcp", "claude", "cursor", "openai", "other"];

export function HeroInstallCommand() {
  const { platform, mounted } = usePlatform();
  const [copied, setCopied] = useState(false);

  const install = getPlatformInstall(EXAMPLE_SLUG, `openclaw skills install ${EXAMPLE_SLUG}`, EXAMPLE_REPO, platform);
  const isComingSoon = platform && MCP_COMING_SOON_PLATFORMS.includes(platform);

  function handleCopy() {
    navigator.clipboard.writeText(install.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!mounted) {
    // SSR placeholder
    return (
      <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 font-mono text-sm w-full sm:w-auto min-w-0">
        <span className="text-gray-500 select-none">$</span>
        <span className="text-emerald-400">openclaw skills install</span>
        <span className="text-gray-300">weather</span>
      </div>
    );
  }

  if (isComingSoon && platform !== "openclaw") {
    return (
      <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-3 bg-gray-900 border border-dashed border-gray-600 rounded-xl px-5 py-3 font-mono text-sm w-full sm:w-auto opacity-70">
          <span className="text-gray-500 select-none">$</span>
          <span className="text-gray-400">{install.cmd.split("\n")[0]}</span>
        </div>
        <p className="text-xs text-yellow-500/80">
          {install.label} native integration — coming soon · <span className="text-gray-500">MCP endpoint in roadmap</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 font-mono text-sm w-full sm:w-auto min-w-0 group">
      <span className="text-gray-500 select-none">$</span>
      <span className="flex-1 text-emerald-400 truncate">{install.cmd}</span>
      <button
        onClick={handleCopy}
        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2 py-1 rounded transition-colors flex-shrink-0"
      >
        {copied ? "✓" : "Copy"}
      </button>
    </div>
  );
}
