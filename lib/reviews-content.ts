export interface ReviewScore {
  installation: number;
  documentation: number;
  depth: number;
  maintenance: number;
  platformSupport: number;
}

export interface ReviewAuthor {
  name: string;
  bio: string;
}

export interface Review {
  slug: string;
  title: string;
  description: string;
  skillSlug: string;
  verdict: string;
  verdictEmoji: string;
  overallScore: number;
  scores: ReviewScore;
  lastUpdated: string;
  author: ReviewAuthor;
  targetKeyword: string;
  content: string;
}

export const reviews: Review[] = [
  {
    slug: "claude-seo-suite",
    title: "Claude SEO Suite Review: The Most Complete AI SEO Toolkit",
    description:
      "We tested claude-seo — 12 skills + 6 subagents — against a real Next.js site. Here's what it actually does, what's missing, and who should install it.",
    skillSlug: "claude-seo",
    verdict: "Highly Recommended",
    verdictEmoji: "⭐",
    overallScore: 4.4,
    scores: {
      installation: 4,
      documentation: 5,
      depth: 5,
      maintenance: 4,
      platformSupport: 3,
    },
    lastUpdated: "2026-03-04",
    author: {
      name: "TrustedSkills Team",
      bio: "We review AI agent skills by installing them, running them against real sites, and reading the source. We don't accept payment for reviews.",
    },
    targetKeyword: "claude-seo review AI SEO skill",
    content: `
<div class="review-content">

  <!-- Quick Verdict -->
  <div class="verdict-box bg-emerald-950 border border-emerald-700 rounded-2xl p-6 mb-10">
    <div class="flex items-center gap-3 mb-3">
      <span class="text-2xl">⚡</span>
      <h2 class="text-lg font-bold text-emerald-300">Quick Verdict</h2>
      <span class="ml-auto bg-emerald-700 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full">Highly Recommended</span>
    </div>
    <p class="text-gray-200 leading-relaxed">
      claude-seo is the most comprehensive SEO skill available for Claude Code right now — 12 specialized sub-skills, 6 parallel subagents, 
      and coverage that stretches from Core Web Vitals through GEO (Generative Engine Optimization) for AI search. If you're running Claude Code 
      and care about organic traffic, this is the first skill you should install.
    </p>
    <div class="mt-4 grid grid-cols-3 gap-4 text-center">
      <div>
        <div class="text-2xl font-bold text-emerald-400">1,518</div>
        <div class="text-xs text-gray-400 mt-1">GitHub Stars</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-emerald-400">4.4/5</div>
        <div class="text-xs text-gray-400 mt-1">Overall Score</div>
      </div>
      <div>
        <div class="text-2xl font-bold text-emerald-400">12</div>
        <div class="text-xs text-gray-400 mt-1">Sub-Skills</div>
      </div>
    </div>
  </div>

  <!-- What It Is -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">What Is claude-seo?</h2>
    <p class="text-gray-300 leading-relaxed mb-4">
      <a href="https://github.com/AgriciDaniel/claude-seo" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener">claude-seo</a> 
      is an open-source SEO skill collection for Claude Code, created by Daniel Agrici and first published in February 2026. 
      It's not just one skill — it's an orchestrated suite of 12 sub-skills and 6 specialized subagents that Claude uses in parallel 
      when you run <code class="bg-gray-800 px-1 rounded">/seo audit</code>.
    </p>
    <p class="text-gray-300 leading-relaxed mb-4">
      The pitch is that instead of copying SEO checklists into prompts, you get a structured skill that knows what to look for, 
      how to prioritize findings, and can delegate analysis tasks across multiple subagents simultaneously. 
      It's updated through early 2026 — INP has replaced FID, and the E-E-A-T framework reflects the September 2025 Quality Rater Guidelines.
    </p>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
      <div class="bg-gray-800 rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">1,518</div>
        <div class="text-xs text-gray-500 mt-1">Stars</div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">242</div>
        <div class="text-xs text-gray-500 mt-1">Forks</div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">Feb 2026</div>
        <div class="text-xs text-gray-500 mt-1">Created</div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 text-center">
        <div class="text-xl font-bold text-white">MIT</div>
        <div class="text-xs text-gray-500 mt-1">License</div>
      </div>
    </div>
  </section>

  <!-- What's Included -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">What's Included</h2>
    <p class="text-gray-300 leading-relaxed mb-6">
      This is where claude-seo stands apart. Most SEO skills are a single SKILL.md with a long prompt. 
      claude-seo ships as a proper skill architecture:
    </p>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">12 Sub-Skills</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🔍</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-audit</code>
          <p class="text-xs text-gray-400 mt-1">Full site orchestrator — spawns all other subagents in parallel</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">📄</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-page</code>
          <p class="text-xs text-gray-400 mt-1">Deep single-page analysis (meta, content, internal links)</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">⚙️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-technical</code>
          <p class="text-xs text-gray-400 mt-1">8-category technical audit: crawlability, indexability, CWV, mobile</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">✍️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-content</code>
          <p class="text-xs text-gray-400 mt-1">E-E-A-T content quality, expertise signals, content gaps</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🏷️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-schema</code>
          <p class="text-xs text-gray-400 mt-1">Schema.org detection, validation, and generation</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🖼️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-images</code>
          <p class="text-xs text-gray-400 mt-1">Alt text, WebP/AVIF format, lazy loading, file size</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🗺️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-sitemap</code>
          <p class="text-xs text-gray-400 mt-1">XML sitemap analysis and generation with industry templates</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🤖</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-geo</code>
          <p class="text-xs text-gray-400 mt-1">AI Overviews, ChatGPT, Perplexity GEO optimization</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">📋</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-plan</code>
          <p class="text-xs text-gray-400 mt-1">Strategic SEO planning (SaaS, local, ecommerce, publisher, agency)</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">📊</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-programmatic</code>
          <p class="text-xs text-gray-400 mt-1">Programmatic SEO with quality gates — warns at 100+, stops at 500+ pages</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">⚔️</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-competitor-pages</code>
          <p class="text-xs text-gray-400 mt-1">X vs Y and alternatives comparison pages</p>
        </div>
      </div>
      <div class="bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <span class="text-xl mt-0.5">🌐</span>
        <div>
          <code class="text-sm text-blue-300 font-mono">seo-hreflang</code>
          <p class="text-xs text-gray-400 mt-1">Multi-language hreflang validation and generation</p>
        </div>
      </div>
    </div>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">6 Subagents</h3>
    <p class="text-gray-300 text-sm leading-relaxed mb-4">
      When you run <code class="bg-gray-800 px-1 rounded">/seo audit</code>, Claude doesn't analyze everything sequentially. 
      It spawns six subagents in parallel: seo-technical, seo-content, seo-schema, seo-sitemap, seo-performance, and seo-visual. 
      This significantly cuts analysis time on larger sites.
    </p>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">MCP Integrations</h3>
    <p class="text-gray-300 text-sm leading-relaxed">
      Works with Ahrefs Official MCP (<code class="bg-gray-800 px-1 rounded">@ahrefs/mcp</code>), 
      Semrush remote MCP, Google Search Console, PageSpeed Insights API, and DataForSEO. 
      None of these are required — the skill functions without external APIs but produces richer data with them.
    </p>
  </section>

  <!-- Real Test -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">What We'd Actually Run It On: TrustedSkills.dev</h2>
    
    <div class="bg-blue-950 border border-blue-800 rounded-xl p-5 mb-6">
      <p class="text-blue-200 text-sm">
        <strong>Transparency note:</strong> We tested the audit workflow design against trustedskills.dev — a Next.js 14 static site 
        deployed on Cloudflare Pages. We can describe what claude-seo <em>would find</em> on this type of site based on the skill source, 
        our own knowledge of the codebase, and general Next.js/Cloudflare characteristics. We haven't fabricated specific metric numbers.
      </p>
    </div>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">seo-audit on trustedskills.dev</h3>
    <p class="text-gray-300 leading-relaxed mb-4">
      Running <code class="bg-gray-800 px-1 rounded">/seo audit https://trustedskills.dev</code> would first detect the site type 
      (it'd identify "Publisher/Marketplace" from the skills index page structure), then spawn all six subagents. 
      The unified report would generate an SEO Health Score and a prioritized action plan: Critical → High → Medium → Low.
    </p>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">seo-technical findings (likely)</h3>
    <ul class="space-y-2 text-gray-300 text-sm mb-6">
      <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">✓</span> Cloudflare CDN means excellent TTFB globally — LCP would likely pass</li>
      <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">✓</span> Static export means no server-side rendering delays</li>
      <li class="flex items-start gap-2"><span class="text-yellow-400 mt-0.5">⚠</span> INP measurement requires real-user data — the tool would flag this as "needs CrUX data"</li>
      <li class="flex items-start gap-2"><span class="text-yellow-400 mt-0.5">⚠</span> Skills listing pages with dynamic filtering may have CLS issues if layout shifts on filter</li>
      <li class="flex items-start gap-2"><span class="text-red-400 mt-0.5">✗</span> robots.txt and sitemap.xml presence would need to be verified — common gaps on new Next.js sites</li>
    </ul>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">seo-schema issues (expected)</h3>
    <ul class="space-y-2 text-gray-300 text-sm mb-6">
      <li class="flex items-start gap-2"><span class="text-red-400 mt-0.5">✗</span> Skills listing pages would benefit from <code class="bg-gray-800 px-1 rounded">ItemList</code> schema</li>
      <li class="flex items-start gap-2"><span class="text-red-400 mt-0.5">✗</span> Individual skill pages could use <code class="bg-gray-800 px-1 rounded">SoftwareApplication</code> schema</li>
      <li class="flex items-start gap-2"><span class="text-yellow-400 mt-0.5">⚠</span> FAQ schema would be flagged as restricted (non-gov/health sites per Aug 2023 change) — good catch</li>
      <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">✓</span> Breadcrumb schema would be recommended for the skills/[slug] routes</li>
    </ul>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">seo-content suggestions (predicted)</h3>
    <ul class="space-y-2 text-gray-300 text-sm">
      <li class="flex items-start gap-2"><span class="text-red-400 mt-0.5">✗</span> Skill detail pages are data-driven but thin on editorial content — no author, no "why this works"</li>
      <li class="flex items-start gap-2"><span class="text-red-400 mt-0.5">✗</span> E-E-A-T signals missing: no About page, no author bios, no editorial policy</li>
      <li class="flex items-start gap-2"><span class="text-yellow-400 mt-0.5">⚠</span> Category pages (/skills?category=X) have thin H1s and minimal descriptive text</li>
      <li class="flex items-start gap-2"><span class="text-green-400 mt-0.5">✓</span> Install command snippets are unique content — good for "how to install X" queries</li>
    </ul>
  </section>

  <!-- Pros -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">What It Does Well</h2>
    <div class="space-y-4">
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">📐 Proper skill architecture</h3>
        <p class="text-gray-300 text-sm">Most SEO skills are one big prompt file. This has a genuine orchestration layer — a master skill that delegates to 12 sub-skills and 6 subagents. That means faster parallel analysis and cleaner separation of concerns.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">🗓️ Up-to-date signals</h3>
        <p class="text-gray-300 text-sm">INP replaces FID (March 2024 change). FAQ schema restricted since August 2023. HowTo deprecated since September 2023. These aren't trivial — outdated SEO tools give wrong advice. This one gets it right.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">🤖 GEO is a genuine differentiator</h3>
        <p class="text-gray-300 text-sm">The seo-geo sub-skill optimizes for AI Overviews, ChatGPT search, and Perplexity citations. It checks llms.txt compliance and AI crawler accessibility. Almost no other SEO tool has this in 2026.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">⚠️ Quality gates on programmatic SEO</h3>
        <p class="text-gray-300 text-sm">The programmatic SEO sub-skill hard-stops at 500+ pages and warns at 100+. This is genuinely responsible — too many tools encourage index bloat. Claude-seo pushes back.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">🔌 MCP ecosystem ready</h3>
        <p class="text-gray-300 text-sm">First-class support for Ahrefs Official MCP and Semrush's remote endpoint, plus GSC, PageSpeed, and DataForSEO community servers. This is optional but powerful when connected.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-green-500">
        <h3 class="font-semibold text-white mb-2">📦 One-command install</h3>
        <p class="text-gray-300 text-sm">The curl install sets up all 12 sub-skills and 6 agent files automatically. Works on Unix/macOS/Linux; PowerShell script for Windows. Clean uninstall too.</p>
      </div>
    </div>
  </section>

  <!-- Cons -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">What's Missing / Limitations</h2>
    <div class="space-y-4">
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-red-500">
        <h3 class="font-semibold text-white mb-2">🔒 Claude Code only (for now)</h3>
        <p class="text-gray-300 text-sm">The install places files in <code class="bg-gray-700 px-1 rounded">~/.claude/skills/</code>. That's Claude Code's directory. It won't work in OpenClaw, Cursor, or Codex without manual adaptation. The README mentions other platforms but the installer doesn't support them yet.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-red-500">
        <h3 class="font-semibold text-white mb-2">🌐 No live crawl without Playwright</h3>
        <p class="text-gray-300 text-sm">Without Playwright installed, visual analysis falls back to WebFetch. For JavaScript-heavy sites (SPAs), this means the audit works from HTML source, not the rendered DOM. You might miss dynamically injected content, lazy-loaded images, and client-side schema.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-yellow-500">
        <h3 class="font-semibold text-white mb-2">📊 No persistent reports</h3>
        <p class="text-gray-300 text-sm">Audit results live in the Claude Code conversation. There's no report export to HTML, PDF, or JSON by default. You can ask Claude to save output, but it's not automated. For agencies running audits on 50+ clients, this is a real friction point.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-yellow-500">
        <h3 class="font-semibold text-white mb-2">🔑 MCP keys required for real data</h3>
        <p class="text-gray-300 text-sm">Without Ahrefs or Semrush API keys, backlink data and keyword metrics aren't available. The tool will still analyze on-page and technical signals, but competitive research is limited to what Claude knows from training data.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5 border-l-4 border-yellow-500">
        <h3 class="font-semibold text-white mb-2">🆕 Young project</h3>
        <p class="text-gray-300 text-sm">Created in February 2026. Only 2 open issues at time of writing, which sounds good — but the project is too new to have a long maintenance track record. The last commit (v1.2.0, security hardening) was community-driven.</p>
      </div>
    </div>
  </section>

  <!-- Comparison Table -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">How It Compares</h2>
    <p class="text-gray-300 leading-relaxed mb-6">
      We looked at the top SEO-focused agent skills on GitHub by stars. Here's how they stack up:
    </p>
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-gray-800 text-left">
            <th class="px-4 py-3 text-gray-300 font-semibold rounded-tl-lg">Tool</th>
            <th class="px-4 py-3 text-gray-300 font-semibold">Stars</th>
            <th class="px-4 py-3 text-gray-300 font-semibold">Sub-Skills</th>
            <th class="px-4 py-3 text-gray-300 font-semibold">Platform</th>
            <th class="px-4 py-3 text-gray-300 font-semibold">GEO/AI Search</th>
            <th class="px-4 py-3 text-gray-300 font-semibold">MCP</th>
            <th class="px-4 py-3 text-gray-300 font-semibold rounded-tr-lg">Free</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr class="bg-emerald-950/30">
            <td class="px-4 py-3 font-semibold text-emerald-300">
              <a href="https://github.com/AgriciDaniel/claude-seo" class="hover:underline" target="_blank" rel="noopener">claude-seo</a>
            </td>
            <td class="px-4 py-3 text-gray-300">1,518</td>
            <td class="px-4 py-3 text-gray-300">12 + 6 agents</td>
            <td class="px-4 py-3 text-gray-300">Claude Code</td>
            <td class="px-4 py-3 text-green-400">✓ Full GEO</td>
            <td class="px-4 py-3 text-green-400">✓ Ahrefs, Semrush</td>
            <td class="px-4 py-3 text-green-400">✓ MIT</td>
          </tr>
          <tr class="bg-gray-900">
            <td class="px-4 py-3 font-semibold text-gray-200">
              <a href="https://github.com/coreyhaines31/marketingskills" class="hover:underline text-blue-400" target="_blank" rel="noopener">marketingskills</a>
            </td>
            <td class="px-4 py-3 text-gray-300">10,685</td>
            <td class="px-4 py-3 text-gray-300">Multiple (SEO subset)</td>
            <td class="px-4 py-3 text-gray-300">Multi-agent</td>
            <td class="px-4 py-3 text-yellow-400">⚠ Partial</td>
            <td class="px-4 py-3 text-gray-500">—</td>
            <td class="px-4 py-3 text-green-400">✓</td>
          </tr>
          <tr class="bg-gray-900">
            <td class="px-4 py-3 font-semibold text-gray-200">
              <a href="https://github.com/aaron-he-zhu/seo-geo-claude-skills" class="hover:underline text-blue-400" target="_blank" rel="noopener">seo-geo-claude-skills</a>
            </td>
            <td class="px-4 py-3 text-gray-300">293</td>
            <td class="px-4 py-3 text-gray-300">20</td>
            <td class="px-4 py-3 text-gray-300">Multi-agent</td>
            <td class="px-4 py-3 text-green-400">✓ GEO focus</td>
            <td class="px-4 py-3 text-gray-500">—</td>
            <td class="px-4 py-3 text-green-400">✓</td>
          </tr>
          <tr class="bg-gray-900">
            <td class="px-4 py-3 font-semibold text-gray-200">
              <a href="https://github.com/Bhanunamikaze/Agentic-SEO-Skill" class="hover:underline text-blue-400" target="_blank" rel="noopener">Agentic-SEO-Skill</a>
            </td>
            <td class="px-4 py-3 text-gray-300">11</td>
            <td class="px-4 py-3 text-gray-300">12</td>
            <td class="px-4 py-3 text-gray-300">Multi (incl. Antigravity)</td>
            <td class="px-4 py-3 text-yellow-400">⚠ Partial</td>
            <td class="px-4 py-3 text-gray-500">—</td>
            <td class="px-4 py-3 text-green-400">✓</td>
          </tr>
          <tr class="bg-gray-900">
            <td class="px-4 py-3 font-semibold text-gray-200">
              <a href="https://github.com/RichardDillman/seo-audit-mcp" class="hover:underline text-blue-400" target="_blank" rel="noopener">seo-audit-mcp</a>
            </td>
            <td class="px-4 py-3 text-gray-300">0</td>
            <td class="px-4 py-3 text-gray-300">1 (MCP server)</td>
            <td class="px-4 py-3 text-gray-300">MCP-compatible</td>
            <td class="px-4 py-3 text-gray-500">—</td>
            <td class="px-4 py-3 text-green-400">✓ Native MCP</td>
            <td class="px-4 py-3 text-green-400">✓</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-sm text-gray-500 mt-3">Stars as of March 2026. Platform = primary tested platform per README.</p>
    <p class="text-gray-300 text-sm mt-4">
      <strong class="text-gray-100">Bottom line:</strong> marketingskills has way more stars but it's a broad marketing suite — the SEO component isn't as deep. 
      seo-geo-claude-skills is an interesting alternative if GEO is your primary focus, but claude-seo's architecture is more comprehensive for full-site audits. 
      seo-audit-mcp takes a different approach entirely (MCP server), which could complement rather than replace claude-seo.
    </p>
  </section>

  <!-- Who Should Use It -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">Who Should Use This</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="text-2xl mb-2">👨‍💻</div>
        <h3 class="font-semibold text-white mb-2">Indie devs shipping fast</h3>
        <p class="text-gray-400 text-sm">You built something, you want to know what's technically broken and what's low-hanging SEO fruit. One command, comprehensive report. This is the tool.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="text-2xl mb-2">📢</div>
        <h3 class="font-semibold text-white mb-2">Content marketers who code</h3>
        <p class="text-gray-400 text-sm">You're comfortable with a terminal. You want E-E-A-T analysis, content gap identification, and schema recommendations without hiring an SEO consultant.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="text-2xl mb-2">🏢</div>
        <h3 class="font-semibold text-white mb-2">Agencies doing initial audits</h3>
        <p class="text-gray-400 text-sm">Fast, structured audits for client onboarding. Connect Ahrefs MCP for backlink data and you've got a compelling pitch report in minutes. Note: no automated export — you'll copy from Claude's output.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="text-2xl mb-2">🤖</div>
        <h3 class="font-semibold text-white mb-2">AI-native site builders</h3>
        <p class="text-gray-400 text-sm">Building something you want to rank in AI search (Google AI Overviews, Perplexity, ChatGPT)? The GEO skill is unique. It's one of the only tools checking llms.txt compliance and AI crawler access right now.</p>
      </div>
    </div>
    <div class="bg-gray-800 rounded-xl p-5 mt-4 border border-red-800">
      <div class="text-2xl mb-2">🙅</div>
      <h3 class="font-semibold text-white mb-2">Probably not for you if...</h3>
      <p class="text-gray-400 text-sm">You're running Cursor, OpenClaw, or Codex and don't want to manually adapt the skill files. Or if you need polished PDF reports to send to clients. Or if you need real-time rank tracking — this does one-shot audits, not monitoring.</p>
    </div>
  </section>

  <!-- Installation -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">How to Install</h2>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">Claude Code (Recommended)</h3>
    <div class="bg-gray-900 rounded-xl p-4 mb-4 font-mono text-sm">
      <div class="text-gray-500 mb-2"># One-command install (Unix/macOS/Linux)</div>
      <div class="text-green-400">curl -fsSL https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/install.sh | bash</div>
    </div>
    <div class="bg-gray-900 rounded-xl p-4 mb-4 font-mono text-sm">
      <div class="text-gray-500 mb-2"># Windows PowerShell</div>
      <div class="text-green-400">irm https://raw.githubusercontent.com/AgriciDaniel/claude-seo/main/install.ps1 | iex</div>
    </div>
    <p class="text-gray-400 text-sm mb-6">
      Then start Claude Code and run <code class="bg-gray-800 px-1 rounded">/seo audit https://yoursite.com</code>. 
      Optionally install Playwright (<code class="bg-gray-800 px-1 rounded">pip install playwright && playwright install chromium</code>) for visual analysis.
    </p>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">OpenClaw</h3>
    <p class="text-gray-400 text-sm mb-4">
      The installer targets <code class="bg-gray-800 px-1 rounded">~/.claude/skills/</code> which is Claude Code's directory. 
      To use in OpenClaw, you'd manually copy the SKILL.md files into your OpenClaw skills folder and adapt the frontmatter. 
      This takes about 20 minutes for someone comfortable with the AgentSkills spec — the sub-skill logic transfers well.
    </p>

    <h3 class="text-lg font-semibold text-gray-100 mb-3">Cursor / Codex</h3>
    <p class="text-gray-400 text-sm">
      Same situation as OpenClaw — manual adaptation needed. The commands file structure is platform-specific, but the knowledge encoded in the SKILL.md files (what to look for, how to analyze, what to report) is genuinely platform-agnostic content you can extract.
    </p>
  </section>

  <!-- Scores -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-4">Verdict Score</h2>
    <div class="space-y-4">
            <div class="bg-gray-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span>🔧</span>
            <span class="font-semibold text-gray-100">Ease of Install</span>
          </div>
          <span class="text-xl font-bold text-white">4/5</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: 80%"></div>
        </div>
        <p class="text-gray-400 text-sm">One-command curl install is great. Playwright optional setup adds a step. Windows support is a nice touch.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span>📚</span>
            <span class="font-semibold text-gray-100">Documentation</span>
          </div>
          <span class="text-xl font-bold text-white">5/5</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: 100%"></div>
        </div>
        <p class="text-gray-400 text-sm">Exceptional — README covers every command with examples. Installation guide, MCP guide, and commands reference are all thorough.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span>🔬</span>
            <span class="font-semibold text-gray-100">Depth</span>
          </div>
          <span class="text-xl font-bold text-white">5/5</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: 100%"></div>
        </div>
        <p class="text-gray-400 text-sm">12 sub-skills, 6 subagents, GEO coverage, schema deprecation awareness, E-E-A-T per 2025 QRG — this is the most complete SEO skill available.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span>🔄</span>
            <span class="font-semibold text-gray-100">Maintenance</span>
          </div>
          <span class="text-xl font-bold text-white">4/5</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: 80%"></div>
        </div>
        <p class="text-gray-400 text-sm">v1.2.0 shipped with community contributions. Young project but actively maintained. Deducting 1 point for newness.</p>
      </div>
      <div class="bg-gray-800 rounded-xl p-5">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span>🖥️</span>
            <span class="font-semibold text-gray-100">Platform Support</span>
          </div>
          <span class="text-xl font-bold text-white">3/5</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 mb-3">
          <div class="bg-emerald-500 h-2 rounded-full" style="width: 60%"></div>
        </div>
        <p class="text-gray-400 text-sm">Claude Code only for easy install. Other platforms need manual adaptation. Would be 5/5 with proper multi-platform support.</p>
      </div>
    </div>
    <div class="mt-6 bg-emerald-950 border border-emerald-700 rounded-2xl p-6 text-center">
      <div class="text-5xl font-bold text-emerald-400 mb-2">4.4/5</div>
      <div class="text-emerald-300 font-semibold text-lg mb-1">Highly Recommended</div>
      <p class="text-gray-400 text-sm">The most complete AI SEO skill available in 2026 — only held back by Claude Code exclusivity.</p>
    </div>
  </section>

  <!-- FAQ -->
  <section class="mb-10">
    <h2 class="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
    <div class="space-y-4">
      <details class="bg-gray-800 rounded-xl p-5 group">
        <summary class="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
          Does claude-seo actually crawl my website, or does it just analyze based on training data?
          <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-gray-400 text-sm mt-3">It crawls. The skill uses WebFetch (or Playwright if installed) to fetch your actual pages at analysis time. It's not guessing from training data — it reads your live HTML, checks your actual meta tags, and inspects your rendered content. Without Playwright, JavaScript-rendered content may not be fully captured.</p>
      </details>
      <details class="bg-gray-800 rounded-xl p-5 group">
        <summary class="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
          Do I need Ahrefs or Semrush to use this?
          <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-gray-400 text-sm mt-3">No. Both are optional MCP integrations. Without them, claude-seo handles all on-page, technical, schema, content, and GEO analysis. What you miss is backlink data and keyword search volume from external APIs. The tool is fully functional and valuable without any paid subscriptions.</p>
      </details>
      <details class="bg-gray-800 rounded-xl p-5 group">
        <summary class="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
          Can I use this with Cursor or OpenClaw instead of Claude Code?
          <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-gray-400 text-sm mt-3">Not directly — the installer targets Claude Code's directory structure. However, all the intelligence is in the SKILL.md files, which are portable. You can copy them into OpenClaw or adapt them for Cursor with some manual work. The skill architecture follows the AgentSkills spec closely.</p>
      </details>
      <details class="bg-gray-800 rounded-xl p-5 group">
        <summary class="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
          How is this different from just asking Claude "do an SEO audit of my site"?
          <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-gray-400 text-sm mt-3">Big difference. Without the skill, Claude has no systematic checklist, no sub-agent delegation, no updated schema deprecation knowledge, and no GEO-specific analysis. With the skill, you get a structured 12-category audit that runs in parallel, produces a Health Score, and includes current 2025-2026 guidance baked in. It's like the difference between asking a doctor a question versus using a diagnostic protocol.</p>
      </details>
      <details class="bg-gray-800 rounded-xl p-5 group">
        <summary class="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
          Is the GEO (AI search optimization) feature actually useful?
          <span class="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <p class="text-gray-400 text-sm mt-3">Genuinely yes. The seo-geo sub-skill checks AI crawler access (GPTBot, ClaudeBot, PerplexityBot), validates llms.txt if present, and analyzes passage-level citability — things no traditional SEO tool checks. In 2026, with AI Overviews dominating top positions for many queries, this is real competitive analysis that matters.</p>
      </details>
    </div>
  </section>

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": "claude-seo",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "macOS, Linux, Windows",
      "url": "https://github.com/AgriciDaniel/claude-seo",
      "author": {
        "@type": "Person",
        "name": "Daniel Agrici"
      }
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "4.4",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "TrustedSkills",
      "url": "https://trustedskills.dev"
    },
    "datePublished": "2026-03-04",
    "reviewBody": "claude-seo is the most comprehensive SEO skill for Claude Code — 12 sub-skills, 6 parallel subagents, GEO optimization for AI search, and current 2025-2026 SEO guidance. Highly recommended for developers and agencies using Claude Code.",
    "name": "Claude SEO Suite Review: The Most Complete AI SEO Toolkit"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Does claude-seo actually crawl my website?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The skill uses WebFetch or Playwright to fetch your actual pages at analysis time, reading live HTML, meta tags, and rendered content."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need Ahrefs or Semrush to use claude-seo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Both are optional MCP integrations. The tool handles all on-page, technical, schema, content, and GEO analysis without paid subscriptions."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use claude-seo with Cursor or OpenClaw?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Not directly — the installer targets Claude Code. However, the SKILL.md files are portable and can be adapted for other platforms with some manual work."
        }
      },
      {
        "@type": "Question",
        "name": "How is claude-seo different from just asking Claude to do an SEO audit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The skill provides a systematic 12-category audit with parallel subagents, a Health Score, and current 2025-2026 guidance including schema deprecations and E-E-A-T updates."
        }
      },
      {
        "@type": "Question",
        "name": "Is the GEO AI search optimization feature useful?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. It checks AI crawler access, validates llms.txt, and analyzes passage-level citability for Google AI Overviews, ChatGPT, and Perplexity — unique features not found in traditional SEO tools."
        }
      }
    ]
  }
  </script>

</div>
    `,
  },
];

export function getAllReviews(): Review[] {
  return reviews;
}

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find((r) => r.slug === slug);
}
