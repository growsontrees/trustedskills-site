"use client";

import Link from "next/link";
import { Skill, TIER_CONFIG, PLATFORM_CONFIG } from "@/lib/skills";
import { useState } from "react";

interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const tier = TIER_CONFIG[skill.verified];

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(skill.installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Link
      href={`/skills/${skill.slug}`}
      className="group block bg-gray-900 hover:bg-gray-800/80 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{skill.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-100 group-hover:text-white transition-colors truncate">
              {skill.name}
            </h3>
            <div className="text-xs text-gray-500">by {skill.author}</div>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${tier.bg} ${tier.border} ${tier.color}`}
          title={tier.description}
        >
          <span>{tier.icon}</span>
          <span className="hidden sm:inline">{tier.label}</span>
        </div>
      </div>

      {!compact && (
        <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {skill.description}
        </p>
      )}

      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {skill.platforms.map((platform) => {
            const config = PLATFORM_CONFIG[platform] || {
              label: platform,
              color: "text-gray-400",
              bg: "bg-gray-800",
            };
            return (
              <span
                key={platform}
                className={`text-xs px-2 py-0.5 rounded-md font-mono ${config.bg} ${config.color}`}
              >
                {config.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-500 min-w-0">
          <span className="font-mono">v{skill.version}</span>
          {skill.installs > 0 && (
            <span>
              {skill.installs >= 1000
                ? `${(skill.installs / 1000).toFixed(1)}k`
                : skill.installs}{" "}
              installs
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-lg transition-colors flex-shrink-0"
        >
          {copied ? "Copied!" : "Install"}
        </button>
      </div>
    </Link>
  );
}
