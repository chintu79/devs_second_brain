# Architecture

> System architecture, data flow, and key design decisions.

---

## System Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Browser    │     │  Next.js 16  │     │  Neon/Postgres
│  Extension  │────▶│  Web App     │────▶│  (via Prisma)
│  (WXT/MV3)  │     │              │     │             │
└─────────────┘     │  React 19    │     └─────────────┘
                    │  TipTap       │
┌─────────────┐     │  Framer       │     ┌─────────────┐
│  User       │     │  Motion       │     │  OpenRouter │
│  Browser    │────▶│              │────▶│  AI API     │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## Request Lifecycle

### Page Load
1. Browser requests URL → Next.js server
2. Server checks authentication (`auth()` from `@/lib/auth`)
3. Server fetches data from Prisma (parallel `Promise.all`)
4. Server renders React component tree
5. Client hydrates, Framer Motion takes over animations

### Reference Save (Extension)
1. User clicks extension button → content script opens popup
2. User adds optional context → clicks "Save"
3. Content script → `chrome.runtime.sendMessage` → background worker
4. Background worker → `POST /api/ext/capture` → web app
5. Web app creates Resource → runs AI enrichment (async)
6. Response returned → extension shows success toast

### Search
1. User presses Cmd+K → command palette opens
2. User types query → 200ms debounce → `globalSearch` server action
3. Server searches Resource, Note, Project models via `LIKE` on title/content
4. Results returned grouped by type
5. User clicks result → navigates to `/knowledge?id=X`

---

## Data Flow

### Capture Pipeline
```
URL → Metadata Extraction → AI Enrichment → Resource Created → Indexed
  │                           │
  ├── Title (OG/HTML)         ├── Category
  ├── Description (OG/HTML)   ├── Tags
  ├── Favicon                 ├── Summary
  ├── Domain                  ├── Technologies
  └── Type                    └── Difficulty
```

### Organization Pipeline
```
Resource Created → Tagged → Foldered → Connected
                          │            │
                          ├── User     ├── Backlinks (title mentions)
                          ├── Auto-AI  ├── Link References
                          └── Batch    └── Shared Tags
```

### Retrieval Pipeline
```
User Query → Search → Filtered → Sorted → Displayed
                │
                ├── Cmd+K (global search)
                ├── Knowledge (filtered list)
                └── Dashboard (recent items)
```

---

## Client Responsibilities

- Render UI (React 19, Framer Motion animations)
- Handle user interactions (clicks, drag/drop, keyboard shortcuts)
- Manage client state (selected items, filter state, sidebar widths)
- Auto-save edits (debounced to server actions)
- Local storage for preferences (sidebar width, favorites, recent items)

## Server Responsibilities

- Authentication (NextAuth.js v5, credentials provider)
- Data fetching and mutation (Prisma ORM)
- Server rendering (Next.js app router, RSC)
- AI enrichment (OpenRouter API via lib/ai.ts)
- API for browser extension (REST endpoints)

---

## Storage Strategy

### Database (Neon/Postgres via Prisma)
- All structured data: users, resources, projects, tags, folders, etc.
- Relations managed via Prisma schema
- Cursor-based pagination for lists
- JSON fields for extensible metadata (future)

### Local Storage (Browser)
- Sidebar widths (`kn-sidebar-w`, `kn-sidebar-w`)
- Recent items (`kn-recent`)
- Favorites (`kn-fav`)
- No sensitive data stored client-side

### No External Storage (MVP)
- No file storage (S3, etc.) — Documents not yet implemented
- No cache layer (Redis, etc.) — Next.js built-in cache is sufficient
- No search index (Elasticsearch, etc.) — DB `LIKE` queries are sufficient for MVP

---

## Search Architecture

- **Global Search** (`actions/search.ts`): Case-insensitive `LIKE` on title across all models
- **Filtered Search** (in Knowledge): Client-side filter on loaded data (category, tag, favorites)
- **Cmd+K Palette**: Global search with 200ms debounce, grouped results by type
- **Indexing**: No external search index — DB queries only (MVP)
- **Future**: Full-text search via Postgres `tsvector` or dedicated search service

---

## AI Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Capture  │───▶│ Metadata │───▶│ Resource │
│ Request  │    │ Extract  │    │ Created  │
└──────────┘    └──────────┘    └─────┬────┘
                                      │
                               ┌──────▼──────┐
                               │ AI Enrich   │
                               │ (OpenRouter)│
                               └──────┬──────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Update Resource with AI  │
                         │ (tags, category, summary)│
                         └─────────────────────────┘
```

- AI runs **after** resource creation (async)
- AI failures don't block resource creation
- "Best effort" — users can override AI-generated metadata

---

## Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema |
| `lib/prisma.ts` | Prisma client singleton |
| `lib/auth.ts` | NextAuth configuration |
| `lib/ai.ts` | OpenRouter AI helpers |
| `lib/tags.ts` | Tag utility functions |
| `actions/` | Server actions (CRUD per model) |
| `app/api/ext/` | Browser extension API routes |

---

## Related

- [[DECISIONS/0001-knowledge-first.md]]
- [[DECISIONS/0002-universal-reference-engine.md]]
- [[DECISIONS/0005-capture-first.md]]
