import fs from 'fs';

const path = new URL('../data/skills-index.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const overrides = {
  'claude-seo': {
    preferredPlatform: 'claudecode',
    installOverrides: {
      claudecode: {
        supported: true,
        mode: 'custom',
        command: 'git clone https://github.com/AgriciDaniel/claude-seo && cd claude-seo && ./install.sh',
        note: 'This suite is intended for Claude Code, but installation follows the upstream repository flow rather than a generated claude mcp add command.'
      }
    }
  },
  'search-console-mcp': {
    preferredPlatform: 'mcp'
  },
  'gsc-mcp': {
    preferredPlatform: 'mcp'
  },
  'google-analytics-mcp': {
    preferredPlatform: 'mcp'
  }
};

let updated = 0;
for (const skill of data.skills) {
  const patch = overrides[skill.slug];
  if (!patch) continue;
  Object.assign(skill, patch);
  updated++;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
console.log(`Updated ${updated} skills`);
