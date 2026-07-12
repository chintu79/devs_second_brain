<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:design-manifesto -->
# Design Manifesto

This document defines how every prompt, feature, interaction, and UI decision should be made. Never design a component before checking it against these principles.

## Principle 01 — Capture Frictionlessly
A thought should never disappear because the interface was slower than the user's brain. Every capture flow should require the fewest possible actions. Ask: *Can this be captured in under five seconds?* If not, redesign it.

## Principle 02 — Reveal Progressively
Do not overwhelm users. The interface should unfold naturally. Users should only see what they need right now. Never show everything at once. Every screen should have one primary action, one secondary action; everything else remains contextual.

## Principle 03 — Preserve Context
Resources, prompts, notes, projects, and search should all open inside contextual workspaces whenever possible. Prefer preview panels, sheets, split views, and expandable workspaces instead of full page navigation. Users should always know where they came from.

## Principle 04 — Everything Is Connected
No item should exist independently. Everything should reference something else. Every page should answer: *Where is this used? What project needs this? Which note references this? Which prompt generated this?*

## Principle 05 — Build For Retrieval
Saving is easy — finding is difficult. Design every screen assuming the user forgot the title, tags, date, and location. Search should understand intent. Every saved item should contain context and answer *Why did I save this?*

## Principle 06 — Motion Explains
Animation is communication, never decoration. Animate to explain navigation, hierarchy, expansion, focus, and selection. Every animation should answer: *What changed? Where did it come from? Where did it go?*

## Principle 07 — Reward Intention
Delight should be earned. Celebrate first save, first project, 100th resource, project completion, knowledge milestones. Frequent interactions should remain subtle — small achievements deserve memorable moments.

## Principle 08 — Calm By Default
The interface should never compete with the content. Whitespace is a feature. Typography is the primary design element. Animations are secondary. Color is tertiary. Users should feel focused, never stimulated.

## Principle 09 — Speed Builds Trust
Every interaction should feel immediate. Prefer optimistic updates, skeletons, progressive loading, instant search. Never leave users waiting without feedback.

## Principle 10 — Respect Knowledge
A saved resource is not a bookmark. A prompt is not text. A project is not a folder. A note is not a document. Everything represents knowledge — treat it accordingly.

## Product Personality
Calm, Intentional, Confident, Intelligent, Helpful, Developer-first. Never loud. Never gimmicky. Never overwhelming.

## Preflight Checklist
Before generating any UI or feature, ask:
- [ ] Is this simpler? (P1, P2)
- [ ] Does it preserve context? (P3)
- [ ] Does it help retrieval? (P5)
- [ ] Does motion explain something? (P6)
- [ ] Does it respect the user's attention? (P8)
- [ ] Would I enjoy using this every day? (Personality)
<!-- END:design-manifesto -->

## Goal
- Ship an MVP of Devventory: one place to capture, organize, and retrieve everything important without remembering where it was saved.

## MVP Constraints
- Only 4 pages: Dashboard, Knowledge, Projects, Radar
- All content is "Knowledge" — two types: References (external URLs, MVP) and Documents (owned files, roadmap)
- Knowledge is the heart — three-panel layout with folder tree | content | context panel
- Projects are workspaces that reference knowledge, never duplicate it
- Browser extension is high priority (capture URLs + optional context)
- AI is limited to metadata generation, summaries, and auto-labels
- Remove everything that doesn't directly improve Capture, Organization, or Retrieval
- NOT a rollback — preserve architectural improvements (three-panel layout, inline editor, folder tree, backlinks)

## Progress
### Done
- **MVP Restructure** (Jul 8): Removed /prompts, /search, /chat, /docs, /graph, /log, /onboard, /notes, /resources pages
- **Sidebar simplified**: 4 links (Dashboard, Knowledge, Projects, Radar) — removed Workspace sub-group
- **DashboardNavbar simplified**: 5 links — same 4 + Settings
- **Knowledge → References workspace**: Three-panel layout, folder tree | resource list | reader panel. Uses resource-list + resource-reader-panel components. Folder model added to Prisma schema.
- **Dashboard simplified**: Just "Continue Working" (projects + references) and "Recent Captures" (recent references). Removed analytics, streak, daily brief, weekly progress.
- **Projects simplified**: Removed kanban view, prompts/notes reference data. Kept workspace panel with overview, PLAN.md, timeline.
- **Landing page simplified**: Removed LandingSections, kept Navbar + HeroEntrance + footer
- **Prisma Folder model**: Added Folder model with self-referencing parentId, folderId on Resource/Note/Prompt/Project
- **Cleaned up**: Removed chat/, prompts/, graph/, docs/ components. Removed daily log, analytics server actions. Removed AI chat API route, save-prompt extension API.

## Blocked
- Registration fails on Vercel: Neon database unreachable from Vercel region

## AI Chat & Docs Redesign
- **Chat workspace**: Two-column layout (chat + context panel), URL-driven `?from=` context param, context-aware suggested actions per section (resources/notes/prompts/projects/docs)
- **Chat context panel**: Right sidebar showing related vault items (resources, notes, prompts, projects) with type-colored icons, animated slide-in via `slideInRight` variant
- **Code block copy**: Chat message code blocks now have language labels + copy buttons with success feedback
- **Context bar**: Visual indicator showing active chat context with clear button
- **Docs TOC**: Sticky sidebar with IntersectionObserver-driven active section tracking, Framer Motion `layoutId` animated indicator, smooth scroll navigation
- **Reading progress**: Fixed gradient progress bar using Framer Motion `useScroll` + spring animation
- **Docs layout**: Two-column flex layout (max-w-6xl) with TOC sidebar on large screens, main content area

## Key Decisions (Chat & Docs)
- Chat `?from=` URL param drives context-aware suggestions without additional state management — works with browser navigation
- Chat vault data fetched server-side (like other workspace pages) rather than from API route — enables context panel without extra API calls
- DocsTOC uses `IntersectionObserver` with `rootMargin: "-80px 0px -60% 0px"` for early section detection — section activates before reaching top of viewport
- ReadingProgress uses `useScroll` from framer-motion with spring animation — no scroll event listeners, GPU-composited
- Docs page keeps all data inline (no separate content file) — preserves existing architecture, TOC data extracted via `map()`

## Critical Context
- 20+ files import `framer-motion` — all animations use centralized variants from `src/lib/motion.ts`
- Dashboard page uses Suspense streaming: `DashboardGreeting` (no DB) renders immediately, `DashboardPrimarySection` and `DashboardGraphSection` stream in via Suspense boundaries
- `DashboardGreeting` at `src/app/(dashboard)/dashboard/dashboard-greeting.tsx` — renders h1 from session only (no DB calls)
- `DashboardPrimarySection` at `src/app/(dashboard)/dashboard/dashboard-data.tsx` — merged 9 queries into single Promise.all (counts + recent items + analytics), renders vault blocks + streak + timeline + insights
- Skeleton components at `src/app/(dashboard)/dashboard/skeletons.tsx` — `DashboardSkeleton` (4-card grid), `ActivitySkeleton` (timeline + insights), `GraphSkeleton` (graph placeholder)
- Landing page hero uses `HeroEntrance` client component with Framer Motion stagger, static "resource." text (no typewriter)
- Sidebar active indicator uses Framer Motion `layoutId` with `LayoutGroup`
- All list/feed components use `stagger.container` + `fadeInUp` per-item
- All right-side panels share `slideInRight` variant
- `animate-dash-flow` CSS class unused, kept for reference
- `FadeIn` IntersectionObserver component retained for landing page scroll reveals below the fold
- Vault cards (note, resource, prompt, project) use inline `transition-all duration-150 hover:border-border/60 hover:shadow-sm hover:scale-[1.02]` — the `card-hover` class has been removed from <Card />

## Key Decisions
- Section colors applied via `data-accent` on page wrapper + sidebar links — CSS `color-mix` handles all accent-derived states automatically
- Sidebar active indicator uses Framer Motion `LayoutGroup` + `layoutId` for spring-glide animation
- Radar and Search use same workspace pattern as Notes/Projects: three-column with URL `?id=` param for selection
- Search calls `globalSearch` server action with 250ms debounce
- Repository tag → project name matching done client-side via tag intersection
- Motion variants centralized in `src/lib/motion.ts`
- Hover scale hierarchy: 1.01 (cards/items), 1.015 (cardHover), 1.02 (sidebar/context), 1.03 (nav/filters/CTA), 1.05 (icons), 1.1 (toolbar buttons)
- All interactive hovers use `transition-all duration-150` for consistent timing
- All icon-only buttons must have `aria-label` (28 verified during Lighthouse audit)
- Dark mode muted foreground bumped to `#8a9299` for WCAG AA 4.5:1 compliance against `#2f3437`
- Sidebar active items use white text instead of accent color for readability
- Dashboard page streams content via Suspense boundaries: greeting (no DB) → primary content (Suspense) → graph (Suspense)
- Sidebar section labels use neutral `sidebar-foreground/60` (not accent-tinted `color-mix`) to pass contrast
- Skeleton components created per dashboard section for targeted Suspense fallbacks

## Relevant Files
- `src/app/globals.css`: Section accent variables, border hierarchy, divider system, section container, sidebar-item with dynamic `--sidebar-item-accent`, selection color-mix, scrollbar, premium note-prose, skeleton, entrance animations, command palette overlay
- `src/lib/motion.ts`: Centralized motion constants and variants
- `src/components/layout/sidebar.tsx`: 4 links (Dashboard, Knowledge, Projects, Radar), Framer Motion LayoutGroup + layoutId active indicator glide
- `src/components/landing/hero-entrance.tsx`: Staggered Framer Motion sequence for landing hero
- `src/components/resources/resource-list.tsx`: Staggered card reveal, search, filter pills with hover:scale-[1.03]
- `src/components/projects/project-list.tsx`: Staggered card reveal
- `src/components/projects/project-workspace.tsx`: WorkspacePanel with slideInRight, tabs (Overview, PLAN.md, Timeline), always-editable
- `src/components/knowledge/knowledge-workspace.tsx`: Three-panel References workspace with folder tree, resource list, reader panel
- `src/components/knowledge/folder-tree.tsx`: Folder tree with nested items, expand/collapse, create/rename/delete
- `src/components/radar/radar-feed.tsx`: Staggered card reveal, sticky search bar
- `src/components/radar/radar-sidebar.tsx`: Collapsible sections, section toggle with hover:scale-[1.02]
- `src/components/projects/project-sidebar.tsx`: Collapsible sections, create button hover:scale-[1.1], section toggle hover:scale-[1.02]
- `src/components/radar/repository-card.tsx`: Uses shared `cardHover` variant
- `src/components/dashboard/dashboard-main.tsx`: Simplified — Continue Working + Recent Captures only
- `src/components/shared/inline-editor.tsx`: TipTap editor with bubble menu, slash commands, CSS drag handles, block action menu
- `src/components/shared/backlinks.tsx`: Title-mention backlinks component
- `src/components/layout/command-palette.tsx`: Cmd+K command palette
- `src/app/page.tsx`: Landing page with Navbar + HeroEntrance + footer (removed LandingSections)
- `src/app/(dashboard)/knowledge/page.tsx`: References workspace — fetches resources, folders, categories, tags
- `src/app/(dashboard)/dashboard/page.tsx`: Continuation page — Continue Working + Recent Captures
- `src/app/(dashboard)/projects/page.tsx`: Project workspaces — fetches projects only (no prompts/notes)
- `src/actions/folders.ts`: Folder CRUD + moveItemToFolder with typed FolderNode
- `src/actions/resources.ts`: Resource CRUD + cursor-based pagination
- `prisma/schema.prisma`: Models — User, Account, Session, Resource, Note, Prompt, Project, Tag, Reference, Folder, ApiKey, DailyEntry, RadarBookmark
