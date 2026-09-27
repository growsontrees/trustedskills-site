import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import type { Collection, CollectionEntry } from "./editorial-config";
import type { Skill } from "./skill-config";
import { getSkillBySlug } from "./skills";
import { draftsVisible } from "./reviews";

// Server-only. Collections are hand-made themed lists — one JSON file per
// collection under content/collections/. Entries reference registry slugs
// rather than copying skill data, so install counts, tiers and descriptions
// stay live instead of going stale inside editorial content.
export * from "./editorial-config";

export const COLLECTIONS_DIR = join(process.cwd(), "content", "collections");

let _collections: Collection[] | null = null;

/**
 * Every collection on disk, drafts included. Ordered newest first. Cached only
 * in production, for the same reason as getAllReviewsIncludingDrafts().
 */
export function getAllCollectionsIncludingDrafts(): Collection[] {
  if (!_collections || process.env.NODE_ENV !== "production") {
    _collections = existsSync(COLLECTIONS_DIR)
      ? readdirSync(COLLECTIONS_DIR)
          .filter((file) => file.endsWith(".json"))
          .map((file) => JSON.parse(readFileSync(join(COLLECTIONS_DIR, file), "utf8")) as Collection)
          .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
      : [];
  }
  return _collections;
}

/** Collections that should be served in the current environment. */
export function getAllCollections(): Collection[] {
  const all = getAllCollectionsIncludingDrafts();
  return draftsVisible() ? all : all.filter((c) => c.status === "published");
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getAllCollections().find((c) => c.slug === slug);
}

export interface ResolvedEntry extends CollectionEntry {
  skill: Skill;
}

/**
 * Pair each entry with its registry record, dropping any slug that is no longer
 * in the index. validate-editorial.mjs fails the build on a missing slug, so a
 * drop here means the registry changed after validation — better a shorter list
 * than a broken link.
 */
export function resolveEntries(collection: Collection): ResolvedEntry[] {
  return collection.entries.flatMap((entry) => {
    const skill = getSkillBySlug(entry.skillSlug);
    return skill ? [{ ...entry, skill }] : [];
  });
}

/** Collections featuring a given skill — shown on the skill's detail page. */
export function getCollectionsForSkill(skillSlug: string): Collection[] {
  return getAllCollections().filter((c) =>
    c.entries.some((entry) => entry.skillSlug === skillSlug)
  );
}
