/**
 * reclassify.mjs
 * Classifies all 26k skills into a 14-category taxonomy.
 *
 * Strategy: slug-token matching (slug is the only reliable signal for 96%
 * of imported skills which have stub descriptions).
 *
 * For the ~320 skills with real descriptions, use description keywords too.
 *
 * Run: node scripts/reclassify.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, "../data/skills-index.json");
const DRY_RUN = process.argv.includes("--dry-run");

const idx = JSON.parse(readFileSync(indexPath, "utf8"));

// ── Token → Category maps ──────────────────────────────────────────────────
// Slug tokens (hyphen-split words) that strongly indicate a category.
// More specific tokens listed first where ambiguous.

const TOKEN_MAP = {
  // cloud
  azure: "cloud", aws: "cloud", gcp: "cloud", cloudflare: "cloud",
  kubernetes: "cloud", k8s: "cloud", terraform: "cloud", pulumi: "cloud",
  serverless: "cloud", docker: "cloud",

  // agents
  mcp: "agents", subagent: "agents", agentic: "agents",
  swarm: "agents", dispatching: "agents",

  // devops
  cicd: "devops", pipeline: "devops", monitoring: "devops",
  observability: "devops", appinsights: "devops", appinsight: "devops",
  deployment: "devops", devops: "devops", helm: "devops", ansible: "devops",
  release: "devops", "release-manag": "devops",

  // security
  oauth: "security", rbac: "security", entra: "security",
  compliance: "security", pentest: "security", csrf: "security",
  jwt: "security", saml: "security", sso: "security",
  authenticate: "security", authorization: "security", cryptography: "security",

  // database
  postgres: "database", postgresql: "database", mysql: "database",
  sqlite: "database", mongodb: "database", mongo: "database",
  redis: "database", supabase: "database", neon: "database",
  clickhouse: "database", planetscale: "database",
  prisma: "database", drizzle: "database",

  // testing
  playwright: "testing", vitest: "testing", jest: "testing",
  cypress: "testing", selenium: "testing", lighthouse: "testing",
  debugging: "testing",

  // ai-ml
  llm: "ai-ml", rag: "ai-ml", embedding: "ai-ml",
  diffusion: "ai-ml", midjourney: "ai-ml", openai: "ai-ml",
  gemini: "ai-ml", qwen: "ai-ml", seedance: "ai-ml",

  // frontend — UI/web frameworks
  react: "frontend", nextjs: "frontend", vue: "frontend",
  angular: "frontend", svelte: "frontend", astro: "frontend",
  flutter: "frontend", tailwind: "frontend", framer: "frontend",
  expo: "frontend", swiftui: "frontend", swift: "frontend",
  shadcn: "frontend", vite: "frontend",

  // backend — server frameworks/languages
  nodejs: "backend", express: "backend", nestjs: "backend",
  fastapi: "backend", django: "backend", rails: "backend",
  laravel: "backend", springboot: "backend", graphql: "backend",
  grpc: "backend", websocket: "backend", microservice: "backend",
  fastify: "backend", rust: "backend", kotlin: "backend",
  csharp: "backend", dotnet: "backend", golang: "backend",
  typescript: "backend", javascript: "backend",
  python: "backend", java: "backend",

  // data
  etl: "data", dbt: "data", airflow: "data",
  tableau: "data", looker: "data", visualization: "data",
  analytics: "data",

  // video-media
  remotion: "video-media", ffmpeg: "video-media", youtube: "video-media",
  manimce: "video-media",

  // marketing
  seo: "marketing", copywriting: "marketing", cro: "marketing",
  referral: "marketing", growth: "marketing",

  // writing
  readme: "writing", changelog: "writing", documentation: "writing",

  // productivity
  brainstorm: "productivity", calendar: "productivity", planner: "productivity",
  reminder: "productivity",
};

// Keyword→category for longer compound patterns (checked against full slug)
const SLUG_PATTERNS = [
  // agents
  [/^(agent|mcp)-/, "agents"],
  [/dispatching.*agent|multi.*agent|subagent|skill-creat|skill-vet|self-improv|memory-optim|agentic/, "agents"],
  [/-(agent|mcp)(-|$)/, "agents"],

  // cloud
  [/^(azure|aws|gcp|cloudflare|terraform|kubernetes|k8s)-/, "cloud"],
  [/^(azure|aws|gcp|cloudflare)-/, "cloud"],
  [/-(azure|aws|gcp|terraform|cloudflare|kubernetes)(-|$)/, "cloud"],
  [/cloud-(run|deploy|migrat|infra|function|storage|compute|security|monitor)/, "cloud"],
  [/microsoft-foundry|azure-ai|azure-hosted/, "cloud"],

  // devops
  [/github-action|ci-cd|appinsights|appinsight|azure-observ|azure-diagnos|azure-deploy|vercel-deployment/, "devops"],
  [/-(cicd|pipeline|monitoring|observability|deployment|ci-cd)(-|$)/, "devops"],

  // security
  [/^(auth|oauth|security|compliance|entra|rbac)-/, "security"],
  [/(^|-)auth(entication|enticate|orization|orize)?(-|$)/, "security"],
  [/-(security|compliance|oauth|rbac|entra)(-|$)/, "security"],
  [/springboot-security|convex-security|security-(best|audit|req)|authenticate-wallet|entra-(app|agent)/, "security"],

  // database
  [/^(postgres|sql|database|supabase|mongo|redis|neon|clickhouse|prisma|drizzle)-/, "database"],
  [/-(postgres|sql|database|mongodb|redis|supabase|clickhouse)(-|$)/, "database"],
  [/sql-optim|schema-design|data-model|database-schema|table-design/, "database"],
  [/azure-postgres|supabase-postgres/, "database"],

  // testing
  [/^(test|testing|debug|playwright|vitest|cypress|ab-test)-/, "testing"],
  [/-(testing|tests|debug|e2e|playwright|vitest|jest|cypress)(-|$)/, "testing"],
  [/test-driven|webapp-test|backend-test|swift-testing|python-testing|terraform-test|vue-debug|systematic-debug|performance-test/, "testing"],
  [/requesting-code-review|receiving-code-review/, "testing"],  // code review → testing

  // ai-ml
  [/^(llm|rag|embed|image-gen|video-gen|ai-image|ai-video|qwen-image|seedance|letzai)-/, "ai-ml"],
  [/-(llm|rag|embedding|diffusion|image-gen|video-gen)(-|$)/, "ai-ml"],
  [/ai-image|ai-video|ai-model|openai-image|image-generation|video-generation/, "ai-ml"],

  // frontend
  [/^(react|next|nextjs|vue|angular|svelte|astro|flutter|tailwind|css|framer|canvas|svg|color|brand|theme|motion|mobile|ui-|ux-)-/, "frontend"],
  [/-(react|vue|angular|svelte|flutter|tailwind|mobile)(-|$)/, "frontend"],
  [/web-design-guideline|frontend-design|sleek-design|ui-ux-pro|building-native|native-data|design-md|design-system/, "frontend"],
  [/vercel-react|vercel-composition|vercel-react-native|remotion-render/, "frontend"],
  [/davila7-ui|davila7-design|senior-frontend|web-performance|color-palette|svg-logo|brand-guideline|algorithmic-art/, "frontend"],
  [/react:component|web-artifacts|next-best|stitch-loop/, "frontend"],
  [/-(frontend|design-system|ui-component|mobile-app)(-|$)/, "frontend"],
  [/framer-motion|jezweb-motion|canvas-design/, "frontend"],

  // backend
  [/^(node|nodejs|express|nestjs|nest|fastapi|django|rails|laravel|spring|springboot|grpc|graphql|rust|kotlin|csharp|dotnet|python|golang|java)-/, "backend"],
  [/-(nodejs|nestjs|fastapi|django|springboot|graphql|grpc|backend|microservice)(-|$)/, "backend"],
  [/spring-boot-engineer|nestjs-expert|rust-engineer|kotlin-specialist|clean-ddd|csharp-developer|openrouter-typescript|typescript-advanced/, "backend"],
  [/api-design|api-documentation|api-designer|api-generator|rest-api/, "backend"],
  [/-(nodejs|nestjs|backend|microservice|rest-api)(-|$)/, "backend"],

  // data
  [/^(data-anal|analytics|etl|dbt|airflow|looker|tableau|data-engineer|data-viz|visualization)-/, "data"],
  [/-(analytics|etl|data-pipeline|visualization|reporting)(-|$)/, "data"],
  [/data-analyst|analytics-tracking|visualization-expert|business-intel/, "data"],

  // video-media
  [/^(video|remotion|ffmpeg|audio|media|youtube|seedance|manimce)-/, "video-media"],
  [/-(video|remotion|ffmpeg|audio|media)(-|$)/, "video-media"],
  [/stitch-loop|jezweb-motion|image-proc|remotion-best|remotion-video/, "video-media"],

  // marketing
  [/^(seo|marketing|copywriting|cro|paid-ads|social-content|email-seq|growth|referral|programmatic-seo|brand-voice|twitter-autom)-/, "marketing"],
  [/-(seo|marketing|cro|growth)(-|$)/, "marketing"],
  [/marketing-psychol|product-marketing|copy-editing|audit-website|diagnose-seo|seo-aeo|target-serp|beat-competitor|lead-research/, "marketing"],
  [/page-cro|signup-flow-cro|paywall-cro|onboarding-cro|form-cro|popup-cro|free-tool-strat|content-strat|pricing-strategy/, "marketing"],
  [/social-content|twitter-autom|email-sequence|launch-strategy|competitor-altern|schema-markup/, "marketing"],

  // writing
  [/^(technical-writ|api-doc|user-guide|readme|changelog|blog|document-writ|writing-skill|doc-coauthor)-/, "writing"],
  [/technical-blog|api-documentation-generator|openai-docs-skill|writing-skill|doc-coauthor|docx|pptx|pdf$|xlsx$/, "writing"],
  [/^(pdf|docx|pptx|xlsx|csv)(-|$)/, "writing"],  // document format skills

  // productivity
  [/^(project-plan|task-manag|calendar|brainstorm|personal-assist|productivity|note|planner|simple-brainstorm)-/, "productivity"],
  [/simple-brainstorm|project-planner|strategic-compact|personal-assistant/, "productivity"],
  [/^(pdf$|docx$|pptx$|xlsx$|pdf-|ppt-|word-)/, "writing"],

  // special catches
  [/^(pdf|doc|ppt|xls|word|excel|powerpoint)$/, "writing"],
  [/^(pdf|docx|pptx|xlsx|csv)(-|$)/, "writing"],
  [/find-skills|mcp-builder|skill-builder|skill-creat|skill-vet|skill-vett|agent-tools/, "agents"],
  [/dispatching-parallel|parallel-task|parallel-agent|swarm-planner|super-swarm|plan-harder|role-creator|context-sync|subagent-driven/, "agents"],
  [/using-git|git-worktree|git-workflow|git-commit|github-workflow|pr-creator|read-github|differential-review|code-review|code-reviewer|requesting-code|receiving-code/, "backend"],
  [/microsoft-foundry|azure-ai-gateway|azure-hosted|azure-aigateway|azure-messaging|azure-kusto|azure-compute|azure-validate|azure-resource|azure-cloud/, "cloud"],
  [/internal-comms|communication/, "productivity"],
  [/upgrading-expo|expo-deploy|expo-upgrade/, "frontend"],
  [/nano-banana|template-skill|playground|gepetto/, null],  // intentional other
  // Architecture, patterns, best-practices → infer from context word
  [/react.*pattern|react.*component|react.*best|react.*native/, "frontend"],
  [/next.*best|next.*pattern|nextjs.*best|nextjs.*pattern/, "frontend"],
  [/vue.*best|vue.*pattern|angular.*best|svelte.*best|flutter.*best|tailwind.*best/, "frontend"],
  [/python.*pattern|python.*best|python.*test|python.*pro/, "backend"],
  [/node.*best|node.*pattern|express.*best|laravel.*best|spring.*best|springboot.*best/, "backend"],
  [/typescript.*best|typescript.*pattern|typescript.*sdk/, "backend"],
  [/rust.*engineer|rust.*best|rust.*pattern/, "backend"],
  [/swift.*best|swift.*test|swiftui.*best|swiftui.*expert/, "frontend"],
  [/aws.*best|aws.*pattern|azure.*best|gcp.*best|terraform.*best|docker.*best|kubernetes.*best/, "cloud"],
  [/sql.*optim|sql.*best|database.*best|database.*pattern|postgres.*best|supabase.*best/, "database"],
  [/security.*best|security.*audit|security.*pattern|auth.*best|auth.*pattern/, "security"],
  [/seo.*best|seo.*audit|seo.*content|seo.*pattern|marketing.*best|marketing.*strateg/, "marketing"],
  [/test.*best|test.*pattern|debug.*best|testing.*best|testing.*strateg/, "testing"],
  [/devops.*best|deploy.*best|ci.*best|pipeline.*best/, "devops"],
  [/llm.*best|ai.*best|rag.*best|embedding.*best/, "ai-ml"],
  [/ai.*sdk|ai.*image|ai.*video|ai.*generat/, "ai-ml"],
  [/ui.*design|ux.*design|design.*system|design.*pattern|design.*best|ui.*best|ux.*best/, "frontend"],
  [/mobile.*best|mobile.*app|mobile.*pattern/, "frontend"],
  [/shadcn.*ui|davila7|sleek.*design|web.*design|frontend.*design|interface.*design/, "frontend"],
  [/architecture.*pattern|architecture.*design|clean.*arch|hexagonal|ddd.*arch/, "backend"],
  [/workflow.*automat|automation.*workflow/, "productivity"],
  [/data.*analysis|data.*analyst|data.*visual|data.*pipeline|analytics.*track/, "data"],
  [/technical.*writ|technical.*blog|api.*doc|user.*guide|writing.*skill/, "writing"],
  [/content.*humaniz|blog.*post|copy.*edit|doc.*coauthor/, "writing"],
  [/pricing.*strateg|launch.*strateg|competitor.*alt|email.*sequence|social.*content|paid.*ads|page.*cro|signup.*cro|paywall.*cro|onboarding.*cro|form.*cro|popup.*cro|free.*tool|referral.*program|audit.*website/, "marketing"],
  [/content.*strat|schema.*markup|programmatic.*seo|diagnose.*seo|seo.*aeo|target.*serp|beat.*compet|lead.*research|marketing.*psychol|product.*marketing|social.*media|twitter.*auto|enhance.*prompt/, "marketing"],
  [/systematic.*debug|test.*driven|webapp.*test|backend.*test/, "testing"],
  [/simple.*brainstorm|project.*plan|personal.*assist|time.*manag|strategic.*compact/, "productivity"],
  [/canvas.*design|remotion.*render|remotion.*best|video.*prompt|image.*proc/, "video-media"],
  [/git.*workflow|github.*assist|pr.*creat|code.*review|differential.*review/, "backend"],
  [/internal.*comms|team.*comms/, "productivity"],
  [/upgrading.*expo|expo.*deploy/, "frontend"],
  [/turborepo|monorepo|build.*system|build.*cluster/, "devops"],
  [/web.*artifact|web.*scraping|web.*search|web.*perf/, "backend"],
  [/context7|markdown.*url|yaml.*|json.*|toml.*/, "backend"],
  [/shadcn|vite.*best|vite.*pattern/, "frontend"],
  [/gemini.*computer|gemini.*vision|openai.*sdk|openai.*func|openai.*docs/, "ai-ml"],
  [/enhance.*prompt|prompt.*optim|prompt.*engineer|prompt.*creat/, "ai-ml"],
  [/qwen.*image|ai.*image.*gen/, "ai-ml"],
  [/convex.*security/, "security"],
  [/financial.*|finance.*|excel.*|spreadsheet.*/, "data"],
  [/algo.*art|algorithmic.*art/, "frontend"],
  [/n8n|zapier|make.*automat|workflow.*builder/, "productivity"],
  [/firebase.*|supabase.*auth/, "backend"],
  [/sanity.*best|sanity.*pattern/, "backend"],
  [/swiftui.*expert|ios.*best|ios.*pattern/, "frontend"],
  [/product.*manag|scrum.*|agile.*|sprint.*|backlog.*/, "productivity"],
  [/code.*runner|code.*exec|sandbox.*exec/, "backend"],
  [/github.*assist|git.*best|github.*repo|git.*worktree|using.*git/, "backend"],
  [/parallel.*task|parallel.*agent|task.*dispatch|async.*task/, "agents"],
  [/agent.*email|agent.*browser|agent.*tool|agent.*device/, "agents"],
  [/ai.*sdk|sdk.*typescript|sdk.*python|openrouter/, "backend"],

  // High-frequency generic patterns inferred from slug meaning
  [/refactor|refactoring|code-quality|clean-code|code-smell/, "backend"],
  [/codebase-search|codebase-index|codebase-nav|codebase-anal/, "backend"],
  [/performance-optim|perf-optim|web-perf|core-web|page-speed/, "frontend"],
  [/web-accessibility|accessibility-audit|a11y/, "frontend"],
  [/responsive-design|mobile-responsive|responsive-layout/, "frontend"],
  [/ui-component|ui-pattern|state-management|use-dom|use-ref|use-effect|dom-manip/, "frontend"],
  [/log-analysis|log-parsing|log-monitor|error-tracking|error-monitor/, "devops"],
  [/environment-setup|system-setup|dev-setup|local-setup|npm-git|git-submodule/, "backend"],
  [/task-planning|task-estimation|standup|sprint-plan|backlog-grooming/, "productivity"],
  [/file-organization|file-management|file-structur/, "productivity"],
  [/pattern-detection|code-pattern|design-pattern/, "backend"],
  [/bmad-orchestrat|bmad-workflow|bmad-flow/, "agents"],
  [/skill-standard|skill-template|skill-packag/, "agents"],
  [/slack-gif|gif-creat/, "video-media"],
  [/pollinations|stability-ai|replicate-ai/, "ai-ml"],
  [/code-refactor|code-review-helper|code-analysis/, "backend"],
  [/npm-install|npm-git|package-manager/, "backend"],
  [/opencontext|context-window|context-manage/, "agents"],
  [/baoyu.*article|baoyu.*cover|baoyu.*image/, "video-media"],
  [/ralph.*|gepetto.*/, null],  // opaque names → other
  [/prompt-repetit|prompt-optim|prompt-standard/, "ai-ml"],

  // Specific tool/framework names
  [/genkit/, "ai-ml"],
  [/mastra/, "agents"],
  [/vueuse/, "frontend"],
  [/pinia/, "frontend"],
  [/nuxt/, "frontend"],
  [/pnpm|bun-install|yarn-install|package-lock/, "backend"],
  [/gh-cli|github-cli|git-cli/, "backend"],
  [/prd.*|product-req|product-spec/, "productivity"],
  [/cold-email|email-outreach|outreach-email/, "marketing"],
  [/backlink|domain-authority|link-building/, "marketing"],
  [/ad-creative|ad-copy|google-ads|facebook-ads/, "marketing"],
  [/error-handling|error-pattern|error-boundar/, "backend"],
  [/antfu|eslint-config|prettier-config/, "backend"],
  [/vibe-kanban|kanban|jira-integr|trello/, "productivity"],
  [/plannotator|annotator/, "productivity"],
  [/baoyu.*slide|slide-deck|presentation-creat/, "writing"],
  [/baoyu.*post|baoyu.*x-to|baoyu.*wechat|post-to-x|post-to-linkedin/, "marketing"],
  [/baoyu.*comic|baoyu.*infographic|baoyu.*url|baoyu.*article|baoyu.*image|infographic/, "video-media"],
  [/oh-my-codex|ohmg|omc|jeo|ralph/, null],  // opaque → other
];

// ── Is description real (not a stub)? ────────────────────────────────────
function hasRealDescription(skill) {
  const d = (skill.description ?? "").trim().toLowerCase();
  const n = (skill.name ?? skill.slug).toLowerCase().replace(/[_-]/g, " ");
  return d.length > n.length + 15 && !d.startsWith(n) && d.length > 40;
}

// ── Classify by slug ──────────────────────────────────────────────────────
function classifyBySlug(slug) {
  // 1. Direct token match (split on hyphen)
  const tokens = slug.split("-");
  for (const token of tokens) {
    if (TOKEN_MAP[token]) return TOKEN_MAP[token];
    // Partial prefix match for compound tokens
    for (const [key, cat] of Object.entries(TOKEN_MAP)) {
      if (key.length >= 4 && token.startsWith(key.replace(/-/g, ""))) return cat;
    }
  }
  // 2. Pattern match against full slug
  for (const [re, cat] of SLUG_PATTERNS) {
    if (re.test(slug)) return cat; // null = intentional other
  }
  return undefined; // no match
}

// ── Classify by description (for the 319 real ones) ───────────────────────
function classifyByDescription(skill) {
  const d = (skill.description ?? "").toLowerCase();
  if (/playwright|vitest|jest|cypress|unit test|e2e test|integration test|ab test|load test|debug/.test(d)) return "testing";
  if (/postgres|mysql|redis|mongodb|sqlite|clickhouse|supabase|database schema|sql query/.test(d)) return "database";
  if (/terraform|kubernetes|k8s|serverless|aws |azure |gcp |cloud provider|cloudflare/.test(d)) return "cloud";
  if (/oauth|authentication|authorization|rbac|compliance|jwt|saml|sso/.test(d)) return "security";
  if (/deploy|ci\/cd|pipeline|monitoring|observability|continuous integr/.test(d)) return "devops";
  if (/llm|language model|embedding|rag |fine.tun|image generat|video generat|diffusion/.test(d)) return "ai-ml";
  if (/mcp|multi.agent|subagent|orchestrat|tool.use|agentic/.test(d)) return "agents";
  if (/react|next\.js|vue|angular|svelte|tailwind|flutter|mobile app|framer|design system/.test(d)) return "frontend";
  if (/node\.?js|express|nest\.?js|fastapi|django|rails|graphql|rest api|backend|spring boot/.test(d)) return "backend";
  if (/seo|search engine|content strateg|copywriting|email marketing|paid ads|growth|cro|conversion rate/.test(d)) return "marketing";
  if (/technical writing|api documentation|user guide|readme|changelog|blog post/.test(d)) return "writing";
  if (/analytics|etl|data pipeline|visualization|business intelligence|dbt|airflow/.test(d)) return "data";
  if (/video|remotion|ffmpeg|audio|youtube|media process/.test(d)) return "video-media";
  if (/brainstorm|project plan|calendar|productivity|task manag|personal assistant/.test(d)) return "productivity";
  return null;
}

// ── Original non-dev categories to keep if no rule matches ────────────────
const KEEP_CATS = new Set(["utilities", "crypto", "media", "communication"]);

// ── Run ───────────────────────────────────────────────────────────────────
const stats = {};
let changed = 0;
let noMatch = 0;
const changes = [];

for (const skill of idx.skills) {
  const original = skill.category ?? "dev";
  let newCat = classifyBySlug(skill.slug);

  // null = intentional other from SLUG_PATTERNS
  if (newCat === undefined) {
    // Try description for real descriptions
    if (hasRealDescription(skill)) {
      newCat = classifyByDescription(skill) ?? null;
    }
    // If still unresolved, check KEEP_CATS
    if (newCat === undefined) {
      newCat = KEEP_CATS.has(original) ? original : "other";
    }
  }
  if (newCat === null) newCat = "other";

  if (newCat === "other") noMatch++;
  if (newCat !== original) {
    changes.push({ slug: skill.slug, from: original, to: newCat, installs: skill.installs ?? 0 });
    changed++;
  }

  skill.category = newCat;
  stats[newCat] = (stats[newCat] ?? 0) + 1;
}

// ── Report ────────────────────────────────────────────────────────────────
console.log("\n📊 Category distribution:\n");
const sorted = Object.entries(stats).sort((a, b) => b[1] - a[1]);
for (const [cat, count] of sorted) {
  const bar = "█".repeat(Math.round(count / 120));
  console.log(`  ${count.toString().padStart(5)}  ${cat.padEnd(16)} ${bar}`);
}
console.log(`\n  Total: ${idx.skills.length}`);
console.log(`  Changed: ${changed}`);
console.log(`  Unclassified → "other": ${noMatch}`);

if (DRY_RUN) {
  console.log("\n⚠️  DRY RUN — not written.\n");
  // Show top-installs landing in "other"
  const others = idx.skills
    .filter(s => s.category === "other")
    .sort((a, b) => (b.installs ?? 0) - (a.installs ?? 0));
  console.log(`Top 30 by installs landing in "other":`);
  others.slice(0, 30).forEach(s =>
    console.log(`  [${(s.installs ?? 0).toString().padStart(6)}] ${s.slug}`)
  );
} else {
  writeFileSync(indexPath, JSON.stringify(idx, null, 2));
  console.log("\n✅ Written to data/skills-index.json");
}
