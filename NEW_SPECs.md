# NEW_SPECs.md — Improvements & Future Considerations

## Current Improvements Needed

### 1. Middleware → Proxy Migration
The `middleware.ts` file convention is deprecated in Next.js 16. We need to migrate to `proxy.ts` once next-auth v5 provides a Node.js-compatible auth wrapper (currently the `auth()` wrapper targets Edge Runtime).

### 2. Prisma 7 Best Practices
- Consider adding connection pooling configuration for production
- Add proper error handling with Prisma-specific error types
- Consider using `@prisma/extension-accelerate` if scaling requires it

### 3. Form Validation
Current forms use basic HTML validation (`required` attribute). Add Zod/RHF schema validation for production quality.

### 4. Loading States
Add `loading.tsx` files for each route segment (currently using inline loading state in client components).

### 5. Error Handling
Add `error.tsx` boundary files for each route segment.

### 6. Empty States / Onboarding
Current empty states are basic. Add onboarding wizard for new users.

### 7. Pagination
Lists currently fetch all records. Add cursor-based pagination for vaults with 50+ items.

### 8. Open Source Radar
Replace mock data with GitHub API integration:
- `GET /search/repositories?q=stars:>1000&sort=stars`
- Cache results with `cacheLife`/`cacheTag`
- Add bookmark-to-resources flow

### 9. Global Search
- Add keyboard shortcut (`Cmd+K` / `Ctrl+K`)
- Add debounced search-as-you-type
- Highlight matching text in results

### 10. Tags
Tags are stored as `String[]`. Consider a Tag model for:
- Auto-completion when typing tags
- Tag count/usage stats
- Unified tag cloud across vaults

---

## Phase 2 Feature Ideas

### 1. AI-Powered Features
- Auto-categorize resources/notes with an LLM
- Summarize saved articles
- Suggest related content from your vault
- "Chat with your second brain" (RAG)

### 2. GitHub Integration
- OAuth with GitHub
- Auto-sync starred repos
- Import repo README as notes

### 3. Rich Collaboration
- Shared vaults / teams
- Comments on projects
- Public profile pages

### 4. Browser Extension
- One-click save resources
- Highlight and save text snippets
- Context menu "Save to Second Brain"

### 5. Mobile App
- React Native or PWA with offline support
- Quick capture widget
- Voice notes

### 6. Data Export/Import
- Export all data as markdown files
- Import from Notion, Obsidian, GitHub Stars
- JSON/CSV export for analytics

### 7. Advanced Search
- Full-text search with PostgreSQL tsvector
- Saved searches
- Search history
- Filter combinations (category + tags + date range)
