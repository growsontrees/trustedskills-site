/**
 * The one public channel: Issues on the repository this site deploys from.
 *
 * `growsontrees/trustedskills-registry` is private — it holds sources.json and
 * the crawl tooling — so no public link may point at it. Every such link used
 * to 404 for readers. `trustedskills-site` is public with Issues enabled, and
 * Discussions is deliberately off: one channel, one place to watch.
 *
 * Each `template` filename below must exist in .github/ISSUE_TEMPLATE/ in this
 * repository, on the default branch. A ?template= value with no matching file
 * drops the reader on a bare issue form with no prompts.
 */
export const GITHUB_REPO_URL = "https://github.com/growsontrees/trustedskills-site";

export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;

const newIssue = (template: string) => `${GITHUB_ISSUES_URL}/new?template=${template}`;

/** Report a listed skill: malicious, broken, or misrepresented by its badge. */
export const REPORT_SKILL_URL = newIssue("report-a-skill.md");

/** Ask for a skill that isn't in the index yet. */
export const REQUEST_SKILL_URL = newIssue("request-a-skill.md");

/** Something on the site itself is wrong. */
export const SITE_BUG_URL = newIssue("site-bug.md");

/**
 * The whole of the commitment, and deliberately small. Do not add a response
 * time to it anywhere — /submit already declines to promise one for merges.
 */
export const REPORT_PROMISE =
  "We read every report and can delist a skill from the index. We don't promise a response time.";
