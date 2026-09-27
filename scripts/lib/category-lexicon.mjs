/**
 * category-lexicon.mjs
 *
 * Weighted vocabulary for the skill category classifier.
 *
 * Each category lists terms in three specificity tiers:
 *
 *   a — unambiguous. A named technology, product or standard that belongs to
 *       exactly one category ("postgres", "playwright", "ffmpeg", "semrush").
 *       Seeing one of these is close to proof on its own.
 *   b — strong domain vocabulary. Not a proper noun, but clearly of the
 *       domain ("migration", "authorization", "conversion rate").
 *   c — weak and contextual. Words that lean a direction but appear all over
 *       the catalogue ("data", "design", "content"). Tier-c evidence is
 *       capped per category so a pile of it can never outvote one tier-a hit.
 *
 * A term may legitimately appear under more than one category — "docker" is
 * evidence for both cloud and devops. The classifier sums evidence and takes
 * the best-supported category rather than stopping at the first match, so
 * overlap is a feature, not a bug to be resolved here.
 *
 * Multi-word terms are written space-separated and matched as phrases.
 * Where a name has a conventional compact spelling, list both forms
 * ("next js" and "nextjs") — matching is literal, not fuzzy.
 */

export const LEXICON = {
  frontend: {
    a: [
      "react", "nextjs", "next js", "vue", "vuejs", "angular", "svelte", "sveltekit",
      "astro", "solidjs", "qwik", "remix", "nuxt", "preact", "lit", "alpinejs",
      "tailwind", "tailwindcss", "shadcn", "chakra ui", "mui", "material ui",
      "bootstrap", "bulma", "css", "scss", "sass", "less", "postcss", "html",
      "dom", "jsx", "tsx", "flutter", "swiftui", "uikit", "expo", "react native",
      "framer", "framer motion", "gsap", "threejs", "three js", "d3", "storybook",
      "vite", "webpack", "rollup", "parcel", "esbuild", "figma", "pinia", "vuex",
      "vueuse", "radix", "headless ui", "emotion", "styled components",
      "web components", "htmx", "jquery", "ionic", "capacitor", "electron",
      "a11y", "wcag", "aria", "lighthouse score", "core web vitals",
      "tauri", "tanstack", "react query", "twig", "blade template",
      "handlebars", "pug template", "mantine", "ant design", "primevue",
      "vuetify", "quasar", "nativescript", "jetpack compose", "xcode",
      "zustand", "redux", "mobx", "recoil", "jotai",
    ],
    b: [
      "frontend", "front end", "ui", "ux", "ui ux", "component", "components",
      "responsive", "responsive design", "layout", "stylesheet", "styling",
      "animation", "transition", "accessibility", "design system", "viewport",
      "mobile app", "ios", "android", "browser", "spa", "single page",
      "hydration", "ssr", "server side rendering", "client side", "rendering",
      "typography", "font", "wireframe", "mockup", "prototype", "colour palette",
      "color palette", "theme", "theming", "dark mode", "icon", "iconography",
      "svg", "canvas", "landing page", "navigation", "menu", "modal", "dropdown",
      "form validation", "state management", "hooks", "props", "virtual dom",
      "css grid", "flexbox", "media query", "breakpoint", "pixel perfect",
    ],
    c: ["design", "interface", "visual", "style", "screen", "button", "page", "web", "mobile"],
  },

  backend: {
    a: [
      "nodejs", "node js", "express", "expressjs", "nestjs", "nest js", "fastify",
      "koa", "hapi", "fastapi", "flask", "django", "rails", "ruby on rails",
      "laravel", "symfony", "spring", "spring boot", "springboot", "dotnet",
      "net core", "aspnet", "asp net", "gin", "actix", "axum", "graphql",
      "grpc", "trpc", "openapi", "swagger", "websocket", "websockets",
      "socket io", "celery", "sidekiq", "rabbitmq", "kafka", "nats", "zeromq",
      "protobuf", "golang", "go lang", "rust", "kotlin", "csharp", "c sharp",
      "java", "python", "typescript", "javascript", "php", "ruby", "elixir",
      "erlang", "scala", "clojure", "haskell", "deno", "bun", "perl", "lua",
      "git", "github", "gitlab", "bitbucket", "npm", "pnpm", "yarn", "monorepo",
      "turborepo", "nx", "lerna", "eslint", "prettier", "biome", "webhook",
      "cron job", "openrouter", "stripe api", "sanity", "convex", "firebase",
      "appwrite", "pocketbase", "cpp", "typo3", "drupal", "wordpress",
      "phoenix framework", "hex docs", "cargo", "poetry", "pipenv", "ruff",
      "mypy", "pydantic", "zod", "hono", "elysia", "adonis", "strapi",
      "directus", "payload cms", "medusa", "keystone", "inngest", "temporal io",
      "stripe", "editorconfig", "vscode extension", "vs code extension",
      "jetbrains plugin", "chrome extension",
    ],
    b: [
      "backend", "back end", "api", "apis", "rest api", "restful", "endpoint",
      "server", "microservice", "microservices", "middleware", "router",
      "controller", "service layer", "serialization", "message queue", "worker",
      "background job", "sdk", "library", "package", "cli", "command line",
      "compiler", "runtime", "architecture", "ddd", "domain driven",
      "clean architecture", "hexagonal", "solid principles", "design pattern",
      "design patterns", "error handling", "exception", "dependency injection",
      "dependency", "versioning", "semver", "codebase", "repository",
      "pull request", "code review", "commit", "branch", "merge", "rebase",
      "refactor", "refactoring", "code quality", "clean code", "code smell",
      "technical debt", "type safety", "generics", "async", "concurrency",
      "rate limiting", "caching", "pagination", "idempotency", "webhooks",
      "authentication flow", "crud api", "monolith", "scaffolding", "boilerplate",
    ],
    c: ["code", "function", "module", "script", "request", "response", "integration", "implementation", "development", "programming"],
  },

  cloud: {
    a: [
      "aws", "azure", "gcp", "google cloud", "cloudflare", "kubernetes", "k8s",
      "terraform", "pulumi", "cloudformation", "helm", "docker", "podman",
      "containerd", "ecs", "eks", "aks", "gke", "lambda", "s3", "ec2", "rds",
      "cloudfront", "route53", "iam", "vpc", "fargate", "cloud run",
      "cloud functions", "app service", "azure functions", "serverless",
      "vercel", "netlify", "fly io", "railway", "render com", "heroku",
      "digitalocean", "linode", "hetzner", "openshift", "nomad", "istio",
      "linkerd", "bicep", "arm template", "cdk", "cloud formation", "eventbridge",
      "sqs", "sns", "step functions", "cloudwatch", "azure devops", "entra",
      "app insights", "appinsights", "blob storage", "cosmos db",
      "microsoft foundry", "azure openai", "coolify", "elestio",
    ],
    b: [
      "cloud", "infrastructure", "iac", "infrastructure as code", "provisioning",
      "autoscaling", "load balancer", "cdn", "edge", "edge function", "region",
      "multi tenant", "hosting", "vm", "virtual machine", "cluster",
      "networking", "dns", "subnet", "container", "containerization",
      "orchestration platform", "storage bucket", "object storage",
      "cost optimization", "cloud migration", "disaster recovery", "failover",
      "high availability", "reverse proxy", "nginx", "caddy", "traefik",
      "tenant", "quota", "cloud native",
    ],
    c: ["scale", "resource", "capacity", "server", "node", "instance"],
  },

  devops: {
    a: [
      "cicd", "ci cd", "jenkins", "circleci", "travis ci", "github actions",
      "gitlab ci", "argocd", "argo", "flux cd", "spinnaker", "ansible", "chef",
      "puppet", "salt stack", "vagrant", "prometheus", "grafana", "datadog",
      "sentry", "new relic", "opentelemetry", "otel", "splunk", "elk stack",
      "logstash", "kibana", "loki", "jaeger", "pagerduty", "opsgenie",
      "sonarqube", "buildkite", "teamcity", "bamboo", "dependabot", "renovate",
      "pm2", "supervisor", "systemd", "makefile", "bazel", "gradle", "maven",
    ],
    b: [
      "devops", "pipeline", "build pipeline", "deployment", "deploy",
      "deployment pipeline", "release", "release management", "rollback",
      "rollout", "canary", "blue green", "monitoring", "observability",
      "alerting", "telemetry", "tracing", "metrics", "uptime", "sre",
      "incident", "incident response", "postmortem", "runbook", "on call",
      "build system", "artifact", "artifact registry", "log analysis",
      "log aggregation", "error tracking", "health check", "smoke check",
      "environment variable", "secrets management", "configuration management",
      "continuous integration", "continuous delivery", "continuous deployment",
      "infrastructure monitoring", "container registry", "staging environment",
    ],
    c: ["automation", "workflow", "build", "continuous", "environment", "config"],
  },

  database: {
    a: [
      "postgres", "postgresql", "mysql", "mariadb", "sqlite", "mssql",
      "sql server", "oracle db", "mongodb", "mongo", "redis", "memcached",
      "cassandra", "dynamodb", "cockroachdb", "clickhouse", "duckdb",
      "supabase", "planetscale", "neon db", "firestore", "prisma", "drizzle",
      "sequelize", "typeorm", "knex", "sqlalchemy", "alembic", "liquibase",
      "flyway", "pgvector", "elasticsearch", "opensearch", "neo4j", "influxdb",
      "timescaledb", "rethinkdb", "couchdb", "pgbouncer", "pg dump",
    ],
    b: [
      "database", "databases", "sql", "sql query", "query optimization",
      "schema", "schema design", "migration", "migrations", "indexing",
      "index", "table", "relational", "nosql", "orm", "transaction", "acid",
      "normalization", "denormalization", "primary key", "foreign key",
      "stored procedure", "trigger", "view", "replication", "sharding",
      "partitioning", "data model", "data modeling", "entity relationship",
      "crud", "seed data", "connection pool", "query plan", "full text search",
      "vector search", "row level security",
    ],
    c: ["record", "row", "column", "store", "persistence", "query"],
  },

  testing: {
    a: [
      "playwright", "cypress", "selenium", "puppeteer", "jest", "vitest",
      "mocha", "chai", "jasmine", "karma", "pytest", "unittest", "rspec",
      "minitest", "junit", "testng", "xunit", "nunit", "phpunit", "testcafe",
      "webdriver", "appium", "k6", "jmeter", "locust", "gatling", "msw",
      "sinon", "istanbul", "codecov", "testing library", "enzyme", "cucumber",
      "hypothesis testing library", "faker",
    ],
    b: [
      "test", "tests", "testing", "unit test", "unit testing",
      "integration test", "e2e", "end to end", "regression", "regression test",
      "assertion", "mock", "mocking", "stub", "spy", "fixture", "snapshot test",
      "tdd", "bdd", "test driven", "test coverage", "code coverage", "debug",
      "debugging", "breakpoint", "stack trace", "flaky", "flaky test", "qa",
      "quality assurance", "load test", "load testing", "stress test",
      "smoke test", "bug", "defect", "reproduce", "root cause",
      "troubleshoot", "troubleshooting", "test suite", "test case",
      "acceptance criteria", "performance test", "test plan", "visual regression",
      "profiling", "profiler", "bottleneck", "performance bottleneck",
      "memory leak", "heap dump", "performance optimization", "latency",
      "diagnose", "diagnostics", "crash",
    ],
    c: ["verify", "validation", "error", "failure", "fix", "issue"],
  },

  security: {
    a: [
      "oauth", "oauth2", "oidc", "openid connect", "saml", "sso", "jwt",
      "mfa", "2fa", "totp", "rbac", "abac", "keycloak", "auth0", "clerk",
      "better auth", "okta", "hashicorp vault", "sops", "semgrep", "snyk",
      "trivy", "bandit", "owasp", "csrf", "xss", "sql injection", "sqli",
      "ssrf", "cve", "pentest", "pentesting", "penetration test", "burp suite",
      "nmap", "metasploit", "tls", "ssl", "mtls", "pki", "encryption", "aes",
      "rsa", "bcrypt", "argon2", "gdpr", "hipaa", "soc 2", "soc2", "pci dss",
      "iso 27001", "bitwarden", "1password", "csp", "cors", "supply chain attack",
      "zero trust", "siem",
    ],
    b: [
      "security", "secure", "authentication", "authorization", "authenticate",
      "authorize", "credential", "credentials", "api key", "token", "session",
      "permission", "permissions", "vulnerability", "vulnerabilities",
      "exploit", "threat", "threat model", "security audit", "compliance",
      "hardening", "sanitize", "sanitization", "injection", "cryptography",
      "certificate", "firewall", "privacy", "pii", "access control",
      "least privilege", "secret scanning", "security review",
      "security best practices", "identity", "attack surface", "malicious",
      "sandbox", "audit log", "reverse engineering", "obfuscation",
      "deobfuscation", "malware", "forensics", "exfiltration", "hardened",
    ],
    c: ["protect", "risk", "safe", "policy", "trust", "audit"],
  },

  "ai-ml": {
    a: [
      "llm", "llms", "gpt", "gpt 4", "gpt 5", "claude", "gemini", "llama",
      "mistral", "qwen", "deepseek", "openai", "anthropic", "huggingface",
      "hugging face", "transformers", "pytorch", "tensorflow", "keras",
      "scikit learn", "sklearn", "xgboost", "lightgbm", "onnx", "langchain",
      "llamaindex", "rag", "retrieval augmented", "embedding", "embeddings",
      "vector database", "pinecone", "weaviate", "qdrant", "chromadb",
      "milvus", "faiss", "fine tune", "fine tuning", "finetuning", "lora",
      "qlora", "quantization", "diffusion", "stable diffusion", "midjourney",
      "dall e", "dalle", "comfyui", "sora", "whisper", "tts", "text to speech",
      "speech to text", "ocr", "nlp", "cnn", "rnn", "transformer", "gan",
      "reinforcement learning", "rlhf", "prompt engineering", "ollama", "vllm",
      "llama cpp", "genkit", "pollinations", "replicate", "elevenlabs",
      "nano banana", "flux model", "lm studio", "seedance", "letzai",
      "chatgpt", "copilot", "github copilot", "perplexity", "grok",
    ],
    b: [
      "machine learning", "deep learning", "neural network", "inference",
      "training", "training data", "tokenizer", "token limit", "prompt",
      "prompts", "system prompt", "context window", "hallucination",
      "few shot", "zero shot", "chain of thought", "classifier",
      "clustering", "recommendation engine", "sentiment analysis",
      "computer vision", "image generation", "video generation",
      "speech recognition", "generative", "generative ai", "model evaluation",
      "eval", "benchmark", "temperature", "token usage", "multimodal",
      "semantic search", "knowledge graph", "vector",
    ],
    c: ["ai", "intelligence", "predict", "model", "learning", "generate"],
  },

  agents: {
    a: [
      "mcp", "model context protocol", "mcp server", "subagent", "sub agent",
      "subagents", "multi agent", "agentic", "autogen", "crewai", "langgraph",
      "mastra", "swarm", "autonomous agent", "tool use", "function calling",
      "tool calling", "agent loop", "bmad", "claude code", "openclaw",
      "skill creator", "skill creation", "agent skill", "agent skills",
      "cursor rules", "agents md", "nanoclaw", "opencode",
    ],
    b: [
      "agent", "agents", "orchestration", "orchestrate", "orchestrator",
      "delegation", "delegate", "handoff", "dispatch", "dispatching",
      "agent memory", "context management", "harness", "autonomy",
      "coordinator", "supervisor", "task graph", "parallel agents",
      "parallel tasks", "workflow engine", "self improving", "guardrail",
      "tool definition", "skill vetting", "skill packaging", "prompt chaining",
      "memory optimization", "context sync", "scratchpad",
    ],
    c: ["assistant", "coordinate", "autonomous", "skill", "tool"],
  },

  data: {
    a: [
      "etl", "elt", "dbt", "airflow", "dagster", "prefect", "luigi", "spark",
      "pyspark", "databricks", "hadoop", "hive", "presto", "trino", "flink",
      "snowflake", "bigquery", "redshift", "athena", "looker", "tableau",
      "power bi", "powerbi", "metabase", "superset", "streamlit", "pandas",
      "numpy", "polars", "jupyter", "matplotlib", "seaborn", "plotly",
      "ga4", "google analytics", "mixpanel", "amplitude", "posthog",
      "segment io", "tinybird", "great expectations", "apache beam",
    ],
    b: [
      "data pipeline", "data warehouse", "data lake", "data engineering",
      "analytics", "dashboard", "reporting", "business intelligence", "kpi",
      "kpis", "metric", "metrics dashboard", "aggregation", "olap",
      "ingestion", "data transformation", "dataframe", "statistics",
      "statistical", "forecast", "forecasting", "cohort", "cohort analysis",
      "funnel analysis", "attribution", "spreadsheet", "excel", "csv",
      "data visualization", "chart", "charts", "graph plotting",
      "data quality", "data governance", "data catalog", "data analysis",
      "data analyst", "exploratory analysis", "pivot table", "time series",
      "anomaly detection", "correlation", "regression analysis",
      "dataset", "datasets", "data distribution", "data exploration",
      "financial", "finance", "trading", "backtesting", "portfolio",
      "stock market", "valuation", "accounting", "budgeting", "invoice",
      "summary statistics", "data cleaning", "outlier",
    ],
    c: ["data", "report", "insight", "insights", "trend", "number", "measure"],
  },

  "video-media": {
    a: [
      "ffmpeg", "remotion", "manim", "manimce", "imagemagick", "blender",
      "premiere pro", "after effects", "davinci resolve", "obs studio",
      "youtube", "vimeo", "tiktok", "twitch", "mp4", "webm", "hls",
      "h264", "h 264", "av1", "hevc", "audacity", "spotify", "podcast",
      "gif", "srt", "vtt", "chroma key", "green screen", "lut",
      "sora video", "runway ml", "veo", "kling", "capcut",
    ],
    b: [
      "video", "video editing", "audio", "media", "image processing",
      "transcode", "transcoding", "encoding", "render", "rendering video",
      "timeline", "frame", "frame rate", "resolution", "aspect ratio",
      "bitrate", "voiceover", "narration", "music", "sound", "sound design",
      "screencast", "screen recording", "livestream", "streaming",
      "infographic", "photo", "photography", "image editing", "thumbnail",
      "subtitle", "subtitles", "caption", "captions", "storyboard",
      "motion graphics", "watermark", "compression", "album art", "comic",
    ],
    c: ["clip", "scene", "image", "picture", "visual", "camera"],
  },

  marketing: {
    a: [
      "seo", "sem", "ppc", "serp", "backlink", "backlinks", "keyword research",
      "google ads", "facebook ads", "meta ads", "linkedin ads", "adwords",
      "semrush", "ahrefs", "moz", "screaming frog", "google search console",
      "search console", "klaviyo", "mailchimp", "hubspot", "activecampaign",
      "convertkit", "beehiiv", "substack", "cro", "utm", "schema markup",
      "aeo", "geo optimization", "programmatic seo", "cold email",
      "drip campaign", "lead magnet", "copywriting", "brand voice",
      "core web vitals seo", "local seo", "technical seo", "link building",
      "domain authority", "rich snippet", "featured snippet",
    ],
    b: [
      "marketing", "seo audit", "keyword", "keywords", "search ranking",
      "ranking", "organic traffic", "traffic", "conversion",
      "conversion rate", "campaign", "advertising", "ad copy", "ad creative",
      "audience", "target audience", "buyer persona", "positioning",
      "messaging", "growth", "growth marketing", "acquisition", "retention",
      "churn", "newsletter", "email marketing", "email sequence",
      "social media", "influencer", "affiliate", "referral", "referral program",
      "pricing strategy", "competitor", "competitor analysis",
      "go to market", "product launch", "launch strategy", "sales",
      "crm", "lead generation", "lead", "leads", "prospect", "outbound",
      "inbound", "engagement", "impressions", "ctr", "roas", "cac", "ltv",
      "landing page copy", "call to action", "upsell", "content strategy",
      "content marketing", "brand", "branding", "market research",
      "value proposition", "customer journey", "paid ads", "sales funnel",
      "outreach", "aso", "app store optimization", "ecommerce", "e commerce",
      "shopify", "woocommerce", "product listing", "marketplace",
      "internal linking", "meta description", "sitemap", "crawl budget",
      "app store", "play store", "app listing",
    ],
    c: ["promote", "customer", "market", "revenue", "client", "business"],
  },

  writing: {
    a: [
      "readme", "changelog", "docstring", "jsdoc", "tsdoc", "sphinx",
      "mkdocs", "docusaurus", "typedoc", "asciidoc", "latex", "markdown",
      "docx", "pptx", "xlsx", "pdf", "epub", "confluence", "adr",
      "rfc document", "technical writing", "style guide", "grammarly",
      "pandoc", "mdx", "openapi docs", "architectural decision record",
      "decision record",
    ],
    b: [
      "writing", "documentation", "docs", "document", "documents",
      "user guide", "tutorial", "manual", "handbook", "specification",
      "spec", "article", "blog", "blog post", "essay", "editing",
      "proofreading", "proofread", "copy editing", "summarize",
      "summarise", "summary", "paraphrase", "translate", "translation",
      "transcript", "transcription", "note taking", "outline", "draft",
      "narrative", "storytelling", "tone of voice", "grammar",
      "readability", "citation", "bibliography", "literature review",
      "research paper", "report writing", "presentation", "slide",
      "slide deck", "slides", "resume", "cv", "cover letter",
      "api documentation", "release notes", "knowledge article",
      "ghostwriting", "plain english", "word count", "headline",
    ],
    c: ["text", "content", "word", "words", "language", "paragraph", "write", "read"],
  },

  productivity: {
    a: [
      "todoist", "kanban", "gtd", "pomodoro", "jira", "asana", "trello",
      "clickup", "monday com", "notion", "obsidian", "roam research",
      "logseq", "things 3", "omnifocus", "calendly", "zapier", "n8n",
      "make com", "ifttt", "airtable", "google calendar", "outlook calendar",
      "granola", "superhuman", "vibe kanban", "linear app",
    ],
    b: [
      "productivity", "task management", "project management", "planning",
      "planner", "schedule", "scheduling", "calendar", "meeting",
      "meeting notes", "agenda", "standup", "sprint", "sprint planning",
      "backlog", "roadmap", "milestone", "prioritization", "prioritize",
      "okr", "okrs", "habit", "routine", "checklist", "reminder", "inbox",
      "triage", "note", "notes", "knowledge base", "second brain",
      "brainstorm", "brainstorming", "decision making", "retrospective",
      "time tracking", "time management", "focus", "file organization",
      "naming convention", "sop", "standard operating procedure",
      "process documentation", "delegation workflow", "todo list",
      "personal assistant", "email triage", "scrum", "agile", "product requirements",
      "prd", "stakeholder", "status update", "internal comms", "team communication",
      "estimation", "project estimation", "effort estimation",
      "resource planning", "capacity planning", "workload",
    ],
    c: ["organize", "manage", "plan", "time", "efficiency", "team", "productivity"],
  },

  utilities: {
    a: ["base64", "uuid", "cron expression", "qr code", "lorem ipsum", "jq", "yq"],
    b: [
      "utility", "converter", "conversion tool", "formatter", "format",
      "parser", "parsing", "validator", "generator", "calculator",
      "encoder", "decoder", "regex", "regular expression", "timestamp",
      "timezone", "unit conversion", "diff", "batch rename", "clipboard",
      "screenshot", "random generator", "hash generator", "slugify",
      "minify", "prettify", "search and replace",
    ],
    c: ["helper", "convert", "generate", "format"],
  },
};

/** Weight applied to a term by how specific it is. */
export const TIER_WEIGHT = { a: 3.0, b: 1.4, c: 0.6 };

/**
 * Weight applied by which field the term was found in. The slug is what the
 * author deliberately named the thing, so it is the most reliable; the long
 * description is machine-generated prose and the least.
 */
export const FIELD_WEIGHT = {
  slug: 3.0,
  tags: 2.5,
  name: 1.6,
  description: 1.2,
  longDescription: 0.8,
};

/**
 * Ceiling on how much tier-c ("data", "design", "content") evidence can
 * contribute to one category. Without this, generic filler prose decides the
 * category for thousands of skills.
 */
export const C_TIER_CAP = 2.4;

/**
 * Minimum winning score before a skill is placed in a category at all.
 * Below this the evidence is too thin and the skill stays in "other", which
 * is the honest answer. Tuned against the catalogue — see
 * `node scripts/eval-classifier.mjs --sweep`.
 */
export const MIN_SCORE = 4.0;

/**
 * Phrases that `enrich-descriptions.mjs` splices into a generated description
 * based on the category the skill *already had* ("Helps with Swift, testing as
 * part of building frontend UIs and user experiences workflows.").
 *
 * They must be stripped before classifying. Otherwise the classifier reads a
 * restatement of the previous run's guess as though it were evidence, and a
 * wrong category becomes self-confirming on every sync — which is exactly how
 * Swift testing skills ended up filed under frontend. The concept tokens in
 * those descriptions ("Swift, testing") are real signal and are kept; only the
 * category's own verb phrase goes.
 *
 * Mirrors CATEGORY_VERBS in scripts/enrich-descriptions.mjs.
 */
export const CIRCULAR_PHRASES = [
  "building frontend uis and user experiences",
  "developing backend services and apis",
  "working with databases and data persistence",
  "deploying and managing cloud infrastructure",
  "automating devops pipelines and ci cd workflows",
  "testing debugging and quality assurance",
  "implementing security and authentication",
  "building ai and machine learning applications",
  "orchestrating ai agents and multi step workflows",
  "marketing seo and growth tasks",
  "writing documentation and content creation",
  "data analysis and analytics workflows",
  "video production and media processing",
  "productivity and workflow automation",
  "general utility and helper tasks",
  "software development workflows",
  "agent workflows",
];

/**
 * How much the hand-tuned legacy slug rules are worth. They were built by
 * reading the catalogue and are high precision, so they count as strong
 * evidence — but as evidence, not as a verdict that text can't overturn.
 */
export const LEGACY_BONUS = 4.5;
