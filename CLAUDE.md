# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Task Tracker

**Read `TASKS.md` in the repo root before starting work.** It contains the current prioritized task list with context, root cause analysis, affected files, and dependencies. When you complete a task, update TASKS.md to mark it done with the date.

## WLDM canary test: 52 frozen pages

From 2026-09-30 until Peter says it is over (planned about 25 Nov 2026), a Cloudflare Worker (`trustedskills-canary`) reads 52 pages as they pass and compares two groups. A change to any of them can break the 8-week test. Full rules: Paperclip task ONE-139. If you are not sure, ask Peter on ONE-139 before you ship.

**Frozen pages.** `/collections/seo-skills-worth-installing`, `/reviews/claude-seo`, and `/skills/<slug>` for:
- Fixed group: coreyhaines31-seo-audit, audit-website, technical-seo-checker, core-web-vitals, on-page-seo-auditor, seo-meta, schema-markup, find-keywords, target-serp, backlink-analyzer, ai-seo, analytics-tracking, claude-seo, web-scraping, data-quality-frameworks, polars, exploratory-data-analysis, duckdb, database-schema-designer, sql-optimization, xlsx, data-visualization, developing-with-streamlit, data-storytelling, github-actions-templates, n8n-workflow-patterns
- Control group: planner, using-git-worktrees, test-driven-development, webapp-testing, systematic-debugging, refactor, code-review-expert, differential-review, dependency-upgrade, commit-work, changelog-generator, create-readme, doc-coauthoring, create-architectural-decision-record, mermaid-diagrams, jsdoc-typescript-docs, api-documentation-generator, documentation-writer, developer-onboarding, create-agentsmd, obra-writing-clearly-and-concisely, humanizer, copy-editing, quality-documentation-manager

Do not change what these pages show, their links, URL or redirects. The normal registry refresh (stars, installs, tier, dates) is fine.

**OK without asking:** publish reviews of skills not in the list; update live reviews except `claude-seo`; write `status: draft` reviews for any skill; change home, `/reviews`, `/collections`, `/docs`, `/submit` and every other skill page.

**Needs Peter's written go on ONE-139:**
1. Publishing a review of any listed skill (a live review changes its skill page). The 12 SEO reviews stay `draft`.
2. Any change to `content/collections/seo-skills-worth-installing.json`, including the ONE-137 swap.
3. Publishing the draft collections `data-and-automation-skills`, `claude-code-dev-workflow-skills`, `software-documentation-skills`.
4. Any change to `content/reviews/claude-seo.json`.
5. ONE-128 phase C (`PUBLISHER_DESCRIPTIONS_ONLY`), or anything else that changes which `description` the listed skills carry. Registry PR #160 stays unmerged until the test ends (Peter, 2026-10-01).
6. Changes to `app/skills/[slug]/`, `app/reviews/[slug]/`, `app/collections/[slug]/`, or shared parts they render inside `<main>`. The Worker reads `main h1`, `main h2`, `main aside` (`dl`, `dt`, `dd`, `time`, `p`), the install panel `<pre>` and selected tab, links in `<main>`, `meta name="description"` and the JSON-LD block.
7. Anything under `/id/` or `/id/` in a sitemap; `robots.txt` rules for AI bots; `ETag`, `Last-Modified` or cache headers on these pages.
8. The Worker, its 54 routes, the D1 database `trustedskills-canary-log`, or the Cloudflare bot settings.

Auto-unlisting (`isUnlisted()`) skips the 50 frozen slugs in `lib/canary-frozen-slugs.json`. Empty that list when the test ends.

## Commands

```bash
npm run dev          # Start local dev server
npm run build        # Production build (runs next-sitemap postbuild)
npm run lint         # ESLint 9 CLI, flat config in eslint.config.mjs
npm run fetch-index  # Pull latest skills-index.json from GitHub registry
```

> **Note:** `next.config.mjs` has `typescript.ignoreBuildErrors: true`, so type errors won't block the build. Next 16 no longer lints during `next build`, so run `npm run lint` yourself.

## Architecture

### Data flow

All skill data originates from an external GitHub registry (`growsontrees/trustedskills-registry`) and is stored locally at `data/skills-index.json`. This file is the single source of truth. The server reads it from disk on first use (it is not bundled) — there is no runtime database or API.

- `scripts/fetch-index.mjs` — fetches the latest registry; falls back to the bundled file if GitHub is unreachable.
- `lib/skills.ts` — reads `data/skills-index.json` from disk (server-only) and exports typed accessors (`getAllSkills`, `getSkillBySlug`, `getFeaturedSkills`, etc.) and the `Skill`, `Category`, and `SkillsIndex` types.

### Routing

Uses Next.js App Router with ISR. Key routes:

| Route | Purpose |
|---|---|
| `/` | Homepage (featured skills, categories, stats) |
| `/skills` | Paginated skill browser with client-side search |
| `/skills/[slug]` | Skill detail page (ISR, top 5000 pre-rendered) |
| `/skills/category/[category]/[page]` | Category-filtered listing |
| `/tier/[tier]/[page]` | Filter by verification tier |
| `/platform/[platform]/[page]` | Filter by platform |
| `/reviews` / `/reviews/[slug]` | Hardcoded editorial reviews (`lib/reviews-content.ts`) |
| `/docs` / `/docs/[...slug]` | Documentation pages (`lib/docs-content.ts`) |

Skill detail pages use `revalidate = 86400` (24h ISR) with `dynamicParams = true` to allow on-demand rendering for slugs outside the top 1000 by installs (`generateStaticParams`; cut from 5000 because the enriched long descriptions made each page about 3x larger). The page does not render related skills; they were dropped to avoid ISR body-too-large errors.

### Platform system

`hooks/usePlatform.ts` manages cross-component platform state via:
- `localStorage` key `ts-platform-pref`
- Custom DOM event `ts-platform-change` for same-page sync between mounted components

`getPlatformInstall()` in `lib/platform-install.ts` generates per-platform install commands (bash or JSON config) for: `openclaw`, `mcp`, `claude`, `claudecode`, `openai`, `cursor`, `codex`, `opencode`, `other`.

### Verification tiers

Skills have a `verified` field with six tiers defined in `lib/skill-config.ts` (`VerificationTier`). `TIER_ORDER` lists them strongest first: `official → featured → verified → checked → community → unverified`. `TIER_CONFIG` maps each tier to display metadata (label, icon, Tailwind classes); a missing or unknown value falls back to `community` in `tierOf()`.

### Disabled API routes

`app/_api_disabled/` contains route handlers that are intentionally not active (prefixed with `_`). Do not restore these without understanding why they were disabled.

### Styling

Tailwind CSS (dark theme, `bg-gray-950` base). No `@/` path aliases in source imports — all imports use relative paths (e.g., `../lib/skills`, `../../components/SkillCard`).
