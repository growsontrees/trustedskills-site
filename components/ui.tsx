import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, type IconComponent } from "./icons";
import { TIER_CONFIG, type TierTone, type VerificationTier } from "../lib/skill-config";

/**
 * Shared primitives. Every surface composes from these so spacing, radii,
 * borders and hover behaviour stay identical across the site — the thing the
 * old pages had no way to guarantee, because each one re-picked raw utilities.
 *
 * All of these are server components; none reach for state.
 */

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/* ── Surfaces ──────────────────────────────────────────────────────────── */

/** A static content surface. */
export function Panel({
  children,
  className,
  padded = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  as?: "div" | "section" | "aside";
}) {
  return (
    <Tag
      className={cx(
        "rounded-xl border border-ink-750 bg-ink-900 shadow-e1",
        padded && "p-gutter-lg",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** A surface that is itself a link. Lifts one step on hover. */
export function CardLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group relative block rounded-xl border border-ink-750 bg-ink-900 p-gutter",
        "shadow-e1 transition duration-fast ease-out",
        "hover:-translate-y-px hover:border-ink-650 hover:bg-ink-850 hover:shadow-e3",
        className
      )}
    >
      {children}
    </Link>
  );
}

/* ── Headings ──────────────────────────────────────────────────────────── */

export function SectionHeading({
  title,
  description,
  action,
  icon: Icon,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
  icon?: IconComponent;
}) {
  return (
    <div className="mb-stack-lg flex items-end justify-between gap-6">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-50">
          {Icon ? <Icon className="h-4 w-4 shrink-0 text-ink-450" /> : null}
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-ink-450">{description}</p> : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-300 transition-colors hover:text-ink-50"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast ease-out group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}

/** Small uppercase label above a group of fields or chips. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cx(
        "text-2xs font-semibold uppercase tracking-[0.08em] text-ink-500",
        className
      )}
    >
      {children}
    </p>
  );
}

/* ── Chips & badges ────────────────────────────────────────────────────── */

const TONE_CHIP: Record<TierTone, string> = {
  accent: "border-accent-800 bg-accent-950 text-accent-300",
  ok: "border-ok-800 bg-ok-950 text-ok-300",
  warn: "border-warn-800 bg-warn-950 text-warn-300",
  neutral: "border-ink-700 bg-ink-850 text-ink-300",
  muted: "border-ink-750 bg-ink-900 text-ink-450",
};

/** Neutral metadata pill — platforms, tags, languages. */
export function Chip({
  children,
  className,
  mono = false,
}: {
  children: ReactNode;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-sm border border-ink-750 bg-ink-850 px-1.5 py-0.5 text-2xs text-ink-400",
        mono && "font-mono",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * The verification chip. This is the one place in the UI allowed to use
 * colour for meaning, which is why the tiers read at a glance even though
 * 95% of the index sits in the neutral "Listed" tier.
 */
export function TierChip({
  tier,
  size = "sm",
  showLabel = true,
}: {
  tier: VerificationTier;
  size?: "sm" | "md";
  showLabel?: boolean;
}) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG.community;
  const Icon = config.icon;
  return (
    <span
      title={config.description}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-sm border font-medium",
        TONE_CHIP[config.tone],
        size === "sm" ? "px-1.5 py-0.5 text-2xs" : "px-2.5 py-1 text-xs"
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {showLabel ? config.label : null}
    </span>
  );
}

/* ── Buttons ───────────────────────────────────────────────────────────── */

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary:
    "border-accent-500 bg-accent-600 text-white shadow-e2 hover:border-accent-400 hover:bg-accent-500",
  secondary:
    "border-ink-700 bg-ink-850 text-ink-100 shadow-e1 hover:border-ink-650 hover:bg-ink-800",
  ghost: "border-transparent bg-transparent text-ink-300 hover:bg-ink-850 hover:text-ink-50",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
};

export function buttonClass(variant: ButtonVariant = "secondary", size: ButtonSize = "md") {
  return cx(
    "inline-flex items-center justify-center rounded-md border font-medium",
    "transition duration-fast ease-out",
    BUTTON_VARIANT[variant],
    BUTTON_SIZE[size]
  );
}

export function ButtonLink({
  href,
  children,
  variant = "secondary",
  size = "md",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
}) {
  const classes = cx(buttonClass(variant, size), className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/* ── Data display ──────────────────────────────────────────────────────── */

/** A single headline figure. `hint` carries the provenance of the number. */
export function Stat({
  value,
  label,
  hint,
}: {
  value: ReactNode;
  label: string;
  hint?: string;
}) {
  return (
    <div title={hint}>
      <div className="tabular text-2xl font-semibold text-ink-50">{value}</div>
      <div className="mt-0.5 text-xs text-ink-450">{label}</div>
    </div>
  );
}

/**
 * A definition row. Renders nothing when `value` is null — the index is
 * patchy enough that this guard is what keeps "undefined" off the page.
 */
export function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode | null | undefined;
  icon?: IconComponent;
}) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className="flex items-center gap-1.5 text-sm text-ink-500">
        {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" /> : null}
        {label}
      </dt>
      <dd className="tabular min-w-0 truncate text-right text-sm text-ink-200">{value}</dd>
    </div>
  );
}

/** Wraps `Field` rows with dividers. */
export function FieldList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-ink-800">{children}</dl>;
}

/** An inline note — used for caveats about what the site does and doesn't know. */
export function Note({
  children,
  tone = "neutral",
  icon: Icon,
}: {
  children: ReactNode;
  tone?: "neutral" | "warn";
  icon?: IconComponent;
}) {
  return (
    <div
      className={cx(
        "flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-sm",
        tone === "warn"
          ? "border-warn-800 bg-warn-950 text-warn-300"
          : "border-ink-750 bg-ink-850 text-ink-400"
      )}
    >
      {Icon ? <Icon className="mt-0.5 h-4 w-4 shrink-0" /> : null}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
