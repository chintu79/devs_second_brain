# Devventory Landing — Creative Direction

## 1. Creative Direction Document

### Core Idea
Order from chaos. The page tells one story: fragmented knowledge → organized → findable.

### Emotional Arc
```
Curiosity (Hero) → Recognition (Problem) → Relief (Solution) → Understanding (How it works) → Trust (Why) → Confidence (CTA)
```

### One Sentence
When someone visits devventory.com, they should think "I've been solving knowledge fragmentation the wrong way."

### Metaphor
The page is a magnet. Scattered metal fragments (bookmarks, PDFs, notes) slowly organize as the user scrolls. Each section is a stronger magnetic field. By the bottom, everything is in place.

### Design Vocabulary
- **Dark-first**: #0f1115 background. Not #000. Warm blacks with brown tint, not cold blue-grays.
- **Typography leads**: 70% of communication is text. Headlines are 48-64px. Body is minimal.
- **Motion explains**: Every animation answers "what changed?" or "where did it go?"
- **Product is the hero**: Show the actual interface, not illustrations. The three-panel layout is the brand.

### What we are NOT
- Not Notion (blank canvas, feature grid)
- Not Obsidian (graph visualization as identity)
- Not Readwise (narrow reading column)
- Not Vercel (code snippets as hero)
- We are a **knowledge OS** — organize first, read second, retrieve always.

---

## 2. Moodboard (Written)

### Color Palette
```
Background: #0f1115 (warm near-black)
Surface:    #1b1b1b (card backgrounds)
Border:     rgba(232, 231, 230, 0.10)
Text:       #e8e7e6 (warm off-white)
Secondary:  #8a8a86 (muted foreground)
Accent:     #5B6CFF (brand indigo)
Accent gradient: #6366F1 → #8B5CF6 → #06B6D4 (used ONLY in hero headline + section badges)
Success:    #4dab9a (muted teal-green)
Tag colors per category (muted, not saturated):
  Security:  #ff7369 (muted red)
  Frontend:  #529cca (muted blue)
  Backend:   #4dab9a (muted teal)
```

### Typography Scale
```
H1 hero:    clamp(2.5rem, 5vw, 4.5rem) / 800 weight / -0.03em tracking
H2 section: clamp(2rem, 4vw, 3.5rem) / 700 weight / -0.02em tracking
H3 card:    1rem / 600 weight
Body:       0.9375rem / 400 / 1.6 line-height
Caption:    0.75rem / 500 / secondary color
Micro:      0.6875rem / 500 / muted
```

### Texture / Atmosphere
- No stock photos
- No illustrations of people
- No abstract 3D shapes
- No gradients on UI elements (buttons excepted)
- Ambient glow behind featured content (30px blur, accent color at 5% opacity)
- Cards have flat backgrounds, separated by borders, not shadows
- Shadows only on floating elements (dropdowns, modals, tooltips)

### Spatial Rhythm
- Section padding: 128px top/bottom (py-32)
- Max content width: 1200px (max-w-6xl)
- Text columns: 720px max for readability
- Card gaps: 16px
- Section separator: subtle border or gradient line

---

## 3. Interaction Map

```
Page Load
  │
  ├── Navbar (static, no entrance animation)
  │     ├── Logo (left)
  │     ├── GitHub | Docs | Login | Get Started (right)
  │     └── On scroll: height 56→48, bg blur, no logo scale
  │
  ├── Hero (entrance: stagger 100ms)
  │     ├── Badge "Developer knowledge OS" → fade up (0ms)
  │     ├── H1 "Capture anything. Never lose context." → fade up (100ms)
  │     ├── Supporting text → fade up (200ms)
  │     ├── CTAs → fade up (300ms)
  │     └── Product preview → scale in + fade (400ms)
  │           ├── Chrome buttons (static)
  │           ├── Search bar → fade (600ms delay)
  │           ├── Resource items → slide from left, stagger 100ms each (1000ms+)
  │           ├── Capture prompt dashed border → fade (1500ms)
  │           ├── Reader content → fade up (1200ms)
  │           └── Floating "Captured" badge → scale in (800ms)
  │
  ├── Hero → Problem transition
  │     └── Hero preview crossfades out → Problem icons start scattered
  │
  ├── Problem (scroll-reveal: whileInView)
  │     ├── Badge → fade up (0ms)
  │     ├── H2 → fade up (100ms)
  │     ├── Supporting text → fade up (200ms)
  │     └── 8 tool icons → fly from random positions to center, stagger 60ms each
  │           └── "But context lives nowhere" → fade (after all icons settled)
  │
  ├── Problem → Solution transition
  │     └── Icons blur out → SVG flow diagram draws in
  │
  ├── Solution Flow (scroll-reveal)
  │     ├── Badge + H2 → fade up
  │     ├── 4 step nodes → fade up + slide up, stagger 200ms each
  │     ├── Arrows between nodes → scaleX reveal (after each node)
  │     └── Connecting line → scaleX from center, 1s duration
  │
  ├── Showcase (scroll-reveal + interaction)
  │     ├── Badge + H2 → fade up
  │     ├── Tab bar (static, interactive — user clicks tabs)
  │     │     └── Active tab: bg-card + border + shadow
  │     │     └── Inactive: text-muted, hover brightens
  │     ├── Content panel (AnimatePresence crossfade, 250ms)
  │     │     └── Window chrome (static)
  │     │     └── Content text → fade in
  │     │     └── Meta chips → fade in
  │     └── Progress dots → active dot scales width
  │
  ├── Features (scroll-reveal)
  │     ├── Badge + H2 + supporting text → fade up
  │     └── 6 cards → fade up + slide up, stagger 60ms each
  │           └── Hover: border lightens, subtle lift
  │
  ├── Why Devventory (scroll-reveal)
  │     ├── Badge + H2 → fade up
  │     └── 3 outcome columns → fade up, stagger 100ms each
  │
  ├── CTA (scroll-reveal)
  │     ├── Badge + H2 + text → fade up
  │     ├── CTAs → fade up
  │     └── Gradient line → scaleX reveal
  │
  └── Footer (static)
```

---

## 4. Scroll Storyboard

### Frame 0-100 (Hero — 100vh)
```
┌─────────────────────────────────────────────┐
│  [Navbar]                                     │
│                                               │
│  [badge]  H1: "Capture anything.              │
│            Never lose context."               │
│  [sub]                                        │
│  [CTA]  [CTA]                                 │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │  Knowledge workspace preview             │  │
│  │  [items loading in]                      │  │
│  └─────────────────────────────────────────┘  │
│                                     [badge]▶   │
└─────────────────────────────────────────────┘
```

### Frame 100-200 (Hero → Problem transition)
```
Hero preview fades out (opacity → 0, scale → 0.95)
Problem badge fades in
Gradient line draws across screen
```

### Frame 200-350 (Problem — 90vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "The challenge"                     │
│  H2: "Your knowledge lives everywhere"       │
│                                               │
│     [Bookmarks]   [WhatsApp]   [PDFs]         │
│  [Videos]   [GitHub]   [Chrome]   [Notes]     │
│                                               │
│  "But context lives nowhere."                 │
└─────────────────────────────────────────────┘
```

### Frame 350-500 (Solution — 100vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "How it works"                      │
│  H2: "From scattered fragments to            │
│       connected knowledge"                   │
│                                               │
│     Capture → Understand → Retrieve → Find    │
│      [icon]     [icon]     [icon]    [icon]   │
└─────────────────────────────────────────────┘
```

### Frame 500-700 (Showcase — 120vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "Product Demo"                      │
│  H2: "See it in action"                      │
│                                               │
│  [Extension] [Capture] [Organize] [Reader]    │
│  ┌─────────────────────────────────────────┐  │
│  │  Content panel (tab-based)              │  │
│  │  ...                                     │  │
│  └─────────────────────────────────────────┘  │
│  ● ● ● ● ●                                    │
└─────────────────────────────────────────────┘
```

### Frame 700-850 (Features — 90vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "Everything you need"               │
│  H2: "One place for everything you save"     │
│                                               │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ One- │ │Instant│ │Folder│                  │
│  │ click│ │search │ │tree  │                  │
│  └──────┘ └──────┘ └──────┘                  │
│  ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │ Auto │ │Links │ │Reader│                  │
│  │ tags │ │      │ │      │                  │
│  └──────┘ └──────┘ └──────┘                  │
└─────────────────────────────────────────────┘
```

### Frame 850-950 (Why — 70vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "Why Devventory"                    │
│  H2: "A knowledge OS, not another tool"      │
│                                               │
│  One place    Find anything  Never lose       │
│                           context             │
└─────────────────────────────────────────────┘
```

### Frame 950-1050 (CTA — 70vh)
```
┌─────────────────────────────────────────────┐
│  [badge] "Get started"                       │
│  H2: "Start saving what matters"             │
│  "Free. Open source."                         │
│  [Get Started]  [Sign in]                     │
└─────────────────────────────────────────────┘
```

### Frame 1050+ (Footer)
```
┌─────────────────────────────────────────────┐
│  Devventory  GitHub                          │
│  © 2026 Devventory. Open source.             │
└─────────────────────────────────────────────┘
```

---

## 5. Wireframes

### Desktop (1200px+)
```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                    [GitHub] [Docs] [Login] [CTA]  │
│                                                          │
│  ┌─────────────── text (40%) ──────────┬── preview ──┐  │
│  │ [badge]                             │ ┌──────────┐ │  │
│  │                                      │ │          │ │  │
│  │ Capture anything.                    │ │ Workspace│ │  │
│  │ Never lose context.                  │ │ Preview  │ │  │
│  │                                      │ │          │ │  │
│  │ One place for every link...          │ │          │ │  │
│  │                                      │ └──────────┘ │  │
│  │ [Get Started →] [Sign in]            └──────────────┘  │
│  └──────────────────────────────────────────────────────────┘
│                                                          │
│  [badge] The challenge                                   │
│  Your knowledge lives everywhere                          │
│     [Bookmarks] [WhatsApp] [PDFs] [Videos]                │
│     [Chrome]    [GitHub]  [Notes] [Email]                 │
│  But context lives nowhere.                               │
│  ────────── gradient line ──────────                      │
│                                                          │
│  [badge] How it works                                     │
│  From scattered fragments to connected knowledge          │
│   Capture  ──→  Understand  ──→  Retrieve  ──→  Reconnect │
│                                                          │
│  [badge] Product Demo                                     │
│  [Extension] [Capture] [Organize] [Reader] [Search]       │
│  ┌──────────────────────────────────────────────────────┐│
│  │  Tab content panel                                    ││
│  │                                                      ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  [badge] Everything you need                              │
│  ┌──────┐ ┌──────┐ ┌──────┐                              │
│  │[icon]│ │[icon]│ │[icon]│                              │
│  │Title │ │Title │ │Title │                              │
│  └──────┘ └──────┘ └──────┘                              │
│  ┌──────┐ ┌──────┐ ┌──────┐                              │
│  │[icon]│ │[icon]│ │[icon]│                              │
│  │Title │ │Title │ │Title │                              │
│  └──────┘ └──────┘ └──────┘                              │
│                                                          │
│  [badge] Why Devventory                                   │
│   One place    Find anything    Never lose context        │
│                                                          │
│  [badge] Get started                                      │
│  Start saving what matters                                │
│  [Get Started →]  [Sign in]                               │
│                                                          │
│  Devventory                                  GitHub       │
│  © 2026 Devventory. Open source.                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌─────────────────────┐
│ [LOGO]       [☰]    │
│                      │
│ [badge]              │
│ Capture anything.    │
│ Never lose context.  │
│                      │
│ One place for        │
│ every link...        │
│                      │
│ [Get Started →]      │
│ [Sign in]            │
│                      │
│ ┌─────────────────┐ │
│ │ Workspace        │ │
│ │ Preview (stacked)│ │
│ └─────────────────┘ │
│                      │
│ [badge]              │
│ Your knowledge       │
│ lives everywhere     │
│                      │
│ [Bookmarks]          │
│ [WhatsApp]           │
│ [PDFs] [Videos]      │
│ ...                  │
│                      │
│ [badge]              │
│ From scattered...    │
│                      │
│ Capture              │
│   ↓                  │
│ Understand           │
│   ↓                  │
│ Retrieve             │
│   ↓                  │
│ Reconnect            │
│                      │
│ [badge]              │
│ [Tab] [Tab] [Tab]    │
│ ┌─────────────────┐ │
│ │ Content panel    │ │
│ └─────────────────┘ │
│                      │
│ Cards stack 1-col    │
│                      │
│ 3 outcome cols       │
│ stack vertically     │
│                      │
│ [Get Started →]      │
│                      │
│ footer               │
└─────────────────────┘
```

---

## 6. Motion Specification

### Core Principles
1. **Continuity**: No hard section cuts. Elements crossfade or morph between sections.
2. **Physics**: All motion uses spring or decelerate easing. No linear animations (except SVG path drawing).
3. **Stagger**: Lists/cards use 40-80ms stagger. Sections use 100-200ms.
4. **Duration**: Micro-interactions 150ms. Entrances 400-600ms. Story transitions 800-1000ms.
5. **Scale**: Hover lifts are 1.01-1.02 max. Never 1.05+.

### Easing Reference
```
Micro (buttons, tabs):    150ms, ease: [0.25, 0.1, 0.25, 1]
Entrance (sections):      500ms, ease: [0.0, 0.0, 0.2, 1] (decelerate)
Reveal (scroll triggers): 400ms, ease: [0.0, 0.0, 0.2, 1]
Exit:                     200ms, ease: [0.4, 0.0, 1, 1] (accelerate)
SVG draw:                 800ms, ease: linear
Spring (micro):           stiffness: 300, damping: 30
Spring (cards):           stiffness: 200, damping: 25
```

### Motion by Element

| Element | Trigger | Duration | Easing | Note |
|---------|---------|----------|--------|------|
| Hero badge | page load | 500ms | decelerate | y: -12→0 |
| Hero H1 | page load | 500ms | decelerate | delay 100ms |
| Hero sub | page load | 500ms | decelerate | delay 200ms |
| Hero CTAs | page load | 400ms | decelerate | delay 300ms |
| Hero preview | page load | 600ms | spring (150, 20) | scale 0.95→1, delay 400ms |
| Preview items | page load | 350ms | decelerate | stagger 100ms, x: -12→0, delay 1000ms+ |
| Floating badge | page load | 400ms | spring (200, 20) | scale 0.9→1, y: 8→0, delay 800ms |
| Section badges | scroll | 400ms | decelerate | y: 12→0 |
| Section H2 | scroll | 500ms | decelerate | y: 20→0, delay 100ms |
| Problem icons | scroll | 400ms | spring (250, 25) | stagger 60ms, fly from random |
| Solution nodes | scroll | 400ms | decelerate | stagger 200ms, y: 24→0 |
| Solution arrows | scroll | 400ms | decelerate | scaleX 0→1, delay per node |
| Tab content | click | 250ms | decelerate | AnimatePresence crossfade, y: 12→0 |
| Feature cards | scroll | 400ms | decelerate | stagger 60ms, y: 20→0 |
| Outcome cards | scroll | 400ms | decelerate | stagger 100ms |
| CTA section | scroll | 500ms | decelerate | batch entrance |
| Gradient lines | scroll | 800-1000ms | decelerate | scaleX from center |
| Navbar shrink | scroll | 200ms | standard | height 56→48 |
| Button hover | hover | 150ms | standard | scale 1.02, shadow intensify |

### Reduced Motion
- Skip all entrance animations (opacity 1, transform none)
- Skip stagger (all elements visible immediately)
- Keep scroll-positioned reveals but without transform
- Keep hover effects (scale, shadow)
- Use `useReducedMotion()` from framer-motion on every animated component

---

## 7. Animation Timeline

```
T=0ms       Page load: HTML renders
T=100ms     Navbar visible (no animation)
T=100ms     Hero start: container visible, stagger begins
T=100ms     Badge fades up
T=200ms     H1 fades up
T=300ms     Subtext fades up
T=400ms     CTAs fade up
T=500ms     Hero preview scale in begins (600ms duration)
T=900ms     Floating badge springs in (captured notification)
T=1100ms    Search bar fades in
T=1200ms    Resource item 1 slides in (x: -12→0)
T=1300ms    Resource item 2 slides in
T=1400ms    Resource item 3 slides in
T=1500ms    Reader content fades up
T=1600ms    Capture prompt (dashed border) fades in
            │
            ── User scrolls ──
            │
Scrolled 1   Section badges + H2 fade up
viewport     │
            ── User scrolls ──
            │
Scrolled 2   Problem icons fly in from random positions
viewports    Pivot text fades in after icons settle
            │
            ── User scrolls ──
            │
Scrolled 3   Solution flow nodes stagger in
viewports    Arrows draw sequentially
            │
            ── User scrolls ──
            │
Scrolled 4   Showcase tab bar visible
viewports    First content panel animates in
            (tabs interactive on click)
            │
            ── User scrolls ──
            │
Scrolled 5   Feature cards stagger in from bottom
viewports    │
            ── User scrolls ──
            │
Scrolled 6   Outcome cards fade up
viewports    │
            ── User scrolls ──
            │
Scrolled 7   CTA section fades in
viewports     Gradient line draws
```

---

## 8. Typography System

### Font Stack
```css
--font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", Menlo, monospace;
```

Inter is already loaded via `@fontsource/inter` (400, 500, 600, 700). This is sufficient. Geist would be a ~0.2s improvement in brand distinctiveness but not worth the additional font download for MVP.

### Scale
```
Level        Size/Weight/Leading           Tracking    Used For
───
Display      clamp(2.5rem,5vw,4.5rem)/800   -0.03em    Hero H1 only
             /1.05
Heading 1    clamp(2rem,4vw,3.5rem)/700     -0.02em    Section H2
             /1.1
Heading 2    clamp(1.5rem,2.5vw,2rem)/600   -0.01em    Showcase titles
             /1.2
Heading 3    1rem/600/1.3                    normal     Card titles
Body         0.9375rem/400/1.6               normal     Feature/card body
Small        0.8125rem/500/1.5               normal     Labels, badges
Caption      0.75rem/500/1.4                 normal     Meta, timestamps
Micro        0.6875rem/500/1.3               0.02em     Tab labels, tiny text
```

### Rules
- Max 2 heading levels per section
- Heading must be followed by body or CTAs — never another heading
- Minimum body text per section (aim for 1-2 sentences max)
- Caption text for metadata should be 0.75rem at 50% opacity

---

## 9. Color System

### Backgrounds
```
Canvas:       #0f1115 (warm near-black)
Surface-1:    #141414 (sidebar, receded)
Surface-2:    #1b1b1b (card backgrounds)
Surface-3:    #222222 (secondary sections, hover)
Surface-4:    #282828 (floating elements)
```

### Text
```
Primary:      #e8e7e6 (headings, body)
Secondary:    #a8a5a6 (labels, secondary text)
Muted:        #929390 (metadata, captions)
Disabled:     #6d6d6a (placeholder, disabled)
```

### Borders
```
Default:      rgba(232, 231, 230, 0.10)
Hover:        rgba(232, 231, 230, 0.20)
Active:       rgba(232, 231, 230, 0.30)
```

### Accent
```
Brand:        #5B6CFF (interactive elements)
Brand hover:  #4E5EF7
Brand soft:   rgba(91, 108, 255, 0.12)
Brand ring:   rgba(91, 108, 255, 0.30)

Gradient (hero only):
  from:       #6366F1 (indigo)
  via:        #8B5CF6 (purple)
  to:         #06B6D4 (cyan)
```

### Semantic Tag Colors
```
Security:  text: #ff7369, bg: color-mix(in srgb, #ff7369 20%, #1b1b1b)
Frontend:  text: #529cca, bg: color-mix(in srgb, #529cca 20%, #1b1b1b)
Backend:   text: #4dab9a, bg: color-mix(in srgb, #4dab9a 20%, #1b1b1b)
Design:    text: #e255a1, bg: color-mix(in srgb, #e255a1 20%, #1b1b1b)
General:   text: #9b9a97, bg: color-mix(in srgb, #9b9a97 20%, #1b1b1b)
```

### Light Theme (for theme toggle users)
```
Canvas:       #FAFAF8
Text:         #242424
Card:         #FFFFFF
Accent:       #5B6CFF (same)
All other tokens invert per the existing globals.css
```

---

## 10. Performance Plan

### Current Bundle Baseline
```
Framework: Next.js 16 (server components by default)
Animation: framer-motion (already installed)
Icons:     lucide-react (tree-shakeable)
Font:      Inter via @fontsource (subset, preloaded)
```

### Targets
```
Lighthouse Performance: 95+
Lighthouse Accessibility: 100
Lighthouse Best Practices: 100
Lighthouse SEO: 100
First Contentful Paint: <1.5s
Largest Contentful Paint: <2.0s
Total Bundle JS: <150KB (excluding Next.js runtime)
Cumulative Layout Shift: 0
```

### Strategy

| Concern | Approach |
|---------|----------|
| Font loading | Inter preloaded via next/font. Subset Latin. Swap fallback. |
| Images | No images on landing page. Everything is SVG/CSS. |
| Framer Motion | Tree-shaken by Next.js. Only used components included. |
| R3F | NOT added. CSS gradients + framer-motion achieve the same atmosphere without 200KB+ overhead. If 3D is essential later, load dynamically via `next/dynamic` with `ssr: false`. |
| Rive | NOT added. Button interactions handled by CSS transitions + framer-motion. Rive adds ~150KB for functionality we already have. |
| GSAP | NOT added. Framer-motion covers all animation needs. GASP adds ~100KB for overlapping API. |
| Lazy loading | All sections below-the-fold use `whileInView` (IntersectionObserver) — no JS runs until needed. |
| Code splitting | Each landing section is a separate component. Next.js automatically code-splits. |
| Bundle analysis | Monitor via `@next/bundle-analyzer` before merge. |
| Animation cleanup | `useReducedMotion()` on every animated component. CSS `@media (prefers-reduced-motion: reduce)` as backup. |

### What we lose by skipping R3F, Rive, GSAP
1. **3D particles in hero** → Replaced by: floating card elements using framer-motion with parallax on mouse move (lightweight, same visual effect)
2. **Rive button animations** → Replaced by: CSS transitions + framer-motion spring. Buttons already have hover scale + shadow. This is sufficient.
3. **GSAP scroll timeline** → Replaced by: framer-motion `whileInView` with staggered children. More React-idiomatic, same result.

---

## 11. Accessibility Checklist

### Motion & Animation
- [ ] `useReducedMotion()` checked on every animated component
- [ ] All animations degrade gracefully (opacity 1, transform none)
- [ ] No parallax or scroll-jacking when reduced motion preferred
- [ ] No auto-playing animations (only scroll-triggered or interaction-triggered)
- [ ] Animation durations respect `--motion-duration` if customized

### Navigation
- [ ] Navbar is keyboard-navigable (Tab order: logo → GitHub → Docs → Login → CTA)
- [ ] All buttons have visible focus rings
- [ ] Skip-to-content link (hidden, visible on Tab)
- [ ] No horizontal scroll at any viewport width

### Content
- [ ] Heading hierarchy: one H1 per page, H2 for sections, H3 for cards
- [ ] All icons have `aria-hidden="true"` + fallback text if needed
- [ ] All interactive elements have accessible names
- [ ] Color is never the only indicator of meaning (icons + text + color)

### Screen Readers
- [ ] Section badges are `<span>` elements (not headings)
- [ ] Tab panel uses `role="tablist"`, `role="tab"`, `role="tabpanel"` with `aria-selected`
- [ ] Progress dots have `aria-label` per dot
- [ ] CTAs are `<a>` elements linking to real routes

### Color & Contrast
- [ ] All text/background combinations pass WCAG AA 4.5:1 (existing design system already verified)
- [ ] Tag colors include both text and background (not just color coding)
- [ ] Focus indicators use 3px ring with offset

### Performance AT
- [ ] No `@keyframes` with `infinite` (prevents vestibular triggers)
- [ ] Scroll-triggered animations only fire once (`viewport={{ once: true }}`)
- [ ] Lighthouse Accessibility: 100 target

---

## Dependency Tradeoff Summary

| Library | Spec'd? | Adding? | Reason |
|---------|---------|---------|--------|
| React Three Fiber | Yes (hero particles) | No | CSS + framer-motion + SVG achieves same atmosphere. R3F adds ~200KB. If 3D becomes essential, lazy-load later. |
| Rive | Yes (buttons, icons) | No | CSS transitions + framer-motion handle buttons. Rive adds ~150KB for marginal improvement. |
| GSAP | Yes (complex timelines) | No | framer-motion's `whileInView` + `stagger` covers all scroll storytelling. GSAP adds ~100KB. |
| Geist font | Yes (spec) | No | Inter already loaded. Geist adds ~80KB font download. Distinctiveness gain is marginal for MVP. |
| framer-motion | No (spec doesn't mention) | Already have | All animations done via framer-motion. It's already in the bundle. |
| lucide-react | No | Already have | Icons. Already in bundle. |

**Verdict**: Zero new dependencies. Zero bundle size increase. Frameworks already in the project handle the full spec.
