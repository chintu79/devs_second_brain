# Color System

## Philosophy

Dark-first, minimal, nearly monochrome with a single accent. Color is used strategically — to draw attention to what matters, to communicate state, and to create atmosphere. It is never decorative.

The system uses OKLCH for perceptual uniformity. Equal lightness steps look equal regardless of hue.

## Global Variables

```css
:root {
  /* Backgrounds */
  --color-background: oklch(0.13 0.005 270);     /* #0f1115 — deepest bg */
  --color-card: oklch(0.16 0.007 270);           /* #191c21 — card surface */
  --color-muted: oklch(0.19 0.008 270);          /* #23272e — hover, disabled */
  --color-secondary: oklch(0.21 0.01 270);       /* #2a2f36 — secondary surface */

  /* Foregrounds */
  --color-foreground: oklch(0.95 0.005 270);     /* #eef0f2 — primary text */
  --color-muted-foreground: oklch(0.55 0.015 270); /* #8a9299 — secondary text */

  /* Accent */
  --color-accent: oklch(0.58 0.18 270);          /* #5B6CFF — primary accent */
  --color-accent-hover: oklch(0.63 0.18 270);    /* brighter accent for hover */

  /* Borders */
  --color-border: oklch(0.22 0.01 270);          /* #2f3437 — default border */
  --color-ring: var(--color-accent);              /* focus ring */

  /* Semantic */
  --color-success: oklch(0.62 0.18 150);         /* #34d399 */
  --color-warning: oklch(0.7 0.18 85);           /* #fbbf24 */
  --color-error: oklch(0.55 0.2 25);             /* #ef4444 */
  --color-info: oklch(0.65 0.15 240);            /* #60a5fa */
}
```

## Neutrals

Neutrals are tinted toward the accent hue (270°) at very low chroma (0.005–0.015). This is nearly invisible per pixel but creates subconscious cohesion across the interface.

```css
--color-foreground: oklch(0.95 0.005 270);       /* near-white with cool tint */
--color-muted-foreground: oklch(0.55 0.015 270); /* mid-gray with cool tint */
--color-background: oklch(0.13 0.005 270);       /* near-black with cool tint */
--color-card: oklch(0.16 0.007 270);             /* slightly lighter than bg */
--color-muted: oklch(0.19 0.008 270);            /* card hover state */
--color-border: oklch(0.22 0.01 270);            /* subtle borders */
```

## Accent (#5B6CFF)

The accent is used exclusively for:

1. Primary actions (buttons, CTAs)
2. Active/selected states (sidebar, tabs, focus)
3. Key interactive elements
4. Landing page gradient headers

Accent should cover no more than 5% of any screen. If accent feels everywhere, reduce it.

## Semantic Colors

Semantic colors are used for their meaning, not their hue. They appear at 60–70% lightness to maintain readability on dark backgrounds.

| Role | Hex | OKLCH | Use |
|------|-----|-------|-----|
| Success | `#34d399` | oklch(0.62 0.18 150) | Saved, completed, synced |
| Warning | `#fbbf24` | oklch(0.7 0.18 85) | Processing, pending attention |
| Error | `#ef4444` | oklch(0.55 0.2 25) | Failed, deleted, error state |
| Info | `#60a5fa` | oklch(0.65 0.15 240) | Tips, hints, informational |

## Type Accent Colors

Knowledge types get distinct accent colors:

| Type | Hex | OKLCH |
|------|-----|-------|
| Link/Reference | `#38bdf8` | oklch(0.65 0.15 240) |
| Note | `#34d399` | oklch(0.62 0.18 150) |
| Document | `#fbbf24` | oklch(0.7 0.18 85) |
| PDF | `#f87171` | oklch(0.6 0.2 25) |
| Video | `#fb7185` | oklch(0.6 0.2 350) |

These appear as left accent strips on cards and type badge colors. They are muted — 70% opacity by default.

## Section/Tag Colors (Dashboard)

Section accent colors applied via `data-accent` attribute and CSS `color-mix`:

```
Default: accent (#5B6CFF)
Knowledge: #38bdf8 (blue)
Projects: #34d399 (green)
Radar: #fbbf24 (amber)
Settings: #a78bfa (violet)
```

These tint the sidebar indicator, section headers, and page-specific accents. They are not additional brand colors — they are lighting, not identity.

## Hover & Focus

- Interactive element hover: `brightness(1.1)` or `opacity(0.8)` — never a new color
- Card hover: border brightens +0.05 lightness
- Button hover: accent brightens +0.05 lightness
- Focus ring: `var(--color-ring)` at 50% opacity, 2px with 2px offset

## Selection

- Text selection: `var(--color-accent)` at 30% opacity using `color-mix`
- Card selection: `border-accent/50` + `bg-accent/5` — subtle, not garish
- List selection: `bg-muted` with optional left accent strip

## Reduced Color

When `prefers-contrast: more`:
- Increase border contrast to +0.04 lightness minimum
- Foreground text to 0.98 lightness
- Muted foreground to 0.65 lightness
- Accent darkens slightly for WCAG AAA compliance

## Dark Mode Only

Devventory is dark-first. Light mode is not supported initially. All color decisions assume dark background.

When light mode is added:
- Invert the lightness axis: background ≈ 0.95, foreground ≈ 0.15
- Keep hue and chroma values identical
- Accent remains at same lightness (0.58)
- Shadows become dark-on-light instead of light-on-dark
