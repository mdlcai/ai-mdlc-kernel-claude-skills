---
name: test
description: Generate tests following MDLC quality gates — unit, integration, API, edge cases
user-invocable: true
---

# /test — MDLC Test Generator

Generate tests following MDLC BUILD.md quality gates. Covers unit tests, integration tests, API tests, and edge cases.

## Instructions

### Step 1: Identify Test Target
Ask the user:
- What file/function/endpoint to test?
- What testing framework? (Vitest recommended for CF Workers, Jest for Node.js)
- Unit tests, integration tests, or both?

### Step 2: Analyze the Code
Read the target code and identify:
- Public API surface (exported functions, route handlers)
- Input parameters and their types
- Expected outputs and side effects
- Error conditions and edge cases
- External dependencies that need mocking (KV, R2, Supabase, fetch)

### Step 3: Generate Tests

**Test file naming**: `{filename}.test.ts` next to the source file.

**Test structure**:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('functionName', () => {
  // Happy path
  it('should return expected result for valid input', () => {});

  // Edge cases
  it('should handle empty input', () => {});
  it('should handle null/undefined', () => {});

  // Error cases
  it('should throw for invalid input', () => {});
  it('should return 401 for unauthenticated requests', () => {});

  // Boundary conditions
  it('should handle maximum allowed input size', () => {});
  it('should respect rate limits', () => {});
});
```

### Cloudflare Worker Test Patterns

**Mock KV:**
```typescript
const mockKV = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  list: vi.fn(),
};
```

**Mock R2:**
```typescript
const mockR2 = {
  get: vi.fn().mockResolvedValue({
    text: () => Promise.resolve('content'),
    json: () => Promise.resolve({}),
  }),
  put: vi.fn(),
  list: vi.fn().mockResolvedValue({ objects: [], truncated: false }),
};
```

**Mock fetch (external APIs):**
```typescript
global.fetch = vi.fn().mockResolvedValue(
  new Response(JSON.stringify({ data: 'mocked' }), {
    headers: { 'Content-Type': 'application/json' },
  })
);
```

**Test a Worker handler:**
```typescript
it('should return 200 for valid request', async () => {
  const request = new Request('https://example.com/api/endpoint', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer mdlc_test', 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' }),
  });
  const env = { USERS_KV: mockKV, SUPABASE_URL: 'https://test.supabase.co' };
  const response = await worker.fetch(request, env);
  expect(response.status).toBe(200);
});
```

### MDLC Quality Gates
Following BUILD.md methodology:
1. **Gate 1 — Unit Tests**: Every exported function has at least happy path + error case tests
2. **Gate 2 — Integration Tests**: API endpoints tested with mocked bindings
3. **Gate 3 — Auth Tests**: Every protected endpoint tested with no auth, invalid auth, and valid auth
4. **Gate 4 — Edge Cases**: Empty input, max size, special characters, concurrent access

### Test Coverage Targets
- Functions: 100% of exported functions covered
- Branches: Auth checks, tier gates, error paths
- API routes: Every route tested for correct method + auth
- Security: Input validation, path traversal, injection attempts
