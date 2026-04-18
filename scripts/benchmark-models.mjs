#!/usr/bin/env node
/**
 * benchmark-models.mjs
 *
 * Tests the currently-loaded LM Studio model against 5 real skills.
 * Run once per model — swap models in LM Studio between runs.
 * Results are saved to /tmp/benchmark-results.json for comparison.
 *
 * Usage:
 *   node scripts/benchmark-models.mjs           # run benchmark
 *   node scripts/benchmark-models.mjs --compare # show saved results side by side
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/skills-index.json');
const RESULTS_FILE = '/tmp/benchmark-results.json';
const LM_STUDIO_URL = 'http://100.92.164.72:1234';
const FIRECRAWL_URL = 'http://100.92.164.72:3002';
const FETCH_TIMEOUT_MS = 15000;
const LLM_TIMEOUT_MS = 180000; // thinking models need more time

// ── 5 test skills — diverse categories and source types ──────────────────────
const TEST_SLUGS = [
  'mcp-builder',    // MCP protocol — skills.sh source, technical
  'find-skills',    // CLI tool — GitHub README source, high-installs
  'tinacms',        // CMS — skills.sh source, web dev
  'prisma',         // DB ORM — skills.sh source, backend
  'google-sheets',  // Productivity — skills.sh source, broad audience
];

// ── Prompt (same as v2 script) ────────────────────────────────────────────────
const SYSTEM_PROMPT = `/no_think
You are writing the "About This Skill" page section for TrustedSkills, an AI agent skills registry.

Given source content from the skill's repository or registry page, write a helpful, accurate guide in markdown.

Use exactly these sections:
## What it does
2-4 sentences. Describe what this skill actually enables an AI agent to do. Be specific to the real source content. Expand with simpler explanations if the source is technical.

## When to use it
3-5 bullet points. Real, concrete scenarios when someone would reach for this skill.

## Key capabilities
A bullet list of actual features or abilities mentioned in the source content.

## Example prompts
2-3 example prompts a user might give an AI agent that has this skill installed.

## Tips & gotchas
1-3 practical notes: prerequisites, known limitations, how to get the most from it.

STRICT RULES:
- Only describe what is actually in the source content
- Never invent features, integrations, or capabilities not mentioned in the source
- If the source is about MCP (Model Context Protocol), it means AI agent tool integration — not multi-cloud platforms
- Keep output under 500 words total
- Use markdown formatting`;

function stripThinkTags(s) {
  return (s || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// ── Source fetching (mirrors v2 with Firecrawl) ───────────────────────────────
async function fetchText(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'TrustedSkills-Benchmark/1.0' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

function extractSkillsShContent(html) {
  if (!html) return null;
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const skillMdMatch = text.match(/SKILL\.md([\s\S]{100,})/i);
  if (skillMdMatch) text = skillMdMatch[1];
  text = text.replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  if (text.length < 200) return null;
  return text.substring(0, 3000);
}

async function firecrawlScrape(url) {
  try {
    const res = await fetch(`${FIRECRAWL_URL}/v1/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({ url, formats: ['markdown'], onlyMainContent: true })
    });
    if (!res.ok) return null;
    const j = await res.json();
    const md = j?.data?.markdown || '';
    return md.length >= 200 ? md.substring(0, 5000) : null;
  } catch { return null; }
}

let firecrawlOk = null;
async function probeFirecrawl() {
  if (firecrawlOk !== null) return firecrawlOk;
  try {
    const res = await fetch(`${FIRECRAWL_URL}/v1/scrape`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ url: 'https://example.com', formats: ['markdown'] })
    });
    firecrawlOk = res.ok;
  } catch { firecrawlOk = false; }
  return firecrawlOk;
}

async function fetchSource(skill) {
  if (skill.repoUrl && skill.repoUrl.includes('github.com') && !skill.repoUrl.includes('skills.sh')) {
    const parts = skill.repoUrl.replace('https://github.com/', '').split('/');
    if (parts.length >= 2) {
      for (const branch of ['main', 'master']) {
        const text = await fetchText(`https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${branch}/README.md`);
        if (text && text.length > 100) return { content: text.substring(0, 2500), source: 'github' };
        const sm = await fetchText(`https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${branch}/SKILL.md`);
        if (sm && sm.length > 100) return { content: sm.substring(0, 2500), source: 'github' };
      }
    }
  }
  if (skill.sourceUrl && skill.sourceUrl.includes('skills.sh')) {
    if (await probeFirecrawl()) {
      const md = await firecrawlScrape(skill.sourceUrl);
      if (md) return { content: md.substring(0, 2500), source: 'skills.sh-firecrawl' };
    }
    const html = await fetchText(skill.sourceUrl);
    const content = extractSkillsShContent(html);
    if (content && content.length >= 200) return { content, source: 'skills.sh' };
  }
  return null;
}

// ── LLM call ──────────────────────────────────────────────────────────────────
async function generate(skill, sourceContent, model) {
  const userMsg = `Skill slug: ${skill.slug}
Skill name: ${skill.name}
Author: ${skill.author}
Category: ${skill.category}
Short description: ${skill.description}

Source content:
---
${sourceContent}
---

Write the "About This Skill" section now.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  const t0 = Date.now();
  try {
    const res = await fetch(`${LM_STUDIO_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMsg }
        ],
        temperature: 0.3,
        max_tokens: 2000  // needs headroom for reasoning tokens + actual content
      })
    });
    clearTimeout(timeout);
    const j = await res.json();
    const elapsed = Date.now() - t0;
    const content = stripThinkTags(j.choices?.[0]?.message?.content || '');
    return { content, elapsed, ok: content.length > 100 };
  } catch (e) {
    clearTimeout(timeout);
    return { content: '', elapsed: Date.now() - t0, ok: false, error: e.message };
  }
}

// ── Model state / auto-load ───────────────────────────────────────────────────
async function getModelState(model) {
  try {
    const res = await fetch(`${LM_STUDIO_URL}/api/v0/models/${encodeURIComponent(model)}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return 'unknown';
    const j = await res.json();
    return j.state || 'unknown';
  } catch { return 'unknown'; }
}

async function ensureModelLoaded(model) {
  const state = await getModelState(model);
  if (state === 'loaded') { console.log(`  ${model}: already loaded`); return true; }
  console.log(`  ${model}: state=${state} — triggering load (may take 30-60s)...`);
  try {
    const res = await fetch(`${LM_STUDIO_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(120000),
      body: JSON.stringify({ model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 5 })
    });
    const j = await res.json();
    if (j.error) { console.log(`  Load failed: ${JSON.stringify(j.error)}`); return false; }
    const newState = await getModelState(model);
    console.log(`  ${model}: state after load = ${newState}`);
    return newState === 'loaded';
  } catch (e) { console.log(`  Load failed: ${e.message}`); return false; }
}

// ── Get current model ─────────────────────────────────────────────────────────
async function getLoadedModel() {
  // If --model flag provided, auto-load if needed and use it
  if (FORCE_MODEL) {
    console.log(`\nEnsuring model is loaded: ${FORCE_MODEL}`);
    await ensureModelLoaded(FORCE_MODEL);
    return FORCE_MODEL;
  }
  try {
    const res = await fetch(`${LM_STUDIO_URL}/v1/models`, { signal: AbortSignal.timeout(10000) });
    const j = await res.json();
    const models = j.data || [];
    // Exclude embedding models and the broken claude-code finetune
    const usable = models.filter(m =>
      !m.id.includes('nomic-embed') &&
      !m.id.includes('text-embedding') &&
      m.id !== 'qwen3.5-9b-claude-code'
    );
    if (usable.length === 1) return usable[0].id;
    if (usable.length > 1) {
      console.log('\nMultiple usable models loaded:');
      usable.forEach((m, i) => console.log(`  ${i+1}. ${m.id}`));
      console.log('\nUse --model <id> to specify which one to benchmark, e.g.:');
      usable.forEach(m => console.log(`  node scripts/benchmark-models.mjs --model "${m.id}"`));
      process.exit(1);
    }
    return null;
  } catch {
    return null;
  }
}

// ── Quality check ─────────────────────────────────────────────────────────────
function gradeOutput(slug, content) {
  if (!content || content.length < 100) return { grade: 'F', notes: 'Empty or too short' };

  const ld = content.toLowerCase();
  const issues = [];
  const passes = [];

  // Check for known hallucination patterns
  if (slug === 'mcp-builder' && (ld.includes('multi-cloud') || ld.includes('aws, azure')))
    issues.push('⚠️  HALLUCINATED: multi-cloud fiction for MCP');
  else if (slug === 'mcp-builder')
    passes.push('✓ No multi-cloud hallucination');

  // Check sections present
  const hasSections = ['## what it does', '## when to use', '## key capabilities'].every(s => ld.includes(s));
  if (hasSections) passes.push('✓ All required sections present');
  else issues.push('✗ Missing required sections');

  // Check for admitted failure
  if (ld.includes('raw html') || ld.includes('only metadata') || ld.includes('source content provided'))
    issues.push('✗ Admitted bare-HTML failure');

  // Word count
  const words = content.split(/\s+/).length;
  passes.push(`✓ ${words} words`);

  const grade = issues.length === 0 ? (passes.length >= 3 ? 'A' : 'B') : (issues.length === 1 ? 'C' : 'F');
  return { grade, notes: [...passes, ...issues].join(', ') };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function runBenchmark() {
  console.log('='.repeat(60));
  console.log('TrustedSkills LLM Benchmark');
  console.log('='.repeat(60));

  const model = await getLoadedModel();
  if (!model) {
    console.log('❌ No usable model detected in LM Studio. Is it running?');
    process.exit(1);
  }
  console.log(`\nModel: ${model}`);
  console.log(`Time:  ${new Date().toISOString()}`);

  // Load skills
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const skills = raw.skills || raw;
  const testSkills = TEST_SLUGS.map(slug => skills.find(s => s.slug === slug)).filter(Boolean);

  console.log(`\nFetching source content for ${testSkills.length} skills...`);
  const sources = {};
  for (const skill of testSkills) {
    const fetched = await fetchSource(skill);
    sources[skill.slug] = fetched;
    console.log(`  ${skill.slug}: ${fetched ? fetched.source + ' (' + fetched.content.length + ' chars)' : 'NO SOURCE'}`);
  }

  console.log('\nRunning generations...\n');

  const results = [];
  let totalTime = 0;
  let totalWords = 0;

  for (const skill of testSkills) {
    const src = sources[skill.slug];
    if (!src) {
      console.log(`SKIP ${skill.slug} — no source`);
      results.push({ slug: skill.slug, skipped: true });
      continue;
    }

    process.stdout.write(`  ${skill.slug} (${src.source})... `);
    const { content, elapsed, ok, error } = await generate(skill, src.content, model);

    if (!ok) {
      console.log(`FAILED (${elapsed}ms) ${error || ''}`);
      results.push({ slug: skill.slug, elapsed, ok: false });
      continue;
    }

    const words = content.split(/\s+/).length;
    const quality = gradeOutput(skill.slug, content);
    totalTime += elapsed;
    totalWords += words;

    console.log(`${elapsed}ms | ${words}w | Grade: ${quality.grade}`);
    console.log(`    ${quality.notes}`);
    console.log(`    Preview: ${content.substring(0, 120).replace(/\n/g, ' ').trim()}...`);

    results.push({
      slug: skill.slug,
      sourceType: src.source,
      elapsed,
      words,
      grade: quality.grade,
      notes: quality.notes,
      preview: content.substring(0, 300),
      ok: true,
    });
  }

  const successResults = results.filter(r => r.ok);
  const avgTime = successResults.length > 0
    ? Math.round(totalTime / successResults.length)
    : 0;

  const summary = {
    model,
    testedAt: new Date().toISOString(),
    skillsTested: testSkills.length,
    skillsSucceeded: successResults.length,
    avgTimeMs: avgTime,
    totalTimeMs: totalTime,
    avgWords: successResults.length > 0 ? Math.round(totalWords / successResults.length) : 0,
    grades: successResults.map(r => r.grade).join(''),
    results,
  };

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Model:       ${model}`);
  console.log(`Succeeded:   ${successResults.length}/${testSkills.length}`);
  console.log(`Avg time:    ${avgTime}ms per skill`);
  console.log(`Total time:  ${Math.round(totalTime/1000)}s for ${successResults.length} skills`);
  console.log(`Avg length:  ${summary.avgWords} words`);
  console.log(`Grades:      ${summary.grades || 'N/A'}`);

  // Load existing results and append
  let allResults = {};
  if (fs.existsSync(RESULTS_FILE)) {
    try { allResults = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8')); } catch { allResults = {}; }
  }
  allResults[model] = summary;
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(allResults, null, 2));
  console.log(`\nResults saved to ${RESULTS_FILE}`);

  return summary;
}

async function compareResults() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.log('No results file yet. Run the benchmark first.');
    return;
  }
  const allResults = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
  const models = Object.keys(allResults);
  if (models.length === 0) { console.log('No results yet.'); return; }

  console.log('\n' + '='.repeat(70));
  console.log('MODEL COMPARISON');
  console.log('='.repeat(70));
  console.log(`${'Model'.padEnd(32)} ${'Avg(ms)'.padStart(8)} ${'Total(s)'.padStart(9)} ${'AvgW'.padStart(5)} ${'Grades'.padStart(8)}`);
  console.log('-'.repeat(70));
  for (const model of models) {
    const r = allResults[model];
    console.log(
      `${model.substring(0, 32).padEnd(32)} ${String(r.avgTimeMs).padStart(8)} ${String(Math.round(r.totalTimeMs/1000)).padStart(9)} ${String(r.avgWords).padStart(5)} ${r.grades.padStart(8)}`
    );
  }
  console.log('\nPer-skill breakdown:');
  const allSlugs = [...new Set(models.flatMap(m => allResults[m].results.map(r => r.slug)))];
  for (const slug of allSlugs) {
    console.log(`\n  ${slug}`);
    for (const model of models) {
      const r = allResults[model].results.find(x => x.slug === slug);
      if (!r) { console.log(`    ${model}: not tested`); continue; }
      if (r.skipped) { console.log(`    ${model}: skipped (no source)`); continue; }
      if (!r.ok) { console.log(`    ${model}: FAILED`); continue; }
      console.log(`    ${model}: ${r.elapsed}ms | ${r.words}w | ${r.grade}`);
    }
  }
}

const COMPARE = process.argv.includes('--compare');
const FORCE_MODEL = (() => { const i = process.argv.indexOf('--model'); return i >= 0 ? process.argv[i+1] : null; })();
if (COMPARE) {
  compareResults().catch(console.error);
} else {
  runBenchmark().catch(console.error);
}
