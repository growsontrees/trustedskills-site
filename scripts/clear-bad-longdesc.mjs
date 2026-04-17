#!/usr/bin/env node
/**
 * clear-bad-longdesc.mjs
 *
 * Clears longDescription on skills where the enrichment script
 * clearly produced wrong output:
 *   1. "Admitted failures" — LLM said it received bare HTML and couldn't help
 *   2. "Detectable hallucinations" — known bad phrases (multi-cloud fiction etc.)
 *
 * Does NOT touch skills with longDescriptionSource other than "skills.sh".
 *
 * Run: node scripts/clear-bad-longdesc.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../data/skills-index.json');
const DRY_RUN = process.argv.includes('--dry-run');

// Phrases that mean the LLM admitted it received garbage HTML
const ADMISSION_PHRASES = [
  'raw html document',
  'raw html shell',
  'lacks the descriptive text',
  'lacks the actual',
  'does not contain any descr',
  'only metadata',
  'html shell',
  'source content provided is',
  'source content is a raw',
  'no actual content',
  'empty source',
  'no content was provided',
  'insufficient source',
];

// Phrases that indicate hallucinated multi-cloud fiction for non-cloud skills
const HALLUCINATION_PHRASES = [
  'multi-cloud platform',
  'multi-cloud infrastructure',
  'multi-cloud environment',
  'multi-cloud platform (mcp)',
  'multiple cloud providers',
];

const SAFE_CATEGORIES = new Set(['cloud', 'devops']); // multi-cloud is OK here

const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const skills = raw.skills || raw;

let clearedAdmission = 0;
let clearedHallucination = 0;
let skipped = 0;

for (const skill of skills) {
  if (!skill.longDescription || skill.longDescriptionSource !== 'skills.sh') continue;

  const ld = skill.longDescription.toLowerCase();

  const isAdmission = ADMISSION_PHRASES.some(p => ld.includes(p));
  const isHallucination =
    !SAFE_CATEGORIES.has(skill.category) &&
    HALLUCINATION_PHRASES.some(p => ld.includes(p));

  if (isAdmission) {
    if (!DRY_RUN) {
      delete skill.longDescription;
      delete skill.longDescriptionSource;
      delete skill.longDescriptionModel;
    }
    clearedAdmission++;
  } else if (isHallucination) {
    if (!DRY_RUN) {
      delete skill.longDescription;
      delete skill.longDescriptionSource;
      delete skill.longDescriptionModel;
    }
    clearedHallucination++;
  } else {
    skipped++;
  }
}

const totalCleared = clearedAdmission + clearedHallucination;

if (!DRY_RUN && totalCleared > 0) {
  const out = raw.skills ? { ...raw, skills } : skills;
  fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2));
  console.log(`Saved. Cleared ${totalCleared} longDescriptions.`);
}

console.log(`\nResults${DRY_RUN ? ' (DRY RUN — no changes written)' : ''}:`);
console.log(`  Admitted bare-HTML failures cleared:  ${clearedAdmission}`);
console.log(`  Detectable hallucinations cleared:    ${clearedHallucination}`);
console.log(`  Untouched (looks OK or other source): ${skipped}`);
console.log(`  Total cleared:                        ${totalCleared}`);
