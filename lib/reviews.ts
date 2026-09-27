import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import type { Review } from "./editorial-config";

// Server-only. Reviews are authored as one JSON file per review under
// content/reviews/ so a drafting agent can add a file without touching source,
// and a human can approve one by flipping `status` to "published".
export * from "./editorial-config";

export const REVIEWS_DIR = join(process.cwd(), "content", "reviews");

/**
 * Drafts are visible in development and in an explicit preview build, never in
 * a normal production build. Keeping the gate here means every consumer —
 * listings, detail pages, generateStaticParams, the sitemap — agrees on what
 * exists.
 */
export function draftsVisible(): boolean {
  return process.env.EDITORIAL_DRAFTS === "1" || process.env.NODE_ENV !== "production";
}

let _reviews: Review[] | null = null;

/** Every review on disk, drafts included. Ordered newest first. */
export function getAllReviewsIncludingDrafts(): Review[] {
  if (!_reviews) {
    _reviews = existsSync(REVIEWS_DIR)
      ? readdirSync(REVIEWS_DIR)
          .filter((file) => file.endsWith(".json"))
          .map((file) => JSON.parse(readFileSync(join(REVIEWS_DIR, file), "utf8")) as Review)
          .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
      : [];
  }
  return _reviews;
}

/** Reviews that should be served in the current environment. */
export function getAllReviews(): Review[] {
  const all = getAllReviewsIncludingDrafts();
  return draftsVisible() ? all : all.filter((r) => r.status === "published");
}

export function getReviewBySlug(slug: string): Review | undefined {
  return getAllReviews().find((r) => r.slug === slug);
}

/** The review of a given registry skill, if we have published one. */
export function getReviewForSkill(skillSlug: string): Review | undefined {
  return getAllReviews().find((r) => r.skillSlug === skillSlug);
}

/**
 * Registry slugs carrying a hands-on review. Used to badge skills as Reviewed
 * without adding a tier to the registry schema. Source-only reviews are
 * deliberately excluded — the badge has to mean someone ran the thing.
 */
export function getReviewedSkillSlugs(): Set<string> {
  return new Set(
    getAllReviews()
      .filter((r) => r.evidenceBasis === "hands-on")
      .map((r) => r.skillSlug)
  );
}

/** Progress against the review programme's target. */
export function getReviewProgress(): {
  handsOn: number;
  sourceReviews: number;
  drafts: number;
} {
  const served = getAllReviews();
  const all = getAllReviewsIncludingDrafts();
  return {
    handsOn: served.filter((r) => r.status === "published" && r.evidenceBasis === "hands-on").length,
    sourceReviews: served.filter(
      (r) => r.status === "published" && r.evidenceBasis === "source-review"
    ).length,
    drafts: all.filter((r) => r.status === "draft").length,
  };
}
