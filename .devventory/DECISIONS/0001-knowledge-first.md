# ADR 0001 — Knowledge First

**Status:** Accepted

**Date:** 2026-07-08

---

## Context

The application had grown to 11 pages without clear focus. Features were added based on what seemed interesting rather than what the MVP needed. Knowledge (references, notes, prompts, resources) was scattered across multiple pages with inconsistent UX patterns.

## Decision

Make Knowledge the heart of the application. Collapse all content types into a single Knowledge workspace with three-panel layout. Remove standalone pages for notes, resources, prompts.

Rationale:
- Users think in terms of "what I'm working on," not "is this a note or a resource"
- A single workspace is simpler to maintain and navigate
- The three-panel layout (sidebar | content | context) works for any content type
- Separating content types created artificial boundaries that didn't match user mental models

## Consequences

Positive:
- Single unified workspace for all knowledge
- Simplified navigation (4 pages instead of 11)
- Consistent UX across all content types
- Easier to maintain and extend

Negative:
- Existing standalone pages had specialized features that need to be merged
- Users accustomed to separate pages need to adapt
- Some content-type-specific features may be harder to surface

## Alternatives Considered

1. **Keep all pages separate** — Rejected: too much navigation overhead, inconsistent UX
2. **Dashboard as unified workspace** — Rejected: dashboard should be a continuation page, not a workspace
3. **Single-page app approach** — Rejected: too radical, loses SEO and routing benefits
