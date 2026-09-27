"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PLATFORM_CONFIG } from "../lib/skill-config";
import { cx } from "./ui";
import { Suspense } from "react";

const PLATFORMS = ["claudecode", "openclaw", "claude", "mcp", "cursor", "openai"];

function PlatformChipsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlatform = searchParams.get("platform");

  function handlePlatformClick(platform: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (activePlatform === platform) {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }
    router.push(`/skills?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs text-ink-500">Platform</span>
      {PLATFORMS.map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        const isActive = activePlatform === platform;
        return (
          <button
            key={platform}
            type="button"
            onClick={() => handlePlatformClick(platform)}
            aria-pressed={isActive}
            className={cx(
              "inline-flex h-7 items-center rounded-sm border px-2.5 text-xs font-medium",
              "transition duration-fast ease-out",
              isActive
                ? "border-accent-700 bg-accent-950 text-accent-200"
                : "border-ink-750 bg-ink-900 text-ink-400 hover:border-ink-700 hover:bg-ink-850 hover:text-ink-100"
            )}
          >
            {config?.short ?? platform}
          </button>
        );
      })}
    </div>
  );
}

export function PlatformChips() {
  return (
    <Suspense fallback={null}>
      <PlatformChipsInner />
    </Suspense>
  );
}
