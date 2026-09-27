import { REPORT_SKILL_URL, REPORT_PROMISE } from './github-links';
import { getPlatformInstall } from './platform-install';

/**
 * The worked example on the `install-a-skill` pages: a real listing,
 * https://trustedskills.dev/skills/find-skills. 25,634 of the 26,001 indexed
 * skills carry an install command of exactly this shape.
 */
const EXAMPLE_INSTALL = 'npx skills add vercel-labs/skills --skill find-skills';

/**
 * Every command printed on an `install-a-skill` page comes from
 * `getPlatformInstall()` — the same generator behind the install box on each
 * skill page and each card. A change to the generator changes the docs, so the
 * two cannot drift apart.
 *
 * Claude Desktop returns `isFallback: true`: the skills CLI has no agent target
 * for it, so that page says so instead of printing an aimed command.
 * Each command was run once against the skills CLI on 2026-09-27.
 */
const INSTALL_CLAUDE_CODE = getPlatformInstall(EXAMPLE_INSTALL, 'claudecode');
const INSTALL_CURSOR = getPlatformInstall(EXAMPLE_INSTALL, 'cursor');
const INSTALL_CLAUDE_DESKTOP = getPlatformInstall(EXAMPLE_INSTALL, 'claude');
const EXAMPLE_USE = EXAMPLE_INSTALL.replace('skills add', 'skills use');

export interface DocArticle {
  slug: string[];
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  persona: 'beginner' | 'developer' | 'advanced';
  /**
   * The day this article's facts last changed, shown on the page. Bump it
   * only for that article, and only for a content change — not for a sweep
   * that renames a term or a link across every article.
   */
  lastUpdated: string;
  author: { name: string; bio: string };
  content: string;
}

const TRUSTEDSKILLS_AUTHOR = {
  name: 'TrustedSkills Team',
  bio: 'The TrustedSkills team maintains the TrustedSkills index of AI agent skills. The index records where each skill comes from and how to install it. It does not review or audit skill code.',
};

export const DOC_CATEGORIES = [
  { slug: 'concepts', label: 'Foundational Concepts', icon: '💡' },
  { slug: 'claude-desktop', label: 'Claude Desktop', icon: '🖥️' },
  { slug: 'claude-code', label: 'Claude Code', icon: '⌨️' },
  { slug: 'cursor', label: 'Cursor / VS Code', icon: '🖱️' },
  { slug: 'openclaw', label: 'OpenClaw', icon: '🦞' },
  { slug: 'advanced', label: 'Advanced Topics', icon: '🚀' },
  { slug: 'guides', label: 'Guides', icon: '📖' },
];

export const DOC_ARTICLES: DocArticle[] = [
  // ─── CONCEPTS ───────────────────────────────────────────────────────────────
  {
    slug: ['concepts', 'mcp-vs-skills-vs-plugins'],
    title: 'MCP vs Skills vs Plugins AI: What\'s the Difference?',
    description: 'Understand MCP vs skills vs plugins AI terminology once and for all. Clear definitions, a side-by-side comparison table, and practical guidance on when to use each term.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP vs Skills vs Plugins AI: What's the Difference?","description":"Understand MCP vs skills vs plugins AI terminology. Clear definitions and a comparison table.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>MCP</strong> is the protocol (how AI talks to tools). <strong>Skills</strong> and <strong>plugins</strong> are both names for the packaged tools themselves — different platforms, same idea. TrustedSkills calls them "skills"; ChatGPT called them "plugins". You'll use all three terms depending on which docs you're reading.</p>
</div>

<p class="article-intro">"MCP server", "skill" and "plugin" get used as if they mean the same thing. They are related, but they are not identical. This page explains how they differ.</p>

<h2>MCP vs Skills vs Plugins AI: The Core Distinction</h2>
<p>Three terms, one ecosystem. Here's what each actually means:</p>
<ul>
  <li><strong>MCP</strong> is a <em>protocol</em> — the standard that defines how AI agents communicate with external tools</li>
  <li><strong>Skills</strong> are <em>packages</em> — installable capabilities that use MCP under the hood</li>
  <li><strong>Plugins</strong> are <em>the same thing as skills</em> — just a different word from a different era</li>
</ul>

<h2>The Analogy That Actually Makes It Click</h2>
<p>Think about the web. <strong>HTTP</strong> is the protocol — nobody argues about whether a website "uses HTTP"; it just does. The website is the thing you care about. HTTP is just how it communicates.</p>
<p>Same deal here:</p>
<ul>
  <li><strong>MCP</strong> = HTTP (the protocol)</li>
  <li><strong>Skills / Plugins</strong> = websites (the things built on top)</li>
</ul>
<p>You don't need to understand MCP deeply to use a skill. But it helps to know it exists — especially when something breaks.</p>

<h2>MCP — The Model Context Protocol</h2>
<p><strong>MCP</strong> (Model Context Protocol) is Anthropic's open standard for how AI models call external tools. It defines:</p>
<ul>
  <li>How a tool advertises its capabilities</li>
  <li>How an AI model calls that tool</li>
  <li>How the tool returns results</li>
  <li>How the connection is set up and maintained</li>
</ul>
<p>Practically speaking, an MCP server is a small process — usually Node.js or Python — that runs alongside your AI client. The client connects to it, discovers what it can do, and calls it when you ask something relevant. No network ports, no complicated setup. Just a background process.</p>

<h2>Skills — What You Actually Install</h2>
<p>A <strong>skill</strong> is a packaged, installable capability. It can be:</p>
<ul>
  <li>An MCP server (the most common type, by far)</li>
  <li>A set of prompt templates</li>
  <li>A config bundle for a specific task</li>
  <li>Some combination of the above</li>
</ul>
<p>TrustedSkills is the registry where these live. When you find a skill here, it usually means: install this npm package via <code>npx -y</code>, add a JSON snippet to your config file, restart your AI client, and you're done.</p>

<h2>Plugins — Same Thing, Different Era</h2>
<p>Here's the thing: "plugin" is just an older word for the same concept. OpenAI launched "ChatGPT Plugins" back in 2023, then rebranded to Custom GPTs, then GPT Actions. Anthropic uses "tools" and "MCP servers". OpenClaw says "skills". Cursor says "MCP tools".</p>
<p>Don't let the terminology wars confuse you. They all mean: <em>packaged capabilities that extend what an AI agent can do</em>.</p>

<h2>MCP vs Skills vs Plugins: Side-by-Side</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Term</th><th>What it is</th><th>Who uses it</th><th>Technical form</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>MCP</strong></td>
        <td>Protocol standard for AI-tool communication</td>
        <td>Anthropic, Claude, Cursor, most modern platforms</td>
        <td>JSON-RPC over stdio (local) or Streamable HTTP (remote)</td>
      </tr>
      <tr>
        <td><strong>Skill</strong></td>
        <td>Packaged, installable AI capability</td>
        <td>TrustedSkills, OpenClaw</td>
        <td>npm package, MCP server, or config bundle</td>
      </tr>
      <tr>
        <td><strong>Plugin</strong></td>
        <td>Same as a skill — older terminology</td>
        <td>ChatGPT (legacy), browser extensions</td>
        <td>Same as skill; may use different protocols</td>
      </tr>
      <tr>
        <td><strong>MCP Server</strong></td>
        <td>The running process that implements MCP</td>
        <td>All MCP-compatible platforms</td>
        <td>Node.js / Python process on stdio</td>
      </tr>
      <tr>
        <td><strong>Tool</strong></td>
        <td>A single function exposed by an MCP server</td>
        <td>All platforms</td>
        <td>JSON schema + handler function</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>When to Use Each Term</h2>

<h3>Say "MCP" when…</h3>
<ul>
  <li>You're editing a <code>claude_desktop_config.json</code> file — the key is literally called <code>mcpServers</code></li>
  <li>You're building a server that exposes tools to Claude</li>
  <li>You're reading Anthropic's technical documentation</li>
</ul>

<h3>Say "skill" when…</h3>
<ul>
  <li>You're browsing TrustedSkills to find something useful</li>
  <li>You're publishing something to the registry</li>
  <li>You're explaining to a colleague what your AI agent can do</li>
</ul>

<h3>Say "plugin" when…</h3>
<ul>
  <li>You're reading older ChatGPT docs or talking to someone familiar with browser extensions</li>
  <li>You want the most universally understood term outside the MCP ecosystem</li>
</ul>

<h2>The Takeaway</h2>
<p>Don't get lost in the words. Skills, plugins, MCP servers — they all extend what your AI agent can do. TrustedSkills lists them in one place so you can find and install them regardless of which platform you're on.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What's the difference between MCP and a skill?</h3>
<p>MCP is the communication protocol — like HTTP for web browsers. A skill is a packaged capability that uses MCP to communicate with your AI client. You interact with skills; MCP runs silently in the background.</p>

<h3>Are plugins and skills the same thing?</h3>
<p>Functionally, yes. "Plugin" was ChatGPT's word for it; "skill" is what TrustedSkills and OpenClaw use. Both mean an installable package that extends an AI agent's capabilities. The underlying technology may differ slightly, but the concept is identical.</p>

<h3>Do I need to understand MCP to use skills?</h3>
<p>Nope. You copy a JSON snippet from TrustedSkills into your config file. MCP handles everything else invisibly. Understanding MCP only matters if you want to build your own skills from scratch.</p>

<h3>Which platforms support MCP?</h3>
<p>Claude Desktop, Claude Code, Cursor, OpenClaw — and the list is growing fast. Because MCP is an open standard, adoption has been rapid. Most serious AI coding tools now support it.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What's the difference between MCP and a skill?","acceptedAnswer":{"@type":"Answer","text":"MCP is the communication protocol. A skill is a packaged capability that uses MCP. You interact with skills; MCP runs in the background."}},{"@type":"Question","name":"Are plugins and skills the same thing?","acceptedAnswer":{"@type":"Answer","text":"Functionally yes. 'Plugin' was ChatGPT's term; 'skill' is used by TrustedSkills and OpenClaw. Same concept, different branding."}},{"@type":"Question","name":"Do I need to understand MCP to use skills?","acceptedAnswer":{"@type":"Answer","text":"No. Copy a JSON snippet from TrustedSkills into your config file. MCP handles everything else."}},{"@type":"Question","name":"Which platforms support MCP?","acceptedAnswer":{"@type":"Answer","text":"Claude Desktop, Claude Code, Cursor, OpenClaw, and many others. MCP is an open standard with rapid adoption."}}]}
</script>
    `,
  },

  {
    slug: ['concepts', 'what-is-npx'],
    title: 'What is npx MCP Server? Why Every MCP Config Uses It',
    description: 'What is npx MCP server — explained simply. Learn why every MCP config uses npx -y, what the flag does, and when to use npx vs a global npm install for your AI skills.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"What is npx MCP Server? Why Every MCP Config Uses It","description":"What is npx MCP server — how it runs packages without installing globally, and why every MCP config uses npx -y.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>npx</strong> runs an npm package without a permanent global install. Every MCP config uses <code>npx -y</code> because it lets your AI client launch skills automatically — no manual setup, always fresh, works on any machine with Node.js. The <code>-y</code> flag just skips the "are you sure?" prompt.</p>
</div>

<p class="article-intro">Almost every MCP config contains <code>"command": "npx", "args": ["-y", "@some/package"]</code>. This page explains what npx does there, why the package isn't installed first, and what the <code>-y</code> is for.</p>

<h2>The Problem npx Solves for MCP Servers</h2>
<p>Old way: install globally, then run. <code>npm install -g weather-server</code>, then <code>weather-server</code>. Works fine — but it means every machine needs that pre-install step, version conflicts become a nightmare, and things quietly go stale.</p>
<p>npx skips all of that. It downloads the package, runs it, caches it locally. No global install. No cleanup. No version drift.</p>

<h2>The Vending Machine Analogy</h2>
<p>Global install = buying a snack and storing it in your pantry. Always available, but takes up permanent space and eventually goes stale.</p>
<p>npx = vending machine. You get exactly what you need, right now, fresh. Nothing left behind.</p>

<h2>What npx Actually Does (Step by Step)</h2>
<p>When Claude Desktop runs <code>npx @modelcontextprotocol/server-memory</code>:</p>
<ol>
  <li>Checks the local cache — is this package already downloaded?</li>
  <li>If not: fetches the latest version from npm</li>
  <li>Runs it immediately</li>
  <li>Caches it. Next time, npx checks npm for a newer version, then runs from the cache</li>
</ol>
<p>That's it. No global install and no PATH changes.</p>

<h2>Why <code>-y</code>? That One Flag Explained</h2>
<p>Without <code>-y</code>, npx asks you to confirm before downloading a new package:</p>
<pre><code class="language-bash">npx @modelcontextprotocol/server-memory
# Need to install the following packages:
#   @modelcontextprotocol/server-memory
# Ok to proceed? (y)</code></pre>
<p>You only see that prompt when you run npx in a terminal. When an app launches an MCP server there is no terminal, and current npm versions install without asking. Configs still include <code>-y</code> so the command never stops to ask, whoever runs it:</p>
<pre><code class="language-bash">npx -y @modelcontextprotocol/server-memory
# Runs immediately. No questions asked.</code></pre>

<h2>A Real MCP Config, Dissected</h2>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<ul>
  <li><code>"command": "npx"</code> — run npx</li>
  <li><code>"-y"</code> — auto-confirm any install prompt</li>
  <li><code>"@modelcontextprotocol/server-memory"</code> — the package to run</li>
</ul>
<p>That's the whole thing. Three fields, one working MCP server.</p>

<h2>npx vs Global Install: When to Use Which</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Situation</th><th>Use</th><th>Why</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>MCP server in a config file</td>
        <td><code>npx -y</code></td>
        <td>Works without manual install on any machine</td>
      </tr>
      <tr>
        <td>CLI tools you run daily</td>
        <td>Global install</td>
        <td>Faster startup, always in PATH</td>
      </tr>
      <tr>
        <td>One-off script</td>
        <td><code>npx</code></td>
        <td>No clutter, no cleanup</td>
      </tr>
      <tr>
        <td>Team project dependency</td>
        <td>Local install in package.json</td>
        <td>Version-locked, reproducible builds</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Do I Need Node.js?</h2>
<p>Yes — npx is bundled with Node.js. If you don't have it:</p>
<ul>
  <li><strong>Mac:</strong> <code>brew install node</code> or download from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a></li>
  <li><strong>Windows:</strong> Download the installer from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> — check "Add to PATH" during install</li>
  <li><strong>Linux:</strong> use <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a> or the installers on <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. Distribution packages can be too old: servers built on the official MCP SDK need Node.js 18 or later.</li>
</ul>
<p>Verify it worked:</p>
<pre><code class="language-bash">npx --version
# 10.5.0  ← something like this means you're good</code></pre>

<div class="tip-box">
  <strong>💡 Heads up:</strong> If you get "command not found: npx" after installing Node.js, close and reopen your terminal. On Mac with nvm, you may need to add nvm to your shell profile first.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Does npx download the package every single time?</h3>
<p>No. It caches packages after the first download. For a package name without a version, npx checks npm on each launch and downloads a newer version if there is one. Pin a version with <code>@version</code> to stop that.</p>

<h3>What does npx -y do in an MCP config?</h3>
<p>The <code>-y</code> flag answers "yes" to npx's install prompt. npx only shows that prompt in a terminal, so apps that launch servers in the background work without it. Keeping <code>-y</code> makes the command behave the same everywhere.</p>

<h3>Can I pin a specific version with npx?</h3>
<p>Yes. Use the <code>@version</code> syntax: <code>npx -y @modelcontextprotocol/server-memory@2026.8.31</code>. Good for production setups where you want reproducible behaviour and don't want surprise updates.</p>

<h3>What if npx isn't found on my system?</h3>
<p>Install or reinstall Node.js from nodejs.org. npx ships with npm, which comes with Node.js. On Windows, make sure you checked "Add to PATH" during installation.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Does npx download the package every single time?","acceptedAnswer":{"@type":"Answer","text":"No. It caches packages after the first download. For a package name without a version, npx checks npm on each launch for a newer version."}},{"@type":"Question","name":"What does npx -y do in an MCP config?","acceptedAnswer":{"@type":"Answer","text":"The -y flag answers yes to npx's install prompt. npx only prompts in a terminal; -y makes the command behave the same everywhere."}},{"@type":"Question","name":"Can I pin a specific version with npx?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use npx -y @modelcontextprotocol/server-memory@2026.8.31 to pin to a specific version."}},{"@type":"Question","name":"What if npx isn't found on my system?","acceptedAnswer":{"@type":"Answer","text":"Install Node.js from nodejs.org. npx ships with npm, which comes with Node.js."}}]}
</script>
    `,
  },

  {
    slug: ['concepts', 'how-skills-and-mcp-work-together'],
    title: 'How Skills and MCP Servers Work Together in AI Agents',
    description: 'How skills and MCP servers work together in AI agents — the full lifecycle from finding an MCP server to your AI agent calling its tools, with architecture diagrams and real-world examples.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How Skills and MCP Servers Work Together in AI Agents","description":"How skills and MCP servers work together in AI agents — the full lifecycle from finding an MCP server to tool calling.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Here's how it works: you find a skill, add its config to your AI client, the client launches the skill as a background subprocess, and the AI model calls that subprocess's tools when your conversation needs them. Communication is JSON-RPC over stdio — no ports, no network config, just pipes between processes.</p>
</div>

<p class="article-intro">You don't need to know how MCP works under the hood to use it. Knowing it does make a broken config much easier to debug.</p>

<h2>The Architecture in One Diagram</h2>
<pre><code class="language-bash">┌─────────────────────────────────────────────────────────┐
│                     An MCP server                       │
│  e.g. a weather server (made-up example)                │
└───────────────────────┬─────────────────────────────────┘
                        │ (1) You find a server
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  AI Client Config                        │
│  { "mcpServers": { "weather": {                         │
│      "command": "npx",                                  │
│      "args": ["-y", "&lt;weather-server&gt;"] } } }           │
└───────────────────────┬─────────────────────────────────┘
                        │ (2) Client starts MCP server as subprocess
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  MCP Server Process                      │
│  npx -y &lt;weather-server&gt;                                │
│  Listens on stdio · Exposes:                            │
│    get_weather(location, units)                          │
│    get_forecast(location, days)                          │
└───────────────────────┬─────────────────────────────────┘
                        │ (3) Client discovers tools
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  Claude                                  │
│  "What's the weather in Sydney?"                        │
│  → calls get_weather({ location: "Sydney" })            │
└─────────────────────────────────────────────────────────┘</code></pre>
<p>The weather server here is a made-up example to show the flow. It is not a package you can install.</p>

<h2>The Full Lifecycle, Step by Step</h2>

<h3>Step 1: Discovery</h3>
<p>You find an MCP server that does what you need. Its README gives the config JSON to copy. (Most listings on TrustedSkills are SKILL.md skills, not MCP servers. Those install with the skills CLI command on the skill page and need no MCP config.)</p>

<h3>Step 2: Configuration</h3>
<p>Paste that JSON into your AI client's config file. For Claude Desktop it's <code>claude_desktop_config.json</code>. The config just tells the client: "when you start up, run this command."</p>

<h3>Step 3: Server Launch</h3>
<p>When you restart the AI client, it reads the config and launches each MCP server as a child process. That's literally what <code>npx -y @package/name</code> is doing — the client runs it as a subprocess and connects via stdio.</p>

<h3>Step 4: Tool Discovery</h3>
<p>The client sends the server a message: "what tools do you have?" The server responds with a JSON list of tool definitions. Here's what that looks like:</p>
<pre><code class="language-json">{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "inputSchema": {
        "type": "object",
        "properties": {
          "location": { "type": "string" },
          "units": { "type": "string", "enum": ["metric", "imperial"] }
        },
        "required": ["location"]
      }
    }
  ]
}</code></pre>

<h3>Step 5: Tool Calling</h3>
<p>User asks something. Claude decides a tool is relevant and calls it:</p>
<pre><code class="language-json">{
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": { "location": "Sydney", "units": "metric" }
  }
}</code></pre>

<h3>Step 6: Result</h3>
<p>The server does the work — calls an API, reads a file, queries a database — and returns the result. Claude uses it to form a response. You see a helpful answer; the JSON flew by invisibly.</p>

<h2>Skill vs MCP Server: What's the Real Difference?</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Aspect</th><th>MCP Server</th><th>Skill</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>What it is</strong></td>
        <td>A running process implementing the MCP protocol</td>
        <td>A packaged, documented, versioned capability</td>
      </tr>
      <tr>
        <td><strong>Registry listing</strong></td>
        <td>No</td>
        <td>Yes — with metadata, verification status, etc.</td>
      </tr>
      <tr>
        <td><strong>Has SKILL.md</strong></td>
        <td>Not required</td>
        <td>Yes — standardised description file</td>
      </tr>
      <tr>
        <td><strong>Verification</strong></td>
        <td>N/A</td>
        <td>TrustedSkills badges: Official, Featured, Pinned, Checked, Listed, Unverified</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How the Protocol Works (the Short Version)</h2>
<p>A local MCP server uses JSON-RPC 2.0 over stdio. No HTTP server. No ports. The client writes JSON to the server's stdin; the server writes JSON to its stdout. That's the whole transport.</p>
<p>It's simple by design — works the same on Mac, Windows, and Linux. No firewall rules, no network configuration, no port conflicts. The subprocess is isolated to process-level communication only.</p>
<p>Remote MCP servers use the Streamable HTTP transport instead. The older HTTP+SSE transport is deprecated.</p>

<div class="tip-box">
  <strong>💡 Good to know:</strong> Because MCP uses stdio, you can test any MCP server manually by running it in a terminal and typing JSON at it. It's a great way to debug a skill that isn't behaving as expected.
</div>

<h2>End-to-End Example: Weather Skill</h2>
<p>You ask Claude Desktop: "What's the weather in Tokyo?"</p>
<ol>
  <li>Weather MCP server is running (launched from your config)</li>
  <li>Claude sees the <code>get_weather</code> tool is available</li>
  <li>Claude decides this query needs that tool</li>
  <li>It calls <code>get_weather({ location: "Tokyo", units: "metric" })</code></li>
  <li>The MCP server calls the Open-Meteo API</li>
  <li>Returns: <code>{ temperature: 18, condition: "Partly cloudy" }</code></li>
  <li>Claude gives you a natural-language answer using that data</li>
</ol>
<p>Total time: under a second. Feels like magic; it's just well-designed plumbing.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How does Claude know when to use an MCP tool?</h3>
<p>The tool definitions include a name and description. Claude reads those and decides whether a tool is relevant to what you're asking. The better the tool description, the more reliably Claude uses it at the right moment.</p>

<h3>Can an MCP server access my local files?</h3>
<p>Only if it's designed to. A filesystem server can read files; a weather server can't. Each server only does what its tools define. This is why reading a server's README before you add it matters.</p>

<h3>What happens when an MCP server crashes?</h3>
<p>Claude will stop offering that server's tools and may show an error. Restart your AI client to relaunch the server. Claude Desktop writes crash details to its log files: <code>~/Library/Logs/Claude</code> on Mac, <code>%APPDATA%\\Claude\\logs</code> on Windows.</p>

<h3>Can I run many MCP servers simultaneously?</h3>
<p>Yes. Each server runs as a separate subprocess. You can have dozens running at once — Claude picks whichever tools are most relevant for each query.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does Claude know when to use an MCP tool?","acceptedAnswer":{"@type":"Answer","text":"Tool definitions include a name and description. Claude reads those and decides when a tool is relevant. Better descriptions = more reliable tool usage."}},{"@type":"Question","name":"Can an MCP server access my local files?","acceptedAnswer":{"@type":"Answer","text":"Only if designed to. Each server only does what its tools define. Read the server's README before you add it."}},{"@type":"Question","name":"What happens when an MCP server crashes?","acceptedAnswer":{"@type":"Answer","text":"Claude stops offering that server's tools. Restart your AI client to relaunch. Check the Claude Desktop log files for details."}},{"@type":"Question","name":"Can I run many MCP servers simultaneously?","acceptedAnswer":{"@type":"Answer","text":"Yes. Each server is a separate subprocess. Claude picks the most relevant tools for each query."}}]}
</script>
    `,
  },

  // ─── CLAUDE DESKTOP ─────────────────────────────────────────────────────────
  {
    slug: ['claude-desktop', 'install-a-skill'],
    title: 'Install a TrustedSkills Skill in Claude Desktop',
    description: 'The skills CLI has no Claude Desktop target. Here is what does work: paste a skill into a conversation with npx skills use, or install it into Claude Code on the same machine.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install a TrustedSkills Skill in Claude Desktop","description":"The skills CLI has no Claude Desktop target. The two paths that do work: npx skills use to paste a skill into a conversation, or installing into Claude Code on the same machine.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>The skills CLI cannot install into Claude Desktop.</strong> It has no agent target for it. What works: run <code>npx skills use</code> to print the skill as a prompt and paste that into a Claude Desktop conversation, or install the skill into Claude Code on the same machine, where the CLI does have a target.</p>
</div>

<p class="article-intro">This is the honest version of a page most directories fill with a command that does not exist. The skills CLI installs a SKILL.md into an agent's skills folder, and Claude Desktop is not one of the agents it knows how to write to. Below is what the CLI actually accepts, and the two routes that get a skill in front of Claude Desktop anyway.</p>

<h2>What the CLI Says</h2>
<p>Ask the skills CLI to install into Claude Desktop and it refuses by name:</p>
<pre><code class="language-bash">$ ${INSTALL_CLAUDE_DESKTOP.cmd} -a claude-desktop

■  Invalid agents: claude-desktop
●  Valid agents: aider-desk, amp, antigravity, … claude-code, … cursor, … universal</code></pre>
<p>The valid list runs to more than seventy agents. Claude Desktop is not on it, under that name or any other. We are not going to invent a flag to fill this gap.</p>
<p>Without <code>-a</code> the command still runs, but it installs into whichever agent folders it finds in the current directory — not into Claude Desktop:</p>
<pre><code class="language-bash">${INSTALL_CLAUDE_DESKTOP.cmd}</code></pre>

<div class="warning-box">
  <strong>⚠️ <code>-a universal</code> is not a Claude Desktop install.</strong> It is a valid target, and it writes to <code>.agents/skills/</code> on disk — a folder Claude Desktop does not read. The files being there does not mean Claude Desktop can see them.
</div>

<h2>Option 1: Paste the Skill Into a Conversation</h2>
<p>The CLI can print a skill as a ready-made prompt instead of installing it. This works with any chat interface, Claude Desktop included:</p>
<pre><code class="language-bash">${EXAMPLE_USE}</code></pre>
<p>It prints the skill's instructions wrapped in a short preamble — <em>"You are being given a Skill to execute for the user's next request"</em> — followed by the whole SKILL.md. Copy the output, paste it as your first message in a new Claude Desktop conversation, then ask for what you want.</p>
<p><strong>The limit:</strong> this lasts one conversation. There is no persistence, and a long skill eats into the context you have for the actual work. For a skill you use daily, option 2 is better.</p>

<h2>Option 2: Install It Into Claude Code Instead</h2>
<p>Claude Code is a supported target and usually sits on the same machine. If your reason for wanting the skill is the work rather than the window, install it there:</p>
<pre><code class="language-bash">${INSTALL_CLAUDE_CODE.cmd}</code></pre>
<p>Full walkthrough: <a href="/docs/claude-code/install-a-skill">installing a skill in Claude Code</a>.</p>

<h2>What claude_desktop_config.json Is For</h2>
<p>Claude Desktop does have a config file, and readers often try to put a skill in it. That file configures <strong>MCP servers</strong> — separate programs that hand your agent new tools. It has no field for a SKILL.md skill, and adding one does nothing.</p>
<p>If what you have is an MCP server, those guides are the right ones: <a href="/docs/claude-desktop/mac">Mac</a>, <a href="/docs/claude-desktop/windows">Windows</a>, <a href="/docs/claude-desktop/linux">Linux</a>. If you are not sure which of the two you are holding, <a href="/docs/concepts/mcp-vs-skills-vs-plugins">MCP servers vs skills vs plugins</a> settles it in a minute.</p>

<div class="tip-box">
  <strong>💡 Check the skill page first.</strong> Every listing on TrustedSkills shows its own install command. If it starts with <code>npx skills add</code> it is a SKILL.md skill and this page applies. If it is a <code>claude mcp add</code> or a JSON block, it is an MCP server — use the config guides above.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Can I install a TrustedSkills skill into Claude Desktop with one command?</h3>
<p>No. The skills CLI has no Claude Desktop agent target, so there is no single command that does it. Paste the skill in with <code>npx skills use</code>, or install it into Claude Code on the same machine.</p>

<h3>Does putting the skill folder somewhere by hand work?</h3>
<p>Not into Claude Desktop. The CLI's folders — <code>.agents/skills/</code>, <code>.claude/skills/</code> — are read by coding agents. Copying a folder around does not give Claude Desktop a way to find it.</p>

<h3>Is this a limitation of TrustedSkills?</h3>
<p>No — it is the skills CLI's set of supported agents. When Claude Desktop appears in that list, this page changes. We would rather tell you the gap exists than publish a command that fails.</p>

<h3>What goes in claude_desktop_config.json then?</h3>
<p>MCP servers only. See <a href="/docs/claude-desktop/mac">installing an MCP server in Claude Desktop on Mac</a>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Can I install a TrustedSkills skill into Claude Desktop with one command?","acceptedAnswer":{"@type":"Answer","text":"No. The skills CLI has no Claude Desktop agent target. Paste the skill in with npx skills use, or install it into Claude Code on the same machine."}},{"@type":"Question","name":"Does putting the skill folder somewhere by hand work?","acceptedAnswer":{"@type":"Answer","text":"Not into Claude Desktop. The CLI's folders, .agents/skills/ and .claude/skills/, are read by coding agents. Copying a folder does not give Claude Desktop a way to find it."}},{"@type":"Question","name":"Is this a limitation of TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"No, it is the skills CLI's set of supported agents. When Claude Desktop appears in that list, this page changes."}},{"@type":"Question","name":"What goes in claude_desktop_config.json then?","acceptedAnswer":{"@type":"Answer","text":"MCP servers only, not SKILL.md skills."}}]}
</script>
    `,
  },

  {
    slug: ['claude-desktop', 'mac'],
    title: 'Install an MCP Server in Claude Desktop on Mac: Step-by-Step',
    description: 'Install an MCP server on Claude Desktop Mac with this complete step-by-step guide. Covers config file location, Node.js setup, adding a server, and troubleshooting — no coding experience needed.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Claude Desktop on Mac: Step-by-Step","description":"Install an MCP server on Claude Desktop Mac — config file location, Node.js setup, and troubleshooting.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>, add your skill inside an <code>mcpServers</code> block, save, and fully restart Claude Desktop. That's it. The skill appears in your next conversation.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and this config file has no field for one. See <a href="/docs/claude-desktop/install-a-skill">install a skill in Claude Desktop</a> — including why the skills CLI has no Claude Desktop target. This guide covers MCP servers.
</div>

<p class="article-intro">You can add an MCP server to Claude Desktop on a Mac without having edited a JSON file before. This guide goes step by step, including how to stop TextEdit from breaking the file.</p>

<h2>What You'll Need</h2>
<ul>
  <li><strong>Claude Desktop</strong> — download from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a></li>
  <li><strong>Node.js</strong> — download the LTS version from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a></li>
  <li><strong>A text editor</strong> — TextEdit works, but VS Code is much better. Both free.</li>
</ul>

<h2>Step 1: Find the Config File</h2>
<p>Claude Desktop keeps its config here on Mac:</p>
<pre><code class="language-bash">~/Library/Application Support/Claude/claude_desktop_config.json</code></pre>
<p>The <code>~</code> means your home folder — something like <code>/Users/yourname</code>.</p>

<h3>The fast way to open it</h3>
<p>In Claude Desktop: go to <strong>Claude → Settings → Developer</strong>, click <strong>"Edit Config"</strong>. Done — it opens the file directly.</p>
<p>Or in Finder: press <strong>⌘ + Shift + G</strong>, paste <code>~/Library/Application Support/Claude/</code>, press Enter.</p>

<h2>Step 2: Open the File</h2>
<p>Right-click <code>claude_desktop_config.json</code> → Open With:</p>
<ul>
  <li><strong>VS Code</strong> — best option, shows errors in real time</li>
  <li><strong>TextEdit</strong> — built-in, always available</li>
</ul>

<div class="warning-box">
  <strong>⚠️ TextEdit trap:</strong> TextEdit defaults to rich text format. Before you type anything, go to <strong>Format → Make Plain Text</strong>. Skip this step and your JSON file gets embedded formatting that breaks everything.
</div>

<h3>File doesn't exist yet?</h3>
<p>Open TextEdit, switch to plain text (Format → Make Plain Text), type <code>{}</code>, and save it as <code>claude_desktop_config.json</code> in the Claude folder. Make sure the filename doesn't end in <code>.txt</code>.</p>

<h2>Step 3: Add Your Skill</h2>
<p>Here's what the config looks like with one skill added:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<p>Adding more skills? Just add them inside <code>mcpServers</code>, separated by commas:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}</code></pre>
<p>Copy the config block from the MCP server's own README. Skills listed on TrustedSkills are mostly SKILL.md skills, not MCP servers. They install with the skills CLI command shown on the skill page, not with this file.</p>

<h2>Step 4: Save and Restart</h2>
<ol>
  <li>Save the file — <strong>⌘ + S</strong></li>
  <li>Quit Claude Desktop completely — <strong>⌘ + Q</strong> (closing the window isn't enough)</li>
  <li>Reopen Claude Desktop</li>
</ol>
<p>Claude reads the config only on startup. No restart = no new skills.</p>

<h2>Step 5: Confirm It Worked</h2>
<p>Open a new conversation. Click the <strong>+</strong> button in the message box ("Add files, connectors, and more") and open <strong>Connectors</strong>. Your server and its tools should be listed.</p>

<h2>Config Locations at a Glance</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Platform</th><th>Config location</th></tr>
    </thead>
    <tbody>
      <tr><td>Claude Desktop Mac</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Desktop Windows</td><td><code>%APPDATA%\\Claude\\claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Desktop Linux</td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Code (user scope)</td><td><code>~/.claude.json</code> (use <code>claude mcp add</code>)</td></tr>
      <tr><td>Cursor (global)</td><td><code>~/.cursor/mcp.json</code></td></tr>
    </tbody>
  </table>
</div>

<h2>Troubleshooting</h2>

<h3>JSON errors</h3>
<p>JSON doesn't forgive mistakes. Common ones: missing comma between skills, trailing comma after the last skill, single quotes instead of double. Paste your config into <a href="https://jsonlint.com" target="_blank" rel="noopener">jsonlint.com</a> to find errors instantly.</p>

<h3>Skill doesn't show up</h3>
<ul>
  <li>Did you fully quit with ⌘+Q? Just closing the window doesn't work.</li>
  <li>Is Node.js installed? Run <code>node --version</code> in Terminal to check.</li>
  <li>Check the logs in <code>~/Library/Logs/Claude/</code></li>
</ul>

<h3>npx not found (nvm users)</h3>
<p>If you installed Node.js via nvm, Claude Desktop might not see it. Find your npx path — run <code>which npx</code> in Terminal — then use that full path as the <code>"command"</code> value in your config.</p>

<div class="tip-box">
  <strong>💡 Pro tip:</strong> When a server breaks, read its log first: <code>tail -n 20 -F ~/Library/Logs/Claude/mcp*.log</code>. It shows what went wrong when the server tried to start.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Mac?</h3>
<p>It's at <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. The fastest way to open it is through Claude Desktop → Settings → Developer → Edit Config.</p>

<h3>Do I need to restart after every change?</h3>
<p>Yes — a full restart (⌘+Q then reopen), not just closing the window. Claude Desktop reads its config only at startup.</p>

<h3>Can I add multiple skills?</h3>
<p>Yes. Add as many as you want inside the <code>mcpServers</code> object, each separated by a comma. There's no practical limit.</p>

<h3>Why won't npx work on my Mac?</h3>
<p>Usually it's nvm. When Node is installed via nvm, the <code>npx</code> command only appears in PATH for interactive shells — Claude Desktop launches in a non-interactive context and doesn't see it. Fix: use the full path from <code>which npx</code>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Mac?","acceptedAnswer":{"@type":"Answer","text":"~/Library/Application Support/Claude/claude_desktop_config.json. Fastest access: Claude Desktop → Settings → Developer → Edit Config."}},{"@type":"Question","name":"Do I need to restart after every change?","acceptedAnswer":{"@type":"Answer","text":"Yes — full restart with ⌘+Q then reopen. Closing the window isn't enough."}},{"@type":"Question","name":"Why won't npx work on my Mac?","acceptedAnswer":{"@type":"Answer","text":"Usually nvm is the cause. Claude Desktop doesn't see nvm's PATH. Fix by using the full path from 'which npx'."}}]}
</script>
    `,
  },

  {
    slug: ['claude-desktop', 'windows'],
    title: 'Install an MCP Server in Claude Desktop on Windows: Full Guide',
    description: 'Install an MCP server on Claude Desktop Windows step-by-step. Covers the config file location, JSON format, Windows path gotchas with npx, and troubleshooting tips for getting a server working.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Claude Desktop on Windows: Full Guide","description":"Install an MCP server on Claude Desktop Windows — config location, JSON format, Windows gotchas, and troubleshooting.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open <code>%APPDATA%\\Claude\\claude_desktop_config.json</code>, add your skill inside <code>mcpServers</code>, save, and fully restart Claude Desktop. If npx isn't found, run <code>where npx.cmd</code> in Command Prompt to get the full path — then use that in your config.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and this config file has no field for one. See <a href="/docs/claude-desktop/install-a-skill">install a skill in Claude Desktop</a> — including why the skills CLI has no Claude Desktop target. This guide covers MCP servers.
</div>

<p class="article-intro">Windows adds a couple of wrinkles that the Mac guide skips over — Notepad's save-as-type trap, the double-backslash JSON requirement, and npx sometimes hiding from Claude Desktop even when it works fine in your terminal. Here's how to navigate all of it.</p>

<h2>What You'll Need</h2>
<ul>
  <li><strong>Claude Desktop</strong> — from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a></li>
  <li><strong>Node.js</strong> — LTS version from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. The installer handles everything including npx.</li>
  <li><strong>A text editor</strong> — Notepad works, <a href="https://code.visualstudio.com" target="_blank" rel="noopener">VS Code</a> is much better</li>
</ul>

<h2>Step 1: Find the Config File</h2>
<p>Windows stores the Claude Desktop config here:</p>
<pre><code class="language-bash">%APPDATA%\\Claude\\claude_desktop_config.json</code></pre>
<p>Open it fast: press <strong>Windows + R</strong>, type <code>%APPDATA%\\Claude</code>, press Enter. Explorer opens right in the Claude config folder.</p>
<p>Or use Claude Desktop's shortcut: hamburger menu → Settings → Developer → Edit Config.</p>

<h2>Step 2: Open the Config File</h2>
<p>Right-click <code>claude_desktop_config.json</code> → Open With → Notepad or VS Code.</p>

<h3>File doesn't exist?</h3>
<ol>
  <li>Open Notepad</li>
  <li>Type <code>{}</code></li>
  <li>File → Save As → navigate to <code>%APPDATA%\\Claude\\</code></li>
  <li>Change "Save as type" to <strong>All Files (*.*)</strong></li>
  <li>Save as <code>claude_desktop_config.json</code></li>
</ol>

<div class="warning-box">
  <strong>⚠️ Notepad trap:</strong> If you leave "Save as type" set to "Text Documents", Notepad adds a hidden <code>.txt</code> extension. Your file becomes <code>claude_desktop_config.json.txt</code> and Claude Desktop can't find it. Always select "All Files (*.*)" first.
</div>

<h2>Step 3: Add Your Skill</h2>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<h3>The backslash problem</h3>
<p>If you ever need a local file path in your config, Windows backslashes must be doubled in JSON. <code>C:\\Users\\Me\\tool</code> becomes <code>C:\\\\Users\\\\Me\\\\tool</code>. For skills installed via npx, you don't need any paths — just the package name.</p>

<h3>npx not in PATH?</h3>
<p>Run this in Command Prompt:</p>
<pre><code class="language-bash">where npx.cmd
# C:\\Program Files\\nodejs\\npx.cmd  ← use this full path</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<div class="tip-box">
  <strong>💡 Use the full path before reinstalling Node:</strong> If npx works in your terminal but the app can't find it, run <code>where.exe npx.cmd</code> and put that full path in the config. That is usually quicker than reinstalling Node.js.
</div>

<h2>Step 4: Save and Restart</h2>
<ol>
  <li>Save — <strong>Ctrl + S</strong></li>
  <li>Fully quit Claude Desktop — right-click tray icon → Quit, or use Task Manager to end the process</li>
  <li>Reopen from Start Menu or taskbar</li>
</ol>

<h2>Windows vs Mac: Key Differences</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Aspect</th><th>Windows</th><th>Mac</th></tr>
    </thead>
    <tbody>
      <tr><td>Config location</td><td><code>%APPDATA%\\Claude\\</code></td><td><code>~/Library/Application Support/Claude/</code></td></tr>
      <tr><td>Paths in JSON</td><td>Double backslash <code>\\\\</code></td><td>Forward slash <code>/</code></td></tr>
      <tr><td>npx binary name</td><td><code>npx.cmd</code></td><td><code>npx</code></td></tr>
      <tr><td>Default text editor</td><td>Notepad — use "All Files" when saving</td><td>TextEdit — switch to Plain Text mode</td></tr>
    </tbody>
  </table>
</div>

<h2>Troubleshooting</h2>

<h3>"npx is not recognized"</h3>
<p>Node.js isn't in your PATH. Either reinstall Node.js with "Add to PATH" checked, or use the full npx path (see above).</p>

<h3>JSON syntax errors</h3>
<p>Notepad won't tell you when your JSON is broken. Use VS Code or <a href="https://jsonlint.com" target="_blank" rel="noopener">jsonlint.com</a> to validate.</p>

<h3>Skill still not showing after restart</h3>
<p>Check Task Manager — Claude Desktop sometimes leaves a background process running after you "close" it. Kill all Claude processes, then reopen fresh.</p>
<p>Then read the logs in <code>%APPDATA%\\Claude\\logs</code>. In PowerShell: <code>type "$env:AppData\\Claude\\logs\\mcp*.log"</code>.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Windows?</h3>
<p>At <code>%APPDATA%\\Claude\\claude_desktop_config.json</code>. Press Windows+R and type <code>%APPDATA%\\Claude</code> to open the folder directly.</p>

<h3>Why do I need double backslashes in JSON on Windows?</h3>
<p>Backslash is an escape character in JSON. A single <code>\\</code> tells JSON "the next character is special". To represent a literal backslash, you need <code>\\\\</code>. For npx-based skills using package names, this doesn't matter — no paths involved.</p>

<h3>Claude Desktop won't find npx — how do I fix it on Windows?</h3>
<p>Run <code>where npx.cmd</code> in Command Prompt to get the full path, then use that as the <code>"command"</code> value. Remember to double every backslash in the JSON string.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Windows?","acceptedAnswer":{"@type":"Answer","text":"At %APPDATA%\\\\Claude\\\\claude_desktop_config.json. Press Windows+R and type %APPDATA%\\\\Claude to open it."}},{"@type":"Question","name":"Why do I need double backslashes in JSON on Windows?","acceptedAnswer":{"@type":"Answer","text":"Backslash is an escape character in JSON, so each literal backslash is written twice. For npx package names this doesn't apply."}},{"@type":"Question","name":"Claude Desktop won't find npx on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run 'where npx.cmd' to get the full path, then use it as the command value with doubled backslashes."}}]}
</script>
    `,
  },

  {
    slug: ['claude-desktop', 'linux'],
    title: 'Install MCP Claude Desktop Linux: Config & Setup Guide',
    description: 'Install MCP on Claude Desktop Linux — config file path at ~/.config/Claude/, NVM workarounds, and Linux-specific tips for successfully adding MCP servers to your Claude Desktop setup.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Claude Desktop Linux: Config & Setup Guide","description":"Install MCP Claude Desktop Linux — config path, NVM fixes, and Linux-specific setup tips.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>~/.config/Claude/claude_desktop_config.json</code>, add skills under <code>mcpServers</code>, restart Claude Desktop. The nvm PATH issue is the most common problem on Linux — fix it by using the full path to npx or adding nvm to <code>~/.profile</code>.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and this config file has no field for one. See <a href="/docs/claude-desktop/install-a-skill">install a skill in Claude Desktop</a> — including why the skills CLI has no Claude Desktop target. This guide covers MCP servers.
</div>

<p class="article-intro">Linux adds one gotcha that catches almost everyone who uses nvm: Claude Desktop launches as a non-interactive process and doesn't inherit the shell PATH where nvm lives. Here's how to navigate that — plus the rest of the setup.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Claude Desktop for Linux (beta), on Ubuntu 22.04+ or Debian 12+. Install it from Anthropic's apt repository: see <a href="https://code.claude.com/docs/en/desktop-linux" target="_blank" rel="noopener">the install guide</a>.</li>
  <li>Node.js 18 or later, via <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a> (recommended). Distribution packages can be older than that.</li>
</ul>

<h2>Config File Location</h2>
<p>The quickest way to open the file is <strong>Settings → Developer → Edit Config</strong>. On Linux it normally lives here:</p>
<pre><code class="language-bash">~/.config/Claude/claude_desktop_config.json</code></pre>

<h2>Setting Up</h2>
<pre><code class="language-bash">mkdir -p ~/.config/Claude
nano ~/.config/Claude/claude_desktop_config.json</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<h2>Config Paths: Linux vs Everything Else</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>OS</th><th>Config path</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Linux</strong></td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Mac</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Windows</td><td><code>%APPDATA%\\Claude\\claude_desktop_config.json</code></td></tr>
    </tbody>
  </table>
</div>

<h2>The nvm Problem — and Two Ways to Fix It</h2>
<p>If you installed Node.js via nvm, you've probably noticed: nvm works great in your terminal, but Claude Desktop acts like Node doesn't exist. That's because nvm adds npx to your shell's PATH — but only for interactive shells. Claude Desktop launches non-interactively and never runs those shell initialisation scripts.</p>

<div class="tip-box">
  <strong>💡 When in doubt, use the full path:</strong> Whether your desktop session loads <code>~/.profile</code> depends on your login manager. A full path to npx in the config works whichever start-up files load.
</div>

<h3>Fix Option 1: Full path (most reliable)</h3>
<pre><code class="language-bash">which npx
# /home/yourname/.nvm/versions/node/v20.11.0/bin/npx</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "/home/yourname/.nvm/versions/node/v20.11.0/bin/npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<h3>Fix Option 2: Add nvm to non-interactive profile</h3>
<p>Add to <code>~/.profile</code>:</p>
<pre><code class="language-bash">export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"</code></pre>
<p>Log out and back in, then restart Claude Desktop.</p>

<div class="tip-box">
  <strong>💡 Recommendation:</strong> Use the full path approach. It's independent of shell init order and works consistently across all login managers and desktop environments.
</div>

<h2>Checking Status</h2>
<p>Open <strong>Settings → Developer</strong> to see each server's status. In a chat, click the <strong>+</strong> button and open <strong>Connectors</strong> to see which servers connected.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config on Linux?</h3>
<p>Normally at <code>~/.config/Claude/claude_desktop_config.json</code>. Settings → Developer → Edit Config opens it for you.</p>

<h3>Why can't Claude Desktop find npx on Linux?</h3>
<p>Almost always nvm. Claude Desktop launches non-interactively and doesn't inherit the shell PATH where nvm puts its binaries. Use the full path to npx from <code>which npx</code>, or add nvm init to <code>~/.profile</code>.</p>

<h3>Does Claude Desktop work on all Linux distros?</h3>
<p>No. The beta supports Ubuntu 22.04+ and Debian 12+, on x86_64 and arm64. On Fedora, Arch and other distributions, use Claude Code in the terminal instead.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config on Linux?","acceptedAnswer":{"@type":"Answer","text":"Normally ~/.config/Claude/claude_desktop_config.json. Settings → Developer → Edit Config opens it."}},{"@type":"Question","name":"Why can't Claude Desktop find npx on Linux?","acceptedAnswer":{"@type":"Answer","text":"Almost always nvm. Claude Desktop launches non-interactively. Use the full path from 'which npx'."}},{"@type":"Question","name":"Does Claude Desktop work on all Linux distros?","acceptedAnswer":{"@type":"Answer","text":"No. The beta supports Ubuntu 22.04+ and Debian 12+. On other distributions, use Claude Code in the terminal."}}]}
</script>
    `,
  },

  // ─── CLAUDE CODE ────────────────────────────────────────────────────────────
  {
    slug: ['claude-code', 'install-a-skill'],
    title: 'Install a TrustedSkills Skill in Claude Code',
    description: 'Install a SKILL.md skill from TrustedSkills into Claude Code with one skills CLI command. Covers project vs global scope, where the files land, how to confirm it loaded, and how to remove it.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install a TrustedSkills Skill in Claude Code","description":"Install a SKILL.md skill from TrustedSkills into Claude Code with one skills CLI command — scope, file locations, verification, and removal.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run the install command from the skill's page in your project folder, adding <code>-a claude-code</code>. The skill lands in <code>.claude/skills/&lt;name&gt;/</code> and Claude Code picks it up in your next session. No JSON to edit.</p>
</div>

<p class="article-intro">Almost every listing on TrustedSkills is a SKILL.md skill: a folder with an instruction file in it. It is not an MCP server, so there is no config file to edit and nothing to restart. One command copies it into place.</p>

<h2>The Command</h2>
<p>Every skill page shows its own install command. Copy that command and add <code>-a claude-code</code>. Using <a href="/skills/find-skills">find-skills</a> as the example:</p>
<pre><code class="language-bash">${INSTALL_CLAUDE_CODE.cmd}</code></pre>
<p>That is the exact line the skill page gives you when Claude Code is your selected platform — this page and that box are generated by the same function, so they cannot disagree.</p>

<div class="warning-box">
  <strong>⚠️ A skill runs with your agent's permissions.</strong> The CLI says so itself when it finishes: <em>"Review skills before use; they run with full agent permissions."</em> A skill is instructions your agent will follow, with access to your files, your keys and your shell. Read the SKILL.md before you let it run. No badge on TrustedSkills means a person read the code.
</div>

<h2>What You'll Need</h2>
<ul>
  <li><strong>Node.js</strong> — the skills CLI runs through <code>npx</code>. Check with <code>node --version</code>; install from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> if it is missing.</li>
  <li><strong>Claude Code</strong> — see <a href="/docs/claude-code/beginner-guide">the Claude Code setup guide</a> if you have not installed it yet.</li>
</ul>

<h2>This Project, or Every Project</h2>
<p>Run the command with no flags and the skill is installed for the current project only. Add <code>-g</code> and it goes to your home folder, where every project sees it:</p>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Command</th><th>Where the skill lands</th><th>Who sees it</th></tr>
    </thead>
    <tbody>
      <tr><td><code>${INSTALL_CLAUDE_CODE.cmd}</code></td><td><code>.claude/skills/&lt;name&gt;/</code> in the current folder</td><td>This project</td></tr>
      <tr><td><code>${INSTALL_CLAUDE_CODE.cmd} -g</code></td><td><code>~/.claude/skills/&lt;name&gt;/</code></td><td>Every project on this machine</td></tr>
    </tbody>
  </table>
</div>
<p>Project scope also writes a <code>skills-lock.json</code> next to the folder, recording each skill's source repo and a hash of its contents. Commit it and a teammate can restore the same version with <code>npx skills experimental_install</code>. One wrinkle worth knowing: the lock file does not record which agent you installed for, so the restore lands in the shared <code>.agents/skills/</code> folder. To get it into <code>.claude/skills/</code> specifically, re-run the add command with <code>-a claude-code</code>.</p>

<h2>Confirm It Worked</h2>
<p>Ask the CLI what is installed:</p>
<pre><code class="language-bash">npx skills list</code></pre>
<p>It prints each skill, the full path it was written to, and which agents it was installed for. If the skill you just added is not listed, you ran the command in a different folder than you think.</p>
<p>Then start a new Claude Code session. Skills are matched by their <code>description</code> field, so you do not call one by name — ask for the thing it does, and the agent reaches for it.</p>

<h2>Updating and Removing</h2>
<pre><code class="language-bash"># Update every installed skill
npx skills update

# Remove one skill
npx skills remove find-skills</code></pre>
<p>Leave <code>-a</code> off: with the flag, the CLI only clears that agent's links, which can report success while leaving the files in place. Without it, the folder goes. Nothing else on your machine is touched.</p>

<h2>Troubleshooting</h2>

<h3>"command not found: npx"</h3>
<p>Node.js is not installed, or your terminal was open before you installed it. Close the terminal, open a new one, and run <code>node --version</code> again. See <a href="/docs/concepts/what-is-npx">what npx actually does</a>.</p>

<h3>The skill installed but the agent ignores it</h3>
<p>Two usual causes. You installed into a project folder and are running Claude Code somewhere else — check the path in <code>npx skills list</code>. Or the session was already open: skills are read when the session starts, so start a new one.</p>

<h3>The repo has several skills and I got the wrong one</h3>
<p>Add <code>-l</code> to list what a repo contains without installing anything:</p>
<pre><code class="language-bash">npx skills add vercel-labs/skills -l</code></pre>

<div class="tip-box">
  <strong>💡 Looking for MCP servers instead?</strong> A skill is an instruction file; an MCP server is a program that gives your agent new tools. They install completely differently. For MCP servers see <a href="/docs/claude-code/mac">Claude Code on Mac</a> or <a href="/docs/claude-code/windows">Claude Code on Windows</a>, and <a href="/docs/concepts/mcp-vs-skills-vs-plugins">how the two differ</a>.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I need to edit a JSON config file to install a skill?</h3>
<p>No. SKILL.md skills are folders on disk, not MCP servers. The <code>claude mcp add</code> command and the <code>.mcp.json</code> file are for MCP servers only.</p>

<h3>Where does Claude Code keep installed skills?</h3>
<p><code>.claude/skills/&lt;name&gt;/</code> inside the project for a project install, and <code>~/.claude/skills/&lt;name&gt;/</code> for a global one with <code>-g</code>.</p>

<h3>Can I use the same skill in another agent?</h3>
<p>Yes. Run the same command with a different <code>-a</code> target: <code>cursor</code>, <code>openclaw</code>, <code>codex</code> and <code>opencode</code> are all valid targets, and you can repeat the flag to cover several at once — <code>-a cursor -a claude-code</code>. A comma-separated list is rejected. See <a href="/docs/cursor/install-a-skill">installing a skill in Cursor</a>.</p>

<h3>How do I know what a skill will do before I run it?</h3>
<p>Open the SKILL.md the CLI wrote, or read it on the skill's page before installing. A badge on TrustedSkills never means a person reviewed the code — <a href="/docs/advanced/verification-badges">see what each badge actually claims</a>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need to edit a JSON config file to install a skill?","acceptedAnswer":{"@type":"Answer","text":"No. SKILL.md skills are folders on disk, not MCP servers. claude mcp add and .mcp.json are for MCP servers only."}},{"@type":"Question","name":"Where does Claude Code keep installed skills?","acceptedAnswer":{"@type":"Answer","text":".claude/skills/<name>/ inside the project, or ~/.claude/skills/<name>/ for a global install with -g."}},{"@type":"Question","name":"Can I use the same skill in another agent?","acceptedAnswer":{"@type":"Answer","text":"Yes. Run the same command with a different -a target: cursor, openclaw, codex and opencode are all valid. Repeat the flag to cover several at once; a comma-separated list is rejected."}},{"@type":"Question","name":"How do I know what a skill will do before I run it?","acceptedAnswer":{"@type":"Answer","text":"Read the SKILL.md before you let it run. A badge on TrustedSkills never means a person reviewed the code."}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'beginner-guide'],
    title: 'Claude Code VS Code MCP Setup: Complete Beginner\'s Guide',
    description: 'Claude Code VS Code MCP setup guide for beginners — install the extension, add MCP servers with claude mcp add, find them in ~/.claude.json or .mcp.json, and check them with /mcp. No experience needed.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code VS Code MCP Setup: Complete Beginner's Guide","description":"Claude Code VS Code MCP setup for beginners — install, configure, and verify MCP servers.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Install the Claude Code extension from the VS Code marketplace. Add an MCP server with <code>claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory</code>. User and local servers are stored in <code>~/.claude.json</code>. Project servers are stored in <code>.mcp.json</code> in your project root. Type <code>/mcp</code> inside Claude Code to check that the server connected.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no MCP config at all. One command installs one — see <a href="/docs/claude-code/install-a-skill">install a skill in Claude Code</a>. This guide covers MCP servers.
</div>

<p class="article-intro">Claude Code can read your files and run terminal commands without any extra setup. MCP servers add more tools on top of that, such as a database client or a search API. This guide shows where Claude Code stores MCP servers, how to add one, and how to check that it loaded.</p>

<h2>Claude Code vs Claude Desktop: What's the Difference?</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Feature</th><th>Claude Desktop</th><th>Claude Code</th></tr>
    </thead>
    <tbody>
      <tr><td>Primary use</td><td>General AI chat</td><td>Software development</td></tr>
      <tr><td>Reads your files</td><td>No (without a skill)</td><td>Yes, built-in</td></tr>
      <tr><td>Runs terminal commands</td><td>No</td><td>Yes, built-in</td></tr>
      <tr><td>MCP support</td><td>Yes</td><td>Yes</td></tr>
      <tr><td>Project-scoped config</td><td>No</td><td>Yes</td></tr>
    </tbody>
  </table>
</div>

<h2>Installing Claude Code in VS Code</h2>
<ol>
  <li>Open VS Code</li>
  <li>Press <strong>⌘+Shift+X</strong> (Mac) or <strong>Ctrl+Shift+X</strong> (Windows/Linux)</li>
  <li>Search "Claude Code"</li>
  <li>Install the Anthropic extension</li>
  <li>Sign in when prompted</li>
</ol>

<h2>Two Ways to Run Claude Code</h2>
<p>You can use Claude Code as a VS Code sidebar panel, or run <code>claude</code> in your terminal. Both read the same MCP configuration. This guide covers both.</p>

<h2>Where Claude Code Stores MCP Servers</h2>
<p>Claude Code has three scopes. The <code>--scope</code> flag on <code>claude mcp add</code> picks one. If you leave it out, Claude Code uses <strong>local</strong>.</p>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Scope</th><th>Where it is stored</th><th>Who gets it</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>local</strong> (default)</td><td><code>~/.claude.json</code>, under the entry for the current project</td><td>Only you, only in this project</td></tr>
      <tr><td><strong>user</strong></td><td><code>~/.claude.json</code></td><td>Only you, in every project</td></tr>
      <tr><td><strong>project</strong></td><td><code>.mcp.json</code> in your project root</td><td>Everyone who clones the repo</td></tr>
    </tbody>
  </table>
</div>
<p>On Windows, <code>~</code> is your user folder, for example <code>C:\\Users\\YourName\\.claude.json</code>. The file <code>~/.claude/settings.json</code> holds other Claude Code settings. It is not where <code>claude mcp add</code> writes MCP servers.</p>

<h2>Adding an MCP Server: Two Methods</h2>

<h3>Method A: CLI (recommended)</h3>
<pre><code class="language-bash"># Install Claude Code if you haven't (macOS, Linux, WSL)
curl -fsSL https://claude.ai/install.sh | bash

# Add a server for yourself, in every project
claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory

# Add a server to this project's .mcp.json (shared through git)
claude mcp add --scope project memory -- npx -y @modelcontextprotocol/server-memory

# See what's configured
claude mcp list</code></pre>
<p>On Windows, install Claude Code from PowerShell with <code>irm https://claude.ai/install.ps1 | iex</code>. You can also use <code>npm install -g @anthropic-ai/claude-code</code>.</p>

<h3>Method B: Edit .mcp.json directly</h3>
<p>For a project server, create or edit <code>.mcp.json</code> in your project root:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<p>Do not hand-edit <code>~/.claude.json</code>. Claude Code also keeps its own state in that file. For a user server, use <code>claude mcp add --scope user</code> or <code>claude mcp add-json --scope user</code> instead.</p>

<h2>Reloading After Changes</h2>
<p>Start a new session after you edit a config file. In the terminal, type <code>/exit</code>, then run <code>claude</code> again. The first time Claude Code sees a server in <code>.mcp.json</code>, it asks you to approve it.</p>

<h2>Verify It Worked</h2>
<pre><code class="language-bash">claude mcp list       # lists configured servers
claude mcp get memory # shows one server and checks that it connects
claude                # start a session
/mcp                  # inside Claude Code: shows each server and its status</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I need both Claude Desktop and Claude Code?</h3>
<p>No — they serve different purposes. Claude Desktop is for general AI tasks; Claude Code is for active software development. Many people use both, but you don't need to.</p>

<h3>Where does Claude Code store MCP settings?</h3>
<p>Local and user servers are in <code>~/.claude.json</code>. Project servers are in <code>.mcp.json</code> in your project root. <code>claude mcp add</code> uses the local scope unless you pass <code>--scope user</code> or <code>--scope project</code>.</p>

<h3>Can I use the same MCP servers in Claude Code and Claude Desktop?</h3>
<p>Yes. Add the server to each app. Each app keeps its own config file. On macOS and WSL, <code>claude mcp add-from-claude-desktop</code> copies servers from Claude Desktop into Claude Code.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need both Claude Desktop and Claude Code?","acceptedAnswer":{"@type":"Answer","text":"No. Claude Desktop is for general AI tasks; Claude Code is for active development. Use whichever fits your workflow."}},{"@type":"Question","name":"Where does Claude Code store MCP settings?","acceptedAnswer":{"@type":"Answer","text":"Local and user servers are in ~/.claude.json. Project servers are in .mcp.json in your project root. claude mcp add uses the local scope unless you pass --scope user or --scope project."}},{"@type":"Question","name":"Can I use the same MCP servers in Claude Code and Claude Desktop?","acceptedAnswer":{"@type":"Answer","text":"Yes. Add the server to each app. On macOS and WSL, claude mcp add-from-claude-desktop copies servers from Claude Desktop into Claude Code."}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'global-vs-project'],
    title: 'Claude Code MCP Global vs Project Config: When to Use Each',
    description: 'Claude Code MCP global project config explained — when to use global vs project-level settings, how to safely share skills with your team via git, and how to handle secrets across environments.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code MCP Global vs Project Config: When to Use Each","description":"Claude Code MCP global vs project config — when to use each and how to share skills with your team.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>User scope (<code>claude mcp add --scope user</code>, stored in <code>~/.claude.json</code>) = personal tools, your credentials, things you want everywhere. Project scope (<code>claude mcp add --scope project</code>, stored in <code>.mcp.json</code>) = team tools you commit to git. Never put API keys directly in <code>.mcp.json</code>. Use <code>$&#123;VAR&#125;</code> references instead.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no MCP config at all. One command installs one — see <a href="/docs/claude-code/install-a-skill">install a skill in Claude Code</a>. This guide covers MCP servers.
</div>

<p class="article-intro">When you add an MCP server to Claude Code, you choose who gets it: only you, or everyone who clones the repo. The answer depends on who needs the tool and whether it uses a secret.</p>

<h2>The Three Scopes</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Scope</th><th>Where it is stored</th><th>Who gets it</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>User</strong> (<code>--scope user</code>)</td>
        <td><code>~/.claude.json</code></td>
        <td>Only you, in all projects on this machine</td>
      </tr>
      <tr>
        <td><strong>Local</strong> (default)</td>
        <td><code>~/.claude.json</code>, under the current project</td>
        <td>Only you, only in this project</td>
      </tr>
      <tr>
        <td><strong>Project</strong> (<code>--scope project</code>)</td>
        <td><code>.mcp.json</code> in the project root</td>
        <td>Everyone who clones the repo</td>
      </tr>
    </tbody>
  </table>
</div>
<p>On Windows, <code>~</code> is your user folder, for example <code>C:\\Users\\YourName\\.claude.json</code>. <code>claude mcp add</code> does not write to <code>~/.claude/settings.json</code> or <code>.claude/settings.json</code>. Those files hold other Claude Code settings.</p>

<h2>User Scope — Your Personal Toolkit</h2>
<p>A user-scoped server follows you into every project you open with Claude Code. Nobody else gets it.</p>
<p><strong>Good fits for user scope:</strong></p>
<ul>
  <li>Notes or memory tools you want everywhere</li>
  <li>Web search with your personal API key</li>
  <li>GitHub tool with your personal access token</li>
  <li>Any tool using credentials that are <em>yours</em>, not the project's</li>
</ul>

<pre><code class="language-bash">claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory
claude mcp add --scope user brave-search -e BRAVE_API_KEY=your-personal-key -- npx -y @brave/brave-search-mcp-server</code></pre>
<p>Claude Code writes these to <code>~/.claude.json</code>. That file is never inside your repo, so the key is not committed.</p>

<h2>Project Scope — Team Tools via Git</h2>
<p>A project-scoped server lives in <code>.mcp.json</code> in your repo. Commit it, and everyone who clones the repo gets the same server. Claude Code asks each person to approve a project server the first time it sees it.</p>
<p><strong>Good fits for project scope:</strong></p>
<ul>
  <li>Database tools pointing to the project's dev DB</li>
  <li>Project-specific validators or code generators</li>
  <li>Any tool that should be the same for all developers on the team</li>
</ul>

<h3>.mcp.json example</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": { "BRAVE_API_KEY": "$&#123;BRAVE_API_KEY&#125;" }
    }
  }
}</code></pre>

<p>Claude Code replaces <code>$&#123;BRAVE_API_KEY&#125;</code> with the value of that environment variable when it starts the server. Each developer sets their own <code>BRAVE_API_KEY</code> in their shell before running <code>claude</code>. Claude Code does not read a <code>.env</code> file for you. The committed file holds no credentials.</p>

<div class="warning-box">
  <strong>⚠️ Don't commit secrets:</strong> Once a key is in git history, treat it as leaked, even if you delete it later. Always use <code>$&#123;VAR_NAME&#125;</code> references in <code>.mcp.json</code> and set the real values in your own environment.
</div>

<h2>User vs Project: The Decision Matrix</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th></th><th>User scope</th><th>Project scope</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Team sharing</strong></td><td>Not possible (per-machine)</td><td>Easy via git commit</td></tr>
      <tr><td><strong>Personal credentials</strong></td><td>Safe — never committed</td><td>Risky — don't put secrets here</td></tr>
      <tr><td><strong>Project-specific tools</strong></td><td>Clutters every project</td><td>Good fit</td></tr>
      <tr><td><strong>Priority when both exist</strong></td><td>Lower</td><td>Higher (only local scope beats it)</td></tr>
    </tbody>
  </table>
</div>

<h2>The Decision Checklist</h2>
<ol>
  <li>Should the whole team have this? → Project scope</li>
  <li>Does it use your personal credentials? → User scope</li>
  <li>Do you want it in every project? → User scope</li>
  <li>Is it specific to this project's infrastructure? → Project scope</li>
</ol>

<div class="tip-box">
  <strong>💡 Priority rule:</strong> When the same server name exists in more than one scope, Claude Code uses local first, then project, then user. It uses the whole entry from the winning scope and does not merge fields.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What happens if the same server is in both user and project scope?</h3>
<p>The project entry wins. A local entry with the same name would beat both. Claude Code uses the whole entry from the winning scope.</p>

<h3>Can I commit .mcp.json to git without exposing secrets?</h3>
<p>Yes. Use <code>$&#123;VAR_NAME&#125;</code> references and set the real values in your shell environment. The file itself holds no secrets.</p>

<h3>How do I add a project-scoped server via the CLI?</h3>
<p>Use <code>--scope project</code>: <code>claude mcp add --scope project my-tool -- npx -y @package/name</code>. This writes to <code>.mcp.json</code> in your project root, which you can commit.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What happens if the same server is in both user and project scope?","acceptedAnswer":{"@type":"Answer","text":"The project entry wins. A local entry with the same name would beat both."}},{"@type":"Question","name":"Can I commit .mcp.json to git without exposing secrets?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use $&#123;VAR_NAME&#125; references and set the real values in your shell environment."}},{"@type":"Question","name":"How do I add a project-scoped server via the CLI?","acceptedAnswer":{"@type":"Answer","text":"claude mcp add --scope project my-tool -- npx -y @package/name. This writes to .mcp.json in your project root."}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'mac'],
    title: 'Install an MCP Server in Claude Code on Mac: CLI & Manual Methods',
    description: 'Install an MCP server for Claude Code on Mac using the CLI or manual config editing. Covers global vs project scope, NVM path fixes, and how to verify tools are loading correctly.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Claude Code on Mac: CLI & Manual Methods","description":"Install an MCP server for Claude Code on Mac — CLI, manual config, NVM fixes, and verification.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run <code>claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory</code>. Claude Code saves it in <code>~/.claude.json</code>. For a server the whole team shares, use <code>--scope project</code>, which writes <code>.mcp.json</code> in your project root. If Claude Code can't find npx because you use nvm, use the full path from <code>which npx</code>.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no MCP config at all. One command installs one — see <a href="/docs/claude-code/install-a-skill">install a skill in Claude Code</a>. This guide covers MCP servers.
</div>

<p class="article-intro">The CLI is the quickest way to add an MCP server to Claude Code on a Mac. It writes the config for you. Editing <code>.mcp.json</code> by hand is useful when you want to review exactly what a project shares with the team.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed, for servers that run with npx. Check with <code>node --version</code></li>
  <li>Claude Code: <code>curl -fsSL https://claude.ai/install.sh | bash</code> (or <code>brew install --cask claude-code</code>)</li>
</ul>

<h2>Method 1: CLI (Recommended)</h2>
<pre><code class="language-bash"># User scope — available in every project, stored in ~/.claude.json
claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory

# Project scope — written to .mcp.json in the current project
claude mcp add --scope project memory -- npx -y @modelcontextprotocol/server-memory

# With an env variable (API key, etc.)
claude mcp add --scope user brave-search -e BRAVE_API_KEY=yourkey -- npx -y @brave/brave-search-mcp-server

# See what's configured
claude mcp list

# Remove something
claude mcp remove memory</code></pre>
<p>If you leave out <code>--scope</code>, Claude Code uses the local scope: only you, only in the current project.</p>

<h2>Method 2: Edit .mcp.json by Hand</h2>
<p>For a project server, create <code>.mcp.json</code> in your project root:</p>
<pre><code class="language-bash">code .mcp.json   # opens it in VS Code</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<p>Do not hand-edit <code>~/.claude.json</code>. Claude Code keeps its own state in that file. Use the CLI for user-scoped servers.</p>

<h2>The nvm Problem on Mac</h2>
<p>nvm sets up Node.js in your shell start-up files. If Claude Code starts from somewhere that does not load them, it may not find the npx that nvm manages.</p>
<pre><code class="language-bash"># Find the full path to npx
which npx
# /Users/yourname/.nvm/versions/node/v20.11.0/bin/npx</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "/Users/yourname/.nvm/versions/node/v20.11.0/bin/npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<p>This path includes the Node.js version. Update it when you change versions with nvm.</p>

<h2>Verify It Worked</h2>
<pre><code class="language-bash">claude mcp list       # lists configured servers
claude mcp get memory # shows one server and checks that it connects
claude                # start a session
/mcp                  # inside Claude Code: shows each server and its status</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>CLI vs manual editing — which should I use?</h3>
<p>Use the CLI for most additions. It writes valid JSON to the right file. Edit <code>.mcp.json</code> by hand when you want to review exactly what the project shares.</p>

<h3>How do I add an API key to an MCP server on Mac?</h3>
<p>With the CLI: <code>claude mcp add my-server -e API_KEY=abc123 -- npx -y @package/name</code>. In <code>.mcp.json</code>, add an <code>"env"</code> block and use a <code>$&#123;API_KEY&#125;</code> reference instead of the real key.</p>

<h3>How do I know a server loaded successfully?</h3>
<p>Run <code>claude mcp get &lt;name&gt;</code>. It shows the server and checks the connection. Inside a session, type <code>/mcp</code> to see each server and its status.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"CLI vs manual editing — which should I use?","acceptedAnswer":{"@type":"Answer","text":"Use the CLI for most additions. Edit .mcp.json by hand when you want to review exactly what the project shares."}},{"@type":"Question","name":"How do I add an API key to an MCP server on Mac?","acceptedAnswer":{"@type":"Answer","text":"CLI: claude mcp add my-server -e API_KEY=abc123 -- npx -y @package/name. In .mcp.json, use a $&#123;API_KEY&#125; reference in an env block."}},{"@type":"Question","name":"How do I know a server loaded successfully?","acceptedAnswer":{"@type":"Answer","text":"Run claude mcp get <name> to check the connection, or type /mcp inside a Claude Code session."}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'windows'],
    title: 'Install an MCP Server in Claude Code on Windows: CLI & Config Guide',
    description: 'Install an MCP server for Claude Code on Windows using the CLI or manual config editing. Covers where Claude Code stores MCP servers (~/.claude.json and .mcp.json), Windows path formatting, and PowerShell commands.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Claude Code on Windows: CLI & Config Guide","description":"Install an MCP server for Claude Code on Windows — CLI, ~/.claude.json and .mcp.json, and path formatting.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open PowerShell and run <code>claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory</code>. Claude Code saves it in <code>%USERPROFILE%\\.claude.json</code>. For a server the whole team shares, use <code>--scope project</code>, which writes <code>.mcp.json</code> in your project root. If npx isn't found, use its full path from <code>where.exe npx.cmd</code>.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no MCP config at all. One command installs one — see <a href="/docs/claude-code/install-a-skill">install a skill in Claude Code</a>. This guide covers MCP servers.
</div>

<p class="article-intro">Adding an MCP server to Claude Code on Windows works the same way as on a Mac. The two Windows details are where the config file lives and how to write a Windows path inside JSON.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>, for servers that run with npx</li>
  <li>Claude Code, installed from PowerShell: <code>irm https://claude.ai/install.ps1 | iex</code> (or <code>winget install Anthropic.ClaudeCode</code>)</li>
</ul>

<h2>Method 1: CLI</h2>
<pre><code class="language-bash"># Add a server for yourself, in every project
claude mcp add --scope user memory -- npx -y @modelcontextprotocol/server-memory

# List configured servers
claude mcp list

# Remove
claude mcp remove memory</code></pre>
<p>If you leave out <code>--scope</code>, Claude Code uses the local scope: only you, only in the current project.</p>

<h2>Method 2: Edit .mcp.json by Hand</h2>
<p>For a project server, create <code>.mcp.json</code> in your project root:</p>
<pre><code class="language-bash"># Open it in VS Code from PowerShell
code .mcp.json</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>
<p>Do not hand-edit <code>%USERPROFILE%\\.claude.json</code>. Claude Code keeps its own state in that file. Use the CLI for user-scoped servers.</p>

<h2>When npx Isn't in PATH</h2>
<pre><code class="language-bash"># PowerShell — find full path
(Get-Command npx.cmd).Source
# C:\\Program Files\\nodejs\\npx.cmd</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<div class="warning-box">
  <strong>⚠️ JSON backslash rule:</strong> In JSON strings, every backslash needs to be doubled. <code>C:\\Program Files</code> becomes <code>C:\\\\Program Files</code> in your JSON config.
</div>

<h2>Verify</h2>
<pre><code class="language-bash">claude mcp list        # lists configured servers
claude mcp get memory  # shows one server and checks that it connects
claude                 # start a session
/mcp                   # inside Claude Code: shows each server and its status</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where does Claude Code store MCP servers on Windows?</h3>
<p>User and local servers are in <code>%USERPROFILE%\\.claude.json</code>. Project servers are in <code>.mcp.json</code> in the project root. <code>%USERPROFILE%\\.claude\\settings.json</code> holds other settings, not the servers that <code>claude mcp add</code> writes.</p>

<h3>npx not found in Claude Code on Windows — quick fix?</h3>
<p>Run <code>(Get-Command npx.cmd).Source</code> in PowerShell to get the full path. Use that path as the <code>"command"</code> value, doubling all backslashes.</p>

<h3>Can I run Claude Code in WSL?</h3>
<p>Yes. Install and run it inside WSL. WSL has its own home folder, so it uses its own <code>~/.claude.json</code>. WSL and native Windows Claude Code do not share MCP servers.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where does Claude Code store MCP servers on Windows?","acceptedAnswer":{"@type":"Answer","text":"User and local servers are in %USERPROFILE%\\\\.claude.json. Project servers are in .mcp.json in the project root."}},{"@type":"Question","name":"npx not found in Claude Code on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run '(Get-Command npx.cmd).Source' to get the full path. Use it as the command value with doubled backslashes."}},{"@type":"Question","name":"Can I run Claude Code in WSL?","acceptedAnswer":{"@type":"Answer","text":"Yes. WSL uses its own ~/.claude.json. WSL and native Windows Claude Code do not share MCP servers."}}]}
</script>
    `,
  },

  // ─── CURSOR ─────────────────────────────────────────────────────────────────
  {
    slug: ['cursor', 'install-a-skill'],
    title: 'Install a TrustedSkills Skill in Cursor',
    description: 'Install a SKILL.md skill from TrustedSkills into Cursor with one skills CLI command. Covers the .agents/skills folder Cursor loads from, project vs global scope, verification, and removal.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install a TrustedSkills Skill in Cursor","description":"Install a SKILL.md skill from TrustedSkills into Cursor with one skills CLI command — the .agents/skills folder, scope, verification, and removal.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run the install command from the skill's page in your project folder, adding <code>-a cursor</code>. The skill lands in <code>.agents/skills/&lt;name&gt;/</code> — one of the folders Cursor loads skills from automatically. Nothing to configure, no <code>mcp.json</code> involved.</p>
</div>

<p class="article-intro">Almost every listing on TrustedSkills is a SKILL.md skill: a folder with an instruction file in it. It is not an MCP server, so Cursor's <code>mcp.json</code> has nothing to do with it. One command puts the folder where Cursor already looks.</p>

<h2>The Command</h2>
<p>Every skill page shows its own install command. Copy that command and add <code>-a cursor</code>. Using <a href="/skills/find-skills">find-skills</a> as the example:</p>
<pre><code class="language-bash">${INSTALL_CURSOR.cmd}</code></pre>
<p>That is the exact line the skill page gives you when Cursor is your selected platform — this page and that box are generated by the same function, so they cannot disagree.</p>

<div class="warning-box">
  <strong>⚠️ A skill runs with your agent's permissions.</strong> The CLI says so itself when it finishes: <em>"Review skills before use; they run with full agent permissions."</em> A skill is instructions your agent will follow, with access to your files, your keys and your shell. Read the SKILL.md before you let it run. No badge on TrustedSkills means a person read the code.
</div>

<h2>Where the Files Go</h2>
<p>The CLI's <code>cursor</code> target writes to <code>.agents/skills/</code> — the shared agent-skills folder, not <code>.cursor/</code>. Cursor loads skills from both, so either works:</p>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Command</th><th>Where the skill lands</th><th>Who sees it</th></tr>
    </thead>
    <tbody>
      <tr><td><code>${INSTALL_CURSOR.cmd}</code></td><td><code>.agents/skills/&lt;name&gt;/</code> in the current folder</td><td>This project</td></tr>
      <tr><td><code>${INSTALL_CURSOR.cmd} -g</code></td><td><code>~/.agents/skills/&lt;name&gt;/</code></td><td>Every project on this machine</td></tr>
    </tbody>
  </table>
</div>
<p>Cursor's own documentation lists <code>.agents/skills/</code>, <code>.cursor/skills/</code> and their <code>~/</code> equivalents as the locations it loads skills from automatically — see <a href="https://cursor.com/docs/context/skills" target="_blank" rel="noopener">Cursor's skills documentation</a>. It also reads <code>.claude/skills/</code> for compatibility, so a skill you installed for Claude Code in the same project is usually visible to Cursor too.</p>

<h2>What You'll Need</h2>
<ul>
  <li><strong>Node.js</strong> — the skills CLI runs through <code>npx</code>. Check with <code>node --version</code>; install from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> if it is missing.</li>
  <li><strong>A recent Cursor</strong> — skills loading is a current Cursor feature. If the folder exists and the agent never uses the skill, update Cursor first.</li>
</ul>

<h2>Confirm It Worked</h2>
<p>Ask the CLI what is installed:</p>
<pre><code class="language-bash">npx skills list</code></pre>
<p>It prints each skill, the full path it was written to, and which agents it was installed for. If the skill you just added is not listed, you ran the command in a different folder than you think.</p>
<p>Then reload Cursor and start a new chat. Skills are matched by their <code>description</code> field, so you do not call one by name — ask for the thing it does, and the agent reaches for it.</p>

<h2>Updating and Removing</h2>
<pre><code class="language-bash"># Update every installed skill
npx skills update

# Remove one skill
npx skills remove find-skills</code></pre>
<p>Leave <code>-a</code> off the remove command. Because the skill lives in the shared <code>.agents/skills/</code> folder, <code>remove -a cursor</code> reports success and leaves the files exactly where they were — it only clears agent-specific links, and there is no Cursor-specific one to clear. Without the flag it deletes the folder. Nothing else in your project is touched.</p>

<h2>Troubleshooting</h2>

<h3>"command not found: npx"</h3>
<p>Node.js is not installed, or your terminal was open before you installed it. Close the terminal, open a new one, and run <code>node --version</code> again. See <a href="/docs/concepts/what-is-npx">what npx actually does</a>.</p>

<h3>The folder is there but the agent ignores the skill</h3>
<p>Reload Cursor — skills are read when the window loads. If it still does nothing, check that you opened the same folder you ran the command in: a project install only applies to that folder.</p>

<h3>The repo has several skills and I got the wrong one</h3>
<p>Add <code>-l</code> to list what a repo contains without installing anything:</p>
<pre><code class="language-bash">npx skills add vercel-labs/skills -l</code></pre>

<div class="tip-box">
  <strong>💡 Looking for MCP servers instead?</strong> A skill is an instruction file; an MCP server is a program that gives your agent new tools. They install completely differently. For MCP servers see <a href="/docs/cursor/mac">Cursor on Mac</a> or <a href="/docs/cursor/windows">Cursor on Windows</a>, and <a href="/docs/concepts/mcp-vs-skills-vs-plugins">how the two differ</a>.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I add a skill to Cursor's mcp.json?</h3>
<p>No. <code>mcp.json</code> is only for MCP servers. A SKILL.md skill is a folder Cursor reads, with no config entry at all.</p>

<h3>Why does the CLI write to .agents/skills and not .cursor/skills?</h3>
<p><code>.agents/skills/</code> is the shared location several agents read, so one install can serve more than one tool. Cursor loads from it automatically, alongside <code>.cursor/skills/</code>.</p>

<h3>Can I use the same skill in Claude Code?</h3>
<p>Yes. Run the same command with <code>-a claude-code</code>, or cover both in one go by repeating the flag: <code>-a cursor -a claude-code</code>. Repeat it — a comma-separated list is rejected as an invalid agent name. See <a href="/docs/claude-code/install-a-skill">installing a skill in Claude Code</a>.</p>

<h3>Does this work in VS Code too?</h3>
<p>The CLI has its own targets for other editors and agents — <code>github-copilot</code>, <code>windsurf</code>, <code>zed</code> and others. Run <code>npx skills add &lt;repo&gt; -a</code> with an unknown name and it prints the full list of valid targets.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I add a skill to Cursor's mcp.json?","acceptedAnswer":{"@type":"Answer","text":"No. mcp.json is only for MCP servers. A SKILL.md skill is a folder Cursor reads, with no config entry at all."}},{"@type":"Question","name":"Why does the CLI write to .agents/skills and not .cursor/skills?","acceptedAnswer":{"@type":"Answer","text":".agents/skills/ is the shared location several agents read. Cursor loads from it automatically, alongside .cursor/skills/."}},{"@type":"Question","name":"Can I use the same skill in Claude Code?","acceptedAnswer":{"@type":"Answer","text":"Yes. Run the same command with -a claude-code, or repeat the flag: -a cursor -a claude-code. A comma-separated list is rejected."}},{"@type":"Question","name":"Does this work in VS Code too?","acceptedAnswer":{"@type":"Answer","text":"The CLI has targets for other editors and agents, including github-copilot, windsurf and zed. Passing an unknown -a name prints the full list of valid targets."}}]}
</script>
    `,
  },

  {
    slug: ['cursor', 'mac'],
    title: 'Install an MCP Server in Cursor on Mac: Config Guide & Reload Tips',
    description: 'Install an MCP server on Cursor Mac — find the ~/.cursor/mcp.json config location, add a server in JSON format, reload Cursor to apply changes, and verify tools are working in the AI assistant.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Cursor on Mac: Config Guide & Reload Tips","description":"Install an MCP server on Cursor Mac — ~/.cursor/mcp.json location, JSON format, reload, and verification.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>~/.cursor/mcp.json</code>, add servers under <code>mcpServers</code>, then restart Cursor. Open the <strong>Customize</strong> panel to see your servers and switch them on or off. If one fails, check <strong>MCP Logs</strong> in the Output panel (⌘+Shift+U).</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no <code>mcp.json</code> entry at all. One command installs one — see <a href="/docs/cursor/install-a-skill">install a skill in Cursor</a>. This guide covers MCP servers.
</div>

<p class="article-intro">Cursor lists your MCP servers in its Customize panel, where you can switch each one on or off. Setting it up is very similar to Claude Desktop, just in a different file location.</p>

<h2>Config File Locations</h2>
<pre><code class="language-bash"># Global (all projects)
~/.cursor/mcp.json

# Project-specific
.cursor/mcp.json   # in project root</code></pre>

<h2>Creating and Editing the Config</h2>
<pre><code class="language-bash">mkdir -p ~/.cursor
touch ~/.cursor/mcp.json   # then open it in Cursor or any text editor</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<h3>Multiple skills</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": { "BRAVE_API_KEY": "your-key" }
    }
  }
}</code></pre>

<h2>Cursor vs Claude Code: Config Comparison</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Aspect</th><th>Cursor Mac</th><th>Claude Code Mac</th></tr>
    </thead>
    <tbody>
      <tr><td>Global config</td><td><code>~/.cursor/mcp.json</code></td><td><code>~/.claude.json</code> (user scope)</td></tr>
      <tr><td>Project config</td><td><code>.cursor/mcp.json</code></td><td><code>.mcp.json</code></td></tr>
      <tr><td>Config format key</td><td><code>mcpServers</code></td><td><code>mcpServers</code></td></tr>
      <tr><td>How to add a server</td><td>Edit <code>mcp.json</code></td><td><code>claude mcp add</code></td></tr>
      <tr><td>Status</td><td>Customize panel; MCP Logs in the Output panel</td><td><code>/mcp</code> in a session, or <code>claude mcp list</code></td></tr>
    </tbody>
  </table>
</div>

<h2>Reloading After Changes</h2>
<p>After you edit <code>mcp.json</code>, restart Cursor. You can switch a server on or off from the <strong>Customize</strong> panel without removing it from the file.</p>

<h2>Verify It Worked</h2>
<p>Open Cursor Chat (<strong>⌘+L</strong>) and ask:</p>
<pre><code class="language-bash">What tools do you have available?</code></pre>
<p>If the skill loaded, Cursor will list the tools. If it didn't, open the Output panel (<strong>⌘+Shift+U</strong>), pick <strong>MCP Logs</strong>, and look for the error.</p>

<div class="tip-box">
  <strong>💡 For nvm users:</strong> Same issue as Claude Desktop and Claude Code — use the full path to npx from <code>which npx</code> instead of just <code>"npx"</code>.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Cursor MCP config on Mac?</h3>
<p><code>~/.cursor/mcp.json</code> for global config. Project-specific: <code>.cursor/mcp.json</code> in your project root. Both use the same JSON format.</p>

<h3>Do I need to restart Cursor after editing mcp.json?</h3>
<p>Restart Cursor after you change the file. To switch a server on or off without editing the file, use the Customize panel.</p>

<h3>Can I use the same MCP server in Cursor and Claude Code?</h3>
<p>They're separate configs: <code>~/.cursor/mcp.json</code> for Cursor, and <code>claude mcp add</code> (stored in <code>~/.claude.json</code>) for Claude Code. The same server works in both; add it to each.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Cursor MCP config on Mac?","acceptedAnswer":{"@type":"Answer","text":"~/.cursor/mcp.json for global. .cursor/mcp.json in project root for project-specific."}},{"@type":"Question","name":"Do I need to restart Cursor after editing mcp.json?","acceptedAnswer":{"@type":"Answer","text":"Restart Cursor after you change the file. Use the Customize panel to switch a server on or off."}},{"@type":"Question","name":"Can I use the same MCP server in Cursor and Claude Code?","acceptedAnswer":{"@type":"Answer","text":"Yes, but they're separate configs. Add the server to ~/.cursor/mcp.json for Cursor and with claude mcp add for Claude Code."}}]}
</script>
    `,
  },

  {
    slug: ['cursor', 'windows'],
    title: 'Install an MCP Server in Cursor on Windows: Config & Path Guide',
    description: 'Install an MCP server for Cursor on Windows — config file location at %USERPROFILE%\\.cursor\\mcp.json, JSON format, Windows path gotchas with npx, and how to reload and verify a server.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install an MCP Server in Cursor on Windows: Config & Path Guide","description":"Install an MCP server for Cursor on Windows — config location, JSON format, path issues, and verification.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>%USERPROFILE%\\.cursor\\mcp.json</code>, add skills under <code>mcpServers</code>. If npx isn't found, get the full path with <code>(Get-Command npx.cmd).Source</code> in PowerShell. Restart Cursor after you save.</p>
</div>

<div class="tip-box">
  <strong>💡 Installing a skill from TrustedSkills?</strong> Most listings here are SKILL.md skills, not MCP servers, and they need no <code>mcp.json</code> entry at all. One command installs one — see <a href="/docs/cursor/install-a-skill">install a skill in Cursor</a>. This guide covers MCP servers.
</div>

<p class="article-intro">Same concept as the Mac guide — different file location, one Windows-specific quirk with backslashes. Here's the whole thing.</p>

<h2>Config File Location</h2>
<pre><code class="language-bash">%USERPROFILE%\\.cursor\\mcp.json
# Usually: C:\\Users\\YourName\\.cursor\\mcp.json</code></pre>

<h2>Creating the Config</h2>
<pre><code class="language-bash"># PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\\.cursor"
code "$env:USERPROFILE\\.cursor\\mcp.json"</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<h2>npx Not in PATH? Get the Full Path</h2>
<pre><code class="language-bash"># PowerShell
(Get-Command npx.cmd).Source
# C:\\Program Files\\nodejs\\npx.cmd</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "memory": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    }
  }
}</code></pre>

<div class="warning-box">
  <strong>⚠️ Backslash doubling:</strong> In JSON, every backslash must be doubled. <code>C:\\Program Files\\nodejs\\npx.cmd</code> becomes <code>C:\\\\Program Files\\\\nodejs\\\\npx.cmd</code>.
</div>

<h2>Reloading Cursor</h2>
<ul>
  <li>Close and reopen Cursor after you edit <code>mcp.json</code></li>
  <li>Switch a server on or off from the <strong>Customize</strong> panel</li>
</ul>

<h2>Verifying It Works</h2>
<p>Open Cursor Chat (Ctrl+L) and ask: <em>"What tools do you have?"</em></p>

<div class="tip-box">
  <strong>💡 If IT policy blocks npx:</strong> install the server globally first (<code>npm install -g @modelcontextprotocol/server-memory</code>). Then get the full path of its <code>.cmd</code> file with <code>(Get-Command mcp-server-memory.cmd).Source</code> and use that as the <code>"command"</code> instead of npx.
</div>

<div class="tip-box">
  <strong>💡 Check the logs:</strong> Open the Output panel (<strong>Ctrl+Shift+U</strong>) and pick <strong>MCP Logs</strong>. It shows connection errors and server crashes.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is Cursor's MCP config on Windows?</h3>
<p>At <code>%USERPROFILE%\\.cursor\\mcp.json</code>. Open the folder with <code>explorer $env:USERPROFILE\\.cursor</code> in PowerShell.</p>

<h3>How do I fix "npx not recognized" in Cursor on Windows?</h3>
<p>Get the full path: <code>(Get-Command npx.cmd).Source</code>. Use that as the <code>"command"</code> value, doubling all backslashes.</p>

<h3>Does Cursor support project-level MCP config on Windows?</h3>
<p>Yes — create <code>.cursor\\mcp.json</code> in your project root. Commit it to git for team sharing (without secrets).</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is Cursor's MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"At %USERPROFILE%\\\\.cursor\\\\mcp.json. Open the folder with 'explorer $env:USERPROFILE\\\\.cursor' in PowerShell."}},{"@type":"Question","name":"How do I fix npx not recognized in Cursor on Windows?","acceptedAnswer":{"@type":"Answer","text":"Get the full path with '(Get-Command npx.cmd).Source'. Use it as the command value with doubled backslashes."}},{"@type":"Question","name":"Does Cursor support project-level MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"Yes. Create .cursor\\\\mcp.json in the project root and commit it for team sharing, without secrets."}}]}
</script>
    `,
  },

  // ─── OPENCLAW ───────────────────────────────────────────────────────────────
  {
    slug: ['openclaw', 'mac'],
    title: 'Install Skills OpenClaw Mac: One-Command Setup Guide',
    description: 'Install skills on OpenClaw Mac with a single command — no JSON editing needed. Covers the skills CLI for TrustedSkills listings, openclaw skills commands for ClawHub, and where skills are stored.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Mac: One-Command Setup Guide","description":"Install skills on OpenClaw Mac with one command. No JSON editing: skills are SKILL.md folders.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>For a skill listed on TrustedSkills, run <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code> from your OpenClaw agent workspace. For a ClawHub skill, run <code>openclaw skills install @owner/&lt;slug&gt;</code>. Neither needs JSON editing.</p>
</div>

<p class="article-intro">OpenClaw loads skills from folders on disk. Installing a skill means putting its folder where OpenClaw looks. Two command-line tools do that for you: the skills CLI and OpenClaw's own <code>openclaw skills</code> commands.</p>

<h2>Installing a Skill From TrustedSkills</h2>
<p>Skills on TrustedSkills are SKILL.md skills. They are instruction files, not MCP servers, so there is no JSON config to edit. Run this from your OpenClaw agent workspace:</p>
<pre><code class="language-bash">npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code></pre>
<p>The skills CLI copies the skill into the <code>skills/</code> folder of the current directory. Add <code>-g</code> to install it into <code>~/.openclaw/skills/</code> instead, where every local agent can see it.</p>

<h2>Installing a Skill From ClawHub</h2>
<p>OpenClaw has its own skill commands for skills published on ClawHub. Skill names include the owner.</p>
<pre><code class="language-bash"># Search ClawHub
openclaw skills search "calendar"

# Install into the active agent workspace
openclaw skills install @owner/&lt;slug&gt;

# Install into the shared skills folder for all local agents
openclaw skills install @owner/&lt;slug&gt; --global</code></pre>

<h2>Managing Your Skills</h2>
<pre><code class="language-bash"># See every skill OpenClaw can load
openclaw skills list

# Details for one skill
openclaw skills info &lt;name&gt;

# Which skills are ready, and which are missing requirements
openclaw skills check

# Update ClawHub skills
openclaw skills update --all

# Remove a skill installed with the skills CLI
npx skills remove &lt;name&gt; -a openclaw

# Remove a ClawHub skill (needs the ClawHub CLI: npm i -g clawhub)
clawhub uninstall @owner/&lt;slug&gt;</code></pre>
<p><code>openclaw skills</code> has no remove command. Use the tool you installed with.</p>

<h2>When a New Skill Shows Up</h2>
<p>OpenClaw takes a list of skills when a session starts. Its skills watcher can refresh that list during a session. If a new skill does not appear, start a new session.</p>

<h2>Where Skills Live on Mac</h2>
<pre><code class="language-bash">&lt;workspace&gt;/skills/    # skills for one agent (checked first)
~/.openclaw/skills/     # shared skills for all local agents</code></pre>
<p>Each skill is a folder with a <code>SKILL.md</code> file inside.</p>

<div class="tip-box">
  <strong>💡 Before installing:</strong> Open the skill's source repository and read its <code>SKILL.md</code>. A skill runs with the same access as your agent.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install skills on OpenClaw Mac?</h3>
<p>For a TrustedSkills listing: <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code>. For ClawHub: <code>openclaw skills install @owner/&lt;slug&gt;</code>. No JSON editing.</p>

<h3>Where does OpenClaw store installed skills on Mac?</h3>
<p>In the agent workspace's <code>skills/</code> folder, or in <code>~/.openclaw/skills/</code> for skills shared by all local agents. Each skill has its own folder.</p>

<h3>Can I use the same skill in Claude Code too?</h3>
<p>Yes. SKILL.md skills work in several agents. Run the same <code>npx skills add</code> command with <code>-a claude-code</code>.</p>

<h3>How do I update all skills at once?</h3>
<p><code>openclaw skills update --all</code> updates skills installed from ClawHub. For skills installed with the skills CLI, run <code>npx skills update</code>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install skills on OpenClaw Mac?","acceptedAnswer":{"@type":"Answer","text":"For a TrustedSkills listing: npx skills add <owner>/<repo> --skill <name> -a openclaw. For ClawHub: openclaw skills install @owner/<slug>."}},{"@type":"Question","name":"Where does OpenClaw store installed skills on Mac?","acceptedAnswer":{"@type":"Answer","text":"In the agent workspace's skills/ folder, or ~/.openclaw/skills/ for skills shared by all local agents."}},{"@type":"Question","name":"Can I use the same skill in Claude Code too?","acceptedAnswer":{"@type":"Answer","text":"Yes. Run the same npx skills add command with -a claude-code."}},{"@type":"Question","name":"How do I update all skills at once?","acceptedAnswer":{"@type":"Answer","text":"openclaw skills update --all for ClawHub skills. npx skills update for skills installed with the skills CLI."}}]}
</script>
    `,
  },

  {
    slug: ['openclaw', 'windows'],
    title: 'Install Skills OpenClaw Windows: One-Command Setup',
    description: 'Install skills on OpenClaw Windows with a single command — no JSON config editing needed. Covers the skills CLI, openclaw skills install, list and update, how to remove a skill, and Windows-specific notes.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Windows: One-Command Setup","description":"Install skills on OpenClaw Windows with one command. No JSON editing: skills are SKILL.md folders.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>In PowerShell, from your OpenClaw agent workspace, run <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code> for a skill listed on TrustedSkills. For a ClawHub skill, run <code>openclaw skills install @owner/&lt;slug&gt;</code>. Neither needs JSON editing.</p>
</div>

<p class="article-intro">OpenClaw runs natively on Windows or inside WSL2. The skill commands are the same in both. The difference is where your home folder is: native Windows uses <code>%USERPROFILE%</code>, and WSL2 uses its own Linux home folder.</p>

<h2>Installing a Skill From TrustedSkills</h2>
<p>Skills on TrustedSkills are SKILL.md skills. They are instruction files, not MCP servers, so there is no JSON config to edit. Run this from your OpenClaw agent workspace:</p>
<pre><code class="language-bash">npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code></pre>
<p>The skills CLI copies the skill into the <code>skills/</code> folder of the current directory. Add <code>-g</code> to install it into <code>%USERPROFILE%\\.openclaw\\skills\\</code> instead, where every local agent can see it.</p>

<h2>Installing a Skill From ClawHub</h2>
<p>OpenClaw has its own skill commands for skills published on ClawHub. Skill names include the owner.</p>
<pre><code class="language-bash"># Search ClawHub
openclaw skills search "calendar"

# Install into the active agent workspace
openclaw skills install @owner/&lt;slug&gt;

# Install into the shared skills folder for all local agents
openclaw skills install @owner/&lt;slug&gt; --global</code></pre>

<h2>Managing Your Skills</h2>
<pre><code class="language-bash"># See every skill OpenClaw can load
openclaw skills list

# Details for one skill
openclaw skills info &lt;name&gt;

# Which skills are ready, and which are missing requirements
openclaw skills check

# Update ClawHub skills
openclaw skills update --all

# Remove a skill installed with the skills CLI
npx skills remove &lt;name&gt; -a openclaw

# Remove a ClawHub skill (needs the ClawHub CLI: npm i -g clawhub)
clawhub uninstall @owner/&lt;slug&gt;</code></pre>
<p><code>openclaw skills</code> has no remove command. Use the tool you installed with.</p>

<h2>When a New Skill Shows Up</h2>
<p>OpenClaw takes a list of skills when a session starts. Its skills watcher can refresh that list during a session. If a new skill does not appear, start a new session.</p>

<h2>Where Skills Are Stored</h2>
<pre><code class="language-bash">&lt;workspace&gt;\\skills\\              # skills for one agent (checked first)
%USERPROFILE%\\.openclaw\\skills\\   # shared skills for all local agents</code></pre>
<p>If you run OpenClaw in WSL2, the shared folder is <code>~/.openclaw/skills/</code> inside WSL.</p>

<h2>Windows-Specific Notes</h2>
<ul>
  <li>No admin access needed. Skills install into your workspace or your user profile.</li>
  <li>If a command isn't found after installing Node.js or OpenClaw, open a new PowerShell window.</li>
  <li>Windows Defender may flag a download. See below.</li>
</ul>

<div class="warning-box">
  <strong>⚠️ Windows Defender alerts:</strong> Don't wave an alert away on the strength of a TrustedSkills badge. No badge here means anyone has read the code. Open the repository linked from the skill's page and review the source before you allow it.
</div>

<h2>Need Node.js?</h2>
<p>The skills CLI runs with npx, so it needs Node.js. OpenClaw itself needs Node.js 24.16 or later. Install from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Windows?</h3>
<p>For a TrustedSkills listing: <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code> in PowerShell. For ClawHub: <code>openclaw skills install @owner/&lt;slug&gt;</code>. No JSON editing.</p>

<h3>Do I need admin privileges to install skills on Windows?</h3>
<p>No. Skills go into your agent workspace or <code>%USERPROFILE%\\.openclaw\\skills\\</code>. Neither needs admin access.</p>

<h3>Windows Defender blocked a skill — what now?</h3>
<p>Don't override Defender because of a badge. No TrustedSkills badge means the code was reviewed. Open the linked repository and read the source before you allow it.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Windows?","acceptedAnswer":{"@type":"Answer","text":"For a TrustedSkills listing: npx skills add <owner>/<repo> --skill <name> -a openclaw. For ClawHub: openclaw skills install @owner/<slug>."}},{"@type":"Question","name":"Do I need admin privileges on Windows?","acceptedAnswer":{"@type":"Answer","text":"No. Skills go into your agent workspace or %USERPROFILE%\\\\.openclaw\\\\skills. Neither needs admin access."}},{"@type":"Question","name":"Windows Defender blocked a skill?","acceptedAnswer":{"@type":"Answer","text":"Don't override Defender on the strength of a badge — no TrustedSkills badge means the code was reviewed. Open the linked repository and read the source before allowing it."}}]}
</script>
    `,
  },

  {
    slug: ['openclaw', 'linux'],
    title: 'Install Skills OpenClaw Linux: Quick Setup Guide',
    description: 'Install skills on OpenClaw Linux with one command — no JSON editing needed. Covers Node.js setup via nvm, the skills CLI and openclaw skills commands, and where skills are stored.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Linux: Quick Setup Guide","description":"Install skills on OpenClaw Linux — one command, no JSON editing needed.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>From your OpenClaw agent workspace, run <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code> for a skill listed on TrustedSkills. For a ClawHub skill, run <code>openclaw skills install @owner/&lt;slug&gt;</code>. No sudo and no JSON editing.</p>
</div>

<p class="article-intro">Skills on Linux install into your home folder or your agent workspace, so you never need sudo. The one thing to get right first is a recent Node.js on your PATH.</p>

<h2>Installing a Skill From TrustedSkills</h2>
<p>Skills on TrustedSkills are SKILL.md skills. They are instruction files, not MCP servers, so there is no JSON config to edit. Run this from your OpenClaw agent workspace:</p>
<pre><code class="language-bash">npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code></pre>
<p>The skills CLI copies the skill into the <code>skills/</code> folder of the current directory. Add <code>-g</code> to install it into <code>~/.openclaw/skills/</code> instead, where every local agent can see it.</p>

<h2>Installing a Skill From ClawHub</h2>
<p>OpenClaw has its own skill commands for skills published on ClawHub. Skill names include the owner.</p>
<pre><code class="language-bash"># Search ClawHub
openclaw skills search "calendar"

# Install into the active agent workspace
openclaw skills install @owner/&lt;slug&gt;

# Install into the shared skills folder for all local agents
openclaw skills install @owner/&lt;slug&gt; --global</code></pre>

<h2>Managing Your Skills</h2>
<pre><code class="language-bash"># See every skill OpenClaw can load
openclaw skills list

# Details for one skill
openclaw skills info &lt;name&gt;

# Which skills are ready, and which are missing requirements
openclaw skills check

# Update ClawHub skills
openclaw skills update --all

# Remove a skill installed with the skills CLI
npx skills remove &lt;name&gt; -a openclaw

# Remove a ClawHub skill (needs the ClawHub CLI: npm i -g clawhub)
clawhub uninstall @owner/&lt;slug&gt;</code></pre>
<p><code>openclaw skills</code> has no remove command. Use the tool you installed with.</p>

<h2>When a New Skill Shows Up</h2>
<p>OpenClaw takes a list of skills when a session starts. Its skills watcher can refresh that list during a session. If a new skill does not appear, start a new session.</p>

<h2>Where Skills Live</h2>
<pre><code class="language-bash">&lt;workspace&gt;/skills/    # skills for one agent (checked first)
~/.openclaw/skills/     # shared skills for all local agents</code></pre>

<h2>Node.js Setup</h2>
<p>OpenClaw needs Node.js 24.16 or later. Distribution packages are often older than that. OpenClaw's installer sets up Node.js for you if it is missing:</p>
<pre><code class="language-bash">curl -fsSL https://openclaw.ai/install.sh | bash</code></pre>
<p>To manage Node.js yourself, nvm installs it without sudo:</p>
<pre><code class="language-bash">curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 24</code></pre>

<div class="tip-box">
  <strong>💡 nvm tip:</strong> nvm sets up Node.js in your shell start-up file. Open a new terminal after installing it, then check with <code>node --version</code>.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Linux?</h3>
<p>For a TrustedSkills listing: <code>npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw</code>. For ClawHub: <code>openclaw skills install @owner/&lt;slug&gt;</code>. No sudo, no JSON editing.</p>

<h3>What if Node.js isn't in PATH for OpenClaw on Linux?</h3>
<p>If you use nvm, open a new terminal or run <code>nvm use 24</code>. Then check that <code>which node</code> returns a path and <code>node --version</code> is 24.16 or later.</p>

<h3>Do skills install per user on a shared Linux server?</h3>
<p>Yes. <code>~/.openclaw/skills/</code> is in each user's home folder, and workspace skills live in that agent's workspace. Users do not share skills unless they share a workspace.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Linux?","acceptedAnswer":{"@type":"Answer","text":"For a TrustedSkills listing: npx skills add <owner>/<repo> --skill <name> -a openclaw. For ClawHub: openclaw skills install @owner/<slug>. No sudo needed."}},{"@type":"Question","name":"What if Node.js isn't in PATH for OpenClaw on Linux?","acceptedAnswer":{"@type":"Answer","text":"If you use nvm, open a new terminal or run nvm use 24. OpenClaw needs Node.js 24.16 or later."}},{"@type":"Question","name":"Do skills install per user on a shared Linux server?","acceptedAnswer":{"@type":"Answer","text":"Yes. ~/.openclaw/skills/ is in each user's home folder, and workspace skills live in that agent's workspace."}}]}
</script>
    `,
  },

  // ─── ADVANCED ───────────────────────────────────────────────────────────────
  {
    slug: ['advanced', 'all-projects-vs-one'],
    title: 'MCP Servers: Global vs Project Scope Across All Platforms',
    description: 'When to make an MCP server available to all projects vs one project — decision framework, config paths for every platform, team collaboration workflow, and how to handle secrets safely.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP Servers: Global vs Project Scope Across All Platforms","description":"Global vs project scope for MCP servers — decision framework and config paths across Claude Desktop, Claude Code, Cursor, and OpenClaw.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Global config = personal tools and credentials, available everywhere on your machine. Project config = team tools, committed to git, only active in that project. Never put real API keys in a committed file. In Claude Code, use <code>$&#123;ENV_VAR&#125;</code> references in <code>.mcp.json</code> instead.</p>
</div>

<p class="article-intro">Every time you add an MCP server or a skill, you choose where it lives. Get it wrong and you end up with personal credentials in a git repo, or a useful tool missing from half your projects. This page gives a simple rule, then the exact locations for each platform.</p>

<h2>The Decision Logic</h2>
<pre><code class="language-bash">Is this a personal tool I want everywhere? (notes, search)
  → Global config

Does it use credentials that are mine, not the project's?
  → Global config (never commit personal secrets)

Should everyone on the team have this automatically?
  → Project config (commit to git)

Is this tool specific to this project's infrastructure?
  → Project config

Not sure?
  → Start global. Move to project when you share it.</code></pre>

<div class="tip-box">
  <strong>💡 Treat a committed key as leaked:</strong> Deleting a key in a later commit does not remove it from git history. If a real credential reaches a shared repo, revoke it and make a new one. Keep real values in your own environment, never in a committed file.
</div>

<h2>Config Locations: Every Platform</h2>

<h3>Claude Desktop</h3>
<p>Global only — no project-level concept.</p>
<div class="table-container">
  <table>
    <thead><tr><th>OS</th><th>Config path</th></tr></thead>
    <tbody>
      <tr><td>Mac</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Windows</td><td><code>%APPDATA%\\Claude\\claude_desktop_config.json</code></td></tr>
      <tr><td>Linux</td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
    </tbody>
  </table>
</div>

<h3>Claude Code</h3>
<div class="table-container">
  <table>
    <thead><tr><th>Scope</th><th>How to add</th><th>Where it is stored</th></tr></thead>
    <tbody>
      <tr><td>User (all your projects)</td><td><code>claude mcp add --scope user</code></td><td><code>~/.claude.json</code></td></tr>
      <tr><td>Local (default: you, this project)</td><td><code>claude mcp add</code></td><td><code>~/.claude.json</code>, under the project</td></tr>
      <tr><td>Project (shared through git)</td><td><code>claude mcp add --scope project</code></td><td><code>.mcp.json</code> in the project root</td></tr>
    </tbody>
  </table>
</div>
<p>On Windows, <code>~</code> is <code>%USERPROFILE%</code>. When the same name is in more than one scope, Claude Code uses local, then project, then user.</p>

<h3>Cursor</h3>
<div class="table-container">
  <table>
    <thead><tr><th>Scope</th><th>Mac/Linux</th><th>Windows</th></tr></thead>
    <tbody>
      <tr><td>Global</td><td><code>~/.cursor/mcp.json</code></td><td><code>%USERPROFILE%\\.cursor\\mcp.json</code></td></tr>
      <tr><td>Project</td><td><code>.cursor/mcp.json</code></td><td><code>.cursor\\mcp.json</code></td></tr>
    </tbody>
  </table>
</div>

<h3>OpenClaw</h3>
<p>OpenClaw skills are SKILL.md folders, not MCP config. Its "project" level is the agent workspace.</p>
<pre><code class="language-bash"># One agent: installs into the workspace's skills/ folder (run from the workspace)
npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw
openclaw skills install @owner/&lt;slug&gt;

# All local agents: installs into ~/.openclaw/skills/
npx skills add &lt;owner&gt;/&lt;repo&gt; --skill &lt;name&gt; -a openclaw -g
openclaw skills install @owner/&lt;slug&gt; --global</code></pre>
<p>Workspace skills win over shared skills when two have the same name.</p>

<h2>Team Workflow for Claude Code</h2>
<ol>
  <li>Each developer adds personal tools with <code>claude mcp add --scope user</code></li>
  <li>Add team tools with <code>claude mcp add --scope project</code>, with no personal credentials</li>
  <li>Commit <code>.mcp.json</code> to git</li>
  <li>Use <code>$&#123;VAR_NAME&#125;</code> references for anything that varies per developer</li>
  <li>List the environment variables each developer must set in your README</li>
</ol>

<h3>.mcp.json (safe to commit):</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@brave/brave-search-mcp-server"],
      "env": { "BRAVE_API_KEY": "$&#123;BRAVE_API_KEY&#125;" }
    }
  }
}</code></pre>

<h3>Each developer's shell (NOT committed):</h3>
<pre><code class="language-bash">export BRAVE_API_KEY=your-own-key
claude</code></pre>
<p>Claude Code reads the value from the environment it starts in. It does not load a <code>.env</code> file for you.</p>

<div class="warning-box">
  <strong>⚠️ Keep key files out of git:</strong> If you keep keys in a local file such as <code>.env</code>, add it to <code>.gitignore</code> before you create it. That is much easier than removing it from history later.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Can the same MCP server be in both user and project config?</h3>
<p>Yes. In Claude Code, the project entry wins over the user entry, and a local entry wins over both. This lets a project use a different database connection from your personal setup.</p>

<h3>How do I share MCP servers with my team?</h3>
<p>Add them to the project's config file and commit it. In Claude Code that file is <code>.mcp.json</code>. Each developer approves the servers the first time Claude Code sees them.</p>

<h3>What's the safest way to handle API keys in project config?</h3>
<p>Use <code>$&#123;VAR_NAME&#125;</code> references. Each developer sets the real value in their own environment. The committed file holds no secrets.</p>

<h3>Does Claude Desktop support project-level config?</h3>
<p>No — it's global only. For project-level MCP config, use Claude Code or Cursor.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Can the same MCP server be in both user and project config?","acceptedAnswer":{"@type":"Answer","text":"Yes. In Claude Code, the project entry wins over the user entry, and a local entry wins over both."}},{"@type":"Question","name":"How do I share MCP servers with my team?","acceptedAnswer":{"@type":"Answer","text":"Add them to the project's config file and commit it. In Claude Code that file is .mcp.json."}},{"@type":"Question","name":"What's the safest way to handle API keys?","acceptedAnswer":{"@type":"Answer","text":"Use $&#123;VAR_NAME&#125; references. Each developer sets the real value in their own environment."}},{"@type":"Question","name":"Does Claude Desktop support project-level config?","acceptedAnswer":{"@type":"Answer","text":"No — global only. Use Claude Code or Cursor for project-level config."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'building-your-first-skill'],
    title: 'How to Build an AI Agent Skill: Beginner\'s Complete Guide',
    description: 'How to build an AI agent skill from scratch — create, test and publish your first MCP server, then submit it to TrustedSkills. Complete guide with working code examples and publishing steps.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'advanced',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How to Build an AI Agent Skill: Beginner's Complete Guide","description":"How to build an AI agent skill from scratch — create, test, and publish to TrustedSkills.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Create a Node.js project, install <code>@modelcontextprotocol/sdk</code>, write a server that declares tools and handles calls, create a <code>SKILL.md</code> file, publish to npm, submit to TrustedSkills. About 30 minutes for a simple skill. Here's the full walkthrough.</p>
</div>

<p class="article-intro">A basic MCP server takes very little code. The MCP SDK handles the protocol, so you only write the tool logic. This guide builds a simple temperature converter step by step.</p>

<h2>What You'll Build</h2>
<p>A temperature converter skill: two tools, <code>celsius_to_fahrenheit</code> and <code>fahrenheit_to_celsius</code>. Simple enough to understand quickly, complete enough to be a real template for anything more complex.</p>

<h2>What You'll Need</h2>
<ul>
  <li>Node.js v18+ — check with <code>node --version</code></li>
  <li>An npm account for publishing</li>
  <li>A GitHub account for the TrustedSkills submission</li>
  <li>A code editor — VS Code is ideal</li>
</ul>

<h2>Step 1: Project Setup</h2>
<pre><code class="language-bash">mkdir temperature-converter-mcp
cd temperature-converter-mcp
npm init -y
npm install @modelcontextprotocol/sdk</code></pre>

<h2>Step 2: Write the Server</h2>
<p>Create <code>index.js</code> — this is your entire skill:</p>
<pre><code class="language-javascript">#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'temperature-converter', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Tell Claude what tools you have
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'celsius_to_fahrenheit',
      description: 'Convert a temperature from Celsius to Fahrenheit',
      inputSchema: {
        type: 'object',
        properties: {
          celsius: { type: 'number', description: 'Temperature in Celsius' }
        },
        required: ['celsius']
      }
    },
    {
      name: 'fahrenheit_to_celsius',
      description: 'Convert a temperature from Fahrenheit to Celsius',
      inputSchema: {
        type: 'object',
        properties: {
          fahrenheit: { type: 'number', description: 'Temperature in Fahrenheit' }
        },
        required: ['fahrenheit']
      }
    }
  ]
}));

// Handle the actual tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'celsius_to_fahrenheit') {
    const f = (args.celsius * 9/5) + 32;
    return {
      content: [{ type: 'text', text: \`\$&#123;args.celsius&#125;°C = \$&#123;f.toFixed(1)&#125;°F\` }]
    };
  }

  if (name === 'fahrenheit_to_celsius') {
    const c = (args.fahrenheit - 32) * 5/9;
    return {
      content: [{ type: 'text', text: \`\$&#123;args.fahrenheit&#125;°F = \$&#123;c.toFixed(1)&#125;°C\` }]
    };
  }

  throw new Error(\`Unknown tool: \$&#123;name&#125;\`);
});

const transport = new StdioServerTransport();
await server.connect(transport);</code></pre>

<p>Update <code>package.json</code>. Keep the <code>dependencies</code> block that <code>npm install</code> added, or the published package won't start:</p>
<pre><code class="language-json">{
  "name": "@yourusername/temperature-converter-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": { "temperature-converter-mcp": "./index.js" },
  "dependencies": { "@modelcontextprotocol/sdk": "^1.30.1" }
}</code></pre>

<pre><code class="language-bash">chmod +x index.js   # Mac/Linux only</code></pre>

<h2>Step 3: Create SKILL.md</h2>
<p>This is what TrustedSkills reads. Don't skip it.</p>
<pre><code class="language-bash">---
name: temperature-converter
description: Convert temperatures between Celsius and Fahrenheit
version: 1.0.0
platforms: [mcp, openclaw, claude, cursor]
tags: [utility, temperature]
metadata:
  npm: "@yourusername/temperature-converter-mcp"
  tools: [celsius_to_fahrenheit, fahrenheit_to_celsius]
---</code></pre>

<h2>Step 4: Test Locally First</h2>
<p>Don't publish until you've tested. Add a local path config:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "temp-converter": {
      "command": "node",
      "args": ["/absolute/path/to/temperature-converter-mcp/index.js"]
    }
  }
}</code></pre>
<p>Restart Claude Desktop and ask: <em>"What's 100 Celsius in Fahrenheit?"</em> — you should get "100°C = 212.0°F".</p>

<div class="tip-box">
  <strong>💡 Test locally before you publish:</strong> Point your config at the local build first. You can fix a bug in seconds locally, but every fix after publishing needs a new release.
</div>

<h2>Step 5: Publish to npm</h2>
<pre><code class="language-bash">npm login
npm publish --access public   # --access public for scoped packages</code></pre>

<p>Test the published version:</p>
<pre><code class="language-bash">npx -y @yourusername/temperature-converter-mcp</code></pre>

<h2>Step 6: Submit to TrustedSkills</h2>
<p>Follow the <a href="/submit">submission guide</a>. The quickest route: put the skill in a public GitHub repository with a <code>SKILL.md</code> at its root, and add the <code>openclaw-skill</code> topic to the repository. Auto-discovery picks it up on the next scraper run, usually within six hours.</p>

<h2>SKILL.md Fields</h2>
<div class="table-container">
  <table>
    <thead><tr><th>Field</th><th>Required</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td><code>name</code></td><td>Yes</td><td>Lowercase, hyphens only</td></tr>
      <tr><td><code>description</code></td><td>Yes</td><td>What the skill does and when to use it</td></tr>
      <tr><td><code>version</code></td><td>Yes</td><td>Semantic version e.g. 1.0.0</td></tr>
      <tr><td><code>platforms</code></td><td>Yes</td><td>mcp, openclaw, claude, cursor, openai</td></tr>
      <tr><td><code>metadata.npm</code></td><td>Recommended</td><td>npm package name</td></tr>
    </tbody>
  </table>
</div>

<div class="tip-box">
  <strong>💡 Tool descriptions matter:</strong> Claude decides when to use a tool based on its description. A vague description like "does temperature stuff" will get ignored. A specific one like "Convert a temperature from Celsius to Fahrenheit — returns the result as a formatted string" will be used reliably.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I need TypeScript to build a skill?</h3>
<p>No. JavaScript works perfectly, as shown in this guide. TypeScript adds type safety but isn't required. The MCP SDK supports both equally.</p>

<h3>Can I build skills in Python?</h3>
<p>Yes. The <code>mcp</code> package on PyPI provides the same SDK in Python. Concepts are identical — you just write Python instead of JavaScript.</p>

<h3>How do I add API keys to my skill?</h3>
<p>Read them from <code>process.env</code>: <code>const apiKey = process.env.MY_API_KEY</code>. Document required env vars in SKILL.md. Users add them to the <code>"env"</code> block in their MCP config.</p>

<h3>How long until a submitted skill appears on TrustedSkills?</h3>
<p>If your repository has the <code>openclaw-skill</code> topic, usually within six hours. Nobody reviews the code by hand. Badges come from provenance (Official, Pinned), an editorial pick (Featured) or an automated scan (Checked). See <a href="/docs/advanced/verification-badges">what each badge means</a>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need TypeScript to build a skill?","acceptedAnswer":{"@type":"Answer","text":"No. JavaScript works perfectly. TypeScript is optional."}},{"@type":"Question","name":"Can I build skills in Python?","acceptedAnswer":{"@type":"Answer","text":"Yes. The 'mcp' package on PyPI provides the same SDK."}},{"@type":"Question","name":"How do I add API keys to my skill?","acceptedAnswer":{"@type":"Answer","text":"Read from process.env. Users add values to the env block in their MCP config."}},{"@type":"Question","name":"How long until a submitted skill appears on TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"If your repository has the openclaw-skill topic, usually within six hours. Nobody reviews the code by hand."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'verification-badges'],
    title: 'What Each TrustedSkills Badge Actually Means',
    description: 'The TrustedSkills badges explained honestly: Official, Featured, Pinned, Listed and Unverified describe provenance, not a security audit. Plus a checklist for vetting a skill yourself.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"What Each TrustedSkills Badge Actually Means","description":"The TrustedSkills badges describe provenance and machine checks, not security audits.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">Quick answer</div>
  <p><strong>No badge on TrustedSkills means a person has read the code.</strong> The badges describe where a skill came from and what machines have checked: <strong>Official</strong> (published by the vendor's own GitHub org), <strong>Featured</strong> (our editorial pick), <strong>Pinned</strong> (install locked to one commit we stored), <strong>Checked</strong> (passed every automated safety check at a pinned commit), <strong>Listed</strong> (indexed, nothing more), <strong>Unverified</strong> (indexed with no extra signal). You are the reviewer. Read the source before you run it.</p>
</div>

<p class="article-intro">Installing a skill isn't like installing a browser extension where the worst case is an annoying ad. A skill runs with whatever access you have given your agent - your files, your API keys, your shell. So it matters what a badge is actually claiming. Here is exactly what each one asserts, and what none of them do.</p>

<h2>What TrustedSkills does and doesn't do</h2>
<p>TrustedSkills is an <em>index</em>. We crawl public sources and record where each skill came from, who publishes it, what it declares it needs, and how to install it on your platform. That is the product.</p>
<p>What we do not do: we do not read skill code, we do not run it, we do not commission audits, and we do not operate a volunteer review programme. An earlier version of this page claimed several of those things. They were not true, and they have been removed.</p>

<div class="warning-box">
  <strong>There is no badge here that means "safe".</strong> A skill carrying every badge we offer can still be malicious. The badges narrow down <em>who published it</em> and <em>whether the code can change under you</em> - not whether the code is trustworthy.
</div>

<h2>The badges</h2>

<h3>Official</h3>
<p>The publishing account matches a GitHub organisation we recognise as the vendor behind the underlying product - Anthropic's own skills, Stripe's own skills, and so on. The match is against a maintained allowlist of organisation names.</p>
<p><strong>What it tells you:</strong> the skill almost certainly comes from the company whose product it wraps, rather than from someone imitating them.</p>
<p><strong>What it doesn't tell you:</strong> anything about the code. Vendors ship bugs and over-broad permissions too.</p>

<h3>Featured</h3>
<p>A small hand-picked set we think are a reasonable first thing to try on a new setup. It is an editorial opinion about usefulness.</p>
<p><strong>What it doesn't tell you:</strong> anything about security. It is a recommendation, not a review.</p>

<h3>Pinned</h3>
<p>We recorded a specific commit hash for the skill and stored a snapshot of the repository at that commit. Installing fetches the snapshot, not whatever the repository holds today.</p>
<p><strong>What it tells you:</strong> the code cannot change under you after the fact. If you audit it once, that audit stays valid for that pinned version. This is real protection against a maintainer - or whoever takes over their account - pushing a malicious update to a package you already trust.</p>
<p><strong>What it doesn't tell you:</strong> whether the pinned code was ever any good. We pinned it; we didn't read it.</p>

<h3>Listed</h3>
<p>The default, and the overwhelming majority of the index. We found the skill on a public source and recorded its metadata. Installing resolves against the live repository, so you get whatever is there when you run the command.</p>

<h3>Unverified</h3>
<p>In the index, but we hold nothing beyond the bare listing - no matched publisher, no pinned commit. Treat it as a complete unknown.</p>

<h2>At a glance</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Badge</th><th>Publisher matched</th><th>Code read by a human</th><th>Install can change under you</th></tr>
    </thead>
    <tbody>
      <tr><td>Official</td><td>Yes, to a vendor org</td><td>No</td><td>Yes, unless also pinned</td></tr>
      <tr><td>Featured</td><td>No</td><td>No</td><td>Yes, unless also pinned</td></tr>
      <tr><td>Pinned</td><td>No</td><td>No</td><td>No</td></tr>
      <tr><td>Checked</td><td>No</td><td>No (a machine scanned it)</td><td>No</td></tr>
      <tr><td>Listed</td><td>No</td><td>No</td><td>Yes</td></tr>
      <tr><td>Unverified</td><td>No</td><td>No</td><td>Yes</td></tr>
    </tbody>
  </table>
</div>
<p>The "code read by a human" column is all No. That is the honest state of this registry today, and printing it is more use to you than a badge implying otherwise.</p>

<h2>How to check a skill yourself</h2>
<p>Since nobody else has, here is what to actually look at. It takes about five minutes and catches most of what matters.</p>
<ol>
  <li><strong>Open the repository</strong> linked from the skill's page. Check it exists, has real history, and isn't a single drive-by commit.</li>
  <li><strong>Read the manifest.</strong> <code>SKILL.md</code> declares the environment variables and binaries the skill wants. If a Markdown formatter asks for <code>AWS_SECRET_ACCESS_KEY</code>, stop there.</li>
  <li><strong>Grep for network calls.</strong> Look for <code>fetch(</code>, <code>axios</code>, <code>http.request</code>, <code>curl</code>. Every destination host should be one the skill's stated purpose explains.</li>
  <li><strong>Grep for dynamic execution.</strong> <code>eval(</code>, <code>new Function(</code>, <code>child_process</code>, <code>exec(</code>, and base64 blobs that get decoded and run. Legitimate skills rarely need these, and they are how a payload hides.</li>
  <li><strong>Check the install script.</strong> A <code>postinstall</code> hook, or anything piping <code>curl</code> into a shell, runs before you have looked at anything.</li>
  <li><strong>Check file access.</strong> Reads of <code>~/.ssh</code>, <code>~/.aws</code>, <code>.env</code>, browser profiles or credential stores are almost never justified.</li>
</ol>

<div class="tip-box">
  <strong>Reduce the blast radius.</strong> Whatever the badge says, the strongest move is to give the agent less to lose: run it in a container or a scratch account, keep production credentials out of its environment, and prefer skills pinned to a commit so a later update can't change what you already checked.
</div>

<h2>Reporting a problem</h2>
<p>If you find a skill in this index doing something it shouldn't, <a href="${REPORT_SKILL_URL}">open a report on GitHub</a>. ${REPORT_PROMISE} If it also ships as an npm package, report that separately to npm at <code>security@npmjs.com</code> - delisting here does not remove it from npm.</p>

<hr/>

<h2>Frequently asked questions</h2>

<h3>Does any badge mean the skill has been security reviewed?</h3>
<p>No. No badge means a person read the code. One badge does mean a machine did: <strong>Checked</strong> is a static scan of the skill's files at a named commit, looking for credential reads, undeclared network calls, encoded payloads that get executed and pipe-to-shell installers. Every result is printed on the skill's page — see <a href="/docs/advanced/automated-safety-checks">what the automated safety pass covers</a>. The other badges describe provenance: who published the skill, and whether the install is pinned to a fixed commit.</p>

<h3>Is it safe to install a Listed skill?</h3>
<p>It carries exactly as much risk as installing any unreviewed code from the internet, because that is what it is. Read the repository first: check the declared environment variables, any network calls, and anything that executes a string.</p>

<h3>What is the practical difference between Pinned and everything else?</h3>
<p>A pinned skill installs from a snapshot we stored at a specific commit, so it cannot change after you have looked at it. Everything else resolves against the live repository, which means a later push changes what you install.</p>

<h3>How do I get a badge for my skill?</h3>
<p>You can't apply. Official is assigned automatically when your publishing org matches the vendor allowlist, Pinned when the registry records and stores a commit for your skill, and Featured is an editorial pick.</p>

<h3>How do I report a malicious skill?</h3>
<p>Open an issue in the TrustedSkills registry on GitHub and mark it as a security report. Report any npm package separately to <code>security@npmjs.com</code>.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Does any TrustedSkills badge mean the skill has been security reviewed?","acceptedAnswer":{"@type":"Answer","text":"No badge means a person read the code. The Checked badge means a machine statically scanned the skill's files at a named commit for credential reads, undeclared network calls, encoded payloads and pipe-to-shell installers, and the individual results are published on the skill page. The other badges describe provenance - who published the skill and whether the install is pinned to a fixed commit."}},{"@type":"Question","name":"Is it safe to install a Listed skill?","acceptedAnswer":{"@type":"Answer","text":"It carries the same risk as any unreviewed code from the internet. Read the repository first: check declared environment variables, network calls, and anything that executes a string."}},{"@type":"Question","name":"What is the difference between Pinned and other badges?","acceptedAnswer":{"@type":"Answer","text":"A pinned skill installs from a stored snapshot at a specific commit, so it cannot change after you review it. Other skills resolve against the live repository."}},{"@type":"Question","name":"How do I report a malicious skill?","acceptedAnswer":{"@type":"Answer","text":"Open an issue in the TrustedSkills registry on GitHub marked as a security report, and report any npm package to security@npmjs.com."}}]}
</script>

    `,
  },

  {
    slug: ['advanced', 'automated-safety-checks'],
    title: 'The Automated Safety Pass: What "Checked" Actually Means',
    description: 'Exactly what the TrustedSkills automated safety scan looks for in every skill — credential access, undeclared network calls, obfuscated payloads, pipe-to-shell installers — how it decides, and what it cannot tell you.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"The Automated Safety Pass: What Checked Actually Means","description":"What the TrustedSkills automated safety scan looks for in every skill, how it decides, and what it cannot tell you.","dateModified":"2026-09-27","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>Checked</strong> means we pulled the skill's files at a specific commit and statically scanned them for six things: a manifest that parses, no reads of credential stores, no network calls to undeclared hosts, no encoded payloads that get executed, no <code>curl … | sh</code> installers, and a recorded commit SHA. Every individual result — pass or fail, with the line that decided it — is printed on the skill's page. It is a machine reading code. Nobody ran the skill, and nothing here says it is any good.</p>
</div>

<p class="article-intro">Most skill directories tell you how many people installed something. That is a popularity number, not a safety signal. The question you actually have before you let a skill run inside your agent is narrower: does this thing read my keys, and does it phone somewhere I didn't agree to? Those two questions can be answered by a machine, on every skill, every day — so we do that, and we publish the working.</p>

<h2>Why the old badges meant nothing</h2>
<p>Until this pass shipped, 92% of the catalogue carried a "Community" badge. That was not a review. It was the fallback value in the crawler — the label a skill got when nothing was known about it. Any directory can generate a badge like that, which is exactly why a badge like that is worthless.</p>
<p>The rule now: a tier states something a reader could check for themselves, and the page shows what it is based on.</p>

<h2>The tiers</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Tier</th><th>What it asserts</th><th>Who decides</th></tr>
    </thead>
    <tbody>
      <tr><td>Listed</td><td>The skill exists, we resolved where it comes from, and we recorded how to install it. Nobody looked at the code.</td><td>Automatic</td></tr>
      <tr><td>Checked</td><td>Passed all six automated checks below, at a named commit.</td><td>Automatic, re-run as the upstream repository moves</td></tr>
      <tr><td>Pinned</td><td>Installs resolve to one recorded commit rather than whatever the repository holds today.</td><td>Automatic, where we hold a snapshot</td></tr>
      <tr><td>Official</td><td>Published by the GitHub organisation that builds the underlying product. A statement about the publisher, not the code.</td><td>Organisation matching</td></tr>
      <tr><td>Featured</td><td>An editorial pick — a good place to start. Not a security claim.</td><td>Us, by hand</td></tr>
    </tbody>
  </table>
</div>
<p>A skill carrying Official or Featured still gets scanned, and its check results still appear on its page. Who published a skill and what its code does are different questions.</p>

<h2>The six checks</h2>

<h3>1. Declares what it does</h3>
<p><code>SKILL.md</code> exists, its YAML frontmatter parses, and it carries a name and a description with a real body behind it.</p>
<p><strong>Fails when:</strong> there is no manifest, the frontmatter is malformed, or the entry is a stub with nothing to review. A skill that cannot say what it does cannot be checked against what it does.</p>

<h3>2. No undeclared network calls</h3>
<p>Every host the skill dials must be either well-known infrastructure — package registries, GitHub, first-party model APIs — or declared in its own frontmatter (<code>allowed-domains</code>).</p>
<p><strong>Fails when:</strong> a script, a config endpoint, or a command the manifest tells the agent to run contacts a host outside that set. The skill page lists the hosts and the exact lines.</p>
<p><strong>Does not fail on:</strong> links in documentation. A README that links to <code>react.dev</code> is not contacting <code>react.dev</code>. Counting links as calls is the difference between a check and a noise generator.</p>

<h3>3. No obfuscated payloads</h3>
<p>Looks for the shapes used to hide code from a reader: base64 or hex blobs that get decoded and executed, <code>eval(atob(…))</code>, <code>exec(compile(…))</code>, PowerShell <code>-EncodedCommand</code>, strings assembled from character codes, long encoded literals.</p>
<p><strong>Passes:</strong> ordinary encoding. <code>base64.b64encode(data)</code> on its way into a request body is normal work; decoding a blob and running it is not.</p>

<h3>4. No credential access</h3>
<p>Flags reads of SSH private keys, <code>~/.aws/credentials</code>, gcloud and Kubernetes config, <code>~/.npmrc</code> tokens, <code>.netrc</code>, stored git credentials, the GitHub CLI token store, OS keychains and credential managers, GnuPG keyrings, password-manager vaults, browser cookie and login databases, crypto wallet files, and environment files outside the project.</p>
<p>It also flags the exfiltration shape directly: the environment being dumped into an outbound request on one line.</p>
<p><strong>And it reads the instructions, not just the code.</strong> For an agent skill the prose <em>is</em> the payload — a manifest that tells the agent to read <code>~/.ssh/id_rsa</code> and post it somewhere is dangerous even though it ships no code at all. So <code>SKILL.md</code> prose is scanned for credential paths next to imperative verbs. A README that warns you never to commit your <code>.env</code> is documentation and does not fail.</p>

<h3>5. No pipe-to-shell installers</h3>
<p><code>curl … | sh</code>, <code>bash &lt;(curl …)</code>, <code>iwr … | iex</code>, <code>pip install</code> straight from a URL: anything that fetches code at run time and executes it unseen. Checked in the code and in the manifest's instructions.</p>
<p><strong>Passes:</strong> <code>npm install</code>, <code>pip install ruff</code>, and other installs that resolve through a package registry.</p>

<h3>6. Pinned to a commit</h3>
<p>The result records the repository and the exact commit SHA that was read, and the skill page links to it. Without that, "we scanned it" refers to nothing in particular — the repository may have changed an hour later.</p>

<h2>What the scan cannot tell you</h2>
<p>This is the part most badge systems leave out.</p>
<ul>
  <li><strong>It does not run the skill.</strong> Behaviour that only appears at run time is invisible to it.</li>
  <li><strong>It does not read dependencies.</strong> A clean skill that installs a compromised npm package is still a problem.</li>
  <li><strong>It cannot judge intent.</strong> A skill can pass every check and still be useless, wrong, or subtly bad advice to an agent.</li>
  <li><strong>It can be evaded.</strong> Static analysis catches known shapes. A novel encoding, or a payload pulled from a host that looks like infrastructure, can get through — which is why Checked is a floor, not an endorsement.</li>
  <li><strong>A failure is not an accusation.</strong> Plenty of flagged skills are honest tools that talk to their own API without declaring it. Read the finding; it names the file and the line.</li>
</ul>

<h2>When a skill cannot be scanned</h2>
<p>Some skills show no check results at all. The usual reasons: the upstream repository was deleted or made private, the skill's directory was renamed or removed after the registry indexed it, or the repository has no <code>SKILL.md</code>. Those skills stay Listed. We would rather show nothing than imply a check that never ran.</p>

<h2>How often it runs</h2>
<p>The scan runs daily and is incremental: a repository whose head commit hasn't moved keeps its stored result, and one that has moved is re-read and re-scanned. Because the tier is recomputed from the stored results on every build, a skill that stops passing loses the Checked label rather than keeping a badge it earned six months ago.</p>

<h2>If you think a result is wrong</h2>
<p>Both directions are worth reporting. A false pass is a defect in the checks; a false failure means an honest skill is being misrepresented. <a href="${REPORT_SKILL_URL}">Open a report on GitHub</a> with the skill slug and the commit shown on its page.</p>
<p>Skill authors: the cheapest way to pass the network check is to declare your own hosts in your frontmatter. <code>allowed-domains</code> is read as a declaration, and a declared host is not a finding.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Does "Checked" mean a skill is safe?</h3>
<p>No. It means six specific dangerous patterns were not found in the code as published at a named commit. It is a floor. Nobody ran the skill, and no human reviewed it.</p>

<h3>Why did a skill I trust get flagged?</h3>
<p>Most often because it calls its own API and does not declare that host in its frontmatter. The finding on the skill page names the file, the line and the host, so you can judge it yourself in about ten seconds.</p>

<h3>Do Official and Featured skills get scanned?</h3>
<p>Yes. Every skill we can resolve to a repository is scanned, whatever its tier, and the results are shown on its page.</p>

<h3>Is the scanner open to inspection?</h3>
<p>The checks are described above in the same terms the scanner implements them, including what each one deliberately ignores. If a description here and the result on a skill page disagree, that is a bug worth reporting.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Does Checked mean a skill is safe?","acceptedAnswer":{"@type":"Answer","text":"No. It means six specific dangerous patterns were not found in the code as published at a named commit. Nobody ran the skill and no human reviewed it."}},{"@type":"Question","name":"Why did a skill I trust get flagged?","acceptedAnswer":{"@type":"Answer","text":"Usually because it calls its own API without declaring that host in its frontmatter. The finding names the file, line and host."}},{"@type":"Question","name":"Do Official and Featured skills get scanned?","acceptedAnswer":{"@type":"Answer","text":"Yes. Every skill that resolves to a repository is scanned whatever its tier, and the results appear on its page."}}]}
</script>
    `,
  },

  // ─── GUIDES ─────────────────────────────────────────────────────────────────
  {
    slug: ['guides', 'ga-gsc-mcp-setup'],
    title: 'Google Analytics & Search Console MCP Setup Guide',
    description: 'Step-by-step guide to setting up Google Analytics MCP and Google Search Console MCP. Connect GA4 and GSC to Claude, Cursor, and OpenClaw in 20 minutes.',
    category: 'Guides',
    categorySlug: 'guides',
    persona: 'developer',
    lastUpdated: '2026-09-27',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"TechArticle","headline":"Google Analytics & Search Console MCP Setup Guide","description":"Step-by-step guide to installing Google Analytics MCP and Google Search Console MCP. Connect GA4 and GSC data to Claude, Cursor, and other AI tools using real MCP servers.","dateModified":"2026-09-27","author":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"},"publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"},"keywords":"Google Analytics MCP, Google Search Console MCP, GA4 MCP setup, GSC MCP Claude, search console AI"}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ TL;DR</div>
  <p>You can connect both Google Analytics 4 and Google Search Console to Claude, Cursor, or OpenClaw using free, open-source MCP servers. The setup takes about 20 minutes and requires a Google Cloud service account. Once connected, you can query your site's traffic, keyword rankings, and SEO opportunities in plain English — no more CSV exports.</p>
</div>

<p class="article-intro">Open-source MCP servers exist for both GA4 and Google Search Console. With them, your AI agent can answer questions like "which pages lost traffic this month?" without you exporting spreadsheets. This guide walks through the setup.</p>

<h2>What You'll Need</h2>
<ul>
  <li>A Google account with access to GA4 and/or Google Search Console</li>
  <li>A Google Cloud project (free tier is fine)</li>
  <li>Python 3.10+ installed on your machine (3.11+ for mcp-gsc)</li>
  <li>An MCP-compatible client: Claude Desktop, Claude Code, Cursor, or OpenClaw</li>
  <li>About 20–30 minutes</li>
</ul>
<p><strong>Privacy note:</strong> <code>google-analytics-mcp</code> sends anonymous usage data by default. Set <code>DISABLE_TELEMETRY=1</code> in its <code>env</code> block to turn that off.</p>
<p><strong>Heads up:</strong> You'll need real credentials to pull live data. The MCP servers themselves are free and open-source, but GA4 and GSC data lives behind Google's APIs — which require auth. This guide covers the full setup from scratch.</p>

<h2>Part 1: Understanding GA4 MCP and GSC MCP</h2>
<p>An MCP server is a small background process that sits between your AI client and an external data source. When you ask Claude "what were my top pages last week?", Claude doesn't scrape the Google Analytics UI — it calls an MCP tool that makes an authenticated API request and returns structured data.</p>
<p>The <strong>GA4 MCP</strong> gives your AI agent access to the Google Analytics Data API. That means you can query dimensions, metrics, date ranges, segments — the same data available in the GA4 interface, but through natural language. The best server currently is <code>surendranb/google-analytics-mcp</code>, which supports 200+ GA4 dimensions and metrics.</p>
<p>The <strong>GSC MCP</strong> connects to the Google Search Console API. It surfaces search analytics — queries, impressions, clicks, CTR, average position — along with URL inspection, sitemap status, and indexing data. The most capable server is <code>AminForou/mcp-gsc</code>.</p>
<p>Together, they unlock something the individual dashboards don't: cross-referencing organic search performance with on-site behavior. Ask things like "show me pages with high impressions but low engagement" and your agent can correlate GSC click data with GA4 session data in a single response.</p>

<h2>The MCP Servers to Use</h2>

<h3>GA4: google-analytics-mcp by surendranb</h3>
<div class="skill-meta">
  <a href="https://github.com/surendranb/google-analytics-mcp" target="_blank" rel="noopener">github.com/surendranb/google-analytics-mcp</a> &bull;
  <span>Python &bull; MIT License</span>
</div>
<p>This is the most complete GA4 MCP server available. It supports 200+ dimensions and metrics from the Google Analytics Data API v1, including:</p>
<ul>
  <li>Traffic sources (sessions by channel, medium, source)</li>
  <li>Page performance (pageviews, engagement rate, bounce rate)</li>
  <li>User behavior (new vs returning, device, geography)</li>
  <li>Conversion data (events, goals, e-commerce)</li>
  <li>Date comparisons and custom date ranges</li>
</ul>
<p>Install via pip:</p>
<pre><code>pip install google-analytics-mcp</code></pre>

<p>MCP config block (Python 3):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python3",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account-key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}</code></pre>

<h3>GSC: mcp-gsc by AminForou</h3>
<div class="skill-meta">
  <a href="https://github.com/AminForou/mcp-gsc" target="_blank" rel="noopener">github.com/AminForou/mcp-gsc</a> &bull;
  <span>Python &bull; MIT License</span>
</div>
<p>The community favourite for GSC integration. Supports both OAuth (great for personal use) and service accounts (better for automation). Tools include:</p>
<ul>
  <li><code>list_properties</code> — see all your GSC-verified sites</li>
  <li><code>get_search_analytics</code> — queries, impressions, clicks, CTR, position</li>
  <li><code>get_performance_overview</code> — high-level summary for any date range</li>
  <li><code>check_indexing_issues</code> — find pages with crawl/index problems</li>
  <li><code>inspect_url_enhanced</code> — detailed URL inspection</li>
  <li><code>get_sitemaps</code> / <code>submit_sitemap</code> — sitemap management</li>
</ul>

<p>MCP config block (service account, after cloning repo):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "gsc": {
      "command": "/path/to/mcp-gsc/.venv/bin/python",
      "args": ["/path/to/mcp-gsc/gsc_server.py"],
      "env": {
        "GSC_CREDENTIALS_PATH": "/path/to/service_account_credentials.json",
        "GSC_SKIP_OAUTH": "true"
      }
    }
  }
}</code></pre>

<h3>Bonus: search-console-mcp (GSC + GA4 + Bing in one)</h3>
<div class="skill-meta">
  <a href="https://github.com/saurabhsharma2u/search-console-mcp" target="_blank" rel="noopener">github.com/saurabhsharma2u/search-console-mcp</a> &bull;
  <span>Node.js &bull; npm: search-console-mcp</span>
</div>
<p>If you want all three platforms in one server, this is worth considering. It combines GSC, Google Analytics 4, and Bing Webmaster Tools, with built-in "opportunity matrix" analysis and anomaly detection. It's more opinionated — the server handles the complex SEO math so your AI gets curated insights rather than raw data.</p>
<pre><code class="language-json">{
  "mcpServers": {
    "search-console-mcp": {
      "command": "npx",
      "args": ["-y", "search-console-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/credentials.json"
      }
    }
  }
}</code></pre>
<p>To add GA4 or Bing, run <code>npx search-console-mcp setup</code> once and follow the prompts.</p>

<h2>Step-by-Step Setup: GA4 MCP</h2>

<h3>Step 1: Create a Google Cloud Project</h3>
<ol>
  <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener">console.cloud.google.com</a></li>
  <li>Click the project dropdown at the top → <strong>New Project</strong></li>
  <li>Give it a name (e.g., "my-mcp-analytics") and click <strong>Create</strong></li>
</ol>
<p>If you already have a project you want to use, just select it. No need to create a new one.</p>

<h3>Step 2: Enable the GA Data API</h3>
<ol>
  <li>In the left sidebar, go to <strong>APIs &amp; Services → Library</strong></li>
  <li>Search for <strong>"Google Analytics Data API"</strong></li>
  <li>Click it → <strong>Enable</strong></li>
</ol>
<p><strong>Pro tip:</strong> While you're here, also enable the <strong>Google Search Console API</strong> if you're setting up GSC in the same project.</p>

<h3>Step 3: Create a Service Account</h3>
<ol>
  <li>Go to <strong>APIs &amp; Services → Credentials</strong></li>
  <li>Click <strong>Create Credentials → Service Account</strong></li>
  <li>Name it something memorable (e.g., "mcp-analytics-reader")</li>
  <li>Click <strong>Create and Continue</strong></li>
  <li>Skip the role assignment (you'll add access in GA4 directly) → <strong>Done</strong></li>
</ol>

<h3>Step 4: Download the JSON Key</h3>
<ol>
  <li>Click your new service account in the list</li>
  <li>Go to the <strong>Keys</strong> tab</li>
  <li>Click <strong>Add Key → Create New Key → JSON → Create</strong></li>
  <li>A JSON file downloads automatically — save it somewhere safe (e.g., <code>~/.config/gcp/mcp-analytics-key.json</code>)</li>
</ol>
<p><strong>Heads up:</strong> This file contains credentials. Don't commit it to git. Add it to your <code>.gitignore</code> if your config files live in a repo.</p>

<h3>Step 5: Grant Service Account Access to GA4</h3>
<ol>
  <li>Open the JSON key file and find the <code>client_email</code> field — it looks like <code>mcp-analytics-reader@your-project.iam.gserviceaccount.com</code></li>
  <li>Go to <a href="https://analytics.google.com/" target="_blank" rel="noopener">analytics.google.com</a></li>
  <li>Select your GA4 property → <strong>Admin (gear icon)</strong></li>
  <li>Under Property → <strong>Property access management</strong></li>
  <li>Click <strong>+ → Add users</strong>, paste the service account email, set role to <strong>Viewer</strong>, click <strong>Add</strong></li>
</ol>
<p>Also grab your <strong>Property ID</strong>: Admin → Property Details → numeric ID (like <code>123456789</code>). This is different from the Measurement ID that starts with G-.</p>

<h3>Step 6: Install and Configure the MCP Server</h3>
<pre><code>pip install google-analytics-mcp</code></pre>

<p>Then add to your config file:</p>

<p><strong>Claude Desktop — Mac</strong> (<code>~/Library/Application Support/Claude/claude_desktop_config.json</code>):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python3",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/Users/yourname/.config/gcp/mcp-analytics-key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}</code></pre>

<p><strong>Claude Desktop — Windows</strong> (<code>%APPDATA%\\Claude\\claude_desktop_config.json</code>):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "C:\\\\Users\\\\yourname\\\\.config\\\\gcp\\\\mcp-analytics-key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}</code></pre>

<p><strong>Claude Code</strong> (run in terminal):</p>
<pre><code>claude mcp add ga4-analytics -e GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json -e GA4_PROPERTY_ID=123456789 -- python3 -m ga4_mcp</code></pre>
<p>This adds it for you in the current project. Add <code>--scope user</code> to use it in every project.</p>

<p><strong>Cursor</strong> (<code>~/.cursor/mcp.json</code> or project-level <code>.cursor/mcp.json</code>):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python3",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    }
  }
}</code></pre>

<p>Restart your AI client after saving the config. If it worked, you'll see "ga4-analytics" listed in the connected tools.</p>

<h2>Step-by-Step Setup: GSC MCP</h2>

<h3>Step 1: Enable the Search Console API</h3>
<p>If you didn't enable it earlier:</p>
<ol>
  <li>In Google Cloud Console → <strong>APIs &amp; Services → Library</strong></li>
  <li>Search <strong>"Google Search Console API"</strong> → Enable</li>
</ol>

<h3>Step 2: Grant Service Account Access to GSC</h3>
<p>You can reuse the same service account from the GA4 setup — just add it to GSC too:</p>
<ol>
  <li>Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener">search.google.com/search-console</a></li>
  <li>Select your property → <strong>Settings → Users and permissions</strong></li>
  <li>Click <strong>Add User</strong>, paste the service account email, set to <strong>Full</strong> (needed for URL inspection), click <strong>Add</strong></li>
</ol>

<h3>Step 3: Clone and Install the GSC MCP Server</h3>
<pre><code>git clone https://github.com/AminForou/mcp-gsc.git
cd mcp-gsc
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -r requirements.txt</code></pre>

<h3>Step 4: Add GSC Config to Your AI Client</h3>
<p>Add alongside your existing GA4 entry (both can live in the same <code>mcpServers</code> block):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "ga4-analytics": {
      "command": "python3",
      "args": ["-m", "ga4_mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/key.json",
        "GA4_PROPERTY_ID": "123456789"
      }
    },
    "gsc": {
      "command": "/path/to/mcp-gsc/.venv/bin/python",
      "args": ["/path/to/mcp-gsc/gsc_server.py"],
      "env": {
        "GSC_CREDENTIALS_PATH": "/path/to/key.json",
        "GSC_SKIP_OAUTH": "true"
      }
    }
  }
}</code></pre>

<p>Note that both servers can use the same JSON key file — you just reference it in both env blocks.</p>

<h2>Top Skills to Pair with GA + GSC</h2>
<p>Once you've got live analytics data flowing, these TrustedSkills skills pair really well:</p>

<div class="skill-card">
  <h3><a href="/skills/seo-eeat-checker">🎯 SEO EEAT Checker</a></h3>
  <p>Audits your content for Google's E-E-A-T signals. Once GSC MCP shows you which pages are underperforming in rankings, the EEAT Checker can identify exactly what trust signals are missing — author bios, dates, expertise signals.</p>
</div>

<div class="skill-card">
  <h3><a href="/skills/decodo-scraper">🕷️ Decodo Scraper</a></h3>
  <p>When GA4 + GSC tells you a competitor is outranking you for a keyword, Decodo lets your agent scrape and analyze what they're doing differently. Pair it with GSC data for gap analysis.</p>
</div>

<div class="skill-card">
  <h3><a href="/skills/agent-deep-research">🔍 Agent Deep Research</a></h3>
  <p>Uses Gemini's grounding capabilities to research topics at depth. Feed it your GSC "impressions without clicks" list and it can research what intent signals are driving those queries.</p>
</div>

<div class="skill-card">
  <h3><a href="/skills/code-runner">💻 Code Runner</a></h3>
  <p>Run Python or JavaScript analytics scripts on the data your AI agent fetches. Useful for custom aggregations, visualizations, or exporting processed data to CSV or JSON.</p>
</div>

<div class="skill-card">
  <h3><a href="/skills/content-humanizer">✍️ Content Humanizer</a></h3>
  <p>After GSC surfaces pages with low CTR, your agent can rewrite meta descriptions and title tags. Content Humanizer ensures those rewrites don't sound like AI-generated text.</p>
</div>

<h2>New Property Setup Checklist</h2>
<p>Setting up MCP for a new site? Run through this checklist to make sure everything's connected before you start querying:</p>
<div class="checklist">
  <ul class="checklist-items">
    <li>Create GA4 property in Google Analytics</li>
    <li>Add tracking code (gtag.js or GTM) to your site</li>
    <li>Verify GSC ownership (HTML file, DNS TXT record, or existing GA tag)</li>
    <li>Link GA4 to GSC in GA4 Admin → Product Linking → Search Console</li>
    <li>Create Google Cloud project and enable GA Data API + Search Console API</li>
    <li>Create service account and download JSON key</li>
    <li>Grant service account Viewer access in GA4 property</li>
    <li>Grant service account Full access in GSC property</li>
    <li>Install <code>google-analytics-mcp</code> via pip</li>
    <li>Clone <code>AminForou/mcp-gsc</code> and install dependencies</li>
    <li>Add both MCP config blocks to your AI client config</li>
    <li>Restart the AI client</li>
    <li>Test: ask "list my GSC properties" — should return your site</li>
    <li>Test: ask "show me top pages by sessions this week" — should return GA4 data</li>
  </ul>
</div>

<h2>What You Can Do Once Connected</h2>
<p>Here are some prompts worth trying right after setup. These aren't hypothetical — they actually work with these MCP servers:</p>

<ul class="prompt-examples">
  <li><strong>"What pages got the most traffic last week?"</strong> — GA4 returns pageview data by page path, sorted descending.</li>
  <li><strong>"Show me which keywords are driving clicks but not ranking in the top 3"</strong> — GSC filters by position 4–20, sorted by clicks.</li>
  <li><strong>"Compare this month vs last month organic traffic"</strong> — GA4 date comparison query across sessions from organic search.</li>
  <li><strong>"Which pages have the highest impressions but lowest CTR?"</strong> — GSC query sorted by impressions, filtered by CTR under 2%.</li>
  <li><strong>"Are there any pages with indexing issues?"</strong> — GSC URL inspection across your top pages by traffic.</li>
  <li><strong>"What's my average position for brand vs non-brand queries?"</strong> — GSC with regex filter on your brand name.</li>
  <li><strong>"Show me my top landing pages and their bounce rates"</strong> — GA4 with landingPagePlusQueryString dimension and bounceRate metric.</li>
</ul>

<h2>Frequently Asked Questions</h2>

<h3>Do I need a paid Google account or API plan?</h3>
<p>No. Both the Google Analytics Data API and the Search Console API are free, with generous quotas for personal or small-business use. You just need a Google Cloud project — which is free to create. The only cost would be if you're making extremely high query volumes (tens of thousands of requests per day), which is unlikely for typical use.</p>

<h3>Can I use the same service account for both GA4 and GSC?</h3>
<p>Yes. That is the simplest setup. Create one service account, download one JSON key, then grant that service account access to both your GA4 property and your GSC property. Both MCP configs can point to the same key file.</p>

<h3>Does this work with Claude Code or just Claude Desktop?</h3>
<p>Both — and Cursor too. The MCP config format is essentially the same across Claude Desktop, Claude Code, and Cursor. The file location differs (Claude Desktop uses <code>claude_desktop_config.json</code>, Claude Code uses <code>~/.claude.json</code> or a project's <code>.mcp.json</code>, Cursor uses <code>mcp.json</code>), but the JSON structure inside is identical.</p>

<h3>What if I manage multiple sites or multiple GA4 properties?</h3>
<p>The <code>surendranb/google-analytics-mcp</code> server is configured per property (you set a single <code>GA4_PROPERTY_ID</code>). If you have multiple properties, you can either add multiple server entries with different names in your config, or use the <code>search-console-mcp</code> package, which supports several accounts once you run its setup command. The <code>AminForou/mcp-gsc</code> server shows all GSC properties the service account has access to, so you just specify the site URL when querying.</p>

<h3>My AI agent returned "no data found" — what's wrong?</h3>
<p>The most common causes: (1) the service account hasn't been granted access to the property — double-check in both GA4 and GSC admin; (2) the GA4 property ID is the numeric one (like <code>123456789</code>), not the measurement ID (G-XXXXXXX); (3) the JSON key file path in your config is wrong or the file doesn't exist at that location; (4) you need to restart your AI client after changing the config. Check the client's MCP logs for specific error messages.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need a paid Google account or API plan?","acceptedAnswer":{"@type":"Answer","text":"No. Both the Google Analytics Data API and Search Console API are free with generous quotas. You just need a free Google Cloud project."}},{"@type":"Question","name":"Can I use the same service account for both GA4 and GSC?","acceptedAnswer":{"@type":"Answer","text":"Yes. Create one service account, download one JSON key, and grant it access to both your GA4 property and GSC property. Both MCP configs can point to the same key file."}},{"@type":"Question","name":"Does this work with Claude Code or just Claude Desktop?","acceptedAnswer":{"@type":"Answer","text":"Both work, and Cursor too. The MCP config format is the same across all three. The file location differs but the JSON structure inside is identical."}},{"@type":"Question","name":"What if I manage multiple sites or multiple GA4 properties?","acceptedAnswer":{"@type":"Answer","text":"Add multiple server entries in your config with different names, or use the search-console-mcp package which supports multi-account access. The AminForou GSC server shows all properties the service account can access."}},{"@type":"Question","name":"My AI agent returned 'no data found' — what's wrong?","acceptedAnswer":{"@type":"Answer","text":"Common causes: service account not granted access to the property; wrong property ID format (use numeric, not G-XXXXXX); wrong JSON key file path; or client wasn't restarted after config change."}}]}
</script>

    `,
  },
];

// Helper: get article by slug
export function getArticle(slugParts: string[]): DocArticle | undefined {
  return DOC_ARTICLES.find(
    (a) => a.slug.join('/') === slugParts.join('/')
  );
}

// Helper: get articles by category
export function getArticlesByCategory(categorySlug: string): DocArticle[] {
  return DOC_ARTICLES.filter((a) => a.categorySlug === categorySlug);
}

// Helper: get prev/next for navigation
export function getPrevNext(article: DocArticle): { prev: DocArticle | null; next: DocArticle | null } {
  const idx = DOC_ARTICLES.indexOf(article);
  return {
    prev: idx > 0 ? DOC_ARTICLES[idx - 1] : null,
    next: idx < DOC_ARTICLES.length - 1 ? DOC_ARTICLES[idx + 1] : null,
  };
}
