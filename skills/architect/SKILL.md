---
name: architect
description: System design from RESEARCH.md — generates architecture, service boundaries, data flow using MDLC methodology
user-invocable: true
---

# /architect — MDLC System Architecture Designer

Design system architecture from a RESEARCH.md blueprint following the MDLC BUILD.md and FLOW.md methodology.

## Instructions

### Step 1: Load the Blueprint
- Check if a RESEARCH.md exists in the current project root
- If connected to the MDLC MCP gateway, use `get_project_file` to fetch the RESEARCH.md
- If no RESEARCH.md exists, suggest running `/research` first
- Parse the vision, users, tech stack, features, and design principles

### Step 2: Architecture Analysis
Based on the RESEARCH.md, determine:
- **Pattern**: Monolith, microservices, serverless, edge-first, or hybrid
- **Services**: Break features into logical service boundaries
- **Data Flow**: How data moves between services, users, and external systems
- **Storage**: Which databases/stores for which data (PostgreSQL, KV, R2, Redis, etc.)
- **APIs**: REST, GraphQL, MCP, WebSocket — what connects what

### Step 3: Generate Architecture Document
Produce a structured architecture plan:

```markdown
# ARCHITECTURE.md — {Project Name}

## System Overview
{1-2 sentence summary of the architecture pattern and why}

## Service Map
{List each service with its responsibility, runtime, and connections}

## Data Architecture
- **Primary Store**: {database} — {what it stores}
- **Cache Layer**: {if needed} — {strategy}
- **Object Storage**: {if needed} — {what it stores}
- **Key-Value**: {if needed} — {what it stores}

## API Design
{Endpoint groups, auth strategy, rate limiting approach}

## Infrastructure
- **Runtime**: {Cloudflare Workers / Node.js / etc.}
- **CDN/Edge**: {static assets strategy}
- **CI/CD**: {deployment pipeline}

## Security Architecture
- **Authentication**: {method}
- **Authorization**: {model — RBAC, tier-based, etc.}
- **Data Protection**: {encryption, secrets management}

## Scale Considerations
- **Bottlenecks**: {anticipated}
- **Caching Strategy**: {what, where, TTL}
- **Rate Limiting**: {approach}
```

### Step 4: Review with User
- Present the architecture and ask for feedback
- Highlight trade-offs and alternatives considered
- Adjust based on user input
- Save ARCHITECTURE.md to the project root

### MDLC Methodology Notes
- Follow the BUILD.md phase gates: architecture review happens before implementation
- The FLOW.md pattern: RESEARCH -> ARCHITECTURE -> BUILD -> DEPLOY
- Prefer edge-first architecture when using Cloudflare
- Design for the tier system if building a SaaS (FREE/SOLO/TEAM/ENTERPRISE pattern)
- Keep services small and independently deployable
