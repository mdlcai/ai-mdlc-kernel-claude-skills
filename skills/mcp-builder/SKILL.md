---
name: mcp-builder
description: Build custom MCP servers and tools — scaffolding, transport, authentication, tool definitions
user-invocable: true
---

# /mcp-builder — MCP Server Builder

Build custom Model Context Protocol (MCP) servers that AI agents can connect to.

## Instructions

### Step 1: Scope the MCP Server
Ask the user:
- **What data/service** does this MCP server expose? (e.g., internal docs, database, API, file system)
- **Who consumes it?** (Claude Code, Claude Desktop, other AI clients)
- **Auth model?** API key, OAuth, or open?
- **Transport?** HTTP (streamable, recommended) or stdio (local only)

### Step 2: Choose the Runtime
- **Cloudflare Workers** (recommended for HTTP transport) — globally distributed, zero cold starts
- **Node.js** — for stdio transport or complex server requirements
- **Python** — for data-heavy or ML-adjacent servers

### Step 3: Scaffold the Server

For a Cloudflare Worker MCP server, generate:

```
my-mcp-server/
  src/
    index.js          # Router + MCP handler
  wrangler.toml       # CF Worker config
  package.json
```

The MCP handler must implement these JSON-RPC methods:
- `initialize` — return protocol version, capabilities, server info
- `tools/list` — return tool definitions (filtered by auth tier if applicable)
- `tools/call` — execute a tool and return content

### Step 4: Define Tools
For each tool the user wants:
1. **Name**: lowercase, underscore-separated (e.g., `search_docs`)
2. **Description**: clear, concise — this is what AI agents see
3. **Input Schema**: JSON Schema for parameters
4. **Implementation**: the actual logic

Tool response format:
```json
{
  "content": [
    { "type": "text", "text": "result here" }
  ]
}
```

### Step 5: Authentication Pattern
If auth is needed, implement the Bearer token pattern:
```javascript
async function resolveAuth(request, env) {
  const header = request.headers.get('Authorization') || '';
  const key = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!key) return null;
  // Validate against your auth store (KV, database, etc.)
  const record = await env.USERS_KV.get(`apikey:${keyHash}`);
  return record ? JSON.parse(record) : null;
}
```

### Step 6: Client Configuration
Generate the connection config for each client:

**Claude Code** (`.mcp.json`):
```json
{
  "mcpServers": {
    "my-server": {
      "type": "url",
      "url": "https://my-server.example.com/mcp",
      "headers": { "Authorization": "Bearer <key>" }
    }
  }
}
```

**Claude Code CLI**:
```bash
claude mcp add --transport http my-server https://my-server.example.com/mcp \
  --header "Authorization: Bearer <key>"
```

### MCP Protocol Reference
- Protocol version: `2024-11-05`
- JSON-RPC 2.0 over HTTP POST
- Notifications (no `id` field) should return 202
- Batch requests (array body) must be supported
- CORS headers required for browser-based clients
- Content types: `text`, `image`, `resource` (text is most common)

### Best Practices
- Always validate and sanitize tool inputs (path traversal, injection)
- Return helpful error messages in MCP error format: `{ code, message }`
- Use tier-based tool filtering for freemium models
- Cache GitHub/external API calls to stay under rate limits
- Keep tool count reasonable (6-12 tools max for discoverability)
