/**
 * The automated safety pass, as shown on a skill page.
 *
 * Every check is listed whether it passed or failed, with the evidence that
 * decided it. That is the whole point: "Checked" is only a defensible claim if a
 * reader can see what was looked at, at which commit, and what the scan found —
 * and a failure is more useful to someone about to install a skill than a badge.
 */

import { AlertTriangle, Check, Close, Info, Shield } from "./icons";
import { Chip, Eyebrow, Note, Panel, cx } from "./ui";
import type { SafetyCheckDefinition, SafetyCheckResult, SafetyReport } from "../lib/safety";

type CheckRow = SafetyCheckDefinition & { result: SafetyCheckResult };

const COMMIT_LENGTH = 10;

export function SafetyPanel({
  report,
  checks,
  methodologyHref = "/docs/advanced/automated-safety-checks",
}: {
  report: SafetyReport | null;
  checks: CheckRow[];
  methodologyHref?: string;
}) {
  // Before the first scan reaches a skill there is nothing honest to show, so
  // the panel is omitted rather than rendering an empty checklist.
  if (!report) return null;

  const commitUrl =
    report.repo && report.commit ? `https://github.com/${report.repo}/tree/${report.commit}` : null;
  const treeUrl =
    report.repo && report.commit && report.path
      ? `https://github.com/${report.repo}/blob/${report.commit}/${report.path}`
      : commitUrl;

  const failed = checks.filter((check) => check.result.status === "fail");
  const passed = checks.filter((check) => check.result.status === "pass");

  return (
    <Panel as="section">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield
            className={cx(
              "h-4 w-4",
              report.verdict === "checked"
                ? "text-ok-400"
                : report.verdict === "flagged"
                  ? "text-warn-400"
                  : "text-ink-450"
            )}
          />
          <h2 className="text-sm font-semibold text-ink-50">Automated safety checks</h2>
        </div>
        {report.scanned_at ? (
          <span className="shrink-0 pt-0.5 text-2xs text-ink-500">
            scanned{" "}
            <time dateTime={report.scanned_at}>
              {new Date(report.scanned_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-400">
        {report.verdict === "checked" ? (
          <>
            This skill passed all {checks.length} checks. We read its files at one commit and looked
            for the things that make a skill dangerous to run — not for whether it works.
          </>
        ) : report.verdict === "flagged" ? (
          <>
            This skill failed {failed.length} of {checks.length} checks. A failure is not proof of
            bad intent; it means something in the code needs a human to look at it before you run it.
          </>
        ) : (
          <>We could not read this skill&apos;s source, so none of the checks below were run.</>
        )}
      </p>

      {report.verdict === "unscannable" ? (
        <div className="mt-stack-lg">
          <Note icon={Info}>
            <span className="font-medium">Not scanned.</span> {report.reason ?? "The source could not be resolved."}
            {report.repo ? (
              <>
                {" "}
                Source recorded as <span className="font-mono text-ink-300">{report.repo}</span>.
              </>
            ) : null}
          </Note>
        </div>
      ) : (
        <>
          {/* Failures first: they are the reason someone reads this panel. */}
          <ul className="mt-stack-lg space-y-2">
            {[...failed, ...passed].map((check) => (
              <CheckItem key={check.id} check={check} />
            ))}
          </ul>

          <dl className="mt-stack-lg grid gap-x-6 gap-y-1.5 border-t border-ink-800 pt-3 text-xs sm:grid-cols-2">
            <ScanFact label="Commit">
              {commitUrl && report.commit ? (
                <a
                  href={commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline decoration-ink-700 underline-offset-2 hover:decoration-ink-500"
                >
                  {report.commit.slice(0, COMMIT_LENGTH)}
                </a>
              ) : (
                <span className="font-mono">{report.commit?.slice(0, COMMIT_LENGTH) ?? "—"}</span>
              )}
            </ScanFact>
            <ScanFact label="Manifest">
              {treeUrl && report.path ? (
                <a
                  href={treeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono underline decoration-ink-700 underline-offset-2 hover:decoration-ink-500"
                >
                  {report.path}
                </a>
              ) : (
                <span className="font-mono">{report.path ?? "—"}</span>
              )}
            </ScanFact>
            <ScanFact label="Scanned">
              {report.files ?? 0} file{report.files === 1 ? "" : "s"}
              {report.lines ? `, ${report.lines.toLocaleString("en-GB")} lines` : ""}
            </ScanFact>
            {report.copies && report.copies.length > 1 ? (
              <ScanFact label="Copies in repo">
                {report.copies.length} — all of them scanned
              </ScanFact>
            ) : null}
          </dl>
        </>
      )}

      <div className="mt-3 space-y-2">
        <Note tone="warn" icon={AlertTriangle}>
          <span className="font-medium">This is a static scan, not a review.</span> It reads the
          skill&apos;s files; it does not run them, and it cannot tell you whether the skill is any
          good or whether the code does what its description says. A skill runs with whatever access
          you give your agent.
        </Note>
        <a
          href={methodologyHref}
          className="inline-block text-xs text-ink-400 underline decoration-ink-700 underline-offset-2 hover:text-ink-200"
        >
          What each check looks for →
        </a>
      </div>
    </Panel>
  );
}

function ScanFact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="min-w-0 truncate text-right text-ink-300">{children}</dd>
    </div>
  );
}

function CheckItem({ check }: { check: CheckRow }) {
  const { status, summary, findings, matches, hosts } = check.result;
  const failing = status === "fail";

  return (
    <li
      className={cx(
        "rounded-lg border p-3",
        failing ? "border-warn-800/70 bg-warn-950/40" : "border-ink-800 bg-ink-950"
      )}
    >
      <div className="flex items-start gap-2.5">
        <span
          className={cx(
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
            failing ? "bg-warn-900 text-warn-300" : status === "pass" ? "bg-ok-900 text-ok-300" : "bg-ink-800 text-ink-450"
          )}
          aria-hidden
        >
          {failing ? <Close className="h-2.5 w-2.5" /> : <Check className="h-2.5 w-2.5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cx("text-sm font-medium", failing ? "text-warn-200" : "text-ink-100")}>
            {check.label}
            <span className="sr-only">: {failing ? "failed" : status === "pass" ? "passed" : "not run"}</span>
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{summary}</p>
          <p className="mt-1 text-2xs leading-relaxed text-ink-500">{check.question}</p>

          {hosts && hosts.length > 0 ? (
            <div className="mt-2">
              <Eyebrow>Hosts contacted</Eyebrow>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {hosts.map((entry) => (
                  <Chip key={entry.host} mono className={entry.label === "undeclared" ? "text-warn-300" : undefined}>
                    {entry.host}
                    <span className="font-sans text-ink-500">{entry.label}</span>
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          {findings && findings.length > 0 ? (
            <div className="mt-2">
              <Eyebrow>
                {matches && matches > findings.length
                  ? `What it found (${findings.length} of ${matches})`
                  : "What it found"}
              </Eyebrow>
              <ul className="mt-1.5 space-y-1.5">
                {findings.map((finding, index) => (
                  <li key={`${finding.file}:${finding.line}:${index}`} className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 text-2xs text-ink-500">
                      <span className="font-mono text-ink-400">
                        {finding.file}:{finding.line}
                      </span>
                      <span>{finding.detail}</span>
                      {finding.scope === "prose" ? (
                        <span className="text-ink-500">(in the instructions, not code)</span>
                      ) : null}
                    </div>
                    <pre className="mt-0.5 overflow-x-auto rounded border border-ink-800 bg-ink-1000 px-2 py-1 text-2xs text-ink-300">
                      <code>{finding.evidence}</code>
                    </pre>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}
