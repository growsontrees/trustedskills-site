import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documentation",
  description: "TrustedSkills documentation — learn how to install, use, and build AI agent skills.",
};

const DOC_SECTIONS = [
  {
    title: "Getting Started",
    icon: "🚀",
    docs: [
      {
        title: "Installation Guide",
        slug: "install",
        desc: "How to install and manage OpenClaw skills using the CLI.",
      },
      {
        title: "Quick Start",
        slug: "quickstart",
        desc: "Get up and running with your first skill in under 5 minutes.",
      },
    ],
  },
  {
    title: "Building Skills",
    icon: "🔨",
    docs: [
      {
        title: "SKILL.md Format Reference",
        slug: "format",
        desc: "Complete specification for all SKILL.md frontmatter fields.",
      },
      {
        title: "Build Your First Skill",
        slug: "build",
        desc: "Step-by-step guide to creating, testing, and publishing a skill.",
      },
      {
        title: "Tool Handlers",
        slug: "tools",
        desc: "Writing JavaScript and Python tool handler functions.",
      },
    ],
  },
  {
    title: "Registry & API",
    icon: "🔌",
    docs: [
      {
        title: "Registry API Reference",
        slug: "api",
        desc: "Machine-readable API endpoints for the skills registry.",
      },
      {
        title: "Trust & Verification",
        slug: "trust",
        desc: "How skill verification works and what each badge means.",
      },
    ],
  },
  {
    title: "Platforms",
    icon: "🌐",
    docs: [
      {
        title: "OpenClaw Integration",
        slug: "openclaw",
        desc: "Using skills with OpenClaw agents and the AgentSkills spec.",
      },
      {
        title: "MCP Integration",
        slug: "mcp",
        desc: "Exposing skills as Model Context Protocol servers.",
      },
      {
        title: "Claude & OpenAI",
        slug: "adapters",
        desc: "Platform adapters for Claude and OpenAI tool calling.",
      },
    ],
  },
];

const QUICK_REFERENCE = [
  { cmd: "openclaw skills install <slug>", desc: "Install a skill by slug" },
  { cmd: "openclaw skills install <url>", desc: "Install from URL" },
  { cmd: "openclaw skills list", desc: "List installed skills" },
  { cmd: "openclaw skills update", desc: "Update all skills" },
  { cmd: "openclaw skills remove <slug>", desc: "Remove a skill" },
  { cmd: "openclaw skills verify <slug>", desc: "Verify integrity" },
];

export default function DocsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Documentation</h1>
        <p className="text-gray-400 text-lg">
          Everything you need to use, build, and publish OpenClaw skills.
        </p>
      </div>

      {/* Quick CLI Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>💻</span> Quick CLI Reference
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_REFERENCE.map((item) => (
            <div key={item.cmd} className="flex items-start gap-3">
              <code className="text-xs font-mono bg-gray-950 border border-gray-700 text-emerald-400 px-2.5 py-1.5 rounded-lg flex-shrink-0">
                {item.cmd}
              </code>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {QUICK_REFERENCE.map((item) => (
            <div key={item.cmd + "-desc"} className="text-xs text-gray-500 pl-2">
              {item.desc}
            </div>
          ))}
        </div>
      </div>

      {/* API quick access */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>🔌</span> Registry API
        </h2>
        <div className="space-y-3">
          {[
            { method: "GET", path: "/api/index.json", desc: "Full skills index" },
          ].map((endpoint) => (
            <div key={endpoint.path} className="flex items-center gap-3">
              <span className="text-xs font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                {endpoint.method}
              </span>
              <a
                href={endpoint.path}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {endpoint.path}
              </a>
              <span className="text-sm text-gray-500">{endpoint.desc}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gray-950 rounded-xl border border-gray-700">
          <div className="text-xs text-gray-500 mb-2 font-mono">curl example</div>
          <code className="text-sm font-mono text-emerald-400">
            curl https://trustedskills.dev/api/index.json
          </code>
        </div>
      </div>

      {/* Doc sections */}
      <div className="space-y-8">
        {DOC_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>{section.icon}</span>
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.docs.map((doc) => (
                <div
                  key={doc.slug}
                  className="block p-4 bg-gray-900 border border-gray-800 rounded-xl opacity-70"
                  title="Coming soon"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-gray-200 text-sm">{doc.title}</h3>
                    <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded flex-shrink-0">soon</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{doc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SKILL.md Format Reference */}
      <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">SKILL.md Required Fields</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pr-6">Field</th>
                <th className="pb-3 pr-6">Type</th>
                <th className="pb-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { field: "name", type: "string", desc: "Unique slug identifier (lowercase, hyphens only)" },
                { field: "description", type: "string", desc: "One-line description (10-500 characters)" },
                { field: "version", type: "semver", desc: "Semantic version (e.g. 1.0.0)" },
                { field: "metadata", type: "JSON", desc: "Optional OpenClaw-specific config (emoji, requires, etc.)" },
              ].map((row) => (
                <tr key={row.field}>
                  <td className="py-3 pr-6">
                    <code className="font-mono text-purple-300 text-xs">{row.field}</code>
                  </td>
                  <td className="py-3 pr-6">
                    <span className="text-xs text-gray-500 font-mono">{row.type}</span>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Need help */}
      <div className="mt-8 text-center py-10 border border-gray-800 rounded-2xl">
        <h2 className="font-semibold text-white mb-2">Need help?</h2>
        <p className="text-gray-400 text-sm mb-4">
          Check the GitHub issues, or open a discussion in the community.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/submit"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Submit a skill →
          </Link>
          <span className="text-gray-700">·</span>
          <a
            href="https://github.com/openclaw/openclaw/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Community discussions →
          </a>
        </div>
      </div>
    </div>
  );
}
