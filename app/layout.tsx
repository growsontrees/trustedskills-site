import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "TrustedSkills — Find & Install AI Agent Skills | MCP, Claude, OpenClaw",
    template: "%s | TrustedSkills",
  },
  description:
    "Find, verify, and install skills for any AI agent platform. Compatible with OpenClaw, MCP, Claude Desktop, OpenAI, Cursor, and VS Code.",
  metadataBase: new URL("https://trustedskills.dev"),
  alternates: {
    canonical: 'https://trustedskills.dev',
  },
  openGraph: {
    title: "TrustedSkills — AI Agent Skills Registry",
    description:
      "The trusted registry for AI agent skills. Works with OpenClaw, MCP, Claude, OpenAI, Cursor, and more.",
    url: "https://trustedskills.dev",
    siteName: "TrustedSkills",
    type: "website",
    images: [
      {
        url: "https://trustedskills.dev/og-image.svg",
        width: 1200,
        height: 630,
        alt: "TrustedSkills — AI Agent Skills Registry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustedSkills — AI Agent Skills Registry",
    description: "Find and install verified AI agent skills for any platform.",
    images: ["https://trustedskills.dev/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-sans antialiased">
        <GoogleAnalytics />
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:text-white transition-colors">
                <span className="text-2xl">🛡️</span>
                <span className="text-white">TrustedSkills</span>
                <span className="text-xs text-gray-500 font-mono bg-gray-800 px-1.5 py-0.5 rounded ml-1">beta</span>
              </Link>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/skills" className="hover:text-white transition-colors">Browse</Link>
                <Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link>
                <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
                <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>

              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-24 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🛡️</span>
                  <span className="font-semibold text-white">TrustedSkills</span>
                </div>
                <p className="text-sm text-gray-500">
                  The platform-agnostic registry for AI agent skills.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Works with OpenClaw · MCP · Claude · OpenAI · Cursor · VS Code
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
                <Link href="/skills" className="hover:text-gray-300 transition-colors">Browse Skills</Link>
                <Link href="/reviews" className="hover:text-gray-300 transition-colors">Reviews</Link>
                <Link href="/submit" className="hover:text-gray-300 transition-colors">Submit a Skill</Link>
                <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>

              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800/50 text-xs text-gray-600 text-center">
              Built for the AI agent ecosystem ·{" "}
              <a href="https://agentskills.io" className="hover:text-gray-400 transition-colors">
                AgentSkills Spec
              </a>
              {" · "}
              <span className="text-gray-700">Platform-agnostic · Works with 5+ platforms</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
