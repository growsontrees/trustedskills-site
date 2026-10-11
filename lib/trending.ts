import { getAllSkills, getStats } from "./skills";
import type { SignalMeta, Skill } from "./skill-config";

/**
 * Trending: repos ranked by how fast they are gaining GitHub stars.
 *
 * Grouped by repo, not by skill, because the star delta is a repo number. All
 * 53 skills in `mattpocock/skills` carry the same +13k, so a skill-level list
 * is one repo repeated down the page. A repo row lists its skills instead.
 *
 * The delta window is whatever the registry's star history covers
 * (`stars_delta_days`), which was 13 days for nearly every repo in October
 * 2026. Rows are ranked on stars per day so a 7-day and a 13-day delta compare
 * fairly, and the real window is shown next to each number.
 */

/** A repo has to gain at least this many stars to be listed. Filters noise. */
const MIN_STARS_GAINED = 25;

/** Skills shown under each repo before "and N more". */
export const SKILLS_PER_REPO = 3;

export interface TrendingRepo {
  /** `owner/repo` on GitHub. */
  repo: string;
  starsGained: number;
  days: number;
  starsPerDay: number;
  /** Stars now. */
  stars: number;
  /** Gain as a share of the stars the repo had at the start of the window. */
  growth: number | null;
  /** Listed skills from this repo, best Signal Score first. */
  skills: Skill[];
  /** The repo ships more than 10 skills, so its stars are not about any one of them. */
  bundled: boolean;
}

function signalRank(skill: Skill): number {
  return skill.signal?.rankable ? skill.signal.score : -1;
}

/** The (delta, window) pair most of a repo's skills agree on. */
function repoDelta(skills: Skill[]): { delta: number; days: number; stars: number } {
  const tally = new Map<string, { n: number; skill: Skill }>();
  for (const skill of skills) {
    const key = `${skill.stars_30d_delta}/${skill.stars_delta_days}`;
    const entry = tally.get(key) ?? { n: 0, skill };
    entry.n += 1;
    tally.set(key, entry);
  }
  const { skill } = [...tally.values()].sort((a, b) => b.n - a.n)[0];
  return { delta: skill.stars_30d_delta as number, days: skill.stars_delta_days as number, stars: skill.stars ?? 0 };
}

let _trending: TrendingRepo[] | null = null;

export function getTrendingRepos(): TrendingRepo[] {
  if (_trending) return _trending;

  const byRepo = new Map<string, Skill[]>();
  for (const skill of getAllSkills()) {
    if (!skill.repo_github) continue;
    if (typeof skill.stars_30d_delta !== "number" || !(Number(skill.stars_delta_days) > 0)) continue;
    const list = byRepo.get(skill.repo_github) ?? [];
    list.push(skill);
    byRepo.set(skill.repo_github, list);
  }

  const repos: TrendingRepo[] = [];
  for (const [repo, skills] of byRepo) {
    const { delta, days, stars } = repoDelta(skills);
    if (delta < MIN_STARS_GAINED) continue;
    const before = stars - delta;
    repos.push({
      repo,
      starsGained: delta,
      days,
      starsPerDay: delta / days,
      stars,
      growth: before > 0 ? delta / before : null,
      skills: [...skills].sort(
        (a, b) => signalRank(b) - signalRank(a) || (b.installs || 0) - (a.installs || 0)
      ),
      bundled: skills.some((s) => !!s.bundled_in),
    });
  }

  repos.sort((a, b) => b.starsPerDay - a.starsPerDay || b.stars - a.stars);
  _trending = repos;
  return repos;
}

/** Index-level Signal Score facts, or null before the registry scores the index. */
export function getSignalMeta(): SignalMeta | null {
  return getStats().signal ?? null;
}
