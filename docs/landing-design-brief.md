# Landing Page Design Brief

## Research Analysis

### Websites Studied
Apple, Arc Browser, Raycast, Linear, Stripe, Framer, Readwise Reader, Obsidian

### Principles Borrowed

| Principle | Source | Why |
|-----------|--------|-----|
| One-line hero, massive whitespace | Apple | Communicates confidence, lets the product breathe |
| Dark theme with subtle accent | Linear | Premium feel, content-forward, reduces visual noise |
| Product-first showcase | Arc | Show the actual interface, not mockups or illustrations |
| Keyboard/modal identity | Raycast | Captures the "tools for builders" positioning |
| Staggered section transitions | Linear | Communicates polish without flashiness |
| Gradient as accent (not background) | Arc | Adds warmth to dark theme without competing with content |
| "One place" consolidation messaging | Readwise | Directly addresses the fragmentation problem |
| Philosophical positioning | Obsidian | Elevates beyond "productivity tool" to "how you think" |

### Principles Intentionally Rejected

| Principle | Source | Why Rejected |
|-----------|--------|--------------|
| Feature grid (3-4 columns) | Every SaaS site | Over-used, feels templated |
| "Save time" / "10x" messaging | General SaaS | Commodity positioning, not memorable |
| Carousel sliders | Stripe/Notion | Bad UX, hides content, poor accessibility |
| Stock photos / illustrations | General SaaS | Impersonal, Devventory is a developer tool |
| Typewriter effect | Landing pages | Cliché, distracts from message |
| Heavy animations / parallax | Framer/etc | Violates "calm by default" design manifesto |

## Visual Direction: Apple × Linear × Arc

- **Whitespace**: Apple-level breathing room. Sections separated by generous vertical space.
- **Typography**: Large, confident headings. Minimal body copy. System font (Inter).
- **Color**: Matte dark (#0f1115 background), subtle accent (violet → cyan gradient for highlights only), everything else in muted grays.
- **Motion**: Shared layout transitions, subtle spring, stagger on scroll. Never decorative.
- **Product imagery**: Show the actual three-panel knowledge workspace, the extension capture flow, the reader — full-bleed, no chrome.

## Structure

1. **Hero** — "Capture anything. Never lose context again." + product preview + CTAs
2. **Problem** — Fragmentation visualized as a single scrolling wall of logos (5-10 tools people save to)
3. **Solution** — Capture → Understand → Retrieve → Reconnect (animated flow)
4. **Interactive Showcase** — Browser extension → Capture → Knowledge → Reader → Search (scroll-driven)
5. **Features** — Each as a single horizontal section with live demo (no grid)
6. **Why Devventory** — 3 outcome-focused statements
7. **CTA** — Minimal footer CTA, confident, no feature dump

## Animation Vocabulary

- `stagger-fade-up` — sections entering viewport
- `shared-layout` — morphing between showcase steps
- `spring-micro` — button hovers, card interactions
- `fade-in` — hero content on load (no slide)
- `scroll-progress` — section transitions driven by scroll position
