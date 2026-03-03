"use client";

import { useState, useMemo } from "react";
import { Skill, Category, TIER_CONFIG, PLATFORM_CONFIG } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";

const PLATFORMS = ["openclaw", "mcp", "openai", "claude", "huggingface"];
const TIERS = ["featured", "verified", "community", "unverified"] as const;

interface SkillsListClientProps {
  skills: Skill[];
  categories: Category[];
}

export function SkillsListClient({ skills, categories }: SkillsListClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [activeTier, setActiveTier] = useState<string>("all");
  const [sort, setSort] = useState<"installs" | "updated" | "name">("installs");

  const filtered = useMemo(() => {
    let result = [...skills];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.author.toLowerCase().includes(q)
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
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter skills..."
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
                  onClick={() => setActiveCategory(cat.slug)}
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

          {/* Platform */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
              Platform
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActivePlatform("all")}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                  activePlatform === "all"
                    ? "bg-purple-900/50 text-purple-200 border-purple-700"
                    : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                }`}
              >
                All
              </button>
              {PLATFORMS.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                return (
                  <button
                    key={platform}
                    onClick={() => setActivePlatform(platform)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      activePlatform === platform
                        ? `${config.bg} ${config.color} border-current`
                        : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
              Verification
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTier("all")}
                className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  activeTier === "all"
                    ? "bg-purple-900/50 text-purple-200"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                All tiers
              </button>
              {TIERS.map((tier) => {
                const config = TIER_CONFIG[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => setActiveTier(tier)}
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
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((skill) => (
              <SkillCard key={skill.slug} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
