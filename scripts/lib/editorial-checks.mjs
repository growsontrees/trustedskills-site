/**
 * Editorial checks that need registry data (data/skills-index.json) rather
 * than just the review/collection JSON on disk.
 */

/**
 * A collection entry's `note` explains why the skill was picked. That
 * judgement can go stale silently when the registry later finds the skill's
 * install command broken. This does not invalidate the entry — the skill is
 * still a real registry slug, and "not installable right now" is a fact
 * about the registry, not about whether the pick was a good one — so it is
 * a warning, never an error.
 *
 * @param {{ skillSlug?: string }} entry - a collection entry.
 * @param {{ install_status?: string } | undefined} skill - the matching
 *   registry skill record, or undefined if the slug was not found (that
 *   case is already an error elsewhere; this function stays silent on it).
 * @returns {string | null} a warning message naming the entry's slug and
 *   its install_status, or null if the skill installs cleanly (or wasn't
 *   found in the registry at all).
 */
export function installStatusWarning(entry, skill) {
  if (!skill) return null;
  const status = skill.install_status ?? "unknown";
  if (status === "ok") return null;
  return `"${entry.skillSlug}" has install_status "${status}", not "ok" — the pick may no longer install`;
}
