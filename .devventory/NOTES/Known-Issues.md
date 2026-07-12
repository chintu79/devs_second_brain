# Known Issues

> Active bugs and problems affecting development or users.

---

## Critical

- **Registration fails on Vercel**: Neon database unreachable from Vercel region. No new users can register. Workaround: manually create users via database.
- **Note creation fails with `Note_userId_fkey`**: After database reset, session user ID doesn't exist in DB. Workaround: sign out and sign in again.

## High

- **Folder model not migrated**: `Folder` table doesn't exist in production (Vercel). Folders will crash on any environment without running the migration first.
- **Prisma `ApiKey.key` type mismatch**: Generated Prisma client doesn't include `key` field in `ApiKeySelect`. Workaround: `as any` casts. Root cause unknown.

## Medium

- **Server action revalidation paths**: Some actions still revalidate old paths (`/resources`, `/notes`, `/prompts`). No functional impact (no-op on non-existent routes), but should be cleaned up.
- **No loading states on Knowledge page**: Initial data fetch has no skeleton/loading fallback.

## Low

- **No keyboard navigation in folder tree**: Arrow keys, enter, escape not wired up.
- **Knowledge page loads all resources**: Initial fetch is 50 items, but could be optimized with virtual scrolling.
- **Extension AI enrichment blocks save response**: User waits for AI before seeing confirmation. Should be async.
