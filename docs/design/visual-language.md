# Visual Language

## Iconography

### Style
- Stroke-based (filled icons only for favorite/active states)
- Stroke width: 1.5px (Lucide default)
- Corner radius: 2px internal, sharp external
- 16×16px default, 20×20px for toolbar, 24×24px for feature illustrations
- All icons from Lucide icon set (already installed, consistent stroke)

### Interaction
- Static icons: no animation
- Interactive icons (buttons): hover scale 1.05, active scale 0.95
- Chevrons/arrows: rotate in direction of action (collapsed→expanded: 180°)
- Loading/spinner: continuous rotation
- Success/error: morph from spinner to checkmark/X
- Favorite: filled/outline swap with color transition

### Application
- Type icons (link, note, document, video, tweet) get accent colors from their type
- Navigation icons are always `text-muted-foreground`, active becomes `text-foreground`
- Action icons (edit, delete, share) remain neutral until hover
- Empty state illustrations: use geometric shapes with accent gradients, never photos

## Shadows

Shadow system communicates surface elevation. Low contrast, soft, layered.

```css
/* Token definitions */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 8px 10px rgba(0, 0, 0, 0.04);
```

| Elevation | Usage | Token |
|-----------|-------|-------|
| 0 | Page background, sections | None |
| 1 | Cards, list items | `shadow-sm` on hover |
| 2 | Dropdown menus, popovers | `shadow-md` |
| 3 | Sticky headers, modals | `shadow-lg` |
| 4 | Overlays, dialogs | `shadow-xl` |
| 5 | Toast, notifications | `shadow-lg` + border |

## Border Radius System

A single radius scale shared across every component.

```css
--radius-xs: 4px;    /* Tags, badges, small indicators */
--radius-sm: 6px;    /* Inputs, buttons, compact cards */
--radius-md: 8px;    /* Cards, panels, dropdowns */
--radius-lg: 12px;   /* Modals, dialogs, sheets */
--radius-xl: 16px;   /* Reader overlay, large panels */
--radius-full: 9999px; /* Pills, avatars, toggles */
```

| Component | Radius |
|-----------|--------|
| Button | `--radius-sm` (6px) |
| Input, Select | `--radius-sm` (6px) |
| Card | `--radius-md` (8px) |
| Dropdown, Popover | `--radius-md` (8px) |
| Dialog, Modal | `--radius-lg` (12px) |
| Sheet, Panel | `--radius-lg` (12px) |
| Reader overlay | `--radius-xl` (16px) on desktop |
| Tag, Badge | `--radius-full` (pill) |
| Toggle handle | `--radius-full` (circle) |

## Borders

- Default: `border-border` (low contrast)
- Elevated: `border-border/60` or `border-border/50` (more subtle for elevated elements)
- Interactive: `border-border` hover → `border-border/70` (slight brighten)
- Active/selected: `border-accent/50` (accent tint)
- Dividers: `border-border/40` (very subtle)
- Focus: `ring-2 ring-offset-2 ring-accent/50`

No double borders. No decorative borders on non-interactive elements.

## Surface Colors

- Page: `bg-background` (#0f1115)
- Card: `bg-card` (slightly lighter than background)
- Muted: `bg-muted` (subtle highlight for hover, disabled)
- Secondary: `bg-secondary` (alternative surface)
- Accent: `bg-accent` (sparing — primary action only)

## Divider System

- Section dividers: `border-t border-border/40` with optional label
- Content dividers: `border-t border-border/30` (unlabeled)
- List dividers: `border-b border-border/20` (minimal)
- Gradient dividers (landing): `bg-gradient-to-r from-transparent via-border/30 to-transparent`

Dividers should never compete with content. If spacing alone creates separation, do not add a divider.

## Entrance & Exit Patterns

| Pattern | Use | Visual |
|---------|-----|--------|
| Fade up | Cards, list items, grid items | opacity 0→1, y 8→0, 200ms |
| Fade in | Backdrops, overlays | opacity 0→1, 150ms |
| Slide right | Panels, sheets | x -20→0, 200ms |
| Slide up | Dialogs, toasts | y 16→0, 250ms |
| Scale in | Modals, dropdowns | scale 0.95→1 + fade, 200ms |
| Morph | Card→reader, tile→detail | layoutId spring animation |
| Stagger | Lists, grids | Children at 35ms intervals |

## Loading & Empty States

- Skeleton: pulse animation on card-shaped placeholders, 1500ms cycle
- Spinner: continuous rotation on accent, 800ms cycle
- Progress bar: gradient accent, determinate or indeterminate
- Empty state: geometric illustration + headline + description + single CTA
- Error state: icon + message + retry button

Empty states are opportunities for delight — use personality in copy, never "No items found."
