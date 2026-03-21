---
name: deploy
description: Deploy one or all MDLC Cloudflare Workers to production
user-invocable: true
---

# /deploy — Deploy MDLC Workers

Deploy one or all MDLC Cloudflare Workers to production.

## Instructions

The MDLC platform consists of 3 Cloudflare Workers. Ask the user which to deploy, or deploy all.

### Workers

| Worker | Config | Domain | Command |
|--------|--------|--------|---------|
| Website | `wrangler.toml` | mdlc.ai | `wrangler deploy --config wrangler.toml` |
| API | `api/wrangler.toml` | api.mdlc.ai | `cd api && wrangler deploy` |
| MCP Gateway | `wrangler-mcp.toml` | mcp.mdlc.ai | `wrangler deploy --config wrangler-mcp.toml` |
| CyberOps | `cyberops/wrangler.toml` | cyberops.mdlc.ai | `cd cyberops && wrangler deploy` |

### Workflow

1. **Ask target**: Which worker(s) to deploy? Options: `all`, `website`, `api`, `mcp`, `cyberops`

2. **Pre-flight checks** (run for each target):
   - For TypeScript workers (API, CyberOps): run `npx tsc --noEmit` in the worker directory to catch type errors
   - Check for uncommitted changes with `git status` — warn if working tree is dirty
   - Show the last commit message so the user confirms they're deploying the right code

3. **Deploy**: Run the wrangler deploy command for each target sequentially. Always deploy from the repo root using `--config` flags where possible, or `cd` into subdirectories for workers with their own wrangler.toml.

4. **Post-deploy verification**:
   - Website: `curl -s -o /dev/null -w "%{http_code}" https://mdlc.ai`
   - API: `curl -s https://api.mdlc.ai/api/docs | head -c 200`
   - MCP Gateway: `curl -s https://mcp.mdlc.ai/`
   - CyberOps: `curl -s https://cyberops.mdlc.ai/health`

5. **Report results**: Show deploy status (success/fail) and HTTP response codes for each worker.

### Important Notes
- Never deploy with `--dry-run` unless the user asks for it
- If a TypeScript check fails, stop and fix before deploying
- If one worker fails in an "all" deploy, continue with the others but report the failure
- The website worker serves static files — changes to HTML/CSS/JS in the root are deployed here
