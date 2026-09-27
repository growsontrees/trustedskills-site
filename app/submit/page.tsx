import type { Metadata } from "next";
import Link from "next/link";
import { InstallBlock } from "../../components/InstallBlock";
import { TIER_CONFIG, TIER_ORDER } from "../../lib/skill-config";
import { Check, Info, platformIcon } from "../../components/icons";
import { Eyebrow, Note, Panel, cx } from "../../components/ui";

export const metadata: Metadata = {
  title: "Submit a Skill",
  description:
    "Add your AI agent skill to the TrustedSkills index — compatible with OpenClaw, MCP, Claude, OpenAI, Cursor and more.",
};

const SKILL_TEMPLATE = `---
name: my-skill-name
description: "One-line description of what your skill does (10-500 chars)"
version: 1.0.0
metadata: {"openclaw":{"emoji":"🔧"},"platforms":["openclaw","mcp"]}
---

## Instructions

Describe how the agent should use this skill. This text is injected
into the system prompt when the skill is active.

## Tools

### \`my_tool_name\`

What this tool does.

**Parameters:**
- \`param1\` (string, required): Description of the parameter

**Returns:** What the tool returns`;

const PLATFORMS = [
  { key: "openclaw", label: "OpenClaw" },
  { key: "mcp", label: "MCP" },
  { key: "claude", label: "Claude Desktop" },
  { key: "openai", label: "OpenAI" },
  { key: "cursor", label: "Cursor / VS Code" },
];

const REQUIREMENTS = [
  "SKILL.md with all required fields: name, description, version",
  "Slug format: lowercase letters, numbers and hyphens only (e.g. my-skill-name)",
  "Valid semantic version (e.g. 1.0.0)",
  "No hardcoded API keys or secrets in any file",
  "All tool files referenced in SKILL.md must exist",
  "A public GitHub repository holding the skill code",
  "A licence file (MIT, Apache-2.0 or a similar OSS licence)",
  "A platforms field naming at least one supported platform",
];

const FAQ = [
  {
    q: "How long until my skill appears?",
    a: "If your repository carries the openclaw-skill GitHub topic, auto-discovery picks it up on the next scraper run — usually within six hours. A manual pull request lands whenever a maintainer merges it; there is no service-level commitment on that.",
  },
  {
    q: "Can I submit skills for Claude Desktop, Cursor or OpenAI?",
    a: "Yes. Set the platforms field in your SKILL.md to include mcp, claude, cursor, openai or huggingface. The detail page then shows the install snippet for each platform you declare.",
  },
  {
    q: "Will anyone review my code?",
    a: "No. TrustedSkills indexes skills and records where they came from — nobody reads the code as part of listing it. Badges describe provenance and machine checks, never a human audit.",
  },
  {
    q: "How do I get a stronger badge?",
    a: "Official is assigned automatically when the publishing account matches a vendor's own GitHub organisation. Featured is an editorial pick. Pinned means we've recorded a commit and stored a snapshot of it. None of them can be requested.",
  },
  {
    q: "Can I update my skill?",
    a: "Yes. Cut a new GitHub release with a higher version number and the scraper picks it up. If your skill is pinned, the pinned commit is updated on the next sync, not instantly.",
  },
  {
    q: "Does my skill need to support every platform?",
    a: "No — one is enough. Most start with OpenClaw or MCP and expand later.",
  },
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="tabular flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-700 bg-ink-850 text-xs font-semibold text-ink-300">
        {n}
      </span>
      <div className="min-w-0 flex-1 pb-2">
        <h3 className="text-sm font-semibold text-ink-50">{title}</h3>
        <div className="mt-2.5 space-y-3">{children}</div>
      </div>
    </li>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-xs border border-ink-750 bg-ink-850 px-1 py-px font-mono text-2xs text-ink-200">
      {children}
    </code>
  );
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-ink-800 pb-6">
        <h1 className="text-3xl font-semibold text-ink-50">Submit a skill</h1>
        <p className="mt-2 max-w-2xl text-base text-ink-400">
          Add your skill to the index so it turns up when someone searches for what it does.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => {
            const Icon = platformIcon(p.key);
            return (
              <span
                key={p.key}
                className="inline-flex items-center gap-1.5 rounded-sm border border-ink-750 bg-ink-900 px-2 py-1 text-2xs text-ink-400"
              >
                <Icon className="h-3 w-3" />
                {p.label}
              </span>
            );
          })}
        </div>
      </header>

      {/* Badges — read from the same config the listings use, so this page
          can't drift back into describing checks nobody runs. */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-ink-50">What the badges mean</h2>
        <p className="mt-1.5 text-sm text-ink-450">
          Badges are assigned by the registry. None of them can be applied for.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {TIER_ORDER.map((tier) => {
            const config = TIER_CONFIG[tier];
            const Icon = config.icon;
            return (
              <Link
                key={tier}
                href={`/tier/${tier}/`}
                className="flex items-start gap-3 rounded-lg border border-ink-750 bg-ink-900 p-3.5 transition duration-fast ease-out hover:border-ink-650 hover:bg-ink-850"
              >
                <Icon
                  className={cx(
                    "mt-0.5 h-4 w-4 shrink-0",
                    config.tone === "accent"
                      ? "text-accent-400"
                      : config.tone === "ok"
                      ? "text-ok-400"
                      : config.tone === "warn"
                      ? "text-warn-400"
                      : "text-ink-500"
                  )}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-100">{config.label}</div>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-450">
                    {config.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-3">
          <Note icon={Info}>
            No badge on this site means a person has read your code. We record provenance and run
            machine checks; we don&apos;t audit skills.
          </Note>
        </div>
      </section>

      {/* Steps */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-ink-50">How to submit</h2>

        <ol className="mt-6 space-y-8">
          <Step n={1} title="Create your skill directory">
            <p className="text-sm leading-relaxed text-ink-400">
              Every skill is a directory with a <Code>SKILL.md</Code> at its root. That one file is
              readable by OpenClaw and exportable to the MCP, Claude and OpenAI formats.
            </p>
            <InstallBlock label="my-skill/SKILL.md" code={SKILL_TEMPLATE} />
          </Step>

          <Step n={2} title="Declare platform support">
            <p className="text-sm leading-relaxed text-ink-400">
              The <Code>platforms</Code> field decides which install snippets your detail page
              offers.
            </p>
            <InstallBlock
              label="SKILL.md — frontmatter metadata"
              code={`"platforms": ["openclaw", "mcp", "claude", "openai", "cursor"]`}
            />
            <p className="text-xs text-ink-500">
              Accepted values: <Code>openclaw</Code> <Code>mcp</Code> <Code>claude</Code>{" "}
              <Code>claudecode</Code> <Code>openai</Code> <Code>cursor</Code>{" "}
              <Code>huggingface</Code>
            </p>
          </Step>

          <Step n={3} title="Add tool implementations (optional)">
            <p className="text-sm leading-relaxed text-ink-400">
              If your skill ships custom tools, put the handlers in a <Code>tools/</Code> directory
              next to the manifest.
            </p>
            <div className="rounded-lg border border-ink-750 bg-ink-1000 p-3 font-mono text-2xs leading-relaxed">
              <div className="text-ink-400">my-skill/</div>
              <div className="pl-3 text-ink-500">├── SKILL.md</div>
              <div className="pl-3 text-ink-300">├── tools/</div>
              <div className="pl-7 text-ink-500">└── my_tool.js</div>
              <div className="pl-3 text-ink-500">└── README.md</div>
            </div>
          </Step>

          <Step n={4} title="Publish to GitHub">
            <p className="text-sm leading-relaxed text-ink-400">
              Push to a public repository and add the <Code>openclaw-skill</Code> topic so the
              scraper can find it.
            </p>
            <InstallBlock
              label="terminal"
              code={`git init my-skill && cd my-skill
git add .
git commit -m "Initial skill"
gh repo create my-skill --public --push
gh repo edit --add-topic openclaw-skill`}
            />
          </Step>

          <Step n={5} title="Create a GitHub release">
            <p className="text-sm leading-relaxed text-ink-400">
              Tag a release with your skill as a zip artifact — the scraper reads release metadata
              for versioning.
            </p>
            <InstallBlock
              label="terminal"
              code={`git tag v1.0.0
git push origin v1.0.0
gh release create v1.0.0 \\
  --title "v1.0.0" \\
  --notes "Initial release" \\
  my-skill.zip`}
            />
          </Step>

          <Step n={6} title="Open a pull request against the registry">
            <p className="text-sm leading-relaxed text-ink-400">
              Add an entry to <Code>sources.json</Code> in the registry repository.
            </p>
            <InstallBlock
              label="sources.json"
              code={`{
  "type": "github_repo",
  "repo": "yourusername/my-skill",
  "skills_path": ".",
  "official": false
}`}
            />
            <p className="text-xs leading-relaxed text-ink-500">
              Or skip the pull request — a repository carrying the <Code>openclaw-skill</Code> topic
              is picked up automatically on the next scraper run.
            </p>
          </Step>
        </ol>
      </section>

      {/* Requirements */}
      <section className="mt-12">
        <Panel>
          <h2 className="text-sm font-semibold text-ink-50">Submission requirements</h2>
          <ul className="mt-stack-lg space-y-2">
            {REQUIREMENTS.map((req) => (
              <li key={req} className="flex items-start gap-2.5 text-sm text-ink-400">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ok-400" />
                {req}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="mt-1 text-lg font-semibold text-ink-50">Before you submit</h2>
        <div className="mt-4 divide-y divide-ink-800 overflow-hidden rounded-xl border border-ink-750 bg-ink-900">
          {FAQ.map((item) => (
            <div key={item.q} className="p-gutter">
              <h3 className="text-sm font-medium text-ink-100">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-450">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
