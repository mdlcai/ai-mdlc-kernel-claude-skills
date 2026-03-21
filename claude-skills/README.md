# @mdlc/claude-skills

Claude Code slash commands for the [MDLC.AI](https://mdlc.ai) platform — the Markdown Development Lifecycle for AI coding agents.

## Quick Start

```bash
npx @mdlc/claude-skills install
```

This installs all MDLC skills to `~/.claude/commands/`, making them available as slash commands in Claude Code.

## Why Use MDLC Skills?

MDLC skills give your AI coding agent structured workflows for building software with the MDLC methodology. Instead of free-form prompting, you get repeatable, battle-tested commands that connect directly to the MDLC platform:

- **Build faster** — `/research` scaffolds a complete project blueprint in minutes
- **Stay on methodology** — `/kernel` pulls the right MDLC docs into your conversation
- **Ship confidently** — `/deploy` runs pre-flight checks before deploying
- **Scan for vulnerabilities** — `/cyberops` launches security scans without leaving your terminal

## Skills

| Skill | Tier | Description |
|-------|------|-------------|
| `/mdlc-init` | FREE | Bootstrap MCP gateway connection and validate API key |
| `/research` | FREE | Generate RESEARCH.md blueprints using the MDLC wizard |
| `/kernel` | FREE | Search and retrieve MDLC kernel documentation |
| `/deploy` | FREE | Deploy Cloudflare Workers with pre-flight checks |
| `/cyberops` | SOLO+ | Launch and monitor CyberOps security scans |
| `/report` | SOLO+ | Generate PDF reports from scan findings |

## Commands

```bash
npx @mdlc/claude-skills install              # Install all skills
npx @mdlc/claude-skills install research      # Install a specific skill
npx @mdlc/claude-skills update                # Update all skills to latest
npx @mdlc/claude-skills list                  # List available skills
```

## Setup

1. **Get an API key** at [mdlc.ai/dashboard](https://mdlc.ai/dashboard/dashboard.html)
2. **Install skills:**
   ```bash
   npx @mdlc/claude-skills install
   ```
3. **Open Claude Code** in your project and run `/mdlc-init`
4. **Enter your API key** — the skill configures your MCP gateway connection automatically
5. **Start building:** `/research`, `/kernel`, `/deploy`, `/cyberops`

## MCP Gateway Integration

Skills can also be fetched directly from the MDLC MCP Gateway (`mcp.mdlc.ai`) using the `get_skills` tool. This returns the latest skill definitions for your subscription tier, so you always have up-to-date commands even without reinstalling the npm package.

## Subscription Tiers

| Tier | Price | Skills | CyberOps |
|------|-------|--------|----------|
| FREE | $0/mo | /mdlc-init, /research, /kernel, /deploy | -- |
| SOLO | $49/mo | All 6 skills | RECON (50 targets) |
| TEAM | $199/mo | All 6 skills | RECON (50 targets) |
| ENTERPRISE | $799+/mo | All 6 skills | SENTINEL (500 targets) |

[Subscribe at mdlc.ai](https://mdlc.ai/#pricing)

## License

MIT
