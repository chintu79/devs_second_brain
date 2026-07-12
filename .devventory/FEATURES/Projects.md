# Projects

> Workspaces that reference knowledge. Projects bring References together to execute on ideas.

---

## Purpose

Projects are where knowledge becomes execution. Unlike traditional project management tools, Devventory projects never duplicate knowledge — they reference existing References via shared tags and links.

## Current Scope

- Project workspace with Overview, PLAN.md, Timeline tabs
- Always-editable content (no lock/unlock)
- Status tracking (idea → planning → research → building → completed → archived)
- Tech stack, tags, description
- Task progress bar (from PLAN.md checkboxes)
- Continue Working on Dashboard
- Favorite/unfavorite

## User Flow

1. User creates a project
2. Project appears in sidebar and Dashboard "Continue Working"
3. User edits Overview (description, tech stack, status, tags)
4. User writes PLAN.md (vision, roadmap, tasks with checkboxes)
5. Timeline tracks project milestones
6. References with matching tags appear as connected resources

## Data Model

```
Project
├── id: String (cuid)
├── title: String
├── description: String
├── status: String (idea | planning | research | building | completed | archived)
├── techStack: String[]
├── planMd: String (markdown plan)
├── favorite: Boolean
├── folderId: String? (FK → Folder)
├── tags: ProjectTag[] (via join table)
├── userId: String (FK → User)
├── createdAt: DateTime
└── updatedAt: DateTime
```

## API / Server Actions

- `createProject(formData)` — Create project
- `editProject(id, formData)` — Update project
- `deleteProject(id)` — Delete project
- `toggleProjectFavorite(id)` — Toggle favorite
- `archiveProject(id)` — Archive project
- `saveProjectPlan(id, planMd)` — Save PLAN.md

## Components

| Component | Location | Purpose |
|-----------|----------|---------|
| ProjectWorkspace | `components/projects/project-workspace.tsx` | Full workspace with list + detail panel |
| ProjectList | `components/projects/project-list.tsx` | Project cards with progress |
| ProjectSidebar | `components/projects/project-sidebar.tsx` | Status filters, tags |

## What We Removed

- Kanban board (over-engineered for MVP)
- Prompts/notes reference data (not MVP)
- Connection counts on project cards (no notes/prompts to connect)

## Future Roadmap

- Reference connection UI (drag references into projects)
- Project milestones with due dates
- Project templates
- Export project as markdown/PDF
- Timeline visualization

## Known Limitations

- No explicit reference linking UI (relies on shared tags)
- No due dates or milestones
- No collaboration (single-user only)
