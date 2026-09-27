/**
 * The "Checked" safety pass.
 *
 * Static analysis of a single skill's own files, producing one result per check
 * rather than a bare pass/fail. The per-check results are what the skill page
 * renders: a skill that fails is more interesting than one that passes, and a
 * pass is only a trust claim if we can say exactly what was looked at.
 *
 * Nothing here touches the network or the filesystem — it takes the skill's
 * files as text and returns a report. That keeps it testable, and keeps the
 * fetching concerns in github-source.mjs.
 *
 * Scope rules that make the claim honest:
 *
 *   - Executable context (script files, config files, and fenced code blocks
 *     inside SKILL.md) is scanned for all patterns. This is where real code
 *     lives, so a hit here fails the check.
 *   - SKILL.md prose is also scanned, but only for *instructions* — a
 *     credential path or an outbound URL next to an imperative verb. For an
 *     agent skill the prose is the payload, so a skill whose markdown tells the
 *     agent to read ~/.ssh and POST it somewhere has to fail even though it
 *     ships no code. Documentation that merely mentions a path ("never commit
 *     your .env") does not match.
 *   - Prose links are not network calls. A skill that links to a blog post in
 *     its docs is not contacting that host, and treating it as egress would
 *     make the check meaningless.
 */

// ---------------------------------------------------------------------------
// Check definitions — the public description of what "Checked" means.
// The scanner copies this into the report file so the site renders the same
// wording it was scanned against, even for an older report.
// ---------------------------------------------------------------------------

export const CHECKS = Object.freeze([
  {
    id: "skill-manifest",
    label: "Declares what it does",
    question: "SKILL.md exists, its frontmatter parses, and it declares a name and a description.",
  },
  {
    id: "network-egress",
    label: "No undeclared network calls",
    question:
      "Every host the skill dials — from its scripts, its config endpoints or the commands it tells the agent to run — is either well-known package and API infrastructure or declared in its own frontmatter. Links in documentation are not counted.",
  },
  {
    id: "no-obfuscation",
    label: "No obfuscated payloads",
    question: "No base64, hex or compressed blob is decoded and then executed, and no encoded shell commands.",
  },
  {
    id: "no-credential-access",
    label: "No credential access",
    question:
      "Neither the code nor the SKILL.md instructions read SSH keys, cloud credentials, keychains, token stores, browser cookie databases or dotfiles that hold secrets.",
  },
  {
    id: "no-remote-installer",
    label: "No pipe-to-shell installers",
    question: "No `curl … | sh` pattern, in the code or in the instructions, that runs code fetched at run time.",
  },
  {
    id: "pinned-source",
    label: "Pinned to a commit",
    question: "The exact upstream commit SHA that was scanned is recorded, so the result refers to specific bytes.",
  },
]);

export const CHECK_IDS = Object.freeze(CHECKS.map((check) => check.id));

// ---------------------------------------------------------------------------
// Hosts
// ---------------------------------------------------------------------------

/**
 * Hosts a skill may contact without declaring them. Deliberately narrow: this
 * is package infrastructure, first-party model APIs, and the documentation and
 * standards hosts that show up in code comments and link constants.
 *
 * Installer hosts (get.docker.com, sh.rustup.rs, install.python-poetry.org …)
 * are NOT here. Fetching a script from them is the thing no-remote-installer
 * is looking for.
 */
export const KNOWN_HOSTS = Object.freeze({
  // Source hosting
  "github.com": "source host",
  "www.github.com": "source host",
  "api.github.com": "source host",
  "raw.githubusercontent.com": "source host",
  "objects.githubusercontent.com": "source host",
  "codeload.github.com": "source host",
  "gist.github.com": "source host",
  "gist.githubusercontent.com": "source host",
  "gitlab.com": "source host",
  "bitbucket.org": "source host",
  "skills.sh": "source host",
  "www.skills.sh": "source host",

  // Package registries
  "registry.npmjs.org": "package registry",
  "npmjs.com": "package registry",
  "www.npmjs.com": "package registry",
  "registry.yarnpkg.com": "package registry",
  "pypi.org": "package registry",
  "files.pythonhosted.org": "package registry",
  "crates.io": "package registry",
  "static.crates.io": "package registry",
  "index.crates.io": "package registry",
  "rubygems.org": "package registry",
  "proxy.golang.org": "package registry",
  "sum.golang.org": "package registry",
  "repo.maven.apache.org": "package registry",
  "packagist.org": "package registry",
  "hub.docker.com": "package registry",
  "ghcr.io": "package registry",
  "registry-1.docker.io": "package registry",

  // Model and agent APIs
  "api.anthropic.com": "model provider",
  "api.openai.com": "model provider",
  "api.mistral.ai": "model provider",
  "api.groq.com": "model provider",
  "api.deepseek.com": "model provider",
  "api.cohere.ai": "model provider",
  "api.cohere.com": "model provider",
  "generativelanguage.googleapis.com": "model provider",
  "openrouter.ai": "model provider",
  "huggingface.co": "model provider",
  "api-inference.huggingface.co": "model provider",

  // Documentation and standards
  "docs.anthropic.com": "documentation",
  "platform.openai.com": "documentation",
  "modelcontextprotocol.io": "documentation",
  "spec.modelcontextprotocol.io": "documentation",
  "developer.mozilla.org": "documentation",
  "nodejs.org": "documentation",
  "docs.python.org": "documentation",
  "schema.org": "standards",
  "json-schema.org": "standards",
  "www.w3.org": "standards",
  "spec.openapis.org": "standards",
  "semver.org": "standards",
  "keepachangelog.com": "standards",
  "opensource.org": "standards",
  "choosealicense.com": "standards",
  "www.gnu.org": "standards",
  "www.apache.org": "standards",
  "creativecommons.org": "standards",
  "unlicense.org": "standards",
});

/** Host suffixes treated the same way as KNOWN_HOSTS entries. */
export const KNOWN_HOST_SUFFIXES = Object.freeze([
  { suffix: ".github.io", label: "project documentation" },
  { suffix: ".readthedocs.io", label: "project documentation" },
  { suffix: ".localhost", label: "local" },
  { suffix: ".local", label: "local" },
  { suffix: ".internal", label: "local" },
]);

/** Loopback and in-container addresses. Not egress. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "host.docker.internal"]);

/**
 * Hosts that are obviously stand-ins rather than real endpoints. Failing a
 * skill because its docs show `https://api.example.com/v1` would be noise.
 */
function isPlaceholderHost(host) {
  if (!host) return true;
  if (/[<>{}$()\[\]*%|`"']/.test(host)) return true; // interpolated or templated
  if (!host.includes(".")) return true; // bare word, not a resolvable host
  if (!isValidHostSyntax(host)) return true; // `...`, `your.domain.here`, typos
  if (/\bexample\b/.test(host)) return true;
  if (/^(?:your|my|the)[-.]/.test(host)) return true;
  // Whole-host stand-ins only. Matching a leading label like `api.` or `host.`
  // would excuse api.<anything>.com, which is most real egress there is.
  if (/^(?:myapp|mysite|myserver|mydomain|mycompany|myproject|myservice|yourapp|yoursite|yourserver|yourdomain|yourcompany|placeholder|dummy|sample|somehost|someserver|somewhere|test|foo|bar|baz)\.[a-z]{2,24}$/.test(host)) {
    return true;
  }
  if (/^(?:placeholder|dummy|sample|somehost|someserver)\./.test(host)) return true;
  if (/\.(?:example|test|invalid|localhost|tld|xxx)$/.test(host)) return true;
  return false;
}

/** A syntactically resolvable hostname, or a dotted-quad address. */
function isValidHostSyntax(host) {
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return true;
  if (host.length > 253) return false;
  return /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(host);
}

export function classifyHost(host) {
  if (LOCAL_HOSTS.has(host)) return "local";
  if (KNOWN_HOSTS[host]) return KNOWN_HOSTS[host];
  for (const { suffix, label } of KNOWN_HOST_SUFFIXES) {
    if (host.endsWith(suffix)) return label;
  }
  return null;
}

// ---------------------------------------------------------------------------
// File scoping
// ---------------------------------------------------------------------------

/** Extensions whose whole contents are executable or configuration context. */
const CODE_EXTENSIONS = new Set([
  ".sh", ".bash", ".zsh", ".fish", ".ksh",
  ".py", ".pyw",
  ".js", ".mjs", ".cjs", ".jsx", ".ts", ".tsx",
  ".rb", ".pl", ".php", ".lua", ".r", ".jl",
  ".ps1", ".psm1", ".bat", ".cmd", ".vbs",
  ".go", ".rs", ".java", ".kt", ".cs", ".swift", ".scala",
  ".applescript", ".osascript",
  ".yml", ".yaml", ".toml", ".json", ".json5", ".ini", ".cfg", ".env", ".conf",
  ".mk", ".dockerfile", ".gradle",
  // Key and certificate files: a committed private key is exactly what
  // no-credential-access is looking for, so they have to be in scope.
  ".pem", ".key", ".crt", ".cer", ".asc", ".ppk",
]);

/** Filenames with no useful extension that are still code. */
const CODE_FILENAMES = new Set(["makefile", "dockerfile", "justfile", "procfile", "rakefile", "gemfile", "brewfile"]);

export function isCodeFile(path) {
  const name = path.split("/").pop().toLowerCase();
  if (CODE_FILENAMES.has(name)) return true;
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return false;
  return CODE_EXTENSIONS.has(name.slice(dot));
}

export function isMarkdownFile(path) {
  return /\.(md|markdown|mdx)$/i.test(path);
}

/** Configuration formats, where a URL is an endpoint rather than a link. */
const CONFIG_EXTENSIONS = new Set([
  ".yml", ".yaml", ".toml", ".json", ".json5", ".ini", ".cfg", ".conf", ".env",
  ".pem", ".key", ".crt", ".cer", ".asc", ".ppk",
]);

function isConfigFile(path) {
  const name = path.split("/").pop().toLowerCase();
  const dot = name.lastIndexOf(".");
  return dot > 0 && CONFIG_EXTENSIONS.has(name.slice(dot));
}

const COMMENT_LINE = /^\s*(?:#|\/\/|\/\*|\*(?!\/)|--|;|<!--|"""|''')/;

/**
 * Classify every line of a skill into the scopes the checks read.
 *
 * kind is one of:
 *   script   a line of an executable file
 *   config   a line of a config file (endpoints live here, links do not)
 *   fence    a line inside a fenced code block in markdown
 *   prose    markdown outside fences; `manifest` marks SKILL.md, which is the
 *            surface the agent is actually instructed from
 */
export function collectLines(files) {
  const lines = [];

  for (const file of files) {
    const text = String(file.text ?? "");
    const fileLines = text.split(/\r?\n/);
    const isManifest = /(^|\/)SKILL\.md$/i.test(file.path);

    if (isCodeFile(file.path)) {
      const kind = isConfigFile(file.path) ? "config" : "script";
      fileLines.forEach((line, i) =>
        lines.push({
          file: file.path,
          line: i + 1,
          text: line,
          kind,
          comment: kind === "script" && COMMENT_LINE.test(line),
        })
      );
      continue;
    }

    if (!isMarkdownFile(file.path)) continue;

    // Fences are tracked by marker character and length so a nested ``` inside
    // a ```` block does not invert the rest of the file — getting this wrong
    // silently reclassified prose as code.
    let fence = null;
    fileLines.forEach((line, i) => {
      const marker = /^\s*(`{3,}|~{3,})\s*(\S*)/.exec(line);
      if (marker) {
        const [, run, info] = marker;
        if (!fence) {
          fence = { char: run[0], length: run.length };
          return;
        }
        if (run[0] === fence.char && run.length >= fence.length && !info) {
          fence = null;
          return;
        }
      }
      lines.push({
        file: file.path,
        line: i + 1,
        text: line,
        kind: fence ? "fence" : "prose",
        manifest: isManifest,
      });
    });
  }

  return lines;
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

/**
 * Read a SKILL.md's YAML frontmatter without a YAML dependency. Skill
 * frontmatter is flat scalars and simple lists, so a line reader is enough —
 * and a parser that cannot throw is the right trade for a scan over 26k files.
 */
export function parseFrontmatter(text) {
  const match = /^﻿?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/.exec(String(text ?? ""));
  if (!match) return null;

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey = null;

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    const line = rawLine.replace(/\s+$/, "");
    if (!line || /^\s*#/.test(line)) continue;

    const listItem = /^\s*-\s+(.*)$/.exec(line);
    if (listItem && currentKey) {
      const value = unquote(listItem[1]);
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      if (value) data[currentKey].push(value);
      continue;
    }

    const pair = /^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/.exec(line);
    if (!pair) continue;

    const key = pair[1];
    const value = pair[2].trim();
    currentKey = key;

    // Block scalars (`description: |`) are common in skill frontmatter, and
    // treating one as an empty value would wrongly fail skill-manifest.
    if (value === "|" || value === ">" || /^[|>][+-]?\d*$/.test(value)) {
      const block = [];
      while (i + 1 < lines.length && (lines[i + 1].trim() === "" || /^\s+\S/.test(lines[i + 1]))) {
        block.push(lines[++i].trim());
      }
      data[key] = block.join(value.startsWith(">") ? " " : "\n").trim();
    } else if (value === "") {
      data[key] = "";
    } else if (/^\[.*\]$/.test(value)) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((part) => unquote(part.trim()))
        .filter(Boolean);
    } else {
      data[key] = unquote(value);
    }
  }

  return data;
}

function unquote(value) {
  const trimmed = String(value).trim();
  if (/^".*"$/.test(trimmed) || /^'.*'$/.test(trimmed)) return trimmed.slice(1, -1);
  return trimmed;
}

/** Frontmatter keys a skill can use to declare the hosts it talks to. */
const DECLARED_HOST_KEYS = [
  "allowed-domains",
  "allowed_domains",
  "allowedDomains",
  "allowed-hosts",
  "allowed_hosts",
  "allowedHosts",
  "domains",
  "hosts",
  "endpoints",
  "network",
];

export function declaredHosts(frontmatter) {
  const hosts = new Set();
  if (!frontmatter) return hosts;

  for (const key of DECLARED_HOST_KEYS) {
    const value = frontmatter[key];
    if (!value) continue;
    const parts = Array.isArray(value) ? value : String(value).split(/[\s,;]+/);
    for (const part of parts) {
      const host = hostFromValue(part);
      if (host) hosts.add(host);
    }
  }

  return hosts;
}

function hostFromValue(value) {
  const cleaned = String(value).trim().replace(/^['"]|['"]$/g, "");
  if (!cleaned) return null;
  const withoutScheme = cleaned.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const host = withoutScheme.split(/[/:?#]/)[0].toLowerCase();
  return host || null;
}

// ---------------------------------------------------------------------------
// Patterns
// ---------------------------------------------------------------------------

const URL_PATTERN = /\b(?:https?|wss?|ftp):\/\/([^\s"'`<>)\]},;\\|]+)/gi;

/** Calls that actually move bytes over the wire. */
const NETWORK_CALL_PATTERN =
  /\b(curl|wget|httpie|\bhttp\b|nc|netcat|telnet|scp|sftp|rsync|ssh|fetch|axios|requests\.(?:get|post|put|patch|delete|request)|urllib|urlopen|http\.(?:get|post|request|client)|HttpClient|WebClient|Invoke-WebRequest|Invoke-RestMethod|iwr|curl\.exe|XMLHttpRequest|got\(|superagent|node-fetch|aiohttp|httpx)\b/i;

const OBFUSCATION_PATTERNS = [
  {
    id: "base64-exec",
    label: "base64 payload piped into a shell or interpreter",
    pattern: /base64\s+(?:-{1,2}d(?:ecode)?\b|-D\b)[^\n|]*\|\s*(?:sh|bash|zsh|python[0-9.]*|node|perl|ruby|php)\b/i,
  },
  {
    id: "echo-base64-exec",
    label: "encoded string decoded and executed",
    pattern: /echo\s+[^\n|]*\|\s*base64\s+-{1,2}d[^\n|]*\|\s*(?:sh|bash|zsh|python[0-9.]*|node)\b/i,
  },
  { id: "atob-eval", label: "eval of a base64-decoded string", pattern: /\b(?:eval|Function|setTimeout)\s*\(\s*(?:window\.)?atob\s*\(/i },
  { id: "buffer-base64-eval", label: "eval of a base64 Buffer", pattern: /\b(?:eval|Function)\s*\(\s*Buffer\.from\s*\([^)]*['"]base64['"]/i },
  { id: "python-b64-exec", label: "exec of a base64-decoded payload", pattern: /\b(?:exec|eval)\s*\(\s*(?:base64|codecs|binascii)\.[a-z0-9_]*decode/i },
  { id: "python-exec-compile", label: "exec(compile(...)) of assembled source", pattern: /\bexec\s*\(\s*compile\s*\(/i },
  { id: "python-marshal", label: "marshal/pickle payload executed", pattern: /\b(?:marshal|pickle)\.loads?\s*\(/i },
  { id: "zlib-exec", label: "compressed payload decompressed and executed", pattern: /\b(?:exec|eval)\s*\(\s*(?:zlib|gzip|lzma|bz2)\.decompress/i },
  { id: "powershell-encoded", label: "PowerShell -EncodedCommand", pattern: /powershell(?:\.exe)?[^\n]*\s-(?:e|ec|enc|encodedcommand)\b/i },
  { id: "powershell-frombase64", label: "PowerShell FromBase64String executed", pattern: /FromBase64String\s*\([^)]*\)[^\n]*\|\s*(?:iex|Invoke-Expression)/i },
  { id: "iex-webclient", label: "downloaded string passed to Invoke-Expression", pattern: /(?:iex|Invoke-Expression)\s*\(?\s*(?:\(New-Object\s+Net\.WebClient\)|Invoke-WebRequest|iwr|New-Object\s+System\.Net\.WebClient)/i },
  { id: "hex-escape-blob", label: "long hex-escaped string literal", pattern: /(?:\\x[0-9a-fA-F]{2}){24,}/ },
  { id: "unicode-escape-blob", label: "long unicode-escaped string literal", pattern: /(?:\\u00[0-9a-fA-F]{2}){24,}/ },
  { id: "char-code-blob", label: "string assembled from character codes", pattern: /(?:String\.fromCharCode|chr\s*\()\s*\(?\s*(?:\d{1,3}\s*,\s*){15,}/i },
  { id: "reversed-string-exec", label: "reversed string executed", pattern: /\b(?:eval|exec)\s*\(\s*(?:[^)]*\[::-1\]|[^)]*\.reverse\(\)\.join)/i },
];

/** A standalone base64 literal long enough to hide a payload. */
const LONG_BASE64_PATTERN = /(?:^|[^A-Za-z0-9+/=])([A-Za-z0-9+/]{220,}={0,2})(?:[^A-Za-z0-9+/=]|$)/;

const CREDENTIAL_PATTERNS = [
  { id: "ssh-keys", label: "SSH private keys or config", pattern: /(?:~|\$HOME|\$\{HOME\}|%USERPROFILE%|\bHOME\b\s*[+,)]?\s*['"]?)[\/\\]\.ssh\b|\bid_(?:rsa|dsa|ecdsa|ed25519)\b(?!\.pub)|\/\.ssh\/(?:config|known_hosts|authorized_keys)\b/i },
  {
    id: "private-key-blob",
    label: "private key material",
    pattern: /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/,
    // A key header in a real file is a committed secret; the same header in a
    // documented example (a TLS secret in a Kubernetes manifest snippet) is
    // illustration, so markdown code blocks are out of scope for this one.
    kinds: ["script", "config"],
  },
  { id: "aws-credentials", label: "AWS credentials file", pattern: /[\/\\]\.aws[\/\\](?:credentials|config)\b/i },
  { id: "gcloud-credentials", label: "Google Cloud credentials", pattern: /[\/\\]\.config[\/\\]gcloud\b|application_default_credentials\.json/i },
  { id: "kube-config", label: "Kubernetes credentials", pattern: /[\/\\]\.kube[\/\\]config\b/i },
  { id: "docker-config", label: "Docker registry credentials", pattern: /[\/\\]\.docker[\/\\]config\.json\b/i },
  { id: "npm-credentials", label: "npm auth token", pattern: /(?:~|\$HOME|\$\{HOME\}|%USERPROFILE%)[\/\\]\.npmrc\b|_authToken\s*=/i },
  { id: "netrc", label: ".netrc credentials", pattern: /[\/\\]\.netrc\b|_netrc\b/i },
  { id: "git-credentials", label: "stored git credentials", pattern: /[\/\\]\.git-credentials\b|credential\.helper\s+store/i },
  { id: "gh-hosts", label: "GitHub CLI token store", pattern: /[\/\\]\.config[\/\\]gh[\/\\]hosts\.ya?ml\b/i },
  { id: "keychain", label: "OS keychain / credential manager", pattern: /\bsecurity\s+(?:find-(?:generic|internet)-password|dump-keychain)\b|\blogin\.keychain\b|\bcmdkey\s+\/list\b|\bsecret-tool\s+(?:lookup|search)\b|\bkeyring\.get_password\b/i },
  { id: "gnupg", label: "GnuPG private keyring", pattern: /[\/\\]\.gnupg\b/i },
  { id: "browser-secrets", label: "browser cookie or password store", pattern: /\b(?:Cookies|Login\s?Data|Web\s?Data)\b[^\n]*\b(?:Chrome|Chromium|Edge|Brave|Firefox|Safari)\b|\b(?:Chrome|Chromium|Edge|Brave|Firefox)\b[^\n]*\b(?:Cookies|Login\s?Data)\b|cookies\.sqlite|logins\.json/i },
  { id: "password-manager", label: "password manager store", pattern: /[\/\\]\.config[\/\\]op\b|\b1password\b[^\n]*\b(?:vault|export)\b|\bbw\s+(?:list|get)\s+items?\b|\bpass\s+show\b/i },
  { id: "wallet", label: "crypto wallet store", pattern: /\bwallet\.dat\b|[\/\\]\.electrum\b|[\/\\]Exodus[\/\\]exodus\.wallet\b|[\/\\]\.ethereum[\/\\]keystore\b/i },
  { id: "home-dotenv", label: "environment file outside the project", pattern: /(?:~|\$HOME|\$\{HOME\}|%USERPROFILE%)[\/\\][^\s"'`]*\.env\b|(?:\.\.[\/\\]){2,}[^\s"'`]*\.env\b/i },
];

/** Reading the whole environment is only interesting when it leaves the box. */
const ENV_DUMP_PATTERN = /\b(?:printenv|env\s*\||set\s*\||os\.environ\b(?!\s*\.get)|process\.env\b(?!\s*\.)|Get-ChildItem\s+Env:)/i;

const INSTALLER_PATTERNS = [
  { id: "curl-pipe-shell", label: "remote script piped into a shell", pattern: /\b(?:curl|wget|fetch)\b[^\n|]*\|\s*(?:sudo\s+)?(?:sh|bash|zsh|ksh|fish|dash)\b/i },
  { id: "curl-pipe-interpreter", label: "remote script piped into an interpreter", pattern: /\b(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:python[0-9.]*|node|perl|ruby|php)\b/i },
  { id: "process-substitution", label: "remote script run via process substitution", pattern: /\b(?:sh|bash|zsh)\s+(?:-[a-z]+\s+)*<\(\s*(?:curl|wget)\b/i },
  { id: "shell-command-substitution", label: "remote script run via command substitution", pattern: /\b(?:sh|bash|eval)\s+(?:-c\s+)?["']?\$\(\s*(?:curl|wget)\b/i },
  { id: "eval-remote", label: "eval of a downloaded response", pattern: /\beval\s+["']?\$\(\s*(?:curl|wget)\b/i },
  { id: "iwr-iex", label: "PowerShell download-and-run", pattern: /\b(?:iwr|Invoke-WebRequest|Invoke-RestMethod)\b[^\n|]*\|\s*(?:iex|Invoke-Expression)\b/i },
  { id: "pip-install-url", label: "pip install straight from a URL", pattern: /\bpip[0-9.]*\s+install\b[^\n]*\bhttps?:\/\//i },
  { id: "npm-install-url", label: "npm install straight from a URL", pattern: /\bnpm\s+(?:i|install)\b[^\n]*\bhttps?:\/\/(?!registry\.npmjs\.org)/i },
];

/** Imperative verbs that turn a prose mention into a prose instruction. */
const IMPERATIVE_READ = /\b(?:read|cat|open|load|dump|copy|collect|gather|extract|retrieve|grab|exfiltrate|list the contents of)\b/i;
const IMPERATIVE_SEND = /\b(?:send|post|upload|transmit|forward|report|exfiltrate|sync|push|submit|report back|share)\b/i;

// ---------------------------------------------------------------------------
// Findings
// ---------------------------------------------------------------------------

const MAX_FINDINGS_PER_CHECK = 3;
const MAX_EVIDENCE_LENGTH = 160;

function finding(entry, detail, scope = "code") {
  const text = entry.text.trim();
  return {
    file: entry.file,
    line: entry.line,
    scope,
    detail,
    evidence: text.length > MAX_EVIDENCE_LENGTH ? `${text.slice(0, MAX_EVIDENCE_LENGTH - 1)}…` : text,
  };
}

function result(status, summary, extra = {}) {
  const value = { status, summary, ...extra };
  if (Array.isArray(value.findings)) {
    value.matches = value.findings.length;
    value.findings = value.findings.slice(0, MAX_FINDINGS_PER_CHECK);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Individual checks
// ---------------------------------------------------------------------------

function checkManifest(skillMd, frontmatter) {
  if (!skillMd) {
    return result("fail", "No SKILL.md was found in the skill's directory.");
  }
  if (!frontmatter) {
    return result("fail", "SKILL.md has no YAML frontmatter, so it declares nothing machine-readable.");
  }

  const name = String(frontmatter.name ?? "").trim();
  const description = String(frontmatter.description ?? "").trim();
  const missing = [];
  if (!name) missing.push("name");
  if (!description) missing.push("description");

  if (missing.length) {
    return result("fail", `SKILL.md frontmatter is missing ${missing.join(" and ")}.`, { missing });
  }

  const body = skillMd.text.replace(/^---[\s\S]*?\n---/, "").trim();
  if (body.length < 80) {
    return result("fail", "SKILL.md declares a name and description but has almost no body, so there is nothing to review.", {
      bodyLength: body.length,
    });
  }

  return result("pass", `Declares "${name}" with a ${description.length}-character description.`, {
    declaredName: name,
    descriptionLength: description.length,
  });
}

/**
 * A URL only counts as egress where the skill would actually dial it.
 *
 * Without this, every skill that links to react.dev from a README failed the
 * check, which would make "no undeclared network calls" mean nothing. The rule
 * is: code files call their URLs; config files call the ones under
 * endpoint-shaped keys; markdown code blocks only count when the line contains
 * a network call; markdown prose never counts.
 */
const ENDPOINT_KEY = /["']?[\w.-]*(?:url|uri|endpoint|host|server|api|webhook|base|proxy|registry|origin|callback|target)["']?\s*[:=]/i;

function isCallSite(entry) {
  switch (entry.kind) {
    case "script":
      // A commented-out URL is documentation unless the comment is a command.
      return !entry.comment || NETWORK_CALL_PATTERN.test(entry.text);
    case "config":
      return ENDPOINT_KEY.test(entry.text);
    case "fence":
      return NETWORK_CALL_PATTERN.test(entry.text);
    default:
      return false;
  }
}

function checkNetwork(lines, declared) {
  const callSites = lines.filter(isCallSite);
  const hosts = new Map(); // host -> { label, findings }
  const unknown = new Set();

  for (const entry of callSites) {
    if (!entry.text) continue;
    URL_PATTERN.lastIndex = 0;
    let match;
    while ((match = URL_PATTERN.exec(entry.text)) !== null) {
      const host = match[1].split(/[/:?#]/)[0].toLowerCase().replace(/^[a-z0-9-]+@/, "");
      if (isPlaceholderHost(host)) continue;

      const label = declared.has(host) ? "declared by the skill" : classifyHost(host);
      const record = hosts.get(host) ?? { host, label, findings: [] };
      if (!label) {
        unknown.add(host);
        if (record.findings.length < MAX_FINDINGS_PER_CHECK) {
          record.findings.push(finding(entry, `contacts ${host}`));
        }
      }
      hosts.set(host, record);
    }
  }

  const contacted = [...hosts.values()].map(({ host, label }) => ({ host, label: label ?? "undeclared" }));

  if (unknown.size) {
    const list = [...unknown].sort();
    return result("fail", `Contacts ${list.length} host${list.length === 1 ? "" : "s"} that is neither well-known infrastructure nor declared in the skill's frontmatter: ${list.slice(0, 5).join(", ")}${list.length > 5 ? "…" : ""}.`, {
      hosts: contacted,
      undeclared: list,
      findings: [...hosts.values()].flatMap((record) => record.findings),
    });
  }

  if (contacted.length === 0) {
    return result("pass", "Makes no network calls.", { hosts: [] });
  }

  return result("pass", `Only contacts known or declared hosts: ${contacted.map((entry) => entry.host).slice(0, 5).join(", ")}${contacted.length > 5 ? "…" : ""}.`, {
    hosts: contacted,
  });
}

function checkObfuscation(lines) {
  const findings = [];
  const code = lines.filter((entry) => entry.kind !== "prose");

  for (const entry of code) {
    if (!entry.text) continue;
    for (const { label, pattern } of OBFUSCATION_PATTERNS) {
      if (pattern.test(entry.text)) findings.push(finding(entry, label));
    }
    const base64 = LONG_BASE64_PATTERN.exec(entry.text);
    if (base64) {
      findings.push(finding(entry, `${base64[1].length}-character base64 literal`));
    }
  }

  if (findings.length) {
    return result("fail", `Contains ${findings.length} obfuscated or encoded payload pattern${findings.length === 1 ? "" : "s"}.`, { findings });
  }
  return result("pass", "No encoded or obfuscated payloads.");
}

function checkCredentials(lines) {
  const findings = [];
  const code = lines.filter((entry) => entry.kind !== "prose");
  // Only the manifest's prose is an instruction to the agent; a README is
  // documentation for a person and routinely discusses credential files.
  const prose = lines.filter((entry) => entry.kind === "prose" && entry.manifest);

  for (const entry of code) {
    if (!entry.text) continue;
    for (const { label, pattern, kinds } of CREDENTIAL_PATTERNS) {
      if (kinds && !kinds.includes(entry.kind)) continue;
      if (pattern.test(entry.text)) findings.push(finding(entry, label));
    }
    // A whole-environment dump is normal; a dump on the same line as a network
    // call is the shape of an exfiltration.
    if (ENV_DUMP_PATTERN.test(entry.text) && NETWORK_CALL_PATTERN.test(entry.text) && URL_PATTERN.test(entry.text)) {
      findings.push(finding(entry, "environment dumped into a network call"));
    }
  }

  // The prose of a skill is an instruction to the agent, so an imperative that
  // names a credential store counts even with no code behind it.
  for (const entry of prose) {
    if (!entry.text) continue;
    if (!IMPERATIVE_READ.test(entry.text) && !IMPERATIVE_SEND.test(entry.text)) continue;
    for (const { label, pattern } of CREDENTIAL_PATTERNS) {
      if (pattern.test(entry.text)) {
        findings.push(finding(entry, `instructs the agent to access ${label.toLowerCase()}`, "prose"));
      }
    }
  }

  if (findings.length) {
    return result("fail", `Touches credential material in ${findings.length} place${findings.length === 1 ? "" : "s"}.`, { findings });
  }
  return result("pass", "Reads no keys, tokens, keychains or credential files.");
}

function checkInstaller(lines) {
  const findings = [];
  const code = lines.filter((entry) => entry.kind !== "prose");
  const prose = lines.filter((entry) => entry.kind === "prose" && entry.manifest);

  for (const entry of code) {
    if (!entry.text) continue;
    for (const { label, pattern } of INSTALLER_PATTERNS) {
      if (pattern.test(entry.text)) findings.push(finding(entry, label));
    }
  }

  for (const entry of prose) {
    if (!entry.text) continue;
    for (const { label, pattern } of INSTALLER_PATTERNS) {
      if (pattern.test(entry.text)) findings.push(finding(entry, `tells the user to run: ${label}`, "prose"));
    }
  }

  if (findings.length) {
    return result("fail", `Runs code fetched at install time in ${findings.length} place${findings.length === 1 ? "" : "s"}.`, { findings });
  }
  return result("pass", "No pipe-to-shell or download-and-run installers.");
}

function checkPinned(repo, sha) {
  if (!repo || !sha) {
    return result("fail", "No upstream commit could be pinned, so there is nothing to attest to.");
  }
  return result("pass", `Scanned ${repo} at ${sha.slice(0, 10)}.`, { repo, commit: sha });
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Run the full Checked pass over one skill's files.
 *
 * @param {object} input
 * @param {{path: string, text: string}[]} input.files  the skill's own files
 * @param {string} [input.skillMdPath]  repo-relative path of its SKILL.md
 * @param {string} [input.repo]         owner/name of the upstream repository
 * @param {string} [input.sha]          commit the files were read at
 * @returns {{verdict: string, checks: Record<string, object>, failed: string[]}}
 */
export function runSafetyChecks({ files = [], skillMdPath, repo, sha } = {}) {
  const skillMd =
    files.find((file) => file.path === skillMdPath) ??
    files.find((file) => /(^|\/)SKILL\.md$/i.test(file.path)) ??
    null;

  const frontmatter = skillMd ? parseFrontmatter(skillMd.text) : null;
  const declared = declaredHosts(frontmatter);
  const lines = collectLines(files);

  const checks = {
    "skill-manifest": checkManifest(skillMd, frontmatter),
    "network-egress": checkNetwork(lines, declared),
    "no-obfuscation": checkObfuscation(lines),
    "no-credential-access": checkCredentials(lines),
    "no-remote-installer": checkInstaller(lines),
    "pinned-source": checkPinned(repo, sha),
  };

  const failed = CHECK_IDS.filter((id) => checks[id].status === "fail");

  return {
    verdict: failed.length === 0 ? "checked" : "flagged",
    failed,
    checks,
    scannedFiles: files.length,
    scannedLines: lines.length,
  };
}
