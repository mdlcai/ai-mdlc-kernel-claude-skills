---
name: cyberops
description: Launch and monitor CyberOps security scans from Claude Code
user-invocable: true
---

# /cyberops — Security Scan Launcher

Launch and monitor CyberOps security scans from Claude Code.

## Prerequisites
- Requires SOLO tier or higher (RECON access)
- API key must be configured (run /mdlc-init first)
- Read the API key from `.claude/settings.local.json` under `mcpServers.mdlc-gateway.headers.Authorization`

## Instructions

### Available Actions
Ask the user what they want to do:

1. **Add Target** — Register a domain/IP/subnet for scanning
2. **List Targets** — Show registered scan targets
3. **Run Scan** — Launch a security scan against a target
4. **View Results** — Check scan status and findings
5. **Overview** — Dashboard stats (total targets, scans, findings by severity)

### API Base
All requests go to `https://cyberops.mdlc.ai` with header `Authorization: Bearer <API_KEY>`.

### 1. Add Target
```bash
curl -s -X POST https://cyberops.mdlc.ai/targets \
  -H "Authorization: Bearer <KEY>" \
  -H "Content-Type: application/json" \
  -d '{"type": "domain|ip|subnet", "value": "<target>", "label": "<friendly name>"}'
```
- `type`: "domain" (e.g., example.com), "ip" (e.g., 192.168.1.1), or "subnet" (e.g., 10.0.0.0/24)
- Target must be verified before scanning. After adding, initiate verification:
```bash
curl -s -X POST https://cyberops.mdlc.ai/targets/<id>/verify \
  -H "Authorization: Bearer <KEY>"
```

### 2. List Targets
```bash
curl -s https://cyberops.mdlc.ai/targets -H "Authorization: Bearer <KEY>"
```

### 3. Run Scan
```bash
curl -s -X POST https://cyberops.mdlc.ai/scans \
  -H "Authorization: Bearer <KEY>" \
  -H "Content-Type: application/json" \
  -d '{"target_id": "<target_id>", "scan_type": "<type>"}'
```
Scan types:
- `port_scan` — TCP port discovery
- `service_detect` — Service/version detection
- `ssl_tls` — SSL/TLS certificate and configuration analysis
- `dns_enum` — DNS enumeration
- `dependency_audit` — Known vulnerability check (CVE database)
- `full` — All scan types combined

### 4. View Results
Check scan status:
```bash
curl -s https://cyberops.mdlc.ai/scans/<scan_id> -H "Authorization: Bearer <KEY>"
```
List findings:
```bash
curl -s "https://cyberops.mdlc.ai/findings?scan_id=<scan_id>" -H "Authorization: Bearer <KEY>"
```

### 5. Overview
```bash
curl -s https://cyberops.mdlc.ai/overview -H "Authorization: Bearer <KEY>"
```

### Result Presentation
When showing findings, format them clearly:
- Group by severity (CRITICAL > HIGH > MEDIUM > LOW > INFO)
- Show CVSS score, CVE ID (if applicable), title, and remediation
- Highlight critical/high findings prominently
- Summarize total counts by severity

### Tier Limits
- **RECON** (SOLO/TEAM): 50 targets, 3 concurrent scans
- **SENTINEL** (ENTERPRISE): 500 targets, 10 concurrent scans
