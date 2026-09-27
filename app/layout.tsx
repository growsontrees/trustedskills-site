import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { MobileNav } from "./components/MobileNav";
import { sans, mono } from "./fonts";
import { Github, Shield } from "../components/icons";
import { ButtonLink } from "../components/ui";

export const metadata: Metadata = {
  title: {
    default: "TrustedSkills — Find & Install AI Agent Skills | MCP, Claude, OpenClaw",
    template: "%s | TrustedSkills",
  },
  description:
    "An index of AI agent skills. Search the catalogue, see who publishes each skill, and get the install command for your platform — OpenClaw, MCP, Claude, OpenAI, Cursor or VS Code.",
  metadataBase: new URL("https://trustedskills.dev"),
  openGraph: {
    title: "TrustedSkills — AI Agent Skills Index",
    description:
      "Search the agent skill ecosystem in one place. See the publisher, the source and the install command for every skill.",
    siteName: "TrustedSkills",
    type: "website",
    images: [
      {
        url: "https://trustedskills.dev/og-image.svg",
        width: 1200,
        height: 630,
        alt: "TrustedSkills — AI Agent Skills Index",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustedSkills — AI Agent Skills Index",
    description: "Search the agent skill ecosystem in one place.",
    images: ["https://trustedskills.dev/og-image.svg"],
  },
};

const NAV_LINKS = [
  { href: "/skills", label: "Browse" },
  { href: "/collections", label: "Collections" },
  { href: "/reviews", label: "Reviews" },
  { href: "/docs", label: "Docs" },
];

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-ink-700 bg-ink-850 text-accent-400 shadow-e1">
        <Shield className="h-4 w-4" />
      </span>
      <span className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-ink-50">
        TrustedSkills
      </span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink-1000 font-sans text-ink-300 antialiased">
        <GoogleAnalytics />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-ink-850 focus:px-4 focus:py-2 focus:text-sm focus:text-ink-50"
        >
          Skip to content
        </a>

        <header className="sticky top-0 z-50 border-b border-ink-800 bg-ink-1000/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-page items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="group flex items-center gap-2">
              <Wordmark />
              <span className="rounded-xs border border-ink-750 px-1 py-px font-mono text-2xs text-ink-500">
                beta
              </span>
            </Link>

            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-1.5 text-sm text-ink-400 transition duration-fast ease-out hover:bg-ink-900 hover:text-ink-50"
                >
                  {link.label}
                </Link>
              ))}
              <span className="mx-2 h-4 w-px bg-ink-800" />
              <ButtonLink href="/submit" variant="secondary" size="sm">
                Submit a skill
              </ButtonLink>
            </nav>

            <MobileNav />
          </div>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-section-lg border-t border-ink-800 bg-ink-950">
          <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-10 md:flex-row">
              <div className="max-w-sm">
                <Wordmark />
                <p className="mt-3 text-sm leading-relaxed text-ink-450">
                  A platform-agnostic index of AI agent skills. We record where each skill
                  comes from and how to install it — we don&apos;t review the code.
                </p>
                <a
                  href="https://github.com/growsontrees/trustedskills-registry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-ink-450 transition-colors hover:text-ink-100"
                >
                  <Github className="h-4 w-4" />
                  Registry on GitHub
                </a>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
                <FooterColumn
                  title="Browse"
                  links={[
                    { href: "/skills", label: "All skills" },
                    { href: "/tier/official/", label: "Official" },
                    { href: "/tier/featured/", label: "Featured" },
                    { href: "/tier/verified/", label: "Pinned" },
                  ]}
                />
                <FooterColumn
                  title="Platforms"
                  links={[
                    { href: "/platform/claudecode/", label: "Claude Code" },
                    { href: "/platform/claude/", label: "Claude Desktop" },
                    { href: "/platform/mcp/", label: "MCP" },
                    { href: "/platform/cursor/", label: "Cursor" },
                  ]}
                />
                <FooterColumn
                  title="About"
                  links={[
                    { href: "/docs", label: "Docs" },
                    { href: "/reviews", label: "Reviews" },
                    { href: "/collections", label: "Collections" },
                    { href: "/submit", label: "Submit a skill" },
                  ]}
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-ink-850 pt-6 text-2xs text-ink-600 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Built on the{" "}
                <a
                  href="https://agentskills.io"
                  className="text-ink-500 transition-colors hover:text-ink-300"
                >
                  AgentSkills spec
                </a>
                .
              </span>
              <span>Works with OpenClaw · MCP · Claude · OpenAI · Cursor · VS Code</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-[0.08em] text-ink-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-400 transition-colors hover:text-ink-100"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
