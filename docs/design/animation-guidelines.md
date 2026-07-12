# Animation Guidelines

## Performance Budget

Every animation must justify its cost. The following table defines acceptable techniques for each use case.

| Use Case | Technique | GPU Cost | When to Use |
|----------|-----------|----------|-------------|
| Hover, focus | CSS transitions | Free | Always — default for simple state changes |
| Entrance, exit | Framer Motion variants | Low | Lists, cards, panels |
| Shared layout | Framer Motion layoutId | Low | Card→reader, tile→detail |
| Scroll-driven | Framer Motion useScroll | Low | Parallax, progress, reveals |
| Page transition | Framer Motion AnimatePresence | Low | Route changes |
| Drag, physics | Framer Motion spring | Medium | Pull-to-refresh, reorder |
| Particle background | Three.js Points | Medium | Landing hero only |
| Shader effects | WebGL via R3F | High | Landing hero only, one per page |
| Canvas animation | requestAnimationFrame | Medium | Data visualization only |

## Implementation Priority

Always use the cheapest option first:

1. **CSS transitions** — `transition: transform 150ms ease`, `transition: opacity 150ms ease`
2. **Framer Motion variants** — Pre-defined from motion library
3. **Framer Motion layoutId** — Shared element morphs
4. **Framer Motion useScroll** — Scroll-linked animation
5. **CSS @keyframes** — Continuous animations (spinner, pulse, skeleton)
6. **Three.js / R3F** — Only when 1–5 cannot achieve the effect

## Framer Motion Implementation

### Motion Tokens (src/lib/motion.ts)

All motion tokens are centralized in `src/lib/motion.ts`. Components import from here — never define inline animation values.

```typescript
// Duration
export const MS = { micro: 100, fast: 150, normal: 200, deliberate: 300, slow: 400, narrative: 600 };

// Easing
export const ease = { decelerate: [0.25, 0.1, 0.25, 1], standard: [0.4, 0, 0.2, 1], accelerate: [0.4, 0, 1, 1] };

// Spring presets
export const springs = {
  gentle: { damping: 20, stiffness: 300, mass: 0.5 },
  smooth: { damping: 28, stiffness: 300, mass: 0.8 },
  snappy: { damping: 40, stiffness: 500, mass: 1 },
};

// Variants
export const fadeInUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: MS.normal / 1000, ease: ease.decelerate } } };
export const stagger = { container: { hidden: {}, visible: { transition: { staggerChildren: 0.035 } } } };
```

### Component Pattern

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, stagger } from "@devventory/motion";

export function MyComponent() {
  const reduced = useReducedMotion();

  return (
    <motion.div variants={reduced ? undefined : stagger.container}
      initial={reduced ? undefined : "hidden"}
      animate={reduced ? undefined : "visible"}>
      <motion.div variants={reduced ? undefined : fadeInUp}>
        {/* content */}
      </motion.div>
    </motion.div>
  );
}
```

### Shared Element Pattern

```tsx
// Parent wraps in LayoutGroup
import { LayoutGroup, AnimatePresence } from "framer-motion";

<LayoutGroup>
  {/* Source element */}
  <motion.div layoutId={`item-${item.id}`} />

  {/* Destination element */}
  <AnimatePresence>
    {selected && (
      <motion.div layoutId={`item-${item.id}`} />
    )}
  </AnimatePresence>
</LayoutGroup>
```

## CSS Implementation

### Tailwind Configuration

```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      transitionDuration: {
        'micro': '100ms',
        'fast': '150ms',
        'normal': '200ms',
        'deliberate': '300ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'decelerate': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
};
```

Tailwind classes to use instead of arbitrary values:
- `transition-all duration-150` for hover effects
- `transition-transform duration-200 ease-decelerate` for transforms
- `transition-opacity duration-150` for fade effects

## Reduced Motion

Every animation must degrade gracefully:

| State | Behavior |
|-------|----------|
| Reduced motion enabled | All durations become 0, springs become instant, layoutId morphs skip |
| Data saver | Skip hero WebGL, autoplay videos, large animations |
| High contrast | Remove background animations, keep essential state transitions |
| Touch device | Skip hover-dependent reveals, use tap feedback instead |

Implementation:
```tsx
const reduced = useReducedMotion();
// Pass to child components, gate animation props behind `reduced ? undefined :`
```

## Animation Categories Quick Reference

| Animation | Duration | Easing | Spring | CSS/JS |
|-----------|----------|--------|--------|--------|
| Fade in | 200ms | decelerate | — | JS variant |
| Fade out | 150ms | accelerate | — | JS variant |
| Slide in | 200ms | decelerate | — | JS variant |
| Slide out | 150ms | accelerate | — | JS variant |
| Card hover | 150ms | — | — | CSS |
| Button hover | 150ms | — | — | CSS |
| Focus ring | 150ms | — | — | CSS |
| Morph (open) | — | — | smooth | layoutId |
| Morph (close) | — | — | smooth | layoutId |
| Stagger list | 35ms per child | decelerate | — | JS variant |
| Spinner | 800ms loop | linear | — | CSS keyframes |
| Skeleton | 1500ms loop | — | — | CSS keyframes |
| Progress bar | 300ms | decelerate | — | CSS |
| Toast in | 250ms | decelerate | — | JS variant |
| Toast out | 200ms | accelerate | — | JS variant |

## Testing Animations

- Animations must work at 60fps on a 2019 Intel Mac
- WebGL scenes must hit 30fps minimum on battery
- Reduced motion: verify the UI is fully functional with zero animation durations
- Keyboard navigation: verify focus rings are not animated on reduced motion
- Screen readers: verify `aria-live` regions for content changes that would otherwise be communicated by animation
