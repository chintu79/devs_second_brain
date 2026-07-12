# ADR 0005 — Capture First

**Status:** Accepted

**Date:** 2026-07-08

---

## Context

The application had diverged into many directions: AI chat, knowledge graphs, daily journals, documentation, project management. The core hypothesis — "people want one place to capture knowledge with context" — was getting buried under features.

## Decision

Every feature must justify itself against three criteria:

1. Does it directly improve **capture**?
2. Does it directly improve **organization**?
3. Does it directly improve **retrieval**?

If the answer is "no" to all three, the feature is removed or postponed.

This means:
- Browser extension is high priority (improves capture)
- AI enrichment is kept (improves organization)
- Search is kept (improves retrieval)
- AI Chat is removed (doesn't directly improve C/O/R)
- Knowledge graph is removed (doesn't directly improve C/O/R)
- Daily log is removed (doesn't directly improve C/O/R)

## Consequences

Positive:
- Clear product direction
- Easy to evaluate new feature requests
- Reduced codebase complexity

Negative:
- Some interesting features are postponed indefinitely
- Hard to say "no" to features that seem useful
- Users may expect features they've seen in similar products

## Alternatives Considered

1. **Build everything, let users decide** — Rejected: leads to unfocused product
2. **Competitive parity** — Rejected: not trying to match Notion/Obsidian feature-for-feature
3. **User research first** — Rejected: MVP exists to generate user data
