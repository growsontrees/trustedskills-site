/**
 * classify-category.mjs
 *
 * Assigns a category to a skill by weighing evidence from everything the
 * catalogue actually knows about it, rather than pattern-matching the slug
 * and giving up.
 *
 * Why this exists: the previous classifier read the slug only, so 45% of the
 * catalogue landed in "other" and browse-by-category was close to useless.
 * Meanwhile every skill in that bucket had a written description (85% of them
 * substantive) and a ~1,500-character longDescription. The signal was there
 * and unused.
 *
 * How it works:
 *
 *   1. Each field (slug, tags, name, description, longDescription) is
 *      normalised to a token stream and scanned for 1-, 2- and 3-word phrases
 *      from the lexicon, via one inverted index so the cost is O(tokens)
 *      rather than O(terms × fields).
 *   2. A phrase scores `tier weight × field weight`, counted once per field —
 *      so repetition inside a long machine-written description can't inflate
 *      a category, but the same term appearing in both the slug and the
 *      description reinforces it.
 *   3. Tier-c (weak, generic) evidence is capped per category.
 *   4. The legacy hand-tuned slug rules add a fixed bonus to whichever
 *      category they pick — strong evidence, but overridable.
 *   5. The best-supported category wins if it clears MIN_SCORE. Otherwise the
 *      skill stays in "other", which for a genuinely generic skill is the
 *      correct answer, not a failure.
 *
 * `classify()` returns the reasoning as well as the verdict so the result can
 * be audited (`eval-classifier.mjs --explain <slug>`) instead of taken on faith.
 */

import {
  LEXICON,
  TIER_WEIGHT,
  FIELD_WEIGHT,
  C_TIER_CAP,
  MIN_SCORE,
  LEGACY_BONUS,
  CIRCULAR_PHRASES,
} from "./category-lexicon.mjs";
import { legacySlugCategory } from "./legacy-slug-rules.mjs";

export const CATEGORIES = Object.keys(LEXICON);
export const OTHER = "other";

// ── Inverted index: phrase → [{ category, tier, weight }] ───────────────────

const INDEX = new Map();
let MAX_PHRASE_WORDS = 1;

for (const [category, tiers] of Object.entries(LEXICON)) {
  for (const [tier, terms] of Object.entries(tiers)) {
    for (const term of terms) {
      const phrase = normalise(term);
      if (!phrase) continue;
      const words = phrase.split(" ").length;
      if (words > MAX_PHRASE_WORDS) MAX_PHRASE_WORDS = words;
      const entry = { category, tier, weight: TIER_WEIGHT[tier] };
      const existing = INDEX.get(phrase);
      if (existing) existing.push(entry);
      else INDEX.set(phrase, [entry]);
    }
  }
}

/**
 * Lowercase and reduce to space-separated alphanumeric tokens, so that
 * "Next.js", "next-js" and "NEXT JS" all normalise to "next js" and can be
 * matched as one phrase.
 */
function normalise(text) {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * The machine-written longDescription opens with what the skill does and when
 * to use it, then trails into generic filler ("streamlining workflows",
 * "boosting efficiency") that is identical across thousands of entries and
 * carries no categorical signal. Read the useful head, drop the tail.
 */
const LONG_DESCRIPTION_HEAD = 900;

/**
 * Remove the category verb phrases that the description generator splices in,
 * so a previous classification can't launder itself into evidence. See
 * CIRCULAR_PHRASES.
 */
function decircularise(normalised) {
  let text = normalised;
  for (const phrase of CIRCULAR_PHRASES) {
    if (text.includes(phrase)) text = text.split(phrase).join(" ");
  }
  return text.replace(/\s+/g, " ").trim();
}

function fieldsOf(skill) {
  return {
    slug: normalise(skill.slug),
    tags: normalise((skill.tags ?? []).join(" ")),
    name: normalise(skill.name),
    description: decircularise(normalise(skill.description)),
    longDescription: decircularise(
      normalise((skill.longDescription ?? "").slice(0, LONG_DESCRIPTION_HEAD))
    ),
  };
}

/**
 * Score every category from one field's text.
 *
 * At each position the longest matching phrase wins and consumes its tokens,
 * so "content strategy" is read as marketing rather than also scoring the bare
 * "content", and "google analytics" doesn't additionally score "analytics".
 * Each distinct phrase counts once per field, so repeated filler in a long
 * description cannot inflate a category.
 */
function scoreField(text, fieldWeight, scores, cTier, matched) {
  if (!text) return;
  const tokens = text.split(" ");
  const seen = new Set();

  for (let i = 0; i < tokens.length; ) {
    const limit = Math.min(MAX_PHRASE_WORDS, tokens.length - i);
    let hitWords = 0;

    for (let n = limit; n >= 1; n--) {
      const phrase = n === 1 ? tokens[i] : tokens.slice(i, i + n).join(" ");
      const entries = INDEX.get(phrase);
      if (!entries) continue;

      hitWords = n;
      if (seen.has(phrase)) break; // already counted in this field
      seen.add(phrase);

      for (const { category, tier, weight } of entries) {
        const points = weight * fieldWeight;
        if (tier === "c") {
          const used = cTier.get(category) ?? 0;
          const allowed = C_TIER_CAP - used;
          if (allowed <= 0) continue;
          const capped = Math.min(points, allowed);
          cTier.set(category, used + capped);
          scores.set(category, (scores.get(category) ?? 0) + capped);
          matched.push({ phrase, category, tier, points: Math.round(capped * 100) / 100 });
        } else {
          scores.set(category, (scores.get(category) ?? 0) + points);
          matched.push({ phrase, category, tier, points: Math.round(points * 100) / 100 });
        }
      }
      break;
    }

    i += hitWords || 1;
  }
}

/**
 * Classify one skill.
 *
 * @returns {{ category: string, score: number, confident: boolean,
 *             runnerUp: string|null, runnerUpScore: number,
 *             legacy: string|null|undefined, ranked: Array<[string, number]>,
 *             matched: Array<object> }}
 */
export function classify(skill) {
  const scores = new Map();
  const cTier = new Map();
  const matched = [];

  const fields = fieldsOf(skill);
  for (const [field, text] of Object.entries(fields)) {
    scoreField(text, FIELD_WEIGHT[field], scores, cTier, matched);
  }

  const legacy = legacySlugCategory(skill.slug ?? "");
  if (legacy) {
    scores.set(legacy, (scores.get(legacy) ?? 0) + LEGACY_BONUS);
    matched.push({ phrase: "(legacy slug rule)", category: legacy, tier: "legacy", points: LEGACY_BONUS });
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [best, bestScore] = ranked[0] ?? [null, 0];
  const [runnerUp, runnerUpScore] = ranked[1] ?? [null, 0];

  const confident = best !== null && bestScore >= MIN_SCORE;

  return {
    category: confident ? best : OTHER,
    score: Math.round(bestScore * 100) / 100,
    confident,
    runnerUp: runnerUp ?? null,
    runnerUpScore: Math.round(runnerUpScore * 100) / 100,
    legacy,
    ranked: ranked.slice(0, 5).map(([c, s]) => [c, Math.round(s * 100) / 100]),
    matched,
  };
}
