#!/usr/bin/env node
/**
 * Run the automated "Checked" safety pass over the catalogue.
 *
 * One pinned tarball per upstream repository, every skill inside it scanned,
 * every individual check result stored. The output is data/safety-reports.json,
 * which the site reads to render why a skill passed or failed and which
 * apply-safety-tiers.mjs turns into the Checked / Listed tiers.
 *
 * The run is incremental and resumable. A repository whose head commit already
 * matches the stored scan is skipped, so the daily job only pays for what moved,
 * and a budgeted run can work through a cold catalogue over several days.
 *
 *   node scripts/safety-scan.mjs                       # default budget
 *   node scripts/safety-scan.mjs --repos 200           # scan 200 repositories
 *   node scripts/safety-scan.mjs --only slug,slug      # rescan named skills
 *   node scripts/safety-scan.mjs --force               # ignore the cache
 *   node scripts/safety-scan.mjs --max-minutes 45      # stop and save in time
 *   node scripts/safety-scan.mjs --index /tmp/registry/skills-index.json
 *
 * --index matters in CI: the committed index is a 26k baseline that the deploy
 * merges the full registry into at build time. Scanning the registry's own file
 * covers every skill the site will actually serve, and none of the site's
 * enrichment (descriptions, categories) affects the scan.
 *
 * GITHUB_TOKEN (or GH_TOKEN) is required in practice: unauthenticated GitHub
 * allows 60 requests an hour, which is not a catalogue scan.
 */

import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { CHECKS, runSafetyChecks } from "./lib/safety-checks.mjs";
import {
  LIMITS,
  RateLimited,
  directoryOf,
  fetchHeadCommit,
  fetchRawFiles,
  fetchRepoFiles,
  fetchRepoTree,
  filesForSkill,
  locateSkill,
  rateLimit,
  resolveSource,
} from "./lib/github-source.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REPORT_PATH = join(ROOT, "data", "safety-reports.json");
const SCHEMA_VERSION = 1;

const options = parseArgs(process.argv.slice(2));
const INDEX_PATH = options.index ?? join(ROOT, "data", "skills-index.json");
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

if (!token) {
  console.warn("⚠  No GITHUB_TOKEN/GH_TOKEN set. GitHub allows 60 unauthenticated requests an hour;");
  console.warn("   the scan will stop early. Set a token for anything beyond a smoke test.");
}

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
const report = loadReport();

const skills = options.only
  ? index.skills.filter((skill) => options.only.has(skill.slug))
  : index.skills;

if (options.only && skills.length === 0) {
  console.error("None of the requested slugs are in the index.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Group skills by upstream repository
// ---------------------------------------------------------------------------

const byRepo = new Map();
let unresolved = 0;

for (const skill of skills) {
  const source = resolveSource(skill);
  if (!source) {
    unresolved += 1;
    report.reports[skill.slug] = unscannable(null, "no GitHub source recorded for this skill");
    continue;
  }
  const entry = byRepo.get(source.repo) ?? { repo: source.repo, skills: [], paths: new Map(), weight: 0 };
  entry.skills.push(skill);
  if (source.path) entry.paths.set(skill.slug, source.path);
  entry.weight = Math.max(entry.weight, skill.installs || 0);
  byRepo.set(source.repo, entry);
}

// Most-installed repositories first: a budgeted run should cover the part of
// the catalogue people actually land on before the long tail.
const queue = [...byRepo.values()].sort((a, b) => b.weight - a.weight || b.skills.length - a.skills.length);

const pending = options.force
  ? queue
  : queue.filter((entry) => {
      const cached = report.repos[entry.repo];
      if (!cached || cached.status !== "ok") return true;
      // A repository is only up to date if every skill in it also has a report
      // from that same commit — new skills appear in existing repositories.
      return entry.skills.some((skill) => report.reports[skill.slug]?.commit !== cached.sha);
    });

const budgeted = pending.slice(0, options.repos);

console.log(
  `${skills.length} skills across ${byRepo.size} repositories ` +
    `(${unresolved} with no GitHub source). ${pending.length} repositories need a scan; ` +
    `this run takes ${budgeted.length}.`
);

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------

const startedAt = Date.now();
const deadline = options.maxMinutes ? startedAt + options.maxMinutes * 60_000 : Infinity;
const tally = { repos: 0, skills: 0, checked: 0, flagged: 0, unscannable: 0, deferred: 0, errors: 0 };
let stopped = null;
let cursor = 0;

async function worker() {
  while (cursor < budgeted.length && !stopped) {
    if (Date.now() > deadline) {
      stopped = `time budget of ${options.maxMinutes} minutes reached`;
      break;
    }
    const entry = budgeted[cursor++];
    try {
      await scanRepo(entry);
    } catch (error) {
      if (error instanceof RateLimited) {
        // Only the large-repository and diagnosis paths use the REST API, so a
        // spent budget defers this repository rather than ending the run. Its
        // status stays unscanned, which is what makes the next run pick it up.
        deferRepo(entry, `the GitHub API budget is exhausted${error.resetAt ? ` until ${error.resetAt.toISOString()}` : ""}`);
        tally.repos += 1;
        continue;
      }
      tally.errors += 1;
      report.repos[entry.repo] = { status: "error", reason: truncate(error.message, 200), scanned_at: now() };
      for (const skill of entry.skills) {
        report.reports[skill.slug] = unscannable(entry.repo, truncate(error.message, 200));
        tally.unscannable += 1;
      }
    }

    tally.repos += 1;
    if (tally.repos % 25 === 0) {
      save();
      const rate = tally.repos / ((Date.now() - startedAt) / 1000);
      console.log(
        `  ${tally.repos}/${budgeted.length} repos · ${tally.checked} checked · ${tally.flagged} flagged · ` +
          `${tally.unscannable} unscannable · ${rate.toFixed(1)} repos/s` +
          (tally.deferred ? ` · ${tally.deferred} deferred` : "") +
          (rateLimit.remaining === null ? "" : ` · ${rateLimit.remaining} API requests left`)
      );
    }
  }
}

async function scanRepo(entry) {
  const head = await fetchHeadCommit(entry.repo, { token });

  if (head.status === "deferred") {
    deferRepo(entry, head.reason);
    return;
  }

  if (head.status !== "ok") {
    report.repos[entry.repo] = { status: head.status, reason: head.reason, scanned_at: now() };
    for (const skill of entry.skills) {
      report.reports[skill.slug] = unscannable(entry.repo, head.reason);
      tally.unscannable += 1;
    }
    return;
  }

  const archive = await fetchRepoFiles(entry.repo, head.sha, { token });

  // A skill inside a very large repository is read through the tree API rather
  // than by pulling hundreds of megabytes for one directory. One tarball is a
  // single request; that fallback pays per file, so it gets a fixed allowance.
  const budget = { remaining: LIMITS.rawFilesPerRepo };

  const source =
    archive.status === "ok"
      ? { mode: "tarball", files: archive.files, paths: [...archive.files.keys()] }
      : archive.status === "too-large"
        ? await readViaTree(entry, head.sha, archive.reason, budget)
        : { status: "error", reason: archive.reason };

  if (source.status === "deferred") {
    deferRepo(entry, source.reason);
    return;
  }

  if (source.status === "error") {
    report.repos[entry.repo] = { status: "error", reason: source.reason, sha: head.sha, scanned_at: now() };
    for (const skill of entry.skills) {
      report.reports[skill.slug] = unscannable(entry.repo, source.reason, head.sha);
      tally.unscannable += 1;
    }
    return;
  }

  report.repos[entry.repo] = {
    status: "ok",
    mode: source.mode,
    sha: head.sha,
    ...(head.committedAt ? { committed_at: head.committedAt } : {}),
    scanned_at: now(),
    files: source.paths.length,
    skills: entry.skills.length,
  };

  for (const skill of entry.skills) {
    const located = locateSkill(source.paths, skill, entry.paths.get(skill.slug), (path) => source.files.get(path));
    if (located.status !== "ok") {
      report.reports[skill.slug] = unscannable(entry.repo, located.reason, head.sha);
      tally.unscannable += 1;
      continue;
    }

    // In tree mode only the manifests were fetched up front, so pull the rest of
    // the skill's directory now that it is known which one it is.
    const files =
      source.mode === "tarball"
        ? filesForSkill(source.files, located.paths)
        : await readSkillDirectory(entry.repo, head.sha, source, located.paths, budget);

    const outcome = runSafetyChecks({
      files,
      skillMdPath: located.paths[0],
      repo: entry.repo,
      sha: head.sha,
    });

    report.reports[skill.slug] = {
      verdict: outcome.verdict,
      repo: entry.repo,
      commit: head.sha,
      path: located.paths[0],
      ...(located.paths.length > 1 ? { copies: located.paths } : {}),
      matched_by: located.match,
      files: outcome.scannedFiles,
      lines: outcome.scannedLines,
      failed: outcome.failed,
      checks: compactChecks(outcome.checks),
      scanned_at: today(),
    };

    tally.skills += 1;
    if (outcome.verdict === "checked") tally.checked += 1;
    else tally.flagged += 1;
  }
}

/**
 * Park a repository for the next run, leaving whatever results it already has.
 *
 * Nothing is written into `reports` — a deferral is not a finding about a skill,
 * and overwriting a real result with "we ran out of budget" would lose a scan
 * that succeeded yesterday.
 */
function deferRepo(entry, reason) {
  report.repos[entry.repo] = { status: "deferred", reason: truncate(reason, 200), scanned_at: now() };
  tally.deferred += 1;
}

/** List a large repository and fetch only its manifests, for identification. */
async function readViaTree(entry, sha, sizeReason, budget) {
  // The tree API is the one part of the scan that spends REST budget per
  // repository. Running out of it should cost this repository, not the run:
  // its status stays unscanned, so the next run picks it up.
  let tree;
  try {
    tree = await fetchRepoTree(entry.repo, sha, { token });
  } catch (error) {
    if (error instanceof RateLimited) return { status: "deferred", reason: `${sizeReason}; ${error.message}` };
    throw error;
  }

  if (tree.status === "deferred") return { status: "deferred", reason: `${sizeReason}; ${tree.reason}` };
  if (tree.status !== "ok") return { status: "error", reason: `${sizeReason}; ${tree.reason}` };

  const manifests = tree.entries.filter(({ path }) => /(^|\/)SKILL\.md$/i.test(path)).map(({ path }) => path);
  if (manifests.length === 0) {
    return { status: "error", reason: `${sizeReason}; no SKILL.md in the tree` };
  }

  // Only the candidate manifests are fetched: enough to identify each skill,
  // without reading a monorepo one file at a time.
  const wanted = manifests.filter((path) =>
    entry.skills.some((skill) => manifestCouldBelongTo(path, skill, entry.paths.get(skill.slug)))
  );
  const files = await fetchRawFiles(entry.repo, sha, wanted.length ? wanted : manifests.slice(0, 40), {
    token,
    budget,
  });

  return { mode: "tree", files, paths: tree.entries.map(({ path }) => path), truncated: tree.truncated };
}

function manifestCouldBelongTo(path, skill, recordedPath) {
  const directory = directoryOf(path).split("/").pop()?.toLowerCase() ?? "";
  const slug = String(skill.slug ?? "").toLowerCase();
  if (recordedPath && path.toLowerCase() === recordedPath.replace(/^\.?\//, "").toLowerCase()) return true;
  return directory === slug || directory.endsWith(`-${slug}`) || directory === slug.replace(/-\d+$/, "");
}

/** Fetch the files under a located skill's directory from a large repository. */
async function readSkillDirectory(repo, sha, source, manifestPaths, budget) {
  const directories = [...new Set(manifestPaths.map(directoryOf))];
  const wanted = source.paths.filter((path) =>
    directories.some((directory) => (directory ? path.startsWith(`${directory}/`) : !path.includes("/")))
  );

  const missing = wanted.filter((path) => !source.files.has(path));
  const fetched = missing.length ? await fetchRawFiles(repo, sha, missing, { token, budget }) : new Map();

  return wanted
    .map((path) => ({ path, text: source.files.get(path) ?? fetched.get(path) }))
    .filter((file) => typeof file.text === "string");
}

await Promise.all(Array.from({ length: options.concurrency }, worker));
save();

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

const totals = summarise(report.reports);
const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);

console.log("");
console.log(`This run: ${tally.repos} repositories in ${elapsed}s.`);
console.log(`  checked     ${tally.checked}`);
console.log(`  flagged     ${tally.flagged}`);
console.log(`  unscannable ${tally.unscannable}`);
if (tally.deferred) console.log(`  deferred    ${tally.deferred} (large or unreadable repositories, retried next run)`);
if (tally.errors) console.log(`  errors      ${tally.errors}`);
if (stopped) console.log(`Stopped early: ${stopped}`);

console.log("");
console.log(`Catalogue coverage (${Object.keys(report.reports).length} of ${index.skills.length} skills have a report):`);
console.log(`  checked     ${totals.checked}`);
console.log(`  flagged     ${totals.flagged}`);
console.log(`  unscannable ${totals.unscannable}`);
if (totals.failedByCheck.length) {
  console.log("Most common failures:");
  for (const [id, count] of totals.failedByCheck) console.log(`  ${id.padEnd(22)} ${count}`);
}
console.log(`Wrote ${REPORT_PATH}`);

if (stopped && options.failOnStop) process.exit(2);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const parsed = {
    repos: 400,
    concurrency: 6,
    maxMinutes: 0,
    force: false,
    only: null,
    failOnStop: false,
    index: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const value = () => argv[++i];
    switch (arg) {
      case "--repos":
        parsed.repos = Number(value());
        break;
      case "--concurrency":
        parsed.concurrency = Math.max(1, Math.min(12, Number(value())));
        break;
      case "--max-minutes":
        parsed.maxMinutes = Number(value());
        break;
      case "--force":
        parsed.force = true;
        break;
      case "--only":
        parsed.only = new Set(String(value()).split(",").map((slug) => slug.trim()).filter(Boolean));
        break;
      case "--fail-on-stop":
        parsed.failOnStop = true;
        break;
      case "--index":
        parsed.index = resolve(value());
        break;
      case "--help":
        console.log(readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0]);
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }

  if (!Number.isFinite(parsed.repos) || parsed.repos <= 0) parsed.repos = 400;
  if (parsed.only) parsed.force = true; // an explicit rescan means what it says
  return parsed;
}

function loadReport() {
  if (existsSync(REPORT_PATH)) {
    try {
      const existing = JSON.parse(readFileSync(REPORT_PATH, "utf8"));
      if (existing.schema_version === SCHEMA_VERSION) {
        return {
          schema_version: SCHEMA_VERSION,
          generated_at: existing.generated_at ?? now(),
          checks: CHECKS,
          repos: existing.repos ?? {},
          reports: existing.reports ?? {},
        };
      }
      console.warn(`Report file is schema ${existing.schema_version}, this scanner writes ${SCHEMA_VERSION}. Starting fresh.`);
    } catch (error) {
      console.warn(`Could not read the existing report file (${error.message}). Starting fresh.`);
    }
  }
  return { schema_version: SCHEMA_VERSION, generated_at: now(), checks: CHECKS, repos: {}, reports: {} };
}

function save() {
  report.generated_at = now();
  report.checks = CHECKS;
  mkdirSync(dirname(REPORT_PATH), { recursive: true });
  const temporary = `${REPORT_PATH}.tmp`;
  // The file is megabytes and read at build time; a half-written one would take
  // the build down, so it is swapped in atomically.
  writeFileSync(temporary, JSON.stringify(report));
  renameSync(temporary, REPORT_PATH);
}

function unscannable(repo, reason, sha) {
  return {
    verdict: "unscannable",
    repo: repo ?? null,
    commit: sha ?? null,
    reason: truncate(reason, 200),
    scanned_at: today(),
  };
}

/**
 * Store the decision, not the prose.
 *
 * The report covers ~45,000 skills and is committed on every run, so anything
 * the site can reconstruct is dropped: the wording of a *passing* check (the
 * site owns that copy, keyed by check id), and fields that repeat the report's
 * own top level. Failures keep their summary and findings — that text is
 * evidence, generated from what the scan actually saw, and nothing else can
 * regenerate it.
 */
function compactChecks(checks) {
  const compacted = {};

  for (const [id, result] of Object.entries(checks)) {
    if (result.status === "fail") {
      compacted[id] = result;
      continue;
    }
    // A passing check only needs storing when it carries evidence of its own.
    if (id === "network-egress" && result.hosts?.length) {
      compacted[id] = { status: result.status, hosts: result.hosts };
    }
  }

  return compacted;
}

function summarise(reports) {
  const counts = { checked: 0, flagged: 0, unscannable: 0 };
  const failures = new Map();

  for (const entry of Object.values(reports)) {
    counts[entry.verdict] = (counts[entry.verdict] ?? 0) + 1;
    for (const id of entry.failed ?? []) failures.set(id, (failures.get(id) ?? 0) + 1);
  }

  return {
    ...counts,
    failedByCheck: [...failures.entries()].sort((a, b) => b[1] - a[1]),
  };
}

function truncate(value, length) {
  const text = String(value ?? "");
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

function now() {
  return new Date().toISOString();
}

/** Day precision for per-skill records: it is all the page prints. */
function today() {
  return new Date().toISOString().slice(0, 10);
}
