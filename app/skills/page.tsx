import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllSkills,
  getCategories,
  getStats,
  scoreSkill,
  PLATFORM_CONFIG,
  TIER_CONFIG,
  type Skill,
  type VerificationTier,
} from "../../lib/skills";
import { SkillCard } from "../../components/SkillCard";

export const metadata: Metadata = {
  title: "Browse Agent Skills",
  description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
  alternates: {
    canonical: "https://trustedskills.dev/skills/",
  },
  openGraph: {
    title: "Browse Agent Skills | TrustedSkills",
    description: "Browse all AI agent skills — humanizer, Obsidian, code runners, and more. Filter by platform, category, and verification tier.",
    url: "https://trustedskills.dev/skills/",
  },
};

// Filtering, sorting and paging all happen here on the server. The browser gets
// one page of cards, not the whole registry (it used to get every skill).
const PAGE_SIZE = 24;
const PLATFORMS = ["claudecode", "openclaw", "claude", "mcp", "cursor", "openai"];
const TIERS: VerificationTier[] = ["official", "featured", "verified", "community", "unverified"];
const SORTS = {
  ranked: "Top Ranked",
  installs: "Most Popular",
  updated: "Recently Updated",
  name: "Alphabetical",
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

// Each full sort of ~45k skills is done once per process and reused.
const sortedCache = new Map<SortKey, Skill[]>();
function sortedSkills(sort: SortKey): Skill[] {
  let list = sortedCache.get(sort);
  if (!list) {
    const all = [...getAllSkills()];
    if (sort === "ranked") all.sort((a, b) => scoreSkill(b) - scoreSkill(a));
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

  const chip = (active: boolean) =>
    `text-sm px-3 py-1.5 rounded-full border font-medium transition-colors ${
      active
        ? "bg-purple-900/50 text-purple-200 border-purple-700"
        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
    }`;
  const side = (active: boolean) =>
    `w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
      active ? "bg-purple-900/50 text-purple-200" : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Browse Skills</h1>
        <p className="text-gray-400">
          {stats.total_skills.toLocaleString("en-US")} skills available · {(stats.total_installs / 1_000_000).toFixed(1)}M total installs
        </p>
      </div>

      <div className="mb-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-300 mr-1">Platform:</span>
          <Link href={href({ platform: undefined })} className={chip(!params.platform)}>
            All platforms
          </Link>
          {PLATFORMS.map((platform) => (
            <Link key={platform} href={href({ platform })} className={chip(params.platform === platform)}>
              {PLATFORM_CONFIG[platform]?.label ?? platform}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-56 flex-shrink-0 space-y-6">
          <form action="/skills" method="get" role="search">
            <label htmlFor="skills-q" className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
              Search
            </label>
            <input
              id="skills-q"
              type="search"
              name="q"
              defaultValue={params.q}
              placeholder="Search skills..."
              className="w-full bg-gray-900 border border-gray-700 focus:border-purple-600 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
            />
            {params.category && <input type="hidden" name="category" value={params.category} />}
            {params.platform && <input type="hidden" name="platform" value={params.platform} />}
            {params.tier && <input type="hidden" name="tier" value={params.tier} />}
            {sort !== "ranked" && <input type="hidden" name="sort" value={sort} />}
          </form>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Verification</p>
            <div className="space-y-1">
              <Link href={href({ tier: undefined })} className={side(!params.tier)}>
                All tiers
              </Link>
              {TIERS.map((tier) => (
                <Link key={tier} href={href({ tier })} className={side(params.tier === tier)}>
                  <span>{TIER_CONFIG[tier].icon}</span>
                  <span>{TIER_CONFIG[tier].label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <div className="space-y-1">
              <Link href={href({ category: undefined })} className={side(!params.category)}>
                <span className="flex-1">All</span>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.slug} href={href({ category: cat.slug })} className={side(params.category === cat.slug)}>
                  <span>{cat.emoji}</span>
                  <span className="flex-1">{cat.name}</span>
                  <span className="text-xs text-gray-600">{cat.count.toLocaleString("en-US")}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <p className="text-sm text-gray-500">
              {filtered.length.toLocaleString("en-US")} skills
              {params.q && <> matching “{params.q}”</>}
            </p>
            <div className="flex gap-2 text-sm">
              {(Object.keys(SORTS) as SortKey[]).map((key) => (
                <Link
                  key={key}
                  href={href({ sort: key })}
                  className={sort === key ? "text-purple-300 font-medium" : "text-gray-500 hover:text-gray-300"}
                >
                  {SORTS[key]}
                </Link>
              ))}
            </div>
          </div>

          {pageSkills.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No skills found</h3>
              <p className="text-gray-500 text-sm mb-6">Try a different search or remove a filter.</p>
              <Link href="/skills" className="text-purple-300 hover:text-purple-200 text-sm">
                Clear all filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pageSkills.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-10 flex items-center justify-between border-t border-gray-800 pt-6 text-sm">
              {page > 1 ? (
                <Link href={href({ page: String(page - 1) })} className="text-gray-300 hover:text-white">
                  ← Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-gray-500">
                Page {page.toLocaleString("en-US")} of {totalPages.toLocaleString("en-US")}
              </span>
              {page < totalPages ? (
                <Link href={href({ page: String(page + 1) })} className="text-gray-300 hover:text-white">
                  Next →
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-sm mb-4">Can&#39;t find what you need?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://github.com/growsontrees/trustedskills-registry/issues/new?template=skill-request.md&title=Skill+Request:+&labels=skill-request"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-sm rounded-lg transition-colors"
              >
                Request a skill
              </a>
              <a
                href="/submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
              >
                Submit a skill
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
