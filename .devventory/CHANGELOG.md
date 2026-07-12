# Changelog

---

## [Unreleased] — MVP Restructure

### Added
- Internal engineering documentation (`.devventory/` folder)
- Folder model to Prisma schema (self-referencing hierarchy)
- `folderId` relation on Resource, Note, Prompt, Project models

### Changed
- **Knowledge page** repurposed from tag manager → References workspace with three-panel layout (folder tree | resource list | reader panel)
- **Dashboard** simplified to continuation page: "Continue Working" (recent projects + references) + "Recent Captures" (recent references). Removed analytics, streak, daily brief, weekly progress, knowledge insights.
- **Projects** simplified: removed kanban view, list/kanban toggle, prompts/notes reference data. Kept workspace panel with Overview, PLAN.md, Timeline.
- **Sidebar** reduced from 11 links → 4 (Dashboard, Knowledge, Projects, Radar). Removed Workspace sub-group.
- **DashboardNavbar** reduced to 5 links (same 4 + Settings)
- **Landing page** simplified: removed LandingSections, kept Navbar + HeroEntrance + footer

### Removed
- **Pages**: `/prompts`, `/search`, `/chat`, `/docs`, `/graph`, `/log`, `/onboard`, `/notes`, `/resources`
- **Components**: `chat/`, `prompts/`, `graph/`, `docs/` directories; `LandingSections`, `knowledge-sidebar`, `knowledge-inspector`
- **Server actions**: `analytics.ts`, `daily.ts`
- **API routes**: `/api/chat`, `/api/ext/save-prompt`
- **Components**: `kanban-board.tsx`
- **Library**: `lib/api-auth.ts` (unused, inconsistent with actual API key model)

### Fixed
- `React.ElementType` → `LucideIcon` type errors across 5 files (resource-reader-panel, linked-items, link-picker, command-bar, prompt-preview-panel)
- `useThree()` outside `<Canvas>` in studio-desk-canvas — moved responsive camera logic to parent via `isMobile` prop
- `createFolder` action now returns `{ success: boolean }` instead of throwing
- Prisma `ApiKey.key` type mismatch — cast bypass for codegen issue
