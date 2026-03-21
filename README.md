# @mdlc/claude-skills

Claude Code slash commands for the [MDLC.AI](https://mdlc.ai) platform — the Markdown Development Lifecycle for AI coding agents.

## Quick Start

```bash
npx @mdlc/claude-skills install
```

This installs all 14 MDLC skills to `~/.claude/skills/`, making them available as slash commands in Claude Code.

## Why Use MDLC Skills?

MDLC skills give your AI coding agent structured workflows for building software with the MDLC methodology. Instead of free-form prompting, you get repeatable, battle-tested commands that connect directly to the MDLC platform:

- **Build faster** — `/research` scaffolds a complete project blueprint in minutes
- **Stay on methodology** — `/kernel` pulls the right MDLC docs into your conversation
- **Ship confidently** — `/deploy` runs pre-flight checks before deploying
- **Scan for vulnerabilities** — `/cyberops` launches security scans without leaving your terminal
- **Design with expertise** — `/architect`, `/edge-expert`, `/supabase` bring domain knowledge into every decision

## Core Skills

| Skill | Tier | Description |
|-------|------|-------------|
| `/mdlc-init` | FREE | Bootstrap MCP gateway connection and validate API key |
| `/research` | FREE | Generate RESEARCH.md blueprints using the MDLC wizard |
| `/kernel` | FREE | Search and retrieve MDLC kernel documentation |
| `/deploy` | FREE | Deploy Cloudflare Workers with pre-flight checks |
| `/cyberops` | SOLO+ | Launch and monitor CyberOps security scans |
| `/report` | SOLO+ | Generate PDF reports from scan findings |

## Expert Skills

| Skill | Tier | Description |
|-------|------|-------------|
| `/architect` | FREE | System architecture from RESEARCH.md using MDLC BUILD.md methodology |
| `/mcp-builder` | SOLO+ | Build custom MCP servers — scaffolding, auth, tool definitions |
| `/edge-expert` | FREE | Cloudflare Workers patterns — KV, R2, Durable Objects, caching, queues |
| `/secure-code` | FREE | Secure coding review — OWASP top 10, auth patterns, input validation |
| `/supabase` | FREE | Database schema design, RLS policies, migrations, edge functions |
| `/test` | FREE | Generate tests following MDLC quality gates — unit, integration, API |
| `/optimize` | SOLO+ | Performance audit — bundle size, cold starts, edge caching, query tuning |
| `/migrate` | SOLO+ | Database migrations, API versioning, zero-downtime deploys |

## Commands

```bash
npx @mdlc/claude-skills install              # Install all 14 skills
npx @mdlc/claude-skills install research      # Install a specific skill
npx @mdlc/claude-skills install architect     # Install an expert skill
npx @mdlc/claude-skills update                # Update all skills to latest
npx @mdlc/claude-skills list                  # List available skills
```

## Setup

1. **Get an API key** at [mdlc.ai/dashboard](https://mdlc.ai/dashboard/dashboard.html)
2. **Install skills:**
   ```bash
   npx @mdlc/claude-skills install
   ```
3. **Restart Claude Code** (skills are loaded at startup)
4. **Run `/mdlc-init`** and enter your API key — it configures the MCP gateway connection automatically
5. **Start building:** `/research`, `/kernel`, `/deploy`, `/architect`, etc.

## MCP Gateway Integration

Skills can also be fetched directly from the MDLC MCP Gateway (`mcp.mdlc.ai`) using the `get_skills` tool. This returns the latest skill definitions for your subscription tier, so you always have up-to-date commands even without reinstalling the npm package.

## Subscription Tiers

| Tier | Price | Skills | CyberOps |
|------|-------|--------|----------|
| FREE | $0/mo | 9 skills (core + free expert) | -- |
| SOLO | $49/mo | All 14 skills | RECON (50 targets) |
| TEAM | $199/mo | All 14 skills | RECON (50 targets) |
| ENTERPRISE | $799+/mo | All 14 skills | SENTINEL (500 targets) |

[Subscribe at mdlc.ai](https://mdlc.ai/#pricing)

## License

MIT
