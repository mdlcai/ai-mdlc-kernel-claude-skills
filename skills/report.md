---
name: report
description: Generate and download a PDF security report for a completed CyberOps scan
user-invocable: true
---

# /report — Generate CyberOps PDF Report

Generate and download a PDF security report for a completed CyberOps scan.

## Prerequisites
- Requires SOLO tier or higher
- API key must be configured (run /mdlc-init first)
- Read the API key from `.claude/settings.local.json` under `mcpServers.mdlc-gateway.headers.Authorization`

## Instructions

### Workflow

1. **List completed scans**: Fetch recent scans and show only those with status "completed":
   ```bash
   curl -s https://cyberops.mdlc.ai/scans -H "Authorization: Bearer <KEY>"
   ```
   Present as a numbered list showing: scan type, target, date, finding count.

2. **User selects a scan**: Ask which scan to generate a report for.

3. **Export findings**: Download the scan results:
   ```bash
   # CSV export of findings
   curl -s "https://cyberops.mdlc.ai/findings/export?scan_id=<scan_id>&format=csv" \
     -H "Authorization: Bearer <KEY>" -o findings.csv

   # Full scan results export
   curl -s "https://cyberops.mdlc.ai/scans/<scan_id>/export" \
     -H "Authorization: Bearer <KEY>" -o scan_report.json
   ```

4. **Generate PDF**: Use the scan data to create a PDF report. If the platform provides a PDF endpoint, use it:
   ```bash
   curl -s "https://cyberops.mdlc.ai/scans/<scan_id>/export?format=pdf" \
     -H "Authorization: Bearer <KEY>" -o report.pdf
   ```

5. **Compile local report**: If PDF generation isn't available via API, create a markdown report locally with:
   - Executive summary (total findings by severity)
   - Scan metadata (target, type, duration, date)
   - Findings table (severity, title, CVSS, CVE, status)
   - Remediation playbook (grouped by severity, actionable steps)
   - Save as `cyberops-report-<scan_id>.md` in the current directory

6. **Report location**: Tell the user where the report was saved and summarize key findings:
   - Total findings count
   - Critical/High findings that need immediate attention
   - Top remediation priorities
