---
name: research
description: Generate a structured RESEARCH.md blueprint following the MDLC methodology
user-invocable: true
---

# /research — RESEARCH.md Blueprint Generator

Generate a structured RESEARCH.md blueprint following the MDLC methodology.

## Instructions

Walk the user through the MDLC blueprint wizard step by step. Ask one section at a time, then compile the final RESEARCH.md.

### Step 1: Project Identity
Ask the user:
- **Project Name**: What is this project called?
- **Vision Statement**: In 1-2 sentences, what does this project do and why does it matter?

### Step 2: Users & Personas
Ask the user:
- **Target Users**: Who will use this? (e.g., developers, end-users, admins)
- **Key Personas**: Describe 2-3 user personas with their goals and pain points

### Step 3: Technical Foundation
Ask the user:
- **Tech Stack**: What languages, frameworks, and services will this use?
- **Architecture**: Monolith, microservices, serverless, etc.?
- **Data Storage**: What databases or storage systems?
- **External Integrations**: Any APIs, services, or third-party tools?

### Step 4: Design & Scope
Ask the user:
- **Core Features**: List the MVP features (numbered)
- **Non-Goals**: What is explicitly out of scope?
- **Design Principles**: What principles guide technical decisions? (e.g., simplicity over flexibility, security-first)

### Step 5: Compile RESEARCH.md

After gathering all inputs, generate the RESEARCH.md file with this structure:

```markdown
# RESEARCH.md — {Project Name}

## Vision
{Vision statement}

## Users & Personas
{Personas with goals and pain points}

## Technical Architecture
- **Stack**: {tech stack}
- **Architecture**: {pattern}
- **Storage**: {databases}
- **Integrations**: {external services}

## Features (MVP)
1. {Feature 1}
2. {Feature 2}
...

## Non-Goals
- {Non-goal 1}
- {Non-goal 2}

## Design Principles
- {Principle 1}
- {Principle 2}
```

### Step 6: Save & Optionally Push

1. Write the RESEARCH.md to the project root
2. Ask the user if they want to push it to MDLC cloud storage. If yes, use curl:
   ```
   curl -s -X POST https://api.mdlc.ai/api/projects \
     -H "Authorization: Bearer <API_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"name": "<project_name>", "research": "<research_content>"}'
   ```
   The API key should be read from the MCP server config in `.claude/settings.local.json` under `mcpServers.mdlc-gateway.headers.Authorization`.
