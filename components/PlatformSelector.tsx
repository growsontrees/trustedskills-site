"use client";

import { usePlatform, PlatformKey } from "../hooks/usePlatform";

const OPTIONS: { key: PlatformKey; emoji: string; label: string; sublabel: string }[] = [
  { key: "openclaw", emoji: "🦀", label: "OpenClaw", sublabel: "openclaw skills install" },
  { key: "claude", emoji: "💬", label: "Claude Desktop", sublabel: "claude_desktop_config.json" },
  { key: "openai", emoji: "🤖", label: "OpenAI / ChatGPT", sublabel: "Function calling" },
  { key: "cursor", emoji: "🖱️", label: "Cursor / VS Code", sublabel: "MCP extension" },
  { key: "other", emoji: "🔬", label: "Just exploring", sublabel: "Show me everything" },
];

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
        {OPTIONS.map((opt) => {
          const isActive = platform === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => setPlatform(isActive ? null : opt.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                isActive
                  ? "bg-purple-900/60 border-purple-600 text-purple-200 shadow-lg shadow-purple-900/30"
                  : "bg-gray-900/80 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
              {isActive && <span className="text-purple-400">✓</span>}
            </button>
          );
        })}
      </div>
      {platform && (
        <p className="text-center text-xs text-gray-600 mt-2">
          Showing install commands for{" "}
          <span className="text-purple-400">{OPTIONS.find((o) => o.key === platform)?.label}</span>
          {" · "}
          <button onClick={() => setPlatform(null)} className="hover:text-gray-400 transition-colors underline">
            clear
          </button>
        </p>
      )}
    </div>
  );
}
