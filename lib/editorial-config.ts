// Types and display config for the editorial layer: hands-on reviews and
// curated collections. Safe to import from client components — nothing here
// touches the skills index or the filesystem. Server code that loads editorial
// content uses lib/reviews.ts and lib/collections.ts.

/**
 * Editorial content is authored as a draft, reviewed by a human, and only then
 * published. `draft` is never served in production.
 */
export type EditorialStatus = "draft" | "published";

export type Verdict =
  | "Highly Recommended"
  | "Recommended"
  | "Use With Caution"
  | "Not Recommended";

export const VERDICT_CONFIG: Record<Verdict, { badge: string; accent: string }> = {
  "Highly Recommended": {
    badge: "bg-emerald-900 text-emerald-300 border-emerald-700",
    accent: "text-emerald-400",
  },
  Recommended: {
    badge: "bg-blue-900 text-blue-300 border-blue-700",
    accent: "text-blue-400",
  },
  "Use With Caution": {
    badge: "bg-yellow-900 text-yellow-300 border-yellow-700",
    accent: "text-yellow-400",
  },
  "Not Recommended": {
    badge: "bg-red-900 text-red-300 border-red-700",
    accent: "text-red-400",
  },
};

export const NEUTRAL_BADGE = "bg-gray-800 text-gray-300 border-gray-700";

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export interface ReviewScores {
  installation: number;
  documentation: number;
  depth: number;
  maintenance: number;
  platformSupport: number;
}

export const SCORE_DIMENSIONS: {
  key: keyof ReviewScores;
  label: string;
  icon: string;
}[] = [
  { key: "installation", label: "Ease of Install", icon: "🔧" },
  { key: "documentation", label: "Documentation", icon: "📚" },
  { key: "depth", label: "Depth", icon: "🔬" },
  { key: "maintenance", label: "Maintenance", icon: "🔄" },
  { key: "platformSupport", label: "Platform Support", icon: "🖥️" },
];

/**
 * What a review's judgement actually rests on.
 *
 * `hands-on` — the skill was installed and run against real work. Only these
 * count towards the review target and only these earn a skill the Reviewed
 * badge.
 *
 * `source-review` — we read the source, docs and release history but did not
 * run it. Legitimate editorial, but it must say so on the page: the rule is
 * never to imply testing that didn't happen.
 */
export type EvidenceBasis = "hands-on" | "source-review";

export const EVIDENCE_BASIS_CONFIG: Record<
  EvidenceBasis,
  { label: string; icon: string; badge: string; blurb: string }
> = {
  "hands-on": {
    label: "Hands-on tested",
    icon: "🧪",
    badge: "bg-emerald-900 text-emerald-300 border-emerald-700",
    blurb: "We installed this skill and ran it against real work. The runs are listed below.",
  },
  "source-review": {
    label: "Source review — not run",
    icon: "📖",
    badge: "bg-amber-900 text-amber-300 border-amber-700",
    blurb:
      "This assessment is based on reading the source, documentation and release history. We have not run this skill against a real task yet, so nothing here is a measured result.",
  },
};

/**
 * A single hands-on run. This is the load-bearing field of the whole
 * programme: a hands-on review with no run did not happen, and
 * validate-editorial.mjs refuses to publish one. `task` describes real work the
 * skill was pointed at, `outcome` says what it actually did.
 */
export interface ReviewRun {
  /** ISO date the run took place. */
  testedAt: string;
  /** Platform the skill ran on, e.g. "claudecode". */
  platform: string;
  /** Skill version or commit, when the source exposes one. */
  skillVersion?: string;
  /** The real task the skill was pointed at. */
  task: string;
  /** What actually happened — findings, failures, surprises. */
  outcome: string;
  /** Anything about the environment that shaped the result. */
  environment?: string;
}

export interface ReviewPoint {
  title: string;
  /** Markdown. */
  body: string;
}

export interface ReviewSection {
  heading: string;
  /** Markdown. */
  body: string;
}

export interface ReviewFaq {
  question: string;
  /** Markdown. */
  answer: string;
}

export interface ReviewLink {
  label: string;
  href: string;
}

export interface EditorialAuthor {
  name: string;
  bio: string;
}

export interface Review {
  slug: string;
  status: EditorialStatus;
  title: string;
  description: string;
  /** Registry slug of the skill under review. Must exist in the index. */
  skillSlug: string;
  verdict: Verdict;
  overallScore: number;
  scores: ReviewScores;
  publishedAt: string;
  lastUpdated: string;
  author: EditorialAuthor;
  targetKeyword?: string;
  /** What this review's judgement rests on. Surfaced on the page. */
  evidenceBasis: EvidenceBasis;
  /**
   * Required for `source-review`: what we did and did not do. Optional extra
   * context for `hands-on`.
   */
  basisNote?: string;
  /** At least one run is required to publish a `hands-on` review. */
  runs: ReviewRun[];
  /** Markdown — the quick verdict up top. */
  summary: string;
  strengths: ReviewPoint[];
  limitations: ReviewPoint[];
  bestFor?: ReviewPoint[];
  /** Markdown — who should skip this. */
  notFor?: string;
  /** Free-form extra sections, rendered after the structured ones. */
  sections?: ReviewSection[];
  faq?: ReviewFaq[];
  links?: ReviewLink[];
  /**
   * Escape hatch for reviews migrated from the old hand-written HTML format.
   * Rendered in place of the structured sections. Prefer structured fields:
   * they keep every review consistent and let a drafting agent write prose
   * instead of Tailwind markup.
   */
  legacyHtml?: string;
}

/** Mean of the five dimensions, rounded to one decimal place. */
export function computeOverallScore(scores: ReviewScores): number {
  const values = SCORE_DIMENSIONS.map((d) => scores[d.key]);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(mean * 10) / 10;
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export interface CollectionEntry {
  /** Registry slug. Resolved against the index at render time. */
  skillSlug: string;
  /** Markdown — why this skill earned its place on the list. */
  note: string;
  /** Optional one-liner: the job this specific pick does in the set. */
  role?: string;
}

export interface Collection {
  slug: string;
  status: EditorialStatus;
  title: string;
  /** Short line under the H1. */
  description: string;
  emoji: string;
  /** Markdown — sets up the theme and who the list is for. */
  intro: string;
  /**
   * Markdown — how the list was built and what the picks are based on.
   * Required: a curated list has to say what its judgement rests on.
   */
  criteria: string;
  /**
   * Markdown — which entries were run hands-on and which are shortlisted from
   * registry signals. Keeps a collection from implying testing it didn't do.
   */
  evidenceNote: string;
  entries: CollectionEntry[];
  curator: EditorialAuthor;
  publishedAt: string;
  lastUpdated: string;
  targetKeyword?: string;
}
