# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local dev server
npm run build        # Production build (runs next-sitemap postbuild)
npm run lint         # ESLint via Next.js
npm run fetch-index  # Pull latest skills-index.json from GitHub registry
```

> **Note:** `next.config.mjs` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true` for TypeScript and ESLint — build errors won't block the pipeline, but they should still be fixed.

## Architecture

### Data flow

All skill data originates from an external GitHub registry (`growsontrees/trustedskills-registry`) and is stored locally at `data/skills-index.json`. This file is the single source of truth bundled into the Next.js app at build time — there is no runtime database or API.

- `scripts/fetch-index.mjs` — fetches the latest registry; falls back to the bundled file if GitHub is unreachable.
- `lib/skills.ts` — imports `data/skills-index.json` directly and exports typed accessors (`getAllSkills`, `getSkillBySlug`, `getFeaturedSkills`, etc.) and the `Skill`, `Category`, and `SkillsIndex` types.

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

Skill detail pages use `revalidate = 86400` (24h ISR) with `dynamicParams = true` to allow on-demand rendering for slugs outside the top 5000. Related skills are intentionally disabled (`related = []`) to avoid ISR body-too-large errors.

### Platform system

`hooks/usePlatform.ts` manages cross-component platform state via:
- `localStorage` key `ts-platform-pref`
- Custom DOM event `ts-platform-change` for same-page sync between mounted components

`getPlatformInstall()` in the same file generates per-platform install commands (bash or JSON config) for: `openclaw`, `mcp`, `claude`, `claudecode`, `openai`, `cursor`, `codex`, `opencode`, `other`.

### Verification tiers

Skills have a `verified` field with four tiers defined in `lib/skills.ts`: `unverified → community → verified → featured`. `TIER_CONFIG` maps each tier to display metadata (label, icon, Tailwind classes).

### Disabled API routes

`app/_api_disabled/` contains route handlers that are intentionally not active (prefixed with `_`). Do not restore these without understanding why they were disabled.

### Styling

Tailwind CSS (dark theme, `bg-gray-950` base). No `@/` path aliases in source imports — all imports use relative paths (e.g., `../lib/skills`, `../../components/SkillCard`).
