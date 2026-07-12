# Architecture Review — Devventory

> Date: 2026-07-10
> Scope: Monorepo structure, module boundaries, data flow, routing

---

## Current Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Monorepo Root                      │
│  pnpm-workspace.yaml · turbo.json · tsconfig.json    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  apps/                                                │
│  ├── web/          Next.js 16 · App Router · Prisma   │
│  │   ├── src/app/     Routes & API handlers           │
│  │   ├── src/actions/ Server Actions                  │
│  │   ├── src/components/ React components             │
│  │   ├── src/lib/       Utilities & shared logic      │
│  │   └── prisma/        Database schema               │
│  │                                                      │
│  └── extension/    WXT · Browser extension             │
│      ├── entrypoints/  Background & content scripts    │
│      ├── capture-engine/ Queue & sender                │
│      └── context-engine/ Metadata & UI                 │
│                                                       │
│  packages/                                             │
│  ├── ui/          @devventory/ui  (Base UI + CVA)     │
│  ├── motion/      @devventory/motion (Framer variants)│
│  ├── utils/       @devventory/utils (cn, format)      │
│  ├── types/       @devventory/types (zod schemas)     │
│  ├── shared/      @devventory/shared (Markdown, Empty)│
│  └── config/      @devventory/tsconfig (base tsconfig)│
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Routing Structure

```
/                    → Landing page (public)
/login               → Auth (credentials-only)
/register            → Auth
/knowledge           → Knowledge workspace (Dashboard layout)
/settings            → Preferences (Dashboard layout)
/api/auth/[...nextauth] → NextAuth handlers
/api/capture         → Capture API (ext auth)
/api/capture/[id]    → Capture status & retry
/api/ext             → Extension info
/api/ext/verify-key  → API key verification
```

### Data Flow

```
User Action → Server Action → Prisma → PostgreSQL
                ↓
          revalidatePath()
                ↓
          Server Component re-render → Client rehydration
```

---

## Module Boundary Analysis

### Good Boundaries

1. **Packages layer cleanly separated** — `@devventory/ui` has no dependency on web app
   internals. `@devventory/motion` is pure types/constants. `@devventory/utils` is
   pure functions. These are reusable by design.

2. **Server Actions as API layer** — All database mutations go through server actions
   in `src/actions/`. No direct `prisma` calls in components. This is the correct
   pattern for Next.js App Router.

3. **Reader Registry pattern** — `reader-registry.ts` provides a clean factory for
   rendering different reader types. Adding a new reader type requires only registering
   it in the registry.

4. **Component → Hook → Lib → Prisma** — The data flow direction is unidirectional:
   components call hooks, hooks call lib utilities, lib utilities call Prisma via
   server actions. No circular dependencies.

### Problematic Boundaries

1. **`capture-pipeline.ts` depends on `ai.ts` directly** — The capture pipeline
   imports `suggestTags`, `suggestCategory`, `summarizeContent` from `ai.ts`.
   If the AI provider changes, the capture pipeline must change. An AI service
   abstraction layer is missing.

2. **Server Actions duplicate auth checks** — Every server action starts with:
   ```ts
   const session = await auth();
   if (!session?.user?.id) return { error: "Not authenticated" };
   ```
   This is 3 lines × 11 files = 33 lines of boilerplate. A `withAuth` wrapper
   would eliminate duplication.

3. **Server/Client component boundary is blurred** — `knowledge-workspace.tsx`
   is a client component that receives `initialItems` from the server page.
   But it has its own `useState` for `overlayItem` and manages URL params via
   `useRouter`. The split between what's server-fetched and client-managed is
   unclear.

4. **Extension auth bridges two auth systems** — `apps/web/src/app/api/ext/auth.ts`
   checks session auth first, then falls back to API key auth. This is pragmatic
   but means API key auth only works for extension requests, not for web UI
   mutations.

---

## Component Hierarchy Issues

### Overly Large Components

| Component | Lines | Issue |
|-----------|-------|-------|
| `sidebar.tsx` | ~350 | Monolithic — renders sidebar, collections tree, tag list, all inline |
| `settings/page.tsx` | ~400 | Accent colors + API keys + preview settings in one file |
| `inline-editor.tsx` | ~200 | Toolbar rendering + editor setup + inline styles |
| `command-palette.tsx` | ~350 | All search types, collections, recent items in one component |

### Duplicate Components

| Component A | Component B | Difference |
|-------------|-------------|------------|
| `knowledge-grid.tsx` (194 lines) | `resource-list.tsx` (210 lines) | Renders card vs item |
| Both have own polling, filtering, keyboard nav, load-more, empty state |

### Unused Components

| Component | Status | Evidence |
|-----------|--------|----------|
| `resource-list.tsx` | Dead | Not imported anywhere in page tree |
| `resource-item.tsx` | Dead | Only imported by `resource-list.tsx` |
| `empty-state.tsx` (package) | Likely dead | Not imported by any component in web app |

---

## Data Flow Issues

### Server Actions Return Pattern

Current pattern is inconsistent:

```ts
// Returns error
return { error: "Failed to update" };

// Returns success
return { success: true };

// Throws (from api-keys.ts)
throw new Error("Unauthorized");

// Returns partial data
return { items: [...], nextCursor: null };
```

### Cache Invalidation

- Every mutation calls `revalidatePath("/knowledge")` — but this invalidates the
  ENTIRE knowledge page cache, including sidebar's collection tree and tag counts.
- "Load more" pagination is client-side state (`items` + `cursor` in useState).
  Server cache invalidation doesn't help here — the client must re-fetch.

### Optimistic Updates

- `toggleFavorite` in `knowledge-card.tsx` does optimistic update via `setIsFav(!isFav)`.
  On error, it rolls back. This is correct.
- `deleteKnowledgeItem` in `resource-reader-panel.tsx` does NOT do optimistic update —
  it calls `onClose()` immediately and then tries to delete. If deletion fails, the
  item is gone from the UI but still in DB.

---

## Proposed Improvements

### P1: Server Action Auth Wrapper

```ts
// src/lib/action-utils.ts
import { auth } from "@/lib/auth";

export type ActionResult<T = void> =
  | { data: T; error?: never }
  | { data?: never; error: string };

export async function withAuth<T>(
  fn: (userId: string) => Promise<T>
): Promise<ActionResult<T>> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };
  try {
    const data = await fn(session.user.id);
    return { data };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Unknown error" };
  }
}
```

This eliminates 33 lines of boilerplate and standardizes error handling.

### P2: Remove Dead Code

- Delete `resource-list.tsx`, `resource-item.tsx`, `empty-state.tsx` (from shared package).
- Remove unused dependencies: `agentation`.
- Verify `hero-entrance.tsx` has no typewriter vestiges.

### P3: Consolidate Polling

- Move the 3s polling from `knowledge-grid.tsx` into a shared hook.
- Single poller, 10s interval, respect `document.visibilityState`.
- Eliminate dead `resource-list.tsx` polling.

### P4: Dynamic Imports

- `InlineEditor` → `next/dynamic` with `ssr: false`
- `CommandPalette` → already in `AnimatePresence`, but can be `next/dynamic`
- Reader components → dynamic per type

---

## Tradeoffs

| Change | Benefit | Cost | Risk |
|--------|---------|------|------|
| Auth wrapper | Less boilerplate, consistent errors | All server actions change signature | Medium — needs thorough testing |
| Delete dead code | -400 lines, less confusion | None | Low — grep for imports first |
| Dynamic imports | Smaller initial bundle | Slight divots for code splitting | Low |
| Single poller | Half the DB queries | Merge logic carefully | Low |
| Cursor pagination for search | First viable search at scale | New API surface | Low |

---

## Migration Strategy

1. **Phase 0**: Delete dead code (immediate, no behavioral change)
2. **Phase 1**: Auth wrapper + ActionReturn type (refactor only)
3. **Phase 2**: Performance — dynamic imports, consolidated polling
4. **Phase 3**: Search pagination, GIN index
5. **Phase 4**: API key auth optimization
6. **Phase 5**: Component splitting (settings, sidebar)

Each phase is independently deployable and testable.
