/**
 * legacy-slug-rules.mjs
 *
 * The hand-tuned slug rules from the original March classifier, kept verbatim.
 *
 * These were written by reading the catalogue and they are high precision on
 * the slugs they recognise — worth keeping. What made them insufficient was
 * being the *only* signal and first-match-wins: they saw nothing but the slug,
 * so anything not named after a framework fell through to "other".
 *
 * They are now one weighted input to the classifier rather than the verdict.
 * A `null` result means "the rules deliberately recognise this as generic"
 * (opaque project names like `ralph`), which is different from `undefined`,
 * meaning "no rule matched".
 */

// Slug tokens (hyphen-split words) that strongly indicate a category.
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

// Patterns checked against the full slug.
const SLUG_PATTERNS = [
  // agents
  [/^(agent|mcp)-/, "agents"],
  [/dispatching.*agent|multi.*agent|subagent|skill-creat|skill-vet|self-improv|memory-optim|agentic/, "agents"],
  [/-(agent|mcp)(-|$)/, "agents"],

  // cloud
  [/^(azure|aws|gcp|cloudflare|terraform|kubernetes|k8s)-/, "cloud"],
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
  [/requesting-code-review|receiving-code-review/, "testing"],

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
  [/^(pdf|docx|pptx|xlsx|csv)(-|$)/, "writing"],

  // productivity
  [/^(project-plan|task-manag|calendar|brainstorm|personal-assist|productivity|note|planner|simple-brainstorm)-/, "productivity"],
  [/simple-brainstorm|project-planner|strategic-compact|personal-assistant/, "productivity"],
  [/^(pdf$|docx$|pptx$|xlsx$|pdf-|ppt-|word-)/, "writing"],

  // special catches
  [/^(pdf|doc|ppt|xls|word|excel|powerpoint)$/, "writing"],
  [/find-skills|mcp-builder|skill-builder|skill-creat|skill-vet|skill-vett|agent-tools/, "agents"],
  [/dispatching-parallel|parallel-task|parallel-agent|swarm-planner|super-swarm|plan-harder|role-creator|context-sync|subagent-driven/, "agents"],
  [/using-git|git-worktree|git-workflow|git-commit|github-workflow|pr-creator|read-github|differential-review|code-review|code-reviewer|requesting-code|receiving-code/, "backend"],
  [/microsoft-foundry|azure-ai-gateway|azure-hosted|azure-aigateway|azure-messaging|azure-kusto|azure-compute|azure-validate|azure-resource|azure-cloud/, "cloud"],
  [/internal-comms|communication/, "productivity"],
  [/upgrading-expo|expo-deploy|expo-upgrade/, "frontend"],
  [/nano-banana|template-skill|playground|gepetto/, null],
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
  [/context7|markdown.*url/, "backend"],
  [/shadcn|vite.*best|vite.*pattern/, "frontend"],
  [/gemini.*computer|gemini.*vision|openai.*sdk|openai.*func|openai.*docs/, "ai-ml"],
  [/enhance.*prompt|prompt.*optim|prompt.*engineer|prompt.*creat/, "ai-ml"],
  [/qwen.*image|ai.*image.*gen/, "ai-ml"],
  [/convex.*security/, "security"],
  [/financial|finance|excel|spreadsheet/, "data"],
  [/algo.*art|algorithmic.*art/, "frontend"],
  [/n8n|zapier|make.*automat|workflow.*builder/, "productivity"],
  [/firebase|supabase.*auth/, "backend"],
  [/sanity.*best|sanity.*pattern/, "backend"],
  [/swiftui.*expert|ios.*best|ios.*pattern/, "frontend"],
  [/product.*manag|scrum|agile|sprint|backlog/, "productivity"],
  [/code.*runner|code.*exec|sandbox.*exec/, "backend"],
  [/github.*assist|git.*best|github.*repo|git.*worktree|using.*git/, "backend"],
  [/parallel.*task|parallel.*agent|task.*dispatch|async.*task/, "agents"],
  [/agent.*email|agent.*browser|agent.*tool|agent.*device/, "agents"],
  [/sdk.*typescript|sdk.*python|openrouter/, "backend"],

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
  [/ralph|gepetto/, null],
  [/prompt-repetit|prompt-optim|prompt-standard/, "ai-ml"],

  [/genkit/, "ai-ml"],
  [/mastra/, "agents"],
  [/vueuse/, "frontend"],
  [/pinia/, "frontend"],
  [/nuxt/, "frontend"],
  [/pnpm|bun-install|yarn-install|package-lock/, "backend"],
  [/gh-cli|github-cli|git-cli/, "backend"],
  [/prd|product-req|product-spec/, "productivity"],
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
  [/oh-my-codex|ohmg|omc|jeo/, null],
];

/**
 * @returns a category slug, `null` for a deliberate "other", or `undefined`
 *          when no rule recognised the slug.
 */
export function legacySlugCategory(slug) {
  const tokens = slug.split("-");
  for (const token of tokens) {
    if (TOKEN_MAP[token]) return TOKEN_MAP[token];
    for (const [key, cat] of Object.entries(TOKEN_MAP)) {
      if (key.length >= 4 && token.startsWith(key.replace(/-/g, ""))) return cat;
    }
  }
  for (const [re, cat] of SLUG_PATTERNS) {
    if (re.test(slug)) return cat;
  }
  return undefined;
}
