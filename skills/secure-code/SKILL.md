---
name: secure-code
description: Secure coding review — OWASP top 10, auth patterns, input validation, secrets management
user-invocable: true
---

# /secure-code — Secure Code Review Expert

Review code for security vulnerabilities and provide fixes following OWASP top 10 and edge computing security best practices.

## Instructions

### Mode Selection
Ask the user what they need:
1. **Review** — Scan existing code for vulnerabilities
2. **Harden** — Add security to a specific feature
3. **Audit** — Full security audit of the project

### Review Mode
When reviewing code:

1. Read the files the user points to (or scan the project structure)
2. Check for each vulnerability category:

**A01 — Broken Access Control**
- Missing auth checks on routes
- Path traversal in file operations (check for `..` in user input)
- IDOR (insecure direct object references) — user A accessing user B's data
- Missing CORS restrictions
- Fix: Always validate ownership. Use `auth.email === resource.owner` patterns.

**A02 — Cryptographic Failures**
- API keys stored in plaintext (should be SHA-256 hashed)
- Secrets in code or environment (should use `wrangler secret put`)
- Weak hashing (MD5, SHA-1) for security purposes
- Missing HTTPS enforcement
- Fix: Use `crypto.subtle.digest('SHA-256', ...)` for hashing.

**A03 — Injection**
- SQL injection in Supabase queries (use parameterized queries, not string concat)
- Command injection in shell commands
- XSS in HTML responses (escape user input)
- Header injection via unsanitized input
- Fix: Always use parameterized queries: `.eq('id', userId)` not `.filter(\`id=\${userId}\`)`

**A04 — Insecure Design**
- Missing rate limiting on auth endpoints
- No account lockout after failed attempts
- Predictable resource IDs (use UUIDs, not sequential)
- Missing input validation at API boundaries

**A05 — Security Misconfiguration**
- Overly permissive CORS (`Access-Control-Allow-Origin: *` on auth endpoints)
- Debug mode in production
- Default credentials or invite codes
- Exposed error details in responses

**A06 — Vulnerable Components**
- Outdated dependencies with known CVEs
- Using `eval()` or `Function()` constructor
- Unvetted third-party scripts

**A07 — Auth Failures**
- Session tokens without expiration
- Missing session invalidation on logout
- API keys without revocation capability
- Weak password requirements

**A08 — Data Integrity**
- Missing CSRF protection on state-changing endpoints
- No webhook signature verification (Stripe, GitHub)
- Unsigned JWTs or missing JWT verification

**A09 — Logging Failures**
- No audit trail for admin actions
- Logging sensitive data (keys, passwords, PII)
- Missing rate limit logging

**A10 — SSRF**
- Fetching user-supplied URLs without validation
- DNS rebinding attacks
- Internal service exposure

### Edge Computing Specific
For Cloudflare Workers:
- **KV timing attacks**: Use constant-time comparison for auth tokens
- **R2 path traversal**: Sanitize all R2 key paths (strip `..`, normalize separators)
- **Worker secrets**: Never log `env` bindings; use `wrangler secret put` for all sensitive values
- **Subrequest limits**: DoS via triggering excessive subrequests

### Output Format
For each finding:
```
## [SEVERITY] Finding Title

**Location**: file:line
**Category**: OWASP A0X
**Risk**: What can an attacker do?
**Fix**:
\`\`\`javascript
// Before (vulnerable)
...
// After (fixed)
...
\`\`\`
```

Group findings by severity: CRITICAL > HIGH > MEDIUM > LOW > INFO.
Provide a summary count and top 3 remediation priorities.
