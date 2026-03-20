/**
 * enrich-descriptions.mjs
 * Stage 1: Template engine for generating skill descriptions from slug + metadata.
 * Stage 2 (TODO): LLM fallback via Tailscale → home machine LM Studio endpoint.
 *
 * Usage:
 *   node scripts/enrich-descriptions.mjs [--dry-run] [--limit N] [--stage2-url http://100.x.x.x:1234]
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "../data/skills-index.json");

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIMIT = (() => { const i = args.indexOf("--limit"); return i >= 0 ? parseInt(args[i+1]) : Infinity; })();
const STAGE2_URL = (() => { const i = args.indexOf("--stage2-url"); return i >= 0 ? args[i+1] : null; })();
const STAGE2_ONLY = args.includes("--stage2-only");

// ─── Stub detection ───────────────────────────────────────────────────────────
const STUB_RE = /^.{0,80} skill for (ai )?agents\.?$/i;
const EMPTY_RE = /^[\s.]*$/;

function isStub(description) {
  if (!description) return true;
  if (EMPTY_RE.test(description)) return true;
  if (STUB_RE.test(description)) return true;
  return false;
}

// ─── Slug tokenizer ───────────────────────────────────────────────────────────
function tokenize(slug) {
  return slug
    .toLowerCase()
    .replace(/[_:]/g, "-")
    .split("-")
    .filter(t => t.length > 1);
}

// ─── Known orgs / official authors ───────────────────────────────────────────
const OFFICIAL_ORGS = new Set([
  "vercel","vercel-labs","anthropics","anthropic","microsoft","stripe","google",
  "remotion-dev","remotion","aws","amazon","cloudflare","openai","github",
  "atlassian","hashicorp","docker","kubernetes","grafana","datadog","mongodb",
  "postgresql","redis","nginx","elastic","supabase","prisma","planetscale",
  "neon","turso","drizzle","nextjs","react","vue","angular","svelte",
  "tailwindcss","shadcn","radix","lucide","framer","figma","storybook",
  "jest","vitest","playwright","cypress","eslint","prettier","typescript",
  "rust","golang","python","deno","bun","vite","webpack","esbuild","turbo",
  "nx","pnpm","yarn","npm","node","linux","ubuntu","debian","alpine",
  "flutter","kotlin","swift","apple","android","expo","reactnative",
  "shopify","wordpress","drupal","contentful","sanity","strapi","payload",
  "auth0","clerk","supertokens","okta","firebase","supabase","appwrite",
  "sentry","posthog","mixpanel","segment","plausible","fathom",
  "tensorflow","pytorch","huggingface","langchain","llamaindex","openai",
  "cohere","mistral","groq","replicate","stability","midjourney",
  "lmstudio","ollama","litellm","vllm","axflow","dspy","instructor",
  "clawhub","openclaw","cursor","windsurf","codex",
]);

function isOfficialAuthor(author) {
  return OFFICIAL_ORGS.has((author || "").toLowerCase().replace(/[^a-z0-9-]/g, ""));
}

// ─── Category → verb phrase ───────────────────────────────────────────────────
const CATEGORY_VERBS = {
  frontend:    "building frontend UIs and user experiences",
  backend:     "developing backend services and APIs",
  database:    "working with databases and data persistence",
  cloud:       "deploying and managing cloud infrastructure",
  devops:      "automating DevOps pipelines and CI/CD workflows",
  testing:     "testing, debugging, and quality assurance",
  security:    "implementing security and authentication",
  "ai-ml":     "building AI and machine learning applications",
  agents:      "orchestrating AI agents and multi-step workflows",
  marketing:   "marketing, SEO, and growth tasks",
  writing:     "writing, documentation, and content creation",
  data:        "data analysis and analytics workflows",
  "video-media": "video production and media processing",
  productivity:"productivity and workflow automation",
  utilities:   "general utility and helper tasks",
  dev:         "software development workflows",
  other:       "agent workflows",
};

// ─── Token → concept map ──────────────────────────────────────────────────────
const TOKEN_CONCEPTS = {
  // Actions
  best:        "best practices",
  practices:   "best practices",
  guidelines:  "guidelines",
  patterns:    "patterns",
  principles:  "principles",
  review:      "code review",
  reviews:     "review workflows",
  audit:       "auditing",
  analysis:    "analysis",
  analyze:     "analysis",
  refactor:    "refactoring",
  refactoring: "refactoring",
  optimize:    "optimization",
  optimization:"optimization",
  performance: "performance optimization",
  debug:       "debugging",
  debugging:   "debugging",
  test:        "testing",
  testing:     "testing",
  deploy:      "deployment",
  deployment:  "deployment",
  monitor:     "monitoring",
  monitoring:  "monitoring",
  setup:       "setup and configuration",
  scaffold:    "scaffolding",
  scaffolding: "scaffolding",
  generate:    "code generation",
  generation:  "code generation",
  migrate:     "migration",
  migration:   "migration",
  integration: "integration",
  search:      "search",
  scrape:      "web scraping",
  scraping:    "web scraping",
  crawl:       "web crawling",
  crawling:    "web crawling",
  extract:     "data extraction",
  transform:   "data transformation",
  pipeline:    "pipeline automation",
  automate:    "automation",
  automation:  "automation",
  manage:      "management",
  management:  "management",
  summarize:   "summarization",
  summarization:"summarization",
  translate:   "translation",
  translation: "translation",
  write:       "content writing",
  writing:     "writing",
  edit:        "editing",
  editing:     "editing",
  plan:        "planning",
  planning:    "planning",
  design:      "design",
  build:       "building",
  building:    "building",
  create:      "creation",
  creation:    "creation",
  model:       "data modeling",
  modeling:    "data modeling",
  query:       "querying",
  schema:      "schema design",
  validate:    "validation",
  validation:  "validation",
  format:      "formatting",
  formatting:  "formatting",
  document:    "documentation",
  documentation:"documentation",
  explain:     "code explanation",
  explanation: "explanation",
  understand:  "code comprehension",

  // Technologies
  react:       "React",
  nextjs:      "Next.js",
  next:        "Next.js",
  vue:         "Vue",
  angular:     "Angular",
  svelte:      "Svelte",
  typescript:  "TypeScript",
  javascript:  "JavaScript",
  python:      "Python",
  rust:        "Rust",
  go:          "Go",
  golang:      "Go",
  java:        "Java",
  kotlin:      "Kotlin",
  swift:       "Swift",
  swiftui:     "SwiftUI",
  flutter:     "Flutter",
  dart:        "Dart",
  css:         "CSS",
  tailwind:    "Tailwind CSS",
  sass:        "Sass/SCSS",
  graphql:     "GraphQL",
  rest:        "REST APIs",
  grpc:        "gRPC",
  websocket:   "WebSockets",
  docker:      "Docker",
  kubernetes:  "Kubernetes",
  terraform:   "Terraform",
  ansible:     "Ansible",
  github:      "GitHub",
  git:         "Git",
  postgresql:  "PostgreSQL",
  postgres:    "PostgreSQL",
  mysql:       "MySQL",
  sqlite:      "SQLite",
  mongodb:     "MongoDB",
  redis:       "Redis",
  elasticsearch:"Elasticsearch",
  prisma:      "Prisma ORM",
  drizzle:     "Drizzle ORM",
  supabase:    "Supabase",
  firebase:    "Firebase",
  aws:         "AWS",
  azure:       "Azure",
  gcp:         "Google Cloud",
  vercel:      "Vercel",
  cloudflare:  "Cloudflare",
  stripe:      "Stripe",
  openai:      "OpenAI",
  anthropic:   "Anthropic",
  langchain:   "LangChain",
  llamaindex:  "LlamaIndex",
  vite:        "Vite",
  webpack:     "webpack",
  jest:        "Jest",
  vitest:      "Vitest",
  playwright:  "Playwright",
  cypress:     "Cypress",
  eslint:      "ESLint",
  prettier:    "Prettier",
  storybook:   "Storybook",
  remix:       "Remix",
  astro:       "Astro",
  nuxt:        "Nuxt",
  sveltekit:   "SvelteKit",
  expo:        "Expo",
  electron:    "Electron",

  // Domains
  seo:         "SEO",
  email:       "email",
  pdf:         "PDF",
  pptx:        "PowerPoint",
  xlsx:        "Excel/spreadsheets",
  docx:        "Word documents",
  markdown:    "Markdown",
  json:        "JSON",
  yaml:        "YAML",
  xml:         "XML",
  csv:         "CSV",
  api:         "API",
  auth:        "authentication",
  oauth:       "OAuth",
  jwt:         "JWT",
  payment:     "payments",
  payments:    "payments",
  notification:"notifications",
  webhook:     "webhooks",
  llm:         "LLMs",
  agent:       "AI agents",
  agents:      "AI agents",
  mcp:         "MCP tools",
  mobile:      "mobile development",
  web:         "web development",
  frontend:    "frontend development",
  backend:     "backend development",
  fullstack:   "full-stack development",
  devops:      "DevOps",
  cicd:        "CI/CD",
  security:    "security",
  video:       "video",
  image:       "image processing",
  audio:       "audio",
  storage:     "storage",
  database:    "database",
  ui:          "UI components",
  ux:          "UX design",
  component:   "components",
  components:  "components",
  library:     "libraries",
  package:     "packages",
  server:      "server",
  client:      "client-side",
  serverless:  "serverless",
  microservice:"microservices",
  microservices:"microservices",
  workflow:    "workflows",
  analytics:   "analytics",
  data:        "data",
  ml:          "machine learning",
  ai:          "AI",
};

// ─── Template engine ──────────────────────────────────────────────────────────
function generateDescription(skill) {
  const tokens = tokenize(skill.slug);
  const name = skill.name || skill.slug;
  const author = skill.author || "";
  const category = skill.category || "other";
  const categoryVerb = CATEGORY_VERBS[category] || CATEGORY_VERBS.other;
  const official = isOfficialAuthor(author);

  // Map tokens to concepts, dedup
  const concepts = [];
  const seen = new Set();
  for (const t of tokens) {
    const c = TOKEN_CONCEPTS[t];
    if (c && !seen.has(c)) {
      seen.add(c);
      concepts.push(c);
    }
  }

  // Remove overly generic standalone concepts if we have better ones
  const genericConcepts = new Set(["AI agents", "agent workflows", "workflows"]);
  const richConcepts = concepts.filter(c => !genericConcepts.has(c));
  const finalConcepts = richConcepts.length > 0 ? richConcepts : concepts;

  // Build description
  const authorStr = official ? `Official ${author} skill` : `Skill`;
  const techStr = finalConcepts.slice(0, 3).join(", ");

  let desc;

  if (techStr) {
    // We have specific tech/action concepts
    const primary = finalConcepts[0];
    const extras = finalConcepts.slice(1, 3);
    
    if (official) {
      if (extras.length > 0) {
        desc = `Official ${author} skill covering ${techStr} for ${categoryVerb}.`;
      } else {
        desc = `Official ${author} skill for ${primary} — helps with ${categoryVerb}.`;
      }
    } else {
      if (extras.length > 0) {
        desc = `Helps with ${techStr} as part of ${categoryVerb} workflows.`;
      } else {
        desc = `Provides ${primary} guidance and assistance for ${categoryVerb}.`;
      }
    }
  } else {
    // Fallback: use name + category
    if (official) {
      desc = `Official ${author} skill for ${categoryVerb}.`;
    } else {
      desc = `${name} — provides AI agent assistance for ${categoryVerb}.`;
    }
  }

  // Ensure first char is capitalised and ends with period
  desc = desc.charAt(0).toUpperCase() + desc.slice(1);
  if (!desc.endsWith(".")) desc += ".";

  return desc;
}

// ─── Stage 2: LLM fallback ────────────────────────────────────────────────────
async function generateWithLLM(skill, baseUrl) {
  const prompt = `Write a single concise sentence (max 120 chars) describing what this AI agent skill does and why it's useful.
Skill name: ${skill.name}
Author: ${skill.author}
Category: ${skill.category}
Tags: ${(skill.tags || []).join(", ")}
Slug tokens: ${tokenize(skill.slug).join(", ")}

Reply with ONLY the description sentence. No quotes, no extra text.`;

  const res = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "local-model",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 80,
    }),
  });

  if (!res.ok) throw new Error(`LLM error: ${res.status}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() || null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const skills = data.skills;

  const toEnrich = skills.filter(s => isStub(s.description));
  console.log(`Total skills: ${skills.length}`);
  console.log(`Stubs to enrich: ${toEnrich.length}`);
  console.log(`Already have descriptions: ${skills.length - toEnrich.length}`);
  console.log(`Dry run: ${DRY_RUN}`);
  if (STAGE2_URL) console.log(`Stage 2 LLM URL: ${STAGE2_URL}`);

  const batch = LIMIT < Infinity ? toEnrich.slice(0, LIMIT) : toEnrich;

  let stage1Count = 0;
  let stage2Count = 0;
  let stage2Errors = 0;
  const samples = [];

  for (const skill of batch) {
    let newDesc = null;
    let source = "template";

    if (!STAGE2_ONLY) {
      newDesc = generateDescription(skill);
      source = "template";
    }

    // Stage 2: LLM for opaque slugs (all same-word slug like "nano-banana")
    // or when explicitly requested
    if (STAGE2_URL) {
      const tokens = tokenize(skill.slug);
      const recognizedTokens = tokens.filter(t => TOKEN_CONCEPTS[t]);
      const isOpaque = recognizedTokens.length === 0;
      
      if (isOpaque || STAGE2_ONLY) {
        try {
          const llmDesc = await generateWithLLM(skill, STAGE2_URL);
          if (llmDesc && llmDesc.length > 20) {
            newDesc = llmDesc;
            source = "llm";
            stage2Count++;
          }
        } catch (e) {
          stage2Errors++;
          // fall back to template
        }
      }
    }

    if (newDesc) {
      if (source === "template") stage1Count++;

      if (samples.length < 20) {
        samples.push({
          slug: skill.slug,
          author: skill.author,
          category: skill.category,
          old: skill.description,
          new: newDesc,
          source,
        });
      }

      if (!DRY_RUN) {
        skill.description = newDesc;
        skill.descriptionSource = source;
      }
    }
  }

  console.log(`\n── Results ──`);
  console.log(`Stage 1 (template): ${stage1Count}`);
  if (STAGE2_URL) {
    console.log(`Stage 2 (LLM):      ${stage2Count}`);
    console.log(`Stage 2 errors:     ${stage2Errors}`);
  }
  console.log(`\n── Sample output (first 20) ──`);
  for (const s of samples) {
    console.log(`\n[${s.source.toUpperCase()}] ${s.slug} (${s.author} / ${s.category})`);
    console.log(`  OLD: ${s.old}`);
    console.log(`  NEW: ${s.new}`);
  }

  if (!DRY_RUN) {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`\n✅ Wrote updated skills-index.json`);
  } else {
    console.log(`\n(dry run — no files written)`);
  }
}

main().catch(console.error);
