---
name: optimize
description: Performance audit — bundle size, cold starts, edge caching, rate limiting, database queries
user-invocable: true
---

# /optimize — Performance Optimization Expert

Audit and optimize performance for edge-first applications on Cloudflare Workers.

## Instructions

### Mode Selection
Ask the user what to optimize:
1. **Worker Performance** — CPU time, cold starts, bundle size
2. **Caching** — Edge caching, KV caching, stale-while-revalidate
3. **Database** — Query optimization, connection pooling, N+1 problems
4. **API Response Time** — Reduce latency, parallel requests, streaming
5. **Full Audit** — All of the above

### Worker Performance

**Bundle Size** (smaller = faster cold starts):
- Check with: `wrangler deploy --dry-run --outdir dist && ls -la dist/`
- Target: <1MB for fast cold starts
- Remove unused imports and dead code
- Use tree-shakeable imports: `import { specific } from 'lib'` not `import * as lib`
- Avoid large dependencies — consider inlining small utilities

**CPU Time Optimization:**
- Use `crypto.subtle` instead of JS crypto libraries (hardware-accelerated)
- Avoid `JSON.parse` on large payloads — stream when possible
- Use `Promise.all()` for independent async operations
- Avoid regex backtracking on user input — use simple string methods

**Subrequest Optimization:**
- Max 50 subrequests per invocation (paid plan)
- Batch KV reads: single `list()` instead of multiple `get()` calls
- Cache external API responses in KV with TTL
- Use `Promise.all()` for parallel subrequests

### Caching Strategies

**Edge Cache (Cache API):**
```javascript
async function handleWithCache(request, env) {
  const cache = caches.default;
  let response = await cache.match(request);
  if (response) return response;

  response = await handleRequest(request, env);

  // Cache successful responses for 5 minutes
  if (response.ok) {
    const cached = new Response(response.body, response);
    cached.headers.set('Cache-Control', 'public, max-age=300');
    event.waitUntil(cache.put(request, cached.clone()));
  }
  return response;
}
```

**KV as Cache (stale-while-revalidate):**
```javascript
async function getCached(env, key, fetchFn, ttlSeconds = 300) {
  const cached = await env.CACHE_KV.get(key, { type: 'json' });
  if (cached) return cached;

  const fresh = await fetchFn();
  await env.CACHE_KV.put(key, JSON.stringify(fresh), { expirationTtl: ttlSeconds });
  return fresh;
}
```

**cf Object Caching (subrequest caching):**
```javascript
const response = await fetch(apiUrl, {
  cf: { cacheTtl: 300, cacheEverything: true }
});
```

### Database Optimization

**N+1 Problem:**
```sql
-- BAD: N+1 queries
SELECT * FROM scans WHERE user_id = $1;
-- Then for each scan: SELECT * FROM findings WHERE scan_id = $scanId;

-- GOOD: Single query with join
SELECT s.*, f.severity, f.title
FROM scans s
LEFT JOIN findings f ON f.scan_id = s.id
WHERE s.user_id = $1;
```

**Index Strategy:**
- Always index: foreign keys, `WHERE` clause columns, `ORDER BY` columns
- Composite indexes for multi-column queries: `CREATE INDEX idx ON t(user_id, created_at DESC)`
- Partial indexes for filtered queries: `CREATE INDEX idx ON findings(scan_id) WHERE status = 'open'`

**Connection Management:**
- Supabase client: create once per request, not per query
- Use connection pooling (Supabase has built-in PgBouncer)
- Keep queries simple — complex joins are slower than two simple queries on edge

### API Response Time

**Parallel Requests:**
```javascript
// BAD: Sequential
const user = await getUser(id);
const projects = await getProjects(id);
const keys = await getKeys(id);

// GOOD: Parallel
const [user, projects, keys] = await Promise.all([
  getUser(id),
  getProjects(id),
  getKeys(id),
]);
```

**Early Returns:**
```javascript
// Return 401 before doing any work
if (!auth) return new Response('Unauthorized', { status: 401 });
// Return 400 before hitting the database
if (!body.name) return new Response('Name required', { status: 400 });
```

**Streaming Responses** (for large payloads):
```javascript
const { readable, writable } = new TransformStream();
// Start sending immediately while still processing
```

### Audit Output Format
```
## Performance Audit Summary

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Bundle size | X KB | <500 KB | OK/WARN |
| Cold start | X ms | <50 ms | OK/WARN |
| P50 latency | X ms | <100 ms | OK/WARN |
| Subrequests | X/req | <10/req | OK/WARN |

## Findings
1. [SEVERITY] Finding description
   Fix: ...
```
