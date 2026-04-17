#!/usr/bin/env node
/**
 * enrich-longdesc-v2.mjs
 *
 * Re-enrichment script with fixed source fetching.
 *
 * Key fixes vs v1:
 *  1. GitHub README is ALWAYS preferred when repoUrl is available (clean plain text)
 *  2. skills.sh pages: extract the actual SKILL.md prose content, not raw HTML
 *  3. If we can't get real source content — skip entirely, never hallucinate
 *  4. Prompt updated: can expand, simplify, add context; not just summarise
 *
 * Targets (in order):
 *  a) Skills with no longDescription (never enriched)
 *  b) Skills flagged as longDescriptionSource = "skills.sh" (may be wrong — re-do top N)
 *
 * Usage:
 *   node scripts/enrich-longdesc-v2.mjs                  # run normally
 *   node scripts/enrich-longdesc-v2.mjs --dry-run        # preview 5 skills, no writes
 *   node scripts/enrich-longdesc-v2.mjs --limit 50       # process max 50 skills
 *   node scripts/enrich-longdesc-v2.mjs --status         # count remaining only
 *   node scripts/enrich-longdesc-v2.mjs --redo-top 200   # re-do top 200 by installs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/skills-index.json');

const LM_STUDIO_URL = 'http://100.92.164.72:1234';
const FIRECRAWL_URL = 'http://100.92.164.72:3002'; // self-hosted Firecrawl (Docker Desktop, home machine)
const MODEL_PRIMARY = 'qwen/qwen3.5-9b';    // base model — NOT the claude-code finetune
const MODEL_FALLBACK = 'google/gemma-3-12b'; // fallback if primary fails probe

const SAVE_EVERY = 10;
const FETCH_TIMEOUT_MS = 15000;
const LLM_TIMEOUT_MS = 90000;
const STOP_HOUR_SYDNEY = 7;   // auto-stop at 7am Sydney
const AEDT_OFFSET = 10;       // UTC+10 AEST (no daylight saving April–Oct)
const EARLY_ABORT_COUNT = 5;  // abort if first N skills all fail

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const STATUS_ONLY = args.includes('--status');
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i+1]) : Infinity; })();
const REDO_TOP = (() => { const i = args.indexOf('--redo-top'); return i >= 0 ? parseInt(args[i+1]) : 0; })();

// ── Logging ───────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const LOG_FILE = `/tmp/enrich-longdesc-v2-${today}.log`;
const logStream = STATUS_ONLY || DRY_RUN ? null : fs.createWriteStream(LOG_FILE, { flags: 'a' });
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  if (logStream) logStream.write(line + '\n');
}

// ── Time check ────────────────────────────────────────────────────────────────
function sydneyHour() { return (new Date().getUTCHours() + AEDT_OFFSET) % 24; }
function shouldStop() {
  const h = sydneyHour();
  return h >= STOP_HOUR_SYDNEY && h < 20;
}

// ── Data ──────────────────────────────────────────────────────────────────────
function loadData() {
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const skills = raw.skills || raw;
  return { skills, raw };
}
function saveData(raw, skills) {
  const out = raw.skills ? { ...raw, skills } : skills;
  fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2));
}

// ── Source fetching ───────────────────────────────────────────────────────────

/**
 * Fetch a URL and return raw text.
 */
async function fetchText(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'TrustedSkills-Enricher/2.0' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/**
 * Extract meaningful text from a skills.sh page HTML.
 *
 * skills.sh pages embed the SKILL.md content in the HTML as visible text.
 * We strip tags but also remove nav/head noise by targeting the main content block.
 */
function extractSkillsShContent(html) {
  if (!html) return null;

  // Remove script and style blocks
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');

  // Try to isolate the main skill content area (after the summary/install block)
  // skills.sh pages have the SKILL.md content as a <pre> or plain section
  // Look for SKILL.md header or the first ## heading
  const skillMdMatch = text.match(/SKILL\.md([\s\S]{100,})/i);
  if (skillMdMatch) {
    text = skillMdMatch[1];
  }

  // Strip remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  // Collapse whitespace
  text = text.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

  // Must be at least 200 chars of real content — otherwise it's probably navigation noise
  if (text.length < 200) return null;

  return text.substring(0, 3000);
}

// ── Firecrawl ─────────────────────────────────────────────────────────────────
let firecrawlAvailable = null; // cached after first probe

async function probeFirecrawl() {
  if (firecrawlAvailable !== null) return firecrawlAvailable;
  try {
    const res = await fetch(`${FIRECRAWL_URL}/v1/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ url: 'https://example.com', formats: ['markdown'] })
    });
    firecrawlAvailable = res.ok;
  } catch {
    firecrawlAvailable = false;
  }
  if (firecrawlAvailable) {
    log('Firecrawl: available — will use for skills.sh pages');
  } else {
    log('Firecrawl: not reachable — falling back to HTML extraction for skills.sh');
  }
  return firecrawlAvailable;
}

/**
 * Use Firecrawl to scrape a URL and return clean markdown.
 * Returns null if Firecrawl is unavailable or the scrape fails.
 */
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
  } catch {
    return null;
  }
}

/**
 * Fetch the best available source content for a skill.
 *
 * Priority:
 *   1. GitHub README / SKILL.md (direct raw fetch — always clean plain text)
 *   2. Firecrawl scrape of skills.sh page (if home machine is online) — best quality
 *   3. HTML extraction fallback for skills.sh (offline fallback) — ok for most pages
 *   4. null → skip LLM entirely, never hallucinate
 */
async function fetchSource(skill) {
  // 1. GitHub README — always preferred when available
  if (skill.repoUrl && skill.repoUrl.includes('github.com') && !skill.repoUrl.includes('skills.sh')) {
    const parts = skill.repoUrl.replace('https://github.com/', '').split('/');
    if (parts.length >= 2) {
      const owner = parts[0];
      const repo = parts[1];
      for (const branch of ['main', 'master']) {
        const text = await fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`);
        if (text && text.length > 100) return { content: text.substring(0, 4000), source: 'github' };
        const sm = await fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/SKILL.md`);
        if (sm && sm.length > 100) return { content: sm.substring(0, 4000), source: 'github' };
      }
    }
  }

  // 2. skills.sh page — try Firecrawl first, fall back to HTML extraction
  if (skill.sourceUrl && skill.sourceUrl.includes('skills.sh')) {
    const usFirecrawl = await probeFirecrawl();
    if (usFirecrawl) {
      const md = await firecrawlScrape(skill.sourceUrl);
      if (md) return { content: md, source: 'skills.sh-firecrawl' };
    }
    // Fallback: HTML extraction
    const html = await fetchText(skill.sourceUrl);
    const content = extractSkillsShContent(html);
    if (content && content.length >= 200) return { content, source: 'skills.sh' };
  }

  // 3. No usable source — do NOT call LLM
  return null;
}

// ── LLM ───────────────────────────────────────────────────────────────────────
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
- If the source is about a coding assistant, say so — do not generalise to "all development tasks"
- Keep output under 500 words total
- Use markdown formatting`;

function stripThinkTags(s) {
  return (s || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

async function probeModel(model) {
  try {
    const res = await fetch(`${LM_STUDIO_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: '/no_think\nRespond with exactly: OK' },
          { role: 'user', content: 'Reply with OK' }
        ],
        temperature: 0,
        max_tokens: 10
      })
    });
    const j = await res.json();
    const content = stripThinkTags(j.choices?.[0]?.message?.content || '');
    log(`Probe ${model}: "${content.substring(0, 50)}"`);
    return content.length > 0;
  } catch (e) {
    log(`Probe ${model} failed: ${e.message}`);
    return false;
  }
}

async function generateLongDesc(skill, sourceContent, model) {
  const userMsg = `Skill slug: ${skill.slug}
Skill name: ${skill.name}
Author: ${skill.author}
Category: ${skill.category}
Short description: ${skill.description}
Install count: ${skill.installs || 0}

Source content from ${skill.repoUrl?.includes('github.com') ? 'GitHub README' : 'skills.sh page'}:
---
${sourceContent}
---

Write the "About This Skill" section now.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

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
        max_tokens: 600
      })
    });
    clearTimeout(timeout);
    const j = await res.json();
    const content = stripThinkTags(j.choices?.[0]?.message?.content || '');
    return content.length > 100 ? content : null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { skills, raw } = loadData();

  // Determine target set
  let targets;
  if (REDO_TOP > 0) {
    // Re-enrich top N by installs that have skills.sh longDescriptionSource (may be wrong)
    targets = skills
      .filter(s => s.longDescriptionSource === 'skills.sh')
      .sort((a, b) => (b.installs || 0) - (a.installs || 0))
      .slice(0, REDO_TOP);
    log(`Re-enriching top ${REDO_TOP} skills by installs (skills.sh source)`);
  } else {
    // Default: skills with no longDescription at all
    targets = skills
      .filter(s => !s.longDescription)
      .sort((a, b) => (b.installs || 0) - (a.installs || 0));
    log(`Enriching ${targets.length} skills with no longDescription`);
  }

  if (STATUS_ONLY) {
    const noLD = skills.filter(s => !s.longDescription).length;
    const skSH = skills.filter(s => s.longDescriptionSource === 'skills.sh').length;
    console.log(`No longDescription:              ${noLD}`);
    console.log(`longDescriptionSource=skills.sh: ${skSH}`);
    console.log(`Re-do target (redo-top):         ${skSH}`);
    return;
  }

  if (DRY_RUN) {
    log('DRY RUN — will fetch source and preview, no writes');
    const preview = targets.slice(0, 5);
    for (const skill of preview) {
      log(`\n--- ${skill.slug} (${skill.installs} installs) ---`);
      const fetched = await fetchSource(skill);
      if (!fetched) {
        log(`  NO USABLE SOURCE — would skip`);
      } else {
        log(`  Source (${fetched.source}, ${fetched.content.length} chars): ${fetched.content.substring(0, 200).replace(/\n/g, ' ')}...`);
      }
    }
    return;
  }

  // Probe model
  log('Probing primary model...');
  let model = MODEL_PRIMARY;
  if (!await probeModel(model)) {
    log(`Primary model failed. Trying fallback ${MODEL_FALLBACK}...`);
    model = MODEL_FALLBACK;
    if (!await probeModel(model)) {
      log('Both models failed probe. Check LM Studio is running with a model loaded.');
      log('NOTE: Use the BASE qwen/qwen3.5-9b model, NOT qwen3.5-9b-claude-code (finetune returns empty content)');
      process.exit(1);
    }
  }
  log(`Using model: ${model}`);

  let processed = 0, improved = 0, noSource = 0, errors = 0;
  let earlyConsecFails = 0;

  const limited = LIMIT < Infinity ? targets.slice(0, LIMIT) : targets;

  for (const skill of limited) {
    if (shouldStop()) { log('Reached stop time. Exiting.'); break; }
    if (processed >= LIMIT) break;

    // Fetch source
    const fetched = await fetchSource(skill);
    if (!fetched) {
      noSource++;
      processed++;
      log(`✗ ${skill.slug}: no usable source content — skipping (no LLM call)`);
      continue;
    }

    // Generate
    const ld = await generateLongDesc(skill, fetched.content, model);
    processed++;

    if (!ld) {
      errors++;
      earlyConsecFails++;
      log(`✗ ${skill.slug}: LLM returned empty/failed`);
      if (processed <= EARLY_ABORT_COUNT && earlyConsecFails >= EARLY_ABORT_COUNT) {
        log(`ABORT: first ${EARLY_ABORT_COUNT} attempts all failed. Check model is loaded.`);
        break;
      }
    } else {
      earlyConsecFails = 0;
      improved++;
      skill.longDescription = ld;
      skill.longDescriptionSource = fetched.source;
      skill.longDescriptionModel = model;
      log(`✓ ${skill.slug} (${fetched.source}) — ${ld.length} chars`);
    }

    // Save incrementally
    if (improved > 0 && improved % SAVE_EVERY === 0) {
      saveData(raw, skills);
      log(`Saved at ${improved} improvements`);
    }
  }

  // Final save
  if (improved > 0) {
    saveData(raw, skills);
    log(`Final save.`);
  }

  log(`\n=== Session complete ===`);
  log(`Processed: ${processed}`);
  log(`Improved:  ${improved}`);
  log(`No source: ${noSource}`);
  log(`Errors:    ${errors}`);
  log(`Model:     ${model}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
