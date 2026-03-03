#!/usr/bin/env node
/**
 * Fetch latest skills-index.json from GitHub registry before build.
 * Falls back to the bundled version if GitHub is unreachable.
 */

import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/api/index.json');
const REGISTRY_URL = 'https://raw.githubusercontent.com/growsontrees/trustedskills-registry/main/skills-index.json';

async function fetchIndex() {
  console.log('📦 Fetching latest skills index from GitHub registry...');
  console.log(`   Source: ${REGISTRY_URL}`);
  
  try {
    const response = await fetch(REGISTRY_URL, {
      headers: {
        'User-Agent': 'TrustedSkills-Site-Build/1.0',
        ...(process.env.GITHUB_TOKEN ? {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        } : {}),
      },
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate the data
    if (!data.skills || !Array.isArray(data.skills)) {
      throw new Error('Invalid index format: missing skills array');
    }
    
    // Write to public/api/index.json
    writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
    console.log(`✅ Fetched ${data.skills.length} skills from registry`);
    console.log(`   Last updated: ${data.stats?.last_updated || 'unknown'}`);
    
  } catch (err) {
    console.warn(`⚠️  Could not fetch from GitHub: ${err.message}`);
    console.warn('   Using bundled skills index as fallback...');
    
    // Verify fallback exists
    try {
      const fallback = JSON.parse(readFileSync(OUTPUT, 'utf8'));
      console.log(`   Fallback: ${fallback.skills?.length || 0} skills loaded`);
    } catch {
      console.error('❌ No fallback index found! Build may fail.');
    }
  }
}

fetchIndex();
