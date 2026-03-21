---
name: edge-expert
description: Cloudflare Workers expert — KV, R2, Durable Objects, caching, queues, edge-first patterns
user-invocable: true
---

# /edge-expert — Cloudflare Edge Computing Expert

Expert guidance on building with Cloudflare Workers, KV, R2, Durable Objects, Queues, and edge-first architecture.

## Instructions

When the user asks about edge computing, Cloudflare Workers, or any of the bindings below, provide expert-level guidance with production-ready code patterns.

### Core Knowledge Areas

#### Workers Runtime
- V8 isolate model — no Node.js, but `nodejs_compat` flag bridges most gaps
- 128MB memory limit, 30s CPU time (paid), 10ms CPU time (free)
- No filesystem — use KV/R2/DO for persistence
- `fetch` handler is the entry point; use URL pathname routing
- Environment bindings via `env` parameter (not `process.env`)

#### KV (Key-Value Store)
- Eventually consistent, read-optimized (cached at edge)
- Best for: config, sessions, API key lookups, feature flags
- NOT for: counters, frequent writes, transactions
- Pattern: `await env.MY_KV.get(key)` / `.put(key, value, { expirationTtl })`
- Metadata: `.getWithMetadata(key)` for storing extra info alongside values
- List keys: `.list({ prefix, limit, cursor })` for pagination

#### R2 (Object Storage)
- S3-compatible, zero egress fees
- Best for: files, documents, images, backups, large blobs
- Pattern: `await env.MY_BUCKET.get(key)` returns `R2Object` with `.text()`, `.json()`, `.arrayBuffer()`
- Upload: `.put(key, body, { httpMetadata, customMetadata })`
- List: `.list({ prefix, delimiter, cursor })`
- Multipart uploads for large files (>100MB)

#### Durable Objects
- Single-instance, strongly consistent, stateful
- Best for: counters, rate limiters, WebSocket rooms, coordination
- Each object has its own storage (`this.ctx.storage`)
- Accessed via stub: `env.MY_DO.get(env.MY_DO.idFromName('key'))`
- Alarm API for scheduled wake-ups

#### Queues
- Async message processing, at-least-once delivery
- Best for: background jobs, scan processing, email sending
- Producer: `await env.MY_QUEUE.send(message)`
- Consumer: `async queue(batch, env)` handler in worker

#### Caching Strategies
- **Cache API**: `caches.default.match(request)` / `.put(request, response)`
- **KV as cache**: fast reads, stale-while-revalidate pattern
- **cf object**: `fetch(url, { cf: { cacheTtl: 300 } })` for subrequest caching
- **Smart Placement**: `wrangler.toml` → `[placement] mode = "smart"` to run near origin

### Common Patterns

**Auth middleware:**
```javascript
async function requireAuth(request, env) {
  const key = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!key) return new Response('Unauthorized', { status: 401 });
  const user = await env.USERS_KV.get(`apikey:${await sha256(key)}`);
  return user ? JSON.parse(user) : null;
}
```

**Rate limiting with KV:**
```javascript
async function checkRate(env, key, limit, windowSec) {
  const now = Math.floor(Date.now() / 1000 / windowSec);
  const rateKey = `rate:${key}:${now}`;
  const count = parseInt(await env.KV.get(rateKey) || '0');
  if (count >= limit) return false;
  await env.KV.put(rateKey, String(count + 1), { expirationTtl: windowSec * 2 });
  return true;
}
```

**Multi-worker routing (wrangler.toml):**
```toml
routes = [
  { pattern = "api.example.com/*", zone_name = "example.com" },
]
```

### Anti-Patterns to Avoid
- Don't use KV for counters (race conditions) — use Durable Objects or Redis
- Don't store secrets in code — use `wrangler secret put`
- Don't block the event loop with synchronous crypto — use `crypto.subtle`
- Don't assume request ordering — Workers are stateless between requests
- Don't use `node:fs` — there's no filesystem; use R2 or KV
- Don't exceed 25 subrequests per invocation (paid plan limit)

### Debugging
- `wrangler dev` for local development with real bindings
- `wrangler tail` for production log streaming
- `console.log()` works but only visible in tail/dev
- Use `wrangler deploy --dry-run` to validate without deploying
