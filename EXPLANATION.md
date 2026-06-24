# EXPLANATION.md — Phase 1 Implementation

## Architecture Decisions

### 1. Folder Structure
We use route groups `(auth)` and `(dashboard)` to organize auth pages vs. protected pages. The dashboard layout handles auth checks + sidebar/navbar wrapping. Each vault has its own page in `(dashboard)/` with a consistent pattern: server component fetches data + client components for interactivity.

### 2. Server Components by Default
All pages are async Server Components that fetch data via Prisma directly. Client Components (`"use client"`) are used only where interactivity is needed: dialogs, forms, copy buttons, markdown preview toggles, and the radar tab switcher.

### 3. Server Actions for Mutations
All creates, updates, and deletes go through `"use server"` functions in `src/actions/`. Each action:
- Authenticates the user via `auth()`
- Validates input
- Verifies ownership (for edits/deletes)
- Mutates Prisma
- Calls `revalidatePath`
- Returns `{ success: true }` or `{ error: "..." }`

### 4. Prisma 7 with Adapter
Prisma 7 requires a driver adapter for database connections. We use `@prisma/adapter-pg` with `pg` pool. The generated client is in `src/generated/prisma/` (custom output path).

### 5. Next.js 16 Compatibility
- Middleware uses cookie-based auth check (no Prisma import) to avoid Edge Runtime issues
- `params` and `searchParams` are awaited as Promises
- No parallel routes used, so `default.js` is not needed

### 6. NextAuth v5 with JWT Strategy
Credentials provider only. JWT strategy avoids database lookups on every request. The PrismaAdapter is still used for the User/Account/Session models.

### 7. Open Source Radar Uses Mock Data
`src/lib/mock-data.ts` contains 12 curated repos. Easy to swap with GitHub API later.

### 8. Global Search
A single Server Action (`globalSearch`) queries all 4 tables in parallel with `Promise.all`. Results are grouped by type in the UI.

---

## What Was Built

| Feature | Files | Pattern |
|---------|-------|---------|
| Auth (register/login/logout) | `actions/auth.ts`, `(auth)/login/`, `(auth)/register/` | FormData → Server Action → redirect |
| Landing Page | `app/page.tsx` | Static Server Component |
| Dashboard | `(dashboard)/dashboard/page.tsx` | Server Component with Prisma counts |
| Resource Vault | `actions/resources.ts`, `resources/page.tsx`, `vaults/resource-*.tsx` | Server + Client Components |
| Prompt Vault | `actions/prompts.ts`, `prompts/page.tsx`, `vaults/prompt-*.tsx` | Server + Client Components |
| Notes Vault | `actions/notes.ts`, `notes/page.tsx`, `vaults/note-*.tsx` | Server + Client + react-markdown |
| Project Vault | `actions/projects.ts`, `projects/page.tsx`, `projects/[id]/`, `vaults/project-*.tsx` | Server + Client with detail page |
| Open Source Radar | `radar/page.tsx` | Client Component (tab switcher) |
| Global Search | `actions/search.ts`, `search/page.tsx`, `search/search-results.tsx` | Server Action + Server Component |

---

## File Count

- 14 UI component files (`components/ui/`) — shadcn primitives
- 4 layout component files (navbar, sidebar, shell)
- 4 shared component files (empty-state, search-bar, tag-badge, copy-button)
- 8 vault component files (resource/prompt/note/project cards + dialogs + create buttons)
- 4 server action files (auth, resources, prompts, notes, projects, search)
- 13 page/layout files in `app/`
- 5 utility/config files in `lib/`
