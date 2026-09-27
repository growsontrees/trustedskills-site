/**
 * Fetching the bytes the Checked pass scans.
 *
 * Almost every skill in the index points at skills.sh, and a skills.sh URL of
 * the form /{owner}/{collection}/{skill} maps to github.com/{owner}/{collection}.
 * That collapses 26k skills into ~4.5k repositories, so the scan fetches one
 * pinned tarball per repository and scans every skill that lives inside it.
 *
 * Tarballs are read in memory and never written to disk: a scan run must not be
 * able to leave 4,500 untrusted repositories lying around the build host.
 */

import { gunzipSync } from "node:zlib";

const API = "https://api.github.com";
const ARCHIVE = "https://github.com";
const USER_AGENT = "TrustedSkills-SafetyScan/1.0";

/**
 * Upper bounds. A skill that needs more than this is reported unscannable.
 *
 * `filesPerSkill` is deliberately modest. One tarball is a single rate-limited
 * request no matter how big the repository, but the tree-API fallback pays one
 * request per file — an unbounded fallback burned a 5,000-request hourly budget
 * in seven minutes.
 */
export const LIMITS = Object.freeze({
  tarballBytes: 60 * 1024 * 1024,
  fileBytes: 256 * 1024,
  filesPerSkill: 60,
  rawFilesPerRepo: 120,
  textBytesPerRepo: 24 * 1024 * 1024,
});

/**
 * Last rate-limit figures GitHub reported. Read by the scanner so a run can
 * show how much budget is left instead of discovering it by failing.
 */
export const rateLimit = { remaining: null, limit: null, resetAt: null };

/**
 * Whether the REST budget is spent.
 *
 * The scan's normal path never touches the REST API — head commits come from
 * git's ref advertisement and contents from codeload. Only two things need it:
 * listing a repository too large to download, and explaining a repository the
 * advertisement could not read. Once the budget is gone those are skipped
 * outright rather than retried, so an exhausted budget defers a handful of
 * repositories instead of ending the run.
 */
export const apiBudget = { exhausted: false, resetAt: null };

const TEXT_EXTENSIONS = new Set([
  ".md", ".markdown", ".mdx", ".txt", ".rst",
  ".sh", ".bash", ".zsh", ".fish", ".ksh",
  ".py", ".pyw", ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
  ".rb", ".pl", ".php", ".lua", ".r", ".jl",
  ".ps1", ".psm1", ".bat", ".cmd", ".vbs",
  ".go", ".rs", ".java", ".kt", ".cs", ".swift", ".scala",
  ".applescript", ".osascript",
  ".yml", ".yaml", ".toml", ".json", ".json5", ".ini", ".cfg", ".conf", ".env",
  ".mk", ".gradle", ".sql", ".graphql", ".html", ".css",
  ".pem", ".key", ".crt", ".cer", ".asc", ".ppk",
]);

const TEXT_FILENAMES = new Set([
  "makefile", "dockerfile", "justfile", "procfile", "rakefile", "gemfile", "brewfile", "license", "notice",
]);

/** Directories with no skill logic in them, and a lot of bytes. */
const SKIP_DIRECTORIES = new Set([
  "node_modules", ".git", ".github-cache", "dist", "build", "out", "target", "vendor", "__pycache__",
  ".venv", "venv", ".next", ".turbo", "coverage", ".pytest_cache", ".mypy_cache", "site-packages",
  "fixtures", "__snapshots__",
]);

function isTextPath(path) {
  const name = path.split("/").pop().toLowerCase();
  if (TEXT_FILENAMES.has(name)) return true;
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return false;
  return TEXT_EXTENSIONS.has(name.slice(dot));
}

function isSkippedPath(path) {
  return path.split("/").some((segment) => SKIP_DIRECTORIES.has(segment.toLowerCase()));
}

// ---------------------------------------------------------------------------
// Repository resolution
// ---------------------------------------------------------------------------

/**
 * Work out which GitHub repository (and, when known, which file) a skill came
 * from. Returns null when the skill has no resolvable GitHub source.
 */
export function resolveSource(skill) {
  // The registry records repo + path directly for GitHub-crawled skills.
  if (skill.repo && /^[\w.-]+\/[\w.-]+$/.test(skill.repo)) {
    return { repo: normaliseRepo(skill.repo), path: skill.path ?? null, via: "registry-repo" };
  }

  for (const candidate of [skill.sourceUrl, skill.repoUrl, skill.source_repo, skill.homepage]) {
    if (!candidate) continue;

    const skillsSh = /^https?:\/\/(?:www\.)?skills\.sh\/([^\/?#]+)\/([^\/?#]+)/i.exec(candidate);
    if (skillsSh) {
      return { repo: normaliseRepo(`${skillsSh[1]}/${skillsSh[2]}`), path: null, via: "skills.sh" };
    }

    const github = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[\/?#]|$)/i.exec(candidate);
    if (github) {
      const tree = /github\.com\/[\w.-]+\/[\w.-]+\/(?:tree|blob)\/[^\/]+\/(.+?)(?:[?#]|$)/i.exec(candidate);
      return { repo: normaliseRepo(`${github[1]}/${github[2]}`), path: tree ? tree[1] : null, via: "github" };
    }
  }

  return null;
}

function normaliseRepo(repo) {
  return repo.replace(/\.git$/, "").toLowerCase();
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

/**
 * Only api.github.com gets the token.
 *
 * codeload and raw.githubusercontent serve public content without credentials,
 * but an authenticated request to either one spends the 5,000/hour REST budget —
 * which is how a 233-repository run exhausted the whole hour. Unauthenticated,
 * they cost nothing from that budget, and the scan only ever reads public
 * repositories. That leaves one billed request per repository: its head commit.
 */
function headers(url, token, accept = "application/vnd.github+json") {
  const billed = url.startsWith(API);
  return {
    "User-Agent": USER_AGENT,
    Accept: accept,
    ...(billed && token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

class RateLimited extends Error {
  constructor(resetEpochSeconds) {
    super("GitHub rate limit exhausted");
    this.name = "RateLimited";
    this.resetAt = resetEpochSeconds ? new Date(resetEpochSeconds * 1000) : null;
  }
}

export { RateLimited };

async function request(url, { token, accept, timeoutMs = 60000, retries = 2 } = {}) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: headers(url, token, accept),
        redirect: "follow",
        signal: AbortSignal.timeout(timeoutMs),
      });

      const remaining = response.headers.get("x-ratelimit-remaining");
      if (remaining !== null) {
        rateLimit.remaining = Number(remaining);
        rateLimit.limit = Number(response.headers.get("x-ratelimit-limit") ?? 0) || rateLimit.limit;
        const reset = Number(response.headers.get("x-ratelimit-reset") ?? 0);
        rateLimit.resetAt = reset ? new Date(reset * 1000) : rateLimit.resetAt;
      }

      if ((response.status === 403 || response.status === 429) && remaining === "0") {
        const reset = Number(response.headers.get("x-ratelimit-reset"));
        apiBudget.exhausted = true;
        apiBudget.resetAt = reset ? new Date(reset * 1000) : null;
        throw new RateLimited(reset);
      }
      if (response.status >= 500) {
        lastError = new Error(`HTTP ${response.status}`);
      } else {
        return response;
      }
    } catch (error) {
      if (error instanceof RateLimited) throw error;
      lastError = error;
    }
    if (attempt < retries) await sleep(1500 * (attempt + 1));
  }
  throw lastError ?? new Error("request failed");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Resolve a repository's current default-branch commit.
 *
 * Read from git's own ref advertisement rather than the REST API. A catalogue
 * scan needs one head commit per repository — 4,500 of them — and the REST route
 * would spend most of an hourly budget doing it. The advertisement is a plain
 * unauthenticated HTTPS read that costs nothing from that budget, so a full cold
 * scan is not rationed. The REST API stays as the fallback, and is the only path
 * that can report *why* a repository is unreadable.
 */
export async function fetchHeadCommit(repo, { token } = {}) {
  const advertised = await fetchAdvertisedHead(repo);
  if (advertised) return advertised;

  if (apiBudget.exhausted) {
    return {
      status: "deferred",
      reason: `could not read the repository and the GitHub API budget is exhausted${
        apiBudget.resetAt ? ` until ${apiBudget.resetAt.toISOString()}` : ""
      }`,
    };
  }

  return fetchHeadCommitViaApi(repo, { token });
}

async function fetchAdvertisedHead(repo) {
  let response;
  try {
    response = await request(`https://github.com/${repo}.git/info/refs?service=git-upload-pack`, {
      accept: "application/x-git-upload-pack-advertisement",
      timeoutMs: 30000,
      retries: 1,
    });
  } catch {
    return null; // fall back to the API, which can say what went wrong
  }

  // git answers 404 for both "gone" and "private", exactly as the API does, so
  // the common case needs no API call at all.
  if (response.status === 404) return { status: "missing", reason: "repository not found or private" };
  if (!response.ok) return null;

  const body = await response.text();
  // pkt-lines of "<sha> <ref>", with HEAD's symref in the first line's
  // capability list. HEAD is advertised directly on GitHub, so prefer it.
  const head = /([0-9a-f]{40}) HEAD[\0\n]/.exec(body);
  if (head) return { status: "ok", sha: head[1], committedAt: null, via: "ref-advertisement" };

  const symref = /symref=HEAD:(\S+)/.exec(body);
  if (symref) {
    const target = new RegExp(`([0-9a-f]{40}) ${symref[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).exec(body);
    if (target) return { status: "ok", sha: target[1], committedAt: null, via: "ref-advertisement" };
  }

  return null;
}

async function fetchHeadCommitViaApi(repo, { token } = {}) {
  const response = await request(`${API}/repos/${repo}/commits?per_page=1`, { token, timeoutMs: 30000 });

  if (response.status === 404) return { status: "missing", reason: "repository not found or private" };
  if (response.status === 409) return { status: "missing", reason: "repository is empty" };
  if (response.status === 451) return { status: "missing", reason: "repository unavailable for legal reasons" };
  if (!response.ok) return { status: "error", reason: `commits request returned HTTP ${response.status}` };

  const commits = await response.json();
  const head = Array.isArray(commits) ? commits[0] : null;
  if (!head?.sha) return { status: "error", reason: "no commits on the default branch" };

  return {
    status: "ok",
    sha: head.sha,
    committedAt: head.commit?.committer?.date ?? head.commit?.author?.date ?? null,
  };
}

/**
 * Download a pinned tarball and return its text files, keyed by repo-relative
 * path. Binary files, oversized files and vendored directories are dropped:
 * the checks only read text.
 */
export async function fetchRepoFiles(repo, sha, { token } = {}) {
  // github.com/<repo>/archive rather than codeload directly: when a repository
  // has been renamed, github.com redirects to its new name and codeload returns
  // 404. Whole collections were being reported unscannable for that alone.
  const response = await request(`${ARCHIVE}/${repo}/archive/${sha}.tar.gz`, {
    token,
    accept: "application/x-gzip",
    // Some skill collections are hundreds of megabytes of vendored docs. The
    // generous ceiling is cheaper than reporting a whole collection unscannable
    // because one download was slow.
    timeoutMs: 300000,
  });

  if (!response.ok) return { status: "error", reason: `tarball request returned HTTP ${response.status}` };

  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (declaredLength > LIMITS.tarballBytes) {
    return { status: "too-large", reason: `tarball is ${Math.round(declaredLength / 1e6)} MB` };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > LIMITS.tarballBytes) {
    return { status: "too-large", reason: `tarball is ${Math.round(buffer.byteLength / 1e6)} MB` };
  }

  let tar;
  try {
    tar = gunzipSync(buffer);
  } catch (error) {
    return { status: "error", reason: `tarball could not be decompressed: ${error.message}` };
  }

  return { status: "ok", files: readTar(tar) };
}

// ---------------------------------------------------------------------------
// tar
// ---------------------------------------------------------------------------

const BLOCK = 512;

/**
 * Minimal POSIX/GNU tar reader.
 *
 * A dependency-free reader is worth the fifty lines here: the scan runs in CI
 * against untrusted archives, and the format is a header block plus padded
 * content. Only regular files are extracted, and entry paths are normalised so
 * a crafted archive cannot describe anything outside its own tree — nothing is
 * written to disk either way.
 */
function readTar(buffer) {
  const files = new Map();
  let offset = 0;
  let longName = null;
  let textBytes = 0;

  while (offset + BLOCK <= buffer.length) {
    const header = buffer.subarray(offset, offset + BLOCK);
    if (header.every((byte) => byte === 0)) break; // end-of-archive padding

    const rawName = cstring(header.subarray(0, 100));
    const prefix = cstring(header.subarray(345, 500));
    const size = parseOctal(header.subarray(124, 136));
    const typeFlag = String.fromCharCode(header[156] || 48);
    const contentStart = offset + BLOCK;
    const contentEnd = contentStart + size;

    offset = contentStart + Math.ceil(size / BLOCK) * BLOCK;
    if (contentEnd > buffer.length) break;

    // GNU long-name entry: the next header's name lives in this entry's body.
    if (typeFlag === "L") {
      longName = cstring(buffer.subarray(contentStart, contentEnd));
      continue;
    }
    // pax extended headers carry no file content we need.
    if (typeFlag === "x" || typeFlag === "g") {
      longName = null;
      continue;
    }

    const name = longName ?? (prefix ? `${prefix}/${rawName}` : rawName);
    longName = null;

    if (typeFlag !== "0" && typeFlag !== "\0" && typeFlag !== "7") continue;

    const path = stripArchiveRoot(name);
    if (!path || isSkippedPath(path) || !isTextPath(path)) continue;
    if (size > LIMITS.fileBytes) continue;
    if (textBytes + size > LIMITS.textBytesPerRepo) continue;

    const body = buffer.subarray(contentStart, contentEnd);
    if (body.includes(0)) continue; // binary despite the extension

    textBytes += size;
    files.set(path, body.toString("utf8"));
  }

  return files;
}

/** Drop the `{repo}-{sha}/` wrapper directory GitHub adds, and any `..`. */
function stripArchiveRoot(name) {
  const parts = name.replace(/\\/g, "/").split("/").slice(1);
  if (parts.some((part) => part === ".." || part === "")) {
    return parts.filter((part) => part && part !== "..").join("/");
  }
  return parts.join("/");
}

function cstring(bytes) {
  const end = bytes.indexOf(0);
  return bytes.subarray(0, end === -1 ? bytes.length : end).toString("utf8").trim();
}

function parseOctal(bytes) {
  // GNU base-256 encoding for sizes that do not fit in 11 octal digits.
  if (bytes[0] & 0x80) {
    let value = bytes[0] & 0x7f;
    for (let i = 1; i < bytes.length; i += 1) value = value * 256 + bytes[i];
    return value;
  }
  const text = cstring(bytes).replace(/[^0-7]/g, "");
  return text ? parseInt(text, 8) : 0;
}

// ---------------------------------------------------------------------------
// Locating a skill inside a repository
// ---------------------------------------------------------------------------

/**
 * Find the SKILL.md (or SKILL.mds) that belong to a given skill.
 *
 * The registry records an in-repo path for GitHub-crawled skills but not for
 * skills.sh entries, and a skills.sh slug is not always the upstream directory
 * name — skills.sh drops publisher prefixes, so `tavily-research` is indexed as
 * `research`. The candidates are therefore matched in descending order of
 * confidence, and anything that cannot be attributed is reported rather than
 * guessed: scanning another skill's files would make the verdict worse than
 * useless.
 *
 * A repository can also vendor the same skill twice (`.claude/skills/x/` and
 * `bundle/skills/x/`). Both copies are returned and scanned together: the skill
 * is only Checked if every shipped copy of it passes.
 *
 * @param {string[]} paths        every path in the repository
 * @param {object}   skill        the index record
 * @param {string}   recordedPath path the registry recorded, if any
 * @param {(path: string) => string|undefined} [getText] reads a file, when the
 *        contents are available for frontmatter matching
 */
export function locateSkill(paths, skill, recordedPath, getText) {
  const manifests = paths.filter((path) => /(^|\/)SKILL\.md$/i.test(path));
  if (manifests.length === 0) return { status: "missing", reason: "no SKILL.md in the repository" };

  if (recordedPath) {
    const wanted = recordedPath.replace(/^\.?\//, "").toLowerCase();
    const exact = manifests.filter(
      (path) => path.toLowerCase() === wanted || path.toLowerCase() === `${wanted.replace(/\/$/, "")}/skill.md`
    );
    if (exact.length) return { status: "ok", paths: exact.slice(0, 3), match: "recorded-path" };
  }

  const names = candidateNames(skill);

  for (const name of names) {
    const byDirectory = manifests.filter((path) => leafDirectory(path) === name);
    if (byDirectory.length) return { status: "ok", paths: rank(byDirectory), match: "directory-name" };
  }

  // Single-skill repository: the one manifest is unambiguously this skill's.
  if (manifests.length === 1) return { status: "ok", paths: manifests, match: "only-manifest" };

  if (getText) {
    for (const name of names) {
      const byFrontmatter = manifests.filter((path) => frontmatterName(getText(path)) === name);
      if (byFrontmatter.length) return { status: "ok", paths: rank(byFrontmatter), match: "frontmatter-name" };
    }
  }

  // skills.sh strips publisher prefixes from slugs, so `research` may be
  // `tavily-research` upstream. Only accepted when it identifies one skill.
  for (const name of names) {
    const suffixMatches = manifests.filter((path) => leafDirectory(path).endsWith(`-${name}`));
    const distinct = new Set(suffixMatches.map(leafDirectory));
    if (suffixMatches.length && distinct.size === 1) {
      return { status: "ok", paths: rank(suffixMatches), match: "prefixed-directory-name" };
    }
  }

  if (getText) {
    for (const name of names) {
      const suffixMatches = manifests.filter((path) => (frontmatterName(getText(path)) ?? "").endsWith(`-${name}`));
      const distinct = new Set(suffixMatches.map((path) => frontmatterName(getText(path))));
      if (suffixMatches.length && distinct.size === 1) {
        return { status: "ok", paths: rank(suffixMatches), match: "prefixed-frontmatter-name" };
      }
    }
  }

  return {
    status: "ambiguous",
    reason:
      `none of the ${manifests.length} skills in the repository match this slug — ` +
      `it was most likely renamed or removed upstream after the registry indexed it`,
  };
}

/** Shortest, shallowest path first — the canonical copy, not a vendored one. */
function rank(paths) {
  return [...paths].sort((a, b) => a.split("/").length - b.split("/").length || a.length - b.length).slice(0, 3);
}

function leafDirectory(path) {
  return directoryOf(path).split("/").pop()?.toLowerCase() ?? "";
}

function candidateNames(skill) {
  const names = new Set();
  // Registry slugs gain a -2/-3 suffix when two collections ship the same name.
  for (const value of [skill.slug, skill.name, skill.slug?.replace(/-\d+$/, "")]) {
    if (!value) continue;
    names.add(String(value).toLowerCase());
    names.add(String(value).toLowerCase().replace(/[\s_]+/g, "-"));
  }
  return [...names].filter(Boolean);
}

function frontmatterName(text) {
  const match = /^﻿?---[\s\S]*?\bname\s*:\s*["']?([^"'\r\n]+)/.exec(String(text ?? ""));
  return match ? match[1].trim().toLowerCase() : null;
}

export function directoryOf(path) {
  const index = path.lastIndexOf("/");
  return index === -1 ? "" : path.slice(0, index);
}

/**
 * Every file that belongs to the skill: everything under the directory of each
 * of its manifests. A manifest at the repository root means a single-skill
 * repository, so the whole repository is the skill.
 */
export function filesForSkill(files, manifestPaths) {
  const directories = [...new Set(manifestPaths.map(directoryOf))];

  // A manifest at the repository root claims the whole repository, which is
  // right for a single-skill repo and wrong the moment another skill lives in a
  // subdirectory — its files would be reported as this skill's. Other skills'
  // trees are excluded either way.
  const foreign = [...files.keys()]
    .filter((path) => /(^|\/)SKILL\.md$/i.test(path))
    .map(directoryOf)
    .filter((directory) => directory && !directories.includes(directory));

  const selected = [];

  for (const [path, text] of files) {
    const belongs = directories.some((directory) => (directory ? path.startsWith(`${directory}/`) : true));
    if (!belongs) continue;
    if (foreign.some((directory) => path.startsWith(`${directory}/`))) continue;
    selected.push({ path, text });
    if (selected.length >= LIMITS.filesPerSkill) break;
  }

  return selected;
}

// ---------------------------------------------------------------------------
// Large repositories
// ---------------------------------------------------------------------------

/**
 * List a repository's files without downloading it.
 *
 * Some skills live in repositories that are hundreds of megabytes (a skill
 * inside a product monorepo). Pulling the tarball for one directory is
 * wasteful and sometimes impossible, so those are read through the tree API
 * plus raw file fetches instead. Raw fetches do not consume the REST rate
 * limit, so the cost is one API call per repository either way.
 */
export async function fetchRepoTree(repo, sha, { token } = {}) {
  if (apiBudget.exhausted) {
    return { status: "deferred", reason: "the GitHub API budget for large repositories is exhausted" };
  }

  const response = await request(`${API}/repos/${repo}/git/trees/${sha}?recursive=1`, { token, timeoutMs: 60000 });
  if (!response.ok) return { status: "error", reason: `tree request returned HTTP ${response.status}` };

  const tree = await response.json();
  if (!Array.isArray(tree.tree)) return { status: "error", reason: "tree response had no entries" };

  const entries = tree.tree
    .filter((entry) => entry.type === "blob" && isTextPath(entry.path) && !isSkippedPath(entry.path))
    .map((entry) => ({ path: entry.path, size: entry.size ?? 0 }));

  return { status: "ok", entries, truncated: Boolean(tree.truncated) };
}

/**
 * Fetch specific files at a pinned commit, a batch at a time. Raw fetches are
 * cheap but a monorepo can need dozens of them, so they run in parallel rather
 * than turning one skill into a minute of serial round trips.
 */
export async function fetchRawFiles(repo, sha, paths, { token, batchSize = 8, budget } = {}) {
  const files = new Map();
  const cap = budget ? Math.min(LIMITS.filesPerSkill, Math.max(0, budget.remaining)) : LIMITS.filesPerSkill;
  const wanted = paths.slice(0, cap);
  if (budget) budget.remaining -= wanted.length;
  let bytes = 0;

  for (let i = 0; i < wanted.length; i += batchSize) {
    if (bytes > LIMITS.textBytesPerRepo) break;

    const batch = wanted.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (path) => {
        try {
          const response = await request(`https://raw.githubusercontent.com/${repo}/${sha}/${encodePath(path)}`, {
            token,
            accept: "text/plain",
            timeoutMs: 30000,
            retries: 1,
          });
          if (!response.ok) return null;
          const text = await response.text();
          if (text.length > LIMITS.fileBytes || text.includes("\u0000")) return null;
          return { path, text };
        } catch (error) {
          if (error instanceof RateLimited) throw error;
          return null; // one unreadable file must not lose the whole skill
        }
      })
    );

    for (const file of results) {
      if (!file) continue;
      bytes += file.text.length;
      files.set(file.path, file.text);
    }
  }

  return files;
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}
