# /kernel — Query MDLC Kernel Documentation

Search and retrieve documentation from the MDLC kernel via the MCP gateway.

## Instructions

Use the MDLC MCP Gateway tools to find and present kernel documentation. The gateway must be configured first (run /mdlc-init if not set up).

### Available MCP Tools
Use the `mdlc-gateway` MCP server tools:
- **list_files**: List files/directories in the kernel repo. Pass `path` to browse subdirectories.
- **get_file**: Read a specific file by path. Pass `path` (e.g., "MDLC/overview.md").
- **search_files**: Search by keyword. Pass `query` to find files by name or content.
- **get_directory**: (TEAM+) Get all file paths recursively.
- **get_repo_zip**: (ENTERPRISE) Download the full kernel archive.

### Workflow

1. If the user asks about a specific topic, use `search_files` to find relevant docs
2. If browsing, start with `list_files` at the root to show the kernel structure
3. Use `get_file` to retrieve and display the content of relevant documents
4. Present the documentation clearly, highlighting key concepts and actionable guidance
5. If the user's tier doesn't support a needed tool, let them know which tier unlocks it

### Context
The MDLC kernel contains the Markdown Development Lifecycle methodology — structured approaches for AI-assisted software development including project blueprints, development phases, quality gates, and deployment patterns. The kernel is tiered:
- **FREE**: Basic methodology overview
- **SOLO**: Extended guides + solo developer patterns
- **TEAM**: Team collaboration patterns + advanced workflows
- **ENTERPRISE**: Full kernel including governance, compliance, and scale patterns

When presenting docs, focus on what's actionable for the user's current task. Don't just dump raw markdown — synthesize and explain.
