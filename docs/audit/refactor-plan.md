# Refactoring Plan — Devventory

> Target: 47 issues → actionable phases
> Rule: Each phase is independently deployable (no cascade failures)

---

## Phase 0 — Quick Wins (No Behavioral Change)

**Goal:** Delete dead code, remove unused deps, fix obvious bugs.
**Effort:** ~2h
**Risk:** Minimal

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 0.1 | H-01: ResourceList dead code | Delete `resource-list.tsx`, `resource-item.tsx` | 2 files |
| 0.2 | M-13: `target="_blank"` missing `rel` | Add `rel="noopener noreferrer"` to external links | 1-2 files |
| 0.3 | M-07: Tag input unmount leak | Add mounted ref check | `tag-input.tsx` |
| 0.4 | C-02: Remove `agentation` | Remove dependency, remove import from `layout.tsx` | 2 files |
| 0.5 | L-01: `aria-current` on sidebar | Add to active links | `sidebar.tsx` |
| 0.6 | L-02: Missing `aria-label` on reader header buttons | Add labels | `reader-header.tsx` |
| 0.7 | L-05: Keyboard focus rings on cards | Add `focus-visible:ring` | `knowledge-card.tsx` |
| 0.8 | H-02: Filter type safety | Union type + exhaustive check | `knowledge.ts` (action) |
| 0.9 | M-12: Synced ref race condition | Simpler comparison | `knowledge-workspace.tsx` |

---

## Phase 1 — Error Handling & Resilience

**Goal:** Consistent error patterns, error boundaries, no more `as any`.
**Effort:** ~4h
**Risk:** Medium (affects all server action return types)

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 1.1 | H-03: Server action return inconsistency | Add `ActionResult<T>` type + `withAuth()` wrapper | All server actions + new `action-utils.ts` |
| 1.2 | C-03: Missing error boundary | Add `error.tsx` to `(dashboard)` | 1 new file |
| 1.3 | H-11: Blank Suspense fallback | Add skeleton grid | 1 new file |
| 1.4 | C-01: API key auth linear scan | Add SHA-256 prefix lookup | `auth.ts` (ext) |
| 1.5 | H-08: Missing index on `knowledgeItemId` | Add `@@index` to Capture model | `schema.prisma` + migration |
| 1.6 | H-09: Backlinks full-text scan | Add GIN index or tsvector | `schema.prisma` + migration |

---

## Phase 2 — Performance

**Goal:** Reduce bundle size, reduce unnecessary renders, reduce DB queries.
**Effort:** ~4h
**Risk:** Low

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 2.1 | M-14: Dynamic imports | `next/dynamic` for InlineEditor, CommandPalette, readers | Multiple |
| 2.2 | C-04: 3s polling consolidation | Single shared hook, 10s, visibility-aware | New `use-processing-poller.ts` |
| 2.3 | H-06: Search pagination | Add cursor to search action | `search.ts` |
| 2.4 | M-15: Collection tree cache | Cache in context, bump on mutation | `sidebar.tsx` |
| 2.5 | M-03: InlineEditor re-parse on lock | Only re-parse on edit mode change | `inline-editor.tsx` |

---

## Phase 3 — Accessibility

**Goal:** Keyboard nav, screen readers, reduced motion.
**Effort:** ~2h
**Risk:** Low

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 3.1 | L-03: Theme flash | Inline script before hydration | `layout.tsx` |
| 3.2 | L-04: `prefers-reduced-motion` | Add `useReducedMotion()` to animated components | Multiple |
| 3.3 | L-09: `aria-hidden` on decorative icons | Audit icon-only SVGs | Multiple |
| 3.4 | M-11: Hero entrance dead code | Verify/remove typewriter vestiges | `hero-entrance.tsx` |

---

## Phase 4 — Code Quality & DX

**Goal:** Stronger types, consistent patterns, better linting.
**Effort:** ~3h
**Risk:** Low

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 4.1 | M-04: ESLint configuration | Add explicit rules, hooks exhaustive-deps | `eslint.config.mjs` |
| 4.2 | H-05: `as any` on ApiKey | Fix Prisma type mismatch | `schema.prisma` or generator |
| 4.3 | H-04: `confirm()` → modal | Replace with custom confirm component | `resource-reader-panel.tsx` |
| 4.4 | M-05: Split settings page | Extract sub-components | `settings/page.tsx` |
| 4.5 | M-13: Migrate tokens to `@theme` | Move CSS vars to `@theme` | `globals.css` |

---

## Phase 5 — Architecture Debt

**Goal:** Clean boundaries, reduce boilerplate.
**Effort:** ~5h
**Risk:** Medium

| # | Issue | Action | Files |
|---|-------|--------|-------|
| 5.1 | Auth wrapper implementation | `withAuth()` — refactor all 11 server actions | All `src/actions/*.ts` + new `lib/action-utils.ts` |
| 5.2 | AI service abstraction | Create `lib/ai-service.ts` interface | New file |
| 5.3 | Capture pipeline cleanup | Remove direct `ai.ts` imports | `capture-pipeline.ts` |
| 5.4 | Render sidebar data in server | Move collection/tag fetch to server component | `sidebar.tsx` → server component split |

---

## Phase Ordering Rationale

```
Phase 0 (Quick Wins)
  │
  ▼
Phase 1 (Errors & Resilience) — needed before changing server actions
  │
  ▼
Phase 2 (Performance) — independent of error changes
  │
  ▼
Phase 3 (Accessibility) — no code conflicts with other phases
  │
  ▼
Phase 4 (Code Quality) — polish after structural changes
  │
  ▼
Phase 5 (Architecture) — highest risk, needs solid foundation
```

Each phase is designed to:
1. Be independently deployable (no half-finished features)
2. Have clear rollback steps (revert commits)
3. Not depend on subsequent phases

---

## Rollback Strategy

- Every change is a single commit with `git revert <sha>` rollback
- Phases 0-3 are low-risk and can be deployed immediately
- Phase 4-5 require QA pass due to refactored server action signatures
- API key auth change (1.4) is the highest risk — needs manual testing

---

## How to Execute

1. Start with Phase 0
2. After each sub-task: build (`npx next build`) + verify
3. Commit with message format: `phase-N: short description`
4. Do not proceed to next phase until build passes

---

## Files to Create

- `docs/audit/engineering-audit.md` ✓
- `docs/audit/architecture-review.md` ✓
- `docs/audit/refactor-plan.md` ✓
- `src/lib/action-utils.ts` (Phase 1.1)
- `src/hooks/use-processing-poller.ts` (Phase 2.2)
- `src/components/shared/confirm-dialog.tsx` (Phase 4.3)
- `src/app/(dashboard)/error.tsx` (Phase 1.2)
- `src/components/shared/knowledge-skeleton.tsx` (Phase 1.3)

## Files to Delete

- `src/components/resources/resource-list.tsx`
- `src/components/resources/resource-item.tsx`
- `packages/shared/src/empty-state.tsx` (verify no imports first)
