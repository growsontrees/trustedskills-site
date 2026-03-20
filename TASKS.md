# TrustedSkills — Task Tracker

*Last updated: 2026-03-20*
*Canonical location: `/opt/trustedskills/TASKS.md` (in the site repo)*
*Also tracked at: `/opt/app/openclaw/workspace/projects/personal/skills-marketplace-project/TASKS.md` (Macros' copy)*

---

## ✅ Recently Completed

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

---

## 🔴 Broken / Needs Fix (High Priority)

### 1. `/sitemap.xml` returns 404
**Impact:** SEO — Google can't discover pages efficiently.
**Root cause:** `next-sitemap` is configured with `outDir: './out'` (static export mode), but the site now runs ISR. The sitemap is generated into `./out/` at build time but ISR serves from `.next/`. The sitemap file is never served.
**Fix options:**
- Switch `next-sitemap` to server-side generation (remove `outDir`, use Next.js API route or `getServerSideSitemap`)
- Or generate the sitemap at build time and copy it into `public/`
- Must handle 26k+ URLs — likely needs sitemap index with multiple sitemap files
**Files:** `next-sitemap.config.js`, possibly new `app/sitemap.xml/route.ts`

### 2. `/api/index.json` returns 404
**Impact:** `llms.txt` points to this endpoint. Developers/agents expecting a public API get nothing.
**Root cause:** API routes were disabled (moved to `app/_api_disabled/`). The endpoint was intentionally killed, but `llms.txt` still references it.
**Fix options:**
- Restore a read-only public API route that serves a subset of the index (e.g., slugs, names, descriptions — not the full enriched dataset)
- Or update `llms.txt` to remove the reference
- Consider what data should be public vs. private (the full `skills-index.json` is the moat)
**Files:** `app/_api_disabled/`, `public/llms.txt` or `app/llms.txt/route.ts`

### 3. `/skills` page title is doubled
**Current:** `Browse Agent Skills | TrustedSkills | TrustedSkills`
**Expected:** `Browse Agent Skills | TrustedSkills`
**Files:** Likely in `app/skills/page.tsx` or `app/skills/layout.tsx` metadata export

### 4. Platform filter chips are incomplete
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
**Needed:** Better collection display, curated collection pages.

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
