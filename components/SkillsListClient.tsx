"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skill, Category, TIER_CONFIG, PLATFORM_CONFIG } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { usePlatform, PlatformKey } from "@/hooks/usePlatform";

const PLATFORMS = ["openclaw", "mcp", "openai", "claude", "cursor", "huggingface"];
const TIERS = ["featured", "verified", "community", "unverified"] as const;

interface SkillsListClientProps {
  skills: Skill[];
  categories: Category[];
  initialQuery?: string;
  initialTier?: string;
  initialCategory?: string;
}

export function SkillsListClient({
  skills,
  categories,
  initialQuery = "",
  initialTier = "all",
  initialCategory = "all",
}: SkillsListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? initialQuery);
  const [activeCategory, setActiveCategory] = useState<string>(() => searchParams.get("category") ?? initialCategory);
  const [activePlatform, setActivePlatform] = useState<string>(() => searchParams.get("platform") ?? "all");
  const [activeTier, setActiveTier] = useState<string>(() => searchParams.get("tier") ?? initialTier);
  const [sort, setSort] = useState<"installs" | "updated" | "name">("installs");

  // Sync platform preference: when the user picks a platform in the selector,
  // pre-fill the filter here (but only once on mount, then user can override).
  const { setPlatform } = usePlatform();

  /** Navigate to pretty URL or update query params for search */
  const syncUrl = useCallback(
    (overrides: { q?: string; tier?: string; category?: string; platform?: string }) => {
      const q = overrides.q !== undefined ? overrides.q : query;
      const tier = overrides.tier !== undefined ? overrides.tier : activeTier;
      const category = overrides.category !== undefined ? overrides.category : activeCategory;
      const platform = overrides.platform !== undefined ? overrides.platform : activePlatform;

      // If only one filter is active (no search query), navigate to pretty URL
      if (!q) {
        // Tier-only filter → /tier/[tier]/
        if (tier && tier !== "all" && category === "all" && platform === "all") {
          router.replace(`/tier/${tier}/`, { scroll: false });
          return;
        }
        // Category-only filter → /category/[category]/
        if (category && category !== "all" && tier === "all" && platform === "all") {
          router.replace(`/category/${category}/`, { scroll: false });
          return;
        }
        // Platform-only filter → /platform/[platform]/
        if (platform && platform !== "all" && tier === "all" && category === "all") {
          router.replace(`/platform/${platform}/`, { scroll: false });
          return;
        }
      }

      // Multiple filters or search query → use query params
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (tier && tier !== "all") params.set("tier", tier);
      if (category && category !== "all") params.set("category", category);
      if (platform && platform !== "all") params.set("platform", platform);
      const qs = params.toString();
      router.replace(qs ? `/skills?${qs}` : "/skills", { scroll: false });
    },
    [router, query, activeTier, activeCategory, activePlatform]
  );

  function handlePlatformFilter(platform: string) {
    setActivePlatform(platform);
    // Update the global platform preference so install commands sync too
    if (platform !== "all") {
      setPlatform(platform as PlatformKey);
    }
    syncUrl({ platform });
  }

  function handleTierFilter(tier: string) {
    setActiveTier(tier);
    syncUrl({ tier });
  }

  function handleCategoryFilter(category: string) {
    setActiveCategory(category);
    syncUrl({ category });
  }

  function handleQueryChange(q: string) {
    setQuery(q);
    syncUrl({ q });
  }

  const filtered = useMemo(() => {
    let result = [...skills];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.tags && s.tags.some((t) => t.toLowerCase().includes(q))) ||
          (s.platforms && s.platforms.some((p) => p.toLowerCase().includes(q)))
      );
    }

    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }

    if (activePlatform !== "all") {
      result = result.filter((s) => s.platforms.includes(activePlatform));
    }

    if (activeTier !== "all") {
      result = result.filter((s) => s.verified === activeTier);
    }

    result.sort((a, b) => {
      if (sort === "installs") return b.installs - a.installs;
      if (sort === "updated")
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [skills, query, activeCategory, activePlatform, activeTier, sort]);

  return (
    <div>
      {/* ─── Platform filter — FIRST, most prominent ─── */}
      <div className="mb-8 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-semibold text-gray-300 mr-1">🌐 Platform:</span>
          <button
            onClick={() => handlePlatformFilter("all")}
            className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${
              activePlatform === "all"
                ? "bg-purple-900/50 text-purple-200 border-purple-700"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
            }`}
          >
            All platforms
          </button>
          {PLATFORMS.map((platform) => {
            const config = PLATFORM_CONFIG[platform];
            if (!config) return null;
            return (
              <button
                key={platform}
                onClick={() => handlePlatformFilter(platform)}
                className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${
                  activePlatform === platform
                    ? `${config.bg} ${config.color} border-current`
                    : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200"
                }`}
              >
                {config.label}
              </button>
            );
          })}
        </div>
        {activePlatform !== "all" && (
          <p className="text-xs text-gray-500 mt-2 pl-1">
            Showing skills compatible with <span className="text-gray-300">{PLATFORM_CONFIG[activePlatform]?.label ?? activePlatform}</span>
            {" · "}
            Install commands on skill cards will match your selection
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Search
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search skills..."
                  className="w-full bg-gray-900 border border-gray-700 focus:border-purple-600 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="space-y-1">
                {[{ slug: "all", name: "All", emoji: "🔍", count: skills.length }, ...categories].map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryFilter(cat.slug)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeCategory === cat.slug
                        ? "bg-purple-900/50 text-purple-200 border border-purple-800"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    <span className="text-base">{cat.emoji}</span>
                    <span className="flex-1">{cat.name}</span>
                    <span className="text-xs text-gray-600">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                Verification
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => handleTierFilter("all")}
                  className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    activeTier === "all"
                      ? "bg-purple-900/50 text-purple-200"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  }`}
                >
                  All tiers
                </button>
                {TIERS.map((tier) => {
                  const config = TIER_CONFIG[tier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG['unverified'];
                  return (
                    <button
                      key={tier}
                      onClick={() => handleTierFilter(tier)}
                      className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeTier === tier
                          ? `${config.bg} ${config.color}`
                          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                      }`}
                    >
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {filtered.length === skills.length
                ? `${skills.length} skills`
                : `${filtered.length} of ${skills.length} skills`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-sm bg-gray-900 border border-gray-700 text-gray-300 rounded-lg px-3 py-1.5 outline-none focus:border-purple-600 transition-colors"
            >
              <option value="installs">Most Popular</option>
              <option value="updated">Recently Updated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No skills found</h3>
              <p className="text-gray-500 text-sm mb-6">
                Try adjusting your search or filters.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://github.com/growsontrees/trustedskills-registry/issues/new?template=skill-request.md&title=Skill+Request:+&labels=skill-request"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-sm rounded-lg transition-colors"
                >
                  💡 Request a skill
                </a>
                <a
                  href="/submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  📦 Submit a skill
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((skill) => (
                <SkillCard key={skill.slug} skill={skill} />
              ))}
            </div>
          )}

          {/* Can't find CTA — always shown below results */}
          {filtered.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800 text-center">
              <p className="text-gray-500 text-sm mb-4">
                Can&#39;t find what you need?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://github.com/growsontrees/trustedskills-registry/issues/new?template=skill-request.md&title=Skill+Request:+&labels=skill-request"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700 text-purple-300 text-sm rounded-lg transition-colors"
                >
                  💡 Request a skill
                </a>
                <a
                  href="/submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm rounded-lg transition-colors"
                >
                  📦 Submit a skill
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
