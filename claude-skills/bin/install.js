#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DIR = path.join(__dirname, '..', 'skills');
const TARGET_DIR = path.join(os.homedir(), '.claude', 'commands');

const ALL_SKILLS = ['mdlc-init', 'research', 'kernel', 'deploy', 'cyberops', 'report'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function listSkills() {
  console.log('\nAvailable MDLC skills:\n');
  for (const name of ALL_SKILLS) {
    const file = path.join(SKILLS_DIR, `${name}.md`);
    const exists = fs.existsSync(file);
    const installed = fs.existsSync(path.join(TARGET_DIR, `${name}.md`));
    const status = installed ? ' [installed]' : '';
    console.log(`  /${name}${status}${exists ? '' : ' (missing)'}`);
  }
  console.log(`\nInstall dir: ${TARGET_DIR}\n`);
}

function installSkills(names) {
  ensureDir(TARGET_DIR);
  let installed = 0;

  for (const name of names) {
    const src = path.join(SKILLS_DIR, `${name}.md`);
    const dest = path.join(TARGET_DIR, `${name}.md`);

    if (!fs.existsSync(src)) {
      console.error(`  Skill not found: ${name}`);
      continue;
    }

    fs.copyFileSync(src, dest);
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

Skills:
  /mdlc-init    Bootstrap MCP gateway connection
  /research     Generate RESEARCH.md blueprints
  /kernel       Query MDLC kernel documentation
  /deploy       Deploy Cloudflare Workers
  /cyberops     Launch security scans (SOLO+)
  /report       Generate scan PDF reports (SOLO+)
`);
}
