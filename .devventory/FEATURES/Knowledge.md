# Knowledge

> The heart of Devventory. A three-panel workspace for managing references (external knowledge).

---

## Purpose

Knowledge is the primary interface for interacting with saved references. It replaces the old tag manager, notes workspace, resources page, and prompts page with a single unified workspace.

## Current Scope

- References (URL-based external knowledge) as the primary content type
- Three-panel layout: folder tree | resource list | reader panel
- Always-editable content (no lock/unlock toggle)
- Folder organization with drag-and-drop
- Tagging for cross-cutting topics
- Search and filter by category, tag, favorites
- Backlinks and related items in context panel
- Cmd+K global search across all references

## User Flow

1. User opens Knowledge from sidebar
2. Left panel shows folder tree (All Items, Favorites, user-created folders, Unfiled)
3. Center panel shows list of references with search/filter
4. Clicking a reference opens the reader panel on the right
5. Reader panel shows: URL, metadata, notes (inline editor), tags, backlinks, related items
6. User can edit title, notes, tags inline via auto-save
7. Drag reference to a folder to organize
8. New references captured via browser extension appear here

## Data Model

```
Resource (Reference)
├── id, title, url, category
├── notes, reason (user context)
├── favorite, folderId
├── tags (via ResourceTag)
├── references (via Reference model — backlinks)
└── createdAt, userId
```

## API / Server Actions

- `actions/resources.ts`: CRUD + pagination (fetchMoreResources)
- `actions/folders.ts`: Folder CRUD + moveItemToFolder
- `actions/tags.ts`: Tag management
- `actions/references.ts`: Backlink/reference management

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| KnowledgeWorkspace | `components/knowledge/knowledge-workspace.tsx` | Three-panel layout orchestrator |
| FolderTree | `components/knowledge/folder-tree.tsx` | Hierarchical folder sidebar |
| ResourceList | `components/resources/resource-list.tsx` | Searchable, filterable reference list |
| ResourceReaderPanel | `components/resources/resource-reader-panel.tsx` | Reference detail with inline editing |
| InlineEditor | `components/shared/inline-editor.tsx` | TipTap rich text editor |
| Backlinks | `components/shared/backlinks.tsx` | Title-mention backlinks |

## Dependencies

- Next.js 16, React 19, Prisma, TipTap, Framer Motion, Lucide

## Future Roadmap

- Documents (owned files: PDF, images, markdown)
- Provider-specific metadata extraction
- Rich preview cards (thumbnail, description, favicon)
- Full-text search across reference content
- Bulk operations (move, tag, delete)

## Known Limitations

- No archive/trash yet (delete is permanent)
- No multi-select for batch operations
- No keyboard shortcuts for sidebar navigation
