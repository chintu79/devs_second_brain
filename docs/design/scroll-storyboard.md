# Scroll Storyboard

## Philosophy

Scrolling in Devventory feels like progressing through a story, not revealing independent sections. Each section naturally transforms into the next through shared layout, depth, and orchestrated motion. The user never feels like they entered a new page — they feel like they moved deeper into the same space.

This applies to the landing page as storytelling, and to the dashboard as progressive information disclosure.

## Landing Page Chapters

### Chapter 0: Hero (0vh–100vh)
```
State: First impression
Camera: Center, zoomed out
Motion: Subtle WebGL particle background responds to scroll
Elements: Headline fades up, preview mockup slides in from right
Transition: Particles organize toward Z as scroll progresses
```
- No storytelling yet — establish identity
- One sentence: "Capture anything. Never lose context."
- Preview shows the product in action (knowledge browser mockup)
- CTA is immediate (Get Started + Sign in)
- Scroll hint at bottom (subtle fading indicator)

### Chapter 1: Problem (100vh–200vh)
```
State: Recognition
Camera: Pulls in slightly, focus shifts
Motion: Particles drift chaotically — representing scattered knowledge
Elements: Pain points fade up with stagger, each icon enters from its own direction
Transition: Smooth opacity crossfade, background shifts subtly
```
- "Your knowledge is scattered across 17 tools"
- Three pain points: Saving (bookmarks), Finding (search across tools), Connecting (no relationships)
- Each point: icon + headline + short description
- Stagger entrance: 100ms between each point

### Chapter 2: Solution (200vh–350vh)
```
State: Understanding
Camera: Pulls in closer
Motion: Particles organize into clusters
Elements: Flow diagram reveals step by step
Transition: Morph from problem layout → solution flow
```
- "One place for everything"
- Visual flow: URL → Extension → Devventory → Organized Knowledge
- Steps reveal on scroll with connecting lines
- Each step: icon + label, line draws between them
- Scroll-driven SVG path drawing

### Chapter 3: Showcase / Reader (350vh–500vh)
```
State: Demonstration
Camera: Center, product-focused
Motion: Tiles stagger in, reader morphs from tile on click
Elements: Product tabs (Extension → Capture → Organize → Read → Search), Knowledge tiles → Reader overlay
Transition: Click triggers shared layout morph from tile to full reader
```
- Interactive demo zone
- Tab bar shows product features (horizontal tabs with layoutId underline)
- Knowledge tiles show sample content
- Clicking a tile morphs it into the Reader overlay (shared layoutId)
- Tab content slides between views with fade + Y

### Chapter 4: Features (500vh–650vh)
```
State: Validation
Camera: Pushes back slightly
Motion: Feature cards fade + scale on entry
Elements: Four feature cards with icons, staggered reveal
Transition: Cards alternate left/right entry directions
```
- "Everything you need, nothing you don't"
- Features: Instant Capture, AI Organization, Full-Text Search, Reader View
- Each card: icon + headline + description + visual hint
- Alternating entry: odd cards from left, even from right
- Stagger: 80ms between cards

### Chapter 5: Why Devventory (650vh–750vh)
```
State: Conviction
Camera: Steady
Motion: Testimonial-like content with subtle parallax
Elements: Quote, stats, comparison table
Transition: Single column → comparison layout
```
- "Why developers choose Devventory"
- Comparison: Devventory vs Bookmarks, vs Notes apps, vs Read Later
- Three-column comparison with highlight on Devventory column
- Stats row: "10k+ developers", "500k+ resources saved", "99.9% uptime"

### Chapter 6: CTA (750vh–850vh)
```
State: Action
Camera: Pulls back, full view
Motion: Elements converge toward center
Elements: Large headline, subtext, dual CTAs
Transition: Full-width background, minimal footer
```
- "Your knowledge deserves a home"
- Primary CTA: Get Started (accent button)
- Secondary CTA: View on GitHub
- Social proof bar (logos or testimonial snippet)
- Minimal footer with links

## Dashboard Scroll

The dashboard does not use scroll storytelling. It uses progressive information disclosure:

- **Above fold**: Greeting + Continue Working (projects + recent references)
- **Below fold**: Recent Captures (scroll reveals more history)
- **No parallax**, no scroll-driven animation — scroll is utilitarian

## Scroll-Driven Animation Rules

1. Use `useScroll` + `useTransform` from Framer Motion for scroll-linked values.
2. Never attach scroll listeners directly — use Framer Motion's optimized scroll hooks.
3. Scroll progress drives transforms on opacity, scale, Y, and rotation — never layout properties.
4. Parallax depth factor: foreground moves 1x, midground 0.5x, background 0.2x scroll speed.
5. Scroll-triggered entrances use `whileInView` with `viewport={{ once: true, margin: "-100px" }}`.
6. Chapter transitions happen at 100vh boundaries with smooth opacity crossfades.
7. On reduced motion: skip all parallax and scroll-driven animation. Use simple fade-in entrances via `whileInView`.
