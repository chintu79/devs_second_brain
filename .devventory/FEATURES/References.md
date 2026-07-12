# References

> External knowledge captured from the web. The primary content type in the MVP.

---

## Purpose

References represent any piece of external knowledge worth saving. Unlike bookmarks (which just store URLs), References store URL + context + metadata + user notes + relationships.

## Current Scope

- Universal reference model handling any URL
- Common schema: URL, title, description, category, tags, notes, reason, favorite
- AI enrichment: auto-generated tags, category, summary
- Folder organization
- Backlinks and related items via shared tags
- Browser extension capture

## User Flow (Capture)

1. User finds interesting content on the web
2. Browser extension saves URL + optional context note
3. Backend extracts metadata (title, description, OG tags)
4. AI generates suggested tags, category, summary
5. Reference appears in Knowledge workspace
6. User can add notes, organize into folders, tag further

## Data Model

```
Resource
├── id: String (cuid)
├── title: String
├── url: String
├── category: String
├── notes: String? (user's notes/reflections)
├── reason: String? (why user saved this)
├── favorite: Boolean
├── folderId: String? (FK → Folder)
├── tags: ResourceTag[] (via join table)
├── references: Reference[] (via fromResource)
├── userId: String (FK → User)
└── createdAt: DateTime
```

## API / Server Actions

- `createResource(formData)` — Create reference
- `editResource(id, formData)` — Update reference
- `deleteResource(id)` — Delete reference
- `toggleFavorite(id, current)` — Toggle favorite
- `fetchMoreResources(cursor?, limit?)` — Cursor-based pagination

## AI Enrichment

On capture, the backend calls OpenRouter to generate:
- Category (from predefined list)
- Tags (extracted from content)
- Summary (1-2 sentences)
- Technologies (for code-related content)
- Difficulty (beginner/intermediate/advanced)
- Keywords (important terms)

## Future Roadmap

- Provider-specific metadata (GitHub stars, YouTube duration, etc.)
- Rich preview cards with thumbnail + description
- Canonical URL detection
- Duplicate detection
- Read-later workflow (mark as read/unread)
- Highlighting and annotation

## Known Limitations

- No canonical URL deduplication yet
- Provider-specific metadata not extracted (all URLs treated equally)
- No read/unread state
- No highlight/annotation on saved pages
