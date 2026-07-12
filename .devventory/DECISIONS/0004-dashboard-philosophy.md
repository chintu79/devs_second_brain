# ADR 0004 — Dashboard Philosophy

**Status:** Accepted

**Date:** 2026-07-08

---

## Context

The Dashboard had become an analytics dashboard with streak counters, daily activity summaries, weekly progress charts, knowledge insights, and stale item warnings. This was overwhelming for an MVP.

## Decision

The Dashboard is a continuation page, not an analytics dashboard. It answers one question: "What should I continue?"

Two sections:
1. **Continue Working** — Most recently updated projects and references
2. **Recent Captures** — Most recently saved references

Removed:
- Streak counter (motivational gimmick, not functional)
- Daily Brief (activity summary, not actionable)
- Weekly Progress (item counts, decorative)
- Knowledge Insights (dormant notes, total items)
- Analytics graphs and charts

## Consequences

Positive:
- Dashboard loads faster (fewer DB queries)
- Clearer purpose
- Less visual noise
- Easier to maintain

Negative:
- No motivation features (streak, goals)
- No high-level overview of vault health
- Users may feel the dashboard is "empty"

## Alternatives Considered

1. **Full analytics dashboard** — Rejected: not MVP, adds complexity without validation value
2. **Activity feed** — Rejected: too similar to social media, not actionable
3. **Blank canvas / quick capture** — Rejected: "where do I start?" confusion
