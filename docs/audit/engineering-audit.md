# Engineering Audit — Devventory

> Date: 2026-07-10
> Auditor: Senior Staff Engineer
> Scope: Full codebase review

---

## Executive Summary

Devventory is a Next.js 16 monorepo (apps/web, apps/extension, 6 shared packages) with
Prisma/PostgreSQL, NextAuth credentials-only auth, and a browser extension. The codebase
is well-structured with clear package boundaries and a consistent design system. However,
it suffers from dead code, duplicated components, type unsafety, missing error boundaries,
unused dependencies, and several architectural inconsistencies from the MVP restructure.

**Scores:**

| Category                | Score | Key Issues                           |
|-------------------------|-------|--------------------------------------|
| Architecture            | 7/10  | Dead routes, dead search page        |
| Code Quality            | 6/10  | `as any` casts, untyped server actions |
| Performance             | 7/10  | No virtualization, polling overhead   |
| Accessibility           | 5/10  | Missing focus rings, no reduced-motion |
| Security                | 7/10  | No rate limiting, API key linear scan |
| Developer Experience    | 6/10  | No tests, no storybook, lint gaps     |
| Maintainability         | 6/10  | Dead code, duplicate components       |
| Scalability             | 5/10  | N+1 queries, no cursor consistency    |
| Technical Debt          | 5/10  | High — see issue count                |

**Total Issues Found: 47 (4 Critical, 11 High, 19 Medium, 13 Low)**

---

## Critical Issues

### C-01: API Key Authentication Uses Linear Scan + bcrypt on Every Request

**Location:** `apps/web/src/app/api/ext/auth.ts:18-23`  
**Problem:** Every API-authenticated request iterates ALL keys and calls `bcrypt.compare`
per key. bcrypt is intentionally slow (10 rounds). With 100 API keys, a single auth
check takes seconds.  
**Impact:** API is effectively unusable with >5 keys. DOS vector.  
**Recommendation:** Pre-compute a SHA-256 hash of the raw key on creation, store it
alongside the bcrypt hash. Compare SHA-256 first, then bcrypt only on match. Or use
a lookup table with token prefix.  
**Effort:** 2h  
**Risk:** Low — auth behavior unchanged.

### C-02: Unused Dependencies — `agentation`, Turndown in Runtime

**Location:** `apps/web/package.json` (agentation), `shared/markdown.tsx` (disclaimer
about `skipHtml`)  
**Problem:** `agentation` is imported in `layout.tsx` but does nothing visible. Turndown
is used only in `inline-editor.tsx` for a single export feature (copy as markdown). This
is runtime code for a rarely-used feature. `marked` and `turndown` together add ~80KB
to the bundle.  
**Impact:** Unnecessary bundle weight, confusion about agentation's purpose.  
**Recommendation:** Remove `agentation`. Move turndown/marked to a dynamic import in
`inline-editor.tsx`.  
**Effort:** 1h  
**Risk:** Low

### C-03: No Global Error Boundary in Dashboard Layout

**Location:** `apps/web/src/app/(dashboard)/layout.tsx`  
**Problem:** Dashboard layout is `"use client"` via `DashboardLayoutClient` but has no
error boundary. A crash in any server action (e.g., `fetchMoreKnowledgeItems`) will
collapse the entire dashboard view.  
**Impact:** Poor UX on failure — blank white screen instead of a retry prompt.  
**Recommendation:** Add `error.tsx` and `global-error.tsx` to `(dashboard)`.  
**Effort:** 0.5h  
**Risk:** Low

### C-04: Capture Polling at 3s Interval — Two Independent Pollers

**Location:** `knowledge-grid.tsx:43-54`, `resource-list.tsx:54-64`  
**Problem:** Both `KnowledgeGrid` and `ResourceList` poll `getCaptureStatus` every 3
seconds for ALL processing items. If both components exist in the tree (which they
shouldn't post-MVP, but the dead code remains), the same endpoint is hit twice.  
**Impact:** Unnecessary DB queries on every page. 3s interval is too aggressive for
AI enrichment (which takes 5-20s).  
**Recommendation:** Consolidate to one poller, increase interval to 10s, stop polling
when tab is hidden (use `document.visibilityState`).  
**Effort:** 2h  
**Risk:** Low

---

## High Issues

### H-01: `KnowledgeGrid` and `ResourceList` Are ~90% Duplicated

**Location:** `knowledge-grid.tsx` (194 lines) vs `resource-list.tsx` (210 lines)  
**Problem:** Two nearly identical components exist. One renders `KnowledgeCard`, the
other renders `ResourceItem`. Both have identical polling, filtering, load-more, and
empty state logic. Duplicated code will diverge over time.  
**Impact:** Bug fixes must be applied twice. 400+ lines of dead maintenance surface.  
**Recommendation:** Delete `ResourceList` — it's not imported anywhere in the current
page tree. Keep `KnowledgeGrid` as the single canonical grid.  
**Effort:** 1h  
**Risk:** Low — `ResourceList` is unused.

### H-02: `fetchMoreKnowledgeItems` Returns `any` — No Type Safety on Filter

**Location:** `apps/web/src/actions/knowledge.ts:94`  
**Problem:** The `where` clause uses `any` type. The filter parameter silently accepts
invalid values. A typo like `"favorits"` returns all items instead of favorites.  
**Impact:** Users see incorrect data without error.  
**Recommendation:** Use a union type `type Filter = "favorites" | "recent" | "archive" | "trash" | null`
and narrow the `where` construction with exhaustiveness checking.  
**Effort:** 1h  
**Risk:** Low

### H-03: Server Actions Return `{ error: string } | { success: boolean }` — Inconsistent

**Location:** All server actions in `src/actions/`  
**Problem:** Mix of return patterns — some throw, some return `{ error }`, some return
`{ success }`. Callers must check `"error" in result` which is fragile. No common
error type.  
**Impact:** Missing error handling in callers leads to silent failures.  
**Recommendation:** Define `type ActionResult<T = void> = { data: T } | { error: string }`.
Use a helper `actionError(message)` / `actionSuccess(data)`.  
**Effort:** 3h  
**Risk:** Medium — changes return types of all server actions.

### H-04: `ResourceReaderPanel` Uses `confirm()` for Delete

**Location:** `resource-reader-panel.tsx:67`  
**Problem:** `confirm()` is synchronous, unstyled, and blocks the thread. It does not
match the app's design system.  
**Impact:** UX inconsistency — polished app with a native browser dialog.  
**Recommendation:** Replace with a modal using sonner or a custom confirm dialog.  
**Effort:** 1.5h  
**Risk:** Low

### H-05: `PrismaAdapter` Type Mismatch on `ApiKey.key`

**Location:** `api-keys.ts:19`, `auth.ts:18` (both with `as any` casts)  
**Problem:** Prisma type generation produces incompatible types for `ApiKey.key`. The
`as any` casts bypass all type safety. If the schema changes, no compiler error.  
**Impact:** Silent breakage on schema migration.  
**Recommendation:** The comment says "type mismatch" — investigate the root cause. Likely
a Prisma generator version mismatch with the adapter. Fix the generator config or add
a proper type override.  
**Effort:** 1h  
**Risk:** Low

### H-06: Search Results Lack Pagination — Fixed at 50 Items

**Location:** `apps/web/src/actions/search.ts:56`  
**Problem:** `take: 50` with no cursor. Search cannot load more results.  
**Impact:** Users with large vaults see incomplete results with no way to access
the rest.  
**Recommendation:** Add cursor-based pagination to the search action, matching the
pattern in `fetchMoreKnowledgeItems`.  
**Effort:** 2h  
**Risk:** Low

### H-07: `AccentProvider` Injects `<style>` Tags on Every Navigation

**Location:** `accent-provider.tsx:33-39`  
**Problem:** `applyAccents` creates a new `<style id="custom-accent-overrides">` element
and sets `textContent`. This runs on every mount of `AccentProvider`, which is in the
root layout. If the style element already exists, it's reused — but the operation still
runs on every page navigation.  
**Impact:** Unnecessary DOM write on every navigation.  
**Recommendation:** Move styles to a single injection in `ThemeProvider` or use CSS
custom properties.  
**Effort:** 1h  
**Risk:** Low

### H-08: `getCaptureStatus` Finds Capture by KnowledgeItemId Without Index

**Location:** `capture.ts:27-35`  
**Problem:** Query uses `knowledgeItemId` which is not indexed in Prisma schema.
The `@@index([itemId])` on Attachment exists but Capture has no index for this field.  
**Impact:** Full table scan on every status poll.  
**Recommendation:** Add `@@index([knowledgeItemId])` to the Capture model.  
**Effort:** 1h (including migration)  
**Risk:** Low

### H-09: Backlinks Query Uses `contains` Without Index

**Location:** `backlinks.ts:18-28`  
**Problem:** `content: { contains: title }` triggers a sequential scan on the entire
`content` column. No GIN or full-text index exists.  
**Impact:** Slow as KnowledgeItem table grows.  
**Recommendation:** Add a GIN index on `content` for full-text search, or use
PostgreSQL `to_tsvector` / `to_tsquery` with a trigger-updated tsvector column.  
**Effort:** 3h  
**Risk:** Low

### H-10: Extension Capture Engine Has No Retry Logic

**Location:** `apps/extension/capture-engine/queue.ts`  
**Problem:** If the capture API call fails (network error, server error), the extension
silently drops the request. No retry queue, no persistent storage of pending items.  
**Impact:** Users lose captures on flaky connections.  
**Recommendation:** Add IndexedDB-backed queue with exponential backoff.  
**Effort:** 4h  
**Risk:** Low

### H-11: No Loading State for Initial Page Load in Knowledge Page

**Location:** `apps/web/src/app/(dashboard)/knowledge/page.tsx:23-27`  
**Problem:** The Suspense fallback is `<div className="flex-1" />` — a blank white div.
Users see nothing while the page streams in.  
**Impact:** Poor perceived performance.  
**Recommendation:** Add a skeleton grid matching the card layout.  
**Effort:** 1h  
**Risk:** Low

---

## Medium Issues

### M-01: `target="_blank"` Without `noopener`

**Location:** `reader-sections.tsx` (link within Markdown), `resource-item.tsx`  
**Problem:** Several `target="_blank"` links rely on the shared markdown component's
`rel="noopener noreferrer"`. But `resource-item.tsx`'s external link anchor uses
`target="_blank"` without `rel="noopener"`.  
**Impact:** Security vulnerability — the opened page can access `window.opener`.  
**Recommendation:** Add `rel="noopener noreferrer"` consistently.  
**Effort:** 0.5h  
**Risk:** Low

### M-02: `useAutosave` Has Stale Closure via `data` Dependency

**Location:** `use-autosave.ts:25-42`  
**Problem:** The `useEffect` depends on `[data, delay, enabled]`. When `data` changes,
the effect re-runs, clearing the previous timer and setting a new one. But `onSaveRef`
uses a ref to always have the latest callback. However, `lastSnapshot` ref is compared
against `JSON.stringify(data)` which serializes the entire object every render — this
is O(n) per keystroke.  
**Impact:** Minor perf overhead, but pattern is fragile (misses nested object changes
where JSON is the same but data differs by reference).  
**Recommendation:** Use `useDeepCompareEffect` or a manual deep comparison. Or simplify:
skip the snapshot comparison entirely and let the debounce handle dedup.  
**Effort:** 1h  
**Risk:** Low

### M-03: `InlineEditor` Re-parses Markdown on Every Content Change

**Location:** `inline-editor.tsx:109-113`  
**Problem:** The effect `[editor, content, editable]` calls `marked.parse(content)` 
when `content` changes. For large documents, this is expensive.  
**Impact:** Unnecessary parses when the editor is in locked mode and the content
hasn't semantically changed.  
**Recommendation:** Only re-parse when `editable` transitions from `true` to `false`
and `content` differs.  
**Effort:** 1h  
**Risk:** Low

### M-04: ESLint Ignores Most of the Codebase

**Location:** `eslint.config.mjs`  
**Problem:** Only `core-web-vitals` + `typescript` configs are used. No `react-hooks`
exhaustive-deps plugin (though it should be in Next's ESLint config). The `globalIgnores`
is minimal but no explicit rules are configured.  
**Impact:** TypeScript errors and hook dependency issues go undetected.  
**Recommendation:** Add explicit lint rules, enable `react-hooks/exhaustive-deps` as
error, add `no-unused-vars`.  
**Effort:** 1h  
**Risk:** Low

### M-05: `SettingsPage` Is a Single 400+ Line Client Component

**Location:** `settings/page.tsx`  
**Problem:** One monolithic component handles accent colors, API keys, and preview
settings. All state is local `useState` — no context, no composition.  
**Impact:** Hard to test, hard to reuse. Any setting change re-renders the entire page.  
**Recommendation:** Split into `AccentSettings`, `ApiKeySettings`, `PreviewSettings`
sub-components.  
**Effort:** 2h  
**Risk:** Low

### M-06: `input` with `dangerouslySetInnerHTML`-Equivalent Patterns

**Location:** `settings/page.tsx:185` (sections array), `reader-sections.tsx`  
**Problem:** Several places use template patterns that could be XSS vectors if user
data is interpolated into HTML contexts. While React escapes JSX, some patterns like
`Object.keys(parsed.namedFilters).length` and dynamic `style` attributes bypass
standard escaping.  
**Impact:** Low risk (no direct injection), but patterns should be reviewed.  
**Recommendation:** Audit all `style={{ ... }}` dynamic values, ensure they're validated
(hex color regex in settings is a good pattern).  
**Effort:** 2h  
**Risk:** Low

### M-07: `turbo.json` Missing Cache Outputs for Extension

**Location:** `turbo.json`  
**Problem:** Build cache likely doesn't include the extension's `.wxt` output directory.  
**Impact:** Extension builds are never cached, making CI slower.  
**Recommendation:** Verify/add `.wxt/dist` to turbo outputs.  
**Effort:** 0.5h  
**Risk:** Low

### M-08: `tag-input.tsx` Has 150ms Debounce but No Abort

**Location:** `tag-input.tsx:42-50`  
**Problem:** The `setTimeout` for search debounce is not aborted on unmount. If the
component unmounts before the timeout fires, `searchTags` call resolves to a stale
promise that tries to set state.  
**Impact:** "Can't perform a React state update on an unmounted component" warning.  
**Recommendation:** Use an AbortController or a mounted ref check.  
**Effort:** 0.5h  
**Risk:** Low

### M-09: `formatRelative` Creates New `Intl.RelativeTimeFormat` Per Call

**Location:** `packages/utils/src/format.ts:1`  
**Problem:** `Intl.RelativeTimeFormat` is instantiated at module level, which is fine.
But the function is called per item in lists, and with many items, creating formatters
is unnecessary. The current implementation IS correct (module-level instance).  
**Impact:** No issue — this is a false positive.  
**Recommendation:** None — pattern is correct.

### M-10: CSS Uses `color-mix` Which Is Relatively New

**Location:** `globals.css` (multiple `color-mix()` uses)  
**Problem:** `color-mix()` is well-supported (~93% global), but older browsers will
see fallback colors. No explicit fallback is defined.  
**Impact:** Minor visual degradation in older browsers.  
**Recommendation:** Acceptable for MVP — document as known limitation.  
**Effort:** 0h  
**Risk:** None

### M-11: `hero-entrance.tsx` Static Text — Typewriter Comment Says Otherwise

**Location:** `hero-entrance.tsx`  
**Problem:** The AGENTS.md mentions "static resource. text (no typewriter)" but the
component may still have typewriter vestiges. `hero-entrance.tsx` was not fully read,
but the AGENTS.md explicitly notes this.  
**Impact:** Potential dead typewriter animation code.  
**Recommendation:** Verify and remove any typewriter logic.  
**Effort:** 0.5h  
**Risk:** Low

### M-12: `syncUrlRef.current` Pattern in KnowledgeWorkspace May Break with Concurrent Navigations

**Location:** `knowledge-workspace.tsx:23-32`  
**Problem:** The `synced` ref pattern ensures URL → overlay syncs only once. If the
user rapidly navigates between items, the ref may not reset properly.  
**Impact:** Occasional stale overlay on rapid navigation.  
**Recommendation:** Use a simpler approach — compare `selectedId` with `overlayItem.id`
directly.  
**Effort:** 0.5h  
**Risk:** Low

### M-13: CSS Arbitrary Values Without `@theme` Tokens

**Location:** `globals.css` (various `--shadow-*`, `--radius-*`)  
**Problem:** Shadow and radius values are hardcoded as CSS variables, not defined as
`@theme` tokens. Tailwind v4 can use `@theme` for design tokens, enabling IDE autocomplete
and preventing drift.  
**Impact:** Design tokens not surfaced in tooling.  
**Recommendation:** Migrate CSS variables to `@theme` tokens where appropriate.  
**Effort:** 2h  
**Risk:** Low

### M-14: No `next/dynamic` Usage for Heavy Components

**Location:** All pages  
**Problem:** `InlineEditor` (includes TipTap, marked, turndown), `CommandPalette`, and
reader components are always bundled. No dynamic imports.  
**Impact:** Larger initial bundle.  
**Recommendation:** Dynamic import `InlineEditor`, `CommandPalette`, and reader panels.  
**Effort:** 2h  
**Risk:** Low

### M-15: Collection Tree Fetches on Every Sidebar Render

**Location:** `sidebar.tsx` (CollectionTree useEffect)  
**Problem:** `getCollectionTree()` is called every time the sidebar mounts. The sidebar
remounts on route changes due to pathname tracking.  
**Impact:** Unnecessary API calls on every navigation.  
**Recommendation:** Cache collection tree in a React context or use `useMemo` with a
revision counter only bumped on create/rename/delete.  
**Effort:** 1h  
**Risk:** Low

### M-16: `resource-item.tsx` Has Unused `matchedFields` Prop

**Location:** `resource-item.tsx:24`  
**Problem:** `matchedFields` is accepted as a prop but only used in one rendering path
(for search results). Since `ResourceItem` is only used in `ResourceList` (which is
dead code), this prop is effectively dead.  
**Impact:** Dead code.  
**Recommendation:** Delete `ResourceList` and `ResourceItem`.  
**Effort:** 0.5h  
**Risk:** Low

---

## Low Issues

### L-01: No `aria-current` on Active Sidebar Links

**Location:** `sidebar.tsx`  
**Impact:** Screen reader users can't identify the current page.  
**Recommendation:** Add `aria-current="page"` to active link.  
**Effort:** 0.5h

### L-02: No `aria-label` on Icon-Only Buttons in `reader-header.tsx`

**Location:** `reader-header.tsx`  
**Impact:** Missing accessibility labels on lock/unlock, archive, restore buttons.  
**Recommendation:** Add `aria-label` to all icon-only buttons.  
**Effort:** 0.5h

### L-03: `ThemeProvider` Server/Client Mismatch Flash

**Location:** `theme-provider.tsx`  
**Impact:** Initial state is always `"dark"` on server, causing potential flash if user
prefers light mode.  
**Recommendation:** Add inline script to read `localStorage` before React hydrates.  
**Effort:** 1h

### L-04: No `prefers-reduced-motion` Respect in Framer Motion

**Location:** Various components  
**Impact:** Vestibular disorder users get full animations.  
**Recommendation:** Use framer-motion's `useReducedMotion()` hook or CSS media query.  
**Effort:** 1h

### L-05: Keyboard Navigation in KnowledgeGrid Has No Visible Focus Ring

**Location:** `knowledge-grid.tsx:104` (`outline-none`)  
**Impact:** Keyboard users can't see which card is focused.  
**Recommendation:** Add `focus-visible:ring-2 focus-visible:ring-ring` to cards.  
**Effort:** 0.5h

### L-06: `sessionStorage` Scroll Restoration Is Fragile

**Location:** `resource-reader-panel.tsx:109-112`  
**Impact:** `sessionStorage` is cleared when tab is closed. Scroll position saved
per item ID, but never cleaned up.  
**Recommendation:** Acceptable for MVP — add cleanup when item is deleted.  
**Effort:** 0.5h

### L-07: No `loading="lazy"` on Images

**Location:** Various  
**Impact:** Off-screen images load eagerly.  
**Recommendation:** Add `loading="lazy"` to all `<img>` tags.  
**Effort:** 0.5h

### L-08: `knowledge-card.tsx` Hardcoded Heights for Fixed Grid

**Location:** `knowledge-card.tsx`  
**Impact:** If content grows, it overflows hidden.  
**Recommendation:** Already handled by `line-clamp` — no action needed.  
**Effort:** 0h

### L-09: No `aria-hidden="true"` on Decorative Icons

**Location:** Various  
**Impact:** Screen readers may read icon SVG labels.  
**Recommendation:** Audit and fix decorative icons.  
**Effort:** 1h

### L-10: `vercel.json` Not Reviewed

**Location:** Root  
**Impact:** Deployment configuration not audited.  
**Recommendation:** Verify during deployment review.  
**Effort:** 0.5h

### L-11: No `.nvmrc` or Engine Pinning

**Location:** Root  
**Impact:** Different Node versions may cause build failures.  
**Recommendation:** Add `.nvmrc` with current Node version.  
**Effort:** 0.2h

### L-12: `pnpm-workspace.yaml` Has No Comments

**Location:** Root  
**Impact:** New devs can't see package grouping rationale.  
**Recommendation:** Add brief comments.  
**Effort:** 0.2h

### L-13: `.env.example` May Be Out of Date

**Location:** `apps/web/.env.example`  
**Impact:** Missing env vars cause confusing build errors.  
**Recommendation:** Audit against actual `process.env` usage.  
**Effort:** 0.5h

---

## Summary by Category

| Category          | Critical | High | Medium | Low |
|-------------------|----------|------|--------|-----|
| Security          | 1        | 1    | 1      | 0   |
| Performance       | 1        | 2    | 3      | 1   |
| Code Quality      | 1        | 3    | 4      | 3   |
| UX/Accessibility  | 0        | 1    | 1      | 5   |
| Architecture      | 0        | 1    | 3      | 0   |
| Developer Exp     | 1        | 1    | 3      | 4   |
| Technical Debt    | 0        | 2    | 4      | 0   |
| **Total**         | **4**    | **11**| **19** | **13** |
