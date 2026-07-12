# Motion Language

## Philosophy

Motion in Devventory is communication, never decoration. Every animation must answer a question:

- **What changed?** — Entrance, exit, or state transition
- **Where did it come from?** — Origin, shared layout element, or spatial relationship
- **Where did it go?** — Destination, dismissal, or transformation

If an animation cannot answer these, delete it.

## Animation Categories

Every animation belongs to exactly one category. No hybrid animations.

| Category | Purpose | Examples |
|----------|---------|---------|
| **Entrance** | Element appears in context | Panel slides in, card fades up, list staggers |
| **Exit** | Element leaves context | Panel slides out, overlay fades, item collapses |
| **Hover** | Element acknowledges cursor | Card lifts, button glow, tooltip appears |
| **Selection** | Active state change | Tab underline, sidebar item, focus ring |
| **Navigation** | View transition | Page change, route switch, tab switch |
| **Reader** | Knowledge consumption | Article opens, highlight appears, toolbar fades |
| **Search** | Query interaction | Results appear, filter changes, suggestion list |
| **Capture** | Save flow | URL captures, bookmark saves, extension feedback |
| **Dialogs** | Modal interaction | Overlay opens, confirmation, sheet slides up |
| **Notifications** | Feedback | Toast appears, badge updates, status changes |
| **Scrolling** | Scroll-driven | Parallax, progress bar, chapter transitions |
| **Morphing** | Shape transformation | Card→reader, tile→detail, list→grid |

## Duration Tokens

Duration is determined by distance traveled and importance of the communication.

```typescript
export const duration = {
  instant: 0,           // No animation (reduced motion)
  micro: 100,           // Hover, focus, tiny state changes
  fast: 150,            // Button states, icon rotations
  normal: 200,          // Standard transitions, entrance/exits
  deliberate: 300,      // Panel slides, overlay fades
  slow: 400,            // Morphing, shared layout transitions
  narrative: 600,       // Page transitions, scroll chapters
  cinematic: 1000,      // Hero sequences, milestone celebrations
} as const;
```

## Easing Tokens

Devventory uses three primary easings. Real objects decelerate smoothly — no bounces, no elastic, no linear.

```typescript
export const easing = {
  // Default: objects decelerate naturally
  // Use for: entrances, exits, position changes
  decelerate: [0.25, 0.1, 0.25, 1],

  // Accelerate then decelerate: elements leaving then arriving
  // Use for: dialog animations, sheet transitions
  standard: [0.4, 0, 0.2, 1],

  // Accelerate: elements leaving with urgency
  // Use for: exit animations, dismissals, errors
  accelerate: [0.4, 0, 1, 1],
} as const;
```

Apply as: `transition={{ duration: duration.normal, ease: easing.decelerate }}`

## Spring Configurations

Springs are reserved for physical interactions: drag, pull-to-refresh, shared element morphs, and natural-feeling transitions. Do not use springs for entrances, exits, or hover effects.

```typescript
export const springs = {
  // Light and fast — for small UI elements
  // damping: 20, stiffness: 300, mass: 0.5
  gentle: { type: "spring" as const, damping: 20, stiffness: 300, mass: 0.5 },

  // Default — for shared layout animations, morphs
  // damping: 28, stiffness: 300, mass: 0.8
  smooth: { type: "spring" as const, damping: 28, stiffness: 300, mass: 0.8 },

  // Snappy — for drag interactions
  // damping: 40, stiffness: 500, mass: 1
  snappy: { type: "spring" as const, damping: 40, stiffness: 500, mass: 1 },

  // Slow and deliberate — for large layout shifts
  // damping: 50, stiffness: 200, mass: 2
  deliberate: { type: "spring" as const, damping: 50, stiffness: 200, mass: 2 },
} as const;
```

## Variants Library

Every animation category has defined variants stored in `src/lib/motion.ts`. Components reference variants by name — never inline.

```typescript
// Entrance
export const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easing.decelerate } },
};

export const slideInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: easing.decelerate } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.15, ease: easing.accelerate } },
};

export const slideInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: easing.decelerate } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15, ease: easing.accelerate } },
};

// Scale
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: easing.decelerate } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: easing.accelerate } },
};

// Stagger container
export const stagger = {
  container: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
  },
};

// Card hover (applied via whileHover, not variants)
export const cardHover = { y: -4, scale: 1.015 };
export const navHover = { scale: 1.02 };
export const iconHover = { scale: 1.1 };
export const buttonHover = { scale: 1.03 };
```

## Accessibility

Every animation respects `prefers-reduced-motion`. When reduced motion is active:

- All durations become 0 (instant transitions)
- Springs become duration-based with duration 0
- Variants skip the animation entirely
- Opacity changes remain (fade does not disorient)

Components gate animations behind `useReducedMotion()`:
```typescript
const reduced = useReducedMotion();
// Use reduced ? undefined : animation config
```

## Performance Rules

1. Animate `transform` and `opacity` only. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
2. For height transitions, use `grid-template-rows`.
3. Use CSS transitions for hover and focus states (cheaper than Framer Motion for simple effects).
4. Use Framer Motion for layout animations, shared element transitions, and orchestrated sequences.
5. Spring physics only for shared layout morphs and drag interactions.
6. GPU-heavy effects (WebGL, canvas, shaders) only for hero moments and never for recurring UI.
