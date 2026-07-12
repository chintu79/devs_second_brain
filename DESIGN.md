---
name: Devventory
description: A developer knowledge OS — one place for every link, note, PDF, and idea
colors:
  primary: "#6366F1"
  background: "#1b1b1b"
  card: "#282828"
  sidebar: "#141414"
  ink: "#e8e7e6"
  muted-fg: "#929390"
  border: "rgba(232, 231, 230, 0.14)"
  success: "#22c55e"
  warning: "#f59e0b"
  error: "#ef4444"
  info: "#60a5fa"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(2.2rem, 5vw, 3.8rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  code:
    fontFamily: "SF Mono, Fira Code, Roboto Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  xl: "11px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "#5B6CFF"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "#4E5EF7"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-fg}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input-default:
    backgroundColor: "#1e1e1e"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Devventory

## 1. Overview

**Creative North Star: "The Developer's Workbench"**

A calm, intentional workspace where knowledge is the material. The design never competes with the content — surfaces recede, typography leads, motion explains. Every pixel serves the goal of frictionless capture and effortless retrieval.

The system is dark-first, nearly monochrome, with a single accent (#5B6CFF) that drives all interactive elements. Section-specific hues (knowledge rose, settings neutral) are reserved for icons, badges, and indicators — never for surfaces or text. Color is used as a rare resource, not decoration.

This is not a bookmark manager with a nicer UI. It is not a note-taking app. It is not another dashboard. It is an operating system for a developer's knowledge.

**Key Characteristics:**
- Dark-first, warm neutrals — canvas is warm near-black (#1b1b1b), not cold blue-gray
- Single accent — #5B6CFF drives all interactive elements, never exceeds 5% screen coverage
- Three-panel layout — folder tree | resource list | reader panel, the core paradigm
- Shared element transitions — cards morph into readers, search results into detail views
- Typography-first — Inter at every size, hierarchy via weight and spacing, not decorative type
- Motion explains state — entrance, exit, selection, morph; never decoration

**Explicit Rejections:**
- No side-stripe borders — the absolute ban from Impeccable
- No gradient text — emphasis via weight or size
- No glassmorphism — rare and purposeful, never default
- No numbered section markers (01 / 02 / 03) — sequence earns its place
- No tiny uppercase tracked eyebrows above every section
- No identical card grids — same-sized cards with icon + heading + text, repeated endlessly
- No hero-metric template — big number, small label, gradient accent

## 2. Colors: The Warm Neutral Palette

A restrained palette built on warm-tinted neutrals in OKLCH. All neutrals carry 0.005–0.015 chroma toward the brand hue (270°) for subconscious cohesion. Dark theme is independently designed — not inverted light values.

### Primary
- **Brand Accent** (#5B6CFF, `oklch(0.58 0.18 270)`): The single interactive accent. Used for primary buttons, active states, focus rings, landing page CTAs. Never exceeds 5% screen coverage.
- **Brand Hover** (#4E5EF7): Primary action hover state. Slightly brighter at same hue.
- **Brand Active** (#4353EA): Primary action pressed state. Slightly deeper.

### Neutral
- **Canvas** (#1b1b1b, `oklch(0.13 0.005 270)`): Deepest background, warm near-black.
- **Sidebar** (#141414, `oklch(0.10 0.005 270)`): Navigation surface. Recedes from content.
- **Card** (#282828, `oklch(0.21 0.008 270)`): Content cards, clearly above canvas.
- **Ink** (#e8e7e6, `oklch(0.80 0.005 270)`): Primary text. Warm off-white, max readability.
- **Muted Ink** (#929390, `oklch(0.55 0.015 270)`): Metadata, captions. Passes WCAG AA at 5.6:1.
- **Border** (`rgba(232, 231, 230, 0.14)`): Default border. 14% opacity for subtle separation.

### Section Accents (for icons, badges, indicators only)
- **Knowledge** (#C6488C): Knowledge workspace section.
- **Settings** (#7C7C84): Settings section.

### Type Accents (for knowledge type indicators)
- **Link/Reference** (#38bdf8): Blue — link type accent.
- **Note** (#34d399): Green — note type accent.
- **Document** (#fbbf24): Amber — document type accent.
- **PDF** (#f87171): Red — PDF type accent.
- **Video** (#fb7185): Pink — video type accent.

### Semantic
- **Success** (#22c55e): Saved, completed, synced.
- **Warning** (#f59e0b): Processing, pending attention.
- **Error** (#ef4444): Failed, deleted, error state.
- **Info** (#60a5fa): Tips, hints, informational.

### Named Rules
**The Rarity Rule.** The primary accent (#5B6CFF) covers ≤5% of any given screen. If accent feels everywhere, remove it.
**The One Hue Rule.** Neutrals are tinted toward the accent hue (270°) at low chroma. Default-tinting toward warm or cool "because the brand feels that way" is prohibited — tint toward the actual brand hue.
**The No-Gradient-Text Rule.** Emphasis is communicated through weight and size. `background-clip: text` with gradient is decorative and prohibited.

## 3. Typography

**Display Font:** Inter (system-ui sans-serif stack)
**Body Font:** Inter (same family throughout)
**Label/Mono Font:** SF Mono / Fira Code / JetBrains Mono (code only)

**Character:** A single-family system (Inter) that carries every role — display, body, label, button — with no pairings. Hierarchy is achieved through weight, size, and spacing, not font changes. This is a deliberate product choice: one family eliminates the noise of font pairing and lets the content speak. Monospace is reserved exclusively for code.

### Hierarchy
- **Display** (700, `clamp(2.2rem, 5vw, 3.8rem)`, 1.05, -0.03em): Landing page hero headline. Short lines (max 20ch), fluid clamp sizing. Never used in product UI.
- **Headline** (700, 2rem/32px, 1.1, -0.02em): Page titles, dashboard headers. Product UI maximum.
- **Title** (600, 1.125rem/18px, 1.25, -0.01em): Card titles, dialog headers, section subheads.
- **Body** (400, 0.875rem/14px, 1.5): Default text. Max line length 68ch for prose; unconstrained for UI.
- **Large Body** (400, 1rem/16px, 1.6): Long-form reading in the Reader. Max line length 70ch.
- **Caption** (500, 0.75rem/12px, 1.4, +0.02em): Help text, timestamps, metadata labels.
- **Label** (500, 0.6875rem/11px, 1.3, +0.04em): Tags, badges, small UI elements.
- **Code** (400, 0.8125rem/13px, 1.5): Inline code and code blocks. SF Mono or JetBrains Mono.
- **Button** (600, 0.8125rem/13px, 1, +0.01em): Button labels. Uppercase is never used.

### Named Rules
**The One Family Rule.** Inter is the only UI font. No display/body pairing. Monospace is for code alone.
**The Fixed Rem Rule.** Product UI uses fixed rem values for all type. Fluid `clamp()` is reserved for the landing page hero only.
**The 68ch Rule.** Prose body text never exceeds 68 characters per line. Data and compact UI may run denser.

## 4. Elevation

The system uses tonal layering (luminance steps between surfaces) as its primary depth mechanism, supplemented by soft layered shadows for elevated elements. Shadows are never harsh — they use large blur radius and low opacity.

Surfaces are flat at rest. Shadows appear only as a response to state or hierarchy.

### Surface Elevation
- **Surface 0** (Canvas, #1b1b1b, L=0.13): Page background.
- **Surface 1** (Sidebar, #141414, L=0.10): Navigation. Recedes below canvas.
- **Surface 2** (Muted, #252525, L=0.19): Hover states, secondary sections.
- **Surface 3** (Card, #282828, L=0.21): Content cards — clearly above canvas.
- **Surface 4** (Floating, #2d2d2d, L=0.26): Popovers, dropdowns, modals.

### Shadow Vocabulary
- **sm** (`0px 0.5px 1px rgba(0,0,0,0.04), 0px 0px 1px rgba(0,0,0,0.06)`): Card resting state. Barely perceptible — the card exists because of luminance, not shadow.
- **md** (`0px 2px 8px rgba(0,0,0,0.05), 0px 0px 1px rgba(0,0,0,0.07)`): Dropdown menus, popovers.
- **lg** (`0px 6px 24px rgba(0,0,0,0.06), 0px 0px 1px rgba(0,0,0,0.08)`): Modals, dialogs.
- **xl** (`0px 12px 48px rgba(0,0,0,0.08), 0px 0px 1px rgba(0,0,0,0.10)`): Command palette, highest elevation.

### Named Rules
**The Flat-by-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to interaction state (hover, focus) or elevated hierarchy (modals, dropdowns). A card does not need a shadow to exist — its luminance against the canvas is enough.

## 5. Components

### Buttons
- **Shape:** Gently curved edges (6px radius, `rounded-md`)
- **Primary:** Brand accent (`#5B6CFF`) background, white text (`#ffffff`). Padding 8px 16px.
- **Hover:** Background lightens slightly (`#4E5EF7`), subtle scale 1.03, 150ms CSS transition.
- **Active:** Scale 0.97, 80ms. Background deepens to `#4353EA`.
- **Focus:** Ring 2px with 2px offset at `rgba(91, 108, 255, 0.50)`.
- **Ghost:** Transparent background, muted foreground (`#929390`). Hover: muted background fill.
- **Loading:** Inline spinner replaces icon slot. Button maintains width.
- **Disabled:** Opacity 0.4, no pointer events.

### Cards
- **Corner Style:** Rounded (11px radius, `rounded-xl`)
- **Background:** Card surface (`#282828`)
- **Shadow Strategy:** None at rest. `shadow-sm` on hover.
- **Border:** Defaut border (`rgba(232, 231, 230, 0.14)`). Hover brightens to 25% opacity.
- **Hover:** Lift 4px (`y: -4`), scale 1.015, border brightens, 150ms CSS + Framer Motion for whileHover.
- **Internal Padding:** 16px (`p-4`), 12px on mobile (`p-3`).
- **Selected State:** Accent border (`border-accent/50`), subtle accent background tint (`bg-accent/5`).

### Knowledge Card (signature component)
- **Layout:** Flex row with left accent strip (3px wide, type-colored). Icon + title + summary + metadata.
- **Type Accent Strip:** Absolute positioned left strip at 3px width, colored by knowledge type.
- **Type Icon:** 16px Lucide icon, colored by type accent.
- **Metadata:** Type badge (pill, 11px, muted bg, type-colored text), relative timestamp.
- **Hover Actions:** "Open Reader" button + external link icon, revealed on card hover (hidden by default).
- **Shared Layout Transition:** `layoutId={`kcard-${id}`}` for morph to ReaderOverlay.

### Inputs / Fields
- **Style:** Filled background (`#1e1e1e`), border (`rgba(232, 231, 230, 0.10)`), 6px radius.
- **Focus:** Border shifts to accent (`var(--accent)`), optional subtle glow.
- **Placeholder:** Same lightness as muted foreground at 50% opacity.
- **Error:** Red border (`#ef4444`), error message slides down via `grid-template-rows`.
- **Disabled:** Opacity 0.4, no pointer events.

### Navigation (Sidebar)
- **Style:** Dark panel (`#141414`), 240px width on desktop. Items have 8px horizontal padding.
- **Default:** Muted foreground (`#929390`), no background.
- **Hover:** Muted background tint at 6% white.
- **Active:** Accent-tinted background via `color-mix(in srgb, var(--sidebar-item-accent) 18%, transparent)`. White text.
- **Indicator:** Framer Motion `layoutId` spring-glides between active items. Accent-colored dot/bar.
- **Section Labels:** 11px uppercase tracking-wider, `sidebar-foreground/60`.

### Chips / Tags
- **Style:** Pill shape (`rounded-full`), muted background, small text (11px), type-colored text at 70% opacity.
- **Selected State:** Accent background + white text.

### Dialog / Modal
- **Shape:** Rounded corners (11px, `rounded-xl`), card surface, `shadow-xl`.
- **Backdrop:** 65% opacity black (`rgba(0, 0, 0, 0.65)`), backdrop blur 2px.
- **Entrance:** Scale 0.95→1 + fade, 200ms, ease decelerate.
- **Padding:** 24px (`p-6`).

### Reader Overlay (signature component)
- **Shape:** Rounded corners on desktop (11px), full-height on mobile.
- **Background:** Card surface, `shadow-2xl`.
- **Width:** Max 780px on desktop.
- **Transition:** Shared layout animation via `layoutId` from triggering card. Spring physics: damping 28, stiffness 300, mass 0.8.
- **Toolbar:** Fades in on hover within reader.

## 6. Do's and Don'ts

### Do:
- **Do** use a single accent (#5B6CFF) for all interactive elements. Keep it rare — ≤5% of any screen.
- **Do** use tonal layering (luminance steps) as the primary depth mechanism. Shadows support, they don't carry hierarchy.
- **Do** use shared layout transitions (`layoutId`) for morphing elements — card→reader, search→detail, tile→overlay.
- **Do** animate only `transform` and `opacity`. Never `width`, `height`, `top`, `left`.
- **Do** use Inter for everything. One family, multiple weights (400/500/600/700).
- **Do** respect `prefers-reduced-motion` — every animation has a zero-duration fallback.
- **Do** use the 8px spacing rhythm. 4px for micro-adjustments. No arbitrary values.
- **Do** show skeleton states for loading content, not spinners in the middle of content.
- **Do** design empty states that teach the interface, not "nothing here."

### Don't:
- **Don't** use side-stripe borders (`border-left` >1px as a colored accent on cards). The absolute ban.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis via weight and size.
- **Don't** use glassmorphism as default. Rare and purposeful, or nothing.
- **Don't** use the hero-metric template (big number, small label, gradient accent) — the SaaS cliché.
- **Don't** use identical card grids (same-sized cards with icon + heading + text, repeated endlessly).
- **Don't** use tiny uppercase tracked eyebrows above every section heading.
- **Don't** use numbered section markers (01 / 02 / 03) as default scaffolding above every section.
- **Don't** use display fonts for UI labels, buttons, or data. Inter handles all roles.
- **Don't** reinvent standard affordances — no custom scrollbars, weird form controls, non-standard modals.
- **Don't** use modal as first thought. Exhaust inline / progressive alternatives first.
- **Don't** use bouncy animations or elastic springs. Ease-out-quart / quint / expo only.
- **Don't** add decorative motion that doesn't convey state. Every animation answers: What changed? Where from? Where to?
- **Don't** create color for decoration. The palette is restrained by design. If you need a new color, justify it with a functional role.
- **Don't** hardcode values — use tokens. Every color, radius, spacing, and motion value comes from the system.
