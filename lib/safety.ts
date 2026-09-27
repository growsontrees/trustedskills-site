/**
 * Server-side access to the automated safety pass.
 *
 * The scan itself lives in scripts/safety-scan.mjs and runs on a schedule
 * against the registry; this module only reads what it wrote. The report file
 * carries its own check definitions, so a page renders the wording a skill was
 * actually scanned against rather than whatever the current scanner says.
 *
 * Server-only, for the same reason as lib/skills.ts: the file is megabytes and
 * must never reach a browser bundle.
 */

import { readFileSync } from "fs";
import { join } from "path";

export type SafetyVerdict = "checked" | "flagged" | "unscannable";
export type SafetyCheckStatus = "pass" | "fail" | "skip";

export interface SafetyCheckDefinition {
  id: string;
  label: string;
  /** What passing this check actually asserts. */
  question: string;
}

export interface SafetyFinding {
  file: string;
  line: number;
  /** "code" for script files and fenced blocks, "prose" for SKILL.md text. */
  scope: "code" | "prose";
  detail: string;
  evidence: string;
}

export interface SafetyCheckResult {
  status: SafetyCheckStatus;
  summary: string;
  /** Up to three examples. `matches` is the true count. */
  findings?: SafetyFinding[];
  matches?: number;
  hosts?: { host: string; label: string }[];
  undeclared?: string[];
}

export interface SafetyReport {
  verdict: SafetyVerdict;
  repo: string | null;
  commit: string | null;
  /** Present on a scanned skill; absent when unscannable. */
  path?: string;
  copies?: string[];
  matched_by?: string;
  files?: number;
  lines?: number;
  failed?: string[];
  checks?: Record<string, SafetyCheckResult>;
  /** Why the skill could not be scanned. */
  reason?: string;
  scanned_at: string;
}

interface SafetyReportFile {
  schema_version: number;
  generated_at: string;
  checks: SafetyCheckDefinition[];
  repos: Record<string, { status: string; sha?: string; reason?: string }>;
  reports: Record<string, SafetyReport>;
}

const EMPTY: SafetyReportFile = {
  schema_version: 0,
  generated_at: "",
  checks: [],
  repos: {},
  reports: {},
};

let _file: SafetyReportFile | null = null;

function load(): SafetyReportFile {
  if (_file) return _file;
  try {
    const path = join(process.cwd(), "data", "safety-reports.json");
    _file = JSON.parse(readFileSync(path, "utf8")) as SafetyReportFile;
  } catch {
    // A build before the first scan, or a checkout without the report file:
    // pages render without the safety block rather than failing.
    _file = EMPTY;
  }
  return _file;
}

export function getSafetyReport(slug: string): SafetyReport | null {
  return load().reports[slug] ?? null;
}

export function getSafetyCheckDefinitions(): SafetyCheckDefinition[] {
  return load().checks ?? [];
}

export function getSafetyGeneratedAt(): string | null {
  return load().generated_at || null;
}

/** Catalogue-level counts, for the methodology page and the homepage. */
export function getSafetyStats() {
  const { reports } = load();
  const counts = { checked: 0, flagged: 0, unscannable: 0 };
  const failuresByCheck: Record<string, number> = {};

  for (const report of Object.values(reports)) {
    counts[report.verdict] = (counts[report.verdict] ?? 0) + 1;
    for (const id of report.failed ?? []) {
      failuresByCheck[id] = (failuresByCheck[id] ?? 0) + 1;
    }
  }

  return {
    ...counts,
    scanned: Object.keys(reports).length,
    failuresByCheck,
    generatedAt: getSafetyGeneratedAt(),
  };
}

/**
 * Wording for a check that passed.
 *
 * The scan stores only the decision for a pass — the file covers ~45,000 skills
 * and is committed on every run, so text the site can reconstruct is not worth
 * a megabyte of it. Failures are different: their summaries are evidence and
 * come from the scan.
 */
const PASS_SUMMARY: Record<string, (report: SafetyReport, result: SafetyCheckResult) => string> = {
  "skill-manifest": () => "SKILL.md parses and declares a name and a description.",
  "network-egress": (_report, result) => {
    const hosts = result.hosts ?? [];
    if (hosts.length === 0) return "Makes no network calls.";
    const shown = hosts.slice(0, 5).map((entry) => entry.host).join(", ");
    return `Only contacts known or declared hosts: ${shown}${hosts.length > 5 ? "…" : ""}.`;
  },
  "no-obfuscation": () => "No encoded or obfuscated payloads.",
  "no-credential-access": () => "Reads no keys, tokens, keychains or credential files.",
  "no-remote-installer": () => "No pipe-to-shell or download-and-run installers.",
  "pinned-source": (report) =>
    report.repo && report.commit
      ? `Scanned ${report.repo} at ${report.commit.slice(0, 10)}.`
      : "Scanned at a recorded commit.",
};

/**
 * The checks in display order, paired with this skill's result.
 *
 * A check with no stored entry passed with nothing to report, which is the
 * common case; its wording is filled in here. Nothing is inferred for a skill
 * with no report at all — those render no panel.
 */
export function getSafetyCheckList(report: SafetyReport | null) {
  const definitions = getSafetyCheckDefinitions();
  if (!report || report.verdict === "unscannable") return [];

  return definitions.map((definition) => {
    const stored = report.checks?.[definition.id];
    const status: SafetyCheckStatus = stored?.status ?? "pass";
    const result: SafetyCheckResult =
      status === "fail"
        ? (stored as SafetyCheckResult)
        : {
            ...stored,
            status,
            summary: stored?.summary ?? PASS_SUMMARY[definition.id]?.(report, stored ?? { status, summary: "" }) ?? "Passed.",
          };

    return { ...definition, result };
  });
}
