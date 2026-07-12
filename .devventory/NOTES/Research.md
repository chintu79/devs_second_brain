# Research

> Design research, competitor analysis, and technical exploration notes.

---

## Competitor Analysis

### Notion
- Strengths: Block-based editing, templates, databases, collaboration
- Weaknesses: Slow, overwhelming, poor offline support, expensive
- What we can learn: Inline editing, keyboard shortcuts, slash commands
- What to avoid: Forcing database/table mental model on every feature

### Obsidian
- Strengths: Local-first, backlinks, graph view, plugin ecosystem
- Weaknesses: Technical barrier, no native cloud sync, markdown-only
- What we can learn: Backlinks as a core navigation tool, linking between items
- What to avoid: Over-reliance on local filesystem, complex plugin system

### Readwise Reader
- Strengths: Best-in-class reading experience, highlight/annotation, email capture
- Weaknesses: Read-only, no writing, no project workspace
- What we can learn: Clean reading layout, highlight workflow, daily review
- What to avoid: Being read-only, no bidirectional linking

### Linear
- Strengths: Fast, keyboard-first, beautiful design, developer-focused
- Weaknesses: Project management only, not a knowledge tool
- What we can learn: Keyboard shortcuts, optimistic updates, speed as a feature
- What to avoid: Complex project management features in a knowledge tool

---

## Technical Research

### Three-Panel Layout
The three-panel layout (sidebar | content | context) is inspired by:
- Obsidian (file explorer | note | backlinks)
- Linear (project list | detail | comments)
- Apple Mail (mailbox list | message | preview)

Key insight: The rightmost panel should always answer "How is this connected to everything else?"

### TipTap / ProseMirror
- Chose TipTap over Slate, Quill, and CodeMirror for block-based editing
- Slash commands and bubble menus are well-supported
- Markdown shortcuts (typing `#` for heading) work out of the box
- Custom extensions are well-documented

### Folder Tree
- Folder tree uses HTML5 Drag and Drop API (not @dnd-kit)
- Decision: simpler API, no extra dependency, good enough for MVP
- @dnd-kit is already in dependencies for kanban (now removed) — may revisit

### Search
- DB `LIKE` queries are sufficient for MVP (typically < 1000 items)
- Full-text search (Postgres `tsvector`) is the natural next step
- Semantic search (embeddings) requires a vector DB or external service

---

## Open Questions

1. **Should References support inline annotation/highlight?** — This would require saving page snapshots or using Readwise-like embedding. High value, high complexity.

2. **Should we support offline mode?** — PWA with Service Worker + IndexedDB. High complexity, medium value before mobile app.

3. **Should we build a desktop app?** — Tauri or Electron. Not needed until users request it. Mobile is higher priority.

4. **Should tags be hierarchical?** — Users naturally create `frontend/react` patterns. Slash/hierarchy parsing is simple. But it adds complexity to tag management UI.
