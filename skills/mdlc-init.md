---
name: mdlc-init
description: Bootstrap MDLC MCP Gateway connection — validates API key, configures MCP server, reports tier
user-invocable: true
---

# /mdlc-init — Bootstrap MDLC Gateway Connection

Set up Claude Code to work with the MDLC MCP Gateway (mcp.mdlc.ai).

## Steps

1. **Get API Key**: Ask the user for their MDLC API key (starts with `mdlc_`). If they don't have one, direct them to https://mdlc.ai/dashboard/dashboard.html to generate one.

2. **Validate Key**: Use curl to validate the key against the API:
   ```
   curl -s -H "Authorization: Bearer <KEY>" https://api.mdlc.ai/api/keys
   ```
   If the response includes keys, the key is valid. Extract the user's tier from the response.

3. **Configure MCP Server**: Add the MDLC MCP Gateway to `.claude/settings.local.json` in the project root. The MCP server configuration should be:
   ```json
   {
     "mcpServers": {
       "mdlc-gateway": {
         "type": "url",
         "url": "https://mcp.mdlc.ai/mcp",
         "headers": {
           "Authorization": "Bearer <API_KEY>"
         }
       }
     }
   }
   ```
   Merge this into the existing settings file — do not overwrite other settings.

4. **Verify Connection**: Test the MCP connection by calling the `list_files` tool through the gateway to confirm it responds.

5. **Report Status**: Tell the user:
   - Their tier (FREE/SOLO/TEAM/ENTERPRISE)
   - Available MCP tools for their tier:
     - FREE: list_files, get_file, get_project_file
     - SOLO: + search_files
     - TEAM: + get_directory
     - ENTERPRISE: + get_repo_zip
   - Available skills: /research, /kernel, /deploy, /cyberops (SOLO+), /report (SOLO+)
