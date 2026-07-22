#!/usr/bin/env node
// Compare LLM models for README → description synthesis
// Usage: node scripts/test-readme-models.mjs

const LLM_URL = 'http://100.92.164.72:1234';

const MODELS = [
  { id: 'google/gemma-3-12b', label: 'Gemma 3 12B' },
  { id: 'qwen/qwen3.5-9b', label: 'Qwen 3.5 9B', noThink: true },
  { id: 'qwen3.5-9b-claude-code', label: 'Qwen 3.5 9B (Claude Code FT)' },
];

const SYSTEM_PROMPT = `You are a technical writer for a skills registry. Given source content for an AI agent skill, write:
1. A short description (1-2 sentences, max 40 words) — the elevator pitch
2. A long description (3-5 sentences) — what it actually does, when to use it, what makes it unique

Format your response EXACTLY as:
SHORT: <short description>
LONG: <long description>

Be specific, useful and avoid generic phrases like "helps with" or "provides guidance".`;

const TEST_CASES = [
  {
    slug: 'remotion-best-practices',
    author: 'remotion-dev',
    category: 'video-media',
    source: `When to use: Use this skill whenever you are dealing with Remotion code to obtain domain-specific knowledge.
Captions: When dealing with captions or subtitles, load rules/subtitles.md for more information.
Using FFmpeg: For video operations such as trimming or detecting silence, FFmpeg should be used via rules/ffmpeg.md.
Audio visualization: When needing to visualize audio (spectrum bars, waveforms, bass-reactive effects), load rules/audio-visualization.md.
Available rule files: rules/3d.md - 3D content using Three.js and React Three Fiber; rules/animations.md - Fundamental animation skills; rules/assets.md - Importing images, videos, audio, and fonts; rules/audio.md - Using audio - importing, trimming, volume, speed, pitch; rules/calculate-metadata.md - Dynamically set composition duration, dimensions, and props.`
  },
  {
    slug: 'systematic-debugging',
    author: 'obra',
    category: 'testing',
    source: `systematic-debugging provides a structured approach to debugging code issues.
Key capabilities: Root cause analysis through systematic elimination; Step-by-step hypothesis testing; Log analysis and error trace interpretation; Reproduce-then-fix methodology; Document findings as you go.
Use when: You have a bug that resists obvious fixes; Error messages are ambiguous or misleading; The problem is intermittent or hard to reproduce; You need to debug someone else's code.`
  },
  {
    slug: 'frontend-design',
    author: 'anthropics',
    category: 'frontend',
    source: `Frontend Design skill by Anthropics. Helps Claude build better UIs and frontend experiences.
Covers: Component architecture and design patterns; Responsive design principles; Accessibility (WCAG) guidelines; CSS/Tailwind best practices; React component composition; Design system usage; Color theory and typography for UI; Performance considerations for frontend code.
When to use: Building new UI components; Reviewing existing frontend code; Designing responsive layouts; Implementing accessibility features.`
  },
  {
    slug: 'find-skills',
    author: 'vercel-labs',
    category: 'agents',
    source: `find-skills helps AI agents discover and recommend relevant skills.sh skills based on a user's query or task.
How it works: Takes a natural language description of what the user needs; Searches the skills.sh registry for matching skills; Returns ranked results with install instructions; Explains why each skill is relevant.
Use when: User asks for help finding skills; You need to extend your capabilities; Recommending skills to other users.`
  },
  {
    slug: 'azure-ai',
    author: 'microsoft',
    category: 'cloud',
    source: `Azure AI skill for GitHub Copilot. Provides guidance on Azure AI services including Azure OpenAI, Cognitive Services, and AI Search.
Capabilities: Azure OpenAI Service setup and usage; AI Search index creation and querying; Cognitive Services integration; Prompt engineering for Azure OpenAI; RAG patterns with Azure AI Search; Responsible AI guidelines; Cost optimization for AI workloads.
Best for: Building AI-powered apps on Azure; Migrating to Azure OpenAI from other providers; Implementing semantic search with AI Search.`
  },
];

async function generate(model, skill) {
  const userPrompt = `Skill: ${skill.slug}
Author/Org: ${skill.author}
Category: ${skill.category}

Source content:
${skill.source}`;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: model.noThink ? `/no_think\n${userPrompt}` : userPrompt },
  ];

  const start = Date.now();
  const res = await fetch(`${LLM_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model.id,
      messages,
      temperature: 0.3,
      max_tokens: 200,
    }),
  });
  const j = await res.json();
  const ms = Date.now() - start;
  const content = (j.choices?.[0]?.message?.content || j.choices?.[0]?.message?.reasoning_content || '').trim();
  return { content, ms };
}

async function main() {
  console.log('Testing models on README synthesis task\n');
  console.log('Models:', MODELS.map(m => m.label).join(', '));
  console.log('Test cases:', TEST_CASES.length, '\n');
  console.log('='.repeat(80));

  for (const skill of TEST_CASES) {
    console.log(`\n## ${skill.slug} (${skill.author})\n`);
    for (const model of MODELS) {
      try {
        const { content, ms } = await generate(model, skill);
        console.log(`### ${model.label} [${ms}ms]`);
        console.log(content || '(empty response)');
        console.log();
      } catch (e) {
        console.log(`### ${model.label} — ERROR: ${e.message}\n`);
      }
    }
    console.log('-'.repeat(80));
  }
}

main().catch(console.error);
