#!/usr/bin/env node
/**
 * enrich-longdesc.mjs
 * Generates rich longDescription for skills using Qwen3 14B via LM Studio.
 *
 * Strategy:
 *  - Process skills sorted by installs desc (most popular first)
 *  - Skip skills that already have longDescription
 *  - Fetch sourceUrl (skills.sh page) or repoUrl (GitHub README) for source material
 *  - Generate structured markdown longDescription via LLM
 *  - Save incrementally every SAVE_EVERY skills
 *  - Auto-stop at STOP_HOUR (Sydney/AEDT time) so it doesn't run into the day
 *
 * Usage:
 *   node scripts/enrich-longdesc.mjs                  # run with defaults
 *   node scripts/enrich-longdesc.mjs --dry-run        # preview first 5, no saves
 *   node scripts/enrich-longdesc.mjs --limit 100      # process max 100 skills
 *   node scripts/enrich-longdesc.mjs --status         # show progress counts only
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/skills-index.json');
const LOG_FILE = '/tmp/enrich-longdesc.log';

const LM_STUDIO_URL = 'http://100.92.164.72:1234';
const MODEL_PRIMARY = 'qwen/qwen3.5-9b';
const MODEL_FALLBACK = 'google/gemma-3-12b';
const SAVE_EVERY = 10;
const FETCH_TIMEOUT_MS = 15000;
const LLM_TIMEOUT_MS = 90000;
const STOP_HOUR_SYDNEY = 7; // stop at 7am Sydney time
const AEDT_OFFSET = 11; // UTC+11 (AEDT); update to 10 after daylight saving ends
const EARLY_ABORT_THRESHOLD = 5; // abort and switch model if first N skills all fail

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const STATUS_ONLY = args.includes('--status');
const LIMIT = (() => { const i = args.indexOf('--limit'); return i >= 0 ? parseInt(args[i+1]) : Infinity; })();

// ── Logging ──────────────────────────────────────────────────────────────────
const logStream = STATUS_ONLY ? null : fs.createWriteStream(LOG_FILE, { flags: 'a' });
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  if (logStream) logStream.write(line + '\n');
}

// ── Time check ────────────────────────────────────────────────────────────────
function sydneyHour() {
  return (new Date().getUTCHours() + AEDT_OFFSET) % 24;
}
function shouldStop() {
  return sydneyHour() >= STOP_HOUR_SYDNEY && sydneyHour() < 20; // stop 7am-8pm Sydney
}

// ── Data loading ──────────────────────────────────────────────────────────────
function loadData() {
  const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const skills = raw.skills || raw;
  const meta = raw.skills ? raw : null; // preserve wrapper if present
  return { skills, meta, raw };
}
function saveData(raw, skills) {
  const out = raw.skills ? { ...raw, skills } : skills;
  fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2));
}

// ── Source fetching ───────────────────────────────────────────────────────────
async function fetchSource(skill) {
  const url = skill.sourceUrl || skill.repoUrl;
  if (!url) return null;

  // Convert GitHub repo URL to raw README
  let fetchUrl = url;
  if (url.includes('github.com') && !url.includes('skills.sh')) {
    const parts = url.replace('https://github.com/', '').split('/');
    if (parts.length >= 2) {
      fetchUrl = `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/main/README.md`;
    }
  }

  try {
    const res = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'User-Agent': 'TrustedSkills-Enricher/1.0' }
    });
    if (!res.ok) return null;
    const text = await res.text();
    // Trim to ~3000 chars to keep prompt manageable
    return text.substring(0, 3000).trim() || null;
  } catch {
    return null;
  }
}

// ── LLM generation ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `/no_think
You are a technical writer for TrustedSkills, an AI agent skills registry.
Given source content about a skill, write a rich, useful skill guide page in markdown.

Use exactly these sections:
## What it does
2-3 sentences describing real capabilities from the source. Be specific.

## When to use it
3-4 concrete bullet points with real scenarios.

## Key capabilities
Bullet list of actual features mentioned in the source.

## Example prompts
2-3 example prompts a user might give an AI agent using this skill.

## Tips & gotchas
1-2 practical notes about prerequisites, limitations, or getting the most from it.

Rules:
- Do NOT hallucinate details not in the source
- Do NOT start with "The [slug] skill..."
- Keep total output under 400 words
- Use markdown formatting`;

function stripThinkTags(s) {
  return (s || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
}

// ── LLM probe — test model before main loop ───────────────────────────────────
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
    return content.length > 0;
  } catch {
    return false;
  }
}

async function generateLongDesc(skill, sourceContent, model) {
  const source = sourceContent
    ? sourceContent.substring(0, 2500)
    : `Skill: ${skill.slug}\nAuthor: ${skill.author}\nCategory: ${skill.category}\nDescription: ${skill.description}`;

  const userMsg = `Skill slug: ${skill.slug}
Author: ${skill.author}
Category: ${skill.category}
Install count: ${skill.installs || 0}

Source content:
${source}`;

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
        max_tokens: 550
      })
    });
    clearTimeout(timeout);
    const j = await res.json();
    const content = stripThinkTags(j.choices?.[0]?.message?.content || '');
    return content.length > 50 ? content : null;
  } catch (e) {
    clearTimeout(timeout);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { skills, raw } = loadData();

  const total = skills.length;
  const done = skills.filter(s => s.longDescription).length;
  const todo = skills.filter(s => !s.longDescription).length;

  log(`Total: ${total} | Already have longDescription: ${done} | Remaining: ${todo}`);

  if (STATUS_ONLY) {
    // Show breakdown by source
    const bySource = { skillsSh: 0, github: 0, noSource: 0 };
    skills.filter(s => !s.longDescription).forEach(s => {
      if ((s.sourceUrl||'').includes('skills.sh')) bySource.skillsSh++;
      else if (s.repoUrl || s.sourceUrl) bySource.github++;
      else bySource.noSource++;
    });
    console.log('Remaining breakdown:', bySource);
    // Top 10 remaining by installs
    const top10 = skills.filter(s => !s.longDescription)
      .sort((a,b) => (b.installs||0) - (a.installs||0))
      .slice(0, 10);
    console.log('\nTop 10 remaining by installs:');
    top10.forEach(s => console.log(`  ${s.slug} (${s.installs||0} installs)`));
    return;
  }

  if (shouldStop()) {
    log('Outside run window (Sydney time is past 7am). Exiting.');
    process.exit(0);
  }

  // ── Pre-flight probe ────────────────────────────────────────────────────────
  log(`Probing primary model (${MODEL_PRIMARY})...`);
  let activeModel = MODEL_PRIMARY;
  const primaryOk = await probeModel(MODEL_PRIMARY);
  if (primaryOk) {
    log(`✅ Primary model (${MODEL_PRIMARY}) responding.`);
  } else {
    log(`⚠ Primary model (${MODEL_PRIMARY}) not responding — trying fallback (${MODEL_FALLBACK})...`);
    const fallbackOk = await probeModel(MODEL_FALLBACK);
    if (fallbackOk) {
      log(`✅ Fallback model (${MODEL_FALLBACK}) responding. Using fallback for this run.`);
      activeModel = MODEL_FALLBACK;
    } else {
      log(`❌ Both models unreachable. Is LM Studio running? Aborting.`);
      process.exit(1);
    }
  }

  // Sort by installs desc, process skills without longDescription first
  const queue = skills
    .filter(s => !s.longDescription)
    .sort((a, b) => (b.installs || 0) - (a.installs || 0));

  log(`Queue: ${queue.length} skills to process (limit: ${LIMIT === Infinity ? 'none' : LIMIT}) | Model: ${activeModel}`);
  if (DRY_RUN) log('DRY RUN — will preview 5 skills, no saves');

  let processed = 0, improved = 0, errors = 0, skipped = 0;
  const startTime = Date.now();

  for (const skill of queue) {
    if (processed >= LIMIT) break;

    // Time check every 10 skills
    if (processed % 10 === 0 && shouldStop()) {
      log(`⏰ Sydney time reached ${STOP_HOUR_SYDNEY}:00, stopping for the day.`);
      break;
    }

    // Early abort: if first N skills all failed, switch model or abort
    if (processed === EARLY_ABORT_THRESHOLD && errors === EARLY_ABORT_THRESHOLD) {
      if (activeModel === MODEL_PRIMARY) {
        log(`⚠ First ${EARLY_ABORT_THRESHOLD} skills all failed with ${MODEL_PRIMARY}. Switching to fallback (${MODEL_FALLBACK})...`);
        const fallbackOk = await probeModel(MODEL_FALLBACK);
        if (fallbackOk) {
          activeModel = MODEL_FALLBACK;
          errors = 0; // reset error count for fallback run
          log(`✅ Switched to fallback model. Continuing...`);
        } else {
          log(`❌ Fallback also unreachable. Aborting to avoid wasting the night.`);
          process.exit(1);
        }
      } else {
        log(`❌ First ${EARLY_ABORT_THRESHOLD} skills all failed with fallback model too. Aborting.`);
        process.exit(1);
      }
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    log(`[${processed + 1}/${Math.min(queue.length, LIMIT === Infinity ? queue.length : LIMIT)}] ${skill.slug} (${skill.installs||0} installs) [${elapsed}s elapsed]`);

    // Fetch source
    const sourceContent = await fetchSource(skill);
    if (!sourceContent) {
      log(`  ⚠ No source content, using metadata fallback`);
    } else {
      log(`  ✓ Fetched ${sourceContent.length} chars from ${skill.sourceUrl || skill.repoUrl}`);
    }

    if (DRY_RUN) {
      const preview = await generateLongDesc(skill, sourceContent, activeModel);
      if (preview) {
        console.log(`\n--- PREVIEW: ${skill.slug} ---`);
        console.log(preview.substring(0, 500));
        console.log('---\n');
        improved++;
      }
      processed++;
      if (processed >= 5) break;
      continue;
    }

    // Generate
    const longDesc = await generateLongDesc(skill, sourceContent, activeModel);
    if (longDesc) {
      skill.longDescription = longDesc;
      skill.longDescriptionSource = sourceContent ? (skill.sourceUrl ? 'skills.sh' : 'github') : 'metadata';
      skill.longDescriptionAt = new Date().toISOString();
      skill.longDescriptionModel = activeModel;
      improved++;
    } else {
      log(`  ✗ LLM returned empty/failed`);
      errors++;
    }

    processed++;

    // Incremental save
    if (processed % SAVE_EVERY === 0) {
      saveData(raw, skills);
      log(`  💾 Saved checkpoint (${improved} improved, ${errors} errors so far)`);
    }
  }

  // Final save
  if (!DRY_RUN && improved > 0) {
    saveData(raw, skills);
    log(`✅ Final save complete.`);
  }

  const totalSecs = Math.round((Date.now() - startTime) / 1000);
  log(`\n=== Session complete ===`);
  log(`Model: ${activeModel} | Processed: ${processed} | Improved: ${improved} | Errors: ${errors} | Time: ${totalSecs}s (avg ${Math.round(totalSecs/(processed||1))}s/skill)`);
  log(`Remaining in queue: ${queue.length - processed}`);
}

main().catch(e => { log('Fatal: ' + e.message); process.exit(1); });
