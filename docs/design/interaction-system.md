# Interaction System

## Philosophy

Every interaction answers:

- **What changed?** The interface acknowledges input within 100ms.
- **Why did it change?** Motion explains state, effort, result.
- **Where did it come from?** Elements never teleport — they transform, slide, or morph.
- **Where is it going?** The destination is always predictable.

Interactions should never surprise the user. Premium feels predictable.

## State Machine

Every interactive element defines seven states. No component skips states — at minimum, it defines `idle` and `disabled`.

```
Idle → Hover → Pressed → Focused → (Action) → Loading → Success/Error → Idle
```

| State | Trigger | Visual | Duration |
|-------|---------|--------|----------|
| **Idle** | Default | Resting state | — |
| **Hover** | Cursor enters | Lift, glow, or tint | 150ms CSS |
| **Pressed** | Cursor down | Scale 0.97 or brightness 0.95 | 80ms CSS |
| **Focused** | Keyboard focus | Ring 2px offset | 150ms CSS |
| **Loading** | Async action | Spinner, skeleton, or pulse | Animate |
| **Success** | Action completes | Checkmark, brief highlight | 400ms then return |
| **Error** | Action fails | Shake, red glow, error message | 300ms then return |
| **Disabled** | Cannot interact | Opacity 0.4, no pointer events | — |

## Hover Philosophy

Hover communicates interactivity. It should never surprise.

### Card Hover
- Lift 2–4px (`y: -4`)
- Scale 1.015
- Subtle shadow increase
- Border brightness +5%
- Duration: 150ms, ease decelerate
- No rotation, no tilt, no playful bounce

### Button Hover
- Scale 1.02–1.03 (depends on hierarchy)
- Background brightness shift
- Primary: accent gets slightly lighter
- Secondary: border/background subtle change
- No magnetic movement (reserved for landing page CTAs)

### Icon Hover
- Scale 1.05
- Color or opacity shift
- No rotation unless arrow/chevron (rotate toward direction)

### Navigation Hover
- Background tint at 5% accent
- No scaling unless sidebar items
- Active state uses layoutId for smooth indicator glide

### Toolbar Hover
- Opacity 0→1 transition
- Appears naturally, never abruptly
- Toolbar items: icon background fill on hover

### Reduced Motion
When `prefers-reduced-motion` is active, hover effects reduce to opacity/brightness only — no scale, no Y translation.

## Click & Tap

Click and tap produce the same result. There is no mobile/desktop behavioral split.

1. Down: Scale 0.97 for cards, scale 0.95 for buttons
2. Up: Execute action
3. Cancel: If finger/cursor leaves element before release, no action fires
4. Duration: 80ms between down and visual feedback

## Focus & Keyboard

Devventory is keyboard-first by default.

- Tab order follows visual layout (left→right, top→bottom)
- All interactive elements have visible focus rings
- Focus ring: `ring-2 ring-offset-2 ring-accent/50`
- Enter/Space activates focused elements
- Escape closes overlays, dialogs, sheets
- Arrow keys navigate lists, tabs, selection groups
- Cmd+K opens command palette from anywhere

## Selection

Selection communicates current context.

- **Sidebar**: layoutId indicator glides between items
- **Tabs**: layoutId underline slides between tabs
- **List items**: background highlight with left border accent
- **Cards**: border accent + subtle background tint
- **Multi-select**: checkmark overlay + selected state border

## Drag & Drop

Used sparingly. Only for:

- Reordering items in a list
- Moving items between folders
- Organizing sidebar navigation

Visual feedback: ghost element follows cursor, drop target highlights, spring physics on completion.

## Transitions Between States

Never snap. Every state transition animates:

```
Idle → Loading: spinner fades in, content opacity reduces
Loading → Success: spinner becomes checkmark, content returns
Success → Idle: checkmark fades, normal state resumes
Idle → Error: brief shake, error appears via slide down
```

## Feedback Timing

| Feedback type | Appears | Dismisses |
|---------------|---------|-----------|
| Toast | 100ms after action | After 3s or on click |
| Inline error | Instant | On valid input |
| Success checkmark | 150ms after success | 400ms then fade |
| Skeleton | 200ms delay (avoid flash) | Content ready |
| Progress bar | 100ms after start | 200ms after complete |
