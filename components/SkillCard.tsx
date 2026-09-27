"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PLATFORM_CONFIG,
  formatCount,
  tierOf,
  type Skill,
} from "../lib/skill-config";
import { usePlatform, getPlatformInstall, PLATFORM_LABELS } from "../hooks/usePlatform";
import { categoryIcon, Check, Copy, Download } from "./icons";
import { Chip, TierChip, cx } from "./ui";

interface SkillCardProps {
  skill: Skill;
  compact?: boolean;
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const [copied, setCopied] = useState(false);
  const { platform, mounted } = usePlatform();
  const tier = tierOf(skill);
  const Glyph = categoryIcon(skill.category);

  const install = getPlatformInstall(
    skill.slug,
    skill.installCmd,
    skill.repoUrl,
    platform,
    skill.platforms || []
  );

  function handleCopy() {
    navigator.clipboard.writeText(install.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const platformLabel = mounted && platform ? PLATFORM_LABELS[platform] : null;
  const installs = formatCount(skill.installs);

  // The card is a container, not an anchor: the title carries a stretched link
  // so the whole surface is clickable while the copy button stays a real
  // button rather than a <button> nested inside an <a>.
  return (
    <article
      className={cx(
        "group relative flex flex-col rounded-xl border border-ink-750 bg-ink-900 p-gutter",
        "shadow-e1 transition duration-fast ease-out",
        "hover:border-ink-650 hover:bg-ink-850 hover:shadow-e3",
        "focus-within:border-accent-700"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-ink-450 transition-colors duration-fast group-hover:border-ink-700 group-hover:text-ink-300">
          <Glyph className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-ink-100 transition-colors duration-fast group-hover:text-ink-50">
            <Link href={`/skills/${skill.slug}`} className="after:absolute after:inset-0">
              {skill.name}
            </Link>
          </h3>
          <p className="truncate text-xs text-ink-500">{skill.author}</p>
        </div>

        <TierChip tier={skill.verified} showLabel={!compact} />
      </div>

      {!compact && skill.description ? (
        <p className="mt-stack line-clamp-2 text-sm leading-relaxed text-ink-400">
          {skill.description}
        </p>
      ) : null}

      {!compact && skill.platforms?.length ? (
        <div className="mt-stack flex flex-wrap gap-1">
          {skill.platforms.slice(0, 4).map((key) => (
            <Chip key={key}>{PLATFORM_CONFIG[key]?.short ?? key}</Chip>
          ))}
          {skill.platforms.length > 4 ? (
            <Chip className="text-ink-500">+{skill.platforms.length - 4}</Chip>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-stack-lg">
        <div className="tabular flex min-w-0 items-center gap-3 text-2xs text-ink-500">
          <span className="font-mono">v{skill.version}</span>
          {installs ? (
            <span className="inline-flex items-center gap-1" title="Install count reported by the source registry">
              <Download className="h-3 w-3" />
              {installs}
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={cx(
            "relative z-10 inline-flex h-7 shrink-0 items-center gap-1.5 rounded-sm border px-2 text-2xs font-medium",
            "transition duration-fast ease-out",
            copied
              ? "border-ok-800 bg-ok-950 text-ok-300"
              : "border-ink-700 bg-ink-850 text-ink-400 hover:border-ink-650 hover:bg-ink-800 hover:text-ink-100"
          )}
          title={`Copy the ${platformLabel ?? "OpenClaw"} install command`}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Install"}
        </button>
      </div>

      <span className="sr-only">{tier.label}</span>
    </article>
  );
}
