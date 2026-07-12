# Spacing System

## Scale

An 8px base with 4px micro-adjustments. All spacing values belong to this scale. No arbitrary values.

```css
--spacing-0: 0px;
--spacing-1: 4px;    /* Micro — icon gaps, inline element spacing */
--spacing-2: 8px;    /* Tight — button padding, tag gaps, form row gaps */
--spacing-3: 12px;   /* Compact — card padding small, list item gaps */
--spacing-4: 16px;   /* Default — card padding, section padding, modal padding */
--spacing-5: 20px;   /* Relaxed — card with more content, form groups */
--spacing-6: 24px;   /* Section — between sections, panel padding */
--spacing-8: 32px;   /* Generous — sidebar width, dialog from edge */
--spacing-10: 40px;  /* Page — between major sections, hero padding */
--spacing-12: 48px;  /* Chapter — section-to-section spacing, landing sections */
--spacing-16: 64px;  /* Narrative — landing page chapter gaps */
--spacing-20: 80px;  /* Hero — landing hero bottom padding */
```

## Rhythm

Spacing creates rhythm through alternation between tight and generous:

```
Tight  (8px)  ← related items (tag row, button group)
Normal (16px) ← default component padding
Relaxed(24px) ← between related sections
Generous(40px)← between major sections
```

Every group of related items begins with tight internal spacing and ends with generous spacing to the next group. This is the core rhythm pattern.

## Usage Guidelines

### Inside Components
| Component | Padding | Gap |
|-----------|---------|-----|
| Card | `--spacing-4` (16px) | `--spacing-3` (12px) between elements |
| Button | `--spacing-2` (8px) horizontal, `--spacing-1` (4px) vertical | — |
| Input | `--spacing-2` (8px) horizontal, `--spacing-2` (8px) vertical | — |
| Dialog | `--spacing-6` (24px) | `--spacing-4` (16px) section gap |
| Sheet | `--spacing-6` (24px) | `--spacing-4` (16px) section gap |
| Dropdown | `--spacing-2` (8px) items | `--spacing-1` (4px) between items |
| Toast | `--spacing-3` (12px) | `--spacing-2` (8px) |
| Toolbar | `--spacing-2` (8px) horizontal | `--spacing-1` (4px) between icons |

### Between Components
| Relationship | Gap |
|-------------|-----|
| Related items in a row | `--spacing-2` (8px) |
| Card grid | `--spacing-3` (12px) |
| Section header → content | `--spacing-4` (16px) |
| Section → next section | `--spacing-8` (32px) |
| Page section → page section | `--spacing-12` (48px) |
| Landing chapter → chapter | `--spacing-16–20` (64–80px) |

### Page Layout
| Region | Padding |
|--------|---------|
| Mobile edge | `--spacing-4` (16px) |
| Tablet edge | `--spacing-6` (24px) |
| Desktop edge | `--spacing-8` (32px) |
| Max content width | 1280px (page), 780px (reader) |

## Three-Panel Layout

The knowledge workspace uses three panels with fixed widths:

| Panel | Width | Padding |
|-------|-------|---------|
| Folder tree | 240px | `--spacing-2` (8px) horizontal |
| Resource list | 360px | `--spacing-4` (16px) |
| Reader panel | Flex (remaining) | `--spacing-6` (24px) |

## Why 4px/8px Base

- 8px rhythm works at all screen sizes without fractional values
- 4px micro-adjustments enable fine-tuning without breaking the system
- Matches the 0.5rem/1rem CSS-native rhythm
- Scales predictably: 8 → 16 → 24 → 32 → 40 → 48 → 64 → 80

## When to Break the Scale

Never in the product UI. The landing page may use values up to 120px for hero spacing, but these are still multiples of 8 (120 = 15 × 8px).

If the scale cannot accommodate a layout, the layout is wrong, not the scale.
