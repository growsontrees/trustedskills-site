# The editorial programme — reviews and collections

The registry is table stakes. Anyone can scrape 26,000 skill records; nobody can
scrape the judgement about which thirty are worth installing. Reviews and
collections are that judgement, and they're the linkable, rankable assets the
rest of the site hangs off.

This document is the operating manual. It covers the content model, the drafting
workflow, and the rules that don't bend.

## The rule that doesn't bend

**Never invent results, testimonials, case studies or logos.** A review of a
skill nobody ran does not ship as a hands-on review.

This isn't a style preference. The entire commercial value of "TrustedSkills" is
that the word "trusted" means something. One fabricated benchmark, discovered
once, and the moat is gone.

The content model is built so honesty is the path of least resistance, and
`npm run check:editorial` fails the build when it isn't.

## Content model

Editorial content is one JSON file per item:

```
content/reviews/<slug>.json
content/collections/<slug>.json
```

Types live in `lib/editorial-config.ts`. Loaders are `lib/reviews.ts` and
`lib/collections.ts` (both server-only — they read from disk).

A review is **structured data, not hand-written HTML**. The page template in
`app/reviews/[slug]/page.tsx` renders the fields. A drafting agent writes prose
into `summary`, `strengths[].body` and so on; it never writes Tailwind markup.
Prose fields accept Markdown, including GFM tables.

This matters: the first review on this site was 650 lines of bespoke HTML. That
does not scale to fifty, and every one would have looked slightly different.

### `status` — the approval gate

| Value | Behaviour |
|---|---|
| `draft` | Visible in `npm run dev`. Never served in production, never in the sitemap, `noindex` if reached. |
| `published` | Live. |

An agent drafts at `draft`. A human reads it and flips it to `published`. That
flip is the whole approval step, and it's a one-line diff that's easy to review.

To preview drafts against a production build, set `EDITORIAL_DRAFTS=1`.

### `evidenceBasis` — what the judgement rests on

This is the field that keeps the programme honest.

| Value | Means | Requires |
|---|---|---|
| `hands-on` | Installed and run against real work. | At least one entry in `runs[]`. Earns the skill a 🧪 **Reviewed** badge. Marked up as schema.org `Review`. |
| `source-review` | We read the source, docs and release history. Did not run it. | A `basisNote` stating plainly what was and wasn't done. No Reviewed badge. Marked up as `Article`, not `Review`. |

Both are legitimate. Only one may imply testing.

A `source-review` is a reasonable way to cover a skill you can't easily run —
but it never carries a measured number, and the page says so above the verdict,
not in a footnote.

### `runs[]` — the evidence

Each run records `testedAt`, `platform`, `task` (the real work it was pointed
at), and `outcome` (what actually happened). Optionally `skillVersion` and
`environment`.

The validator rejects a run whose `task` or `outcome` reads as a prediction —
"would flag", "we'd expect", "predicted". A run report says what happened. If
you're writing in the conditional, you're not reporting a run.

### Scores

Five dimensions, each an integer 1–5: `installation`, `documentation`, `depth`,
`maintenance`, `platformSupport`. `overallScore` **must** equal their mean,
rounded to one decimal place. The validator enforces this.

The overall score is derived, not a separate vibe. (The original claude-seo
review claimed 4.4 against dimensions averaging 4.2 — exactly the drift this
check prevents.)

## Drafting workflow

1. **Pick a skill.** Prefer high-install skills with no review, and skills
   already sitting in a published collection — a collection entry that links to
   a review is worth more than either alone.
2. **Install it and use it for real work.** Not a toy prompt. A task you
   genuinely needed doing. Write down the platform, the version, what you asked
   for, and what came back — including the parts that went badly.
3. **Draft the JSON.** Copy `docs/templates/review.template.json`. Set
   `status: "draft"`. Fill `runs[]` from step 2 first, then write the analysis
   from the runs — not the other way around.
4. **Validate:** `npm run check:editorial`.
5. **Preview:** `npm run dev` and read `/reviews/<slug>` end to end.
6. **Human approval.** Peter reads it and flips `status` to `published`.
7. **Ship.** The skill now shows a 🧪 Reviewed badge, and the review enters the
   sitemap on the next build.

If step 2 didn't happen, the review is a `source-review`. That is an acceptable
outcome — it is not an acceptable thing to hide.

## Collections

A collection is a hand-made themed list: *"the 12 skills worth installing for
SEO work"*. Cheapest high-value asset on the site — strong SEO, the most
naturally shareable thing we publish, and the place domain expertise shows.

Three required honesty fields:

- **`criteria`** — how the list was built, and what was deliberately left off
  and why. The exclusions are often the most useful part.
- **`evidenceNote`** — which entries were run hands-on and which are shortlisted
  from registry signals. A curated list is allowed to be curated; it is not
  allowed to imply it was tested.
- **`entries[].note`** — why *this* skill earned *this* slot. An entry without a
  reason is just a listing, and the validator rejects it.

Entries reference registry slugs. Skill data — installs, tier, author,
description — is resolved live at render time, so a collection never carries
stale numbers. The validator fails on a slug that isn't in the index.

**Organising principle that works:** order by the stage of the job, not by
download count. "Most installed SEO skills" is a scrape. "Diagnose → fix the
technical floor → fix the page → structure the data → find the demand → study
the competition → earn authority → optimise for AI search → measure, with one or
two picks per stage" is expertise. The second one is the product.

A title promising a number must deliver it — the validator counts.

## The Reviewed badge

Derived, not stored. `getReviewedSkillSlugs()` returns the skills carrying a
published **hands-on** review; the badge links to it.

Deliberately not a registry verification tier. The tiers in
`lib/skill-config.ts` describe provenance — who published a skill. Being
reviewed is a statement about *us*, not about the publisher, and mixing the two
would make both mean less.

## Commands

```bash
npm run check:editorial   # validate all reviews and collections
npm run dev               # drafts visible
npm run build             # runs check:editorial as prebuild; drafts excluded
```

Validation runs as `prebuild`, so invalid editorial content fails the deploy
instead of shipping quietly — the same "fail loudly" posture as the registry
sync.

## Known debt

- **`content/reviews/claude-seo.json`** is a `source-review`. The original
  published version presented predicted findings ("would find", "expected",
  "likely") in the voice of test results, while the site's methodology block
  claimed every skill is installed and run. It's now labelled accurately and its
  speculative section was rewritten as "open questions a hands-on run needs to
  answer". **It should be re-done as a genuine hands-on review** — it's the
  flagship page and it's the one review currently not backed by a run.
- Its comparison table and star counts came from the original draft and have not
  been re-verified. The table now describes capabilities from project
  documentation rather than citing unverified star counts, but a fact-check pass
  is still owed.
