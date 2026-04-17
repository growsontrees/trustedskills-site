import fs from 'fs';

const data = JSON.parse(fs.readFileSync(new URL('../data/skills-index.json', import.meta.url), 'utf8'));
const skills = data.skills || [];

const risky = skills
  .filter((s) => (s.platforms || []).includes('claude') && !(s.platforms || []).includes('claudecode'))
  .map((s) => {
    const cmd = (s.installCmd || '').toLowerCase();
    let installShape = 'other';
    if (cmd.includes('openclaw skills install')) installShape = 'openclaw-wrapper';
    else if (cmd.includes('@trustedskills/')) installShape = 'trustedskills-npm';
    else if (cmd.includes('git clone')) installShape = 'git-clone';
    else if (cmd.includes('pip install')) installShape = 'pip';
    else if (cmd.includes('npx ')) installShape = 'npx';

    let recommendation = 'manual-review';
    if (installShape === 'git-clone' || installShape === 'pip') recommendation = 'do-not-generate-claudecode';
    else if (installShape === 'npx') recommendation = 'needs-explicit-claudecode-proof';
    else if (installShape === 'openclaw-wrapper') recommendation = 'conservative-fallback-until-explicit';

    return {
      slug: s.slug,
      name: s.name,
      author: s.author,
      platforms: s.platforms,
      installShape,
      recommendation,
      installCmd: s.installCmd,
      repoUrl: s.repoUrl,
    };
  });

console.log(JSON.stringify({
  totalSkills: skills.length,
  riskyCount: risky.length,
  risky,
}, null, 2));
