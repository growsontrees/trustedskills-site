# TrustedSkills

An index of AI agent skills. Search the catalogue, see who publishes each skill, and get the install command for your platform — OpenClaw, MCP, Claude, OpenAI, Cursor or VS Code.

TrustedSkills is a [Next.js](https://nextjs.org) 16 site (App Router) built around a single static data file: a skills index synced from an external GitHub registry. There is no database and no runtime API — every page reads `data/skills-index.json` directly.

## Features

- Browse and search a catalogue of tens of thousands of agent skills, paginated and filterable by category, platform, and verification tier
- Per-skill detail pages, incrementally rendered (ISR) so the top skills are pre-built and the long tail renders on demand
- Per-platform install commands (`openclaw`, `mcp`, `claude`, `claudecode`, `openai`, `cursor`, `codex`, `opencode`, and more), remembered across the site via `localStorage`
- Editorial content: hands-on reviews and curated collections, validated at build time so a review can't claim a hands-on run that didn't happen
- An automated "Checked" safety pass over the catalogue, recorded in `data/safety-reports.json`

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

> [!NOTE]
> `.npmrc` sets `legacy-peer-deps=true`, so a plain `npm install` is enough even though some peer dependency ranges wouldn't otherwise resolve.

### Refreshing the skills data

The bundled `data/skills-index.json` is a snapshot. To pull the latest registry data before building locally:

```bash
npm run fetch-index
```

This fetches the index from the `growsontrees/trustedskills-registry` GitHub repo and overwrites the local file, falling back to the existing one if the registry is unreachable.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server |
| `npm run build` | Production build (runs `scripts/validate-editorial.mjs` first, `next-sitemap` and `scripts/write-build-meta.mjs` after) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint over `app`, `components`, `hooks`, `lib` and `scripts` (flat config in `eslint.config.mjs`) |
| `npm run fetch-index` | Pull the latest `skills-index.json` from the registry |
| `npm run sync-index` | Merge the latest registry data into the local index without losing the site's own enrichment (descriptions, tiers, categories) |
| `npm run verify-deploy` | Smoke-test a deployed instance (checks `TRUSTEDSKILLS_BASE_URL`, defaults to `https://trustedskills.dev`) |
| `npm run check:discovery` | Fail the build if pages that should be discoverable (sitemap, routes) have silently dropped. Run it after `npm run build`: it reads the sitemaps the build writes, and the committed copies are stale |
| `npm run check:editorial` | Validate reviews and collections before a build |
| `npm run check:safety` | Unit tests for the safety pass and the scanner's tarball limits |
| `npm run safety:scan` | Run the automated safety pass over the catalogue |
| `npm run safety:apply` | Turn safety-scan results into the `checked` verification tier |

> [!IMPORTANT]
> `next.config.mjs` sets `typescript.ignoreBuildErrors: true`, so a broken build won't fail `npm run build` on type errors alone — run `tsc` or `npm run lint` deliberately.

## Project structure

```
app/            Next.js App Router routes (skills, categories, platform/tier filters, docs, reviews, collections)
components/     Shared React components (cards, install command UI, pagination, search)
lib/            Typed data accessors over the skills index, plus reviews, collections and safety helpers
hooks/          Client hooks (e.g. platform preference)
data/           skills-index.json (registry snapshot) and safety-reports.json
content/        Editorial source for reviews and collections
scripts/        Build-time and maintenance scripts (see Available scripts)
docs/           Editorial guidelines and past audits
```

## Deployment

The production image is built in CI, not on the target host: pre-rendering the catalogue needs more CPU and memory than the deploy target has to spare.

```bash
docker build -t trustedskills .
docker run -p 3000:3000 trustedskills
```

The image runs Node 22 (Alpine), listens on port 3000, and reads the skills index from disk at runtime rather than bundling it into the build.

GitHub Actions (`.github/workflows/deploy.yml`) builds and pushes the image on every push to `main`, and once daily on a schedule so registry updates reach the site without a code push. On `main`, a failed registry sync fails the deploy rather than shipping a stale catalogue.

## Configuration

| Variable | Purpose |
|---|---|
| `EDITORIAL_DRAFTS=1` | Show draft reviews/collections outside production |
| `TRUSTEDSKILLS_BASE_URL` | Base URL used by `verify-deploy` (defaults to `https://trustedskills.dev`) |
| `GITHUB_TOKEN` / `GH_TOKEN` | Required in practice for `npm run safety:scan` — unauthenticated GitHub allows only 60 requests/hour, not enough to scan the catalogue. Optional for `fetch-index` (raises its rate limit). |

## Documentation

- `docs/EDITORIAL.md` — rules for reviews and collections
- `TASKS.md` — current prioritized task list
