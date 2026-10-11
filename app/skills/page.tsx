import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllSkills,
  getCategories,
  getStats,
  scoreSkill,
  PLATFORM_CONFIG,
  TIER_CONFIG,
  TIER_ORDER,
  type Skill,
  type VerificationTier,
} from "../../lib/skills";
import { SkillCard } from "../../components/SkillCard";
import { REQUEST_SKILL_URL } from "../../lib/github-links";
import { ChevronLeft, ChevronRight, Search, categoryIcon } from "../../components/icons";
import { Eyebrow, cx } from "../../components/ui";

export const metadata: Metadata = {
  title: "Browse Agent Skills",
  description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
  alternates: {
    canonical: "https://trustedskills.dev/skills",
  },
  openGraph: {
    title: "Browse Agent Skills | TrustedSkills",
    description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
    url: "https://trustedskills.dev/skills",
  },
};

// Filtering, sorting and paging all happen here on the server. The browser gets
// one page of cards, not the whole registry (it used to get every skill).
const PAGE_SIZE = 24;
const PLATFORMS = ["claudecode", "openclaw", "claude", "mcp", "cursor", "openai"];
const SORTS = {
  ranked: "Top ranked",
  signal: "Signal Score",
  installs: "Most installed",
  updated: "Recently updated",
  name: "A–Z",
} as const;
type SortKey = keyof typeof SORTS;

type Params = { q?: string; category?: string; platform?: string; tier?: string; sort?: string; page?: string };

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function updatedAt(skill: Skill): number {
  const raw = skill.updated_at ?? (skill as Skill & { lastUpdated?: string }).lastUpdated;
  const time = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function signalSortKey(skill: Skill): number {
  return skill.signal?.rankable ? skill.signal.score : -1;
}

// Each full sort of ~26k skills is done once per process and reused.
const sortedCache = new Map<SortKey, Skill[]>();
function sortedSkills(sort: SortKey): Skill[] {
  let list = sortedCache.get(sort);
  if (!list) {
    const all = [...getAllSkills()];
    if (sort === "ranked") all.sort((a, b) => scoreSkill(b) - scoreSkill(a));
    // Unrankable skills (too little measured) go after every scored one.
    if (sort === "signal") all.sort((a, b) => signalSortKey(b) - signalSortKey(a) || (b.installs || 0) - (a.installs || 0));
    if (sort === "installs") all.sort((a, b) => (b.installs || 0) - (a.installs || 0));
    if (sort === "updated") all.sort((a, b) => updatedAt(b) - updatedAt(a));
    if (sort === "name") all.sort((a, b) => a.name.localeCompare(b.name));
    list = all;
    sortedCache.set(sort, list);
  }
  return list;
}

function matches(skill: Skill, q: string): boolean {
  return (
    skill.name.toLowerCase().includes(q) ||
    skill.slug.includes(q) ||
    (skill.description ?? "").toLowerCase().includes(q) ||
    (skill.author ?? "").toLowerCase().includes(q) ||
    (skill.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
  );
}

// Cards never show the long description; leaving it out keeps the page small.
function toCard(skill: Skill): Skill {
  const { longDescription: _omit, ...card } = skill;
  return card as Skill;
}

export default async function SkillsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const params: Params = {
    q: first(raw.q)?.trim().slice(0, 100) || undefined,
    category: first(raw.category) || undefined,
    platform: first(raw.platform) || undefined,
    tier: first(raw.tier) || undefined,
    sort: first(raw.sort) || undefined,
  };
  const sort: SortKey = params.sort && params.sort in SORTS ? (params.sort as SortKey) : "ranked";

  const categories = getCategories();
  const stats = getStats();
  const hasSignal = !!stats.signal;

  const q = params.q?.toLowerCase();
  const filtered = sortedSkills(sort).filter(
    (skill) =>
      (!params.category || skill.category === params.category) &&
      (!params.platform || skill.platforms?.includes(params.platform)) &&
      (!params.tier || skill.verified === params.tier) &&
      (!q || matches(skill, q))
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, parseInt(first(raw.page) ?? "1", 10) || 1));
  const pageSkills = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map(toCard);

  const href = (overrides: Partial<Params>) => {
    const next: Params = { ...params, page: undefined, ...overrides };
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) {
      if (value && !(key === "sort" && value === "ranked") && !(key === "page" && value === "1")) qs.set(key, value);
    }
    const s = qs.toString();
    return s ? `/skills?${s}` : "/skills";
  };

  const hasFilters = !!(params.q || params.category || params.platform || params.tier);

  const chip = (active: boolean) =>
    cx(
      "inline-flex h-7 items-center rounded-sm border px-2.5 text-xs font-medium transition duration-fast ease-out",
      active
        ? "border-accent-700 bg-accent-950 text-accent-200"
        : "border-ink-750 bg-ink-900 text-ink-400 hover:border-ink-700 hover:bg-ink-850 hover:text-ink-100"
    );

  const side = (active: boolean) =>
    cx(
      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition duration-fast ease-out",
      active
        ? "bg-ink-850 font-medium text-ink-50 shadow-hairline"
        : "text-ink-400 hover:bg-ink-900 hover:text-ink-100"
    );

  return (
    <div className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <h1 className="text-3xl font-semibold text-ink-50">Browse skills</h1>
        <p className="mt-2 text-sm text-ink-450">
          {stats.total_skills.toLocaleString("en-GB")} listings from across the agent ecosystem.
          None of them have been code-reviewed — check the source before you install.
        </p>
        <p className="mt-1 text-sm text-ink-450">
          Looking for what&apos;s new?{" "}
          <Link href="/trending" className="text-accent-400 transition-colors hover:text-accent-300">
            See the repos gaining stars fastest
          </Link>
          .
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-8 lg:flex-row">
        {/* ── Filters ─────────────────────────────────────────────────── */}
        <aside className="w-full shrink-0 lg:w-56">
          <div className="space-y-6 lg:sticky lg:top-20">
            <form action="/skills" method="get" role="search">
              <label htmlFor="skills-q" className="sr-only">
                Search skills
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
                <input
                  id="skills-q"
                  type="search"
                  name="q"
                  defaultValue={params.q}
                  placeholder="Search…"
                  className="h-9 w-full rounded-md border border-ink-750 bg-ink-900 pl-9 pr-3 text-sm text-ink-100 outline-none transition duration-fast ease-out placeholder:text-ink-600 hover:border-ink-700 focus:border-accent-600"
                />
              </div>
              {params.category && <input type="hidden" name="category" value={params.category} />}
              {params.platform && <input type="hidden" name="platform" value={params.platform} />}
              {params.tier && <input type="hidden" name="tier" value={params.tier} />}
              {sort !== "ranked" && <input type="hidden" name="sort" value={sort} />}
            </form>

            {hasFilters && (
              <Link
                href="/skills"
                className="inline-flex text-xs text-accent-400 transition-colors hover:text-accent-300"
              >
                Clear all filters
              </Link>
            )}

            <div>
              <Eyebrow className="mb-2">Badge</Eyebrow>
              <div className="space-y-0.5">
                <Link href={href({ tier: undefined })} className={side(!params.tier)}>
                  All badges
                </Link>
                {TIER_ORDER.map((tier) => {
                  const config = TIER_CONFIG[tier];
                  const Icon = config.icon;
                  return (
                    <Link
                      key={tier}
                      href={href({ tier })}
                      title={config.description}
                      className={side(params.tier === tier)}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" />
                      <span>{config.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <Eyebrow className="mb-2">Category</Eyebrow>
              <div className="space-y-0.5">
                <Link href={href({ category: undefined })} className={side(!params.category)}>
                  <span className="flex-1">All categories</span>
                </Link>
                {categories.map((cat) => {
                  const Icon = categoryIcon(cat.slug);
                  return (
                    <Link
                      key={cat.slug}
                      href={href({ category: cat.slug })}
                      className={side(params.category === cat.slug)}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-ink-500" />
                      <span className="flex-1 truncate">{cat.name}</span>
                      <span className="tabular text-2xs text-ink-600">
                        {cat.count.toLocaleString("en-GB")}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Results ─────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-ink-800 pb-4">
            <span className="mr-1 text-xs text-ink-500">Platform</span>
            <Link href={href({ platform: undefined })} className={chip(!params.platform)}>
              All
            </Link>
            {PLATFORMS.map((platform) => (
              <Link key={platform} href={href({ platform })} className={chip(params.platform === platform)}>
                {PLATFORM_CONFIG[platform]?.short ?? platform}
              </Link>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <p className="tabular text-sm text-ink-450">
              <span className="font-medium text-ink-100">
                {filtered.length.toLocaleString("en-GB")}
              </span>{" "}
              {filtered.length === 1 ? "skill" : "skills"}
              {params.q && <> matching &ldquo;{params.q}&rdquo;</>}
            </p>
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs text-ink-500">Sort</span>
              {(Object.keys(SORTS) as SortKey[]).filter((key) => key !== "signal" || hasSignal).map((key) => (
                <Link key={key} href={href({ sort: key })} className={chip(sort === key)}>
                  {SORTS[key]}
                </Link>
              ))}
            </div>
          </div>

          {pageSkills.length === 0 ? (
            <div className="rounded-xl border border-dashed border-ink-750 py-20 text-center">
              <h2 className="text-base font-semibold text-ink-200">No skills match those filters</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
                Try a broader search term, or drop one of the filters.
              </p>
              <Link
                href="/skills"
                className="mt-5 inline-flex text-sm text-accent-400 transition-colors hover:text-accent-300"
              >
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {pageSkills.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="mt-section flex items-center justify-between gap-4 border-t border-ink-800 pt-6"
            >
              {page > 1 ? (
                <Link
                  href={href({ page: String(page - 1) })}
                  rel="prev"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-700 bg-ink-850 px-3 text-sm font-medium text-ink-200 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="tabular text-sm text-ink-500">
                Page {page.toLocaleString("en-GB")} of {totalPages.toLocaleString("en-GB")}
              </span>
              {page < totalPages ? (
                <Link
                  href={href({ page: String(page + 1) })}
                  rel="next"
                  className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-700 bg-ink-850 px-3 text-sm font-medium text-ink-200 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          <div className="mt-section rounded-xl border border-ink-800 bg-ink-950 p-gutter-lg text-center">
            <p className="text-sm text-ink-400">Can&apos;t find what you need?</p>
            <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row">
              <a
                href={REQUEST_SKILL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-md border border-ink-700 bg-ink-850 px-4 text-sm font-medium text-ink-200 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-800 hover:text-ink-50"
              >
                Request a skill
              </a>
              <Link
                href="/submit"
                className="inline-flex h-9 items-center rounded-md border border-transparent px-4 text-sm font-medium text-ink-400 transition duration-fast ease-out hover:bg-ink-900 hover:text-ink-100"
              >
                Submit a skill
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
