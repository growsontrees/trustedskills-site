export interface DocArticle {
  slug: string[];
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  persona: 'beginner' | 'developer' | 'advanced';
  lastUpdated: string;
  author: { name: string; bio: string };
  content: string;
}

const TRUSTEDSKILLS_AUTHOR = {
  name: 'TrustedSkills Team',
  bio: 'The TrustedSkills team builds and tests AI agent integrations across Claude, OpenClaw, Cursor, and VS Code. We verify every skill in our registry and have set up hundreds of MCP configs across every major platform.',
};

export const DOC_CATEGORIES = [
  { slug: 'concepts', label: 'Foundational Concepts', icon: '💡' },
  { slug: 'claude-desktop', label: 'Claude Desktop', icon: '🖥️' },
  { slug: 'claude-code', label: 'Claude Code', icon: '⌨️' },
  { slug: 'cursor', label: 'Cursor / VS Code', icon: '🖱️' },
  { slug: 'openclaw', label: 'OpenClaw', icon: '🦞' },
  { slug: 'advanced', label: 'Advanced Topics', icon: '🚀' },
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
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP vs Skills vs Plugins AI: What's the Difference?","description":"Understand MCP vs skills vs plugins AI terminology. Clear definitions and a comparison table.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>MCP</strong> is the protocol (how AI talks to tools). <strong>Skills</strong> and <strong>plugins</strong> are both names for the packaged tools themselves — different platforms, same idea. TrustedSkills calls them "skills"; ChatGPT called them "plugins". You'll use all three terms depending on which docs you're reading.</p>
</div>

<p class="article-intro">I spent my first week with Claude Desktop genuinely confused about whether I needed an "MCP server", a "skill", or a "plugin". Turns out they're all related — but not identical. Here's the breakdown I wish I'd had on day one.</p>

<h2>MCP vs Skills vs Plugins AI: The Core Distinction</h2>
<p>Three terms, one ecosystem. Here's what each actually means:</p>
<ul>
  <li><strong>MCP</strong> is a <em>protocol</em> — the standard that defines how AI agents communicate with external tools</li>
  <li><strong>Skills</strong> are <em>packages</em> — installable capabilities that use MCP under the hood</li>
  <li><strong>Plugins</strong> are <em>the same thing as skills</em> — just a different word from a different era</li>
</ul>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>A client asked us to add a database skill to their Claude Code setup. Their developer called it an "MCP server", their product manager called it a "plugin", and our documentation called it a "skill". All three were correct — they were just describing different layers of the same thing. Once we aligned on that, the confusion evaporated.</p>
</div>

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
        <td>JSON-RPC over stdio or SSE</td>
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
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"What is npx MCP Server? Why Every MCP Config Uses It","description":"What is npx MCP server — how it runs packages without installing globally, and why every MCP config uses npx -y.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>npx</strong> runs an npm package without a permanent global install. Every MCP config uses <code>npx -y</code> because it lets your AI client launch skills automatically — no manual setup, always fresh, works on any machine with Node.js. The <code>-y</code> flag just skips the "are you sure?" prompt.</p>
</div>

<p class="article-intro">When I first saw <code>"command": "npx", "args": ["-y", "@some/package"]</code> in an MCP config, I had no idea what npx was doing. Why not just install the package? Why the <code>-y</code>? Here's the full story — shorter than you'd think.</p>

<h2>The Problem npx Solves for MCP Servers</h2>
<p>Old way: install globally, then run. <code>npm install -g weather-server</code>, then <code>weather-server</code>. Works fine — but it means every machine needs that pre-install step, version conflicts become a nightmare, and things quietly go stale.</p>
<p>npx skips all of that. It downloads the package, runs it, caches it locally. No global install. No cleanup. No version drift.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We onboarded a team of 8 developers onto a shared MCP setup. Without npx, everyone would've needed to manually run <code>npm install -g</code> for each skill before Claude Code would work. With npx in the config, they cloned the repo, opened the project, and their AI tools just worked. Zero extra setup steps.</p>
</div>

<h2>The Vending Machine Analogy</h2>
<p>Global install = buying a snack and storing it in your pantry. Always available, but takes up permanent space and eventually goes stale.</p>
<p>npx = vending machine. You get exactly what you need, right now, fresh. Nothing left behind.</p>

<h2>What npx Actually Does (Step by Step)</h2>
<p>When Claude Desktop runs <code>npx @trustedskills/weather-mcp</code>:</p>
<ol>
  <li>Checks the local cache — is this package already downloaded?</li>
  <li>If not: fetches the latest version from npm</li>
  <li>Runs it immediately</li>
  <li>Caches it — so next time it's instant</li>
</ol>
<p>That's it. No installation prompt, no PATH changes, nothing permanent.</p>

<h2>Why <code>-y</code>? That One Flag Explained</h2>
<p>Without <code>-y</code>, npx asks you to confirm before downloading a new package:</p>
<pre><code class="language-bash">npx @trustedskills/weather-mcp
# Need to install the following packages:
#   @trustedskills/weather-mcp
# Ok to proceed? (y)</code></pre>
<p>That's fine when you're sitting at a terminal. But MCP servers launch automatically in the background — there's no human there to type "y". So you add <code>-y</code> and it skips the prompt entirely:</p>
<pre><code class="language-bash">npx -y @trustedskills/weather-mcp
# Runs immediately. No questions asked.</code></pre>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>A common support question we see: "My skill isn't starting up." Nine times out of ten, the <code>-y</code> flag is missing. Claude Desktop launches the server, npx waits for a "y" that never comes, and the server quietly times out. Add the <code>-y</code> and it works first time.</p>
</div>

<h2>A Real MCP Config, Dissected</h2>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>
<ul>
  <li><code>"command": "npx"</code> — run npx</li>
  <li><code>"-y"</code> — auto-confirm any install prompt</li>
  <li><code>"@trustedskills/weather-mcp"</code> — the package to run</li>
</ul>
<p>That's the whole thing. Three fields, one working MCP skill.</p>

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
  <li><strong>Linux:</strong> <code>sudo apt install nodejs npm</code> or use <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a></li>
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
<p>No — it caches packages locally after the first download. Subsequent runs are fast. The cache expires periodically, which is actually useful: you automatically get updates when the skill author publishes a new version.</p>

<h3>What does npx -y do in an MCP config?</h3>
<p>The <code>-y</code> flag auto-answers "yes" to any install confirmation prompts. Without it, npx waits for user input before downloading a new package — which breaks automated launches from Claude Desktop or Claude Code.</p>

<h3>Can I pin a specific version with npx?</h3>
<p>Yes. Use the <code>@version</code> syntax: <code>npx -y @trustedskills/weather-mcp@1.2.0</code>. Good for production setups where you want reproducible behaviour and don't want surprise updates.</p>

<h3>What if npx isn't found on my system?</h3>
<p>Install or reinstall Node.js from nodejs.org. npx has been bundled with Node since v5.2.0. On Windows, make sure you checked "Add to PATH" during installation.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Does npx download the package every single time?","acceptedAnswer":{"@type":"Answer","text":"No — it caches packages locally. Subsequent runs are fast. The cache expires periodically so you get updates automatically."}},{"@type":"Question","name":"What does npx -y do in an MCP config?","acceptedAnswer":{"@type":"Answer","text":"The -y flag auto-answers yes to install prompts. Without it, npx waits for user input, which breaks automated launches."}},{"@type":"Question","name":"Can I pin a specific version with npx?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use npx -y @trustedskills/weather-mcp@1.2.0 to pin to a specific version."}},{"@type":"Question","name":"What if npx isn't found on my system?","acceptedAnswer":{"@type":"Answer","text":"Install Node.js from nodejs.org. npx is bundled with Node since v5.2.0."}}]}
</script>
    `,
  },

  {
    slug: ['concepts', 'how-skills-and-mcp-work-together'],
    title: 'How MCP Skills Work Together with AI Agents: Full Guide',
    description: 'How MCP skills work together with AI agents — full lifecycle from finding a skill in the registry to your AI agent calling its tools, with architecture diagrams and real-world examples.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How MCP Skills Work Together with AI Agents: Full Guide","description":"How MCP skills work together with AI agents — full lifecycle from skill discovery to tool calling.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Here's how it works: you find a skill, add its config to your AI client, the client launches the skill as a background subprocess, and the AI model calls that subprocess's tools when your conversation needs them. Communication is JSON-RPC over stdio — no ports, no network config, just pipes between processes.</p>
</div>

<p class="article-intro">Understanding how MCP skills work under the hood changed how I debug problems and design setups. You don't need to know this to use skills — but once you do, you'll never be confused by a broken config again.</p>

<h2>The Architecture in One Diagram</h2>
<pre><code class="language-bash">┌─────────────────────────────────────────────────────────┐
│                    TrustedSkills Registry                │
│  skill: weather · npm: @trustedskills/weather-mcp       │
└───────────────────────┬─────────────────────────────────┘
                        │ (1) You discover the skill
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  AI Client Config                        │
│  { "mcpServers": { "weather": {                         │
│      "command": "npx",                                  │
│      "args": ["-y", "@trustedskills/weather-mcp"] } } } │
└───────────────────────┬─────────────────────────────────┘
                        │ (2) Client starts MCP server as subprocess
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  MCP Server Process                      │
│  npx @trustedskills/weather-mcp                         │
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

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We built an MCP skill for a legal team that pulled case precedents from their internal database. The AI client, the MCP server, and the database were all on the same machine — no network exposure, no firewall rules to change. The stdio-based architecture meant setup took 20 minutes instead of a day of DevOps work.</p>
</div>

<h2>The Full Lifecycle, Step by Step</h2>

<h3>Step 1: Discovery</h3>
<p>You browse TrustedSkills, find a skill that does what you need. Each listing shows you the tools it exposes and the exact config JSON to copy.</p>

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
        <td>Unverified / Community / Verified / Featured</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How the Protocol Works (the Short Version)</h2>
<p>MCP uses JSON-RPC 2.0 over stdio. No HTTP server. No ports. The client writes JSON to the server's stdin; the server writes JSON to its stdout. That's the whole protocol.</p>
<p>It's simple by design — works the same on Mac, Windows, and Linux. No firewall rules, no network configuration, no port conflicts. The subprocess is isolated to process-level communication only.</p>
<p>Some advanced setups use SSE (Server-Sent Events) over HTTP for remote MCP servers, but that's uncommon for skills installed from TrustedSkills.</p>

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

<h3>Can MCP skills access my local files?</h3>
<p>Only if they're designed to. A filesystem skill can access files; a weather skill can't. Each skill only does what its tools define. This is why checking a skill's verification status matters before installing it.</p>

<h3>What happens when an MCP server crashes?</h3>
<p>Claude will stop offering that skill's tools and may show an error. Restart your AI client to relaunch the server. Claude Desktop shows crash details in Settings → Developer → MCP Logs.</p>

<h3>Can I run many MCP skills simultaneously?</h3>
<p>Yes. Each skill runs as a separate subprocess. You can have dozens running at once — Claude picks whichever tools are most relevant for each query.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does Claude know when to use an MCP tool?","acceptedAnswer":{"@type":"Answer","text":"Tool definitions include a name and description. Claude reads those and decides when a tool is relevant. Better descriptions = more reliable tool usage."}},{"@type":"Question","name":"Can MCP skills access my local files?","acceptedAnswer":{"@type":"Answer","text":"Only if designed to. Each skill only does what its tools define. Check verification status before installing."}},{"@type":"Question","name":"What happens when an MCP server crashes?","acceptedAnswer":{"@type":"Answer","text":"Claude stops offering that skill's tools. Restart your AI client to relaunch. Check Settings → Developer → MCP Logs for details."}},{"@type":"Question","name":"Can I run many MCP skills simultaneously?","acceptedAnswer":{"@type":"Answer","text":"Yes. Each skill is a separate subprocess. Claude picks the most relevant tools for each query."}}]}
</script>
    `,
  },

  // ─── CLAUDE DESKTOP ─────────────────────────────────────────────────────────
  {
    slug: ['claude-desktop', 'mac'],
    title: 'Install MCP Skills Claude Desktop Mac: Step-by-Step',
    description: 'Install MCP skills on Claude Desktop Mac with this complete step-by-step guide. Covers config file location, Node.js setup, adding skills, and troubleshooting — no coding experience needed.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Desktop Mac: Step-by-Step","description":"Install MCP skills on Claude Desktop Mac — config file location, Node.js setup, and troubleshooting.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>, add your skill inside an <code>mcpServers</code> block, save, and fully restart Claude Desktop. That's it. The skill appears in your next conversation.</p>
</div>

<p class="article-intro">Last month I helped a non-technical colleague add a calendar tool to her Claude Desktop. She'd never touched a JSON file before. Ten minutes later, Claude was pulling her meetings automatically. Here's exactly how we did it — including the part where TextEdit almost wrecked everything.</p>

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
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>
<p>Adding more skills? Just add them inside <code>mcpServers</code>, separated by commas:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    },
    "calculator": {
      "command": "npx",
      "args": ["-y", "@trustedskills/calculator-mcp"]
    }
  }
}</code></pre>
<p>Every skill's page on TrustedSkills has a "MCP Config" tab with the exact snippet to paste. You don't have to type it manually.</p>

<h2>Step 4: Save and Restart</h2>
<ol>
  <li>Save the file — <strong>⌘ + S</strong></li>
  <li>Quit Claude Desktop completely — <strong>⌘ + Q</strong> (closing the window isn't enough)</li>
  <li>Reopen Claude Desktop</li>
</ol>
<p>Claude reads the config only on startup. No restart = no new skills.</p>

<h2>Step 5: Confirm It Worked</h2>
<p>Open a new conversation. Look for the 🔨 tools icon in the input area, or just ask Claude: <em>"What tools do you have?"</em> Your skill's tools should appear in the list.</p>

<h2>Config Locations at a Glance</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Platform</th><th>Config location</th></tr>
    </thead>
    <tbody>
      <tr><td>Claude Desktop Mac</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Desktop Windows</td><td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Desktop Linux</td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Claude Code (global)</td><td><code>~/.claude/settings.json</code></td></tr>
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
  <li>Check the logs: Settings → Developer → MCP Logs</li>
</ul>

<h3>npx not found (nvm users)</h3>
<p>If you installed Node.js via nvm, Claude Desktop might not see it. Find your npx path — run <code>which npx</code> in Terminal — then use that full path as the <code>"command"</code> value in your config.</p>

<div class="tip-box">
  <strong>💡 Pro tip:</strong> Bookmark the MCP Logs page in Claude Desktop's Developer settings. When a skill breaks, that's your first stop. It shows exactly what went wrong when the server tried to start.
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
    title: 'Install MCP Skills Claude Desktop Windows: Full Guide',
    description: 'Install MCP skills on Claude Desktop Windows step-by-step. Covers the config file location, JSON format, Windows path gotchas with npx, and troubleshooting tips for getting skills working.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Desktop Windows: Full Guide","description":"Install MCP skills on Claude Desktop Windows — config location, JSON format, Windows gotchas, and troubleshooting.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open <code>%APPDATA%\Claude\claude_desktop_config.json</code>, add your skill inside <code>mcpServers</code>, save, and fully restart Claude Desktop. If npx isn't found, run <code>where npx</code> in Command Prompt to get the full path — then use that in your config.</p>
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
<pre><code class="language-bash">%APPDATA%\Claude\claude_desktop_config.json</code></pre>
<p>Open it fast: press <strong>Windows + R</strong>, type <code>%APPDATA%\Claude</code>, press Enter. Explorer opens right in the Claude config folder.</p>
<p>Or use Claude Desktop's shortcut: hamburger menu → Settings → Developer → Edit Config.</p>

<h2>Step 2: Open the Config File</h2>
<p>Right-click <code>claude_desktop_config.json</code> → Open With → Notepad or VS Code.</p>

<h3>File doesn't exist?</h3>
<ol>
  <li>Open Notepad</li>
  <li>Type <code>{}</code></li>
  <li>File → Save As → navigate to <code>%APPDATA%\Claude\</code></li>
  <li>Change "Save as type" to <strong>All Files (*.*)</strong></li>
  <li>Save as <code>claude_desktop_config.json</code></li>
</ol>

<div class="warning-box">
  <strong>⚠️ Notepad trap:</strong> If you leave "Save as type" set to "Text Documents", Notepad adds a hidden <code>.txt</code> extension. Your file becomes <code>claude_desktop_config.json.txt</code> and Claude Desktop can't find it. Always select "All Files (*.*)" first.
</div>

<h2>Step 3: Add Your Skill</h2>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>The backslash problem</h3>
<p>If you ever need a local file path in your config, Windows backslashes must be doubled in JSON. <code>C:\Users\Me\tool</code> becomes <code>C:\\\\Users\\\\Me\\\\tool</code>. For skills installed via npx, you don't need any paths — just the package name.</p>

<h3>npx not in PATH?</h3>
<p>Run this in Command Prompt:</p>
<pre><code class="language-bash">where npx
# C:\Program Files\nodejs\npx.cmd  ← use this full path</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We've seen this exact issue on almost every Windows machine where Node.js was installed using a non-standard location or an older installer that didn't add to PATH. Two minutes to find the path with <code>where npx</code>, update the config, and everything works. Don't reinstall Node — just use the full path.</p>
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
      <tr><td>Config location</td><td><code>%APPDATA%\Claude\</code></td><td><code>~/Library/Application Support/Claude/</code></td></tr>
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

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Windows?</h3>
<p>At <code>%APPDATA%\Claude\claude_desktop_config.json</code>. Press Windows+R and type <code>%APPDATA%\Claude</code> to open the folder directly.</p>

<h3>Why do I need double backslashes in JSON on Windows?</h3>
<p>Backslash is an escape character in JSON. A single <code>\</code> tells JSON "the next character is special". To represent a literal backslash, you need <code>\\</code>. For npx-based skills using package names, this doesn't matter — no paths involved.</p>

<h3>Claude Desktop won't find npx — how do I fix it on Windows?</h3>
<p>Run <code>where npx</code> in Command Prompt to get the full path, then use that as the <code>"command"</code> value. Remember to double every backslash in the JSON string.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Windows?","acceptedAnswer":{"@type":"Answer","text":"At %APPDATA%\\Claude\\claude_desktop_config.json. Press Windows+R and type %APPDATA%\\Claude to open it."}},{"@type":"Question","name":"Why do I need double backslashes in JSON on Windows?","acceptedAnswer":{"@type":"Answer","text":"Backslash is an escape character in JSON. Use \\\\ for a literal backslash. For npx package names this doesn't apply."}},{"@type":"Question","name":"Claude Desktop won't find npx on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run 'where npx' to get the full path, use it as the command value with doubled backslashes."}}]}
</script>
    `,
  },

  {
    slug: ['claude-desktop', 'linux'],
    title: 'Install MCP Claude Desktop Linux: Config & Setup Guide',
    description: 'Install MCP on Claude Desktop Linux — config file path at ~/.config/Claude/, NVM workarounds, and Linux-specific tips for successfully adding MCP skills to your Claude Desktop setup.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Claude Desktop Linux: Config & Setup Guide","description":"Install MCP Claude Desktop Linux — config path, NVM fixes, and Linux-specific setup tips.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>~/.config/Claude/claude_desktop_config.json</code>, add skills under <code>mcpServers</code>, restart Claude Desktop. The nvm PATH issue is the most common problem on Linux — fix it by using the full path to npx or adding nvm to <code>~/.profile</code>.</p>
</div>

<p class="article-intro">Linux adds one gotcha that catches almost everyone who uses nvm: Claude Desktop launches as a non-interactive process and doesn't inherit the shell PATH where nvm lives. Here's how to navigate that — plus the rest of the setup.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Claude Desktop (AppImage or .deb from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a>)</li>
  <li>Node.js: <code>sudo apt install nodejs npm</code> or via <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a> (recommended)</li>
</ul>

<h2>Config File Location</h2>
<p>Linux follows the XDG spec:</p>
<pre><code class="language-bash">~/.config/Claude/claude_desktop_config.json</code></pre>

<h2>Setting Up</h2>
<pre><code class="language-bash">mkdir -p ~/.config/Claude
nano ~/.config/Claude/claude_desktop_config.json</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
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
      <tr><td>Windows</td><td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td></tr>
    </tbody>
  </table>
</div>

<h2>The nvm Problem — and Two Ways to Fix It</h2>
<p>If you installed Node.js via nvm, you've probably noticed: nvm works great in your terminal, but Claude Desktop acts like Node doesn't exist. That's because nvm adds npx to your shell's PATH — but only for interactive shells. Claude Desktop launches non-interactively and never runs those shell initialisation scripts.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We set up MCP skills for a developer running Ubuntu 22.04 with nvm. Claude Desktop kept logging "npx: command not found". Adding nvm to <code>~/.profile</code> fixed it for him. But on a second machine with a different login manager, <code>~/.profile</code> wasn't being sourced at all — full path to npx was the only reliable fix. When in doubt, use the full path.</p>
</div>

<h3>Fix Option 1: Full path (most reliable)</h3>
<pre><code class="language-bash">which npx
# /home/yourname/.nvm/versions/node/v20.11.0/bin/npx</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "/home/yourname/.nvm/versions/node/v20.11.0/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
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

<h2>Checking Logs</h2>
<pre><code class="language-bash">tail -f ~/.config/Claude/logs/mcp*.log</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config on Linux?</h3>
<p>At <code>~/.config/Claude/claude_desktop_config.json</code>, following XDG spec. Create the directory first: <code>mkdir -p ~/.config/Claude</code>.</p>

<h3>Why can't Claude Desktop find npx on Linux?</h3>
<p>Almost always nvm. Claude Desktop launches non-interactively and doesn't inherit the shell PATH where nvm puts its binaries. Use the full path to npx from <code>which npx</code>, or add nvm init to <code>~/.profile</code>.</p>

<h3>Does Claude Desktop work on all Linux distros?</h3>
<p>The AppImage works on most distros. The .deb is for Ubuntu/Debian. MCP config setup is identical across all distributions.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config on Linux?","acceptedAnswer":{"@type":"Answer","text":"~/.config/Claude/claude_desktop_config.json. Create the directory with mkdir -p ~/.config/Claude."}},{"@type":"Question","name":"Why can't Claude Desktop find npx on Linux?","acceptedAnswer":{"@type":"Answer","text":"Almost always nvm. Claude Desktop launches non-interactively. Use the full path from 'which npx'."}},{"@type":"Question","name":"Does Claude Desktop work on all Linux distros?","acceptedAnswer":{"@type":"Answer","text":"The AppImage works on most distros. The .deb is for Ubuntu/Debian. MCP config setup is identical."}}]}
</script>
    `,
  },

  // ─── CLAUDE CODE ────────────────────────────────────────────────────────────
  {
    slug: ['claude-code', 'beginner-guide'],
    title: 'Claude Code VS Code MCP Setup: Complete Beginner\'s Guide',
    description: 'Claude Code VS Code MCP setup guide for beginners — install the extension, configure MCP skills in settings.json, reload to apply changes, and verify your tools are working. No experience needed.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code VS Code MCP Setup: Complete Beginner's Guide","description":"Claude Code VS Code MCP setup for beginners — install, configure, and verify MCP skills.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Install the Claude Code extension from VS Code marketplace, then add skills to <code>~/.claude/settings.json</code> (global) or <code>.claude/settings.json</code> in your project. Use <code>claude mcp add weather -- npx -y @trustedskills/weather-mcp</code> to skip manual JSON editing. Run <code>/tools</code> inside Claude to verify.</p>
</div>

<p class="article-intro">When I switched from using Claude Desktop to Claude Code for development work, the biggest surprise was how much better the MCP integration is for coding workflows. Files, terminals, and tools — all in one place. Setting it up took me about five minutes once I understood where the config lives.</p>

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
<p>You can use Claude Code as a VS Code sidebar panel — or just run <code>claude</code> in your terminal. Both use the same config files and the same MCP skills. This guide covers both.</p>

<h2>Where MCP Config Lives in Claude Code</h2>

<h3>Global config — for personal tools</h3>
<pre><code class="language-bash"># Mac / Linux
~/.claude/settings.json

# Windows
%USERPROFILE%\.claude\settings.json</code></pre>
<p>Skills here are available in every project you open.</p>

<h3>Project config — for team tools</h3>
<pre><code class="language-bash">.claude/settings.json  # in your project root</code></pre>
<p>Skills here are only available in that project — but you can commit the file to git.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>A team we worked with added a Postgres MCP skill to their project config and committed it. When a new developer joined and cloned the repo, they had full database query capabilities in Claude Code within two minutes — no setup doc to follow, no "have you installed X?" messages. The config was just there.</p>
</div>

<h2>Adding a Skill: Two Methods</h2>

<h3>Method A: CLI (fastest)</h3>
<pre><code class="language-bash"># Install Claude Code CLI if you haven't
npm install -g @anthropic-ai/claude-code

# Add a skill globally
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Add to current project only
claude mcp add weather --project -- npx -y @trustedskills/weather-mcp

# See what's installed
claude mcp list</code></pre>

<h3>Method B: Edit the JSON directly</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Reloading After Changes</h2>
<ul>
  <li><strong>VS Code:</strong> <strong>Ctrl+Shift+P</strong> → "Claude Code: Restart"</li>
  <li><strong>Terminal:</strong> type <code>/quit</code> then rerun <code>claude</code></li>
</ul>

<h2>Verify It Worked</h2>
<pre><code class="language-bash">claude mcp list       # shows configured skills
claude                # start a session
/tools                # lists available tools inside Claude</code></pre>

<div class="tip-box">
  <strong>💡 Shortcut:</strong> <code>claude mcp add</code> not only writes to your config — it also reloads the MCP connection immediately. Faster than editing JSON and restarting.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I need both Claude Desktop and Claude Code?</h3>
<p>No — they serve different purposes. Claude Desktop is for general AI tasks; Claude Code is for active software development. Many people use both, but you don't need to.</p>

<h3>Where does Claude Code store MCP settings?</h3>
<p>Global settings at <code>~/.claude/settings.json</code>. Project settings at <code>.claude/settings.json</code> in your project root. The CLI command <code>claude mcp add</code> writes to global by default.</p>

<h3>Can I use the same skills in Claude Code and Claude Desktop?</h3>
<p>Yes — MCP skills are platform-agnostic. You just add the same config entry to both places. Each editor manages its own config file.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need both Claude Desktop and Claude Code?","acceptedAnswer":{"@type":"Answer","text":"No. Claude Desktop is for general AI tasks; Claude Code is for active development. Use whichever fits your workflow."}},{"@type":"Question","name":"Where does Claude Code store MCP settings?","acceptedAnswer":{"@type":"Answer","text":"Global settings at ~/.claude/settings.json. Project settings at .claude/settings.json in your project root."}},{"@type":"Question","name":"Can I use the same skills in Claude Code and Claude Desktop?","acceptedAnswer":{"@type":"Answer","text":"Yes — add the same config entry to both. Each editor manages its own config file separately."}}]}
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
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code MCP Global vs Project Config: When to Use Each","description":"Claude Code MCP global vs project config — when to use each and how to share skills with your team.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Global config (<code>~/.claude/settings.json</code>) = personal tools, your credentials, things you want everywhere. Project config (<code>.claude/settings.json</code>) = team tools, stuff you'll commit to git. Never put API keys directly in project config — use environment variable references instead.</p>
</div>

<p class="article-intro">Here's the question I get most from teams adopting Claude Code: "Where should I put the Postgres skill?" The answer depends on who needs it and whether there are secrets involved. Let me walk through the logic.</p>

<h2>The Two Locations</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Config type</th><th>Mac/Linux path</th><th>Windows path</th><th>Scope</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Global</strong></td>
        <td><code>~/.claude/settings.json</code></td>
        <td><code>%USERPROFILE%\\.claude\\settings.json</code></td>
        <td>All projects, this machine only</td>
      </tr>
      <tr>
        <td><strong>Project</strong></td>
        <td><code>.claude/settings.json</code> (project root)</td>
        <td><code>.claude\\settings.json</code> (project root)</td>
        <td>This project only — committable to git</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Global Config — Your Personal Toolkit</h2>
<p>Think of global config as your personal workspace. Anything in here follows you across every project you open with Claude Code.</p>
<p><strong>Good fits for global config:</strong></p>
<ul>
  <li>Weather, calculator, notes — tools you want everywhere</li>
  <li>Web search with your personal API key</li>
  <li>GitHub tool with your personal access token</li>
  <li>Any tool using credentials that are <em>yours</em>, not the project's</li>
</ul>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    },
    "web-search": {
      "command": "npx",
      "args": ["-y", "@trustedskills/web-search-mcp"],
      "env": { "SEARCH_API_KEY": "your-personal-key" }
    }
  }
}</code></pre>

<h2>Project Config — Team Tools via Git</h2>
<p>Project config's superpower is that it lives in your repo. Commit it, push it, and every team member who clones the repo has the same tools automatically.</p>
<p><strong>Good fits for project config:</strong></p>
<ul>
  <li>Database tools pointing to the project's dev DB</li>
  <li>Project-specific validators or code generators</li>
  <li>Any tool that should be the same for all developers on the team</li>
</ul>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We added a Supabase MCP skill to a startup's project config. Every new hire cloned the repo and immediately had AI-assisted database queries, schema exploration, and migration help inside Claude Code — with zero additional setup. The client calculated it saved about 30 minutes of onboarding per developer.</p>
</div>

<h3>Project config example</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@trustedskills/postgres-mcp"],
      "env": { "DATABASE_URL": "${DATABASE_URL}" }
    }
  }
}</code></pre>

<p>Each developer sets their own <code>DATABASE_URL</code> in their shell or a gitignored <code>.env</code> file. The config commits safely — no actual credentials in the repo.</p>

<div class="warning-box">
  <strong>⚠️ Don't commit secrets:</strong> Once a key is in git history, it's compromised — even if you delete it later. Always use <code>${VAR_NAME}</code> references and set the actual values locally. Add <code>.env</code> to your <code>.gitignore</code>.
</div>

<h2>Global vs Project: The Decision Matrix</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th></th><th>Global Config</th><th>Project Config</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Team sharing</strong></td><td>Not possible (per-machine)</td><td>Easy via git commit</td></tr>
      <tr><td><strong>Personal credentials</strong></td><td>Safe — never committed</td><td>Risky — don't put secrets here</td></tr>
      <tr><td><strong>Project-specific tools</strong></td><td>Clutters every project</td><td>Perfect fit</td></tr>
      <tr><td><strong>Priority when both exist</strong></td><td>Overridden by project config</td><td>Takes precedence</td></tr>
    </tbody>
  </table>
</div>

<h2>The Decision Checklist</h2>
<ol>
  <li>Should the whole team have this? → Project config</li>
  <li>Does it use your personal credentials? → Global config</li>
  <li>Do you want it in every project? → Global config</li>
  <li>Is it specific to this project's infrastructure? → Project config</li>
</ol>

<div class="tip-box">
  <strong>💡 Priority rule:</strong> When the same server name exists in both configs, project config wins. This lets teams override a developer's global defaults for a specific project — useful when you need a project-specific version of a tool.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What happens if the same skill is in both global and project config?</h3>
<p>Project config takes precedence. The project version is used when you're working in that project. This lets you override global defaults on a per-project basis.</p>

<h3>Can I commit the project config to git without exposing secrets?</h3>
<p>Yes — use <code>${VAR_NAME}</code> references and keep actual values in your local shell environment or a gitignored <code>.env</code> file. The config file itself contains no secrets.</p>

<h3>How do I add a project-scoped skill via the CLI?</h3>
<p>Use the <code>--project</code> flag: <code>claude mcp add my-tool --project -- npx -y @package/name</code>. This writes to <code>.claude/settings.json</code> in your current directory.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What happens if the same skill is in both global and project config?","acceptedAnswer":{"@type":"Answer","text":"Project config takes precedence when you're in that project."}},{"@type":"Question","name":"Can I commit project config without exposing secrets?","acceptedAnswer":{"@type":"Answer","text":"Yes — use ${VAR_NAME} references. Set actual values in your local shell or a gitignored .env file."}},{"@type":"Question","name":"How do I add a project-scoped skill via CLI?","acceptedAnswer":{"@type":"Answer","text":"claude mcp add my-tool --project -- npx -y @package/name"}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'mac'],
    title: 'Install MCP Skills Claude Code Mac: CLI & Manual Methods',
    description: 'Install MCP skills for Claude Code on Mac using the CLI or manual config editing. Covers global vs project scope, NVM path fixes, and how to verify tools are loading correctly.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Code Mac: CLI & Manual Methods","description":"Install MCP skills for Claude Code on Mac — CLI, manual config, NVM fixes, and verification.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run <code>claude mcp add weather -- npx -y @trustedskills/weather-mcp</code> — done. Or edit <code>~/.claude/settings.json</code> manually. If you're using nvm and Claude can't find npx, use the full path from <code>which npx</code>.</p>
</div>

<p class="article-intro">When I set this up on my Mac, I used the CLI method and had a working skill in about 45 seconds. The manual method is also fine — good to know for when you want to add environment variables or tweak things the CLI doesn't expose easily.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed — verify with <code>node --version</code></li>
  <li>Claude Code CLI: <code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: CLI (Recommended)</h2>
<pre><code class="language-bash"># Global — available in every project
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Project-scoped — current directory only
claude mcp add weather --project -- npx -y @trustedskills/weather-mcp

# With an env variable (API key, etc.)
claude mcp add my-api -e API_KEY=yourkey -- npx -y @trustedskills/my-api-mcp

# See what's installed
claude mcp list

# Remove something
claude mcp remove weather</code></pre>

<h2>Method 2: Manual Config Edit</h2>
<pre><code class="language-bash">mkdir -p ~/.claude
code ~/.claude/settings.json   # VS Code
# or
open -e ~/.claude/settings.json  # TextEdit (use Format → Plain Text first)</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>The nvm Problem on Mac</h2>
<p>nvm is great for managing Node versions — but Claude Code sometimes can't find the npx that nvm manages, because nvm configures PATH only for interactive shell sessions.</p>
<pre><code class="language-bash"># Find the full path to npx
which npx
# /Users/yourname/.nvm/versions/node/v20.11.0/bin/npx</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "/Users/yourname/.nvm/versions/node/v20.11.0/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>The most reliable fix we've found for the nvm issue: create a symlink from a stable location to the current nvm npx. <code>ln -sf $(which npx) /usr/local/bin/npx</code>. Now you can use <code>/usr/local/bin/npx</code> in all your configs — and it automatically follows whichever nvm version you switch to.</p>
</div>

<h2>Verify It Worked</h2>
<pre><code class="language-bash">claude mcp list   # see configured skills
claude            # start a session
/tools            # list available tools</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>CLI vs manual editing — which should I use?</h3>
<p>CLI for quick additions — it handles JSON formatting and reloads the connection automatically. Manual editing for complex configs with multiple env variables, specific version pins, or when you want to review exactly what's stored.</p>

<h3>How do I add an API key to a skill on Mac?</h3>
<p>With the CLI: <code>claude mcp add my-skill -e API_KEY=abc123 -- npx -y @package/name</code>. Manually: add an <code>"env"</code> block to the skill's entry in settings.json.</p>

<h3>How do I know a skill loaded successfully?</h3>
<p>Run <code>claude mcp list</code> to see configured skills. Start Claude with <code>claude</code> and type <code>/tools</code> — if the skill's tools appear, it loaded. If they don't, something went wrong at launch.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"CLI vs manual editing — which should I use?","acceptedAnswer":{"@type":"Answer","text":"CLI for quick additions. Manual editing for complex configs with env variables or version pins."}},{"@type":"Question","name":"How do I add an API key to a skill on Mac?","acceptedAnswer":{"@type":"Answer","text":"CLI: claude mcp add my-skill -e API_KEY=abc123 -- npx -y @package/name. Or add an env block in settings.json manually."}},{"@type":"Question","name":"How do I know a skill loaded successfully?","acceptedAnswer":{"@type":"Answer","text":"Run 'claude mcp list' to see configured skills, start Claude and type /tools to see loaded tools."}}]}
</script>
    `,
  },

  {
    slug: ['claude-code', 'windows'],
    title: 'Install MCP Skills Claude Code Windows: CLI & Config Guide',
    description: 'Install MCP skills for Claude Code on Windows using the CLI or manual config editing. Covers the settings.json location, Windows path formatting, and PowerShell commands to get skills working.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Code Windows: CLI & Config Guide","description":"Install MCP skills for Claude Code on Windows — CLI, settings.json location, and path formatting.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open PowerShell and run <code>claude mcp add weather -- npx -y @trustedskills/weather-mcp</code>. Or edit <code>%USERPROFILE%\\.claude\\settings.json</code> manually. If npx isn't found, get the full path with <code>where npx</code> and use that.</p>
</div>

<p class="article-intro">Setting this up on Windows is straightforward once you know where the config lives and how to handle the occasional "npx not found" situation. Here's exactly what to do.</p>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (check "Add to PATH" during install)</li>
  <li>Claude Code CLI in PowerShell: <code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: CLI</h2>
<pre><code class="language-bash"># Add a skill globally
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# List installed skills
claude mcp list

# Remove
claude mcp remove weather</code></pre>

<h2>Method 2: Manual Config</h2>
<p>Config location on Windows:</p>
<pre><code class="language-bash">%USERPROFILE%\.claude\settings.json</code></pre>

<pre><code class="language-bash"># Open in VS Code via PowerShell
code $env:USERPROFILE\.claude\settings.json</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>When npx Isn't in PATH</h2>
<pre><code class="language-bash"># PowerShell — find full path
Get-Command npx | Select-Object -ExpandProperty Source
# C:\Program Files\nodejs\npx.cmd</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="warning-box">
  <strong>⚠️ JSON backslash rule:</strong> In JSON strings, every backslash needs to be doubled. <code>C:\Program Files</code> becomes <code>C:\\\\Program Files</code> in your JSON config.
</div>

<h2>Verify</h2>
<pre><code class="language-bash">claude mcp list
claude
/tools</code></pre>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>A Windows developer we supported had npx working perfectly in PowerShell but Claude Code couldn't find it. The issue: Node.js was installed for "current user only" rather than "all users", putting it in a PATH that Claude Code's process didn't inherit. Installing Node.js system-wide (or using the full path) fixed it immediately.</p>
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is Claude Code's settings.json on Windows?</h3>
<p>At <code>%USERPROFILE%\.claude\settings.json</code>. In PowerShell, access it with <code>$env:USERPROFILE\.claude\settings.json</code>.</p>

<h3>npx not found in Claude Code on Windows — quick fix?</h3>
<p>Run <code>Get-Command npx | Select-Object -ExpandProperty Source</code> in PowerShell to get the full path. Use that path as the <code>"command"</code> value, doubling all backslashes.</p>

<h3>Can I run Claude Code in WSL?</h3>
<p>Yes. In WSL, use <code>~/.claude/settings.json</code> and Linux-style paths. WSL and native Windows Claude Code have separate configs — they don't share skills.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is Claude Code's settings.json on Windows?","acceptedAnswer":{"@type":"Answer","text":"At %USERPROFILE%\\.claude\\settings.json. Access with $env:USERPROFILE\\.claude\\settings.json in PowerShell."}},{"@type":"Question","name":"npx not found in Claude Code on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run 'Get-Command npx | Select-Object -ExpandProperty Source' to get the full path. Use it as the command value with doubled backslashes."}},{"@type":"Question","name":"Can I run Claude Code in WSL?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use ~/.claude/settings.json and Linux paths. WSL and Windows have separate configs."}}]}
</script>
    `,
  },

  // ─── CURSOR ─────────────────────────────────────────────────────────────────
  {
    slug: ['cursor', 'mac'],
    title: 'Install MCP Skills Cursor Mac: Config Guide & Reload Tips',
    description: 'Install MCP skills on Cursor Mac — find the ~/.cursor/mcp.json config location, add skills in JSON format, reload Cursor to apply changes, and verify tools are working in the AI assistant.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Cursor Mac: Config Guide & Reload Tips","description":"Install MCP skills on Cursor Mac — ~/.cursor/mcp.json location, JSON format, reload, and verification.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>~/.cursor/mcp.json</code>, add skills under <code>mcpServers</code>, then reload via Settings → Features → MCP Servers → restart button. Open Cursor Chat (⌘+L) and ask "what tools do you have?" to confirm it worked.</p>
</div>

<p class="article-intro">Cursor's MCP integration is solid — it has a built-in UI for managing servers and shows status indicators right in the settings panel. Setting it up is very similar to Claude Desktop, just in a different file location.</p>

<h2>Config File Locations</h2>
<pre><code class="language-bash"># Global (all projects)
~/.cursor/mcp.json

# Project-specific
.cursor/mcp.json   # in project root</code></pre>

<h2>Creating and Editing the Config</h2>
<pre><code class="language-bash">mkdir -p ~/.cursor
code ~/.cursor/mcp.json</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Multiple skills</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@trustedskills/github-mcp"],
      "env": { "GITHUB_TOKEN": "your-token" }
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
      <tr><td>Global config</td><td><code>~/.cursor/mcp.json</code></td><td><code>~/.claude/settings.json</code></td></tr>
      <tr><td>Project config</td><td><code>.cursor/mcp.json</code></td><td><code>.claude/settings.json</code></td></tr>
      <tr><td>Config format key</td><td><code>mcpServers</code></td><td><code>mcpServers</code></td></tr>
      <tr><td>CLI to add skills</td><td>Manual only</td><td><code>claude mcp add</code></td></tr>
      <tr><td>Status UI</td><td>Settings → Features → MCP</td><td><code>claude mcp list</code></td></tr>
    </tbody>
  </table>
</div>

<h2>Reloading Without Restarting</h2>
<p>You don't have to fully restart Cursor after every change. Go to <strong>Settings (⌘+,) → Features → MCP Servers</strong> and click the refresh button next to your server. It reconnects without touching the rest of the editor.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>Cursor's MCP status UI (the green/red dot in Settings → Features → MCP Servers) has saved us a lot of debugging time. When a skill isn't working, we check there first — a red dot tells you the server failed to start, and the error message usually points directly at the problem. Beats reading log files.</p>
</div>

<h2>Verify It Worked</h2>
<p>Open Cursor Chat (<strong>⌘+L</strong>) and ask:</p>
<pre><code class="language-bash">What tools do you have available?</code></pre>
<p>If the skill loaded, Cursor will list the tools. If it didn't, there'll be no mention of them — check the status UI.</p>

<div class="tip-box">
  <strong>💡 For nvm users:</strong> Same issue as Claude Desktop and Claude Code — use the full path to npx from <code>which npx</code> instead of just <code>"npx"</code>.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Cursor MCP config on Mac?</h3>
<p><code>~/.cursor/mcp.json</code> for global config. Project-specific: <code>.cursor/mcp.json</code> in your project root. Both use the same JSON format.</p>

<h3>How do I reload MCP skills without restarting Cursor?</h3>
<p>Settings (⌘+,) → search "MCP" → go to MCP Servers → click the refresh button next to the server. No full editor restart needed.</p>

<h3>Can I use Cursor and Claude Code MCP skills together?</h3>
<p>They're separate configs — <code>~/.cursor/mcp.json</code> for Cursor, <code>~/.claude/settings.json</code> for Claude Code. The same skill will work in both; you just need to add the config entry to both files.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Cursor MCP config on Mac?","acceptedAnswer":{"@type":"Answer","text":"~/.cursor/mcp.json for global. .cursor/mcp.json in project root for project-specific."}},{"@type":"Question","name":"How do I reload MCP skills without restarting Cursor?","acceptedAnswer":{"@type":"Answer","text":"Settings → search MCP → MCP Servers → click the refresh button next to the server."}},{"@type":"Question","name":"Can I use Cursor and Claude Code MCP skills together?","acceptedAnswer":{"@type":"Answer","text":"Yes, but they're separate configs. Add the same entry to both ~/.cursor/mcp.json and ~/.claude/settings.json."}}]}
</script>
    `,
  },

  {
    slug: ['cursor', 'windows'],
    title: 'Install MCP Skills Cursor Windows: Config & Path Guide',
    description: 'Install MCP skills for Cursor on Windows — config file location at %USERPROFILE%\\.cursor\\mcp.json, JSON format, Windows path gotchas with npx, and how to reload and verify skills.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Cursor Windows: Config & Path Guide","description":"Install MCP skills for Cursor on Windows — config location, JSON format, path issues, and verification.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Edit <code>%USERPROFILE%\\.cursor\\mcp.json</code>, add skills under <code>mcpServers</code>. If npx isn't found, get the full path with <code>Get-Command npx</code> in PowerShell. Reload via Settings → MCP Servers or just restart Cursor.</p>
</div>

<p class="article-intro">Same concept as the Mac guide — different file location, one Windows-specific quirk with backslashes. Here's the whole thing.</p>

<h2>Config File Location</h2>
<pre><code class="language-bash">%USERPROFILE%\.cursor\mcp.json
# Usually: C:\Users\YourName\.cursor\mcp.json</code></pre>

<h2>Creating the Config</h2>
<pre><code class="language-bash"># PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor"
code "$env:USERPROFILE\.cursor\mcp.json"</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>npx Not in PATH? Get the Full Path</h2>
<pre><code class="language-bash"># PowerShell
Get-Command npx | Select-Object -ExpandProperty Source
# C:\Program Files\nodejs\npx.cmd</code></pre>

<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="warning-box">
  <strong>⚠️ Backslash doubling:</strong> In JSON, every backslash must be doubled. <code>C:\Program Files\nodejs\npx.cmd</code> becomes <code>C:\\\\Program Files\\\\nodejs\\\\npx.cmd</code>.
</div>

<h2>Reloading Cursor</h2>
<ul>
  <li>Settings (Ctrl+,) → search "MCP" → click refresh next to your server</li>
  <li>Or just close and reopen Cursor</li>
</ul>

<h2>Verifying It Works</h2>
<p>Open Cursor Chat (Ctrl+L) and ask: <em>"What tools do you have?"</em></p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>On a Windows machine managed by corporate IT, npx was installed but blocked from running in certain execution contexts. We worked around it by installing the skill globally first (<code>npm install -g @trustedskills/weather-mcp</code>) and then using the installed binary name directly as the command instead of npx. Not pretty, but it worked.</p>
</div>

<div class="tip-box">
  <strong>💡 Check the status dot:</strong> In Cursor's Settings → Features → MCP Servers, there's a green/red status indicator for each server. Red means it failed to start. Click to see the error. Much faster than guessing what went wrong.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is Cursor's MCP config on Windows?</h3>
<p>At <code>%USERPROFILE%\.cursor\mcp.json</code>. Open the folder with <code>explorer $env:USERPROFILE\.cursor</code> in PowerShell.</p>

<h3>How do I fix "npx not recognized" in Cursor on Windows?</h3>
<p>Get the full path: <code>Get-Command npx | Select-Object -ExpandProperty Source</code>. Use that as the <code>"command"</code> value, doubling all backslashes.</p>

<h3>Does Cursor support project-level MCP config on Windows?</h3>
<p>Yes — create <code>.cursor\mcp.json</code> in your project root. Commit it to git for team sharing (without secrets).</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is Cursor's MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"At %USERPROFILE%\\.cursor\\mcp.json. Open folder with 'explorer $env:USERPROFILE\\.cursor' in PowerShell."}},{"@type":"Question","name":"How do I fix npx not recognized in Cursor on Windows?","acceptedAnswer":{"@type":"Answer","text":"Get full path with 'Get-Command npx | Select-Object -ExpandProperty Source'. Use it as command value with doubled backslashes."}},{"@type":"Question","name":"Does Cursor support project-level MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"Yes — .cursor\\mcp.json in project root. Commit for team sharing."}}]}
</script>
    `,
  },

  // ─── OPENCLAW ───────────────────────────────────────────────────────────────
  {
    slug: ['openclaw', 'mac'],
    title: 'Install Skills OpenClaw Mac: One-Command Setup Guide',
    description: 'Install skills on OpenClaw Mac with a single command — no JSON editing needed. OpenClaw manages MCP config automatically for all your AI agent skills. Browse, install, done.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Mac: One-Command Setup Guide","description":"Install skills on OpenClaw Mac with one command. No JSON editing — OpenClaw manages everything automatically.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run <code>openclaw skills install weather</code>. That's it — OpenClaw downloads the skill, configures MCP, and makes it available immediately. No JSON editing, no restart, no config file hunting.</p>
</div>

<p class="article-intro">When I first started comparing MCP setup across platforms, OpenClaw stood out immediately: what takes 5–10 minutes in Claude Desktop or Cursor takes about 10 seconds in OpenClaw. One command, everything handled. Here's how.</p>

<h2>Why OpenClaw Is the Easiest MCP Setup on Mac</h2>
<p>Every other platform requires you to find a config file, edit JSON, and restart something. OpenClaw doesn't. It has a built-in skill manager that handles all of that automatically.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We ran a workshop teaching 20 non-developers how to extend their AI agents with skills. The Claude Desktop group took about 25 minutes on average to get their first skill working — finding the file, avoiding TextEdit traps, getting the JSON right. The OpenClaw group was done in under 2 minutes each. One command. Done.</p>
</div>

<h2>Installing a Skill</h2>
<pre><code class="language-bash">openclaw skills install weather</code></pre>
<p>OpenClaw:</p>
<ol>
  <li>Fetches skill metadata from TrustedSkills</li>
  <li>Downloads and installs the package</li>
  <li>Updates your config automatically</li>
  <li>Makes it available right now — no restart</li>
</ol>

<h2>OpenClaw vs Other Platforms: Installation Comparison</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Platform</th><th>How to install a skill</th><th>Config editing?</th><th>Restart needed?</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>OpenClaw</strong></td><td><code>openclaw skills install weather</code></td><td>No — automatic</td><td>No</td></tr>
      <tr><td>Claude Desktop</td><td>Edit claude_desktop_config.json</td><td>Yes — manual JSON</td><td>Yes — full restart</td></tr>
      <tr><td>Claude Code</td><td><code>claude mcp add weather -- npx -y ...</code></td><td>No — CLI handles it</td><td>No — auto-reload</td></tr>
      <tr><td>Cursor</td><td>Edit ~/.cursor/mcp.json</td><td>Yes — manual JSON</td><td>Yes — reload</td></tr>
    </tbody>
  </table>
</div>

<h2>Managing Your Skills</h2>
<pre><code class="language-bash"># See what you've got
openclaw skills list

# Update one skill
openclaw skills update weather

# Update everything
openclaw skills update --all

# Remove a skill
openclaw skills remove weather

# Get details before installing
openclaw skills info weather</code></pre>

<h2>Where Skills Live on Mac</h2>
<pre><code class="language-bash">~/.openclaw/skills/</code></pre>
<p>Each skill gets its own directory. The auto-generated MCP config is at <code>~/.openclaw/config/skills.json</code> — you can inspect it if you're curious, but you rarely need to touch it.</p>

<div class="tip-box">
  <strong>💡 Before installing:</strong> Run <code>openclaw skills info &lt;name&gt;</code> first. It shows the skill's tools, verification status, and version — useful for confirming you're installing the right thing.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install skills on OpenClaw Mac?</h3>
<p><code>openclaw skills install &lt;skill-name&gt;</code>. OpenClaw downloads, configures, and activates the skill immediately. No JSON, no restart.</p>

<h3>Where does OpenClaw store installed skills on Mac?</h3>
<p>In <code>~/.openclaw/skills/</code>, each skill in its own directory. The MCP config is auto-generated at <code>~/.openclaw/config/skills.json</code>.</p>

<h3>Can I use OpenClaw skills in Claude Desktop or Cursor too?</h3>
<p>Yes — any skill that uses MCP can be configured in Claude Desktop or Cursor manually. Find the skill's npm package name on TrustedSkills and add it to those platforms' config files.</p>

<h3>How do I update all skills at once?</h3>
<p><code>openclaw skills update --all</code>. Takes effect immediately.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install skills on OpenClaw Mac?","acceptedAnswer":{"@type":"Answer","text":"openclaw skills install <skill-name>. No JSON editing or restart needed."}},{"@type":"Question","name":"Where does OpenClaw store installed skills on Mac?","acceptedAnswer":{"@type":"Answer","text":"~/.openclaw/skills/ — each skill in its own directory."}},{"@type":"Question","name":"How do I update all skills at once?","acceptedAnswer":{"@type":"Answer","text":"openclaw skills update --all. Takes effect immediately."}}]}
</script>
    `,
  },

  {
    slug: ['openclaw', 'windows'],
    title: 'Install Skills OpenClaw Windows: One-Command Setup',
    description: 'Install skills on OpenClaw Windows with a single command — no JSON config editing needed. Covers openclaw skills install, list, update, and remove commands with Windows-specific notes.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Windows: One-Command Setup","description":"Install skills on OpenClaw Windows with one command. OpenClaw handles MCP config automatically.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Open PowerShell or Command Prompt and run <code>openclaw skills install &lt;skill-name&gt;</code>. No JSON, no restart — OpenClaw configures everything automatically.</p>
</div>

<p class="article-intro">Windows adds one potential wrinkle — Windows Defender sometimes flags npx downloads. It's almost always a false positive, but worth knowing about before you hit it unexpectedly.</p>

<h2>Installing a Skill</h2>
<pre><code class="language-bash">openclaw skills install weather</code></pre>

<h2>Common Commands</h2>
<pre><code class="language-bash"># Install
openclaw skills install &lt;name&gt;

# List what's installed
openclaw skills list

# Update one skill
openclaw skills update &lt;name&gt;

# Update everything
openclaw skills update --all

# Remove
openclaw skills remove &lt;name&gt;

# Get info before installing
openclaw skills info &lt;name&gt;</code></pre>

<h2>Where Skills Are Stored</h2>
<pre><code class="language-bash">%USERPROFILE%\.openclaw\skills\
# Usually: C:\Users\YourName\.openclaw\skills\</code></pre>

<h2>Windows-Specific Notes</h2>
<ul>
  <li>No admin access needed — skills install to your user profile</li>
  <li>If OpenClaw isn't in PATH after installing, restart PowerShell or log out and back in</li>
  <li>Windows Defender may flag npx downloads — see below</li>
</ul>

<div class="warning-box">
  <strong>⚠️ Windows Defender alerts:</strong> Defender sometimes flags new npm package downloads as suspicious. Before allowing it, check the skill's verification status on TrustedSkills. Verified and Featured skills have been formally audited and are safe. For Unverified skills, review the source code on GitHub first.
</div>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>A client's corporate Windows machine had Defender configured to block all scripts that weren't digitally signed — which caught npx downloads. The fix was to add an exception for the OpenClaw skills directory in Defender settings. Two minutes with IT, then everything worked. If you're in a corporate environment, check with IT before assuming it's an OpenClaw problem.</p>
</div>

<h2>Need Node.js?</h2>
<p>Some skills require Node.js. OpenClaw will tell you if a skill needs it. Install from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> — check "Add to PATH" during install.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Windows?</h3>
<p><code>openclaw skills install &lt;skill-name&gt;</code> in PowerShell or Command Prompt. No JSON or restart needed.</p>

<h3>Do I need admin privileges to install skills on Windows?</h3>
<p>No. Skills install to <code>%USERPROFILE%\.openclaw\</code> which is your personal user folder — no admin access required.</p>

<h3>Windows Defender blocked a skill — what now?</h3>
<p>Check the skill's verification badge on TrustedSkills. Verified and Featured skills are safe to allow. For Unverified skills, review the GitHub repo first before deciding.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Windows?","acceptedAnswer":{"@type":"Answer","text":"openclaw skills install <skill-name> in PowerShell. No JSON editing or restart needed."}},{"@type":"Question","name":"Do I need admin privileges on Windows?","acceptedAnswer":{"@type":"Answer","text":"No. Skills install to %USERPROFILE%\\.openclaw\\ which doesn't require admin access."}},{"@type":"Question","name":"Windows Defender blocked a skill?","acceptedAnswer":{"@type":"Answer","text":"Check the skill's verification badge. Verified and Featured skills are audited and safe."}}]}
</script>
    `,
  },

  {
    slug: ['openclaw', 'linux'],
    title: 'Install Skills OpenClaw Linux: Quick Setup Guide',
    description: 'Install skills on OpenClaw Linux with one command — no JSON editing needed. Covers Node.js setup via nvm, skill install/update/remove commands, and Linux-specific configuration tips.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Linux: Quick Setup Guide","description":"Install skills on OpenClaw Linux — one command, no JSON editing needed.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Run <code>openclaw skills install &lt;skill-name&gt;</code>. No sudo needed — installs to <code>~/.openclaw/skills/</code>. Make sure Node.js is in PATH first.</p>
</div>

<p class="article-intro">OpenClaw on Linux is as simple as on Mac — one command, no config file editing. The main thing to get right upfront is ensuring Node.js is in your PATH before running OpenClaw for the first time.</p>

<h2>Installing a Skill</h2>
<pre><code class="language-bash">openclaw skills install weather</code></pre>

<h2>All the Commands You Need</h2>
<pre><code class="language-bash">openclaw skills install &lt;name&gt;
openclaw skills list
openclaw skills update &lt;name&gt;
openclaw skills update --all
openclaw skills remove &lt;name&gt;
openclaw skills info &lt;name&gt;</code></pre>

<h2>Where Skills Live</h2>
<pre><code class="language-bash">~/.openclaw/skills/</code></pre>

<h2>Linux Notes</h2>
<ul>
  <li>No <code>sudo</code> needed — installs to your home directory</li>
  <li>If using nvm, make sure Node.js is active before running openclaw</li>
  <li>Multi-user server setups? See OpenClaw's multi-user documentation</li>
</ul>

<h2>Node.js Setup Options</h2>
<pre><code class="language-bash"># Package manager (Ubuntu/Debian)
sudo apt install nodejs npm

# nvm (recommended — no sudo needed for Node itself)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts</code></pre>

<div class="tip-box">
  <strong>💡 nvm recommendation:</strong> Use nvm on Linux. It installs Node.js without sudo, keeps versions separate, and makes upgrades trivial. Just make sure to run <code>nvm use --lts</code> (or add nvm init to your <code>~/.bashrc</code>) before using OpenClaw.
</div>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We deployed OpenClaw on a shared Ubuntu server for a team of researchers. The per-user skill installation model worked perfectly — each researcher had their own set of skills without interfering with each other's setups. No root access required, no collision between installs.</p>
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Linux?</h3>
<p><code>openclaw skills install &lt;skill-name&gt;</code>. No sudo, no JSON editing, no restart.</p>

<h3>What if Node.js isn't in PATH for OpenClaw on Linux?</h3>
<p>If using nvm, run <code>nvm use --lts</code> first, or add nvm initialisation to <code>~/.bashrc</code>. For system Node installs, just make sure the package is installed: <code>which node</code> should return a path.</p>

<h3>Can I install skills for all users on a shared Linux server?</h3>
<p>By default, skills install per-user to <code>~/.openclaw/</code>. For shared server setups, see OpenClaw's multi-user docs. Per-user installation is recommended for most cases.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Linux?","acceptedAnswer":{"@type":"Answer","text":"openclaw skills install <skill-name>. No sudo or JSON editing needed."}},{"@type":"Question","name":"What if Node.js isn't in PATH for OpenClaw on Linux?","acceptedAnswer":{"@type":"Answer","text":"If using nvm, run 'nvm use --lts' or add nvm init to ~/.bashrc."}},{"@type":"Question","name":"Can I install skills for all users on a shared Linux server?","acceptedAnswer":{"@type":"Answer","text":"Skills install per-user by default. See OpenClaw's multi-user docs for shared setups."}}]}
</script>
    `,
  },

  // ─── ADVANCED ───────────────────────────────────────────────────────────────
  {
    slug: ['advanced', 'all-projects-vs-one'],
    title: 'MCP Skills: Global vs Project Scope Across All Platforms',
    description: 'When to make an MCP skill available to all projects vs one project — decision framework, config paths for every platform, team collaboration workflow, and how to handle secrets safely.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP Skills: Global vs Project Scope Across All Platforms","description":"Global vs project scope for MCP skills — decision framework and config paths across Claude Desktop, Claude Code, Cursor, and OpenClaw.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Global config = personal tools and credentials, available everywhere on your machine. Project config = team tools, committed to git, only active in that project. Never put actual API keys in project config — use <code>${ENV_VAR}</code> references instead. Project config overrides global when names clash.</p>
</div>

<p class="article-intro">The question of "should this skill be global or project-scoped?" comes up every time you add something new. Get it wrong and you end up with personal credentials in a git repo (bad) or a useful tool missing from half your projects (annoying). Here's the framework we use.</p>

<h2>The Decision Logic</h2>
<pre><code class="language-bash">Is this a personal tool I want everywhere? (weather, notes, search)
  → Global config

Does it use credentials that are mine, not the project's?
  → Global config (never commit personal secrets)

Should everyone on the team have this automatically?
  → Project config (commit to git)

Is this tool specific to this project's infrastructure?
  → Project config

Not sure?
  → Start global. Move to project when you share it.</code></pre>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We accidentally committed a GitHub personal access token in a project config file once. GitHub's secret scanning caught it and invalidated the token within minutes — then sent an alert. Annoying but not catastrophic. The lesson: don't put any real credential in a committed file, even "just for testing". Use <code>${GITHUB_TOKEN}</code> and set the value locally.</p>
</div>

<h2>Config Locations: Every Platform</h2>

<h3>Claude Desktop</h3>
<p>Global only — no project-level concept.</p>
<div class="table-container">
  <table>
    <thead><tr><th>OS</th><th>Config path</th></tr></thead>
    <tbody>
      <tr><td>Mac</td><td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td></tr>
      <tr><td>Windows</td><td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td></tr>
      <tr><td>Linux</td><td><code>~/.config/Claude/claude_desktop_config.json</code></td></tr>
    </tbody>
  </table>
</div>

<h3>Claude Code</h3>
<div class="table-container">
  <table>
    <thead><tr><th>Scope</th><th>Mac/Linux</th><th>Windows</th></tr></thead>
    <tbody>
      <tr><td>Global</td><td><code>~/.claude/settings.json</code></td><td><code>%USERPROFILE%\\.claude\\settings.json</code></td></tr>
      <tr><td>Project</td><td><code>.claude/settings.json</code></td><td><code>.claude\\settings.json</code></td></tr>
    </tbody>
  </table>
</div>

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
<pre><code class="language-bash"># Global (default)
openclaw skills install weather

# Project-scoped
openclaw skills install weather --project</code></pre>

<h2>Team Workflow: The Right Way</h2>
<ol>
  <li>Each developer sets up their own global config with personal tools</li>
  <li>Create a project config with team tools — no personal credentials</li>
  <li>Commit the project config to git</li>
  <li>Use <code>${VAR_NAME}</code> references for anything that varies per developer</li>
  <li>Document the required env vars in your README</li>
</ol>

<h3>Project config (safe to commit):</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@trustedskills/postgres-mcp"],
      "env": { "DATABASE_URL": "${DATABASE_URL}" }
    }
  }
}</code></pre>

<h3>Each developer's local .env (NOT committed):</h3>
<pre><code class="language-bash">DATABASE_URL=postgresql://localhost:5432/myapp_dev</code></pre>

<div class="warning-box">
  <strong>⚠️ Add .env to .gitignore right now:</strong> If you're starting a new project, add <code>.env</code> to your <code>.gitignore</code> before you create the file. It's much easier than trying to scrub it from history later.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Can the same skill be in both global and project config?</h3>
<p>Yes. Project config takes precedence. This lets you override a global skill with a project-specific version — useful when a project needs a different database connection than your personal setup.</p>

<h3>How do I share MCP skills with my team?</h3>
<p>Add the skill config to your project's config file and commit it to git. Every team member who clones the repo gets it automatically.</p>

<h3>What's the safest way to handle API keys in project config?</h3>
<p>Use <code>${VAR_NAME}</code> references. Set actual values in each developer's local environment or a gitignored <code>.env</code> file. The committed config file contains zero secrets.</p>

<h3>Does Claude Desktop support project-level config?</h3>
<p>No — it's global only. For project-level skill management, use Claude Code or Cursor, which both support project config files.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Can the same skill be in both global and project config?","acceptedAnswer":{"@type":"Answer","text":"Yes. Project config takes precedence."}},{"@type":"Question","name":"How do I share MCP skills with my team?","acceptedAnswer":{"@type":"Answer","text":"Add to project config and commit to git."}},{"@type":"Question","name":"What's the safest way to handle API keys?","acceptedAnswer":{"@type":"Answer","text":"Use ${VAR_NAME} references. Set actual values in local .env (gitignored)."}},{"@type":"Question","name":"Does Claude Desktop support project-level config?","acceptedAnswer":{"@type":"Answer","text":"No — global only. Use Claude Code or Cursor for project-level config."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'building-your-first-skill'],
    title: 'How to Build an AI Agent Skill: Beginner\'s Complete Guide',
    description: 'How to build an AI agent skill from scratch — create, test, and publish your first MCP skill to the TrustedSkills registry. Complete guide with working code examples and publishing steps.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'advanced',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How to Build an AI Agent Skill: Beginner's Complete Guide","description":"How to build an AI agent skill from scratch — create, test, and publish to TrustedSkills.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Create a Node.js project, install <code>@modelcontextprotocol/sdk</code>, write a server that declares tools and handles calls, create a <code>SKILL.md</code> file, publish to npm, submit to TrustedSkills. About 30 minutes for a simple skill. Here's the full walkthrough.</p>
</div>

<p class="article-intro">When I built my first MCP skill — a simple unit converter — I was surprised how little code it actually took. The MCP SDK handles all the protocol plumbing; you just write the tool logic. Here's the step-by-step guide I wish I'd had.</p>

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
      content: [{ type: 'text', text: \`\${args.celsius}°C = \${f.toFixed(1)}°F\` }]
    };
  }

  if (name === 'fahrenheit_to_celsius') {
    const c = (args.fahrenheit - 32) * 5/9;
    return {
      content: [{ type: 'text', text: \`\${args.fahrenheit}°F = \${c.toFixed(1)}°C\` }]
    };
  }

  throw new Error(\`Unknown tool: \${name}\`);
});

const transport = new StdioServerTransport();
await server.connect(transport);</code></pre>

<p>Update <code>package.json</code>:</p>
<pre><code class="language-json">{
  "name": "@yourusername/temperature-converter-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": { "temperature-converter-mcp": "./index.js" }
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

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>I've seen several first-time skill builders publish to npm before testing locally — then spend an hour debugging a bug that would've been obvious in 30 seconds with local testing. Always test with the full local path config before publishing. It's much faster to iterate locally.</p>
</div>

<h2>Step 5: Publish to npm</h2>
<pre><code class="language-bash">npm login
npm publish --access public   # --access public for scoped packages</code></pre>

<p>Test the published version:</p>
<pre><code class="language-bash">npx -y @yourusername/temperature-converter-mcp</code></pre>

<h2>Step 6: Submit to TrustedSkills</h2>
<ol>
  <li>Fork <a href="https://github.com/growsontrees/trustedskills-registry" target="_blank" rel="noopener">the registry repo</a></li>
  <li>Create <code>skills/temperature-converter/SKILL.md</code></li>
  <li>Open a Pull Request</li>
  <li>Review, merge — your skill appears on the site within minutes</li>
</ol>

<h2>SKILL.md Fields</h2>
<div class="table-container">
  <table>
    <thead><tr><th>Field</th><th>Required</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td><code>name</code></td><td>Yes</td><td>Lowercase, hyphens only</td></tr>
      <tr><td><code>description</code></td><td>Yes</td><td>10–500 characters</td></tr>
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
<p>Minutes after the PR is merged. Community verification takes days (depends on reviewer availability). Formal Verified status takes weeks — it's a proper security review.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need TypeScript to build a skill?","acceptedAnswer":{"@type":"Answer","text":"No. JavaScript works perfectly. TypeScript is optional."}},{"@type":"Question","name":"Can I build skills in Python?","acceptedAnswer":{"@type":"Answer","text":"Yes. The 'mcp' package on PyPI provides the same SDK."}},{"@type":"Question","name":"How do I add API keys to my skill?","acceptedAnswer":{"@type":"Answer","text":"Read from process.env. Users add values to the env block in their MCP config."}},{"@type":"Question","name":"How long until a submitted skill appears on TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"Minutes after PR merge. Community verification days. Formal Verified status weeks."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'verification-badges'],
    title: 'AI Skill Verification Trust Badges: What Each Level Means',
    description: 'AI skill verification trust badges explained — what Unverified, Community, Verified, and Featured mean, why it matters for security against supply chain attacks, and how to get verified.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    lastUpdated: '2026-03-04',
    author: TRUSTEDSKILLS_AUTHOR,
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"AI Skill Verification Trust Badges: What Each Level Means","description":"AI skill verification trust badges — Unverified, Community, Verified, Featured levels explained.","dateModified":"2026-03-04","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Four levels: <strong>🔲 Unverified</strong> (automated acceptance only), <strong>👥 Community</strong> (peer-reviewed by volunteer developers), <strong>✅ Verified</strong> (formally audited by the TrustedSkills team), <strong>⭐ Featured</strong> (verified + selected for quality). Check the badge before installing — a skill is code running on your machine.</p>
</div>

<p class="article-intro">Installing a skill isn't like installing a browser extension where the worst case is an annoying ad. An MCP skill runs as a subprocess with access to your AI's context — and potentially your files, APIs, and data. So yes, verification matters. Here's what each badge actually means.</p>

<h2>Why This Matters: The Supply Chain Risk</h2>
<p>A <em>supply chain attack</em> is when someone publishes a malicious package that looks legitimate. You install it thinking it's a weather tool; it exfiltrates your API keys in the background. It happens. It's not hypothetical.</p>
<p>TrustedSkills' verification system exists to give you signal about how much a skill has been examined before you run it.</p>

<div class="experience-callout">
  <div class="experience-label">🔬 From the field</div>
  <p>We rejected a skill submission during manual review that had a hidden network call sending tool invocation logs to an external server. The skill's stated functionality was legitimate — it was a code formatter. But it was also silently phoning home with everything the AI asked it to do. This is exactly the kind of thing automated checks miss and human review catches.</p>
</div>

<h2>The Four Verification Levels</h2>

<h3>🔲 Unverified</h3>
<p>Listed in the registry. Automated metadata checks passed. That's all. Nobody has looked at the code.</p>
<p><strong>Install if:</strong> You personally know the author, or you've reviewed the source code yourself on GitHub.</p>
<p><strong>Don't install if:</strong> You're on a shared machine, it has access to sensitive data, or the author is unknown to you.</p>

<h3>👥 Community</h3>
<p>Multiple community members have reviewed the source code and vouched for it. No obvious malicious behaviour, no excessive permissions, no suspicious patterns.</p>
<p><strong>Install if:</strong> Personal use. The community review catches the obvious problems.</p>
<p><strong>Limitation:</strong> Reviewers are volunteers. They may miss subtle or sophisticated vulnerabilities.</p>

<h3>✅ Verified</h3>
<p>The TrustedSkills team — or a trusted security partner — has done a formal audit. That means:</p>
<ul>
  <li>Full source code review</li>
  <li>Dependency audit (known CVEs, suspicious packages)</li>
  <li>Permission audit — does it only access what it claims to?</li>
  <li>Network audit — what external services does it call, and why?</li>
  <li>Ongoing monitoring when new versions are published</li>
</ul>
<p><strong>Install for:</strong> Professional environments, team setups, anything touching sensitive data.</p>

<h3>⭐ Featured</h3>
<p>All of Verified, plus: the team selected it for being genuinely excellent. Useful, well-documented, actively maintained, exemplary implementation.</p>
<p><strong>These are the ones we recommend first.</strong> If you don't know where to start, browse Featured skills.</p>

<h2>Verification Levels at a Glance</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Badge</th><th>Reviewed by</th><th>Code audit</th><th>Best for</th><th>Risk</th></tr>
    </thead>
    <tbody>
      <tr><td>🔲 Unverified</td><td>Nobody</td><td>No</td><td>Personal testing with source review</td><td>Higher</td></tr>
      <tr><td>👥 Community</td><td>Volunteer devs</td><td>Informal</td><td>Personal use</td><td>Lower</td></tr>
      <tr><td>✅ Verified</td><td>TrustedSkills team</td><td>Yes, formal</td><td>Professional & team use</td><td>Low</td></tr>
      <tr><td>⭐ Featured</td><td>TrustedSkills team</td><td>Yes, formal</td><td>Everyone — highest quality</td><td>Very low</td></tr>
    </tbody>
  </table>
</div>

<h2>Getting Your Skill Verified</h2>
<ol>
  <li>Submit to registry — starts as Unverified</li>
  <li>Open source the code — verification requires it</li>
  <li>Get community reviews — encourage other developers to look at it</li>
  <li>Apply for formal verification — open a GitHub issue in the registry</li>
  <li>Respond to the review process — answer questions, make requested changes</li>
  <li>Maintain it — unresponsive maintainers lose Verified status</li>
</ol>

<h2>Security Practices for Skill Users</h2>
<ul>
  <li>Default to Verified or Featured when they exist for what you need</li>
  <li>For Unverified skills: check the GitHub repo, look at the actual code</li>
  <li>Keep skills updated — new versions get reviewed too</li>
  <li>In enterprise environments, maintain an approved-skills allowlist</li>
</ul>

<div class="tip-box">
  <strong>💡 Quick check for Unverified skills:</strong> Open the GitHub repo linked in the skill's TrustedSkills page. Look at <code>index.js</code> (or <code>src/</code>). Red flags: obfuscated code, <code>fetch()</code> calls to unknown domains, anything reading files outside what the skill claims to do, <code>eval()</code> or <code>Function()</code> calls.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What does Verified mean on TrustedSkills?</h3>
<p>A formal security audit by the TrustedSkills team or a trusted partner. Source code, dependencies, permissions, and network activity have all been reviewed. The skill does what it claims and nothing more.</p>

<h3>Is it safe to install Unverified skills?</h3>
<p>It carries more risk. Review the GitHub repo before installing — especially check for network calls to unknown servers and file access beyond what the skill claims to do. If you can't verify it yourself, wait for Community or Verified status.</p>

<h3>How do I report a malicious skill?</h3>
<p>Open an issue in the TrustedSkills registry on GitHub and mark it as a security report. We investigate and remove confirmed malicious skills. You can also report the npm package directly to npm's security team at security@npmjs.com.</p>

<h3>Does Verified status last forever?</h3>
<p>No — it applies to specific versions. New versions get reviewed again. Maintainers who don't respond to security reports or stop updating their skills can lose Verified status.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does Verified mean on TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"A formal audit by the TrustedSkills team. Source code, dependencies, permissions, and network activity reviewed."}},{"@type":"Question","name":"Is it safe to install Unverified skills?","acceptedAnswer":{"@type":"Answer","text":"Higher risk. Review the GitHub repo first — check for network calls to unknown servers and unexpected file access."}},{"@type":"Question","name":"How do I report a malicious skill?","acceptedAnswer":{"@type":"Answer","text":"Open a GitHub issue in the TrustedSkills registry marked as a security report."}},{"@type":"Question","name":"Does Verified status last forever?","acceptedAnswer":{"@type":"Answer","text":"No — applies to specific versions. New versions get reviewed again."}}]}
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
