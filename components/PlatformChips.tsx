"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PLATFORM_CONFIG } from "../lib/skills";
import { Suspense } from "react";
import {
  BROWSABLE_PLATFORM_KEYS,
  getPlatformBrowsePath,
  PlatformKey,
  resolvePlatformKey,
} from "../lib/platforms";

function PlatformChipsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activePlatform = resolvePlatformKey(searchParams.get("platform"));

  function handlePlatformClick(platform: PlatformKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (activePlatform === platform) {
      params.delete("platform");
    } else {
      params.set("platform", platform);
    }

    const query = params.toString();
    const hasOtherFilters = [...params.keys()].some((key) => key !== "platform");
    if (!hasOtherFilters) {
      router.push(activePlatform === platform ? "/skills" : getPlatformBrowsePath(platform));
      return;
    }

    router.push(query ? `/skills?${query}` : "/skills");
  }

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-xs text-gray-500 self-center mr-1">Platforms:</span>
      {BROWSABLE_PLATFORM_KEYS.map((platform) => {
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
