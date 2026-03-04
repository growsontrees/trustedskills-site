import Link from "next/link";
import { getAllSkills, getCategories, getFeaturedSkills, getStats, TIER_CONFIG } from "@/lib/skills";
import { SkillCard } from "@/components/SkillCard";
import { PlatformSelector } from "@/components/PlatformSelector";
import { HeroInstallCommand } from "@/components/HeroInstallCommand";
import { SearchBar } from "@/components/SearchBar";

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
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">The trusted registry for </span>
              <span className="text-gradient-primary">AI agent skills</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Find, verify, and install skills for any AI agent platform.
              Cryptographically signed. Community reviewed.
            </p>

            {/* Search box */}
            <div className="w-full max-w-2xl mx-auto mb-8">
              <SearchBar placeholder="Search skills..." />
            </div>

            {/* Platform selector */}
            <div className="mb-8">
              <PlatformSelector />
            </div>

            {/* Dynamic install command + CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <HeroInstallCommand />
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
                <div className="text-2xl font-bold text-white">5+</div>
                <div className="text-gray-500">platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust tier badges — centered, clickable, filter skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {Object.entries(TIER_CONFIG).map(([tier, config]) => (
            <Link
              key={tier}
              href={`/skills?tier=${tier}`}
              title={config.description}
              className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${config.bg} ${config.border} ${config.color} hover:opacity-80 transition-opacity cursor-pointer`}
            >
              <span>{config.icon}</span>
              <span className="font-medium">{config.label}</span>
            </Link>
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
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            Install any skill in seconds
          </h2>
          <p className="text-center text-gray-500 text-sm mb-12 max-w-lg mx-auto">
            Works the same way regardless of which AI platform you use.
            Pick your platform above to see the exact command.
          </p>
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
                title: "Select your platform",
                desc: "Pick OpenClaw, Claude Desktop, Cursor, OpenAI, or MCP — we show the right install command automatically.",
              },
              {
                step: "3",
                icon: "✅",
                title: "Install",
                desc: "Copy and run (or paste into your config). The skill is ready to use instantly.",
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
            The TrustedSkills registry grows with community contributions.
            Submit your skill and reach developers across the entire AI agent ecosystem.
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
