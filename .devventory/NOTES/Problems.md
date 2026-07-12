# Problems

> Known problems in the current implementation. Some are deliberate shortcuts, others are bugs.

---

## Architecture

- **Prisma `ApiKey.key` type mismatch**: The generated Prisma client doesn't recognize the `key` field on `ApiKey` model. Cast `as any` in two places. Likely a Prisma 7.8.0 codegen bug.
- **Folder model not migrated**: `Folder` model was added to schema but no migration has been created. Works locally but will break on Vercel deploy.
- **Server action revalidation paths**: Many actions still reference old URLs like `/resources`, `/notes`. These should be `/knowledge` now. They revalidate paths that no longer exist (no-op, but messy).

## Features

- **Note creation fails**: "Foreign key constraint violated on Note_userId_fkey" — occurs after DB reset. User session references a user ID that doesn't exist in the DB. Workaround: sign out and sign in again.
- **Registration on Vercel**: Neon database unreachable from Vercel region. Blocks new user signups.
- **No archive/trash**: Delete is permanent. Users have accidentally lost data.

## UX

- **Folder tree doesn't persist drag-target items**: `onDropItem` works but the folder tree refreshes from server, losing the visual drag state.
- **No keyboard navigation in folder tree**: Arrow keys, enter, escape not implemented.
- **Cmd+K search is case-sensitive** (depending on DB collation): Mixed results cross-platform.
- **No loading states on Knowledge page**: The page fetches data but has no skeleton fallback for the list.

## Performance

- **Knowledge page loads ALL resources**: Even with pagination, initial load fetches 50 items. With 1000+ items this will be slow.
- **No resource caching**: Client navigates away and back, re-fetches everything.
- **Extension AI enrichment is synchronous**: User waits for AI before seeing their saved reference. Should be async.

## Design Debt

- **`globals.css` has unused animations**: `animate-dash-flow`, `animate-glow-pulse`, `animate-float`, `animate-icon-glow` — not used anywhere but kept for reference.
- **`framer-motion` variants in `lib/motion.ts`**: Some variants may be over-engineered for MVP needs.
- **Multiple component directories**: Resources, knowledge, projects, shared — some overlap (e.g., both knowledge-workspace and resource-list manage resource display).
