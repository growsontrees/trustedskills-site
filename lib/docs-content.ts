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
    title: 'MCP vs Skills vs Plugins: What\'s the Difference?',
    description: 'Clear definitions of MCP, skills, and plugins — and how they all fit together in the AI agent ecosystem.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'beginner',
    content: `
<h2>The Short Answer</h2>
<p>If you've been reading about AI agents, you've probably encountered three terms that seem interchangeable but aren't quite the same: <strong>MCP</strong>, <strong>skills</strong>, and <strong>plugins</strong>. Here's the quick version:</p>
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

<h2>MCP — The Model Context Protocol</h2>
<p><strong>MCP</strong> (Model Context Protocol) is an open standard created by Anthropic that defines how AI models can call external tools and services. It specifies:</p>
<ul>
  <li>How a tool advertises its capabilities (tool definitions)</li>
  <li>How an AI model calls a tool (request format)</li>
  <li>How a tool returns results (response format)</li>
  <li>How connections are established and maintained</li>
</ul>
<p>MCP is implemented as a small server — usually a Node.js or Python process — that runs alongside your AI client (Claude Desktop, Claude Code, Cursor, etc.). The AI client connects to this server, discovers what tools it offers, and calls them when needed.</p>
<p>Think of MCP as the "plug socket standard" — without a standard, every tool would need a custom adapter for every AI platform.</p>

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

<h2>Comparison Table</h2>
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
  <li>You're configuring a claude_desktop_config.json (the config key is <code>mcpServers</code>)</li>
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
    `,
  },

  {
    slug: ['concepts', 'what-is-npx'],
    title: 'What is npx and why does every MCP config use it?',
    description: 'npx explained simply — what it does, why MCP servers use it, and when to use it vs a global install.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'beginner',
    content: `
<h2>The Problem npx Solves</h2>
<p>Before we explain npx, here's the old way things worked:</p>
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
<p>In MCP configs, you almost always see <code>npx -y @package/name</code>. The <code>-y</code> flag means "yes to everything" — it skips the confirmation prompt that npx shows when downloading a new package:</p>
<pre><code># Without -y: npx asks you to confirm
npx @trustedskills/weather-mcp
# ⚠ Need to install the following packages:
#   @trustedskills/weather-mcp
# Ok to proceed? (y)

# With -y: skips the prompt, installs automatically
npx -y @trustedskills/weather-mcp</code></pre>
<p>Why does this matter for MCP? Because MCP servers are launched automatically by Claude Desktop or Claude Code — they run in the background, with no human sitting there to press "y". The <code>-y</code> flag ensures they start without human intervention.</p>

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

<h2>A Real MCP Config</h2>
<p>Here's what you'll see in a typical <code>claude_desktop_config.json</code>:</p>
<pre><code>{
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

<h2>When to Use npx vs Global Install</h2>
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
<pre><code>npx --version
# Should print something like: 10.5.0</code></pre>

<h2>Summary</h2>
<p>npx is a tool that runs npm packages without installing them globally. MCP configs use <code>npx -y</code> because it's the simplest, most reliable way to run an MCP server: no pre-installation needed, always up-to-date, works on any machine with Node.js installed.</p>
    `,
  },

  {
    slug: ['concepts', 'how-skills-and-mcp-work-together'],
    title: 'How Skills and MCPs Work Together',
    description: 'Understand the full lifecycle — from finding a skill in the registry to your AI agent calling its tools.',
    category: 'Foundational Concepts',
    categorySlug: 'concepts',
    persona: 'developer',
    content: `
<h2>Overview</h2>
<p>A TrustedSkills skill and an MCP server are deeply related — most skills <em>are</em> MCP servers. This article explains how they fit together, the full lifecycle from discovery to tool call, and the architecture behind it.</p>

<h2>Architecture at a Glance</h2>
<pre><code>┌─────────────────────────────────────────────────────────┐
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

<h2>The Full Lifecycle</h2>

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
<p>When you start (or restart) your AI client, it reads the config and launches each MCP server as a subprocess. The server starts up and begins listening for messages on <code>stdio</code> (standard input/output).</p>
<p>This is why the command is <code>npx -y @package/name</code> — the client literally runs this command as a subprocess.</p>

<h3>Step 4: Tool Discovery</h3>
<p>The AI client sends a special MCP message asking the server: "What tools do you have?" The server responds with a list of tool definitions in JSON format:</p>
<pre><code>{
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
<pre><code>{
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

<h2>What Makes a Skill Different from an MCP Server?</h2>
<p>Technically, the skill package <em>is</em> the MCP server. But the word "skill" carries extra meaning:</p>
<ul>
  <li>A skill is <strong>listed in a registry</strong> — it has metadata, versioning, verification status</li>
  <li>A skill has a <strong>SKILL.md</strong> — a standardized description of what it does</li>
  <li>A skill is <strong>platform-agnostic</strong> — it might support Claude, OpenClaw, Cursor, and more</li>
  <li>A skill can be more than just an MCP server — it might include prompt templates or agent config</li>
</ul>
<p>An MCP server is a technical implementation. A skill is a packaged, documented, versioned capability.</p>

<h2>Communication Protocol (Under the Hood)</h2>
<p>MCP uses <strong>JSON-RPC 2.0</strong> over <strong>stdio</strong> (standard input/output). This means:</p>
<ul>
  <li>The AI client writes JSON messages to the server's stdin</li>
  <li>The server writes JSON responses to its stdout</li>
  <li>No network ports, no HTTP server — just pipes between processes</li>
</ul>
<p>This design is intentional: it's simple, secure (no network exposure), and works consistently across all operating systems.</p>
<p>Some MCP servers also support <strong>SSE (Server-Sent Events)</strong> over HTTP for remote servers, but the local stdio approach is standard for skills installed from TrustedSkills.</p>

<h2>Real-World Example: Weather Skill</h2>
<p>Here's the complete flow when you ask Claude Desktop "What's the weather in Tokyo?"</p>
<ol>
  <li>You've installed the weather skill: <code>npx -y @trustedskills/weather-mcp</code> is in your config</li>
  <li>Claude Desktop launches the weather MCP server on startup</li>
  <li>The server registers two tools: <code>get_weather</code> and <code>get_forecast</code></li>
  <li>You type: "What's the weather in Tokyo?"</li>
  <li>Claude recognizes this needs the <code>get_weather</code> tool</li>
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
    `,
  },

  // ─── CLAUDE DESKTOP ─────────────────────────────────────────────────────────
  {
    slug: ['claude-desktop', 'mac'],
    title: 'How to Install Skills for Claude Desktop on Mac',
    description: 'Step-by-step guide to adding MCP skills to Claude Desktop on macOS — no programming experience required.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    content: `
<h2>What You Need</h2>
<ul>
  <li><strong>Claude Desktop</strong> — download from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a> if you haven't already</li>
  <li><strong>Node.js</strong> — required to run skill packages. Download from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a> (click the LTS version)</li>
  <li><strong>A text editor</strong> — TextEdit works, but VS Code is better. Both are free.</li>
</ul>

<h2>Step 1: Find Your Config File</h2>
<p>Claude Desktop stores its configuration in a JSON file. On Mac, it lives here:</p>
<pre><code>~/Library/Application Support/Claude/claude_desktop_config.json</code></pre>
<p>The <code>~</code> symbol means your home folder (e.g. <code>/Users/yourname</code>).</p>

<h3>Open the folder quickly</h3>
<p>In Finder, press <strong>⌘ + Shift + G</strong> (or go to Go → Go to Folder), then paste:</p>
<pre><code>~/Library/Application Support/Claude/</code></pre>
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

<h2>Step 3: Add the MCP Servers Block</h2>
<p>The config file is JSON format. Here's what a complete config with one skill looks like:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Adding multiple skills</h3>
<p>You can add as many skills as you want. Separate each one with a comma:</p>
<pre><code>{
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

<h2>Step 5: Verify It Worked</h2>
<p>After restarting, open a new conversation in Claude Desktop. Look for the <strong>tools icon</strong> (hammer icon 🔨) in the chat input area. Click it to see which tools are available.</p>
<p>Alternatively, ask Claude: <em>"What tools do you have available?"</em> — it should list the tools provided by your skill.</p>

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

<h3>"I can't see the settings"</h3>
<p>The Developer settings tab is only visible in Claude Desktop (the desktop app), not on the web. Make sure you're using the app, not claude.ai in a browser.</p>

<h2>Next Steps</h2>
<p>Once you've successfully installed your first skill, browse TrustedSkills to find more. Each skill's page has the exact config snippet you need.</p>
    `,
  },

  {
    slug: ['claude-desktop', 'windows'],
    title: 'How to Install Skills for Claude Desktop on Windows',
    description: 'Step-by-step guide to adding MCP skills to Claude Desktop on Windows — including Windows-specific gotchas.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'beginner',
    content: `
<h2>What You Need</h2>
<ul>
  <li><strong>Claude Desktop</strong> — download from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a></li>
  <li><strong>Node.js</strong> — download the LTS version from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. Run the installer — it also installs npx automatically.</li>
  <li><strong>A text editor</strong> — Notepad works, but <a href="https://code.visualstudio.com" target="_blank" rel="noopener">VS Code</a> is much better for JSON files</li>
</ul>

<h2>Step 1: Find Your Config File</h2>
<p>On Windows, Claude Desktop stores its config here:</p>
<pre><code>%APPDATA%\\Claude\\claude_desktop_config.json</code></pre>
<p><code>%APPDATA%</code> is a special Windows variable that points to your user's AppData folder (usually <code>C:\\Users\\YourName\\AppData\\Roaming</code>).</p>

<h3>Open the folder quickly</h3>
<p>Press <strong>Windows + R</strong> to open the Run dialog, then type:</p>
<pre><code>%APPDATA%\\Claude</code></pre>
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
  <li>Save as → navigate to <code>%APPDATA%\\Claude\\</code> → filename: <code>claude_desktop_config.json</code></li>
  <li>Change "Save as type" to <strong>All Files (*.*)</strong> so Notepad doesn't add <code>.txt</code></li>
</ol>

<h2>Step 3: Add the MCP Servers Block</h2>
<p>Here's a complete config with one skill:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Windows-specific gotcha: path separators</h3>
<p>If a skill requires a local file path (not a package name), Windows uses backslashes (<code>\\</code>) in paths. In JSON, backslashes must be doubled:</p>
<pre><code>{
  "mcpServers": {
    "my-local-skill": {
      "command": "node",
      "args": ["C:\\\\Users\\\\YourName\\\\my-skill\\\\index.js"]
    }
  }
}</code></pre>
<p>Note: for skills from TrustedSkills that use <code>npx</code>, you don't need to worry about paths at all — just use the package name.</p>

<h3>Using npx from PowerShell</h3>
<p>If Claude Desktop can't find <code>npx</code>, you might need to specify the full path. Find it with:</p>
<pre><code>where npx</code></pre>
<p>Then use that path in the config:</p>
<pre><code>{
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
    `,
  },

  {
    slug: ['claude-desktop', 'linux'],
    title: 'How to Install Skills for Claude Desktop on Linux',
    description: 'Installing MCP skills on Claude Desktop for Linux — config paths and Linux-specific considerations.',
    category: 'Claude Desktop',
    categorySlug: 'claude-desktop',
    persona: 'developer',
    content: `
<h2>Prerequisites</h2>
<ul>
  <li>Claude Desktop installed (AppImage or .deb package from <a href="https://claude.ai/download" target="_blank" rel="noopener">claude.ai/download</a>)</li>
  <li>Node.js and npm: <code>sudo apt install nodejs npm</code> or install via <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noopener">nvm</a> (recommended)</li>
</ul>

<h2>Config File Location</h2>
<p>On Linux, Claude Desktop follows the XDG spec:</p>
<pre><code>~/.config/Claude/claude_desktop_config.json</code></pre>

<h2>Setting Up the Config</h2>
<p>Create or edit the config file:</p>
<pre><code>mkdir -p ~/.config/Claude
nano ~/.config/Claude/claude_desktop_config.json</code></pre>

<p>Add your skills config:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>NVM Note</h2>
<p>If you installed Node.js via nvm, Claude Desktop might not find <code>npx</code> because nvm sets up PATH only for interactive shells. Workaround — use the full path to npx:</p>
<pre><code># Find the path to npx
which npx
# Usually: /home/yourname/.nvm/versions/node/v20.x.x/bin/npx

# Use it in your config:
{
  "mcpServers": {
    "weather": {
      "command": "/home/yourname/.nvm/versions/node/v20.x.x/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<p>Or add nvm to your non-interactive shell profile by adding to <code>~/.profile</code> or <code>~/.bashrc</code>:</p>
<pre><code>export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"</code></pre>

<h2>Restart and Verify</h2>
<pre><code># Close Claude Desktop completely, then reopen it
# Or restart via command line if needed</code></pre>

<p>Verify it worked by opening a conversation and asking: <em>"What tools do you have?"</em></p>

<h2>Viewing Logs</h2>
<p>Claude Desktop logs are in: <code>~/.config/Claude/logs/</code></p>
<pre><code>tail -f ~/.config/Claude/logs/mcp*.log</code></pre>
    `,
  },

  // ─── CLAUDE CODE ────────────────────────────────────────────────────────────
  {
    slug: ['claude-code', 'beginner-guide'],
    title: 'Setting Up Claude Code with VS Code: Complete Beginner\'s Guide',
    description: 'What Claude Code is, how to install it, and how to add your first MCP skill — for complete beginners.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'beginner',
    content: `
<h2>What is Claude Code?</h2>
<p>Claude Code is Anthropic's AI coding assistant — it's Claude, but specialized for software development. Unlike Claude Desktop (a chat app), Claude Code integrates directly into your coding environment.</p>
<p>Claude Code runs in your terminal or inside VS Code, where it can:</p>
<ul>
  <li>Read and write files in your project</li>
  <li>Run terminal commands</li>
  <li>Understand your entire codebase</li>
  <li>Use MCP skills/tools to extend its capabilities</li>
</ul>

<h2>Two Ways to Use Claude Code</h2>
<ol>
  <li><strong>Terminal (CLI)</strong> — run <code>claude</code> in your terminal. Works anywhere.</li>
  <li><strong>VS Code Extension</strong> — a sidebar panel inside VS Code with a chat interface</li>
</ol>
<p>This guide focuses on the VS Code extension, but the MCP config is the same for both.</p>

<h2>Installing Claude Code in VS Code</h2>
<ol>
  <li>Open VS Code</li>
  <li>Press <strong>Ctrl+Shift+X</strong> (Windows/Linux) or <strong>⌘+Shift+X</strong> (Mac) to open Extensions</li>
  <li>Search for <strong>"Claude Code"</strong></li>
  <li>Click <strong>Install</strong> on the Anthropic extension</li>
  <li>Sign in with your Anthropic account when prompted</li>
</ol>

<h2>What MCP Means in Claude Code</h2>
<p>Just like Claude Desktop, Claude Code supports MCP — the protocol that lets Claude call external tools. MCP skills work the same way in Claude Code as in Claude Desktop: they're subprocess servers that Claude communicates with.</p>
<p>The difference is where the config lives.</p>

<h2>Where the MCP Config Lives</h2>
<p>Claude Code has two config locations:</p>

<h3>Global config (recommended for personal tools)</h3>
<pre><code># Mac/Linux:
~/.claude/settings.json

# Windows:
%USERPROFILE%\\.claude\\settings.json</code></pre>
<p>Skills added here are available in <em>every</em> project you open with Claude Code.</p>

<h3>Project config (for team/project-specific tools)</h3>
<pre><code># In your project's root folder:
.claude/settings.json</code></pre>
<p>Skills added here are only available when working in that specific project.</p>

<h2>Adding Your First Skill</h2>

<h3>Option A: Using the CLI (easiest)</h3>
<pre><code># Install Claude Code CLI first if you haven't:
npm install -g @anthropic-ai/claude-code

# Add a skill:
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Verify it was added:
claude mcp list</code></pre>

<h3>Option B: Manually edit settings.json</h3>
<ol>
  <li>Create or open <code>~/.claude/settings.json</code></li>
  <li>Add the <code>mcpServers</code> block:</li>
</ol>
<pre><code>{
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

<h2>Verify the Skill is Working</h2>
<p>In Claude Code, type:</p>
<pre><code>/tools</code></pre>
<p>This lists all available MCP tools. Your new skill's tools should appear in the list.</p>
<p>Or ask Claude directly: <em>"What tools do you have access to?"</em></p>

<h2>Next Steps</h2>
<p>Read about <a href="/docs/claude-code/global-vs-project">Global vs Project-Level config</a> to understand when to use each location, especially if you work on a team.</p>
    `,
  },

  {
    slug: ['claude-code', 'global-vs-project'],
    title: 'Claude Code MCP Config: Global vs Project-Level',
    description: 'When to use global vs project-level MCP config in Claude Code — and how to share skills with your team.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    content: `
<h2>Two Config Locations</h2>
<p>Claude Code supports MCP config in two places. Understanding which to use is important for both solo developers and teams.</p>

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
<pre><code>{
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
<pre><code>{
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
<pre><code>git add .claude/settings.json
git commit -m "Add MCP tools for development"
git push</code></pre>
<p>Now every developer who clones the repo gets the same tools automatically.</p>

<h3>⚠️ Be careful with secrets</h3>
<p>Never commit API keys or passwords in the config file. Instead:</p>
<ul>
  <li>Use environment variables from a <code>.env</code> file (add <code>.env</code> to <code>.gitignore</code>)</li>
  <li>Or reference environment variables already set in each developer's shell</li>
  <li>Or use a secrets manager</li>
</ul>
<pre><code># .claude/settings.json (safe to commit)
{
  "mcpServers": {
    "my-api": {
      "command": "npx",
      "args": ["-y", "@trustedskills/my-api-mcp"],
      "env": {
        "API_KEY": "$MY_API_KEY"  // Read from environment, not hardcoded
      }
    }
  }
}</code></pre>

<h2>Priority: Project Overrides Global</h2>
<p>If you have the same server name in both global and project config, the project config takes precedence. This lets teams override personal defaults for specific projects.</p>

<h2>Pros and Cons</h2>
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
    `,
  },

  {
    slug: ['claude-code', 'mac'],
    title: 'How to Install Skills for Claude Code on Mac',
    description: 'Installing MCP skills for Claude Code on macOS — using the CLI and manual config editing.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    content: `
<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed (<code>node --version</code> to verify)</li>
  <li>Claude Code CLI: <code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: Using the CLI (Recommended)</h2>
<p>The <code>claude mcp add</code> command is the easiest way to add skills:</p>
<pre><code># Add a skill globally (available in all projects)
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# Add a skill to the current project only
claude mcp add weather --project -- npx -y @trustedskills/weather-mcp

# Add a skill with environment variables
claude mcp add my-api -e API_KEY=your-key -- npx -y @trustedskills/my-api-mcp</code></pre>

<h3>List installed skills</h3>
<pre><code>claude mcp list</code></pre>

<h3>Remove a skill</h3>
<pre><code>claude mcp remove weather</code></pre>

<h2>Method 2: Manual Config Edit</h2>
<p>Open your global config:</p>
<pre><code>mkdir -p ~/.claude
open ~/.claude/settings.json  # Opens in default editor</code></pre>
<p>Or use VS Code:</p>
<pre><code>code ~/.claude/settings.json</code></pre>

<p>Add the <code>mcpServers</code> block:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Verify the Installation</h2>
<pre><code># List all configured MCP servers
claude mcp list

# Start Claude Code and check tools
claude
# Then in the session:
/tools</code></pre>

<h2>NVM Users</h2>
<p>If you use nvm and Claude Code can't find npx, add the full path:</p>
<pre><code># Find your npx path
which npx

# Update your config to use the full path
{
  "mcpServers": {
    "weather": {
      "command": "/Users/yourname/.nvm/versions/node/v20.0.0/bin/npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>
    `,
  },

  {
    slug: ['claude-code', 'windows'],
    title: 'How to Install Skills for Claude Code on Windows',
    description: 'Installing MCP skills for Claude Code on Windows — CLI commands and manual config editing.',
    category: 'Claude Code',
    categorySlug: 'claude-code',
    persona: 'developer',
    content: `
<h2>Prerequisites</h2>
<ul>
  <li>Node.js installed from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a></li>
  <li>Claude Code CLI: open PowerShell and run:<br><code>npm install -g @anthropic-ai/claude-code</code></li>
</ul>

<h2>Method 1: Using the CLI</h2>
<p>Open PowerShell or Command Prompt:</p>
<pre><code># Add a skill globally
claude mcp add weather -- npx -y @trustedskills/weather-mcp

# List installed skills
claude mcp list

# Remove a skill
claude mcp remove weather</code></pre>

<h2>Method 2: Manual Config Edit</h2>
<p>The global config on Windows lives at:</p>
<pre><code>%USERPROFILE%\\.claude\\settings.json</code></pre>
<p>Open it in VS Code:</p>
<pre><code>code %USERPROFILE%\\.claude\\settings.json</code></pre>
<p>Or in Notepad:</p>
<pre><code>notepad %USERPROFILE%\\.claude\\settings.json</code></pre>

<p>Add your skills:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Windows Path Notes</h2>
<p>If you need to specify the full path to npx.cmd (common when npx isn't in PATH):</p>
<pre><code>where npx
# C:\\Program Files\\nodejs\\npx.cmd

# Use in config with doubled backslashes:
{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Verify the Installation</h2>
<pre><code>claude mcp list</code></pre>
<p>Start Claude Code and run <code>/tools</code> to see available tools.</p>
    `,
  },

  // ─── CURSOR ─────────────────────────────────────────────────────────────────
  {
    slug: ['cursor', 'mac'],
    title: 'How to Install MCP Skills for Cursor on Mac',
    description: 'Add MCP skills to Cursor on macOS — config location, JSON format, and how to reload.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    content: `
<h2>About Cursor MCP Support</h2>
<p>Cursor (the AI-powered code editor built on VS Code) supports MCP tools natively. MCP servers you configure in Cursor are available to the Cursor AI assistant in chat and inline editing.</p>

<h2>Config File Location</h2>
<p>Cursor's MCP config on Mac lives at:</p>
<pre><code>~/.cursor/mcp.json</code></pre>
<p>This is a <em>global</em> config — available in all Cursor projects.</p>
<p>Cursor also supports project-level config at:</p>
<pre><code>.cursor/mcp.json</code> (in your project root)</pre>

<h2>Creating or Editing the Config</h2>
<pre><code># Create the directory if it doesn't exist
mkdir -p ~/.cursor

# Open in VS Code (or any editor)
code ~/.cursor/mcp.json</code></pre>

<p>Add your skills using this format:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h3>Multiple skills</h3>
<pre><code>{
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

<h2>Verifying It Works</h2>
<p>Open Cursor Chat (<strong>⌘ + L</strong>) and type:</p>
<pre><code>What tools do you have available?</code></pre>
<p>Cursor will list all available MCP tools.</p>

<h2>Troubleshooting</h2>
<ul>
  <li>Check that Node.js is in PATH: <code>which npx</code></li>
  <li>If using nvm, use the full path to npx in your config</li>
  <li>View MCP logs in Cursor's output panel: <strong>View → Output → MCP</strong></li>
</ul>
    `,
  },

  {
    slug: ['cursor', 'windows'],
    title: 'How to Install MCP Skills for Cursor on Windows',
    description: 'Add MCP skills to Cursor on Windows — paths, JSON format, and Windows-specific gotchas.',
    category: 'Cursor / VS Code',
    categorySlug: 'cursor',
    persona: 'developer',
    content: `
<h2>Config File Location</h2>
<p>Cursor's global MCP config on Windows:</p>
<pre><code>%USERPROFILE%\\.cursor\\mcp.json</code></pre>
<p>This is usually: <code>C:\\Users\\YourName\\.cursor\\mcp.json</code></p>

<h2>Creating or Editing the Config</h2>
<p>Open PowerShell:</p>
<pre><code># Create directory if needed
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\\.cursor"

# Open in VS Code
code "$env:USERPROFILE\\.cursor\\mcp.json"</code></pre>

<p>Add your skills:</p>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Windows Path Gotcha</h2>
<p>If npx isn't recognized, find and use the full path:</p>
<pre><code># In PowerShell
Get-Command npx | Select-Object -ExpandProperty Source
# Usually: C:\\Program Files\\nodejs\\npx.cmd</code></pre>
<pre><code>{
  "mcpServers": {
    "weather": {
      "command": "C:\\\\Program Files\\\\nodejs\\\\npx.cmd",
      "args": ["-y", "@trustedskills/weather-mcp"]
    }
  }
}</code></pre>

<h2>Restarting Cursor</h2>
<p>After editing the config:</p>
<ul>
  <li>Go to <strong>File → Preferences → Settings</strong> (Ctrl+,)</li>
  <li>Search for MCP and click the restart button for your server</li>
  <li>Or close and reopen Cursor</li>
</ul>

<h2>Verifying It Works</h2>
<p>Open Cursor Chat (<strong>Ctrl + L</strong>) and ask: <em>"What tools do you have available?"</em></p>
    `,
  },

  // ─── OPENCLAW ───────────────────────────────────────────────────────────────
  {
    slug: ['openclaw', 'mac'],
    title: 'How to Install Skills for OpenClaw on Mac',
    description: 'The easiest way to install skills — one command, done. Full guide for OpenClaw on macOS.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    content: `
<h2>Why OpenClaw is the Easiest Option</h2>
<p>Unlike other platforms where you need to manually edit JSON config files, OpenClaw has a built-in skill manager. Installing a skill is one command.</p>

<h2>Installing a Skill</h2>
<pre><code>openclaw skills install weather</code></pre>
<p>That's it. OpenClaw:</p>
<ol>
  <li>Fetches the skill metadata from TrustedSkills</li>
  <li>Downloads and installs the skill package</li>
  <li>Adds it to your OpenClaw config automatically</li>
  <li>The skill is immediately available — no restart needed</li>
</ol>

<h2>Finding the Right Skill Name</h2>
<p>Browse skills at <a href="https://trustedskills.dev/skills" target="_blank" rel="noopener">trustedskills.dev/skills</a>. Each skill shows its slug (the name you use with <code>openclaw skills install</code>).</p>

<h2>Listing Installed Skills</h2>
<pre><code>openclaw skills list</code></pre>
<p>Output example:</p>
<pre><code>Installed skills:
  ✓ weather          v1.2.0  (MCP, OpenClaw)
  ✓ web-search       v0.8.1  (MCP, OpenClaw)
  ✓ calculator       v2.0.0  (MCP)</code></pre>

<h2>Updating Skills</h2>
<pre><code># Update a specific skill
openclaw skills update weather

# Update all installed skills
openclaw skills update --all</code></pre>

<h2>Removing Skills</h2>
<pre><code>openclaw skills remove weather</code></pre>

<h2>Where Skills Are Stored</h2>
<p>Skills are stored in:</p>
<pre><code>~/.openclaw/skills/</code></pre>
<p>Each skill gets its own directory. You can inspect the files there, but you generally don't need to touch them directly.</p>

<h2>Getting Info About a Skill</h2>
<pre><code>openclaw skills info weather</code></pre>
<p>Shows the skill's version, description, available tools, and installation status.</p>

<h2>Skills vs MCP Config</h2>
<p>OpenClaw manages all the MCP plumbing for you. You don't need to edit any JSON config files. When you install a skill, OpenClaw automatically adds it to the appropriate config and starts the MCP server.</p>
<p>If you ever need to see the raw MCP config OpenClaw generated, it's at:</p>
<pre><code>~/.openclaw/config/skills.json</code></pre>
    `,
  },

  {
    slug: ['openclaw', 'windows'],
    title: 'How to Install Skills for OpenClaw on Windows',
    description: 'Installing and managing skills in OpenClaw on Windows — one command, no config files needed.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    content: `
<h2>Installing a Skill</h2>
<p>Open PowerShell or Command Prompt and run:</p>
<pre><code>openclaw skills install weather</code></pre>
<p>OpenClaw handles everything automatically — no JSON editing required.</p>

<h2>Common Commands</h2>
<pre><code># Install a skill
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

<h2>Where Skills Are Stored</h2>
<p>On Windows, skills are stored in:</p>
<pre><code>%USERPROFILE%\\.openclaw\\skills\\</code></pre>
<p>Usually: <code>C:\\Users\\YourName\\.openclaw\\skills\\</code></p>

<h2>Windows-Specific Notes</h2>
<ul>
  <li>Run PowerShell as a regular user — admin access is not needed for skill installation</li>
  <li>If you get a PATH error, make sure OpenClaw is in your PATH (the installer should handle this)</li>
  <li>If Windows Defender flags an npx download, this is a false positive — verify the skill is on TrustedSkills first</li>
</ul>

<h2>Need Node.js?</h2>
<p>Some skills require Node.js. Install it from <a href="https://nodejs.org" target="_blank" rel="noopener">nodejs.org</a>. OpenClaw will warn you if a skill needs Node.js and it's not installed.</p>
    `,
  },

  {
    slug: ['openclaw', 'linux'],
    title: 'How to Install Skills for OpenClaw on Linux',
    description: 'Installing and managing skills in OpenClaw on Linux.',
    category: 'OpenClaw',
    categorySlug: 'openclaw',
    persona: 'beginner',
    content: `
<h2>Installing a Skill</h2>
<pre><code>openclaw skills install weather</code></pre>

<h2>Common Commands</h2>
<pre><code># Install a skill
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

<h2>Where Skills Are Stored</h2>
<pre><code>~/.openclaw/skills/</code></pre>

<h2>Linux-Specific Notes</h2>
<ul>
  <li>No <code>sudo</code> needed for skill installation — skills install to your home directory</li>
  <li>If using nvm, make sure Node.js is in PATH before running openclaw</li>
  <li>For system-wide installs (all users on a server), see the OpenClaw documentation on multi-user setup</li>
</ul>

<h2>Node.js Requirement</h2>
<p>Install Node.js via your package manager or nvm:</p>
<pre><code># Ubuntu/Debian
sudo apt install nodejs npm

# Or via nvm (recommended — keeps versions separate)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install --lts</code></pre>
    `,
  },

  // ─── ADVANCED ───────────────────────────────────────────────────────────────
  {
    slug: ['advanced', 'all-projects-vs-one'],
    title: 'Making Your Skill Available to All Projects vs One Project',
    description: 'A complete guide to scope — personal tools vs team tools vs project-specific tools, across all platforms.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    content: `
<h2>The Core Question</h2>
<p>When you install a skill, you need to decide: should it be available <em>everywhere</em> (all your projects, globally), or just <em>here</em> (this one project)?</p>
<p>The answer depends on three factors:</p>
<ol>
  <li>Is it a personal tool or a team tool?</li>
  <li>Does it contain personal credentials?</li>
  <li>Is it project-specific or general-purpose?</li>
</ol>

<h2>Decision Framework</h2>
<pre><code>Is this a personal tool you use everywhere? (weather, notes, calculator)
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
      <tr><td>Windows</td><td><code>%APPDATA%\\Claude\\claude_desktop_config.json</code></td></tr>
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
<pre><code>openclaw skills install weather --project</code></pre>
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
<pre><code>{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@trustedskills/postgres-mcp"],
      "env": {
        "DATABASE_URL": "\\$&#123;DATABASE_URL&#125;"
      }
    }
  }
}</code></pre>
<p>Each developer adds to their <code>.env</code> (NOT committed):</p>
<pre><code>DATABASE_URL=postgresql://localhost:5432/myapp_dev</code></pre>
    `,
  },

  {
    slug: ['advanced', 'building-your-first-skill'],
    title: 'Beginner\'s Guide to Building Your First Skill',
    description: 'Everything you need to create, test, and publish a skill to TrustedSkills — from scratch.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'advanced',
    content: `
<h2>What You'll Build</h2>
<p>In this guide, we'll build a simple MCP skill that converts temperatures between Celsius and Fahrenheit. By the end, you'll have a publishable skill that works in Claude Desktop, Claude Code, Cursor, and OpenClaw.</p>

<h2>What You Need</h2>
<ul>
  <li>Node.js v18+ (check: <code>node --version</code>)</li>
  <li>npm v8+ (check: <code>npm --version</code>)</li>
  <li>A code editor (VS Code recommended)</li>
  <li>A GitHub account (for publishing)</li>
  <li>An npm account (for publishing the package)</li>
</ul>

<h2>Step 1: Create Your Project</h2>
<pre><code>mkdir temperature-converter-mcp
cd temperature-converter-mcp
npm init -y</code></pre>

<p>Install the MCP SDK:</p>
<pre><code>npm install @modelcontextprotocol/sdk</code></pre>

<h2>Step 2: Write the Skill Code</h2>
<p>Create <code>index.js</code>:</p>
<pre><code>#!/usr/bin/env node
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
      content: [{ type: 'text', text: \`\\$&#123;args.celsius&#125;°C = \\$&#123;f.toFixed(1)&#125;°F\` }]
    };
  }
  
  if (name === 'fahrenheit_to_celsius') {
    const c = (args.fahrenheit - 32) * 5/9;
    return {
      content: [{ type: 'text', text: \`\\$&#123;args.fahrenheit&#125;°F = \\$&#123;c.toFixed(1)&#125;°C\` }]
    };
  }
  
  throw new Error(\`Unknown tool: \\$&#123;name&#125;\`);
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);</code></pre>

<p>Update <code>package.json</code>:</p>
<pre><code>{
  "name": "@yourusername/temperature-converter-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "temperature-converter-mcp": "./index.js"
  },
  "main": "index.js"
}</code></pre>

<p>Make the file executable (Mac/Linux):</p>
<pre><code>chmod +x index.js</code></pre>

<h2>Step 3: Create the SKILL.md File</h2>
<p>This is the file that TrustedSkills reads. Create <code>SKILL.md</code> in your project root:</p>
<pre><code>---
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
\`\`\`
</code></pre>

<h2>Step 4: Test Locally</h2>
<p>Add a test config to Claude Desktop (or Claude Code) using the local path:</p>
<pre><code>{
  "mcpServers": {
    "temperature-converter": {
      "command": "node",
      "args": ["/full/path/to/temperature-converter-mcp/index.js"]
    }
  }
}</code></pre>
<p>Restart your AI client and test: <em>"Convert 100 degrees Celsius to Fahrenheit"</em></p>

<h2>Step 5: Publish to npm</h2>
<pre><code># Login to npm
npm login

# Publish (use --access public for scoped packages)
npm publish --access public</code></pre>

<p>After publishing, anyone can run your skill with:</p>
<pre><code>npx -y @yourusername/temperature-converter-mcp</code></pre>

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
    `,
  },

  {
    slug: ['advanced', 'verification-badges'],
    title: 'Understanding Skill Verification: What the Badges Mean',
    description: 'What Unverified, Community, Verified, and Featured mean — and why verification matters for security.',
    category: 'Advanced Topics',
    categorySlug: 'advanced',
    persona: 'developer',
    content: `
<h2>Why Verification Matters</h2>
<p>Installing a skill means running code on your computer. That code has access to your AI agent's context — and potentially your files, APIs, and data. This creates a real security concern: <strong>malicious or compromised skills</strong>.</p>
<p>This is called a <em>supply chain attack</em> — instead of attacking your system directly, a bad actor publishes a malicious package that looks legitimate. You install it thinking it's a weather tool, but it's actually exfiltrating your API keys.</p>
<p>TrustedSkills uses a verification system to help you understand how much you can trust a skill before installing it.</p>

<h2>The Four Verification Levels</h2>

<h3>🔲 Unverified</h3>
<p>The skill has been submitted to TrustedSkills and is listed in the registry, but has not been reviewed by anyone. The code has not been audited.</p>
<p><strong>What this means:</strong> The skill metadata (name, description, tools) has been accepted, but that's all. The underlying npm package has not been inspected.</p>
<p><strong>When to install:</strong> Only if you personally know the author, or you're willing to review the source code yourself before installing.</p>
<p><strong>Risk:</strong> Higher than other levels. Always check the GitHub repo before installing an unverified skill.</p>

<h3>👥 Community</h3>
<p>The skill has been reviewed and vouched for by multiple community members. The source code has been inspected by developers in the TrustedSkills community — not just the author.</p>
<p><strong>What this means:</strong> Multiple independent reviewers have looked at the code and found no obvious malicious behavior, excessive permissions, or suspicious patterns.</p>
<p><strong>When to install:</strong> Generally safe for most use cases. The community review catches obvious issues.</p>
<p><strong>Risk:</strong> Lower than Unverified, but community reviewers are volunteers — they may miss subtle vulnerabilities.</p>

<h3>✅ Verified</h3>
<p>The skill has been formally reviewed by the TrustedSkills team or a trusted security partner. The review includes:</p>
<ul>
  <li>Full source code audit</li>
  <li>Dependency review (checking for known vulnerabilities)</li>
  <li>Permission audit (what data does the skill access?)</li>
  <li>Network audit (what external services does it call?)</li>
  <li>Ongoing monitoring for new versions</li>
</ul>
<p><strong>What this means:</strong> A professional review has been done. The skill does what it says and nothing more.</p>
<p><strong>When to install:</strong> Recommended for professional use, team environments, and skills that access sensitive data.</p>
<p><strong>Risk:</strong> Low. The review process is rigorous, but security is never absolute — keep skills updated.</p>

<h3>⭐ Featured</h3>
<p>Featured skills meet all Verified requirements <em>and</em> have been selected by the TrustedSkills team for quality, usefulness, and exemplary design. These are skills that:</p>
<ul>
  <li>Solve common, important problems</li>
  <li>Have excellent documentation</li>
  <li>Are actively maintained</li>
  <li>Follow best practices for MCP server design</li>
  <li>Have a strong track record with the community</li>
</ul>
<p><strong>When to install:</strong> Featured skills are the gold standard. These are the skills we'd recommend to anyone.</p>

<h2>Verification Status Summary</h2>
<div class="table-container">
  <table>
    <thead>
      <tr>
        <th>Badge</th>
        <th>Reviewed by</th>
        <th>Code audit</th>
        <th>Recommended for</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>🔲 Unverified</td>
        <td>Nobody (automated only)</td>
        <td>No</td>
        <td>Personal testing only</td>
      </tr>
      <tr>
        <td>👥 Community</td>
        <td>Community volunteers</td>
        <td>Informal</td>
        <td>Personal use</td>
      </tr>
      <tr>
        <td>✅ Verified</td>
        <td>TrustedSkills team</td>
        <td>Yes, formal</td>
        <td>Professional & team use</td>
      </tr>
      <tr>
        <td>⭐ Featured</td>
        <td>TrustedSkills team + selection</td>
        <td>Yes, formal</td>
        <td>Anyone — highest quality</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>How to Get Your Skill Verified</h2>
<ol>
  <li><strong>Submit to the registry</strong> — your skill starts as Unverified</li>
  <li><strong>Open source your code</strong> — verification requires the source to be publicly visible</li>
  <li><strong>Get community reviews</strong> — encourage other developers to review your code and vouch for it</li>
  <li><strong>Apply for formal verification</strong> — once you have community backing, open a GitHub issue in the registry repo requesting formal verification</li>
  <li><strong>Respond to the review</strong> — the TrustedSkills team may ask questions or request changes</li>
  <li><strong>Maintain your skill</strong> — keep it updated and respond to security reports promptly to keep Verified status</li>
</ol>

<h2>Security Best Practices for Skill Users</h2>
<ul>
  <li>Prefer Verified or Featured skills when possible</li>
  <li>For Unverified or Community skills, check the source code on GitHub before installing</li>
  <li>Keep skills updated — <code>openclaw skills update --all</code> or update your npx-based skills by clearing the npx cache</li>
  <li>Avoid installing skills that request permissions they don't need (e.g., a weather skill shouldn't need file system access)</li>
  <li>For enterprise environments, maintain an allowlist of approved skills</li>
</ul>
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
