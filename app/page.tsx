import type { Metadata } from "next";
import Link from "next/link";
import {
  getCategories,
  getTopRankedSkills,
  getStats,
  getTierCounts,
  getPinnedCount,
  TIER_CONFIG,
  TIER_ORDER,
  formatCount,
  formatDate,
} from "../lib/skills";
import { SkillCard } from "../components/SkillCard";
import { PlatformSelector } from "../components/PlatformSelector";
import { HeroInstallCommand } from "../components/HeroInstallCommand";
import { SearchBar } from "../components/SearchBar";
import {
  ArrowRight,
  Boxes,
  Search as SearchIcon,
  Sliders,
  Terminal,
  TrendingUp,
  categoryIcon,
} from "../components/icons";
import { ButtonLink, Eyebrow, Panel, SectionHeading, Stat, cx } from "../components/ui";
import { canonicalUrl } from "../lib/site-url";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/") },
};

export default function HomePage() {
  const featured = getTopRankedSkills(6);
  const categories = getCategories();
  const stats = getStats();
  const tierCounts = getTierCounts();
  const pinned = getPinnedCount();
  const syncedOn = formatDate(stats.last_updated);
  // Rounded down to the nearest thousand, so the placeholder never overstates.
  const searchHint = `${Math.floor(stats.total_skills / 1000).toLocaleString("en-GB")},000+`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://trustedskills.dev/#website",
        url: "https://trustedskills.dev",
        name: "TrustedSkills",
        description: "An index of AI agent skills",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: "https://trustedskills.dev/skills?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://trustedskills.dev/#organization",
        name: "TrustedSkills",
        url: "https://trustedskills.dev",
        logo: {
          "@type": "ImageObject",
          url: "https://trustedskills.dev/og-image.svg",
        },
        sameAs: [],
      },
    ],
  };

  return (
    <div>
      {/* ── Masthead ──────────────────────────────────────────────────────
          No gradient, no glow. The page opens on the size of the catalogue
          and a search field, because that is what the site is for. */}
      <section className="relative overflow-hidden border-b border-ink-800">
        <div className="bg-page-grid pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-page px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-22">
          <div className="max-w-3xl">
            {syncedOn ? (
              <Eyebrow className="mb-5 flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok-500" />
                Index last synced {syncedOn}
              </Eyebrow>
            ) : null}

            <h1 className="text-4xl font-semibold text-ink-50 sm:text-5xl">
              Every agent skill, in one place.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-400">
              {stats.total_skills.toLocaleString("en-GB")} skills indexed from across the
              ecosystem. Search for what you need, see who publishes it, and copy the install
              command for your platform.
            </p>

            <div className="mt-8 max-w-xl">
              {/* The bundled index is a fallback; CI builds against the full
                  registry, so the count is read rather than written in. */}
              <SearchBar
                size="lg"
                placeholder={`Search ${searchHint} skills…`}
              />
            </div>

            <div className="mt-4">
              <PlatformSelector />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="min-w-0 sm:w-[24rem]">
                <HeroInstallCommand />
              </div>
              <ButtonLink href="/skills" variant="primary" size="md">
                Browse the index
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>

          {/* The total is in the lead paragraph and the badge breakdown is in
              the next section, so this rail carries only what neither says. */}
          <div className="mt-14 grid max-w-3xl grid-cols-3 gap-x-8 border-t border-ink-800 pt-8">
            <Stat
              value={stats.total_authors.toLocaleString("en-GB")}
              label="publishers"
              hint="Distinct author accounts across the index"
            />
            <Stat value={categories.length.toLocaleString("en-GB")} label="categories" />
            <Stat
              value={formatCount(stats.total_installs) ?? "—"}
              label="installs, reported upstream"
              hint="Install counts come from the source registries, not from TrustedSkills. We pass them through unchanged rather than presenting them as our own."
            />
          </div>
        </div>
      </section>

      {/* ── What the badges mean ──────────────────────────────────────────
          The trust signal, stated as counts rather than as a claim. This
          section replaces the old "Cryptographically signed. Community
          reviewed." line, which described work nobody had done. */}
      <section className="mx-auto max-w-page px-4 py-section sm:px-6 lg:px-8">
        <SectionHeading
          title="What the badges mean"
          description="Every listing carries one. Here is exactly what each one is asserting — and what it isn't."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* A tier with nothing in it would assert a check we aren't yet
              running, so it stays off the homepage until it has listings. */}
          {TIER_ORDER.filter((tier) => tierCounts[tier] > 0).map((tier) => {
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;
            const count = tierCounts[tier];
            const tone =
              config.tone === "accent"
                ? "border-accent-800/60 text-accent-300"
                : config.tone === "ok"
                ? "border-ok-800/60 text-ok-300"
                : config.tone === "warn"
                ? "border-warn-800/60 text-warn-300"
                : "border-ink-750 text-ink-400";

            return (
              <Link
                key={tier}
                href={`/tier/${tier}/`}
                className={cx(
                  "group rounded-xl border bg-ink-900 p-gutter shadow-e1",
                  "transition duration-fast ease-out hover:-translate-y-px hover:bg-ink-850 hover:shadow-e3",
                  tone
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </span>
                  <span className="tabular text-sm text-ink-500">
                    {count.toLocaleString("en-GB")}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-450">{config.description}</p>
              </Link>
            );
          })}

          {/* The honest counterweight. It gets the same visual weight as a
              tier card so it can't be read as fine print. Figures are counted
              from the index so this can't drift as the scan coverage grows. */}
          <div className="rounded-xl border border-dashed border-ink-700 bg-ink-950 p-gutter">
            <p className="text-sm font-semibold text-ink-200">What we don&apos;t do</p>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-450">
              No person has read the code behind any listing here. The Checked badge is a static
              scan, not an audit — we never execute a skill.{" "}
              {pinned.toLocaleString("en-GB")} skills install from a stored snapshot; the rest
              resolve to whatever their repository holds today.{" "}
              <span className="text-ink-300">Read the source before you run it.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Top skills ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-page px-4 pb-section sm:px-6 lg:px-8">
        <SectionHeading
          icon={TrendingUp}
          title="Top skills"
          description="Ranked by install count, publisher and listing quality, capped at two per publisher."
          action={{ href: "/skills", label: "Browse all" }}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-page px-4 pb-section sm:px-6 lg:px-8">
        <SectionHeading icon={Boxes} title="Browse by category" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = categoryIcon(cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/skills/category/${cat.slug}/`}
                className="group flex items-center gap-3 rounded-lg border border-ink-750 bg-ink-900 px-3.5 py-3 shadow-e1 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-850"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-ink-450 transition-colors duration-fast group-hover:border-ink-700 group-hover:text-accent-400">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink-200 transition-colors group-hover:text-ink-50">
                    {cat.name}
                  </span>
                  <span className="tabular block text-2xs text-ink-500">
                    {cat.count.toLocaleString("en-GB")}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── How installing works ──────────────────────────────────────── */}
      <section className="border-y border-ink-800 bg-ink-950">
        <div className="mx-auto max-w-page px-4 py-section sm:px-6 lg:px-8">
          <SectionHeading
            title="Installing takes one command"
            description="Set your platform once and every snippet on the site follows it."
          />

          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                icon: SearchIcon,
                title: "Find it",
                body: "Search by name, publisher or tag, then narrow by category, platform or badge.",
              },
              {
                icon: Sliders,
                title: "Pick your platform",
                body: "Claude Code, Claude Desktop, Cursor, MCP or OpenClaw. The install snippet changes with it.",
              },
              {
                icon: Terminal,
                title: "Run the command",
                body: "Copy the command or the config block. Pinned skills install from a stored snapshot rather than the live repo.",
              },
            ].map((step, i) => (
              <Panel key={step.title} className="bg-ink-900">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-accent-400">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className="tabular text-2xs font-semibold text-ink-600">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-sm font-semibold text-ink-50">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-450">{step.body}</p>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-page px-4 py-section sm:px-6 lg:px-8">
        <Panel className="flex flex-col items-start justify-between gap-6 bg-ink-900 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold text-ink-50">Published a skill?</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-450">
              Add it to the index so it turns up when someone searches for what it does.
              Submissions go through the public registry repository.
            </p>
          </div>
          <ButtonLink href="/submit" variant="primary" size="md" className="shrink-0">
            Submit a skill
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </Panel>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
