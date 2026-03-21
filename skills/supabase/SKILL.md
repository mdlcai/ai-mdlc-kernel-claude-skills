---
name: supabase
description: Supabase expert — schema design, RLS policies, migrations, edge functions, auth patterns
user-invocable: true
---

# /supabase — Supabase Database Expert

Expert guidance on Supabase (PostgreSQL), schema design, Row Level Security, migrations, and integration with Cloudflare Workers.

## Instructions

### Mode Selection
Ask the user what they need:
1. **Schema** — Design tables and relationships
2. **RLS** — Create Row Level Security policies
3. **Migration** — Write SQL migrations
4. **Query** — Help with complex queries
5. **Auth** — Authentication integration patterns

### Schema Design Principles
- Use UUIDs for primary keys (`gen_random_uuid()`)
- Always add `created_at` and `updated_at` timestamps
- Use `user_id` foreign key for user-owned resources
- Prefer `text` over `varchar` (PostgreSQL has no performance difference)
- Use `jsonb` for flexible metadata columns
- Add indexes on foreign keys and frequently queried columns

**Standard table template:**
```sql
CREATE TABLE IF NOT EXISTS my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- your columns here
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_my_table_user_id ON my_table(user_id);

ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
```

### Row Level Security (RLS)
**Always enable RLS on every table.** Without it, the service key bypasses all access control.

**User isolation pattern** (most common):
```sql
-- Users can only see their own rows
CREATE POLICY "Users read own data"
  ON my_table FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own rows
CREATE POLICY "Users insert own data"
  ON my_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "Users update own data"
  ON my_table FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "Users delete own data"
  ON my_table FOR DELETE
  USING (auth.uid() = user_id);
```

**Service key bypass**: The `service_role` key bypasses RLS. Use it only in server-side Workers, never in client code.

**Tier-based access**:
```sql
CREATE POLICY "Premium features"
  ON premium_table FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.tier IN ('solo', 'team', 'enterprise')
    )
  );
```

### Cloudflare Workers Integration
```typescript
import { createClient } from '@supabase/supabase-js';

// In your Worker handler:
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

// Query with service key (bypasses RLS — validate auth yourself)
const { data, error } = await supabase
  .from('my_table')
  .select('*')
  .eq('user_id', auth.userId)
  .order('created_at', { ascending: false });
```

### Migration Best Practices
- One migration file per change: `001_create_users.sql`, `002_add_api_keys.sql`
- Always include `IF NOT EXISTS` / `IF EXISTS` for idempotency
- Never drop columns in production without a deprecation period
- Use transactions for multi-statement migrations
- Test migrations against a staging database first

### Common Query Patterns

**Pagination:**
```sql
SELECT * FROM my_table
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
```

**Aggregation with filters:**
```sql
SELECT
  severity,
  COUNT(*) as count
FROM findings
WHERE user_id = $1 AND status = 'open'
GROUP BY severity
ORDER BY
  CASE severity
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
    ELSE 5
  END;
```

**Upsert:**
```sql
INSERT INTO profiles (id, email, tier)
VALUES ($1, $2, $3)
ON CONFLICT (id)
DO UPDATE SET tier = EXCLUDED.tier, updated_at = now();
```

### Anti-Patterns
- Don't use the `anon` key with RLS disabled — full database exposed
- Don't store the service key in client-side code
- Don't use `SELECT *` in production — specify columns
- Don't skip RLS on any table, even "internal" ones
- Don't use raw SQL string concatenation — always parameterize
