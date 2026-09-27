import Link from "next/link";
import type { ReactNode } from "react";
import { shownDescription, type Skill, type TierTone } from "../lib/skill-config";
import { skillPath } from "../lib/site-url";
import { SkillCard } from "./SkillCard";
import { ArrowLeft, type IconComponent } from "./icons";
import { cx } from "./ui";

/**
 * The shared frame for every filtered listing — category, tier and platform,
 * paginated or not. Those eight routes previously each carried their own copy
 * of this markup, which is how they drifted apart.
 */
export function ListingPage({
  icon: Icon,
  title,
  count,
  countNoun = "skills",
  page,
  totalPages,
  description,
  tone = "neutral",
  skills,
  children,
}: {
  /** Shares the tier palette so a tier listing matches its chip. */
  icon: IconComponent;
  title: string;
  count: number;
  countNoun?: string;
  page?: number;
  totalPages?: number;
  /** One line explaining what this filter selects. */
  description?: ReactNode;
  tone?: TierTone;
  skills: Skill[];
  /** Pagination, rendered below the grid. */
  children?: ReactNode;
}) {
  const showPaging = typeof page === "number" && typeof totalPages === "number" && totalPages > 1;

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/skills"
        className="group inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-200"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:-translate-x-0.5" />
        Back to all skills
      </Link>

      <header className="mt-6 border-b border-ink-800 pb-6">
        <div className="flex items-start gap-3.5">
          <span
            className={cx(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-ink-900",
              tone === "accent"
                ? "border-accent-800 text-accent-400"
                : tone === "ok"
                ? "border-ok-800 text-ok-400"
                : tone === "warn"
                ? "border-warn-800 text-warn-400"
                : "border-ink-750 text-ink-400"
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold text-ink-50">{title}</h1>
            <p className="tabular mt-1 text-sm text-ink-450">
              {count.toLocaleString("en-GB")} {countNoun}
              {showPaging ? ` · page ${page!.toLocaleString("en-GB")} of ${totalPages!.toLocaleString("en-GB")}` : ""}
            </p>
          </div>
        </div>

        {description ? (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-400">{description}</p>
        ) : null}
      </header>

      {/* A crawlable text index of the page's results. The card grid below is
          the same set; this keeps the listing legible without JS. */}
      <nav aria-label={`${title} index`} className="sr-only">
        <ul>
          {skills.map((skill) => (
            <li key={skill.slug}>
              <Link href={skillPath(skill.slug)}>
                {skill.name}
                {shownDescription(skill) ? ` — ${shownDescription(skill)}` : ""}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {skills.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink-750 py-20 text-center">
          <h2 className="text-base font-semibold text-ink-200">Nothing here yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
            No skills in the index match this filter.
          </p>
          <Link
            href="/skills"
            className="mt-5 inline-flex text-sm text-accent-400 transition-colors hover:text-accent-300"
          >
            Browse everything
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
