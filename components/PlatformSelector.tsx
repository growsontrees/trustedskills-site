"use client";

import { usePlatform } from "../hooks/usePlatform";
import { BROWSABLE_PLATFORM_KEYS, PLATFORM_DEFINITIONS } from "../lib/platforms";

const OPTIONS = BROWSABLE_PLATFORM_KEYS;

export function PlatformSelector() {
  const { platform, setPlatform, mounted } = usePlatform();

  if (!mounted) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 mb-3 text-center font-medium">
        What are you using?{" "}
        <span className="text-gray-600">— we&apos;ll show the right install command</span>
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {OPTIONS.map((key) => {
          const option = PLATFORM_DEFINITIONS[key];
          const isActive = platform === key;
          return (
            <button
              key={key}
              onClick={() => setPlatform(isActive ? null : key)}
              title={option.sublabel}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-900/60 border-purple-600 text-purple-200 shadow-lg shadow-purple-900/30"
                  : "bg-gray-900/80 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              <span>{option.emoji}</span>
              <span>{option.label}</span>
              {isActive && <span className="text-purple-400">✓</span>}
            </button>
          );
        })}
      </div>
      {platform && (
        <p className="text-center text-xs text-gray-600 mt-2">
          Showing install commands for{" "}
          <span className="text-purple-400">{PLATFORM_DEFINITIONS[platform].label}</span>
          {" · "}
          <button onClick={() => setPlatform(null)} className="hover:text-gray-400 transition-colors underline">
            clear
          </button>
        </p>
      )}
    </div>
  );
}
