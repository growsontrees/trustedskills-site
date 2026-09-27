"use client";

import { usePlatform, PlatformKey } from "../hooks/usePlatform";
import { Check } from "./icons";
import { cx } from "./ui";

const OPTIONS: { key: PlatformKey; label: string }[] = [
  { key: "claudecode", label: "Claude Code" },
  { key: "claude", label: "Claude Desktop" },
  { key: "cursor", label: "Cursor / VS Code" },
  { key: "mcp", label: "MCP" },
  { key: "openclaw", label: "OpenClaw" },
];

/**
 * Sets the reader's platform once; every install snippet on the site then
 * defaults to it. Stored in localStorage, so it renders nothing until mounted
 * to avoid a hydration mismatch.
 */
export function PlatformSelector({ align = "start" }: { align?: "start" | "center" }) {
  const { platform, setPlatform, mounted } = usePlatform();

  if (!mounted) {
    // Reserve the row's height so the masthead doesn't jump on hydration.
    return <div className="h-8" aria-hidden="true" />;
  }

  return (
    <div className={cx("flex flex-wrap items-center gap-1.5", align === "center" && "justify-center")}>
      <span className="mr-1 text-xs text-ink-500">Your platform</span>
      {OPTIONS.map((opt) => {
        const isActive = platform === opt.key;
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => setPlatform(isActive ? null : opt.key)}
            aria-pressed={isActive}
            className={cx(
              "inline-flex h-7 items-center gap-1.5 rounded-sm border px-2 text-xs font-medium",
              "transition duration-fast ease-out",
              isActive
                ? "border-accent-700 bg-accent-950 text-accent-200"
                : "border-ink-750 bg-ink-900 text-ink-400 hover:border-ink-700 hover:bg-ink-850 hover:text-ink-100"
            )}
          >
            {isActive ? <Check className="h-3 w-3" /> : null}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
