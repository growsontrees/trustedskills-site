"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PLATFORM_CONFIG } from "@/lib/skills";
import { Suspense } from "react";

const PLATFORMS = ["openclaw", "mcp", "openai", "claude", "huggingface"];

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
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-gray-500 self-center mr-1">Platforms:</span>
      {PLATFORMS.map((platform) => {
        const config = PLATFORM_CONFIG[platform];
        const isActive = activePlatform === platform;
        return (
          <button
            key={platform}
            onClick={() => handlePlatformClick(platform)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              isActive
                ? `${config.bg} ${config.color} border-current`
                : "bg-gray-800/50 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            {config.label}
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
