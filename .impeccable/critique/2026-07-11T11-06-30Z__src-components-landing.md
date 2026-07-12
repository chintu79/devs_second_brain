---
target: landing page
total_score: 21
p0_count: 0
p1_count: 3
p2_count: 2
p3_count: 1
timestamp: 2026-07-11T11-06-30Z
slug: src-components-landing
---
**Method: dual-agent (A: design-review · B: detector-scan)**

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No scroll progress, no loading states, decorative capture badge not real |
| 2 | Match System / Real World | 2 | "Developer knowledge OS" is jargon; flow diagram implies linear work |
| 3 | User Control and Freedom | 3 | No animation pause/escape; skip link skips to hero (already visible) |
| 4 | Consistency and Standards | 2 | Accent color fractured ({{hash}}6366F1 vs {{hash}}5B6CFF); 7 identical section templates |
| 5 | Error Prevention | 2 | Registration is known-blocked; no Escape key on reader overlay |
| 6 | Recognition Rather Than Recall | 3 | Showcase tabs icon-only on mobile (5 abstract icons, no labels) |
| 7 | Flexibility and Efficiency | 1 | Zero keyboard shortcuts; 3 non-functional tab stops on knowledge tiles |
| 8 | Aesthetic and Minimalist Design | 3 | Typography solid, dark theme works; decorative lines violate P6 |
| 9 | Error Recovery | 1 | Zero error states; reader returns null silently if data missing |
| 10 | Help and Documentation | 1 | Docs link hidden on mobile; "knowledge" concept never explained |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

## Anti-Patterns Verdict

**AI slop**: Moderate risk. The 7-section template (badge → h2 → p → animated grid → line) is the strongest tell — identical whileInView, same ease.decelerate import, same 0.5s duration in every component. The gradient icon containers replicate the same clip across every section.

**Deterministic scan**: 19 font-size violations — 10px, 11px, 15px, 17px all off the DESIGN.md type ramp. Concentrated in hero-entrance.tsx (12 hits) and reader-overlay.tsx (2 hits). All advisory severity but pervasive.

**Agreement**: Both assessments flag the structural uniformity and typography drift.
**Detector-only**: The 19 font-size violations weren't caught by the design review — real values that escaped human attention.
**False positives**: 3 of the "11px" hits in hero-entrance are on label/badge text which DESIGN.md's label token (0.75rem/12px at 500w) covers — close but not exact.

## Overall Impression

The page is competent but not distinctive. The dark theme and layered border system carry the visual weight. The hero mockup + layoutId morph are the only genuinely original moments. Everything else reads as a well-executed template. The biggest missed opportunity: a landing page for a knowledge tool that never lets the user experience retrieval.

## What's Working

- **Hero mockup window**: Previewing the product inline (resource list → reader) is the right move. Staggered reveals create a "live" feel.
- **layoutId tile→overlay morph**: Genuinely sophisticated. Shows spatial continuity the Design Manifesto demands (P3, P6).
- **Dark theme depth**: border-border/60 → /40 → /30 → /20 creates a physical hierarchy without heavy shadows (P8).

## Priority Issues

- **[P1] Identical 7-section template**: Every section shares the same skeleton (badge → h2 → p → animated grid → decorative line). Remove decorative lines (3 sections), alternate layout patterns.
- **[P1] Showcase tells, doesn't show**: "Product demo" is 5 tabs of dense paragraphs. The product's killer feature is full-text search — yet there's zero interactive search behavior on this page.
- **[P1] Accent color fracture**: #6366F1 (primary) and #5B6CFF (accent) compete. 39 references to one, 4 to the other. Pick one.
- **[P2] No social proof**: Open-source dev tool landing page with zero testimonials, no GitHub stars, no user count.
- **[P2] Mobile navbar hides links**: GitHub and Docs hidden on mobile with no hamburger. 5 icon-only tabs in Showcase.
- **[P3] Skip-to-content is a no-op**: Targets hero (already at top of page) instead of Problem section.

## Persona Red Flags

**Jordan (First-Timer)**: Hero badge doesn't explain the product in 3 seconds. Must register to try anything (and registration is known-broken). 7 sections before CTA.

**Riley (Stress Tester)**: R3F Three.js in hero adds JS bundle weight with every page load. AnimatePresence mode="wait" blocks tab switching. No error boundaries visible.

**Casey (Mobile User)**: 100vh hero with R3F canvas = immediate GPU drain. Navbar hides links on mobile. Showcase tabs become icon-only with no text labels.

## Minor Observations

- Reduced motion: R3F canvas still mounts/renders at opacity 0 instead of unmounting (hero-entrance.tsx:72)
- Features grid uses 6 identical cards (icon + title + desc) — violates the Design Manifesto's own "no identical card grids" rule
- CTA section offers no new incentive — same buttons as hero after scrolling through 7 sections
- Knowledge tile action buttons (recently changed to `<button>`) have no onClick handlers — decorative
