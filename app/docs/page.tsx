import type { Metadata } from 'next';
import Link from 'next/link';
import { DOC_ARTICLES, DOC_CATEGORIES, getArticlesByCategory } from '../../lib/docs-content';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'TrustedSkills documentation — learn how to install, use, and build AI agent skills for OpenClaw, MCP, Claude Desktop, Cursor, and more.',
};

const PLATFORM_CARDS = [
  {
    id: 'claude-desktop',
    icon: '🖥️',
    title: 'Claude Desktop',
    desc: 'The chat app — install skills via claude_desktop_config.json',
    links: [
      { label: 'Mac', href: '/docs/claude-desktop/mac' },
      { label: 'Windows', href: '/docs/claude-desktop/windows' },
      { label: 'Linux', href: '/docs/claude-desktop/linux' },
    ],
  },
  {
    id: 'claude-code',
    icon: '⌨️',
    title: 'Claude Code',
    desc: 'The coding assistant — global and project-level MCP config',
    links: [
      { label: 'Beginner guide', href: '/docs/claude-code/beginner-guide' },
      { label: 'Global vs project', href: '/docs/claude-code/global-vs-project' },
      { label: 'Mac', href: '/docs/claude-code/mac' },
      { label: 'Windows', href: '/docs/claude-code/windows' },
    ],
  },
  {
    id: 'cursor',
    icon: '🖱️',
    title: 'Cursor / VS Code',
    desc: 'AI-powered editor — MCP tools via mcp.json',
    links: [
      { label: 'Mac', href: '/docs/cursor/mac' },
      { label: 'Windows', href: '/docs/cursor/windows' },
    ],
  },
  {
    id: 'openclaw',
    icon: '🦞',
    title: 'OpenClaw',
    desc: 'The easiest — one command to install any skill',
    links: [
      { label: 'Mac', href: '/docs/openclaw/mac' },
      { label: 'Windows', href: '/docs/openclaw/windows' },
      { label: 'Linux', href: '/docs/openclaw/linux' },
    ],
  },
];

const QUICK_REFERENCE = [
  { platform: 'OpenClaw',     cmd: 'openclaw skills install <slug>',                                          desc: 'Install a skill' },
  { platform: 'OpenClaw',     cmd: 'openclaw skills list',                                                    desc: 'List installed skills' },
  { platform: 'Claude Code',  cmd: 'claude mcp add <name> -- npx -y @trustedskills/<slug>-mcp',              desc: 'Add via Claude Code CLI' },
  { platform: 'MCP / Cursor', cmd: '# Paste JSON config block from skill\'s MCP tab',                        desc: 'Use JSON config tab on skill page' },
];

export default function DocsPage() {
  const totalArticles = DOC_ARTICLES.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Documentation</h1>
        <p className="text-gray-400 text-lg">
          Everything you need to install, use, and build AI agent skills — across any platform.
        </p>
        <p className="text-sm text-gray-600 mt-2">{totalArticles} articles across 6 categories</p>
      </div>

      {/* Start Here — Beginners */}
      <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-emerald-200 mb-3 flex items-center gap-2 text-lg">
          <span>👋</span> New here? Start with the concepts
        </h2>
        <p className="text-emerald-200/70 text-sm mb-4">
          Before installing anything, these three short articles will give you the full picture of how MCP, skills, and npx fit together.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/docs/concepts/mcp-vs-skills-vs-plugins', title: 'MCP vs Skills vs Plugins', desc: 'What\'s the difference?' },
            { href: '/docs/concepts/what-is-npx', title: 'What is npx?', desc: 'Why every MCP config uses it' },
            { href: '/docs/concepts/how-skills-and-mcp-work-together', title: 'How they work together', desc: 'The full lifecycle explained' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-4 bg-emerald-950/60 border border-emerald-800/40 rounded-xl hover:border-emerald-700 transition-colors"
            >
              <div className="font-medium text-emerald-200 text-sm mb-1">{item.title}</div>
              <div className="text-xs text-emerald-300/60">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* MCP / Claude Desktop Info Box */}
      <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-blue-200 mb-3 flex items-center gap-2">
          <span>💬</span> Claude Desktop / MCP Integration
        </h2>
        <div className="space-y-3 text-sm text-blue-200/80">
          <p>
            To install a TrustedSkills skill in Claude Desktop, use the{' '}
            <strong className="text-blue-200">MCP tab</strong> on any skill&apos;s detail page — it shows the exact JSON config block to paste into your{' '}
            <code className="bg-blue-900/40 px-1.5 py-0.5 rounded font-mono">claude_desktop_config.json</code>.
          </p>
          <div className="bg-blue-950/60 border border-blue-800/40 rounded-xl p-4 font-mono text-xs text-blue-300">
            {`// claude_desktop_config.json — example\n{\n  "mcpServers": {\n    "weather": {\n      "command": "npx",\n      "args": ["-y", "@trustedskills/weather-mcp"]\n    }\n  }\n}`}
          </div>
        </div>
      </div>

      {/* Quick CLI Reference */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <span>💻</span> Quick Install Reference
        </h2>
        <div className="space-y-3">
          {QUICK_REFERENCE.map((item, i) => (
            <div key={i} className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-xs bg-gray-800 border border-gray-700 text-gray-500 px-2 py-1 rounded font-medium flex-shrink-0 w-28 text-center">
                {item.platform}
              </span>
              <code className="text-xs font-mono bg-gray-950 border border-gray-700 text-emerald-400 px-2.5 py-1.5 rounded-lg flex-1 break-all">
                {item.cmd}
              </code>
              <span className="text-xs text-gray-500 flex-shrink-0 hidden sm:block w-44">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
          <span>🌐</span> Platform Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORM_CARDS.map((platform) => (
            <div
              key={platform.id}
              id={platform.id}
              className="p-5 bg-gray-900 border border-gray-800 rounded-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{platform.icon}</span>
                <h3 className="font-semibold text-white">{platform.title}</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">{platform.desc}</p>
              <div className="flex flex-wrap gap-2">
                {platform.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doc Sections by Category */}
      <div className="space-y-8">
        {DOC_CATEGORIES.map((cat) => {
          const articles = getArticlesByCategory(cat.slug);
          if (!articles.length) return null;
          return (
            <div key={cat.slug} id={cat.slug}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>{cat.icon}</span>
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {articles.map((article) => (
                  <Link
                    key={article.slug.join('/')}
                    href={`/docs/${article.slug.join('/')}`}
                    className="block p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 hover:bg-gray-900/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-medium text-gray-200 text-sm leading-tight">{article.title}</h3>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${
                          article.persona === 'beginner'
                            ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                            : article.persona === 'developer'
                            ? 'bg-blue-900/30 text-blue-400 border-blue-800'
                            : 'bg-purple-900/30 text-purple-400 border-purple-800'
                        }`}
                      >
                        {article.persona}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{article.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registry API */}
      <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
          <span>🔌</span> Registry API (Developer JSON Index)
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Machine-readable skills index for building custom integrations.{' '}
          <strong className="text-gray-400">Not an MCP server endpoint</strong> — see the MCP tab on skill pages for Claude Desktop config.
        </p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">GET</span>
          <a href="/api/index.json" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-purple-400 hover:text-purple-300 transition-colors">
            /api/index.json
          </a>
          <span className="text-sm text-gray-500">Full skills index (JSON)</span>
        </div>
        <div className="p-4 bg-gray-950 rounded-xl border border-gray-700">
          <code className="text-sm font-mono text-emerald-400">curl https://trustedskills.dev/api/index.json</code>
        </div>
      </div>

      {/* SKILL.md Reference */}
      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
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
                { field: 'name',        type: 'string',  desc: 'Unique slug identifier (lowercase, hyphens only)' },
                { field: 'description', type: 'string',  desc: 'One-line description (10-500 characters)' },
                { field: 'version',     type: 'semver',  desc: 'Semantic version (e.g. 1.0.0)' },
                { field: 'platforms',   type: 'array',   desc: 'Supported platforms: openclaw, mcp, claude, openai, cursor, huggingface' },
                { field: 'metadata',    type: 'JSON',    desc: 'Optional platform-specific config' },
              ].map((row) => (
                <tr key={row.field}>
                  <td className="py-3 pr-6"><code className="font-mono text-purple-300 text-xs">{row.field}</code></td>
                  <td className="py-3 pr-6"><span className="text-xs text-gray-500 font-mono">{row.type}</span></td>
                  <td className="py-3 text-gray-400 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help */}
      <div className="mt-8 text-center py-10 border border-gray-800 rounded-2xl">
        <h2 className="font-semibold text-white mb-2">Need help?</h2>
        <p className="text-gray-400 text-sm mb-4">Check GitHub issues or open a discussion in the community.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/submit" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            Submit a skill →
          </Link>
          <span className="text-gray-700">·</span>
          <a
            href="https://github.com/growsontrees/trustedskills-registry/discussions"
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
