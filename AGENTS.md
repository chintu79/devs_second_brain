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
- Transform Dev Second Brain into a premium developer knowledge OS with section-based identity, discovery-focused radar, search-as-primary-interface, and intentional functional motion.

## Constraints & Preferences
- Section accent colors: Dashboard #6366F1, Resources #14B8A6, Prompts #F59E0B, Notes #22C55E, Projects #8B5CF6, Radar #06B6D4, Search #EF4444, Settings #A1A1AA
- Accent colors used only for active indicators, labels, focused borders, chips, badges — never as backgrounds
- Border hierarchy: page sections (opacity 18%), interactive cards (12%), hover (25%), active accent color
- Divider system: section / content / sidebar dividers for structural rhythm
- Typography contrast: #FAFAFA page title, #E4E4E7 section heading, #F4F4F5 card title, #D4D4D8 description, #A1A1AA metadata, #71717A muted
- Spacing scale: 4/8/12/16/24/32/48/64 — no random values
- Radar must feel like Product Hunt + Readwise Reader + Arc Spaces
- Search must feel like Raycast / Spotlight
- Motion vocabulary: Reveal, Fade, Fade Up/Down, Slide, Stagger, Lift, Float, Morph, Expand, Collapse, Crossfade, Shared Element, Scale In, Focus Shift, Highlight, Progressive Reveal, Depth Shift, Context Slide, Active Indicator Slide, Hover Lift, Underline Reveal
- Timing: micro-interactions 100-200ms, hovers 150-250ms, page transitions 250-400ms, panels 250-350ms, search 200-300ms, typewriter 60ms type / 35ms delete
- Easing: ease-out, spring (natural deceleration), no bounce/elastic/overshoot
- Section containers: border-radius 20px, padding 24px, gap 32px
- Every section page wrapped with `data-accent` attribute
- Sidebar divided into Navigation / Workspace / Profile groups with per-section accent colors
- Dashboard hierarchy: Continue Working (hero → primary), Recent Activity (secondary), Knowledge Library (tertiary)
- Search and Radar use three-column workspace layout (sidebar | feed | detail/context panel) with URL-driven selection
- Consistent hover: `scale-[1.02]` on sidebar items, context panel links; `scale-[1.03]` on nav links, filter pills, CTA buttons; `scale-[1.05]` on workflow icons; `scale-[1.1]` on toolbar icon buttons; `scale-[1.01]` on cards/items, `scale-[1.015]` on search/prompt/repo cards via cardHover variant

## Progress
### Done
- Globals.css: section accent CSS variables, sidebar-item per-link accent (`--sidebar-item-accent`), border hierarchy classes (`.border-page`/`.border-interactive`/`.border-active`), divider system, section container (radius 20px), selection color-mix, scrollbar, premium note-prose, skeleton, entrance animations, command palette overlay
- Sidebar refactored into Navigation / Workspace / Profile groups with `data-accent` per link, animated active indicator via Framer Motion `LayoutGroup` + `layoutId` (replaced CSS `::before` pseudo-element)
- Dashboard page: greeting hero with accent-colored name, Continue Working (accent header icon, progress bars, status dots), Recent Activity (compact rows, type-colored icons), Knowledge Library (4-col grid with left accent border per vault card)
- All section pages wrapped with `data-accent` attribute
- Radar redesigned: three-column workspace with sidebar | feed | detail/context panel, personal items + collapsible Explore categories, growth indicators (Trending/Hot/Rising/Stable/New), 24 mock repos
- Search redesigned: client-side workspace with debounced globalSearch, hero search bar (h-14 text-lg), grouped results, type-colored borders, preview panel with full context, context panel (recent/suggested), URL-driven selection
- Motion library (`src/lib/motion.ts`): centralized variants (fadeIn, fadeInUp, slideInRight, stagger, cardHover, activePill, collapsible, panelTransition, contentStagger), timing constants, easing
- Landing page hero: `HeroEntrance` client component with sequenced Framer Motion stagger, `TypewriterText` cycling 6 phrases
- Developer Workflow section: enlarged icons (h-16 w-16), `AnimatedArrow` with rotation + oscillation
- Page transitions, AnimatedSection, AnimatedCard use shared `fadeInUp` variant
- Card hover standardization: search-result-card, repository-card, prompt-card use shared `cardHover` (scale: 1.015)
- Staggered list reveals: resource-list, prompt-list, project-list, note-list, radar-feed use `stagger.container` + `fadeInUp`
- Panel slide-in alignment: all 5 right panels use shared `slideInRight` variant
- Collapsible sections: note-sidebar, radar-sidebar, project-sidebar use shared `collapsible` variant
- Radar feed scroll: sticky search bar inside overflow container
- Full hover consistency pass across entire codebase: `transition-all duration-150` + `hover:scale` on all interactive elements (sidebar items, nav links, filter pills, context panels, command bar, dashboard items, landing page, vault cards, tag chips, toolbar buttons, section toggles, footer links)
- Fixed missing hover effects on vault cards (note-card, resource-card, prompt-card, project-card) — replaced defunct `card-hover` class with proper `hover:border-border/60 hover:shadow-sm hover:scale-[1.02]`
- Added hover border to note-list sidebar items (`hover:border-border/60`)
- Removed stale `card-hover` class from shadcn Card component (only used in auth pages)

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- Section colors applied via `data-accent` on page wrapper + sidebar links — CSS `color-mix` handles all accent-derived states automatically
- Sidebar active indicator uses Framer Motion `LayoutGroup` + `layoutId` for spring-glide animation
- Radar and Search use same workspace pattern as Notes/Projects: three-column with URL `?id=` param for selection
- Search calls `globalSearch` server action with 250ms debounce
- Repository tag → project name matching done client-side via tag intersection
- Motion variants centralized in `src/lib/motion.ts`
- Hover scale hierarchy: 1.01 (cards/items), 1.015 (cardHover), 1.02 (sidebar/context), 1.03 (nav/filters/CTA), 1.05 (icons), 1.1 (toolbar buttons)
- All interactive hovers use `transition-all duration-150` for consistent timing

## Next Steps
- (none — all planned refinements applied)

## Critical Context
- 20+ files import `framer-motion` — all animations use centralized variants from `src/lib/motion.ts`
- Landing page hero uses `HeroEntrance` client component with Framer Motion stagger (no CSS animation classes)
- Sidebar active indicator uses Framer Motion `layoutId` with `LayoutGroup`
- All list/feed components use `stagger.container` + `fadeInUp` per-item
- All right-side panels share `slideInRight` variant
- `animate-dash-flow` CSS class preserved but unused (replaced by `AnimatedArrow` client component)
- `FadeIn` IntersectionObserver component retained for landing page scroll reveals below the fold
- Vault cards (note, resource, prompt, project) use inline `transition-all duration-150 hover:border-border/60 hover:shadow-sm hover:scale-[1.02]` — the `card-hover` class has been removed from <Card />

## Relevant Files
- `src/app/globals.css`: Section accent variables, border hierarchy, divider system, section container, sidebar-item with dynamic `--sidebar-item-accent`, selection color-mix, scrollbar, premium note-prose, skeleton, entrance animations, command palette overlay
- `src/lib/motion.ts`: Centralized motion constants and variants
- `src/components/layout/sidebar.tsx`: Framer Motion LayoutGroup + layoutId active indicator glide
- `src/components/landing/hero-entrance.tsx`: Staggered Framer Motion sequence for landing hero
- `src/components/landing/typewriter-text.tsx`: Cycles through 6 phrases with typing/deleting/cursor animation
- `src/components/landing/animated-arrow.tsx`: Framer Motion oscillation + rotation for workflow arrows
- `src/components/dashboard/page-transition.tsx`: Uses shared `fadeInUp` variant
- `src/components/dashboard/animated-section.tsx`: AnimatedSection + AnimatedCard use shared `fadeInUp` variant
- `src/components/landing/fade-in.tsx`: IntersectionObserver-based scroll reveal retained for below-fold sections
- `src/components/resources/resource-list.tsx`: Staggered card reveal, search, filter pills with hover:scale-[1.03]
- `src/components/prompts/prompt-list.tsx`: Staggered card reveal, CTA with hover:scale-[1.03]
- `src/components/projects/project-list.tsx`: Staggered card reveal
- `src/components/notes/note-list.tsx`: Staggered card reveal, hover border on items
- `src/components/notes/note-sidebar.tsx`: Collapsible sections, section toggle with hover:scale-[1.02], create button hover:scale-[1.1]
- `src/components/radar/radar-feed.tsx`: Staggered card reveal, sticky search bar
- `src/components/radar/radar-sidebar.tsx`: Collapsible sections, section toggle with hover:scale-[1.02]
- `src/components/projects/project-sidebar.tsx`: Collapsible sections, create button hover:scale-[1.1], section toggle hover:scale-[1.02]
- `src/components/search/search-result-card.tsx`: Uses shared `cardHover` variant
- `src/components/radar/repository-card.tsx`: Uses shared `cardHover` variant
- `src/components/prompts/prompt-card.tsx`: Uses shared `cardHover` variant
- `src/components/vaults/note-card.tsx`: hover:scale-[1.02] + hover:border-border/60 + hover:shadow-sm, action buttons hover:scale-[1.1]
- `src/components/vaults/resource-card.tsx`: Same hover pattern as note-card
- `src/components/vaults/project-card.tsx`: Same hover pattern as note-card
- `src/components/vaults/prompt-card.tsx`: Same hover pattern as note-card
- `src/components/search/search-preview-panel.tsx`: Uses shared `slideInRight` variant
- `src/components/prompts/prompt-preview-panel.tsx`: Uses shared `slideInRight` variant
- `src/components/radar/repository-detail-panel.tsx`: Uses shared `slideInRight` variant
- `src/components/notes/note-reader-panel.tsx`: Uses shared `slideInRight` variant, context items hover:scale-[1.02]
- `src/components/projects/project-workspace.tsx`: WorkspacePanel uses shared `slideInRight` variant, tabs with hover:scale-[1.02]
- `src/components/resources/resource-filters.tsx`: Category + tag filter pills with hover:scale-[1.03]
- `src/components/prompts/prompt-filters.tsx`: Category filter pills with hover:scale-[1.03]
- `src/components/dashboard/command-bar.tsx`: Search bar hover:scale-[1.01], quick actions + bell hover:scale-[1.1]
- `src/components/dashboard/continue-working.tsx`: Project cards with hover:scale-[1.01], "All projects" link hover:scale-[1.02]
- `src/components/dashboard/recent-activity.tsx`: Activity items hover:scale-[1.01], "View all" link hover:scale-[1.02]
- `src/components/dashboard/knowledge-library.tsx`: Vault cards with hover border/shadow
- `src/components/dashboard/context-panel.tsx`: Note links hover:scale-[1.02]
- `src/components/resources/resource-context-panel.tsx`: Sidebar links hover:scale-[1.02]
- `src/components/prompts/prompt-context-panel.tsx`: Sidebar links hover:scale-[1.02]
- `src/components/search/search-context-panel.tsx`: Items hover:scale-[1.02]
- `src/components/radar/radar-context-panel.tsx`: Context items hover:scale-[1.02]
- `src/components/ui/card.tsx`: Stale `card-hover` class removed; base Card is now plain (no hover)
- `src/app/page.tsx`: Landing page with HeroEntrance, workflow arrows, feature cards hover:scale-[1.02], nav links hover:scale-[1.03], CTA buttons hover:scale-[1.03], footer links hover:scale-[1.02]
