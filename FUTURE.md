# FUTURE.md — Next Steps

## Immediate Next Step: Phase 2

Based on the Phase 1 completion, here is the recommended next implementation order:

### 1. Loading States & Error Boundaries
- Add `loading.tsx` to `(dashboard)/` and each vault route
- Add `error.tsx` to `(dashboard)/` and each vault route
- These are quick wins that dramatically improve UX

### 2. Form Validation with Zod
- Install `zod` and `react-hook-form`
- Create validation schemas for each vault type
- Add `useForm` to all create/edit dialogs
- Show inline field errors

### 3. Pagination
- Add cursor-based pagination to resource/prompt/note/project list pages
- Add "Load more" button or infinite scroll
- Update server actions to accept `cursor` and `limit` params

### 4. GitHub API Integration for Radar
- Create `actions/radar.ts` with real GitHub API calls
- Add `GITHUB_TOKEN` env var
- Cache results using `cacheTag` from next/cache
- Add "Save to Resources" button on each repo card

### 5. Unified Tag System
- Create Tag model in Prisma
- Migration script to convert existing `String[]` tags
- Tag autocomplete in forms
- Tag cloud page

### 6. Cmd+K Global Search
- Create `CommandPalette` component using shadcn `Command`
- Register `Cmd+K` keyboard shortcut
- Integrate with `globalSearch` action
- Show results in a modal

### 7. Rich Text / AI Features
- Add AI categorization button on save
- Integrate with OpenAI or similar for content summarization
- "Related items" suggestion engine

---

## Development Workflow

```bash
# Run development server
npm run dev

# Run lint
npm run lint

# Run build
npm run build

# Generate Prisma client after schema changes
npx prisma generate

# Create migration after schema changes
npx prisma migrate dev --name <migration-name>
```

## Environment Variables (Current)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth encryption secret |
| `NEXTAUTH_URL` | App URL (default: `http://localhost:3000`) |
