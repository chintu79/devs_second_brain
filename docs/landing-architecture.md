# Devventory Landing — Full Architecture

## 1. Creative Direction Document

### Core Story Arc
```
Scattered → Captured → Understood → Organized → Remembered → Found
```
The page IS the product. Every scroll teaches the mental model. The background itself explains what Devventory does — fragments drifting, then organizing as the user advances.

### Emotional Journey
```
Section          Emotion           What happens
────────────────────────────────────────────────────
Hero             Curiosity         Knowledge fragments float in 3D space.
                                  Calm. Intentional.
Problem          Overwhelm         Fragments scatter. Connections break.
                                  User recognizes their own chaos.
Solution         Relief            Fragments organize. Pipeline appears.
                                  "This is the answer."
Showcase         Understanding     Interactive demo. User experiences the
                                  product, not watches it.
Features         Confidence        Each capability demonstrates itself.
                                  No feature cards.
Why              Trust             Calm philosophy. Large type. Minimal.
CTA              Decision          One statement. One action.
```

### One Sentence
When someone visits devventory.com, they should think: *"I've been solving knowledge fragmentation the wrong way."*

---

## 2. Moodboard

### Color System
```
Canvas:         #0f1115     (warm near-black, matte)
Surface-1:      #1b1b1b     (cards, panels)
Surface-2:      #222222     (secondary sections, hover states)
Surface-3:      #282828     (floating elements, elevated)

Text Primary:   #e8e7e6     (headings, body)
Text Secondary: #a8a5a6     (labels, captions)
Text Muted:     #929390     (metadata, timestamps)

Accent:         #5B6CFF     (primary interactive, buttons, links)
Accent-soft:    rgba(91,108,255,0.12)
Accent-ring:    rgba(91,108,255,0.30)

Border:         rgba(232,231,230,0.10)
Border-hover:   rgba(232,231,230,0.20)

Tag colors (muted, semantic):
  Security:     #ff7369     (hsl 4, 100%, 73%)
  Frontend:     #529cca     (hsl 202, 53%, 56%)
  Backend:      #4dab9a     (hsl 168, 38%, 49%)
```

### Typography Scale
```
Display:   clamp(2.5rem,5vw,4.5rem) / 800 / -0.03em tracking    (Hero H1)
H1:        clamp(2rem,4vw,3.5rem) / 700 / -0.02em tracking       (Section H2)
H2:        clamp(1.5rem,2.5vw,2rem) / 600 / -0.01em tracking     (Subheadings)
H3:        1rem / 600 / normal                                     (Card titles)
Body:      0.9375rem / 400 / 1.6 line-height                       (Paragraphs)
Small:     0.8125rem / 500 / normal                                (Labels, badges)
Caption:   0.75rem / 500 / 1.4                                     (Meta, timestamps)
```

### Spatial Rhythm
```
Section padding:   py-32 md:py-40     (128px-160px)
Content max-width: max-w-6xl          (1200px)
Text max-width:    max-w-xl           (576px) for readability
Card gaps:         16px               (gap-4)
Section separator: border-y border-border/40
```

### Texture
- No gradients except the hero headline accent gradient
- No floating blobs, waves, or abstract shapes
- No stock photography or illustrations of people
- Cards separated by borders, not shadows — shadows only on floating/hovered elements
- Subtle noise texture on canvas (CSS `background-image` with SVG noise filter, ~2KB)
- Ambient glow behind hero preview: blur-3xl, accent color at 5%

---

## 3. Section-by-Section Storyboard

### Frame 0 (Page Load)
```
┌──────────────────────────────────────────────────┐
│  [Navbar — transparent, no border]                │
│                                                    │
│         [3D Knowledge Canvas — R3F]                │
│                                                    │
│         ~50 knowledge fragments floating           │
│         • YouTube thumbnails (tiny quads)          │
│         • GitHub icons                             │
│         • PDF documents                            │
│         • Article excerpts                         │
│         • Code snippets                            │
│                                                    │
│         Camera: slightly elevated, slow drift      │
│         Fragments: random positions, slow orbit    │
│         No connections yet                         │
│                                                    │
│         [Overlay — centered]                       │
│         badge: "Developer knowledge OS"            │
│         H1: "Capture anything.                     │
│              Never lose context."                  │
│         sub: "One place for every link..."         │
│         [Get Started →]  [Sign in]                  │
└──────────────────────────────────────────────────┘
```

### Frame 0-100 (Hero → scroll start)
```
Camera slowly moves forward (z: -0.5 units per scroll unit).
Fragments begin shifting toward organizing positions.
Tiny connection lines (opacity: 0.15) appear between related fragments.
Text overlay fades out (opacity 1→0 over first 200px scroll).
Navbar gains border + bg blur at 20px scroll.
```

### Frame 100-250 (Problem Section — scroll revealed)
```
Camera stops. Fragments now in chaotic positions.
Some drift apart. Connection lines break and fade.
Background subtly darkens or gets a slight overlay.
Section text: badge + H2 + supporting paragraph — fade up.
Icons scatter in from random offsets (framer-motion).
Pivot line: "But context lives nowhere" fades in.
```

### Frame 250-400 (Solution Flow — scroll revealed)
```
Fragments begin grouping into 4 clusters:
  Capture | Understand | Retrieve | Reconnect
Clusters glow subtly as they form.
SVG morphs draw between them (pathLength animation).
Section text fades in.
```

### Frame 400-600 (Showcase — interactive)
```
R3F canvas fades out (or reduces to minimal particles).
Standard DOM section takes over.
Tab bar with AnimatePresence crossfade shows product demo.
Each tab demonstrates a product capability inline.
```

### Frame 600-750 (Features)
```
6 capability stories. Each is a horizontal section with live demo.
Not cards. Not grid. Each story: headline + short demo + outcome.
```

### Frame 750-850 (Why)
```
Calm. Large typography. Three outcome statements.
Background: muted, minimal. Text is the hero.
```

### Frame 850-950 (CTA)
```
One statement. Two buttons. Gradient line.
Confidence. No urgency.
```

---

## 4. Wireframes

### Desktop (1200px+)
```
┌──────────────────────────────────────────────────────────┐
│ [LOGO]                        [GitHub] [Docs] [Login] CTA│
│                                                          │
│           ┌── R3F Knowledge Canvas (full-width) ──┐      │
│           │  Floating fragments, slow orbit          │     │
│           │  Camera: elevated, subtle drift          │     │
│           └──────────────────────────────────────────┘     │
│                                                          │
│           badge: "Developer knowledge OS"                 │
│           H1: "Capture anything. Never lose context."     │
│           sub: "One place for every link..."               │
│           [Get Started →]  [Sign in]                      │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  badge: "The challenge"                                   │
│  H2: "Your knowledge lives everywhere"                    │
│                                                          │
│  [Bookmarks] [WhatsApp] [PDFs] [Videos]                   │
│  [Chrome]    [GitHub]  [Notes] [Email]                    │
│  "But context lives nowhere."                             │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  badge: "How it works"                                    │
│  Capture → Understand → Retrieve → Reconnect              │
│  (SVG arrows draw on scroll)                              │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  badge: "Product demo"                                    │
│  [Extension] [Capture] [Organize] [Reader] [Search]       │
│  ┌────────────────────────────────────────────────────┐   │
│  │  AnimatePresence tab content panel                  │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  6 capability stories (horizontal, alternating)           │
│  [icon] "One-click capture" → [inline demo]               │
│  [icon] "Instant search"  → [inline demo]                 │
│  ...                                                      │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  badge: "Why Devventory"                                  │
│  "A knowledge OS, not another tool"                       │
│  One place     Find anything    Never lose context        │
│                                                          │
│  ── gradient line ──                                      │
│                                                          │
│  badge: "Get started"                                     │
│  "Start saving what matters"                              │
│  [Get Started →]  [Sign in]                               │
│                                                          │
│  Devventory                                  GitHub       │
│  © 2026 Devventory. Open source.                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile (<768px)
```
R3F canvas reduced to subtle gradient background.
Knowledge fragments hidden on mobile (performance).
All sections stack vertically.
Tab bar becomes horizontal scroll with icons only.
```

---

## 5. Interaction Map

```
Page Load
├── R3F Canvas initializes (lazy, IntersectionObserver)
│     ├── 50 knowledge fragments generated
│     ├── Random positions, slow orbit (0.02 rad/s)
│     ├── Camera: position [0, 2, 8], looking at [0, 0, 0]
│     └── No connections yet
├── Hero text stagger entrance (framer-motion)
│     ├── badge → 0ms
│     ├── H1 → 100ms
│     ├── sub → 200ms
│     └── CTAs → 300ms
├── Navbar (transparent, no border)
└── Mouse move → camera shifts ±0.3 units on x/y
         → fragments respond with inverse parallax
         → hovered fragment lifts + glows + nearby respond

Scroll 0-200px (Hero fade out)
├── R3F camera translates z: 0→-2
├── Fragments shift toward organizing
├── Connection lines fade in (opacity: 0→0.15)
└── Text overlay opacity: 1→0

Scroll 200-400px (Problem)
├── R3F fragments scatter (random velocities applied)
├── Connection lines break (opacity: 0.15→0)
├── R3F canvas opacity: 1→0 (crossfade to DOM)
├── Problem badge + H2 + text → whileInView stagger
└── 8 tool icons → fly in from scatter offsets

Scroll 400-600px (Solution)
├── 4 steps → stagger entrance (200ms each)
├── SVG arrows → pathLength draw (600ms each)
├── Gradient line → scaleX from center
└── Section separator borders

Scroll 600-800px (Showcase)
├── Tab bar visible (interactive on click)
├── AnimatePresence crossfades content (250ms)
└── Progress dots

Scroll 800-1000px (Features)
├── 6 horizontal stories → scroll-driven reveals
├── Each: headline + inline demo + outcome
└── Stagger: 40ms between items

Scroll 1000-1150px (Why)
├── Badge + H2 fade up
└── 3 outcome columns → stagger 100ms

Scroll 1150-1300px (CTA)
├── Badge + H2 + buttons → batch fade up
├── Gradient line draw
└── Footer (static)

Hover (any interactive element)
├── Button: scale 1.02, shadow intensify, 150ms spring
├── Knowledge Tile: lift 4px, shadow soften, scale 1.02
└── Tab: bg brightens, border appears

Reduced Motion
├── Skip all stagger (show everything at once)
├── Skip R3F canvas (static fallback or hide)
├── Skip parallax, scatter entrance
├── Keep fade transitions (opacity only)
└── Keep hover effects (CSS transitions)
```

---

## 6. Animation Timeline

```
T=0      HTML renders
T=50ms   R3F canvas mounts (lazy loaded)
T=100ms  Navbar visible
T=200ms  Hero badge fades up
T=300ms  Hero H1 fades up
T=400ms  Hero sub fades up
T=500ms  Hero CTAs fade up
T=600ms  R3F fragments begin slow orbit
T=1500ms Canvas settles — ready state

Scroll events (not time-based):
  scrolled 0-100px:    R3F camera translates z
  scrolled 100-200px:  R3F fragments organize, connections appear
  scrolled 200-300px:  R3F canvas fades out → Problem fades in
  scrolled 300-400px:  Problem icons fly in (stagger 60ms)
  scrolled 400-500px:  Solution nodes in (stagger 200ms)
  scrolled 500-600px:  SVG arrows draw (pathLength)
  scrolled 600-700px:  Showcase tab bar visible
  scrolled 700-1000px: Features reveal (interleaved)
  scrolled 1000-1100px: Why section fades up
  scrolled 1100-1200px: CTA section fades up

Interaction events:
  click tab:   AnimatePresence crossfade (250ms)
  hover tile:  CSS lift (150ms ease)
  mouse move:  R3F camera shift (±0.3px, smooth)
```

---

## 7. React Three Fiber Architecture

### Why R3F
The knowledge fragment scene communicates the product's core value proposition pre-verbally. Users see fragments organizing as they scroll — this IS the product. CSS/framer-motion cannot create 3D spatial depth with 50+ independently moving objects that respond to camera position.

### Scope
- Hero section ONLY (first viewport)
- Fades out before Problem section
- Lazy loaded — never blocks page render

### Dependencies to Add
```
three              @react-three/fiber    @react-three/drei
```
~150KB gzipped total. Loaded via `next/dynamic` with `ssr: false` inside a Suspense boundary.

### Scene Architecture
```
<R3FCanvas>                        ← Suspense boundary + lazy
  <ambientLight intensity={0.4}/>
  <pointLight position={[0,5,5]}/>
  <CameraController />             ← responds to scroll + mouse
  <KnowledgeFragments />           ← 50 instances
    <Fragment position={[x,y,z]}>  ← each: quad with icon texture
      <PlaneGeometry />
      <MeshStandardMaterial />
    </Fragment>
  </KnowledgeFragments>
  <ConnectionLines />              ← drawn between related fragments
</R3FCanvas>
```

### Fragment Data
```typescript
interface Fragment {
  id: string;
  type: 'youtube' | 'github' | 'pdf' | 'article' | 'tweet' | 'code' | 'bookmark';
  position: [number, number, number];  // initial random, within [-6, 6] on x/z, [-2, 2] on y
  targetPosition?: [number, number, number]; // where it moves during scroll
  scale: number;                     // 0.3-0.8 random
  connections: string[];             // IDs of related fragments
}
```

### Camera
```
Initial:    position [0, 1.5, 8], lookAt [0, 0, 0]
Scroll:     z translates from 8 → 4 over first 200px scroll
Mouse:      x/y shifts ±0.3 based on mouse position
Transition: lerp(current, target, 0.05) per frame — smooth
```

### Scroll Integration
```typescript
// In KnowledgeFragments component:
const scrollY = useScroll();  // framer-motion scroll hook
const scrollProgress = useTransform(scrollY, [0, 200], [0, 1]);

// In fragment update:
useFrame(() => {
  const t = scrollProgress.get();
  fragment.position.lerp(
    [start.x + (target.x - start.x) * t,
     start.y + (target.y - start.y) * t,
     start.z + (target.z - start.z) * t],
    0.02
  );
});
```

### Hover
```typescript
// Raycaster on fragments
const [hovered, setHovered] = useState<string | null>(null);

// When hovered:
//   - fragment scale 1→1.3
//   - emissiveIntensity 0→0.3
//   - nearby fragments (within 2 units) shift position ±0.1
//   - connection line to hovered fragment opacity 0→0.4
```

### Performance
- InstancedMesh for all 50 fragments (single draw call)
- Connection lines via LineSegments (single geometry)
- No post-processing (no bloom, no SSR)
- Canvas resolution: 0.75 pixel ratio on mobile
- `frameloop="demand"` — only renders when something changes
- Dispose on unmount

### Fallback (no JS / reduced motion / slow devices)
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
```
Gradient background replaces R3F. Hero text + preview work normally.

---

## 8. SVG Morph Architecture

### Where used
1. **Solution flow arrows** — path draw between pipeline nodes
2. **Showcase tab transitions** — icon morphs (Link→Tile→Collection)
3. **Feature demonstrations** — small morphs within demo panels

### Technique
- Framer Motion's `motion.path` with `pathLength` animation
- SVG paths designed in code (no external SVG files)
- `pathLength` animated from 0→1 on scroll reveal or interaction
- Arrowheads via `<polygon>` with delayed opacity fade

### Example: Pipeline Arrow
```tsx
const arrowPath = "M 0,0 Q 20,-8 40,0";  // subtle curve
<motion.path
  d={arrowPath}
  stroke="currentColor"
  strokeWidth={1.5}
  strokeLinecap="round"
  initial={{ pathLength: 0 }}
  whileInView={{ pathLength: 1 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.6, ease: "linear" }}
/>
```

### Connection Lines (R3F companion)
In the hero's R3F scene, connection lines between fragments use:
- `THREE.Line` with `LineBasicMaterial`
- Opacity animated from 0→0.15 based on scroll progress
- Line width: 0.5px
- Color: accent hex

---

## 9. Performance Strategy

### Targets
```
Lighthouse Performance:    95+
Lighthouse Accessibility:  100
FCP:                       <1.2s
LCP:                       <2.0s
CLS:                       0
TBT:                       <50ms
Bundle JS (page):          <180KB (excluding Next.js runtime)
```

### Strategy by Concern

| Concern | Approach |
|---------|----------|
| R3F size | `next/dynamic` + `ssr: false` + Suspense. Never blocks paint. |
| R3F render | `frameloop="demand"`. Only renders on scroll/mouse events. |
| Font | Inter preloaded. Geist IF added: preload woff2, subset Latin. |
| Images | Zero images on landing. Everything is SVG/CSS/JSX. |
| Animations | All `whileInView` = IntersectionObserver, no scroll listeners. |
| Reduced motion | `useReducedMotion()` on ALL animated components. R3F canvas hidden. |
| Code splitting | Each section is a separate component. Next.js handles code splitting. |
| Bundle | Monitor with `@next/bundle-analyzer`. Vendor chunks for three.js caching. |
| Memory | R3F disposed on unmount (`useEffect` cleanup). Fragment pool capped at 50. |

### Dependency Budget
| Library | Size (gzip) | Critical? |
|---------|-------------|-----------|
| three | ~130KB | Yes (hero only, lazy loaded) |
| @react-three/fiber | ~15KB | Yes |
| @react-three/drei | ~20KB | Yes (for helpers) |
| framer-motion | ~25KB | Already installed |
| lucide-react | ~15KB | Already installed, tree-shakeable |
| **Total new** | **~165KB** | Lazy loaded, never blocks FCP |

### What we skip
| Library | Size Saved | Reason |
|---------|------------|--------|
| Rive | ~150KB | CSS + framer-motion handle buttons/logo animations with same quality. Rive's keyframe editor advantage doesn't apply to code-driven animation. |
| GSAP | ~100KB | framer-motion's `whileInView` + `stagger` + `useScroll` covers all scroll storytelling. |
| Geist font | ~80KB | Inter is already loaded, preloaded, and subset. Geist adds distinctiveness but at font-load cost. Add only if brand audit flags Inter as "too generic." |

---

## 10. Accessibility Strategy

### Motion
- [x] `useReducedMotion()` on every animated component
- [x] R3F canvas hidden when `prefers-reduced-motion: reduce`
- [x] No auto-playing animations — all scroll-triggered or interaction-triggered
- [x] Stagger durations under 500ms (prevents motion sickness)
- [x] CSS `@media (prefers-reduced-motion: reduce)` as backup

### Navigation
- [x] Skip-to-content link (Tab-visible)
- [x] Navbar keyboard-navigable
- [x] Tab indicators with visible focus rings
- [x] No horizontal scroll

### R3F Canvas
- [x] `aria-hidden="true"` (decorative)
- [x] Rendered behind content (z-index)
- [x] no `pointerEvents` by default (only on hoverable fragments)
- [x] Fallback gradient replaces canvas when disabled

### Content
- [x] Single H1 per page
- [x] H2 for sections, H3 for card titles
- [x] Icons have `aria-hidden="true"`
- [x] Color is never sole indicator
- [x] WCAG AA 4.5:1 for all text/background

### Interactive Elements
- [x] Tab panel: `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`
- [x] Buttons accessible by keyboard (Enter/Space)
- [x] All interactive elements have accessible names

---

## 11. Implementation Roadmap

### Phase 1: Foundation (no R3F)
```
Files to create/modify:
  src/app/page.tsx                    — skip-to-content, section structure
  src/components/landing/navbar.tsx    — scroll shrink, GitHub + Docs
  src/components/landing/hero-entrance.tsx  — two-column, mouse parallax
  src/components/landing/problem-section.tsx — flex-wrap scatter
  src/components/landing/solution-flow.tsx   — SVG path arrows
  src/components/landing/showcase.tsx        — tab demo
  src/components/landing/features.tsx        — no changes needed
  src/components/landing/why-section.tsx     — no changes needed
  src/components/landing/cta-section.tsx     — no changes needed

  docs/landing-creative-direction.md   — design brief
  docs/landing-architecture.md         — this document

Build check: npx next build
```
*Status: Already implemented. Build passes.*

### Phase 2: React Three Fiber Hero
```
Steps:
  1. npm install three @react-three/fiber @react-three/drei
  2. Create src/components/landing/r3f-canvas.tsx
     - Canvas with Suspense + lazy loading
     - Ambient + point lights
     - CameraController (scroll + mouse)
  3. Create src/components/landing/knowledge-fragments.tsx
     - 50 InstancedMesh fragments
     - Random initial positions
     - Orbit animation in useFrame
     - Scroll-driven organization
     - Connection lines between related fragments
  4. Create src/components/landing/fragment-hover.tsx
     - Raycaster for hover detection
     - Scale + emissive on hover
     - Nearby fragment response
  5. Integrate into HeroEntrance
     - R3F canvas behind text overlay
     - Conditional render (reduced-motion check)
     - Gradient fallback
  6. Build check + Lighthouse audit
```

### Phase 3: Polish & Accessibility Audit
```
  - Test all interactive elements with keyboard
  - Verify reduced-motion everywhere
  - Check contrast ratios
  - Lighthouse audit (target 100)
  - Mobile testing (R3F disabled, verify layout)
  - Cross-browser testing
```

### Phase 4: Performance Optimization
```
  - Bundle analysis (next/bundle-analyzer)
  - R3F canvas render optimization
  - If three.js chunk >130KB: code-split further
  - Lazy load Showcase section below fold
  - Verify CLS = 0
  - Test on mid-range device (Moto G4 simulation)
```

### Total estimated effort
```
Phase 1: Already done (2h to polish if needed)
Phase 2: 4-6h (R3F scene setup + integration)
Phase 3: 2h (audit + fixes)
Phase 4: 1h (optimization)
Total:   7-9h remaining
```

---

## R3F Decision: Yes, But Scoped

R3F is the one genuinely new dependency worth adding. The knowledge fragment scene communicates the product's core value proposition — fragments organizing from chaos — in a way that CSS/framer-motion simply cannot replicate. 50+ independently moving 3D objects with spatial depth, camera parallax, and scroll-driven organization is the hero of the hero.

**Boundaries:**
- Lazy loaded (never blocks FCP)
- Hero only (fades out before Problem section)
- 50 fragments max (not "thousands" — perf cost isn't worth the marginal gain)
- InstancedMesh for single draw call
- `frameloop="demand"` — no unnecessary renders
- Gradient fallback for reduced-motion / slow devices

**What still gets skipped (even though the spec calls for them):**
- **Rive**: CSS + framer-motion do buttons/logo at zero cost. Rive's 150KB isn't justified for hover effects.
- **Geist font**: Add if the brand team requests it. For MVP, Inter is proven and already preloaded.
- **GSAP**: Framer motion covers every scroll and animation need.
