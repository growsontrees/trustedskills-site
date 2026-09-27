# TrustedSkills — Task Tracker

*Last updated: 2026-09-27*
*Canonical location: `TASKS.md` in this repo. The old `/opt/trustedskills` path is dead — that host was retired in August.*

---

## ✅ Recently Completed

- [x] **Every public link points at a repo readers can open** (2026-09-27, ONE-124, not yet deployed) — six places sent readers to `growsontrees/trustedskills-registry`, which is **private**: the footer, the docs "Community discussions" link (to Discussions that don't exist), the `/skills` "Request a skill" button (`?template=skill-request.md`, a file that never existed either — a 404 twice over), the badges and safety-check docs pages, `/submit` step 6 ("open a pull request against the registry"), and the homepage claim that "submissions go through the public registry repository". All now point at `growsontrees/trustedskills-site` Issues — the repo this site already deploys from, public with Issues on. **The registry stays private** (it holds `sources.json` and the crawl tooling; CI reads it through a read-only deploy key). Three templates committed under `.github/ISSUE_TEMPLATE/`: `report-a-skill.md`, `request-a-skill.md`, `site-bug.md`, with matching labels. Every URL now comes from `lib/github-links.ts`, so a link and its template filename can't drift apart again. New `/contact` page collects the three, with no email address. The commitment is bounded and stays bounded: *"We read every report and can delist a skill from the index. We don't promise a response time."* Discussions deliberately left off — one channel. **Still needs Peter:** enable private vulnerability reporting on `trustedskills-site` (Settings → Security → Private vulnerability reporting).
- [x] **Review batch 2 site defects** (2026-09-27, ONE-120, not yet deployed) — internal links no longer end in `/` (`trailingSlash: false` made every pagination, nav, tier, platform and skill-card click a 308); the legacy `/category/*` title no longer doubles the site name; `npm run lint` works again (ESLint 9, flat `eslint.config.mjs`, 3 errors + 8 warnings left in the code — two are the React Compiler rule misreading the `categoryIcon()` lookup, one is the mount effect in `hooks/usePlatform.ts`); the safety scan caps gunzip output at 512 MB and treats overflow as too-large; `validate-editorial` warns when a collection pick no longer installs (6 SEO picks today); README rewritten, CLAUDE.md corrected.
- [x] **Automated "Checked" safety pass** (2026-09-27, ONE-99) — the tiers now assert something a reader can check. Every skill that resolves to a GitHub repository is pulled at a pinned commit and statically scanned: manifest parses, no credential-store reads, no network calls to undeclared hosts, no encoded payloads that get executed, no `curl … | sh` installers. Per-check results — not just a verdict — are stored in `data/safety-reports.json` and rendered on the skill page with the file, line and evidence behind every finding. Passing skills become the **Checked** tier, recomputed from the stored scan on every build so the label can be lost as well as gained. Runs daily and incrementally (`.github/workflows/safety-scan.yml`) against the registry's own index; ~4,450 repositories cover the whole catalogue at ~0.6 repos/s. The checks are pinned by `npm run check:safety` (34 tests) and the method is published at `/docs/advanced/automated-safety-checks/`. See "Checked safety pass" below.
- [x] **Design system + front-end rebuild** (2026-09-27, ONE-100) — the site had no design system: `tailwind.config.ts` extended two colours and every value on every page was a raw Tailwind default, which is why it read as generated. Now: an `ink` neutral scale, one `accent` azure for interaction, `ok`/`warn`/`risk` reserved for meaning, a type scale with paired line-height and optical tracking, a named spacing rhythm, radii and dark-tuned elevation. ~45 in-repo icons (`components/icons.tsx`, Lucide geometry, no new dependency) replace the emoji. Primitives in `components/ui.tsx` + `InstallBlock` + `ListingPage`; the eight category/tier/platform routes shared nothing and now share one frame. Purple gradient hero and blur-glow deleted — the homepage opens on the catalogue and a tier ledger of real counts. Inter and JetBrains Mono are now actually loaded (self-hosted, `next/font/local`); the CSS had named Inter without ever fetching it. Trust-claim fixes folded in — see section 2 below.
- [x] **Category browse actually works** (2026-09-27) — `other` cut from 44.9% to 10.7% by classifying on the description and `longDescription` the index already held, not the slug alone. See "Category taxonomy" below for the detail and for the description-generator feedback loop it fixed.
- [x] **Full registry live** (2026-09-27) — site went from 26,001 skills to the registry's full **44,854**. The sync had been failing silently since March; see below.
- [x] **Registry sync no longer fails silently** (2026-09-27) — the CI sync step warned and carried on when it couldn't reach the registry, so an expired token shipped a 42%-stale catalogue while every build reported success. On `main` the step is now fatal, and the shipped skill count is written to the job summary.
- [x] **Registry auth moved to a read-only deploy key** (2026-09-27) — `REGISTRY_SSH_KEY`, replacing the `REGISTRY_TOKEN` PAT that expired in March. Deploy keys don't expire and aren't tied to a personal account. The old `REGISTRY_TOKEN` secret is unused and can be deleted.
- [x] **`/tier/official` 404 fixed** (2026-09-27) — `VALID_TIERS` omitted `official` despite 3,276 skills carrying it.
- [x] **`/skills` served from the server** (2026-09-26) — filters, sorts and pages server-side; the browser no longer receives the whole index.
- [x] **Sitemap complete** (2026-08-07) — 50,262 URLs across 11 partitions, gated by `npm run check:discovery`.
- [x] **Migrated off Elestio to Coolify** (2026-08-07) — see project memory for the deployment topology.

- [x] **301 redirect www → non-www** (2026-03-18) — Cloudflare redirect rule + DNS CNAME fix
- [x] **GA4 setup** — property `G-JYQN09HXKB` (ID 527337380) installed and verified
- [x] **GSC setup** — service account verified
- [x] **Migration to Elestio ISR** — CF Pages retired, site runs on Elestio VPS (PM2 + nginx)
- [x] **CI/CD pipeline** — GitHub Actions: push to main → SSH → git pull → build → pm2 restart → CF cache purge
- [x] **Canonical tags** — present on pages
- [x] **OG image on homepage** — present
- [x] **Homepage title fixed** — no longer doubled
- [x] **Double H1 fixed** — single H1 per page
- [x] **robots.txt** — configured
- [x] **llms.txt** — live at `/llms.txt`
- [x] **Mobile hamburger menu** — added (commit `618ba45`)
- [x] **Bulk import** — 25,037 skills.sh skills via API sweep
- [x] **Install counts enriched** — from skills.sh API
- [x] **Weekly monitor** — GitHub Actions scraper runs every 6h
- [x] **Docs section** — 18 articles live
- [x] **Reviews section** — first review live (claude-seo-suite)
- [x] **Registry repo private** — moat protection
- [x] **Vercel projects removed** (2026-03-20) — disconnected `trustedskills-site` and `trustedskills-site-h77u` from Vercel; no more spurious failed deployment emails
- [x] **Official tier** (2026-03-20) — 1,149 skills from official orgs (Vercel, Microsoft, Anthropic, Stripe, etc.) marked 🏢 Official with ranking bonus
- [x] **Source links on skill pages** (2026-03-20) — "View on skills.sh →" link in About block and sidebar; author name links to skills.sh profile
- [x] **Fixed About This Skill block** (2026-03-20) — removed generic placeholder text; uses `longDescription` if present, falls back to `description`
- [x] **Composite ranking site-wide** (2026-03-20) — homepage, category, platform, tier pages all use scored ranking (installs + official bonus + tier bonus); no more weather/web-search on homepage
- [x] **14-category taxonomy** (2026-03-20) — reclassified 26k skills from `dev` monoculture into frontend/backend/cloud/ai-ml/agents/etc.
- [x] **Editorial pipeline — reviews + collections** (2026-09-27) — reviews moved from a 692-line hand-written TS/HTML blob to structured JSON under `content/reviews/`, rendered by a shared template; new `/collections` + `/collections/[slug]` routes with entries resolved live against the registry; `draft`/`published` approval gate (drafts never served or indexed in production); `evidenceBasis` distinguishes hands-on tests from source reviews; `npm run check:editorial` runs as `prebuild` and fails the deploy on invented or malformed content. See `docs/EDITORIAL.md`
- [x] **Reviews batch 3 — 12 documentation skills + a draft collection, hands-on** (2026-09-27, drafts, ONE-117) — one skill per documentation job (design doc → ADR → diagrams → code comments → API reference → user docs → onboarding → AGENTS.md → clarity edit → AI-pattern check → copy edit → docs audit), all `install_status: "ok"`, nine publishers. README and changelog skills were left out because batch 2 covered them. All 12 installed first time. Each ran on a real task in its own clone of this repo, and the main claims were checked by hand; five run claims were corrected. Verdicts: 9 Recommended, 2 Use With Caution, 1 Not Recommended. The weakest were copy-editing turning a badge sentence false and quality-documentation-manager being an ISO 13485 medical-device persona listed as a docs tool. Collection: `content/collections/software-documentation-skills.json`. Evidence in `trusted-skills\projects\reviews-batch-3\`. The runs also found stale facts in our own CLAUDE.md, /docs and /submit (follow-up issue). Publishing is Peter's call.
- [x] **Reviews batch 2 — 12 developer-workflow skills + a draft collection, hands-on** (2026-09-27, drafts) — one skill per stage (plan → worktree → TDD → browser test → debug → refactor → review → security review → dependency upgrade → commit → release notes → README), all `install_status: "ok"`, ten publishers. All 12 installed first time. Each ran on a real task in its own clone of this repo; results were checked by hand, and two run claims were corrected (a peer-dependency conflict wrongly blamed on an upgrade, and an unsupported line in a changelog draft). Collection: `content/collections/claude-code-dev-workflow-skills.json`. Evidence in `trusted-skills\projects\reviews-batch-2\`. The runs surfaced ONE-120: pagination links that 308, doubled category titles, a broken `npm run lint`, and no decompression cap in the safety scanner. Publishing is Peter's call.
- [x] **Reviews batch 1 — 12 SEO collection skills, hands-on** (2026-09-27, drafts) — all twelve run against trustedskills.dev on one day by a Claude Code subagent with no paid SEO data. 6 of 12 no longer install under their registry name (renamed, moved to a signpost repo, or deleted upstream); those outcomes are recorded as the result. Install evidence and full run logs live outside the repo in `trusted-skills\projects\reviews-batch-1\`. Publishing is Peter's call. The runs surfaced ONE-110 (dead install commands) and ONE-111 (site-wide canonical to homepage).
- [x] **Install commands that work, and a flag when they don't** (2026-09-27, ONE-110) — the index carried `npx skills add https://skills.sh/<owner>/<repo> --skill <name>`, which skills CLI 1.7.0 rejects for every skill, and skill pages/cards/hero generated `claude mcp add … @trustedskills/<slug>` and MCP configs for a npm scope that has never had a package. Fixed at the source: `scripts/check-installs.mjs` in `trustedskills-registry` (branch `one-110-install-commands`, runs in the nightly enrich workflow) writes the `owner/repo --skill name` form and checks every backing repo with a SKILL.md-only sparse git clone and the CLI's own discovery and frontmatter rules. Each skill gets `install_status` ok / renamed / invalid / missing / repo_gone. Of 44,854 registry skills: 34,001 ok, 729 install under their SKILL.md name, 9,461 do not install, 250 unchecked. Pages show the reason instead of a dead command; cards say "Doesn't install". Checked by installing 20 random skills with the shown command (20/20 agree with the check) plus 20 targeted ones. **Deploy order:** merge the registry branch first, then deploy the site. Follow-ups: ONE-112 (docs still show `@trustedskills` packages), ONE-113 (crawler keeps stale `skill_path`).
- [x] **Docs stop teaching `@trustedskills/*` npm installs** (2026-09-27, ONE-112, not yet deployed) — ~50 commands and MCP configs across `/docs` and 12 doc articles named packages in a npm scope that has never had one. `/docs` quick reference now shows only the skills CLI (`npx skills add <owner>/<repo> --skill <name>`, `-a <agent>`, `-g`, `npx skills list`) and explains that SKILL.md skills need no MCP config. Article examples use published servers: `@modelcontextprotocol/server-memory` (and `server-sequential-thinking`, `@brave/brave-search-mcp-server` where an env var or second server is the point). `claude mcp add … --project` (not a flag) became `--scope project`; "global" is `--scope user`. The architecture diagram keeps its weather server as a labelled made-up placeholder. Two claims that skill pages have an "MCP Config" tab are gone. Still wrong in the docs and left for a follow-up: Claude Code config paths (`settings.json` vs `~/.claude.json`/`.mcp.json`), unverified `openclaw skills install`, and first-person "From the field" anecdotes.
- [x] **Every page names itself as canonical** (2026-09-27, ONE-111, not yet deployed) — `app/layout.tsx` set `alternates.canonical` (and `og:url`) to the homepage, and every page without its own override inherited it, so ~26,000 skill pages, docs, reviews and `/submit` told Google they were the homepage. Paginated tier/platform listings pointed at `/…/page/N/`, which 308s to a 404. Root layout no longer sets either; each route sets its own via `canonicalUrl()` in `lib/site-url.ts`, in the sitemap's no-trailing-slash form. Legacy `/category/*` points at `/skills/category/*`; `/tier/x/1` points at `/tier/x`. Skill and doc JSON-LD URLs and the homepage `SearchAction` dropped their redirecting trailing slash. `npm run verify-deploy` now fails if the homepage, a skill page or `/skills?q=` stops naming itself (it fails against the current live site, as it should).
- [x] **Gemma 3 12B bulk description re-enrichment** (2026-03-22) — 10k+ weak descriptions refreshed in `data/skills-index.json`; site rebuilt, PM2 restarted, and Cloudflare cache purged

---

## 🔴 Broken / Needs Fix (High Priority)

### 1. Catalogue metadata is almost entirely missing
**Impact:** Nothing can be ranked or curated honestly. This is now the top blocker for the product.
Measured across all 44,854 skills: `updated_at` 0.4%, `license` 0.9%, `stars` 0.9%, `verifiedCommit` 0.3%.

Worse, the two signals that *are* populated are misleading:
- **`stars` are the host repo's stars.** All 69 skills bundled in `openclaw/openclaw` carry its 372,563. Ranking by stars today would fill the homepage with identical OpenClaw built-ins.
- **`installs` are scraped from skills.sh** and cluster implausibly (six `prime-skills` entries within 4,000 of each other around 402k). Median is 20.

**Fix:** tracked as ONE-97 (metadata crawl) and ONE-98 (Signal Score). Work happens in the registry repo, not here.

### 2. ~~Trust tiers are hollow — and the homepage over-claims~~ (copy fixed 2026-09-27, ONE-100)
**Was:** the homepage said *"Cryptographically signed. Community reviewed."* 127 skills have a pinned commit SHA and none have been reviewed by anyone. 41,324 are labelled `community` because that is the scraper's fallback value.

**Done:** `community` → **Listed**, and `verified` → **Pinned** (its old description, "manually reviewed by the TrustedSkills team", was false for all 7 skills in it). Tier keys are unchanged, so `/tier/<key>/` URLs still resolve. All badge copy now lives in `TIER_CONFIG` and is read by the homepage, filters, listings, skill pages and the submit page — no surface restates it.

Four further over-claims were found and removed in the same pass:
- **A hard-coded security audit table on every skill page** ("Gen Agent Trust Hub / Socket / Snyk: Pass" for all 26,001 listings, no scan having run). Replaced with a provenance panel that only states what the index holds.
- **A fabricated case study** in the `advanced/verification-badges` doc ("We rejected a skill submission during manual review…"). That whole article described formal audits, dependency audits, network audits, ongoing monitoring and volunteer peer review — none of which exist. Rewritten around what the badges actually assert, plus a self-vetting checklist.
- **Advice to override Windows Defender** because "Verified and Featured skills have been formally audited and are safe", in the Windows guide and in its FAQ structured data.
- **`undefined` rendered as data** — 25,651 of 26,001 skills carry no licence and 25,900 no valid date, but the sidebar printed the raw field. Facts now render through `formatLicense`/`formatDate`/`formatCount`, which return null so the row is omitted.

The homepage badge ledger counts each tier from the index and hides any with none, so it picked up ONE-99 landing (2,365 skills into **Checked**) with no copy change. Its counterweight card carries the limits that remain: no person has read any listing, and the Checked scan is static — a skill is never executed.

`/reviews` and `/collections` were swept last, once ONE-94 had committed its rewrite of them. Nothing is left on the old palette: `grep -rE "purple-|text-gray-[0-9]|bg-gray-[0-9]|border-gray-[0-9]" app components lib` returns nothing, and the only emoji remaining in UI code is inside the literal `SKILL.md` sample on `/submit`. That sweep also caught `ok-200` and `warn-200` being used by the Reviewed link and `SafetyPanel` while the semantic ramps stopped at 300 — Tailwind was emitting nothing for them. The ramps now run 950→200 like `accent`, and a check that every `ink`/`accent`/`ok`/`warn`/`risk` class in the source resolves against the config passes.

**Checked safety pass — done (2026-09-27, ONE-99).** The tier now has a scan behind it.

- **What it asserts.** Six checks per skill, at a pinned commit: `SKILL.md` parses and declares a name and description; every host it dials is known infrastructure or declared in its own frontmatter; no encoded payload gets decoded and executed; nothing reads SSH keys, cloud credentials, keychains, token stores, browser cookie stores or wallets; no `curl … | sh`; and the commit SHA is recorded. All six must pass.
- **Scope rules that make it honest.** Links in documentation are not network calls — counting them failed thousands of skills for linking to `react.dev`, so egress is only counted at call sites (code, endpoint-shaped config keys, and commands inside fenced blocks). Conversely `SKILL.md` *prose* is scanned for credential paths next to imperative verbs, because for an agent skill the instructions are the payload: a manifest that tells the agent to read `~/.ssh/id_rsa` and post it somewhere ships no code and must still fail.
- **Per-check results are stored, not just a verdict.** `data/safety-reports.json` holds every check's status, summary, the hosts contacted with what each one is, and up to three findings with file, line and the matching line of code. The skill page prints them, failures first, and links the commit.
- **Not preserved across syncs.** `apply-safety-tiers.mjs` recomputes the tier from the stored scan on every build, so a skill that stops passing loses Checked instead of keeping a badge it earned months ago. Curated tiers (`official`, `featured`, `verified`) are never overwritten, and those skills still show their check results.
- **Cost.** ~4,450 repositories cover the 44,854-skill catalogue because a skills.sh URL maps to one GitHub repo — one pinned tarball per repo, every skill inside it scanned. ~0.6 repos/s, incremental by head commit, so the daily run only pays for what moved. Repos too large to pull go through the tree API with a fixed per-repo raw-fetch allowance (an unbounded fallback burned 5,000 API requests in seven minutes).
- **First real run:** 2,825 checked, 451 flagged, 2,324 unscannable across 233 repositories. Top failure is undeclared egress (~11% of scanned skills) — mostly honest tools calling their own API without declaring it, which is fixable by the author in one frontmatter line.
- **Unscannable is published as unscannable.** Deleted or private repositories, and skills renamed or removed upstream after the registry indexed them, stay Listed with the reason shown. No skill gets a check result for a scan that did not run.
- **Files:** `scripts/safety-scan.mjs`, `scripts/lib/{safety-checks,github-source}.mjs`, `scripts/apply-safety-tiers.mjs`, `scripts/test-safety-checks.mjs` (34 tests, `npm run check:safety`), `lib/safety.ts`, `components/SafetyPanel.tsx`, `.github/workflows/safety-scan.yml`, `/docs/advanced/automated-safety-checks/`.
- **Still to do:** the report file needs its first full-catalogue pass (the scheduled job gets there in a few nightly runs, or `workflow_dispatch` with `force`). The human layers from the ONE-94 ladder — **Reviewed** (someone ran it and wrote up where it fails) and **Recommended** — are not built; they belong with the editorial pipeline, not here.

### 3. ~~Category taxonomy is degenerate~~ (fixed 2026-09-27) — platform half still open
**Category — done.** `other` went from 44.9% to 10.7% of the bundled index. The classifier read the slug only and gave up when no hand-written regex matched, while every skill in `other` had a description and a ~1,500-char `longDescription` sitting unused. It now weighs evidence across slug, tags, name, description and `longDescription` by term specificity and field reliability, keeps the old slug rules as one weighted input, and leaves a skill in `other` when nothing clears the evidence threshold. `sync-index.mjs` runs it on every registry sync, so the full 44,854 are reclassified at the next deploy.

It also broke a feedback loop worth knowing about: `enrich-descriptions.mjs` splices the *current* category's verb phrase into generated descriptions ("…as part of building frontend UIs and user experiences workflows"), so the classifier was reading its own previous guess back as evidence and wrong categories were self-confirming on every sync. Those phrases are stripped before classifying.

**Files:** `scripts/reclassify.mjs`, `scripts/lib/{category-lexicon,classify-category,legacy-slug-rules}.mjs`. Run `node scripts/eval-classifier.mjs` before changing the lexicon — it reports distribution, agreement with the old rules, per-skill evidence (`--explain <slug>`) and a threshold sweep.

**Platform — still broken, and blocked.** 98.6% of the bundled index is tagged `claudecode`. This is not a tagging bug: `platforms` comes from the registry and records *where the skill was found*, not what it is compatible with, and 25,649 of them came from skills.sh (a Claude Code directory). Deriving real compatibility needs each skill's actual contents (`SKILL.md` vs MCP manifest vs Cursor rule, plus `requires`), which is what the ONE-97 metadata crawl fetches. Tracked as **ONE-104**, blocked on ONE-97. Asserting broader platform support without that evidence would be inventing compatibility claims.

---

## ✅ Fixed (kept for context)

### ~~`/sitemap.xml` returns 404~~
**Impact:** SEO — Google can't discover pages efficiently.
**Root cause:** `next-sitemap` is configured with `outDir: './out'` (static export mode), but the site now runs ISR. The sitemap is generated into `./out/` at build time but ISR serves from `.next/`. The sitemap file is never served.
**Fix options:**
- Switch `next-sitemap` to server-side generation (remove `outDir`, use Next.js API route or `getServerSideSitemap`)
- Or generate the sitemap at build time and copy it into `public/`
- Must handle 26k+ URLs — likely needs sitemap index with multiple sitemap files
**Files:** `next-sitemap.config.js`, possibly new `app/sitemap.xml/route.ts`

### ~~`/api/index.json` returns 404~~ (fixed 2026-08-07 — llms.txt no longer advertises it)
**Impact:** `llms.txt` points to this endpoint. Developers/agents expecting a public API get nothing.
**Root cause:** API routes were disabled (moved to `app/_api_disabled/`). The endpoint was intentionally killed, but `llms.txt` still references it.
**Fix options:**
- Restore a read-only public API route that serves a subset of the index (e.g., slugs, names, descriptions — not the full enriched dataset)
- Or update `llms.txt` to remove the reference
- Consider what data should be public vs. private (the full `skills-index.json` is the moat)
**Files:** `app/_api_disabled/`, `public/llms.txt` or `app/llms.txt/route.ts`

### ~~`/skills` page title is doubled~~ (fixed — commit bbacd87)
**Current:** `Browse Agent Skills | TrustedSkills | TrustedSkills`
**Expected:** `Browse Agent Skills | TrustedSkills`
**Files:** Likely in `app/skills/page.tsx` or `app/skills/layout.tsx` metadata export

### ~~Platform filter chips are incomplete~~ (fixed 2026-09-26 — SkillsListClient removed, chips derive from the route allowlist)
**Current chips in `SkillsListClient.tsx` line 9:**
```ts
const PLATFORMS = ["openclaw", "mcp", "openai", "claude", "cursor", "huggingface"];
```
**Missing:** `claudecode`, `codex`, `opencode` — these exist in `hooks/usePlatform.ts` as `PlatformKey` but aren't in the filter UI.
**Also:** `huggingface` is in the filter list but NOT in `PlatformKey` type — mismatch.
**Fix:** Sync the filter chip list with the actual `PlatformKey` type. Decide whether HuggingFace belongs.
**Files:** `components/SkillsListClient.tsx` (line 9), `hooks/usePlatform.ts`, `lib/skills.ts` (`PLATFORM_CONFIG`)

---

## 🟡 UX Improvements (Medium Priority)

### 5. Expanded / richer skill cards
**Why:** Current cards show emoji, name, author, 2-line description, tier badge, platform chips, version, installs, and an install button. That's functional but not rich enough for users to decide without clicking through to every detail page.
**Desired additions:**
- Stronger summary / "why this skill is useful" snippet
- Key trust signals at a glance (last verified date, commit pinned indicator)
- Docs/repo quick links
- Clearer differentiation between high-quality curated skills and thin auto-imports
- Maybe a "quality score" or visual indicator
**Files:** `components/SkillCard.tsx`, possibly `lib/skills.ts` (new fields)
**Depends on:** Task #6 (enriched descriptions) — expanding cards without good data just highlights the gaps

### 6. Enrich descriptions for imported skills
**Why:** ~25k skills were bulk-imported from skills.sh. Many have placeholder or minimal descriptions. The directory's value depends on card quality, and thin descriptions make discovery useless.
**Approach:**
- Batch process: fetch README from upstream repos, extract a meaningful 2-3 sentence summary
- Could use LLM to generate summaries from READMEs
- Priority: enrich the most-installed / most-viewed skills first
- Store enriched descriptions in the registry, not the frontend
**Files:** `trustedskills-registry` repo (the data pipeline), `scripts/` for batch processing
**Scale:** ~25k skills, prioritize top 500-1000 first

### 7. Sort / ranking improvements
**Current state:** "Most Popular" sort exists in code, basic sort options available.
**Needed:**
- Default sort should surface genuinely useful skills, not just high-install-count imports
- "Popular" badge or visual indicator for top skills
- Better ranking that considers: installs, verification tier, description quality, recency
- Consider a composite "quality score"
**Files:** `components/SkillsListClient.tsx` (sort logic), possibly `lib/skills.ts`

### 8. JSON-LD schema improvements
**Current state:** Homepage has WebSite + Organization schema. Skill detail pages have SoftwareApplication schema. Reviews have Review schema. Docs have Article schema.
**Gaps:**
- Category pages, platform pages, tier pages — no JSON-LD
- Could add BreadcrumbList schema to all pages
- Could add CollectionPage schema to listing pages
- Skill detail JSON-LD could be richer (add offers, review aggregation)
**Files:** Various `page.tsx` files in `app/`

---

## 🟢 Features (Lower Priority / Longer Term)

### 9. Hash verification + "update available" UI
**Why:** Core to the "Trusted" promise. Currently skills are pointer-only (link to upstream repo). Commit-pinning exists in the schema (`verifiedCommit`, `verifiedAt`) but there's no user-facing verification flow.
**Needed:**
- Show "pinned to commit X" on skill detail pages (partially there)
- Show "update available" when upstream has newer commits
- "Re-verify" workflow — when upstream changes, badge drops to unverified
- Upstream change monitor (GitHub Actions job) — partially implemented
**Files:** `app/skills/[slug]/page.tsx`, registry pipeline, GitHub Actions workflows

### 10. Submission flow backend
**Why:** Growth — let authors submit their skills for review.
**Current:** No submission mechanism exists.
**Needed:**
- Submission form (or GitHub issue template)
- Review queue (manual or semi-automated)
- Auto-verification pipeline (fetch repo, check structure, pin commit)
**Complexity:** Medium-high

### 11. Author profile pages
**Why:** Builds trust, helps users find more skills by trusted authors.
**Needed:** `/author/[author]` route, aggregate skills by author, show author metadata.
**Files:** New route + page

### 12. Collections view improvements
**Why:** Schema supports `type: "collection"` but UI doesn't do much with it yet.
**Needed:** Better collection display for registry-native collections. Editorial
collections (hand-curated themed lists) now live at `/collections` — see
`docs/EDITORIAL.md`. This item is the remaining registry-side work.

### 13. Platform adapters
**Why:** Convert skills between platforms (OpenClaw ↔ MCP ↔ Claude etc.). Credit original author.
**Complexity:** High — each platform has different manifest formats.
**Status:** Deferred

### 14. SQLite/Postgres to replace skills-index.json
**Why:** At 26k+ skills, a single JSON file is getting unwieldy. Database would enable better search, filtering, and API.
**Status:** Deferred (JSON works for now with ISR caching)

### 15. API keys + rate limits
**Why:** Future monetization, protect public API from abuse.
**Depends on:** Task #2 (restore API) and Task #14 (database)

### 16. OpenAI platform adapter
**Why:** Needs GPT Actions rewrite + author buy-in. Complex.
**Status:** Deferred

---

## 📋 SEO / Technical Debt

- [ ] Fix duplicate `<title>` on `/skills` page (Task #3)
- [ ] Add `<link rel="canonical">` audit — verify all pages have correct canonicals
- [ ] Structured data testing — run Google Rich Results Test on key pages
- [ ] Core Web Vitals audit — check LCP, CLS, FID on key pages
- [ ] Image optimization — ensure OG images are properly sized, consider WebP
- [ ] Internal linking improvements — cross-link between related skills, categories, docs
- [ ] 404 page — custom styled 404 instead of Next.js default

---

## 🏗️ Infrastructure

- **Hosting:** Elestio VPS (`152.53.202.175`), PM2 on port 3001, nginx proxy
- **CDN:** Cloudflare (orange cloud proxied)
- **DNS:** `trustedskills.dev` → A record → `152.53.202.175`; `www` → CNAME → `trustedskills.dev` (with 301 redirect rule)
- **Registry:** `growsontrees/trustedskills-registry` (private GitHub repo)
- **Frontend:** `growsontrees/trustedskills-site` (GitHub repo)
- **CI/CD:** GitHub Actions — push to main auto-deploys
- **Monitor:** GitHub Actions scraper every 6h (search API sweep)
