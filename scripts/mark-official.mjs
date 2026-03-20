#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dirname, '../data/skills-index.json');

const OFFICIAL_ORGS = new Set([
  'anthropics','apify','apollographql','auth0','automattic','axiomhq','base','better-auth',
  'bitwarden','brave','browser-use','browserbase','callstackincubator','clerk','clickhouse',
  'cloudflare','coderabbitai','coinbase','dagster-io','datadog-labs','dbt-labs','denoland',
  'elevenlabs','encoredev','expo','facebook','figma','firebase','firecrawl','flutter',
  'getsentry','github','google-gemini','google-labs-code','hashicorp','huggingface','kotlin',
  'langchain-ai','langfuse','launchdarkly','livekit','makenotion','mapbox','mastra-ai',
  'mcp-use','medusajs','microsoft','n8n-io','neondatabase','nuxt','openai','openshift',
  'planetscale','posthog','prisma','pulumi','pytorch','redis','remotion-dev','resend',
  'rivet-dev','runwayml','sanity-io','semgrep','streamlit','stripe','supabase','sveltejs',
  'tinybirdco','tldraw','triggerdotdev','upstash','vercel','vercel-labs','webflow','wix','wordpress',
]);

const data = JSON.parse(readFileSync(indexPath, 'utf8'));
let marked = 0;
let sourceAdded = 0;

data.skills = data.skills.map(skill => {
  if (OFFICIAL_ORGS.has(skill.author)) {
    const wasOfficial = skill.verified === 'official';
    skill.verified = 'official';
    if (!wasOfficial) marked++;

    // Ensure sourceUrl points to skills.sh if not set or is a trustedskills.dev URL
    if (!skill.sourceUrl || skill.sourceUrl.includes('trustedskills.dev')) {
      // Reconstruct from repoUrl: https://github.com/[org]/[repo] -> https://skills.sh/[org]/[repo]/[slug]
      if (skill.repoUrl && skill.repoUrl.includes('github.com')) {
        const parts = skill.repoUrl.replace('https://github.com/', '').replace(/\/$/, '').split('/');
        if (parts.length >= 2) {
          skill.sourceUrl = `https://skills.sh/${parts[0]}/${parts[1]}/${skill.slug}`;
          sourceAdded++;
        }
      }
    }
  }
  return skill;
});

writeFileSync(indexPath, JSON.stringify(data, null, 2));
console.log(`Marked ${marked} skills as official`);
console.log(`Added/fixed sourceUrl for ${sourceAdded} skills`);

// Show sample
const samples = data.skills.filter(s => s.verified === 'official').slice(0, 5);
console.log('\nSample official skills:');
samples.forEach(s => console.log(` - ${s.slug} | ${s.author} | sourceUrl: ${s.sourceUrl}`));
console.log(`\nTotal official: ${data.skills.filter(s => s.verified === 'official').length}`);
