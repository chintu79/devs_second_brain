# Landing Page Restructure Plan

## Philosophy (Benji's Family Values)

| Value | How it applies to the landing page |
|-------|--------------------------------------|
| **Simplicity** — gradual revelation, complexity appears when relevant | Each scroll section reveals ONE concept. Hero says one thing. No feature dump grids. Sections unfold like walking through rooms. |
| **Fluidity** — seamless transitions, motion explains navigation | Scroll-triggered stagger entrances. Mockups share a consistent frame so they feel like transforming between screens. Hover effects explain interactivity. |
| **Delight** — selective emphasis, surprise, human moments | Mockups feel alive with hover states, cursor changes, animated counts. A subtle easter egg somewhere. The rediscovery section should feel like a surprise gift. |

## Story Flow (6 Acts)

```
Hero → Capture → Connect → Retrieve → Rediscover → Trust
```

### Act 1 — Hero: "Your brain can only hold so much"
- **Headline**: One line about the pain of losing developer knowledge
- **Subtext**: Acknowledges the problem emotionally
- **Mockup**: Existing workspace mockup is solid — keep it as a hero visual
- **Animation**: Staggered fade-up on text, mockup lifts in with slight delay
- **CTA**: "Get Started" + "See how it works" (scrolls to act 2)

### Act 2 — Capture: "Capture frictionlessly"
- **Headline**: "Save anything in one click"
- **Mockup**: A focused resource/note creation panel with auto-tagging — shows sidebar with vault counts incrementing
- **Animation**: Panel slides in from right (mirrors app behavior)
- **Hover effect**: URL input field glows on focus, tags animate in

### Act 3 — Connect: "Everything is connected"
- **Headline**: "Your knowledge isn't silos — it's a web"
- **Mockup**: Knowledge Inspector panel showing backlinks, connected items, cross-vault references (type-colored icons)
- **Animation**: Connected items stagger-reveal with type-colored left borders
- **Hover effect**: Items lift on hover showing associated context

### Act 4 — Retrieve: "Find anything, instantly"
- **Headline**: "CMD+K and it's there"
- **Mockup**: Spotlight-style search overlay with grouped results (resources, prompts, notes), keyboard nav hints
- **Animation**: Search overlay fades in with scale, results stagger
- **Hover effect**: Results highlight with left accent border on hover

### Act 5 — Rediscover: "Nothing gets lost"
- **Headline**: "What you forgot comes back"
- **Mockup**: A radar/discovery feed showing old resurfaced items with "Saved X months ago" — count badges animate up
- **Animation**: Cards enter from bottom with slight rotation, like dealing cards
- **Delight detail**: A saved date counter morphs from "6 months ago" → a relative time display

### Act 6 — Trust: "Your knowledge, your terms"
- **Headline**: "Open source. Self-hostable. Yours."
- **CTA**: Final call to action with GitHub link
- **Animation**: Simple fade-up, no gimmicks — trust doesn't need flash

## Mockup Design System

All mockups share:
- Same card frame (traffic light dots + title bar + content)
- Same scrollbar styling
- Same type colors for vaults (#6366F1 resources, #14B8A6 radar, #F59E0B prompts, #22C55E notes, #8B5CF6 projects)
- Consistent border, shadow, and spacing

## Animation Vocabulary

- **Section entrance**: `fadeInUp` — opacity 0→1, y 24→0, duration 0.5s, stagger 0.08s per child
- **Mockup entrance**: `scaleIn` — opacity 0→1, scale 0.98→1, duration 0.6s, delay per scroll section
- **Hover**: `scale-[1.02]` on interactive items, `scale-[1.05]` on icons, `opacity` transitions on reveals
- **No bounce/elastic/overshoot** — matches calm design manifesto

## File Changes

- `src/app/page.tsx` — Complete rewrite of sections
- `src/components/landing/hero-entrance.tsx` — Update copy, keep mockup structure
- `src/components/landing/animated-arrow.tsx` — Keep as-is (used in one place or remove if unused)
- `src/components/landing/navbar.tsx` — Keep as-is (already good)

## New Components to Create

None at this stage. Each section will be a simple section element in page.tsx with inline mockup data. If a section grows complex, extract to `src/components/landing/section-*.tsx`.
