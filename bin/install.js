#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TARGET_DIR = path.join(os.homedir(), '.claude', 'skills');

const ALL_SKILLS = [
  'mdlc-init', 'research', 'kernel', 'deploy',
  'architect', 'mcp-builder', 'edge-expert', 'secure-code',
  'supabase', 'test', 'optimize', 'migrate',
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function findSkillSource(name) {
  // New format: skills/<name>/SKILL.md
  const dirFormat = path.join(SKILLS_DIR, name, 'SKILL.md');
  if (fs.existsSync(dirFormat)) return { src: dirFormat, format: 'dir' };

  // Legacy format: skills/<name>.md
  const flatFormat = path.join(SKILLS_DIR, `${name}.md`);
  if (fs.existsSync(flatFormat)) return { src: flatFormat, format: 'flat' };

  return null;
}

function isInstalled(name) {
  return fs.existsSync(path.join(TARGET_DIR, name, 'SKILL.md'));
}

function listSkills() {
  console.log('\nAvailable MDLC skills:\n');
  console.log('  Core:');
  for (const name of ALL_SKILLS.slice(0, 4)) {
    const source = findSkillSource(name);
    const status = isInstalled(name) ? ' [installed]' : '';
    console.log(`    /${name}${status}${source ? '' : ' (missing)'}`);
  }
  console.log('\n  Expert:');
  for (const name of ALL_SKILLS.slice(4)) {
    const source = findSkillSource(name);
    const status = isInstalled(name) ? ' [installed]' : '';
    console.log(`    /${name}${status}${source ? '' : ' (missing)'}`);
  }
  console.log(`\nInstall dir: ${TARGET_DIR}\n`);
}

function installSkills(names) {
  let installed = 0;

  for (const name of names) {
    const source = findSkillSource(name);
    if (!source) {
      console.error(`  Skill not found: ${name}`);
      continue;
    }

    const destDir = path.join(TARGET_DIR, name);
    ensureDir(destDir);
    const dest = path.join(destDir, 'SKILL.md');
    fs.copyFileSync(source.src, dest);
    console.log(`  Installed /${name} -> ${dest}`);
    installed++;
  }

  console.log(`\n${installed} skill(s) installed to ${TARGET_DIR}`);
}

// --- CLI ---

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'install': {
    const specific = args.slice(1);
    const names = specific.length > 0 ? specific : ALL_SKILLS;
    const invalid = names.filter(n => !ALL_SKILLS.includes(n));
    if (invalid.length) {
      console.error(`Unknown skill(s): ${invalid.join(', ')}`);
      console.error(`Available: ${ALL_SKILLS.join(', ')}`);
      process.exit(1);
    }
    console.log('\nInstalling MDLC Claude Code skills...\n');
    installSkills(names);
    break;
  }

  case 'update':
    console.log('\nUpdating all MDLC Claude Code skills...\n');
    installSkills(ALL_SKILLS);
    break;

  case 'list':
    listSkills();
    break;

  default:
    console.log(`
MDLC Claude Code Skills

Usage:
  npx @mdlc/claude-skills install           Install all skills
  npx @mdlc/claude-skills install <name>    Install specific skill(s)
  npx @mdlc/claude-skills update            Update all installed skills
  npx @mdlc/claude-skills list              List available skills

Core Skills:
  /mdlc-init    Bootstrap MCP gateway connection
  /research     Generate RESEARCH.md blueprints
  /kernel       Query MDLC kernel documentation
  /deploy       Deploy Cloudflare Workers

Expert Skills:
  /architect    System architecture from RESEARCH.md
  /mcp-builder  Build custom MCP servers
  /edge-expert  Cloudflare Workers patterns
  /secure-code  Security review (OWASP top 10)
  /supabase     Database design & RLS policies
  /test         Test generation (MDLC quality gates)
  /optimize     Performance audit & optimization
  /migrate      Database & API migrations
`);
}
