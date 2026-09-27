"use client";

import { useState } from "react";
import { usePlatform, getPlatformInstall } from "../hooks/usePlatform";
import { Check, Copy } from "./icons";
import { cx } from "./ui";

// A real listing whose command was installed end to end on 2026-09-27.
const EXAMPLE_CMD = "npx skills add coreyhaines31/marketingskills --skill seo-audit";

/**
 * A worked example of the install command, following the reader's chosen
 * platform. Server-renders the plain form so there's something concrete
 * above the fold before hydration.
 */
export function HeroInstallCommand() {
  const { platform, mounted } = usePlatform();
  const [copied, setCopied] = useState(false);

  const display = mounted ? getPlatformInstall(EXAMPLE_CMD, platform).cmd : EXAMPLE_CMD;

  function handleCopy() {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-ink-750 bg-ink-1000 py-1.5 pl-3 pr-1.5 shadow-e1">
      <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink-200">
        <span className="select-none text-ink-600">$ </span>
        {display}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className={cx(
          "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-sm px-2 text-2xs font-medium",
          "transition duration-fast ease-out",
          copied ? "text-ok-300" : "text-ink-500 hover:bg-ink-850 hover:text-ink-100"
        )}
        aria-label="Copy the example install command"
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
