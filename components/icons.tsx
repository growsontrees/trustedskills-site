import { createElement, type SVGProps } from "react";

/**
 * The icon set. Geometry follows Lucide (ISC) on a 24px grid with a 1.75
 * stroke, round caps and joins — kept in-repo rather than pulled from
 * `lucide-react` because the build pre-renders tens of thousands of pages and
 * these thirty glyphs are cheaper inlined than as a dependency.
 *
 * Icons are decorative by default (`aria-hidden`). Pass a `title` when an icon
 * is the only label for a control.
 */

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Accessible name. Omit for decorative icons. */
  title?: string;
}

function stroke(path: React.ReactNode) {
  const Component = ({ title, className = "h-4 w-4", ...rest }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
  return Component;
}

function filled(path: React.ReactNode) {
  const Component = ({ title, className = "h-4 w-4", ...rest }: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
  return Component;
}

/* ── Navigation & controls ─────────────────────────────────────────────── */

export const Search = stroke(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </>
);

export const ChevronRight = stroke(<path d="m9 18 6-6-6-6" />);
export const ChevronLeft = stroke(<path d="m15 18-6-6 6-6" />);
export const ChevronDown = stroke(<path d="m6 9 6 6 6-6" />);
export const ArrowRight = stroke(
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
);
export const ArrowLeft = stroke(
  <>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </>
);

export const ExternalLink = stroke(
  <>
    <path d="M15 3h6v6" />
    <path d="M10 14 21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </>
);

export const Menu = stroke(
  <>
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </>
);

export const Close = stroke(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
);

export const Check = stroke(<path d="M20 6 9 17l-5-5" />);

export const Copy = stroke(
  <>
    <rect width="14" height="14" x="8" y="8" rx="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </>
);

export const Sliders = stroke(
  <>
    <path d="M21 4h-7" />
    <path d="M10 4H3" />
    <path d="M21 12h-9" />
    <path d="M8 12H3" />
    <path d="M21 20h-5" />
    <path d="M12 20H3" />
    <path d="M14 2v4" />
    <path d="M8 10v4" />
    <path d="M16 18v4" />
  </>
);

/* ── Domain ────────────────────────────────────────────────────────────── */

export const Shield = stroke(
  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
);

export const Terminal = stroke(
  <>
    <path d="m4 17 6-6-6-6" />
    <path d="M12 19h8" />
  </>
);

export const Package = stroke(
  <>
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </>
);

export const GitCommit = stroke(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M3 12h6" />
    <path d="M15 12h6" />
  </>
);

export const Star = stroke(
  <path d="m12 2.5 2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.42 6.16 20.47l1.11-6.5-4.72-4.6 6.53-.95z" />
);

export const Download = stroke(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 10 5 5 5-5" />
    <path d="M12 15V3" />
  </>
);

export const Clock = stroke(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </>
);

export const Building = stroke(
  <>
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </>
);

export const Award = stroke(
  <>
    <circle cx="12" cy="8" r="6" />
    <path d="m15.48 12.89 1.51 8.53a.5.5 0 0 1-.81.46l-3.58-2.68a1 1 0 0 0-1.2 0l-3.58 2.68a.5.5 0 0 1-.81-.46l1.51-8.53" />
  </>
);

export const Tag = stroke(
  <>
    <path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.41l8.7 8.71a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z" />
    <path d="M7.5 7.5h.01" />
  </>
);

export const Scale = stroke(
  <>
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </>
);

export const AlertTriangle = stroke(
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>
);

export const Info = stroke(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>
);

export const BookOpen = stroke(
  <>
    <path d="M12 7v14" />
    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
  </>
);

export const Upload = stroke(
  <>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="m7 8 5-5 5 5" />
    <path d="M12 3v12" />
  </>
);

export const Code = stroke(
  <>
    <path d="m16 18 6-6-6-6" />
    <path d="m8 6-6 6 6 6" />
  </>
);

export const User = stroke(
  <>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
);

export const TrendingUp = stroke(
  <>
    <path d="m22 7-8.5 8.5-5-5L2 17" />
    <path d="M16 7h6v6" />
  </>
);

export const Plug = stroke(
  <>
    <path d="M12 22v-5" />
    <path d="M9 7V2" />
    <path d="M15 7V2" />
    <path d="M6 13V8h12v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z" />
  </>
);

export const Circle = stroke(<circle cx="12" cy="12" r="9" />);

export const Zap = stroke(
  <path d="M13 2 4.09 12.91a1 1 0 0 0 .77 1.64H11l-1 7.45 8.91-10.91a1 1 0 0 0-.77-1.64H13z" />
);

export const RefreshCw = stroke(
  <>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </>
);

export const Quote = stroke(
  <>
    <path d="M10 11H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4" />
    <path d="M20 11h-4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v8a4 4 0 0 1-4 4" />
  </>
);

export const Compass = stroke(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z" />
  </>
);

export const Globe = stroke(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
  </>
);

export const Github = filled(
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
);

/* ── Category glyphs ───────────────────────────────────────────────────── */

export const Monitor = stroke(
  <>
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
  </>
);

export const Server = stroke(
  <>
    <rect width="20" height="8" x="2" y="2" rx="2" />
    <rect width="20" height="8" x="2" y="14" rx="2" />
    <path d="M6 6h.01" />
    <path d="M6 18h.01" />
  </>
);

export const Cloud = stroke(
  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
);

export const Database = stroke(
  <>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14a9 3 0 0 0 18 0V5" />
    <path d="M3 12a9 3 0 0 0 18 0" />
  </>
);

export const GitBranch = stroke(
  <>
    <path d="M6 3v12" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </>
);

export const Flask = stroke(
  <>
    <path d="M14 2v6a2 2 0 0 0 .24.96l5.52 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.76-2.96l5.52-10.08A2 2 0 0 0 10 8V2" />
    <path d="M6.45 15h11.1" />
    <path d="M8.5 2h7" />
  </>
);

export const Lock = stroke(
  <>
    <rect width="18" height="11" x="3" y="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </>
);

export const Cpu = stroke(
  <>
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M15 2v2" />
    <path d="M15 20v2" />
    <path d="M2 15h2" />
    <path d="M2 9h2" />
    <path d="M20 15h2" />
    <path d="M20 9h2" />
    <path d="M9 2v2" />
    <path d="M9 20v2" />
  </>
);

export const Bot = stroke(
  <>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </>
);

export const Megaphone = stroke(
  <>
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </>
);

export const PenLine = stroke(
  <>
    <path d="M12 20h9" />
    <path d="M16.38 3.62a1 1 0 0 1 3 3L7.37 18.64a2 2 0 0 1-.86.5l-2.87.84a.5.5 0 0 1-.62-.62l.84-2.87a2 2 0 0 1 .5-.85z" />
  </>
);

export const BarChart = stroke(
  <>
    <path d="M12 20V10" />
    <path d="M18 20V4" />
    <path d="M6 20v-4" />
  </>
);

export const Film = stroke(
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 3v18" />
    <path d="M17 3v18" />
    <path d="M3 12h18" />
    <path d="M3 7.5h4" />
    <path d="M3 16.5h4" />
    <path d="M17 7.5h4" />
    <path d="M17 16.5h4" />
  </>
);

export const ListChecks = stroke(
  <>
    <path d="m3 17 2 2 4-4" />
    <path d="m3 7 2 2 4-4" />
    <path d="M13 6h8" />
    <path d="M13 12h8" />
    <path d="M13 18h8" />
  </>
);

export const Wrench = stroke(
  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
);

export const Boxes = stroke(
  <>
    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
    <path d="m7 16.5-4.74-2.85" />
    <path d="m7 16.5 5-3" />
    <path d="M7 16.5v5.17" />
    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
    <path d="m17 16.5-5-3" />
    <path d="m17 16.5 4.74-2.85" />
    <path d="M17 16.5v5.17" />
    <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
    <path d="M12 8 7.26 5.15" />
    <path d="m12 8 4.74-2.85" />
    <path d="M12 13.5V8" />
  </>
);

export type IconComponent = ReturnType<typeof stroke>;

/** Category slug → glyph. Falls back to `Boxes` for anything unmapped. */
export const CATEGORY_ICONS: Record<string, IconComponent> = {
  frontend: Monitor,
  backend: Server,
  cloud: Cloud,
  database: Database,
  devops: GitBranch,
  testing: Flask,
  security: Lock,
  "ai-ml": Cpu,
  agents: Bot,
  marketing: Megaphone,
  writing: PenLine,
  data: BarChart,
  "video-media": Film,
  productivity: ListChecks,
  utilities: Wrench,
  other: Boxes,
};

export function categoryIcon(slug: string): IconComponent {
  return CATEGORY_ICONS[slug] ?? Boxes;
}

/**
 * The category glyph as an element. Use this inside a component body: holding
 * `categoryIcon()` in a local and rendering it as `<Glyph />` trips the React
 * Compiler's "component created during render" check.
 */
export function CategoryGlyph({ slug, ...props }: IconProps & { slug: string }) {
  return createElement(categoryIcon(slug), props);
}

/** Platform key → glyph. Falls back to `Plug` (the generic MCP host). */
export const PLATFORM_ICONS: Record<string, IconComponent> = {
  claudecode: Terminal,
  openclaw: Terminal,
  opencode: Terminal,
  claude: Bot,
  openai: Bot,
  cursor: Code,
  codex: Github,
  mcp: Plug,
};

export function platformIcon(slug: string): IconComponent {
  return PLATFORM_ICONS[slug] ?? Plug;
}

/** Docs category slug → glyph. */
export const DOC_CATEGORY_ICONS: Record<string, IconComponent> = {
  concepts: Info,
  "claude-desktop": Bot,
  "claude-code": Terminal,
  cursor: Code,
  openclaw: Terminal,
  advanced: Cpu,
  guides: BookOpen,
};

export function docCategoryIcon(slug: string): IconComponent {
  return DOC_CATEGORY_ICONS[slug] ?? BookOpen;
}
