import type { Metadata } from "next";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Submit a Skill",
  description: "Share your AI agent skill with the community. Learn how to submit to the TrustedSkills registry — compatible with OpenClaw, MCP, Claude, OpenAI, and more.",
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

export default function SubmitPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">Submit a Skill</h1>
        <p className="text-gray-400 text-lg">
          Share your AI agent skill with developers across the entire ecosystem.
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { emoji: "🦀", label: "OpenClaw" },
            { emoji: "🔌", label: "MCP" },
            { emoji: "💬", label: "Claude Desktop" },
            { emoji: "🤖", label: "OpenAI" },
            { emoji: "🖱️", label: "Cursor / VS Code" },
          ].map((p) => (
            <span
              key={p.label}
              className="inline-flex items-center gap-1 text-xs bg-gray-900 border border-gray-700 text-gray-400 px-2.5 py-1 rounded-full"
            >
              {p.emoji} {p.label}
            </span>
          ))}
        </div>
      </div>

      {/* Trust tiers overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
        <h2 className="font-semibold text-white mb-4">Verification Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              icon: "🔓",
              tier: "Unverified",
              color: "text-gray-400",
              bg: "bg-gray-800",
              desc: "Submitted but not yet scanned or reviewed.",
            },
            {
              icon: "🌐",
              tier: "Community",
              color: "text-blue-400",
              bg: "bg-blue-900/30",
              desc: "Passed all 6 automated security scans. Auto-assigned on merge.",
            },
            {
              icon: "✅",
              tier: "Verified",
              color: "text-emerald-400",
              bg: "bg-emerald-900/30",
              desc: "Human code review by the TrustedSkills team.",
            },
            {
              icon: "⭐",
              tier: "Featured",
              color: "text-yellow-400",
              bg: "bg-yellow-900/30",
              desc: "Editorially selected — recommended across all platforms.",
            },
          ].map((item) => (
            <div
              key={item.tier}
              className={`flex items-start gap-3 p-3 rounded-lg ${item.bg}`}
            >
              <span className="text-xl mt-0.5">{item.icon}</span>
              <div>
                <div className={`font-medium text-sm ${item.color}`}>{item.tier}</div>
                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="space-y-8">
        <h2 className="text-xl font-bold text-white">How to Submit</h2>

        {[
          {
            step: "1",
            title: "Create your skill directory",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  Create a directory for your skill with a{" "}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-xs">SKILL.md</code> file.
                  This is the core of every TrustedSkills skill — readable by OpenClaw, and exportable to MCP, Claude, and OpenAI formats.
                </p>
                <div className="bg-gray-950 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    <span className="text-xs text-gray-500 font-mono">my-skill/SKILL.md</span>
                    <CopyButton text={SKILL_TEMPLATE} label="Copy" />
                  </div>
                  <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre-wrap">
{SKILL_TEMPLATE}
                  </pre>
                </div>
              </div>
            ),
          },
          {
            step: "2",
            title: "Declare platform support",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Set the <code className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-xs">platforms</code> field
                  to list which AI platforms your skill supports. Skills that support multiple platforms get wider exposure.
                </p>
                <div className="bg-gray-950 rounded-xl border border-gray-700 p-4 font-mono text-sm">
                  <div className="text-blue-400">{"// In SKILL.md frontmatter metadata:"}</div>
                  <div className="text-gray-300 mt-2">
                    {`"platforms": ["openclaw", "mcp", "claude", "openai", "cursor"]`}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supported values: <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">openclaw</code>{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">mcp</code>{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">claude</code>{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">openai</code>{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">cursor</code>{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">huggingface</code>
                </p>
              </div>
            ),
          },
          {
            step: "3",
            title: "Add tool implementations (optional)",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  If your skill uses custom tools, add handler files in a{" "}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-xs">tools/</code> directory.
                </p>
                <div className="bg-gray-950 rounded-xl border border-gray-700 p-4 font-mono text-sm">
                  <div className="text-gray-500">my-skill/</div>
                  <div className="text-gray-400 pl-4">├── SKILL.md</div>
                  <div className="text-purple-300 pl-4">├── tools/</div>
                  <div className="text-gray-400 pl-8">└── my_tool.js</div>
                  <div className="text-gray-400 pl-4">└── README.md</div>
                </div>
              </div>
            ),
          },
          {
            step: "4",
            title: "Publish to GitHub",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Push your skill to a public GitHub repository and add the{" "}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-xs">openclaw-skill</code> topic tag
                  so it&apos;s auto-discoverable.
                </p>
                <div className="bg-gray-950 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    <span className="text-xs text-gray-500 font-mono">terminal</span>
                  </div>
                  <pre className="p-4 text-sm text-emerald-400 font-mono overflow-x-auto">
{`git init my-skill && cd my-skill
git add .
git commit -m "Initial skill"
gh repo create my-skill --public --push
gh repo edit --add-topic openclaw-skill`}
                  </pre>
                </div>
              </div>
            ),
          },
          {
            step: "5",
            title: "Create a GitHub Release",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Create a tagged release with your skill as a zip artifact. The scraper uses release metadata for versioning.
                </p>
                <div className="bg-gray-950 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                    <span className="text-xs text-gray-500 font-mono">terminal</span>
                  </div>
                  <pre className="p-4 text-sm text-emerald-400 font-mono overflow-x-auto">
{`git tag v1.0.0
git push origin v1.0.0
gh release create v1.0.0 \\
  --title "v1.0.0" \\
  --notes "Initial release" \\
  my-skill.zip`}
                  </pre>
                </div>
              </div>
            ),
          },
          {
            step: "6",
            title: "Submit a PR to the registry",
            content: (
              <div>
                <p className="text-gray-400 text-sm mb-3">
                  Open a pull request to add your skill to the{" "}
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-purple-300 text-xs">sources.json</code>{" "}
                  file in the TrustedSkills registry repository.
                </p>
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                  <div className="text-sm text-gray-300 mb-3">Add to <span className="font-mono text-purple-300">sources.json</span>:</div>
                  <pre className="text-xs font-mono text-gray-300 overflow-x-auto">
{`{
  "type": "github_repo",
  "repo": "yourusername/my-skill",
  "skills_path": ".",
  "official": false
}`}
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Or wait up to 6 hours — if your repo has the{" "}
                  <code className="bg-gray-800 px-1 py-0.5 rounded">openclaw-skill</code> topic,
                  it will be auto-discovered by the scraper.
                </p>
              </div>
            ),
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900/50 border border-purple-800 flex items-center justify-center text-purple-300 font-bold text-sm">
              {item.step}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white mb-3">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
      </div>

      {/* Requirements */}
      <div className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-4">Submission Requirements</h2>
        <ul className="space-y-2 text-sm text-gray-400">
          {[
            "SKILL.md with all required fields: name, description, version",
            "Slug format: lowercase letters, numbers, hyphens only (e.g. my-skill-name)",
            "Valid semantic version (e.g. 1.0.0)",
            "No hardcoded API keys or secrets in any file",
            "All tool files referenced in SKILL.md must exist",
            "Public GitHub repository with the skill code",
            "License file (MIT, Apache-2.0, or similar OSS license)",
            "platforms field set to at least one supported platform value",
          ].map((req) => (
            <li key={req} className="flex items-start gap-2">
              <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="font-semibold text-white mb-4">FAQ</h2>
        <div className="space-y-4">
          {[
            {
              q: "How long until my skill appears?",
              a: "If you add the openclaw-skill GitHub topic, auto-discovery runs every 6 hours. Manual PR submissions are reviewed within 5 business days.",
            },
            {
              q: "Can I submit skills for Claude Desktop, Cursor, or OpenAI?",
              a: "Yes! Set the platforms field in your SKILL.md to include mcp, claude, cursor, openai, or huggingface. Multi-platform skills get wider exposure and show platform-specific install instructions on their detail page.",
            },
            {
              q: "How do I reach Verified status?",
              a: "After your skill passes automated scans and merges (Community tier), request a human review by commenting on the PR or opening a review request issue.",
            },
            {
              q: "Can I update my skill?",
              a: "Yes. Create a new GitHub Release with a higher version number. The scraper will pick it up automatically.",
            },
            {
              q: "Does my skill need to support all platforms?",
              a: "No — you can support just one. Most skills start with OpenClaw or MCP and expand. The registry will show the right install instructions based on what you declare in the platforms field.",
            },
          ].map((item) => (
            <div key={item.q} className="border border-gray-800 rounded-xl p-5">
              <h3 className="font-medium text-gray-200 mb-1.5">{item.q}</h3>
              <p className="text-sm text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
