import type { Metadata } from 'next';
import Link from 'next/link';
import { DOC_ARTICLES, DOC_CATEGORIES, getArticlesByCategory } from '../../lib/docs-content';
import { BookOpen, Compass, Globe, Terminal as TerminalIcon, docCategoryIcon, platformIcon } from '../../components/icons';
import { canonicalUrl } from '../../lib/site-url';

export const metadata: Metadata = {
  title: 'Documentation',
  description:
    'TrustedSkills documentation — learn how to install, use, and build AI agent skills for OpenClaw, MCP, Claude Desktop, Cursor, and more.',
  alternates: { canonical: canonicalUrl('/docs') },
};

const PLATFORM_CARDS = [
  {
    id: 'claude-desktop',
    icon: platformIcon('claude'),
    title: 'Claude Desktop',
    desc: 'The chat app — add MCP servers via claude_desktop_config.json',
    links: [
      { label: 'Mac', href: '/docs/claude-desktop/mac' },
      { label: 'Windows', href: '/docs/claude-desktop/windows' },
      { label: 'Linux', href: '/docs/claude-desktop/linux' },
    ],
  },
  {
    id: 'claude-code',
    icon: platformIcon('claudecode'),
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
    icon: platformIcon('cursor'),
    title: 'Cursor / VS Code',
    desc: 'AI-powered editor — MCP tools via mcp.json',
    links: [
      { label: 'Mac', href: '/docs/cursor/mac' },
      { label: 'Windows', href: '/docs/cursor/windows' },
    ],
  },
  {
    id: 'openclaw',
    icon: platformIcon('openclaw'),
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
  { platform: 'Any agent',   cmd: 'npx skills add <owner>/<repo> --skill <name>',                  desc: 'Install a SKILL.md skill' },
  { platform: 'One agent',   cmd: 'npx skills add <owner>/<repo> --skill <name> -a claude-code',   desc: 'Install for one agent only' },
  { platform: 'Global',      cmd: 'npx skills add <owner>/<repo> --skill <name> -g',               desc: 'Install for your user, not this project' },
  { platform: 'Installed',   cmd: 'npx skills list',                                               desc: 'List installed skills' },
];

export default function DocsPage() {
  const totalArticles = DOC_ARTICLES.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-ink-50 mb-3">Documentation</h1>
        <p className="text-ink-400 text-lg">
          Everything you need to install, use, and build AI agent skills — across any platform.
        </p>
        <p className="text-sm text-ink-500 mt-2">{totalArticles} articles across 6 categories</p>
      </div>

      {/* Start Here — Beginners */}
      <div className="bg-emerald-950/40 border border-ok-800/60 rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-emerald-200 mb-3 flex items-center gap-2 text-lg">
          <Compass className="h-4 w-4" /> New here? Start with the concepts
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
              className="block p-4 bg-emerald-950/60 border border-ok-800/40 rounded-xl hover:border-emerald-700 transition-colors"
            >
              <div className="font-medium text-emerald-200 text-sm mb-1">{item.title}</div>
              <div className="text-xs text-ok-300/60">{item.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* MCP / Claude Desktop Info Box */}
      <div className="bg-blue-950/40 border border-accent-800/60 rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-blue-200 mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" /> Skills vs MCP servers
        </h2>
        <div className="space-y-3 text-sm text-blue-200/80">
          <p>
            Most skills on TrustedSkills are SKILL.md skills. Install one with the{' '}
            <code className="bg-accent-950/40 px-1.5 py-0.5 rounded font-mono">npx skills add</code> command on its page. It needs no JSON config.
          </p>
          <p>
            An MCP server is different. You add it to your client&apos;s config file, such as{' '}
            <code className="bg-accent-950/40 px-1.5 py-0.5 rounded font-mono">claude_desktop_config.json</code>. Copy the block from the server&apos;s own README. For example:
          </p>
          <div className="bg-blue-950/60 border border-accent-800/40 rounded-xl p-4 font-mono text-xs text-blue-300 whitespace-pre overflow-x-auto">
            {`// claude_desktop_config.json\n{\n  "mcpServers": {\n    "memory": {\n      "command": "npx",\n      "args": ["-y", "@modelcontextprotocol/server-memory"]\n    }\n  }\n}`}
          </div>
        </div>
      </div>

      {/* Quick CLI Reference */}
      <div className="bg-ink-900 border border-ink-800 rounded-xl p-6 mb-10">
        <h2 className="font-semibold text-ink-50 mb-4 flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" /> Quick Install Reference
        </h2>
        <div className="space-y-3">
          {QUICK_REFERENCE.map((item, i) => (
            <div key={i} className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
              <span className="text-xs bg-ink-850 border border-ink-750 text-ink-450 px-2 py-1 rounded font-medium flex-shrink-0 w-28 text-center">
                {item.platform}
              </span>
              <code className="text-xs font-mono bg-ink-1000 border border-ink-750 text-ok-400 px-2.5 py-1.5 rounded-lg flex-1 break-all">
                {item.cmd}
              </code>
              <span className="text-xs text-ink-450 flex-shrink-0 hidden sm:block w-44">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-ink-50 mb-5 flex items-center gap-2">
          <Globe className="h-4 w-4" /> Platform Guides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORM_CARDS.map((platform) => (
            <div
              key={platform.id}
              id={platform.id}
              className="p-5 bg-ink-900 border border-ink-800 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-750 bg-ink-850 text-ink-400">
                  <platform.icon className="h-4 w-4" />
                </span>
                <h3 className="font-semibold text-ink-50">{platform.title}</h3>
              </div>
              <p className="text-sm text-ink-400 mb-4">{platform.desc}</p>
              <div className="flex flex-wrap gap-2">
                {platform.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs px-3 py-1.5 bg-ink-850 hover:bg-ink-800 border border-ink-750 rounded-lg text-ink-300 hover:text-ink-50 transition-colors"
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
              <h2 className="text-lg font-bold text-ink-50 mb-4 flex items-center gap-2">
                {(() => { const Icon = docCategoryIcon(cat.slug); return <Icon className="h-4 w-4 text-ink-450" />; })()}
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {articles.map((article) => (
                  <Link
                    key={article.slug.join('/')}
                    href={`/docs/${article.slug.join('/')}`}
                    className="block p-4 bg-ink-900 border border-ink-800 rounded-xl hover:border-ink-750 hover:bg-ink-900/80 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-medium text-ink-200 text-sm leading-tight">{article.title}</h3>
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded border flex-shrink-0 ${
                          article.persona === 'beginner'
                            ? 'bg-ok-950/30 text-ok-400 border-ok-800'
                            : article.persona === 'developer'
                            ? 'bg-accent-950/30 text-accent-400 border-accent-800'
                            : 'bg-accent-950/30 text-accent-400 border-accent-800'
                        }`}
                      >
                        {article.persona}
                      </span>
                    </div>
                    <p className="text-xs text-ink-450 leading-relaxed">{article.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>



      {/* SKILL.md Reference */}
      <div className="mt-8 bg-ink-900 border border-ink-800 rounded-xl p-6">
        <h2 className="font-semibold text-ink-50 mb-4">SKILL.md Required Fields</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-450 uppercase tracking-wider">
                <th className="pb-3 pr-6">Field</th>
                <th className="pb-3 pr-6">Type</th>
                <th className="pb-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {[
                { field: 'name',        type: 'string',  desc: 'Unique slug identifier (lowercase, hyphens only)' },
                { field: 'description', type: 'string',  desc: 'One-line description (10-500 characters)' },
                { field: 'version',     type: 'semver',  desc: 'Semantic version (e.g. 1.0.0)' },
                { field: 'platforms',   type: 'array',   desc: 'Supported platforms: openclaw, mcp, claude, openai, cursor, huggingface' },
                { field: 'metadata',    type: 'JSON',    desc: 'Optional platform-specific config' },
              ].map((row) => (
                <tr key={row.field}>
                  <td className="py-3 pr-6"><code className="font-mono text-accent-300 text-xs">{row.field}</code></td>
                  <td className="py-3 pr-6"><span className="text-xs text-ink-450 font-mono">{row.type}</span></td>
                  <td className="py-3 text-ink-400 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help */}
      <div className="mt-8 text-center py-10 border border-ink-800 rounded-xl">
        <h2 className="font-semibold text-ink-50 mb-2">Need help?</h2>
        <p className="text-ink-400 text-sm mb-4">Check GitHub issues or open a discussion in the community.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/submit" className="text-sm text-accent-400 hover:text-accent-300 transition-colors">
            Submit a skill →
          </Link>
          <span className="text-ink-600">·</span>
          <a
            href="https://github.com/growsontrees/trustedskills-registry/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
          >
            Community discussions →
          </a>
        </div>
      </div>
    </div>
  );
}
