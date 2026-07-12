# Component Principles

## Shared Language

Every component in Devventory belongs to one family. A card in the Knowledge grid shares visual DNA with a card in Projects, in Search results, and in Radar. No component introduces isolated patterns.

## Component Anatomy

Every component has these layers, top to bottom:

```
┌─────────────────────────────────────┐
│           Elevation (shadow)         │  ← depth communicates hierarchy
├─────────────────────────────────────┤
│           Surface (background)       │  ← card, modal, panel, page
├─────────────────────────────────────┤
│           Border                     │  ← defines edge, varies by hierarchy
├─────────────────────────────────────┤
│           Padding                    │  ← rhythm, follows spacing scale
├─────────────────────────────────────┤
│           Content                    │  ← typography, icons, actions
└─────────────────────────────────────┘
```

## Component States

Every component defines at minimum:

- `idle` — resting state
- `hover` — cursor enters (150ms CSS)
- `active/pressed` — cursor down (80ms)
- `focused` — keyboard focus (ring)
- `disabled` — cannot interact (opacity 0.4)
- `loading` — async operation (spinner or skeleton)
- `error` — operation failed (shake + error msg)

## Surface Hierarchy

| Level | Component | Background | Shadow | Border |
|-------|-----------|------------|--------|--------|
| **Page** | Route background | `bg-background` | None | None |
| **Section** | Content grouping | None | None | Divider only |
| **Card** | Knowledge item | `bg-card` | `shadow-sm` on hover | `border-border` |
| **Elevated** | Dropdown, popover | `bg-card` | `shadow-md` | `border-border/60` |
| **Modal** | Dialog, overlay | `bg-card` | `shadow-xl` | `border-border/50` |
| **Toast** | Notification | `bg-card` | `shadow-lg` | `border-border/40` |

## Hover Scale Hierarchy

All interactive components use consistent hover scale:

| Target | Scale |
|--------|-------|
| Cards, list items | 1.01 |
| Navigation items, sidebar | 1.02 |
| Buttons, CTAs | 1.03 |
| Icons, tool icons | 1.05 |
| Toolbar buttons | 1.1 |

All use `transition-all duration-150` for CSS transitions.

## Component Categories

### Surface Components
- `Page` — route wrapper, defines max-width and padding
- `Section` — content grouping with optional header
- `Card` — self-contained content unit, clickable

### Navigation Components
- `Sidebar` — primary navigation, layoutId indicator
- `Tabs` — section-level navigation, layoutId underline
- `Breadcrumb` — hierarchical context
- `Pagination` — page navigation for lists

### Input Components
- `Button` — primary, secondary, ghost, danger, icon
- `Input` — text, search, textarea
- `Select` — dropdown selection
- `Toggle` — boolean on/off
- `Tag` — removable filter/tag input

### Feedback Components
- `Toast` — transient notification
- `Dialog` — modal confirmation
- `Sheet` — slide-in panel
- `Skeleton` — loading placeholder
- `Progress` — determinate/indeterminate progress

### Knowledge Components
- `KnowledgeCard` — resource item in grid/list
- `ReaderOverlay` — shared layout reader morph
- `FolderTree` — nested folder navigation
- `Backlinks` — reference connections
- `TagBadge` — colored category tag

## Shared Layout Transitions

Components that morph between views must use `layoutId` + `LayoutGroup`:

```
KnowledgeCard (layoutId="kcard-{id}") → ReaderOverlay (layoutId="kcard-{id}")
SearchResult (layoutId="result-{id}") → ReaderOverlay (layoutId="result-{id}")
FolderTree item → Folder contents
```

The `LayoutGroup` wraps the parent, and matching `layoutId` tokens on source and destination create automatic Framer Motion morph animations.

## Do Not

- Do not create isolated design patterns (every card is a KnowledgeCard variant)
- Do not hardcode values — use tokens
- Do not add motion without purpose — every animation must answer a question
- Do not create a component that does not define all states
- Do not add dependencies for what CSS can do
- Do not introduce new border radii — use the radius system
