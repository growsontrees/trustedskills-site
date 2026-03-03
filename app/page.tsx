import Link from "next/link";
import { getAllSkills, getCategories, getFeaturedSkills, getStats, TIER_CONFIG } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { SearchBar } from "@/components/SearchBar";
import { PlatformChips } from "@/components/PlatformChips";

export default function HomePage() {
  const skills = getAllSkills();
  const featured = getFeaturedSkills();
  const categories = getCategories();
  const stats = getStats();
  const recent = [...skills].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-gray-950 to-blue-950/30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono bg-purple-900/30 border border-purple-800/50 text-purple-300 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Now in Beta — 12 skills available
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">The marketplace for </span>
              <span className="text-gradient-primary">AI agent skills</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Discover, install, and share verified skills for OpenClaw AI agents.
              Trusted by the community — secured with cryptographic verification.
            </p>

            {/* Install command */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 rounded-xl px-5 py-3 font-mono text-sm w-full sm:w-auto">
                <span className="text-gray-500 select-none">$</span>
                <span className="text-emerald-400">openclaw skills install</span>
                <span className="text-gray-300">weather</span>
              </div>
              <Link
                href="/skills"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Browse all skills →
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total_skills}</div>
                <div className="text-gray-500">skills</div>
              </div>
              <div className="w-px h-8 bg-gray-800 hidden sm:block" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {(stats.total_installs / 1000).toFixed(1)}k
                </div>
                <div className="text-gray-500">installs</div>
              </div>
              <div className="w-px h-8 bg-gray-800 hidden sm:block" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total_authors}</div>
                <div className="text-gray-500">authors</div>
              </div>
              <div className="w-px h-8 bg-gray-800 hidden sm:block" />
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-gray-500">platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
        <div className="mt-4">
          <PlatformChips />
        </div>
      </section>

      {/* Trust badges info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap gap-3">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => (
            <div
              key={tier}
              className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${config.bg} ${config.border} ${config.color}`}
            >
              <span>{config.icon}</span>
              <span className="font-medium">{config.label}</span>
              <span className="text-gray-500 hidden sm:inline">— {config.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>⭐</span> Featured Skills
          </h2>
          <Link href="/skills" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl font-semibold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/skills?category=${cat.slug}`}
              className="flex items-center gap-3 p-4 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl transition-all group"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <div className="font-medium text-gray-200 group-hover:text-white text-sm transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-gray-500">{cat.count} skill{cat.count !== 1 ? "s" : ""}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Updated */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <span>🕐</span> Recently Updated
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recent.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} compact />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Install any skill in seconds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                icon: "🔍",
                title: "Browse",
                desc: "Find the skill you need using search, categories, or platform filters.",
              },
              {
                step: "2",
                icon: "📋",
                title: "Copy Command",
                desc: "Click the install button to copy the one-line install command to your clipboard.",
              },
              {
                step: "3",
                icon: "✅",
                title: "Install",
                desc: "Paste and run in your terminal. The skill is ready to use instantly.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-900/50 border border-purple-800 flex items-center justify-center text-xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Step {item.step}: {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/30 via-gray-950 to-blue-950/30 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Built a skill? Share it.</h2>
          <p className="text-gray-400 mb-8">
            The TrustedSkills marketplace grows with community contributions.
            Submit your skill and reach thousands of OpenClaw users.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-medium px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Submit a Skill →
          </Link>
        </div>
      </section>
    </div>
  );
}
