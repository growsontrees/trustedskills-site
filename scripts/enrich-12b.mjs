#!/usr/bin/env node
// Re-enriches weak template descriptions using Gemma 3 12B via LM Studio
// Targets skills with generic "Provides X guidance..." or "Official X skill for Y" patterns
// Skips slugs with ambiguous acronyms (mcp, aws, etc.) where 12B tends to hallucinate

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dir, '../data/skills-index.json');

const LLM_URL = process.argv.find(a => a.startsWith('--url='))?.slice(6) || 'http://100.92.164.72:1234';
const DRY_RUN = process.argv.includes('--dry-run');
const LIMIT = parseInt(process.argv.find(a => a.startsWith('--limit='))?.slice(8) || '0');
const MODEL = 'google/gemma-3-12b';
const SAVE_EVERY = 100;

const WEAK_PATTERNS = [
  /^Provides .+ guidance and assistance for /i,
  /^Official .+ skill for .+ — helps with /i,
];

const SKIP_TOKENS = ['mcp','aws','gcp','sdk','api','llm','sql','jwt','oauth','saml','iam','vpc','cdn','dns','ecs','eks','rds','s3'];

function isWeak(skill) {
  return WEAK_PATTERNS.some(p => p.test(skill.description));
}

function shouldSkip(slug) {
  return slug.toLowerCase().split('-').some(t => SKIP_TOKENS.includes(t));
}

async function generateWithLLM(skill) {
  const prompt = `Write a single sentence description (max 20 words) for an AI agent skill called "${skill.slug}" by "${skill.author}". Category: ${skill.category || 'unknown'}. Be specific and useful. Reply with ONLY the description sentence, no preamble or quotes.`;
  const res = await fetch(`${LLM_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 60,
    }),
  });
  const j = await res.json();
  const text = (j.choices?.[0]?.message?.content || '').trim();
  // Sanity: reject if it looks like preamble leaked through
  if (text.length < 10 || /^(Sure|Here|This is|Okay|The skill)/i.test(text)) return null;
  return text;
}

async function main() {
  const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const skills = data.skills || data;

  let batch = skills.filter(s => isWeak(s) && !shouldSkip(s.slug));
  if (LIMIT > 0) batch = batch.slice(0, LIMIT);

  console.log(`Total skills: ${skills.length}`);
  console.log(`Weak templates to re-enrich: ${batch.length}`);
  console.log(`Dry run: ${DRY_RUN}`);
  console.log(`Model: ${MODEL}`);
  console.log(`LLM URL: ${LLM_URL}`);
  console.log();

  let improved = 0;
  let errors = 0;

  for (let i = 0; i < batch.length; i++) {
    const skill = batch[i];
    try {
      const newDesc = await generateWithLLM(skill);
      if (newDesc) {
        if (i % 10 === 0 || LIMIT > 0) {
          console.log(`[${i+1}/${batch.length}] ${skill.slug}`);
          console.log(`  OLD: ${skill.description}`);
          console.log(`  NEW: ${newDesc}`);
        }
        if (!DRY_RUN) {
          skill.description = newDesc;
          skill.descriptionSource = 'llm-12b';
        }
        improved++;
      }
    } catch (e) {
      errors++;
      if (errors <= 5) console.error(`  ERROR on ${skill.slug}:`, e.message);
    }

    if (!DRY_RUN && (i + 1) % SAVE_EVERY === 0) {
      writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
      console.log(`  💾 Saved (${i+1}/${batch.length}) — ${improved} improved, ${errors} errors`);
    }
  }

  console.log(`\n── Final Results ──`);
  console.log(`Improved: ${improved}`);
  console.log(`Errors:   ${errors}`);

  if (!DRY_RUN) {
    writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    console.log(`\n✅ Wrote updated skills-index.json`);
  } else {
    console.log(`\n(dry run — no files written)`);
  }
}

main().catch(console.error);
