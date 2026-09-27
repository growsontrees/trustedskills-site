"use client";

import { CopyButton } from "./CopyButton";
import { cx } from "./ui";

/**
 * The install block primitive: a filename/label strip, a copy control, and the
 * payload. Every command, config snippet and file path on the site renders
 * through this so they all sit on the same surface with the same affordance.
 */
export function InstallBlock({
  label,
  code,
  className,
  /** Renders a shell prompt marker before a single-line command. */
  prompt = false,
}: {
  label: string;
  code: string;
  className?: string;
  prompt?: boolean;
}) {
  return (
    <div
      className={cx(
        "overflow-hidden rounded-lg border border-ink-750 bg-ink-1000 shadow-e1",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink-800 bg-ink-950 py-1 pl-3 pr-1">
        <span className="truncate font-mono text-2xs text-ink-500">{label}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-ink-200">
        {prompt ? <span className="select-none text-ink-600">$ </span> : null}
        {code}
      </pre>
    </div>
  );
}
