import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "TrustedSkills — AI Skills Marketplace",
    template: "%s — TrustedSkills",
  },
  description:
    "Discover, install, and share verified skills for OpenClaw AI agents. Browse 12+ community skills for productivity, data, web browsing, and more.",
  metadataBase: new URL("https://trustedskills.dev"),
  openGraph: {
    title: "TrustedSkills — AI Skills Marketplace",
    description:
      "The community marketplace for AI agent skills. Install in seconds.",
    url: "https://trustedskills.dev",
    siteName: "TrustedSkills",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustedSkills — AI Skills Marketplace",
    description: "Discover and install verified AI agent skills.",
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
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2 font-semibold text-lg hover:text-white transition-colors">
                <span className="text-2xl">🦀</span>
                <span className="text-white">TrustedSkills</span>
                <span className="text-xs text-gray-500 font-mono bg-gray-800 px-1.5 py-0.5 rounded ml-1">beta</span>
              </Link>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <Link href="/skills" className="hover:text-white transition-colors">Browse</Link>
                <Link href="/submit" className="hover:text-white transition-colors">Submit</Link>
                <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
                <a
                  href="/api/index.json"
                  className="hover:text-white transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  API
                </a>
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
                  <span className="text-xl">🦀</span>
                  <span className="font-semibold text-white">TrustedSkills</span>
                </div>
                <p className="text-sm text-gray-500">
                  The community marketplace for AI agent skills.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
                <Link href="/skills" className="hover:text-gray-300 transition-colors">Browse Skills</Link>
                <Link href="/submit" className="hover:text-gray-300 transition-colors">Submit a Skill</Link>
                <Link href="/docs" className="hover:text-gray-300 transition-colors">Docs</Link>
                <a href="/api/index.json" className="hover:text-gray-300 transition-colors" target="_blank">API</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800/50 text-xs text-gray-600 text-center">
              Built with ❤️ for the OpenClaw community · <a href="https://agentskills.io" className="hover:text-gray-400 transition-colors">AgentSkills Spec</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
