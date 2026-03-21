---
name: migrate
description: Database migrations, API versioning, zero-downtime deploys, data transformations
user-invocable: true
---

# /migrate — Migration Expert

Handle database migrations, API versioning, data transformations, and zero-downtime deployments.

## Instructions

### Mode Selection
Ask the user what they need:
1. **Database Migration** — Schema changes (add/alter/drop)
2. **Data Migration** — Transform or backfill existing data
3. **API Version** — Version an API without breaking clients
4. **KV/R2 Migration** — Migrate data between storage systems
5. **Zero-Downtime Deploy** — Deploy breaking changes safely

### Database Migration

**Migration file convention:**
```
sql/
  001_initial_schema.sql
  002_add_api_keys.sql
  003_add_cyberops_tables.sql
  004_your_migration.sql     <-- new
```

**Safe migration template:**
```sql
-- Migration: {description}
-- Date: {YYYY-MM-DD}
-- Author: {name}

BEGIN;

-- Forward migration
{SQL statements}

-- Verify
DO $$
BEGIN
  -- Assert the migration worked
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'x' AND column_name = 'y') THEN
    RAISE EXCEPTION 'Migration verification failed';
  END IF;
END $$;

COMMIT;
```

**Safe operations** (no downtime):
- `CREATE TABLE IF NOT EXISTS` — always safe
- `ALTER TABLE ADD COLUMN` — safe, nullable or with default
- `CREATE INDEX CONCURRENTLY` — doesn't lock the table
- `ADD CONSTRAINT ... NOT VALID` then `VALIDATE CONSTRAINT` — two-step

**Dangerous operations** (require planning):
- `DROP TABLE` / `DROP COLUMN` — data loss, check no code references first
- `ALTER COLUMN TYPE` — rewrites table, locks it
- `ADD COLUMN ... NOT NULL` without default — fails if rows exist
- `CREATE INDEX` without `CONCURRENTLY` — locks table for writes

### Data Migration

**Backfill pattern** (for adding a new required column):
```sql
-- Step 1: Add nullable column
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Step 2: Backfill from existing data
UPDATE users SET display_name = split_part(email, '@', 1)
WHERE display_name IS NULL;

-- Step 3: Make non-null (only after backfill complete)
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;
```

**Batch processing** (for large tables):
```sql
-- Process in chunks to avoid long locks
DO $$
DECLARE
  batch_size INT := 1000;
  processed INT := 0;
BEGIN
  LOOP
    UPDATE my_table
    SET new_column = compute_value(old_column)
    WHERE id IN (
      SELECT id FROM my_table
      WHERE new_column IS NULL
      LIMIT batch_size
    );
    GET DIAGNOSTICS processed = ROW_COUNT;
    EXIT WHEN processed = 0;
    PERFORM pg_sleep(0.1); -- Breathe between batches
  END LOOP;
END $$;
```

### KV Migration

**Key format change:**
```javascript
// Migrate from old key format to new
async function migrateKVKeys(env) {
  let cursor;
  do {
    const list = await env.OLD_KV.list({ cursor, limit: 100 });
    for (const key of list.keys) {
      const value = await env.OLD_KV.get(key.name);
      const newKey = transformKey(key.name); // your mapping logic
      await env.NEW_KV.put(newKey, value);
    }
    cursor = list.cursor;
  } while (cursor);
}
```

### API Versioning

**URL-based versioning** (recommended for breaking changes):
```javascript
if (pathname.startsWith('/v2/')) return handleV2(request, env);
if (pathname.startsWith('/v1/') || pathname.startsWith('/api/'))
  return handleV1(request, env); // backward compat
```

**Header-based versioning** (for minor changes):
```javascript
const version = request.headers.get('X-API-Version') || '1';
```

### Zero-Downtime Deploy Strategy

1. **Expand** — Add new code/columns/routes alongside old ones
2. **Migrate** — Move data/traffic to new format
3. **Contract** — Remove old code/columns/routes after migration is confirmed

**Example: Renaming an API field**
```
Phase 1 (deploy): Return both { name, display_name } in responses
Phase 2 (wait):   Monitor logs for clients using old field
Phase 3 (deploy): Accept both fields in requests, prefer new
Phase 4 (deploy): Remove old field from response (after client migration)
```

### Rollback Plan
Every migration should have a rollback:
```sql
-- Rollback: {description}
BEGIN;
{reverse SQL statements}
COMMIT;
```

For KV/R2 migrations, keep old data for 7 days before cleanup.
