export interface DocArticle {
  slug: string[];
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  persona: 'beginner' | 'developer' | 'advanced';
  content: string;
}

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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP vs Skills vs Plugins AI: What's the Difference?","description":"Understand MCP vs skills vs plugins AI terminology. Clear definitions of what each means and how they fit together in the AI agent ecosystem.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>MCP vs skills vs plugins AI</strong> — these three terms describe related but distinct concepts. <strong>MCP</strong> (Model Context Protocol) is the communication <em>protocol</em>; <strong>skills</strong> and <strong>plugins</strong> are both names for packaged capabilities that use that protocol. TrustedSkills uses "skills"; ChatGPT used "plugins" — same idea, different branding.</p>
</div>

<h2>The Core Distinction: MCP vs Skills vs Plugins AI</h2>
<p>If you've been reading about <strong>MCP vs skills vs plugins AI</strong>, you've probably encountered three terms that seem interchangeable but aren't quite the same:</p>
<ul>
  <li><strong>MCP</strong> is a <em>protocol</em> — a standard for how AI agents communicate with external tools</li>
  <li><strong>Skills</strong> are <em>packages</em> that add capabilities to an agent (often using MCP under the hood)</li>
  <li><strong>Plugins</strong> are essentially the same as skills — just a different word used by different platforms</li>
</ul>

<h2>The Analogy That Makes It Click</h2>
<p>Think of the web:</p>
<ul>
  <li><strong>HTTP</strong> is the protocol — the standard that defines how browsers and servers talk to each other</li>
  <li><strong>Websites</strong> are the apps — they run on HTTP and deliver useful content</li>
  <li>Whether you call it a "website", "web app", or "web service" — it's all built on the same HTTP protocol</li>
</ul>
<p>Now substitute:</p>
<ul>
  <li><strong>MCP</strong> = HTTP (the protocol)</li>
  <li><strong>Skills / Plugins</strong> = websites (the apps built on top)</li>
</ul>

<h2>MCP — The Model Context Protocol Explained</h2>
<p><strong>MCP</strong> (Model Context Protocol) is an open standard created by Anthropic that defines how AI models can call external tools and services. It specifies:</p>
<ul>
  <li>How a tool advertises its capabilities (tool definitions)</li>
  <li>How an AI model calls a tool (request format)</li>
  <li>How a tool returns results (response format)</li>
  <li>How connections are established and maintained</li>
</ul>
<p>MCP is implemented as a small server — usually a Node.js or Python process — that runs alongside your AI client (Claude Desktop, Claude Code, Cursor, etc.). The AI client connects to this server, discovers what tools it offers, and calls them when needed.</p>
<p>Think of MCP as the "plug socket standard" — without a standard, every tool would need a custom adapter for every AI platform.</p>

<div class="tip-box">
  <strong>💡 Tip:</strong> MCP is platform-agnostic. A skill built for Claude Desktop will also work in Cursor, OpenClaw, and any other MCP-compatible client — no changes needed.
</div>

<h2>Skills — Packaged Capabilities</h2>
<p>A <strong>skill</strong> is a packaged, installable unit of capability for an AI agent. Skills can be:</p>
<ul>
  <li>An MCP server (the most common type)</li>
  <li>A set of prompt templates</li>
  <li>A configuration bundle that sets up the agent for a specific task</li>
  <li>A combination of the above</li>
</ul>
<p>TrustedSkills is a <em>registry</em> of skills — a curated list of installable skills with metadata about what they do, which platforms they support, and whether they've been verified.</p>
<p>When you see a skill listed on TrustedSkills, it typically means: "install this package (usually via npx), add it to your MCP config, and your AI agent will gain these new tools."</p>

<h2>Plugins — Same Thing, Different Name</h2>
<p>The word <strong>plugin</strong> is used by ChatGPT, some browser extensions, and older documentation to mean essentially the same thing as a skill. A plugin adds functionality to a base system.</p>
<p>OpenAI originally called them "ChatGPT Plugins" before pivoting to "Custom GPTs" and then "GPT Actions". Anthropic (Claude) uses "tools" and "MCP servers". OpenClaw uses "skills". Cursor calls them "MCP tools".</p>
<p>Different names, same concept: <em>packaged capabilities that extend what an AI agent can do</em>.</p>

<h2>MCP vs Skills vs Plugins: Comparison Table</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Term</th>
        <th>What it is</th>
        <th>Who uses it</th>
        <th>Technical form</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>MCP</strong></td>
        <td>A protocol standard for AI-tool communication</td>
        <td>Anthropic, Claude, Cursor, most modern platforms</td>
        <td>JSON-RPC over stdio or SSE</td>
      </tr>
      <tr>
        <td><strong>Skill</strong></td>
        <td>A packaged, installable capability for an AI agent</td>
        <td>TrustedSkills, OpenClaw</td>
        <td>npm package, MCP server, or config bundle</td>
      </tr>
      <tr>
        <td><strong>Plugin</strong></td>
        <td>Same as a skill</td>
        <td>ChatGPT (older), browser extensions</td>
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

<h2>When Would You Use Each?</h2>
<h3>Use "MCP" when…</h3>
<ul>
  <li>You're writing documentation about the protocol itself</li>
  <li>You're configuring a <code>claude_desktop_config.json</code> (the config key is <code>mcpServers</code>)</li>
  <li>You're building a server that exposes tools to Claude</li>
</ul>
<h3>Use "Skill" when…</h3>
<ul>
  <li>You're browsing TrustedSkills to find a capability</li>
  <li>You're publishing something to the registry</li>
  <li>You're describing what your AI agent can do</li>
</ul>
<h3>Use "Plugin" when…</h3>
<ul>
  <li>You're working with older ChatGPT documentation</li>
  <li>You're talking to a non-technical audience who knows the word from browser plugins</li>
</ul>

<h2>Key Takeaway</h2>
<p>Don't get lost in terminology. The important thing is: <em>skills/plugins/MCP servers all extend what an AI agent can do</em>. TrustedSkills lists these extensions in a unified registry so you can find and install them regardless of which platform you use.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What is the difference between MCP and a skill?</h3>
<p>MCP (Model Context Protocol) is the communication protocol — it defines how AI agents talk to external tools. A skill is a packaged capability that uses MCP to communicate. Think of MCP as the language, and a skill as a conversation partner that speaks it.</p>

<h3>Are plugins and skills the same thing?</h3>
<p>Yes, functionally they are the same. "Plugin" was popularised by ChatGPT to describe add-ons; "skill" is the term used by TrustedSkills and OpenClaw. Both refer to installable packages that extend an AI agent's capabilities.</p>

<h3>Do I need to understand MCP to use skills?</h3>
<p>No. You just need to copy a JSON config snippet from TrustedSkills into your AI client's config file. The MCP protocol runs invisibly in the background. Understanding MCP is only needed if you want to build your own skills.</p>

<h3>Which platforms support MCP?</h3>
<p>Claude Desktop, Claude Code, Cursor, OpenClaw, and many other AI platforms support MCP. Because it's an open standard, adoption is growing rapidly across the AI ecosystem.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is the difference between MCP and a skill?","acceptedAnswer":{"@type":"Answer","text":"MCP (Model Context Protocol) is the communication protocol that defines how AI agents talk to external tools. A skill is a packaged capability that uses MCP to communicate. MCP is the language; a skill is the conversation partner that speaks it."}},{"@type":"Question","name":"Are plugins and skills the same thing?","acceptedAnswer":{"@type":"Answer","text":"Yes, functionally they are the same. 'Plugin' was popularised by ChatGPT; 'skill' is the term used by TrustedSkills and OpenClaw. Both refer to installable packages that extend an AI agent's capabilities."}},{"@type":"Question","name":"Do I need to understand MCP to use skills?","acceptedAnswer":{"@type":"Answer","text":"No. You just copy a JSON config snippet from TrustedSkills into your AI client's config file. The MCP protocol runs invisibly in the background."}},{"@type":"Question","name":"Which platforms support MCP?","acceptedAnswer":{"@type":"Answer","text":"Claude Desktop, Claude Code, Cursor, OpenClaw, and many other AI platforms support MCP. Because it's an open standard, adoption is growing rapidly."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"What is npx MCP Server? Why Every MCP Config Uses It","description":"What is npx MCP server explained simply — how it runs packages without installing, why MCP servers use it, and when to use npx vs global install.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>npx</strong> runs an npm package without installing it globally. Every <strong>npx MCP server</strong> config uses <code>npx -y</code> because it lets Claude Desktop (and other AI clients) launch skills automatically — no manual install needed, always fresh, works on every machine with Node.js.</p>
</div>

<h2>The Problem npx Solves for MCP Servers</h2>
<p>Before we explain <strong>what is npx MCP server</strong> configuration, here's the old way things worked:</p>
<p>Imagine you want to run a tool called <code>weather-server</code>. The old approach:</p>
<ol>
  <li>Install it globally: <code>npm install -g weather-server</code></li>
  <li>Now run it: <code>weather-server</code></li>
</ol>
<p>That works — but globally installed packages cause problems: version conflicts between projects, cluttered system, needing admin permissions, and packages going stale.</p>
<p><strong>npx solves this</strong> by letting you run a package <em>without installing it globally</em>. It downloads and runs the package in a temporary location, then cleans up after itself.</p>

<h2>The Vending Machine Analogy</h2>
<p>Think of npm packages like vending machine snacks.</p>
<ul>
  <li><strong>Global install (<code>npm install -g</code>)</strong> = buying a snack and putting it in your pantry. It's there forever, taking up space, and might go stale.</li>
  <li><strong>npx</strong> = using a vending machine. You get exactly what you need, right now, fresh — and there's nothing to clean up afterwards.</li>
</ul>

<h2>What npx Actually Does</h2>
<p>When you run <code>npx @trustedskills/weather-mcp</code>, npx:</p>
<ol>
  <li>Checks if the package is already installed locally (in <code>node_modules</code>) or cached</li>
  <li>If not found: downloads the latest version from the npm registry</li>
  <li>Runs the package's main entry point</li>
  <li>The download is cached — subsequent runs are fast (no re-download)</li>
</ol>

<h2>The <code>-y</code> Flag Explained</h2>
<p>In MCP configs, you almost always see <code>npx -y @package/name</code>. The <strong><code>-y</code> flag</strong> means "yes to everything" — it skips the confirmation prompt that npx shows when downloading a new package:</p>
<pre><code class="language-bash"># Without -y: npx asks you to confirm
npx @trustedskills/weather-mcp
# ⚠ Need to install the following packages:
#   @trustedskills/weather-mcp
# Ok to proceed? (y)

# With -y: skips the prompt, installs automatically
npx -y @trustedskills/weather-mcp</code></pre>
<p>Why does this matter for MCP? Because MCP servers are launched automatically by Claude Desktop or Claude Code — they run in the background, with no human sitting there to press "y". The <code>-y</code> flag ensures they start without human intervention.</p>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> Always verify the package name on TrustedSkills before adding it to your config. The <code>-y</code> flag bypasses the install confirmation, so make sure you trust the package first.
</div>

<h2>Why MCP Servers Use npx</h2>
<p>Every MCP config you see uses npx for several good reasons:</p>

<h3>1. No global installation required</h3>
<p>You don't need to run <code>npm install -g</code> before using a skill. The config just works.</p>

<h3>2. Always gets the latest version</h3>
<p>npx fetches the current published version from npm. When the skill author pushes an update, you automatically get it next time the server starts (after the cache expires).</p>

<h3>3. Works on all operating systems</h3>
<p>npx is part of Node.js, which is installed on Mac, Windows, and Linux. One config format works everywhere.</p>

<h3>4. No PATH issues</h3>
<p>Globally installed packages sometimes don't appear in your PATH (especially on Mac with NVM). npx bypasses this entirely.</p>

<h2>A Real MCP Config Using npx</h2>
<p>Here's what you'll see in a typical <code>claude_desktop_config.json</code>:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>
<p>Breaking this down:</p>
<ul>
  <li><code>"command": "npx"</code> — run npx</li>
  <li><code>"-y"</code> — auto-confirm any install prompt</li>
  <li><code>"@trustedskills/weather-mcp"</code> — the npm package to run</li>
</ul>

<h2>npx vs Global Install: Comparison Table</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Situation</th>
        <th>Use</th>
        <th>Why</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>MCP server in a config file</td>
        <td><code>npx -y</code></td>
        <td>Runs without manual install, works on all machines</td>
      </tr>
      <tr>
        <td>CLI tools you use daily</td>
        <td>Global install</td>
        <td>Faster startup, always available</td>
      </tr>
      <tr>
        <td>One-off script</td>
        <td><code>npx</code></td>
        <td>No clutter, no cleanup needed</td>
      </tr>
      <tr>
        <td>Team project dependency</td>
        <td>Local install in package.json</td>
        <td>Version-locked, reproducible</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Do I Need Node.js Installed?</h2>
<p>Yes — npx is bundled with Node.js. If you don't have Node.js:</p>
<ul>
  <li><strong>Mac:</strong> Install from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> or via Homebrew: <code>brew install node</code></li>
  <li><strong>Windows:</strong> Download the installer from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a></li>
  <li><strong>Linux:</strong> <code>sudo apt install nodejs npm</code> or use <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a></li>
</ul>
<p>After installing Node.js, npx is automatically available. Verify with:</p>
<pre><code class="language-bash">npx --version
# Should print something like: 10.5.0</code></pre>

<div class="tip-box">
  <strong>💡 Tip:</strong> If you get "command not found: npx" after installing Node.js, try closing and reopening your terminal. On Mac with nvm, you may need to add nvm to your shell profile.
</div>

<h2>Summary</h2>
<p>npx is a tool that runs npm packages without installing them globally. MCP configs use <code>npx -y</code> because it's the simplest, most reliable way to run an MCP server: no pre-installation needed, always up-to-date, works on any machine with Node.js installed.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What does npx -y do in an MCP config?</h3>
<p>The <code>-y</code> flag tells npx to automatically answer "yes" to any installation prompts. This is necessary for MCP servers because they are launched automatically by AI clients like Claude Desktop — there's no human present to confirm the install.</p>

<h3>Does npx download the package every time?</h3>
<p>No. npx caches downloaded packages locally. After the first run, subsequent launches are fast because the package is already cached. The cache is updated periodically to fetch new versions.</p>

<h3>Can I use a specific version of an MCP package with npx?</h3>
<p>Yes. Use the <code>@version</code> syntax: <code>npx -y @trustedskills/weather-mcp@1.2.0</code>. This pins the skill to a specific version, which is useful for production environments where you want reproducible behaviour.</p>

<h3>What if npx isn't found on my system?</h3>
<p>npx comes bundled with Node.js v5.2.0 and later. If it's not found, install or reinstall Node.js from nodejs.org. On Windows, make sure "Add to PATH" is checked during installation.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does npx -y do in an MCP config?","acceptedAnswer":{"@type":"Answer","text":"The -y flag tells npx to automatically answer 'yes' to any installation prompts. This is necessary because MCP servers are launched automatically by AI clients — there's no human present to confirm the install."}},{"@type":"Question","name":"Does npx download the package every time?","acceptedAnswer":{"@type":"Answer","text":"No. npx caches downloaded packages locally. After the first run, subsequent launches are fast because the package is already cached. The cache is updated periodically to fetch new versions."}},{"@type":"Question","name":"Can I use a specific version of an MCP package with npx?","acceptedAnswer":{"@type":"Answer","text":"Yes. Use the @version syntax: npx -y @trustedskills/weather-mcp@1.2.0. This pins the skill to a specific version."}},{"@type":"Question","name":"What if npx isn't found on my system?","acceptedAnswer":{"@type":"Answer","text":"npx comes bundled with Node.js v5.2.0 and later. If it's not found, install or reinstall Node.js from nodejs.org."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How MCP Skills Work Together with AI Agents: Full Guide","description":"How MCP skills work together with AI agents — full lifecycle from skill discovery to tool calling, with architecture diagrams and examples.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Understanding <strong>how MCP skills work together</strong> with AI agents: a skill is discovered in the registry, its config is added to your AI client, the client launches the skill as a subprocess MCP server, and the AI model calls the server's tools when relevant to your conversation. Communication is JSON-RPC over stdio — simple, secure, no ports needed.</p>
</div>

<h2>How MCP Skills Work Together: Overview</h2>
<p>A TrustedSkills skill and an MCP server are deeply related — most skills <em>are</em> MCP servers. This article explains <strong>how MCP skills work together</strong> with AI agents, the full lifecycle from discovery to tool call, and the architecture behind it.</p>

<h2>Architecture at a Glance</h2>
<pre><code class="language-bash">┌─────────────────────────────────────────────────────────┐
│                    TrustedSkills Registry                │
│  skill: weather · npm: @trustedskills/weather-mcp       │
└───────────────────────┬─────────────────────────────────┘
                        │ (1) User discovers skill
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  AI Client Config                        │
│  claude_desktop_config.json / ~/.claude/settings.json   │
│  { "mcpServers": { "weather": { "command": "npx",       │
│    "args": ["-y", "@trustedskills/weather-mcp"] } } }   │
└───────────────────────┬─────────────────────────────────┘
                        │ (2) Client starts MCP server process
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  MCP Server Process                      │
│  npx @trustedskills/weather-mcp                         │
│  Listens on stdio · Exposes tools:                      │
│    - get_weather(location, units)                        │
│    - get_forecast(location, days)                        │
└───────────────────────┬─────────────────────────────────┘
                        │ (3) Client discovers tools via MCP
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  AI Model (Claude)                       │
│  Knows about: get_weather, get_forecast                  │
│  User asks: "What's the weather in Sydney?"             │
│  → calls get_weather(location="Sydney", units="metric") │
└─────────────────────────────────────────────────────────┘</code></pre>

<h2>The Full Lifecycle: How MCP Skills Work Together Step by Step</h2>

<h3>Step 1: Discovery</h3>
<p>You browse TrustedSkills and find a skill that does what you need. Each skill's page shows:</p>
<ul>
  <li>What the skill does</li>
  <li>Which platforms it supports</li>
  <li>The MCP config JSON to add to your config file</li>
  <li>Which tools it exposes</li>
</ul>

<h3>Step 2: Configuration</h3>
<p>You add the skill's config to your AI client's config file. For Claude Desktop, this is <code>claude_desktop_config.json</code>. The config tells the client where to find the MCP server (the npm package name).</p>

<h3>Step 3: Server Launch</h3>
<p>When you start (or restart) your AI client, it reads the config and launches each MCP server as a subprocess. The server starts up and begins listening for messages on <strong>stdio</strong> (standard input/output).</p>
<p>This is why the command is <code>npx -y @package/name</code> — the client literally runs this command as a subprocess.</p>

<h3>Step 4: Tool Discovery</h3>
<p>The AI client sends a special MCP message asking the server: "What tools do you have?" The server responds with a list of tool definitions in JSON format:</p>
<pre><code class="language-json">{
  "tools": [
    {
      "name": "get_weather",
      "description": "Get current weather for a location",
      "inputSchema": {
        "type": "object",
        "properties": {
          "location": { "type": "string", "description": "City name or coordinates" },
          "units": { "type": "string", "enum": ["metric", "imperial"] }
        },
        "required": ["location"]
      }
    }
  ]
}</code></pre>

<h3>Step 5: Tool Calling</h3>
<p>When a user asks something that requires a tool, the AI model decides which tool to call and with what arguments. It sends a tool call request to the MCP server:</p>
<pre><code class="language-json">{
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "Sydney, Australia",
      "units": "metric"
    }
  }
}</code></pre>

<h3>Step 6: Result</h3>
<p>The MCP server executes the tool (calls a weather API, reads a file, queries a database — whatever the tool does), and returns the result. The AI model uses this result to formulate its response to the user.</p>

<h2>Skill vs MCP Server: What's the Difference?</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Aspect</th>
        <th>MCP Server</th>
        <th>Skill</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Definition</strong></td>
        <td>Technical process implementing the MCP protocol</td>
        <td>Packaged, documented, versioned capability</td>
      </tr>
      <tr>
        <td><strong>Registry listing</strong></td>
        <td>No — just a running process</td>
        <td>Yes — listed in TrustedSkills with metadata</td>
      </tr>
      <tr>
        <td><strong>Has SKILL.md</strong></td>
        <td>Not required</td>
        <td>Yes — standardised description file</td>
      </tr>
      <tr>
        <td><strong>Platform support</strong></td>
        <td>Any MCP-compatible client</td>
        <td>May support multiple platforms beyond MCP</td>
      </tr>
      <tr>
        <td><strong>Verification</strong></td>
        <td>Not applicable</td>
        <td>Can be Unverified / Community / Verified / Featured</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Communication Protocol (Under the Hood)</h2>
<p>MCP uses <strong>JSON-RPC 2.0</strong> over <strong>stdio</strong> (standard input/output). This means:</p>
<ul>
  <li>The AI client writes JSON messages to the server's stdin</li>
  <li>The server writes JSON responses to its stdout</li>
  <li>No network ports, no HTTP server — just pipes between processes</li>
</ul>
<p>This design is intentional: it's simple, secure (no network exposure), and works consistently across all operating systems.</p>
<p>Some MCP servers also support <strong>SSE (Server-Sent Events)</strong> over HTTP for remote servers, but the local stdio approach is standard for skills installed from TrustedSkills.</p>

<div class="tip-box">
  <strong>💡 Tip:</strong> Because MCP uses stdio (not network ports), skills don't require firewall rules or network configuration. They're inherently local and sandboxed to the process level.
</div>

<h2>Real-World Example: Weather Skill End-to-End</h2>
<p>Here's the complete flow when you ask Claude Desktop "What's the weather in Tokyo?"</p>
<ol>
  <li>You've installed the weather skill: <code>npx -y @trustedskills/weather-mcp</code> is in your config</li>
  <li>Claude Desktop launches the weather MCP server on startup</li>
  <li>The server registers two tools: <code>get_weather</code> and <code>get_forecast</code></li>
  <li>You type: "What's the weather in Tokyo?"</li>
  <li>Claude recognises this needs the <code>get_weather</code> tool</li>
  <li>Claude calls <code>get_weather({ location: "Tokyo", units: "metric" })</code></li>
  <li>The MCP server calls a weather API (e.g. Open-Meteo) and gets the current data</li>
  <li>The server returns: <code>{ temperature: 18, condition: "Partly cloudy", humidity: 72 }</code></li>
  <li>Claude uses this data to give you a natural language answer</li>
</ol>

<h2>Key Takeaways</h2>
<ul>
  <li>Skills are registered capabilities; MCP is the protocol they use to communicate</li>
  <li>The MCP server runs as a local subprocess, launched by your AI client</li>
  <li>Communication is via JSON over stdio — simple and secure</li>
  <li>The AI model decides when to call tools based on your conversation</li>
  <li>You don't need to understand the protocol to use skills — just add the config and restart</li>
</ul>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How does an AI agent know when to use an MCP tool?</h3>
<p>The AI model (e.g. Claude) sees the tool definitions including their names, descriptions, and input schemas. When you ask a question that matches a tool's purpose, the model decides to call it. The better the tool description, the more reliably the AI uses it at the right time.</p>

<h3>Can MCP skills access my files or system?</h3>
<p>Only if the skill is specifically designed to do so (e.g., a file system skill). Each skill only exposes the tools it defines — there is no implicit access. This is why verifying skills before installing them matters: a malicious skill could expose dangerous tools.</p>

<h3>What happens if an MCP server crashes?</h3>
<p>The AI client will typically show an error or stop offering the skill's tools. You may need to restart the AI client to re-launch the server. Claude Desktop shows MCP errors in the developer logs: Settings → Developer → MCP Logs.</p>

<h3>Can I run multiple MCP skills at the same time?</h3>
<p>Yes. Each skill runs as a separate subprocess. You can have many skills running simultaneously — Claude will call whichever tool is most appropriate for each situation.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How does an AI agent know when to use an MCP tool?","acceptedAnswer":{"@type":"Answer","text":"The AI model sees tool definitions including names, descriptions, and input schemas. When you ask a question that matches a tool's purpose, the model decides to call it. The better the tool description, the more reliably the AI uses it."}},{"@type":"Question","name":"Can MCP skills access my files or system?","acceptedAnswer":{"@type":"Answer","text":"Only if the skill is specifically designed to do so. Each skill only exposes the tools it defines — there is no implicit access. This is why verifying skills before installing them matters."}},{"@type":"Question","name":"What happens if an MCP server crashes?","acceptedAnswer":{"@type":"Answer","text":"The AI client will stop offering the skill's tools. You may need to restart the AI client. Claude Desktop shows MCP errors in Settings → Developer → MCP Logs."}},{"@type":"Question","name":"Can I run multiple MCP skills at the same time?","acceptedAnswer":{"@type":"Answer","text":"Yes. Each skill runs as a separate subprocess. You can have many skills running simultaneously — the AI will call whichever tool is most appropriate."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Desktop Mac: Step-by-Step","description":"How to install MCP skills on Claude Desktop Mac — config file location, Node.js setup, JSON format, and troubleshooting.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install MCP skills on Claude Desktop Mac</strong>: open <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>, add your skill inside an <code>mcpServers</code> block using <code>npx -y</code>, save, and fully restart Claude Desktop. The skill will be available in your next conversation.</p>
</div>

<h2>What You Need to Install MCP Skills on Claude Desktop Mac</h2>
<ul>
  <li><strong>Claude Desktop</strong> — download from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a> if you haven't already</li>
  <li><strong>Node.js</strong> — required to run skill packages. Download from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (click the LTS version)</li>
  <li><strong>A text editor</strong> — TextEdit works, but VS Code is better. Both are free.</li>
</ul>

<h2>Step 1: Find Your Config File</h2>
<p><strong>Claude Desktop</strong> stores its configuration in a JSON file. On Mac, it lives here:</p>
<pre><code class="language-bash">~/Library/Application Support/Claude/claude_desktop_config.json</code></pre>
<p>The <code>~</code> symbol means your home folder (e.g. <code>/Users/yourname</code>).</p>

<h3>Open the folder quickly</h3>
<p>In Finder, press <strong>⌘ + Shift + G</strong> (or go to Go → Go to Folder), then paste:</p>
<pre><code class="language-bash">~/Library/Application Support/Claude/</code></pre>
<p>Press Enter. You'll see a folder with the config file inside.</p>
<p>Alternatively, Claude Desktop has a shortcut: open Claude Desktop, go to <strong>Claude → Settings → Developer</strong>, and click <strong>"Edit Config"</strong>. This opens the file directly.</p>

<h2>Step 2: Open the Config File</h2>
<p>Right-click <code>claude_desktop_config.json</code> and choose:</p>
<ul>
  <li><strong>Open With → TextEdit</strong> (built-in, always available)</li>
  <li><strong>Open With → Visual Studio Code</strong> (recommended — better for JSON)</li>
</ul>

<h3>If the file doesn't exist</h3>
<p>If Claude was freshly installed, the config file might not exist yet. Create it:</p>
<ol>
  <li>Open TextEdit</li>
  <li>Go to <strong>Format → Make Plain Text</strong> (very important — TextEdit defaults to rich text)</li>
  <li>Type the empty config: <code>{}</code></li>
  <li>Save it as <code>claude_desktop_config.json</code> in the Claude folder</li>
</ol>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> TextEdit on Mac defaults to rich text format (.rtf). Always switch to plain text (Format → Make Plain Text) before editing JSON, otherwise the file will be corrupted.
</div>

<h2>Step 3: Add the MCP Servers Block</h2>
<p>The config file is JSON format. Here's what a complete config with one skill looks like:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Adding multiple skills</h3>
<p>You can add as many skills as you want. Separate each one with a comma:</p>
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

<h3>Where to get the config snippet</h3>
<p>On any skill's page on TrustedSkills, click the <strong>"MCP"</strong> tab. You'll see the exact JSON snippet to add — just copy and paste it into the <code>mcpServers</code> block.</p>

<h2>Step 4: Save and Restart Claude Desktop</h2>
<ol>
  <li>Save the file (<strong>⌘ + S</strong>)</li>
  <li>Completely quit Claude Desktop: <strong>⌘ + Q</strong> (or Claude → Quit Claude)</li>
  <li>Reopen Claude Desktop from your Applications folder or Dock</li>
</ol>
<p>Claude Desktop reads the config file when it starts. Changes don't take effect until you restart.</p>

<h2>Step 5: Verify Your MCP Skill is Working</h2>
<p>After restarting, open a new conversation in Claude Desktop. Look for the <strong>tools icon</strong> (hammer icon 🔨) in the chat input area. Click it to see which tools are available.</p>
<p>Alternatively, ask Claude: <em>"What tools do you have available?"</em> — it should list the tools provided by your skill.</p>

<h2>Comparison: Config File Locations on Different Platforms</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Platform</th>
        <th>Config file location</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Claude Desktop Mac</td>
        <td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td>
      </tr>
      <tr>
        <td>Claude Desktop Windows</td>
        <td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td>
      </tr>
      <tr>
        <td>Claude Desktop Linux</td>
        <td><code>~/.config/Claude/claude_desktop_config.json</code></td>
      </tr>
      <tr>
        <td>Claude Code (global)</td>
        <td><code>~/.claude/settings.json</code></td>
      </tr>
      <tr>
        <td>Cursor (global)</td>
        <td><code>~/.cursor/mcp.json</code></td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Troubleshooting</h2>

<h3>"The file doesn't exist"</h3>
<p>Create it fresh as described in Step 2. Make sure the file name ends in <code>.json</code> (not <code>.json.txt</code>).</p>

<h3>JSON syntax errors</h3>
<p>JSON is strict about formatting. Common mistakes:</p>
<ul>
  <li>Missing comma between skills</li>
  <li>Trailing comma after the last item</li>
  <li>Using single quotes instead of double quotes</li>
  <li>Missing closing bracket <code>}</code> or <code>]</code></li>
</ul>
<p>Use a JSON validator like <a href="https://jsonlint.com" target="_blank" rel="noopener">jsonlint.com</a> — paste your config and it will highlight any errors.</p>

<h3>"The tool isn't showing up"</h3>
<ul>
  <li>Make sure you fully quit and restarted Claude Desktop (not just closed the window)</li>
  <li>Check that Node.js is installed: open Terminal and run <code>node --version</code></li>
  <li>Check Claude Desktop's logs: go to <strong>Claude → Settings → Developer → MCP Logs</strong></li>
  <li>Make sure the package name in your config is spelled exactly right</li>
</ul>

<div class="tip-box">
  <strong>💡 Tip:</strong> On Mac with nvm installed, Claude Desktop may not find <code>npx</code> in PATH. If this happens, use the full path to npx: run <code>which npx</code> in Terminal to find it, then use that full path in your config's <code>"command"</code> field.
</div>

<h2>Next Steps</h2>
<p>Once you've successfully installed your first skill, browse TrustedSkills to find more. Each skill's page has the exact config snippet you need.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Mac?</h3>
<p>The Claude Desktop config file on Mac is at <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>. You can open it quickly via Claude Desktop's Settings → Developer → Edit Config, or via Finder using ⌘+Shift+G to navigate to that path.</p>

<h3>Do I need to restart Claude Desktop after adding a skill?</h3>
<p>Yes. Claude Desktop reads the config file only on startup. After editing the config, you must fully quit (⌘+Q) and reopen Claude Desktop for the changes to take effect. Simply closing the window is not enough.</p>

<h3>Can I add multiple skills to Claude Desktop on Mac?</h3>
<p>Yes. Add each skill as a separate entry in the <code>mcpServers</code> object. Each skill gets its own key name, and you can have as many skills as you want. Separate entries with commas.</p>

<h3>Why doesn't Claude Desktop find npx on my Mac?</h3>
<p>This usually happens when Node.js is installed via nvm, which adds npx to PATH only for interactive shells. Claude Desktop launches in a non-interactive context and doesn't see it. Fix it by using the full path to npx (find it with <code>which npx</code> in Terminal) in your config's <code>"command"</code> field.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Mac?","acceptedAnswer":{"@type":"Answer","text":"The Claude Desktop config file on Mac is at ~/Library/Application Support/Claude/claude_desktop_config.json. Open it via Settings → Developer → Edit Config."}},{"@type":"Question","name":"Do I need to restart Claude Desktop after adding a skill?","acceptedAnswer":{"@type":"Answer","text":"Yes. Claude Desktop reads the config file only on startup. After editing, fully quit (⌘+Q) and reopen Claude Desktop."}},{"@type":"Question","name":"Can I add multiple skills to Claude Desktop on Mac?","acceptedAnswer":{"@type":"Answer","text":"Yes. Add each skill as a separate entry in the mcpServers object, separated by commas."}},{"@type":"Question","name":"Why doesn't Claude Desktop find npx on my Mac?","acceptedAnswer":{"@type":"Answer","text":"This happens when Node.js is installed via nvm. Fix it by using the full path to npx (find with 'which npx') in the config's command field."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Desktop Windows: Full Guide","description":"Install MCP skills on Claude Desktop Windows — config file location, JSON format, Windows path gotchas, and troubleshooting.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install MCP skills on Claude Desktop Windows</strong>: open <code>%APPDATA%\Claude\claude_desktop_config.json</code>, add your skill inside an <code>mcpServers</code> block with <code>npx -y</code> as the command, save, and fully restart Claude Desktop. If npx isn't found, use its full path from <code>where npx</code>.</p>
</div>

<h2>What You Need</h2>
<ul>
  <li><strong>Claude Desktop</strong> — download from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a></li>
  <li><strong>Node.js</strong> — download the LTS version from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. Run the installer — it also installs npx automatically.</li>
  <li><strong>A text editor</strong> — Notepad works, but <a href="https://code.visualstudio.com" target="_blank" rel="noopener">VS Code</a> is much better for JSON files</li>
</ul>

<h2>Step 1: Find Your Config File</h2>
<p>On Windows, <strong>Claude Desktop</strong> stores its config here:</p>
<pre><code class="language-bash">%APPDATA%\Claude\claude_desktop_config.json</code></pre>
<p><code>%APPDATA%</code> is a special Windows variable that points to your user's AppData folder (usually <code>C:\Users\YourName\AppData\Roaming</code>).</p>

<h3>Open the folder quickly</h3>
<p>Press <strong>Windows + R</strong> to open the Run dialog, then type:</p>
<pre><code class="language-bash">%APPDATA%\Claude</code></pre>
<p>Press Enter. Windows Explorer opens the Claude config folder.</p>

<h3>Or use Claude Desktop's built-in shortcut</h3>
<p>Open Claude Desktop → click the <strong>hamburger menu (≡)</strong> or go to <strong>File → Settings → Developer</strong> → click <strong>"Edit Config"</strong>. This opens the file directly in your default text editor.</p>

<h2>Step 2: Open the Config File</h2>
<p>Right-click <code>claude_desktop_config.json</code> and choose <strong>Open With</strong>:</p>
<ul>
  <li><strong>Notepad</strong> — always available, no install needed</li>
  <li><strong>Visual Studio Code</strong> — recommended, shows JSON errors automatically</li>
</ul>

<h3>If the file doesn't exist</h3>
<ol>
  <li>Open Notepad</li>
  <li>Type: <code>{}</code></li>
  <li>Save as → navigate to <code>%APPDATA%\Claude\</code> → filename: <code>claude_desktop_config.json</code></li>
  <li>Change "Save as type" to <strong>All Files (*.*)</strong> so Notepad doesn't add <code>.txt</code></li>
</ol>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> Notepad defaults to saving as <code>.txt</code>. Always select "All Files (*.*)" as the file type when saving the config, or it will become <code>claude_desktop_config.json.txt</code> which Claude Desktop won't recognise.
</div>

<h2>Step 3: Add the MCP Servers Block</h2>
<p>Here's a complete config with one skill:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Windows-specific gotcha: path separators</h3>
<p>If a skill requires a local file path (not a package name), Windows uses backslashes (<code>\</code>) in paths. In JSON, backslashes must be doubled:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "my-local-skill": {
      "command": "node",
      "args": ["C:\\\\Users\\\\YourName\\\\my-skill\\\\index.js"]
    }
  }
}</code></pre>
<p>Note: for skills from TrustedSkills that use <code>npx</code>, you don't need to worry about paths at all — just use the package name.</p>

<h3>Using the full npx path</h3>
<p>If Claude Desktop can't find <code>npx</code>, find it with:</p>
<pre><code class="language-bash">where npx</code></pre>
<p>Then use that path in the config:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Step 4: Save and Restart Claude Desktop</h2>
<ol>
  <li>Save the file (<strong>Ctrl + S</strong>)</li>
  <li>Completely quit Claude Desktop: right-click the system tray icon → <strong>Quit</strong>, or close the window and end the process in Task Manager</li>
  <li>Reopen Claude Desktop from the Start Menu or taskbar</li>
</ol>

<h2>Step 5: Verify It Worked</h2>
<p>Open a new conversation in Claude Desktop. Look for the tools icon 🔨 in the input bar, or ask Claude: <em>"What tools do you have available?"</em></p>

<h2>Windows vs Mac Config: Key Differences</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Aspect</th>
        <th>Windows</th>
        <th>Mac</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Config location</strong></td>
        <td><code>%APPDATA%\Claude\</code></td>
        <td><code>~/Library/Application Support/Claude/</code></td>
      </tr>
      <tr>
        <td><strong>Path separator in JSON</strong></td>
        <td>Double backslash <code>\\\\</code></td>
        <td>Forward slash <code>/</code></td>
      </tr>
      <tr>
        <td><strong>npx binary name</strong></td>
        <td><code>npx.cmd</code></td>
        <td><code>npx</code></td>
      </tr>
      <tr>
        <td><strong>Text editor</strong></td>
        <td>Notepad (save as All Files)</td>
        <td>TextEdit (use Plain Text mode)</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Troubleshooting</h2>

<h3>"npx is not recognized"</h3>
<p>This means Node.js isn't in your PATH. Solutions:</p>
<ol>
  <li>Reinstall Node.js and check "Add to PATH" during installation</li>
  <li>Or use the full path to npx in your config (see above)</li>
</ol>

<h3>JSON syntax errors</h3>
<p>Windows Notepad doesn't show JSON errors. Use VS Code or <a href="https://jsonlint.com" target="_blank" rel="noopener">jsonlint.com</a> to validate your config.</p>

<h3>Tools not appearing after restart</h3>
<ul>
  <li>Make sure Claude Desktop is fully closed — check Task Manager for lingering processes</li>
  <li>Check logs: Settings → Developer → MCP Logs</li>
  <li>Verify Node.js works: open Command Prompt and type <code>node --version</code></li>
</ul>

<h3>Permission errors</h3>
<p>npx sometimes needs to create a cache directory. If you get permission errors, try running Command Prompt as Administrator once, then install the package manually: <code>npm install -g @trustedskills/weather-mcp</code> — then change the config to use <code>"command": "weather-mcp"</code> instead of npx.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Windows?</h3>
<p>The config file is at <code>%APPDATA%\Claude\claude_desktop_config.json</code>. Press Windows+R and type <code>%APPDATA%\Claude</code> to open the folder directly, or use Claude Desktop's Settings → Developer → Edit Config shortcut.</p>

<h3>Why does my JSON config look different on Windows?</h3>
<p>On Windows, file paths use backslashes which must be doubled in JSON (<code>\\</code> becomes <code>\\\\</code>). For npx-based skills from TrustedSkills, this doesn't matter since you're using a package name, not a file path.</p>

<h3>Claude Desktop won't find npx on Windows — how do I fix it?</h3>
<p>Open Command Prompt and run <code>where npx</code> to find the full path. Then use that path as the <code>"command"</code> value in your config. Remember to double all backslashes in the JSON string.</p>

<h3>Do skills work the same on Windows as on Mac?</h3>
<p>Yes, the skills themselves work identically. The only differences are the config file location and path formatting in JSON. The skills' tools and functionality are cross-platform.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Windows?","acceptedAnswer":{"@type":"Answer","text":"The config file is at %APPDATA%\\Claude\\claude_desktop_config.json. Press Windows+R and type %APPDATA%\\Claude to open the folder."}},{"@type":"Question","name":"Why does my JSON config look different on Windows?","acceptedAnswer":{"@type":"Answer","text":"On Windows, file paths use backslashes which must be doubled in JSON. For npx-based skills, this doesn't matter since you're using a package name."}},{"@type":"Question","name":"Claude Desktop won't find npx on Windows — how do I fix it?","acceptedAnswer":{"@type":"Answer","text":"Run 'where npx' in Command Prompt to find the full path, then use that as the command value in your config, doubling all backslashes."}},{"@type":"Question","name":"Do skills work the same on Windows as on Mac?","acceptedAnswer":{"@type":"Answer","text":"Yes, the skills work identically. The only differences are the config file location and path formatting in JSON."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Claude Desktop Linux: Config & Setup Guide","description":"Install MCP Claude Desktop Linux — config file location, NVM path fixes, and Linux-specific tips for adding MCP skills.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install MCP on Claude Desktop Linux</strong>: edit <code>~/.config/Claude/claude_desktop_config.json</code>, add your skill under <code>mcpServers</code> with <code>npx -y</code>, and restart Claude Desktop. If you use nvm, use the full path to npx or add nvm to your non-interactive shell profile to make Claude Desktop see it.</p>
</div>

<h2>Prerequisites for MCP Claude Desktop Linux</h2>
<ul>
  <li>Claude Desktop installed (AppImage or .deb package from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a>)</li>
  <li>Node.js and npm: <code>sudo apt install nodejs npm</code> or install via <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a> (recommended)</li>
</ul>

<h2>Config File Location on Linux</h2>
<p>On Linux, Claude Desktop follows the XDG spec:</p>
<pre><code class="language-bash">~/.config/Claude/claude_desktop_config.json</code></pre>

<h2>Setting Up the Config</h2>
<p>Create or edit the config file:</p>
<pre><code class="language-bash">mkdir -p ~/.config/Claude
nano ~/.config/Claude/claude_desktop_config.json</code></pre>

<p>Add your skills config:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Config Locations: Linux vs Mac vs Windows</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>OS</th>
        <th>Claude Desktop Config Path</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Linux</strong></td>
        <td><code>~/.config/Claude/claude_desktop_config.json</code></td>
      </tr>
      <tr>
        <td><strong>Mac</strong></td>
        <td><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></td>
      </tr>
      <tr>
        <td><strong>Windows</strong></td>
        <td><code>%APPDATA%\Claude\claude_desktop_config.json</code></td>
      </tr>
    </tbody>
  </table>
</div>

<h2>NVM Note — The Most Common Linux Issue</h2>
<p>If you installed Node.js via nvm, Claude Desktop might not find <code>npx</code> because nvm sets up PATH only for interactive shells. Claude Desktop launches non-interactively and doesn't get the nvm PATH.</p>

<h3>Fix Option 1: Use the full path to npx</h3>
<pre><code class="language-bash"># Find the path to npx
which npx
# Usually: /home/yourname/.nvm/versions/node/v20.x.x/bin/npx</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "/home/yourname/.nvm/versions/node/v20.x.x/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Fix Option 2: Add nvm to your non-interactive profile</h3>
<p>Add to <code>~/.profile</code> or <code>~/.bashrc</code>:</p>
<pre><code class="language-bash">export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"</code></pre>

<div class="tip-box">
  <strong>💡 Tip:</strong> Fix Option 1 (full path) is more reliable because it doesn't depend on shell initialisation order. Use it if Option 2 doesn't work.
</div>

<h2>Restart and Verify</h2>
<pre><code class="language-bash"># Close Claude Desktop completely, then reopen it
# Or restart via command line:
pkill -f "Claude" && sleep 2 && claude-desktop &</code></pre>

<p>Verify by opening a conversation and asking: <em>"What tools do you have?"</em></p>

<h2>Viewing Logs</h2>
<p>Claude Desktop MCP logs are in:</p>
<pre><code class="language-bash">~/.config/Claude/logs/</code></pre>
<pre><code class="language-bash">tail -f ~/.config/Claude/logs/mcp*.log</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Desktop config file on Linux?</h3>
<p>On Linux, the config file is at <code>~/.config/Claude/claude_desktop_config.json</code>, following the XDG Base Directory specification. Create the directory with <code>mkdir -p ~/.config/Claude</code> if it doesn't exist.</p>

<h3>Why can't Claude Desktop find npx on Linux?</h3>
<p>The most common cause is nvm. When Node.js is installed via nvm, it adds npx to PATH only for interactive shells. Claude Desktop launches non-interactively. Fix this by using the full path to npx in your config, or by adding nvm initialisation to <code>~/.profile</code>.</p>

<h3>Does Claude Desktop work on all Linux distributions?</h3>
<p>Claude Desktop is available as an AppImage (works on most distributions) and as a .deb package (Ubuntu/Debian). The MCP config setup is identical across all distributions.</p>

<h3>How do I update an MCP skill on Linux?</h3>
<p>npx caches packages but will check for updates. To force a fresh download, clear the npx cache: <code>npx clear-npx-cache</code>. Or specify no version in your config to always get the latest on next restart.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Desktop config file on Linux?","acceptedAnswer":{"@type":"Answer","text":"On Linux, the config is at ~/.config/Claude/claude_desktop_config.json, following XDG spec. Create the directory with mkdir -p ~/.config/Claude if needed."}},{"@type":"Question","name":"Why can't Claude Desktop find npx on Linux?","acceptedAnswer":{"@type":"Answer","text":"Usually because nvm adds npx to PATH only for interactive shells. Fix by using the full path to npx in your config, found with 'which npx'."}},{"@type":"Question","name":"Does Claude Desktop work on all Linux distributions?","acceptedAnswer":{"@type":"Answer","text":"Claude Desktop is available as an AppImage (most distros) and .deb (Ubuntu/Debian). The MCP config setup is identical across distributions."}},{"@type":"Question","name":"How do I update an MCP skill on Linux?","acceptedAnswer":{"@type":"Answer","text":"Clear the npx cache with 'npx clear-npx-cache' to force a fresh download on next restart."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code VS Code MCP Setup: Complete Beginner's Guide","description":"Claude Code VS Code MCP setup guide for complete beginners — install the extension, configure MCP skills, and start using AI tools in your coding environment.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>For <strong>Claude Code VS Code MCP setup</strong>: install the Claude Code extension from the VS Code marketplace, then add your MCP skills to <code>~/.claude/settings.json</code> (global) or <code>.claude/settings.json</code> (project). Reload Claude Code with Ctrl+Shift+P → "Claude Code: Restart" to pick up changes, then run <code>/tools</code> to verify.</p>
</div>

<h2>What is Claude Code?</h2>
<p><strong>Claude Code</strong> is Anthropic's AI coding assistant — it's Claude, but specialised for software development. Unlike Claude Desktop (a chat app), Claude Code integrates directly into your coding environment.</p>
<p>Claude Code runs in your terminal or inside VS Code, where it can:</p>
<ul>
  <li>Read and write files in your project</li>
  <li>Run terminal commands</li>
  <li>Understand your entire codebase</li>
  <li>Use MCP skills/tools to extend its capabilities</li>
</ul>

<h2>Two Ways to Use Claude Code</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>How to launch</th>
        <th>Best for</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Terminal (CLI)</strong></td>
        <td>Run <code>claude</code> in any terminal</td>
        <td>Quick tasks, scripting, servers</td>
      </tr>
      <tr>
        <td><strong>VS Code Extension</strong></td>
        <td>Sidebar panel in VS Code</td>
        <td>Active development, code reviews</td>
      </tr>
    </tbody>
  </table>
</div>
<p>This guide focuses on the VS Code extension, but the MCP config is the same for both.</p>

<h2>Installing Claude Code in VS Code</h2>
<ol>
  <li>Open VS Code</li>
  <li>Press <strong>Ctrl+Shift+X</strong> (Windows/Linux) or <strong>⌘+Shift+X</strong> (Mac) to open Extensions</li>
  <li>Search for <strong>"Claude Code"</strong></li>
  <li>Click <strong>Install</strong> on the Anthropic extension</li>
  <li>Sign in with your Anthropic account when prompted</li>
</ol>

<h2>Understanding MCP in Claude Code VS Code Setup</h2>
<p>Just like Claude Desktop, <strong>Claude Code</strong> supports MCP — the protocol that lets Claude call external tools. MCP skills work the same way in Claude Code as in Claude Desktop: they're subprocess servers that Claude communicates with.</p>
<p>The difference is where the config lives.</p>

<h2>Where the MCP Config Lives</h2>
<p>Claude Code has two config locations:</p>

<h3>Global config (recommended for personal tools)</h3>
<pre><code class="language-bash"># Mac/Linux:
~/.claude/settings.json

# Windows:
%USERPROFILE%\.claude\settings.json</code></pre>
<p>Skills added here are available in <em>every</em> project you open with Claude Code.</p>

<h3>Project config (for team/project-specific tools)</h3>
<pre><code class="language-bash"># In your project's root folder:
.claude/settings.json</code></pre>
<p>Skills added here are only available when working in that specific project.</p>

<h2>Adding Your First MCP Skill to Claude Code VS Code</h2>

<h3>Option A: Using the CLI (easiest)</h3>
<pre><code class="language-bash"># Install Claude Code CLI first if you haven't:
npm install -g @anthropic-ai/claude-code

# Add a skill globally:
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Verify it was added:
claude mcp list</code></pre>

<h3>Option B: Manually edit settings.json</h3>
<ol>
  <li>Create or open <code>~/.claude/settings.json</code></li>
  <li>Add the <code>mcpServers</code> block:</li>
</ol>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Reloading Claude Code to Pick Up Changes</h2>
<p>After editing the config:</p>
<ul>
  <li><strong>In VS Code:</strong> Press <strong>Ctrl+Shift+P</strong> → type "Claude Code: Restart" → Enter</li>
  <li><strong>In terminal:</strong> Exit Claude (<code>/quit</code>) and relaunch with <code>claude</code></li>
</ul>

<div class="tip-box">
  <strong>💡 Tip:</strong> The <code>claude mcp add</code> CLI command modifies your config file automatically AND restarts the MCP connection. It's the fastest way to add a skill without manual JSON editing.
</div>

<h2>Verify the MCP Skill is Working</h2>
<p>In Claude Code, type:</p>
<pre><code class="language-bash">/tools</code></pre>
<p>This lists all available MCP tools. Your new skill's tools should appear in the list.</p>
<p>Or ask Claude directly: <em>"What tools do you have access to?"</em></p>

<h2>Next Steps</h2>
<p>Read about <a href="/docs/claude-code/global-vs-project">Global vs Project-Level config</a> to understand when to use each location, especially if you work on a team.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What is Claude Code and how is it different from Claude Desktop?</h3>
<p>Claude Desktop is a standalone chat app for general use. Claude Code is specifically designed for software development — it integrates with VS Code, can read/write your project files, and run terminal commands. Both support MCP skills.</p>

<h3>Where does Claude Code store its MCP settings?</h3>
<p>Global settings (all projects) are at <code>~/.claude/settings.json</code>. Project-specific settings are at <code>.claude/settings.json</code> in your project root. The CLI command <code>claude mcp add</code> modifies the global settings by default.</p>

<h3>Do I need both Claude Desktop and Claude Code?</h3>
<p>No, they serve different purposes. Use Claude Desktop for general AI chat tasks, and Claude Code when you're actively writing or reviewing code in VS Code. Many developers use both.</p>

<h3>Can I use the same MCP skills in Claude Code that I use in Claude Desktop?</h3>
<p>Yes. MCP skills are platform-agnostic. Any skill that works in Claude Desktop will also work in Claude Code — just add the same config snippet to the appropriate settings.json file.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is Claude Code and how is it different from Claude Desktop?","acceptedAnswer":{"@type":"Answer","text":"Claude Desktop is a standalone chat app. Claude Code is designed for software development — it integrates with VS Code, reads/writes project files, and runs terminal commands. Both support MCP skills."}},{"@type":"Question","name":"Where does Claude Code store its MCP settings?","acceptedAnswer":{"@type":"Answer","text":"Global settings are at ~/.claude/settings.json. Project settings are at .claude/settings.json in your project root."}},{"@type":"Question","name":"Can I use the same MCP skills in Claude Code that I use in Claude Desktop?","acceptedAnswer":{"@type":"Answer","text":"Yes. MCP skills are platform-agnostic. Add the same config snippet to ~/.claude/settings.json and the skill will work in Claude Code."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Claude Code MCP Global vs Project Config: When to Use Each","description":"Claude Code MCP global project config — when to use global vs project-level settings and how to share skills with your team.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>In <strong>Claude Code MCP global vs project config</strong>: use <strong>global</strong> (<code>~/.claude/settings.json</code>) for personal tools and credentials you use everywhere; use <strong>project</strong> (<code>.claude/settings.json</code> in project root) for team tools you want to commit to git. Never commit personal API keys in project config.</p>
</div>

<h2>Two Config Locations</h2>
<p><strong>Claude Code MCP global project config</strong> — Claude Code supports MCP config in two places. Understanding which to use is important for both solo developers and teams.</p>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Config Type</th>
        <th>Location (Mac/Linux)</th>
        <th>Location (Windows)</th>
        <th>Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Global</strong></td>
        <td><code>~/.claude/settings.json</code></td>
        <td><code>%USERPROFILE%\\.claude\\settings.json</code></td>
        <td>All projects on this machine</td>
      </tr>
      <tr>
        <td><strong>Project</strong></td>
        <td><code>.claude/settings.json</code> (in project root)</td>
        <td><code>.claude\\settings.json</code> (in project root)</td>
        <td>Only this project</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Global Config — Personal Tools</h2>
<p>The global config at <code>~/.claude/settings.json</code> is your personal, machine-wide config. Skills added here follow you across every project.</p>

<h3>Best for:</h3>
<ul>
  <li>Personal productivity tools (weather, calendar, notes)</li>
  <li>Tools you use in every project (web search, calculator)</li>
  <li>Tools with your personal API keys (your personal GitHub token, etc.)</li>
  <li>Developer tools that are personal to you (your SSH keys, your cloud credentials)</li>
</ul>

<h3>Example global config:</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    },
    "web-search": {
      "command": "npx",
      "args": ["-y", "@trustedskills/web-search-mcp"],
      "env": {
        "SEARCH_API_KEY": "your-personal-api-key"
      }
    }
  }
}</code></pre>

<h2>Project Config — Team Tools</h2>
<p>The project config at <code>.claude/settings.json</code> (in your project's root directory) is for tools specific to that project or team.</p>

<h3>Best for:</h3>
<ul>
  <li>Database tools connected to the project's dev DB</li>
  <li>Project-specific code generators or validators</li>
  <li>Shared tools that every developer on the team should have</li>
  <li>Tools with project-specific config (not personal credentials)</li>
</ul>

<h3>Example project config:</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@trustedskills/postgres-mcp"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/myapp_dev"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@trustedskills/github-mcp"],
      "env": {
        "GITHUB_REPO": "myorg/myrepo"
      }
    }
  }
}</code></pre>

<h2>Sharing Project Config With Your Team</h2>
<p>The big advantage of project-level config: <strong>you can commit it to git</strong>.</p>
<pre><code class="language-bash">git add .claude/settings.json
git commit -m "Add MCP tools for development"
git push</code></pre>
<p>Now every developer who clones the repo gets the same tools automatically.</p>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> Never commit API keys or passwords in the config file. A leaked key in git history can cause serious security incidents. Use environment variables referenced from your shell or a <code>.env</code> file (gitignored) instead.
</div>

<h3>Safe way to handle secrets in project config:</h3>
<pre><code class="language-json">// .claude/settings.json (safe to commit — no secrets)
{
  "mcpServers": {
    "my-api": {
      "command": "npx",
      "args": ["-y", "@trustedskills/my-api-mcp"],
      "env": {
        "API_KEY": "${MY_API_KEY}"
      }
    }
  }
}</code></pre>
<p>Each developer sets <code>MY_API_KEY</code> in their shell or <code>.env</code> file.</p>

<h2>Global vs Project Config: Pros and Cons</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Global Config</th>
        <th>Project Config</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Pros</strong></td>
        <td>Always available, personal tools, one place to manage</td>
        <td>Shared with team via git, project-specific, version-controlled</td>
      </tr>
      <tr>
        <td><strong>Cons</strong></td>
        <td>Not shared with team, can clutter with unused tools</td>
        <td>Must be committed, can't store personal secrets</td>
      </tr>
      <tr>
        <td><strong>Secret storage</strong></td>
        <td>Fine — never committed</td>
        <td>Risky — don't commit secrets</td>
      </tr>
      <tr>
        <td><strong>Team sharing</strong></td>
        <td>Not possible (per-machine)</td>
        <td>Easy via git</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Decision Framework</h2>
<p>Ask yourself:</p>
<ol>
  <li><em>"Should everyone on my team have this tool?"</em> → Yes: project config. No: global config.</li>
  <li><em>"Does this tool use my personal credentials?"</em> → Yes: global config (don't commit personal secrets).</li>
  <li><em>"Do I want this tool in every project I work on?"</em> → Yes: global config.</li>
</ol>

<div class="tip-box">
  <strong>💡 Tip:</strong> Project config overrides global config when the same server name appears in both. Use this to give teams a project-specific version of a tool without removing developers' global personal defaults.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What happens if I have the same skill in both global and project config?</h3>
<p>Project config takes precedence over global config. If the same server name appears in both, the project version is used when working in that project. This lets teams override individual developers' defaults for specific projects.</p>

<h3>Can I commit the project config to git without exposing secrets?</h3>
<p>Yes — as long as you don't put secrets directly in the config. Reference environment variables using <code>${VAR_NAME}</code> syntax, and set those variables in each developer's shell or a gitignored <code>.env</code> file.</p>

<h3>How do I add a project-scoped skill using the CLI?</h3>
<p>Use the <code>--project</code> flag: <code>claude mcp add my-tool --project -- npx -y @trustedskills/my-tool-mcp</code>. This writes to <code>.claude/settings.json</code> in your current directory instead of the global config.</p>

<h3>Does the project config work for all Claude Code users who clone my repo?</h3>
<p>Yes, as long as they have Claude Code installed and Node.js available. The project config will be automatically picked up when they open the project in Claude Code.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What happens if I have the same skill in both global and project config?","acceptedAnswer":{"@type":"Answer","text":"Project config takes precedence. If the same server name appears in both, the project version is used when working in that project."}},{"@type":"Question","name":"Can I commit the project config to git without exposing secrets?","acceptedAnswer":{"@type":"Answer","text":"Yes — reference environment variables using ${VAR_NAME} syntax and set those variables in each developer's shell or a gitignored .env file."}},{"@type":"Question","name":"How do I add a project-scoped skill using the CLI?","acceptedAnswer":{"@type":"Answer","text":"Use the --project flag: claude mcp add my-tool --project -- npx -y @trustedskills/my-tool-mcp"}},{"@type":"Question","name":"Does the project config work for all Claude Code users who clone my repo?","acceptedAnswer":{"@type":"Answer","text":"Yes, as long as they have Claude Code and Node.js installed. The project config is picked up automatically."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Code Mac: CLI & Manual Methods","description":"Install MCP skills for Claude Code on Mac — CLI commands, manual config editing, NVM workarounds, and verification steps.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Install MCP skills for <strong>Claude Code on Mac</strong> with: <code>claude mcp add &lt;name&gt; -- npx -y &lt;package&gt;</code> for global skills, or edit <code>~/.claude/settings.json</code> manually. If using nvm, use the full path to npx in your config.</p>
</div>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed (<code>node --version</code> to verify)</li>
  <li>Claude Code CLI: <code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: Using the CLI (Recommended)</h2>
<p>The <code>claude mcp add</code> command is the easiest way to add MCP skills on Mac:</p>
<pre><code class="language-bash"># Add a skill globally (available in all projects)
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Add a skill to the current project only
claude mcp add weather --project -- npx -y @trustedskills/weather-mcp

# Add a skill with environment variables
claude mcp add my-api -e API_KEY=your-key -- npx -y @trustedskills/my-api-mcp</code></pre>

<h3>Manage installed skills</h3>
<pre><code class="language-bash"># List all installed skills
claude mcp list

# Remove a skill
claude mcp remove weather

# Get details about a skill
claude mcp get weather</code></pre>

<h2>Method 2: Manual Config Edit</h2>
<p>Open your global config:</p>
<pre><code class="language-bash">mkdir -p ~/.claude
code ~/.claude/settings.json  # Opens in VS Code</code></pre>

<p>Or use any editor:</p>
<pre><code class="language-bash">open -e ~/.claude/settings.json  # TextEdit
nano ~/.claude/settings.json     # Terminal editor</code></pre>

<p>Add the <code>mcpServers</code> block:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>NVM Users on Mac</h2>
<p>If you use nvm and Claude Code can't find npx, add the full path:</p>
<pre><code class="language-bash"># Find your npx path
which npx
# Output: /Users/yourname/.nvm/versions/node/v20.0.0/bin/npx</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "/Users/yourname/.nvm/versions/node/v20.0.0/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="tip-box">
  <strong>💡 Tip:</strong> Instead of hardcoding the version number, create a symlink: <code>ln -sf $(which npx) /usr/local/bin/npx</code>. Then you can use <code>/usr/local/bin/npx</code> in your config, and it stays valid across nvm version upgrades.
</div>

<h2>Verify the Installation</h2>
<pre><code class="language-bash"># List all configured MCP servers
claude mcp list

# Start Claude Code and check tools
claude
# Then in the session:
/tools</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What's the difference between claude mcp add and editing settings.json directly?</h3>
<p>Both achieve the same result. <code>claude mcp add</code> is faster and handles formatting automatically. Manual editing gives you more control, useful when adding environment variables or complex configurations.</p>

<h3>How do I add a skill with an API key on Mac?</h3>
<p>Use the <code>-e</code> flag with the CLI: <code>claude mcp add my-skill -e API_KEY=abc123 -- npx -y @package/name</code>. Or add it to the <code>"env"</code> block in your settings.json manually.</p>

<h3>How do I know if an MCP skill loaded successfully on Mac?</h3>
<p>Run <code>claude mcp list</code> to see configured skills. Start Claude with <code>claude</code> and type <code>/tools</code> to see which tools are available. If a skill failed to load, the tool won't appear and Claude Code will show an error.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What's the difference between claude mcp add and editing settings.json directly?","acceptedAnswer":{"@type":"Answer","text":"Both achieve the same result. 'claude mcp add' is faster and handles formatting automatically. Manual editing gives more control for complex configurations."}},{"@type":"Question","name":"How do I add a skill with an API key on Mac?","acceptedAnswer":{"@type":"Answer","text":"Use the -e flag: claude mcp add my-skill -e API_KEY=abc123 -- npx -y @package/name"}},{"@type":"Question","name":"How do I know if an MCP skill loaded successfully on Mac?","acceptedAnswer":{"@type":"Answer","text":"Run 'claude mcp list' to see configured skills, then start Claude and type /tools to see loaded tools."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Claude Code Windows: CLI & Config Guide","description":"Install MCP skills for Claude Code on Windows — CLI commands, settings.json location, and Windows path formatting.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Install MCP skills for <strong>Claude Code on Windows</strong>: open PowerShell and run <code>claude mcp add &lt;name&gt; -- npx -y &lt;package&gt;</code>, or edit <code>%USERPROFILE%\\.claude\\settings.json</code> manually. If npx isn't found, use its full path from <code>where npx</code>.</p>
</div>

<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a></li>
  <li>Claude Code CLI: open PowerShell and run:<br><code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: Using the CLI</h2>
<p>Open PowerShell or Command Prompt:</p>
<pre><code class="language-bash"># Add a skill globally
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# List installed skills
claude mcp list

# Remove a skill
claude mcp remove weather</code></pre>

<h2>Method 2: Manual Config Edit</h2>
<p>The global config on Windows lives at:</p>
<pre><code class="language-bash">%USERPROFILE%\.claude\settings.json</code></pre>
<p>Open it in VS Code:</p>
<pre><code class="language-bash">code $env:USERPROFILE\.claude\settings.json</code></pre>
<p>Or in Notepad:</p>
<pre><code class="language-bash">notepad $env:USERPROFILE\.claude\settings.json</code></pre>

<p>Add your skills:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Windows Path Notes</h2>
<p>If you need to specify the full path to npx.cmd (common when npx isn't in PATH):</p>
<pre><code class="language-bash">where npx
# C:\Program Files\nodejs\npx.cmd</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Verify the Installation</h2>
<pre><code class="language-bash">claude mcp list</code></pre>
<p>Start Claude Code and run <code>/tools</code> to see available tools.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Claude Code settings.json on Windows?</h3>
<p>The global settings file is at <code>%USERPROFILE%\.claude\settings.json</code>. In PowerShell, access it with <code>$env:USERPROFILE\.claude\settings.json</code>. You can open the folder in Explorer with <code>explorer $env:USERPROFILE\.claude</code>.</p>

<h3>Why does Claude Code say "npx not found" on Windows?</h3>
<p>This means npx isn't in the system PATH. Run <code>where npx</code> in Command Prompt to find the full path, then use that path as the <code>"command"</code> value in settings.json. Remember to double backslashes in JSON strings.</p>

<h3>Can I run Claude Code in Windows Subsystem for Linux (WSL)?</h3>
<p>Yes. In WSL, use the Linux config path (<code>~/.claude/settings.json</code>) and Linux-style paths. Note that WSL and Windows Claude Code have separate configs — skills added in WSL won't appear in Windows Claude Code.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Claude Code settings.json on Windows?","acceptedAnswer":{"@type":"Answer","text":"The global settings file is at %USERPROFILE%\\.claude\\settings.json. Access it with $env:USERPROFILE\\.claude\\settings.json in PowerShell."}},{"@type":"Question","name":"Why does Claude Code say npx not found on Windows?","acceptedAnswer":{"@type":"Answer","text":"npx isn't in PATH. Run 'where npx' to find the full path, then use that as the command value in settings.json, doubling all backslashes."}},{"@type":"Question","name":"Can I run Claude Code in WSL?","acceptedAnswer":{"@type":"Answer","text":"Yes. In WSL use ~/.claude/settings.json and Linux paths. WSL and Windows Claude Code have separate configs."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Cursor Mac: Config Guide & Reload Tips","description":"Install MCP skills on Cursor Mac — config location at ~/.cursor/mcp.json, JSON format, reload method, and verification.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install MCP skills on Cursor Mac</strong>: edit <code>~/.cursor/mcp.json</code> (global) or <code>.cursor/mcp.json</code> in your project root. Add your skills under <code>mcpServers</code> with <code>npx -y</code>, then restart Cursor or reload via Settings → MCP Servers. Open Cursor Chat (⌘+L) and ask "what tools do you have?" to verify.</p>
</div>

<h2>About Cursor MCP Support</h2>
<p>Cursor (the AI-powered code editor built on VS Code) supports <strong>MCP tools</strong> natively. MCP servers you configure in Cursor are available to the Cursor AI assistant in chat and inline editing.</p>

<h2>Config File Location for Cursor Mac</h2>
<p>Cursor's MCP config on Mac lives at:</p>
<pre><code class="language-bash">~/.cursor/mcp.json</code></pre>
<p>This is a <em>global</em> config — available in all Cursor projects.</p>
<p>Cursor also supports project-level config at:</p>
<pre><code class="language-bash">.cursor/mcp.json  # In your project root</code></pre>

<h2>Creating or Editing the Config</h2>
<pre><code class="language-bash"># Create the directory if it doesn't exist
mkdir -p ~/.cursor

# Open in VS Code (or any editor)
code ~/.cursor/mcp.json</code></pre>

<p>Add your skills using this format:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Multiple skills example:</h3>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@trustedskills/github-mcp"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}</code></pre>

<h2>Cursor vs Claude Code: Config Comparison</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Aspect</th>
        <th>Cursor Mac</th>
        <th>Claude Code Mac</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Global config</strong></td>
        <td><code>~/.cursor/mcp.json</code></td>
        <td><code>~/.claude/settings.json</code></td>
      </tr>
      <tr>
        <td><strong>Project config</strong></td>
        <td><code>.cursor/mcp.json</code></td>
        <td><code>.claude/settings.json</code></td>
      </tr>
      <tr>
        <td><strong>Config key</strong></td>
        <td><code>mcpServers</code></td>
        <td><code>mcpServers</code></td>
      </tr>
      <tr>
        <td><strong>CLI tool</strong></td>
        <td>Manual only</td>
        <td><code>claude mcp add</code></td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Restarting Cursor to Pick Up Changes</h2>
<p>After editing the config, restart the MCP server in Cursor:</p>
<ul>
  <li>Open Cursor Settings (<strong>⌘ + ,</strong>)</li>
  <li>Navigate to <strong>Features → MCP Servers</strong></li>
  <li>Click the refresh/restart button next to your server</li>
</ul>
<p>Or restart Cursor completely: <strong>⌘ + Q</strong> → reopen.</p>

<h2>Viewing the Cursor MCP Settings UI</h2>
<p>Cursor has a built-in UI for managing MCP servers:</p>
<ol>
  <li>Open Settings (<strong>⌘ + ,</strong>)</li>
  <li>Search for "MCP"</li>
  <li>Click <strong>Edit in settings.json</strong> or use the Add Server button</li>
</ol>

<h2>Verifying MCP Skills Are Working</h2>
<p>Open Cursor Chat (<strong>⌘ + L</strong>) and type:</p>
<pre><code class="language-bash">What tools do you have available?</code></pre>
<p>Cursor will list all available MCP tools.</p>

<h2>Troubleshooting</h2>
<ul>
  <li>Check that Node.js is in PATH: <code>which npx</code></li>
  <li>If using nvm, use the full path to npx in your config</li>
  <li>View MCP logs in Cursor's output panel: <strong>View → Output → MCP</strong></li>
</ul>

<div class="tip-box">
  <strong>💡 Tip:</strong> Cursor's MCP Servers settings panel (Settings → Features → MCP Servers) shows each server's status with a green/red indicator. This is the fastest way to confirm whether a skill loaded successfully without starting a chat.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Cursor MCP config file on Mac?</h3>
<p>Cursor's global MCP config on Mac is at <code>~/.cursor/mcp.json</code>. For project-specific tools, create <code>.cursor/mcp.json</code> in your project root. Both files use the same JSON format with an <code>mcpServers</code> key.</p>

<h3>How do I reload MCP skills in Cursor without restarting?</h3>
<p>Go to Settings (⌘+,) → search "MCP" → navigate to MCP Servers → click the restart/refresh button next to the server. This reloads just that MCP server without restarting the entire editor.</p>

<h3>Do Cursor MCP skills work in both chat and inline editing?</h3>
<p>Yes. MCP tools are available in Cursor Chat (⌘+L) and when using Cursor's inline AI features. The AI will automatically use relevant tools based on what you're asking.</p>

<h3>Can I use the same MCP skills in both Cursor and Claude Code?</h3>
<p>Yes — the skills themselves are identical. You need to add the same config entry to both <code>~/.cursor/mcp.json</code> and <code>~/.claude/settings.json</code> separately, since each editor manages its own config.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Cursor MCP config file on Mac?","acceptedAnswer":{"@type":"Answer","text":"Cursor's global MCP config on Mac is at ~/.cursor/mcp.json. For project-specific tools, create .cursor/mcp.json in your project root."}},{"@type":"Question","name":"How do I reload MCP skills in Cursor without restarting?","acceptedAnswer":{"@type":"Answer","text":"Go to Settings → search MCP → navigate to MCP Servers → click the restart button next to the server."}},{"@type":"Question","name":"Can I use the same MCP skills in both Cursor and Claude Code?","acceptedAnswer":{"@type":"Answer","text":"Yes, but you need to add the config to both ~/.cursor/mcp.json and ~/.claude/settings.json separately."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install MCP Skills Cursor Windows: Config & Path Guide","description":"Install MCP skills for Cursor on Windows — config location, JSON format, Windows path issues, and verification steps.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To install MCP skills on <strong>Cursor Windows</strong>: edit <code>%USERPROFILE%\\.cursor\\mcp.json</code>, add skills under <code>mcpServers</code> using <code>npx -y</code>. If npx isn't found, use the full path from <code>Get-Command npx</code>. Reload via Settings → MCP Servers or restart Cursor.</p>
</div>

<h2>Config File Location</h2>
<p>Cursor's global MCP config on Windows:</p>
<pre><code class="language-bash">%USERPROFILE%\.cursor\mcp.json</code></pre>
<p>This is usually: <code>C:\Users\YourName\.cursor\mcp.json</code></p>

<h2>Creating or Editing the Config</h2>
<p>Open PowerShell:</p>
<pre><code class="language-bash"># Create directory if needed
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.cursor"

# Open in VS Code
code "$env:USERPROFILE\.cursor\mcp.json"</code></pre>

<p>Add your skills:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Windows Path Gotcha</h2>
<p>If npx isn't recognised, find and use the full path:</p>
<pre><code class="language-bash"># In PowerShell
Get-Command npx | Select-Object -ExpandProperty Source
# Usually: C:\Program Files\nodejs\npx.cmd</code></pre>
<pre><code class="language-json">{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> In JSON strings on Windows, every backslash must be doubled. A path like <code>C:\Program Files\nodejs\npx.cmd</code> becomes <code>C:\\\\Program Files\\\\nodejs\\\\npx.cmd</code> in JSON.
</div>

<h2>Restarting Cursor</h2>
<p>After editing the config:</p>
<ul>
  <li>Go to <strong>File → Preferences → Settings</strong> (Ctrl+,)</li>
  <li>Search for MCP and click the restart button for your server</li>
  <li>Or close and reopen Cursor</li>
</ul>

<h2>Verifying It Works</h2>
<p>Open Cursor Chat (<strong>Ctrl + L</strong>) and ask: <em>"What tools do you have available?"</em></p>

<div class="tip-box">
  <strong>💡 Tip:</strong> Cursor's Settings → Features → MCP Servers panel shows a status indicator for each server. A green dot means the server loaded successfully; red means there was an error (usually a path or Node.js issue).
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Where is the Cursor MCP config on Windows?</h3>
<p>Cursor's MCP config is at <code>%USERPROFILE%\.cursor\mcp.json</code>. Open it with <code>code $env:USERPROFILE\.cursor\mcp.json</code> in PowerShell, or navigate there in Explorer with <code>explorer $env:USERPROFILE\.cursor</code>.</p>

<h3>How do I fix "npx not recognized" in Cursor on Windows?</h3>
<p>Run <code>Get-Command npx | Select-Object -ExpandProperty Source</code> in PowerShell to get the full path, then use that as the <code>"command"</code> value in your mcp.json. Remember to double all backslashes.</p>

<h3>Does Cursor support project-level MCP config on Windows?</h3>
<p>Yes. Create <code>.cursor\mcp.json</code> in your project root. This config applies only to that project and can be committed to git for team sharing (without secrets).</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Where is the Cursor MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"Cursor's MCP config is at %USERPROFILE%\\.cursor\\mcp.json. Open with code $env:USERPROFILE\\.cursor\\mcp.json in PowerShell."}},{"@type":"Question","name":"How do I fix npx not recognized in Cursor on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run 'Get-Command npx | Select-Object -ExpandProperty Source' to get the full path, then use it as the command value with doubled backslashes."}},{"@type":"Question","name":"Does Cursor support project-level MCP config on Windows?","acceptedAnswer":{"@type":"Answer","text":"Yes. Create .cursor\\mcp.json in your project root for project-specific tools you can commit to git."}}]}
</script>
    `,
  },

  // ─── OPENCLAW ───────────────────────────────────────────────────────────────
  {
    slug: ['openclaw', 'mac'],
    title: 'Install Skills OpenClaw Mac: One-Command Setup Guide',
    description: 'Install skills on OpenClaw Mac with a single command — no JSON editing needed. OpenClaw manages MCP config automatically. Browse TrustedSkills, run openclaw skills install, and you\'re done.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Mac: One-Command Setup Guide","description":"Install skills on OpenClaw Mac with one command. No JSON editing — OpenClaw manages MCP config automatically.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install skills on OpenClaw Mac</strong>, just run: <code>openclaw skills install &lt;skill-name&gt;</code>. OpenClaw handles everything automatically — downloads the skill, configures MCP, and makes it available immediately. No JSON files to edit, no restart needed.</p>
</div>

<h2>Why OpenClaw is the Easiest Way to Install Skills on Mac</h2>
<p>Unlike other platforms where you need to manually edit JSON config files, <strong>OpenClaw</strong> has a built-in skill manager. Installing a skill is one command — and it works immediately.</p>

<h2>Installing a Skill on OpenClaw Mac</h2>
<pre><code class="language-bash">openclaw skills install weather</code></pre>
<p>That's it. OpenClaw:</p>
<ol>
  <li>Fetches the skill metadata from TrustedSkills</li>
  <li>Downloads and installs the skill package</li>
  <li>Adds it to your OpenClaw config automatically</li>
  <li>The skill is immediately available — no restart needed</li>
</ol>

<h2>OpenClaw vs Other Platforms: Installation Comparison</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Platform</th>
        <th>How to install a skill</th>
        <th>Config editing required?</th>
        <th>Restart required?</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>OpenClaw</strong></td>
        <td><code>openclaw skills install weather</code></td>
        <td>No — automatic</td>
        <td>No</td>
      </tr>
      <tr>
        <td>Claude Desktop</td>
        <td>Edit claude_desktop_config.json</td>
        <td>Yes — manual JSON</td>
        <td>Yes — full restart</td>
      </tr>
      <tr>
        <td>Claude Code</td>
        <td><code>claude mcp add weather -- npx -y ...</code></td>
        <td>No — CLI handles it</td>
        <td>No — auto-reload</td>
      </tr>
      <tr>
        <td>Cursor</td>
        <td>Edit ~/.cursor/mcp.json</td>
        <td>Yes — manual JSON</td>
        <td>Yes — reload required</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>Finding the Right Skill Name</h2>
<p>Browse skills at <a href="https://trustedskills.dev/skills" target="_blank" rel="noopener">trustedskills.dev/skills</a>. Each skill shows its slug (the name you use with <code>openclaw skills install</code>).</p>

<h2>Managing Your Installed Skills</h2>
<pre><code class="language-bash"># List all installed skills
openclaw skills list

# Update a specific skill
openclaw skills update weather

# Update all installed skills
openclaw skills update --all

# Remove a skill
openclaw skills remove weather

# Get info about a skill
openclaw skills info weather</code></pre>

<h2>Where Skills Are Stored on Mac</h2>
<p>Skills are stored in:</p>
<pre><code class="language-bash">~/.openclaw/skills/</code></pre>
<p>Each skill gets its own directory. You can inspect the files there, but you generally don't need to touch them directly.</p>

<div class="tip-box">
  <strong>💡 Tip:</strong> Use <code>openclaw skills info &lt;name&gt;</code> to see a skill's available tools, version, and verification status before deciding whether to install it.
</div>

<h2>Skills vs MCP Config in OpenClaw</h2>
<p>OpenClaw manages all the MCP plumbing for you. You don't need to edit any JSON config files. When you install a skill, OpenClaw automatically adds it to the appropriate config and starts the MCP server.</p>
<p>If you ever need to see the raw MCP config OpenClaw generated, it's at:</p>
<pre><code class="language-bash">~/.openclaw/config/skills.json</code></pre>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install skills on OpenClaw Mac?</h3>
<p>Run <code>openclaw skills install &lt;skill-name&gt;</code> in your terminal. OpenClaw downloads the skill, configures MCP automatically, and makes the skill available immediately — no JSON editing or restart required.</p>

<h3>Where does OpenClaw store installed skills on Mac?</h3>
<p>Skills are stored in <code>~/.openclaw/skills/</code>, with each skill in its own subdirectory. The auto-generated MCP config is at <code>~/.openclaw/config/skills.json</code>.</p>

<h3>Can I use OpenClaw skills with other AI platforms?</h3>
<p>OpenClaw skills that use MCP can also be configured in Claude Desktop, Claude Code, and Cursor. Browse TrustedSkills to find the skill's npm package name, then add it manually to those platforms' config files.</p>

<h3>How do I update all skills at once on OpenClaw Mac?</h3>
<p>Run <code>openclaw skills update --all</code>. OpenClaw checks for updates to all installed skills and applies them. No restart needed — updates take effect immediately.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install skills on OpenClaw Mac?","acceptedAnswer":{"@type":"Answer","text":"Run 'openclaw skills install <skill-name>'. OpenClaw downloads the skill, configures MCP automatically, and makes the skill available immediately."}},{"@type":"Question","name":"Where does OpenClaw store installed skills on Mac?","acceptedAnswer":{"@type":"Answer","text":"Skills are stored in ~/.openclaw/skills/, with each skill in its own subdirectory."}},{"@type":"Question","name":"Can I use OpenClaw skills with other AI platforms?","acceptedAnswer":{"@type":"Answer","text":"OpenClaw skills that use MCP can be configured in Claude Desktop, Claude Code, and Cursor using the skill's npm package name."}},{"@type":"Question","name":"How do I update all skills at once on OpenClaw Mac?","acceptedAnswer":{"@type":"Answer","text":"Run 'openclaw skills update --all'. Updates take effect immediately without a restart."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Windows: One-Command Setup","description":"Install skills on OpenClaw Windows with one command. OpenClaw handles MCP config automatically — no JSON editing needed.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install skills on OpenClaw Windows</strong>: open PowerShell or Command Prompt and run <code>openclaw skills install &lt;skill-name&gt;</code>. No JSON files to edit, no restart needed — OpenClaw configures MCP automatically.</p>
</div>

<h2>Installing a Skill on OpenClaw Windows</h2>
<p>Open PowerShell or Command Prompt and run:</p>
<pre><code class="language-bash">openclaw skills install weather</code></pre>
<p>OpenClaw handles everything automatically — no JSON editing required.</p>

<h2>Common Commands for OpenClaw Windows</h2>
<pre><code class="language-bash"># Install a skill
openclaw skills install &lt;name&gt;

# List installed skills
openclaw skills list

# Update a skill
openclaw skills update &lt;name&gt;

# Update all skills
openclaw skills update --all

# Remove a skill
openclaw skills remove &lt;name&gt;

# Get skill info
openclaw skills info &lt;name&gt;</code></pre>

<h2>Where Skills Are Stored on Windows</h2>
<p>On Windows, skills are stored in:</p>
<pre><code class="language-bash">%USERPROFILE%\.openclaw\skills\</code></pre>
<p>Usually: <code>C:\Users\YourName\.openclaw\skills\</code></p>

<h2>Windows-Specific Notes</h2>
<ul>
  <li>Run PowerShell as a regular user — admin access is not needed for skill installation</li>
  <li>If you get a PATH error, make sure OpenClaw is in your PATH (the installer should handle this)</li>
  <li>If Windows Defender flags an npx download, this is a false positive — verify the skill is on TrustedSkills first</li>
</ul>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> Windows Defender or other antivirus software may flag new npm package downloads. This is common with npx-based tools. Verify the skill's verification status on TrustedSkills before proceeding — Verified and Featured skills have been audited and are safe.
</div>

<h2>Need Node.js?</h2>
<p>Some skills require Node.js. Install it from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. OpenClaw will warn you if a skill needs Node.js and it's not installed.</p>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Windows?</h3>
<p>Open PowerShell or Command Prompt and run <code>openclaw skills install &lt;skill-name&gt;</code>. OpenClaw downloads, configures, and activates the skill automatically. No JSON config editing or restart needed.</p>

<h3>Does OpenClaw skills install require admin privileges on Windows?</h3>
<p>No. Skills install to your user profile directory (<code>%USERPROFILE%\.openclaw\</code>), which doesn't require admin access. If you encounter permission errors, check that your user has write access to that folder.</p>

<h3>Windows Defender blocked my skill download — what do I do?</h3>
<p>This is usually a false positive with npx downloads. First, verify the skill on TrustedSkills to confirm it's legitimate. If it has Community or Verified status, you can safely allow the download. Featured skills have been formally audited.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Windows?","acceptedAnswer":{"@type":"Answer","text":"Run 'openclaw skills install <skill-name>' in PowerShell or Command Prompt. No JSON editing or restart needed."}},{"@type":"Question","name":"Does OpenClaw skills install require admin privileges on Windows?","acceptedAnswer":{"@type":"Answer","text":"No. Skills install to your user profile directory and don't require admin access."}},{"@type":"Question","name":"Windows Defender blocked my skill download — what do I do?","acceptedAnswer":{"@type":"Answer","text":"Check the skill's verification status on TrustedSkills. Verified and Featured skills are safe. For unverified skills, review the source code on GitHub before allowing."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"Install Skills OpenClaw Linux: Quick Setup Guide","description":"Install skills on OpenClaw Linux with one command. Covers Node.js setup, skill management commands, and Linux tips.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>install skills on OpenClaw Linux</strong>: run <code>openclaw skills install &lt;skill-name&gt;</code>. No sudo needed — skills install to <code>~/.openclaw/skills/</code>. Make sure Node.js is in PATH before running OpenClaw.</p>
</div>

<h2>Installing a Skill</h2>
<pre><code class="language-bash">openclaw skills install weather</code></pre>

<h2>Common OpenClaw Linux Commands</h2>
<pre><code class="language-bash"># Install a skill
openclaw skills install &lt;name&gt;

# List installed skills
openclaw skills list

# Update a skill
openclaw skills update &lt;name&gt;

# Update all skills
openclaw skills update --all

# Remove a skill
openclaw skills remove &lt;name&gt;

# Get skill info
openclaw skills info &lt;name&gt;</code></pre>

<h2>Where Skills Are Stored on Linux</h2>
<pre><code class="language-bash">~/.openclaw/skills/</code></pre>

<h2>Linux-Specific Notes</h2>
<ul>
  <li>No <code>sudo</code> needed for skill installation — skills install to your home directory</li>
  <li>If using nvm, make sure Node.js is in PATH before running openclaw</li>
  <li>For system-wide installs (all users on a server), see the OpenClaw documentation on multi-user setup</li>
</ul>

<h2>Node.js Requirement</h2>
<p>Install Node.js via your package manager or nvm:</p>
<pre><code class="language-bash"># Ubuntu/Debian
sudo apt install nodejs npm

# Or via nvm (recommended — keeps versions separate)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts</code></pre>

<div class="tip-box">
  <strong>💡 Tip:</strong> Using nvm is recommended on Linux because it lets you switch Node.js versions without sudo. Install nvm, then run <code>nvm install --lts</code> to get the latest stable Node.js.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>How do I install OpenClaw skills on Linux?</h3>
<p>Run <code>openclaw skills install &lt;skill-name&gt;</code> in your terminal. No sudo or root access needed — skills install to <code>~/.openclaw/skills/</code> in your home directory.</p>

<h3>What if Node.js isn't in PATH when running OpenClaw?</h3>
<p>Make sure Node.js is installed and in your PATH. If using nvm, run <code>nvm use --lts</code> before using OpenClaw, or add nvm initialisation to your <code>~/.profile</code> or <code>~/.bashrc</code>.</p>

<h3>Can I install OpenClaw skills for all users on a Linux server?</h3>
<p>By default, skills install per-user. For shared server setups, see OpenClaw's multi-user documentation. For most use cases, per-user installation is recommended since it doesn't require root access.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"How do I install OpenClaw skills on Linux?","acceptedAnswer":{"@type":"Answer","text":"Run 'openclaw skills install <skill-name>'. No sudo needed — skills install to ~/.openclaw/skills/."}},{"@type":"Question","name":"What if Node.js isn't in PATH when running OpenClaw?","acceptedAnswer":{"@type":"Answer","text":"If using nvm, run 'nvm use --lts' or add nvm initialisation to ~/.profile. Alternatively, install Node.js via your package manager."}},{"@type":"Question","name":"Can I install OpenClaw skills for all users on a Linux server?","acceptedAnswer":{"@type":"Answer","text":"By default skills install per-user. For shared setups, see OpenClaw's multi-user documentation."}}]}
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
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"MCP Skills: Global vs Project Scope Across All Platforms","description":"Complete guide to MCP skill scope — personal tools vs team tools vs project-specific tools, across Claude Desktop, Claude Code, Cursor and OpenClaw.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>Use <strong>global config</strong> for personal tools and credentials you want in every project. Use <strong>project config</strong> for team tools you want to commit to git. Never put API keys in project config — use environment variables. Project config overrides global when the same server name appears in both.</p>
</div>

<h2>The Core Question: Global vs Project Scope</h2>
<p>When you install a skill, you need to decide: should it be available <em>everywhere</em> (all your projects, globally), or just <em>here</em> (this one project)?</p>
<p>The answer depends on three factors:</p>
<ol>
  <li>Is it a personal tool or a team tool?</li>
  <li>Does it contain personal credentials?</li>
  <li>Is it project-specific or general-purpose?</li>
</ol>

<h2>Decision Framework</h2>
<pre><code class="language-bash">Is this a personal tool you use everywhere? (weather, notes, calculator)
  → Global config

Does this tool use your personal credentials? (your API key, your GitHub token)
  → Global config (never commit personal secrets)

Is this a team tool everyone on the project should have?
  → Project config (commit to git)

Is this tool specific to this project's infrastructure? (dev DB, project API)
  → Project config

Are you not sure?
  → Start with global, move to project when you share the project</code></pre>

<h2>Platform-by-Platform Config Locations</h2>

<h3>Claude Desktop</h3>
<p>Claude Desktop only has a single, global config. There is no project-level concept.</p>
<div class="table-container">
  <table>
    <thead><tr><th>OS</th><th>Config Path</th></tr></thead>
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
      <tr>
        <td>Global</td>
        <td><code>~/.claude/settings.json</code></td>
        <td><code>%USERPROFILE%\\.claude\\settings.json</code></td>
      </tr>
      <tr>
        <td>Project</td>
        <td><code>.claude/settings.json</code> (project root)</td>
        <td><code>.claude\\settings.json</code> (project root)</td>
      </tr>
    </tbody>
  </table>
</div>

<h3>Cursor</h3>
<div class="table-container">
  <table>
    <thead><tr><th>Scope</th><th>Mac/Linux</th><th>Windows</th></tr></thead>
    <tbody>
      <tr>
        <td>Global</td>
        <td><code>~/.cursor/mcp.json</code></td>
        <td><code>%USERPROFILE%\\.cursor\\mcp.json</code></td>
      </tr>
      <tr>
        <td>Project</td>
        <td><code>.cursor/mcp.json</code> (project root)</td>
        <td><code>.cursor\\mcp.json</code> (project root)</td>
      </tr>
    </tbody>
  </table>
</div>

<h3>OpenClaw</h3>
<p>OpenClaw manages scope automatically. By default, skills are global. Project-scoped skills can be added via:</p>
<pre><code class="language-bash">openclaw skills install weather --project</code></pre>
<p>Or add to the project's <code>.openclaw.json</code> file and commit it to git.</p>

<h2>Team Collaboration Workflow</h2>
<p>Here's a recommended workflow for teams:</p>
<ol>
  <li><strong>Each developer sets up their global config</strong> with personal tools (weather, search, personal GitHub token)</li>
  <li><strong>Create a project config</strong> (<code>.claude/settings.json</code> or <code>.cursor/mcp.json</code>) with team tools</li>
  <li><strong>Commit the project config</strong> to git</li>
  <li><strong>Use environment variables</strong> for any values that differ per developer or contain secrets</li>
  <li><strong>Document required environment variables</strong> in your project's README</li>
</ol>

<h3>Example team setup</h3>
<p>Project config (<code>.claude/settings.json</code> — committed to git):</p>
<pre><code class="language-json">{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@trustedskills/postgres-mcp"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    }
  }
}</code></pre>
<p>Each developer adds to their <code>.env</code> (NOT committed):</p>
<pre><code class="language-bash">DATABASE_URL=postgresql://localhost:5432/myapp_dev</code></pre>

<div class="warning-box">
  <strong>⚠️ Warning:</strong> Add <code>.env</code> to your <code>.gitignore</code> file. Never commit API keys, database passwords, or personal tokens to git — even accidentally. Once a secret is in git history, it must be treated as compromised.
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Can I have the same skill in both global and project config?</h3>
<p>Yes. When the same server name exists in both, project config takes precedence. This lets you override a globally configured skill with a project-specific version (e.g., pointing to a different database).</p>

<h3>How do I share MCP skills with my team?</h3>
<p>Add the skill config to your project's config file (<code>.claude/settings.json</code>, <code>.cursor/mcp.json</code>) and commit it to git. All team members who clone the repo will get the skill automatically when they open the project.</p>

<h3>What's the safest way to handle API keys in project config?</h3>
<p>Use environment variable references (<code>${VAR_NAME}</code>) in the config file. Each developer sets the actual values in their local shell environment or a gitignored <code>.env</code> file. The config file commits safely without any secrets.</p>

<h3>Does Claude Desktop support project-level MCP config?</h3>
<p>No. Claude Desktop only has a single global config. For project-level skill management, use Claude Code or Cursor, which both support project-level config files.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Can I have the same skill in both global and project config?","acceptedAnswer":{"@type":"Answer","text":"Yes. Project config takes precedence. This lets you override a global skill with a project-specific version."}},{"@type":"Question","name":"How do I share MCP skills with my team?","acceptedAnswer":{"@type":"Answer","text":"Add the skill config to your project's config file and commit it to git. Team members who clone the repo get the skill automatically."}},{"@type":"Question","name":"What's the safest way to handle API keys in project config?","acceptedAnswer":{"@type":"Answer","text":"Use environment variable references like ${VAR_NAME} in the config. Each developer sets the actual values locally in a gitignored .env file."}},{"@type":"Question","name":"Does Claude Desktop support project-level MCP config?","acceptedAnswer":{"@type":"Answer","text":"No. Claude Desktop only has a global config. Use Claude Code or Cursor for project-level skill management."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'building-your-first-skill'],
    title: 'How to Build an AI Agent Skill: Beginner\'s Complete Guide',
    description: 'How to build an AI agent skill from scratch — create, test, and publish your first MCP skill to the TrustedSkills registry. Complete guide with working code examples, SKILL.md format, and publishing steps.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'advanced',
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"How to Build an AI Agent Skill: Beginner's Complete Guide","description":"How to build an AI agent skill from scratch — create, test, and publish your first MCP skill to TrustedSkills with code examples.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p>To <strong>build an AI agent skill</strong>: create a Node.js project, install <code>@modelcontextprotocol/sdk</code>, write a server that declares tools and handles calls, create a <code>SKILL.md</code> file with metadata, publish to npm, and submit to TrustedSkills. The whole process takes about 30 minutes for a simple skill.</p>
</div>

<h2>What You'll Build</h2>
<p>In this guide, we'll <strong>build an AI agent skill</strong> — a simple MCP skill that converts temperatures between Celsius and Fahrenheit. By the end, you'll have a publishable skill that works in Claude Desktop, Claude Code, Cursor, and OpenClaw.</p>

<h2>What You Need</h2>
<ul>
  <li>Node.js v18+ (check: <code>node --version</code>)</li>
  <li>npm v8+ (check: <code>npm --version</code>)</li>
  <li>A code editor (VS Code recommended)</li>
  <li>A GitHub account (for publishing)</li>
  <li>An npm account (for publishing the package)</li>
</ul>

<h2>Step 1: Create Your Project</h2>
<pre><code class="language-bash">mkdir temperature-converter-mcp
cd temperature-converter-mcp
npm init -y</code></pre>

<p>Install the MCP SDK:</p>
<pre><code class="language-bash">npm install @modelcontextprotocol/sdk</code></pre>

<h2>Step 2: Write the Skill Code</h2>
<p>Create <code>index.js</code>:</p>
<pre><code class="language-javascript">#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'temperature-converter', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// Declare available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'celsius_to_fahrenheit',
      description: 'Convert Celsius to Fahrenheit',
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
      description: 'Convert Fahrenheit to Celsius',
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

// Handle tool calls
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

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);</code></pre>

<p>Update <code>package.json</code>:</p>
<pre><code class="language-json">{
  "name": "@yourusername/temperature-converter-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "temperature-converter-mcp": "./index.js"
  },
  "main": "index.js"
}</code></pre>

<p>Make the file executable (Mac/Linux):</p>
<pre><code class="language-bash">chmod +x index.js</code></pre>

<h2>Step 3: Create the SKILL.md File</h2>
<p>The <strong>SKILL.md</strong> file is what TrustedSkills reads. Create it in your project root:</p>
<pre><code class="language-bash">---
name: temperature-converter
description: Convert temperatures between Celsius and Fahrenheit
version: 1.0.0
platforms:
  - mcp
  - openclaw
  - claude
  - cursor
tags:
  - utility
  - temperature
  - converter
metadata:
  npm: "@yourusername/temperature-converter-mcp"
  tools:
    - celsius_to_fahrenheit
    - fahrenheit_to_celsius
---

# Temperature Converter

Converts temperatures between Celsius and Fahrenheit.

## Tools

- **celsius_to_fahrenheit** — Convert °C to °F
- **fahrenheit_to_celsius** — Convert °F to °C

## Installation

\`\`\`json
{
  "mcpServers": {
    "temperature-converter": {
      "command": "npx",
      "args": ["-y", "@yourusername/temperature-converter-mcp"]
    }
  }
}
\`\`\`</code></pre>

<h2>Step 4: Test Locally</h2>
<p>Add a test config to Claude Desktop (or Claude Code) using the local path:</p>
<pre><code class="language-json">{
  "mcpServers": {
    "temperature-converter": {
      "command": "node",
      "args": ["/full/path/to/temperature-converter-mcp/index.js"]
    }
  }
}</code></pre>
<p>Restart your AI client and test: <em>"Convert 100 degrees Celsius to Fahrenheit"</em></p>

<div class="tip-box">
  <strong>💡 Tip:</strong> Test locally before publishing. Use the full absolute path to your <code>index.js</code> in the config's <code>args</code> array. Once it works locally, publish to npm and switch to the <code>npx -y</code> form.
</div>

<h2>Step 5: Publish to npm</h2>
<pre><code class="language-bash"># Login to npm
npm login

# Publish (use --access public for scoped packages)
npm publish --access public</code></pre>

<p>After publishing, anyone can run your skill with:</p>
<pre><code class="language-bash">npx -y @yourusername/temperature-converter-mcp</code></pre>

<h2>Step 6: Submit to TrustedSkills</h2>
<ol>
  <li>Fork the <a href="https://github.com/growsontrees/trustedskills-registry" target="_blank" rel="noopener">TrustedSkills registry</a></li>
  <li>Create a folder: <code>skills/temperature-converter/</code></li>
  <li>Add your <code>SKILL.md</code> to that folder</li>
  <li>Open a Pull Request</li>
  <li>The maintainers will review and merge it</li>
</ol>
<p>Once merged, your skill appears on TrustedSkills within minutes!</p>

<h2>SKILL.md Fields Reference</h2>
<div class="table-container">
  <table>
    <thead>
      <tr><th>Field</th><th>Required</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr><td><code>name</code></td><td>Yes</td><td>Unique slug (lowercase, hyphens only)</td></tr>
      <tr><td><code>description</code></td><td>Yes</td><td>One-line description (10–500 chars)</td></tr>
      <tr><td><code>version</code></td><td>Yes</td><td>Semantic version (e.g. 1.0.0)</td></tr>
      <tr><td><code>platforms</code></td><td>Yes</td><td>Array: mcp, openclaw, claude, cursor, openai</td></tr>
      <tr><td><code>tags</code></td><td>No</td><td>Search tags for discoverability</td></tr>
      <tr><td><code>metadata.npm</code></td><td>Recommended</td><td>npm package name for MCP installation</td></tr>
    </tbody>
  </table>
</div>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>Do I need to know TypeScript to build an AI agent skill?</h3>
<p>No. JavaScript (as shown in this guide) works perfectly. TypeScript is optional — it adds type safety but isn't required. The MCP SDK supports both JS and TS equally well.</p>

<h3>Can I build an MCP skill in Python instead of Node.js?</h3>
<p>Yes. The MCP SDK is available for Python (<code>mcp</code> on PyPI). The concepts are identical — you declare tools and handle calls — just in Python syntax. The SKILL.md format and TrustedSkills submission process are the same.</p>

<h3>How do I add environment variables (API keys) to my skill?</h3>
<p>Read them from <code>process.env</code> in your skill code: <code>const apiKey = process.env.MY_API_KEY</code>. Document required env vars in your SKILL.md. Users add them to the <code>"env"</code> block in their MCP config.</p>

<h3>How long does it take for a submitted skill to appear on TrustedSkills?</h3>
<p>Once your Pull Request is merged, skills typically appear on the site within a few minutes. Verification takes longer — Community review can take days, while Verified status requires a formal review that may take weeks.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Do I need TypeScript to build an AI agent skill?","acceptedAnswer":{"@type":"Answer","text":"No. JavaScript works perfectly. TypeScript is optional and adds type safety but isn't required. The MCP SDK supports both equally."}},{"@type":"Question","name":"Can I build an MCP skill in Python?","acceptedAnswer":{"@type":"Answer","text":"Yes. The MCP SDK is available for Python on PyPI. The concepts are identical — declare tools and handle calls — just in Python syntax."}},{"@type":"Question","name":"How do I add environment variables to my skill?","acceptedAnswer":{"@type":"Answer","text":"Read them from process.env in your skill code. Document required env vars in SKILL.md and users add them to the env block in their MCP config."}},{"@type":"Question","name":"How long does it take for a submitted skill to appear on TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"Once your PR is merged, skills appear within minutes. Verification takes longer — Community review takes days, Verified status requires a formal review that may take weeks."}}]}
</script>
    `,
  },

  {
    slug: ['advanced', 'verification-badges'],
    title: 'AI Skill Verification Trust Badges: What Each Level Means',
    description: 'AI skill verification trust badges explained — what Unverified, Community, Verified, and Featured mean, why verification matters for security against supply chain attacks, and how to get your skill verified.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    content: `
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"Article","headline":"AI Skill Verification Trust Badges: What Each Level Means","description":"AI skill verification trust badges explained — Unverified, Community, Verified, and Featured levels, security implications, and how to get verified.","publisher":{"@type":"Organization","name":"TrustedSkills","url":"https://trustedskills.dev"}}
</script>

<div class="tldr-box">
  <div class="tldr-label">⚡ Quick Answer</div>
  <p><strong>AI skill verification trust badges</strong> on TrustedSkills indicate how thoroughly a skill has been reviewed: <strong>🔲 Unverified</strong> (automated only), <strong>👥 Community</strong> (peer reviewed), <strong>✅ Verified</strong> (formally audited by TrustedSkills team), <strong>⭐ Featured</strong> (verified + selected for quality). Always check the badge before installing a skill — it's code running on your machine.</p>
</div>

<h2>Why AI Skill Verification Trust Badges Matter</h2>
<p>Installing a skill means running code on your computer. That code has access to your AI agent's context — and potentially your files, APIs, and data. This creates a real security concern: <strong>malicious or compromised skills</strong>.</p>
<p>This is called a <em>supply chain attack</em> — instead of attacking your system directly, a bad actor publishes a malicious package that looks legitimate. You install it thinking it's a weather tool, but it's actually exfiltrating your API keys.</p>
<p>TrustedSkills uses <strong>AI skill verification trust badges</strong> to help you understand how much you can trust a skill before installing it.</p>

<h2>The Four Verification Levels</h2>

<h3>🔲 Unverified</h3>
<p>The skill has been submitted to TrustedSkills and is listed in the registry, but has not been reviewed by anyone. The code has not been audited.</p>
<p><strong>What this means:</strong> The skill metadata (name, description, tools) has been accepted, but that's all. The underlying npm package has not been inspected.</p>
<p><strong>When to install:</strong> Only if you personally know the author, or you're willing to review the source code yourself before installing.</p>
<p><strong>Risk level:</strong> Higher than other levels.</p>

<h3>👥 Community</h3>
<p>The skill has been reviewed and vouched for by multiple community members. The source code has been inspected by developers in the TrustedSkills community — not just the author.</p>
<p><strong>What this means:</strong> Multiple independent reviewers have looked at the code and found no obvious malicious behavior, excessive permissions, or suspicious patterns.</p>
<p><strong>When to install:</strong> Generally safe for personal use.</p>
<p><strong>Risk level:</strong> Lower than Unverified, but community reviewers are volunteers — they may miss subtle vulnerabilities.</p>

<h3>✅ Verified</h3>
<p>The skill has been formally reviewed by the TrustedSkills team or a trusted security partner. The review includes:</p>
<ul>
  <li>Full source code audit</li>
  <li>Dependency review (checking for known vulnerabilities)</li>
  <li>Permission audit (what data does the skill access?)</li>
  <li>Network audit (what external services does it call?)</li>
  <li>Ongoing monitoring for new versions</li>
</ul>
<p><strong>When to install:</strong> Recommended for professional use, team environments, and skills that access sensitive data.</p>
<p><strong>Risk level:</strong> Low. The review process is rigorous.</p>

<h3>⭐ Featured</h3>
<p>Featured skills meet all Verified requirements <em>and</em> have been selected by the TrustedSkills team for quality, usefulness, and exemplary design.</p>
<p><strong>When to install:</strong> Featured skills are the gold standard — recommended to anyone.</p>

<h2>Verification Levels Comparison</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Badge</th>
        <th>Reviewed by</th>
        <th>Code audit</th>
        <th>Recommended for</th>
        <th>Risk level</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>🔲 Unverified</td>
        <td>Nobody (automated only)</td>
        <td>No</td>
        <td>Personal testing only</td>
        <td>Higher</td>
      </tr>
      <tr>
        <td>👥 Community</td>
        <td>Community volunteers</td>
        <td>Informal</td>
        <td>Personal use</td>
        <td>Lower</td>
      </tr>
      <tr>
        <td>✅ Verified</td>
        <td>TrustedSkills team</td>
        <td>Yes, formal</td>
        <td>Professional & team use</td>
        <td>Low</td>
      </tr>
      <tr>
        <td>⭐ Featured</td>
        <td>TrustedSkills team + selection</td>
        <td>Yes, formal</td>
        <td>Anyone — highest quality</td>
        <td>Very low</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How to Get Your Skill Verified</h2>
<ol>
  <li><strong>Submit to the registry</strong> — your skill starts as Unverified</li>
  <li><strong>Open source your code</strong> — verification requires the source to be publicly visible</li>
  <li><strong>Get community reviews</strong> — encourage other developers to review your code and vouch for it</li>
  <li><strong>Apply for formal verification</strong> — once you have community backing, open a GitHub issue requesting formal verification</li>
  <li><strong>Respond to the review</strong> — the TrustedSkills team may ask questions or request changes</li>
  <li><strong>Maintain your skill</strong> — keep it updated and respond to security reports promptly to keep Verified status</li>
</ol>

<div class="tip-box">
  <strong>💡 Tip:</strong> The fastest path to Community verification is to write excellent documentation, include comprehensive tests, and actively engage with the TrustedSkills community. Reviewers are more likely to vouch for skills that are well-documented and clearly do what they say.
</div>

<h2>Security Best Practices for Skill Users</h2>
<ul>
  <li>Prefer <strong>Verified</strong> or <strong>Featured</strong> skills when possible</li>
  <li>For Unverified or Community skills, check the source code on GitHub before installing</li>
  <li>Keep skills updated — <code>openclaw skills update --all</code> or clear the npx cache</li>
  <li>Avoid installing skills that request permissions they don't need</li>
  <li>For enterprise environments, maintain an allowlist of approved skills</li>
</ul>

<hr/>

<h2>Frequently Asked Questions</h2>

<h3>What does "Verified" mean on TrustedSkills?</h3>
<p>A Verified badge means the TrustedSkills team or a trusted security partner has formally audited the skill's source code, dependencies, permissions, and network activity. The skill does what it says and nothing more.</p>

<h3>Is it safe to install Unverified skills?</h3>
<p>It carries more risk than Verified skills. Before installing an Unverified skill, check the GitHub repository: look at the source code, check who the author is, and look for red flags like obfuscated code or unusual permissions. If in doubt, don't install it.</p>

<h3>How do I report a malicious skill?</h3>
<p>Open an issue in the TrustedSkills registry GitHub repository and flag it as a security concern. The team will investigate and remove the skill if it's confirmed malicious. You can also report the npm package directly to npm's security team.</p>

<h3>Does a Verified skill stay Verified forever?</h3>
<p>No. Verification applies to specific versions. When an author publishes a new version, the team reviews it again before extending Verified status. Skills that aren't maintained or have unresolved security reports can lose Verified status.</p>

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What does Verified mean on TrustedSkills?","acceptedAnswer":{"@type":"Answer","text":"Verified means the TrustedSkills team has formally audited the skill's source code, dependencies, permissions, and network activity. The skill does what it says and nothing more."}},{"@type":"Question","name":"Is it safe to install Unverified skills?","acceptedAnswer":{"@type":"Answer","text":"It carries more risk. Before installing, check the GitHub repository: look at the source code, the author's profile, and watch for red flags like obfuscated code or unusual permissions."}},{"@type":"Question","name":"How do I report a malicious skill?","acceptedAnswer":{"@type":"Answer","text":"Open an issue in the TrustedSkills registry GitHub repository and flag it as a security concern. The team will investigate and remove the skill if confirmed malicious."}},{"@type":"Question","name":"Does a Verified skill stay Verified forever?","acceptedAnswer":{"@type":"Answer","text":"No. Verification applies to specific versions. New versions are reviewed again. Skills that aren't maintained or have unresolved security reports can lose Verified status."}}]}
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
