# Typography

## Font Stack

```
Primary: Inter (sans-serif)
Monospace: JetBrains Mono (code)
```

Inter is the UI font — clean, legible, works at every size. JetBrains Mono is used exclusively for code blocks, inline code, and paths.

No display font is needed. Devventory's identity comes from layout, motion, and spacing, not from a custom typeface. Typography is functional, not decorative.

## Type Scale

A perfect-fourth scale (1.250) with intentional adjustments for screen readability.

```css
/* CSS token mapping */
--text-xs: 0.75rem;    /* 12px — Caption, metadata */
--text-sm: 0.8125rem;  /* 13px — Body small, secondary text */
--text-base: 0.875rem; /* 14px — Default body */
--text-lg: 1rem;       /* 16px — Large body, card titles */
--text-xl: 1.125rem;   /* 18px — Section headers */
--text-2xl: 1.5rem;    /* 24px — Page headers, dialog titles */
--text-3xl: 2rem;      /* 32px — Dashboard headlines */
--text-4xl: 2.5rem;    /* 40px — Section hero headers */
--text-5xl: 3.5rem;    /* 56px — Landing page hero (clamp for fluid) */
```

## Token Mapping

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|-------|------|--------|-------------|----------------|-----|
| `display` | clamp(2.2rem, 5vw, 3.8rem) | 700 | 1.05 | -0.03em | Landing hero headline |
| `h1` | 2rem (32px) | 700 | 1.1 | -0.02em | Page title |
| `h2` | 1.5rem (24px) | 600 | 1.2 | -0.015em | Section header |
| `h3` | 1.125rem (18px) | 600 | 1.25 | -0.01em | Card title, dialog |
| `body` | 0.875rem (14px) | 400 | 1.5 | normal | Default text |
| `body-large` | 1rem (16px) | 400 | 1.6 | normal | Long-form reading |
| `caption` | 0.75rem (12px) | 500 | 1.4 | 0.02em | Help text, timestamps |
| `metadata` | 0.6875rem (11px) | 500 | 1.3 | 0.04em | Tags, badges, small UI |
| `code` | 0.8125rem (13px) | 400 | 1.5 | normal | Inline code, blocks |
| `button` | 0.8125rem (13px) | 600 | 1 | 0.01em | Button labels |
| `link` | 0.875rem (14px) | 500 | inherit | normal | Text links |

## Font Weights

- 400: Body, code
- 500: Caption, metadata, links, emphasized body
- 600: Buttons, h3, section headers, active nav
- 700: h1, h2, page headers, display

Do not use 300 (light) or 800/900 (extra bold). Devventory's voice is confident but not extreme.

## Line Length

- Body text: max 68ch (optimal reading width)
- Landing hero: max 20ch per line (short lines for impact)
- Reader content: max 70ch
- Sidebar: no constraint
- Cards: no constraint (contained by card width)

## Reading Rhythm

- Paragraph spacing: 1.5x line height
- Section spacing: 2rem (32px) minimum
- Heading-to-content: 0.5rem (8px)
- List items: 0.375rem (6px) gap
- Code blocks: 1rem (16px) padding inside, 1.5rem (24px) margin above/below

## Responsive Typography

- Mobile: Use `text-base` (14px) as minimum body size
- Tablet: Same scale, wider containers
- Desktop: Full scale, max-width constrained
- Fluid: Only for landing page display headlines (`clamp()`)
- App UI: Fixed rem values only — no fluid sizing

## Code Typography

- Inline code: `bg-muted/50`, `px-1 py-0.5`, `rounded-sm`, JetBrains Mono
- Code blocks: Full width, `bg-muted/30`, `p-4`, `rounded-md`, JetBrains Mono 13px
- Code in chat messages: Same as blocks but with language label + copy button
- Line numbers: `text-muted-foreground/30`, `text-xs`, `pr-4`

## Links

- Text links: `text-muted-foreground/70 hover:text-foreground`, underline on hover only
- Navigation links: No underline, color/bg change on active
- External links: Same as text links, optional external icon
- Links in reader: Accent color, subtle underline
