# ADR 0003 — Projects as Workspaces

**Status:** Accepted

**Date:** 2026-07-08

---

## Context

The original Projects page had list/kanban toggle, status tracking, connected notes/prompts/resources, and a detailed workspace panel. This was over-engineered for an MVP where projects should be simple workspaces that reference knowledge.

## Decision

Projects are workspaces, not project management tools. They:
- Reference existing knowledge (via shared tags)
- Never duplicate knowledge
- Have a minimal feature set: overview, plan, timeline
- Don't have kanban boards, assignments, due dates, or other PM features

We removed:
- Kanban board (drags in complexity without validation)
- List/kanban toggle (not needed with only list view)
- Prompts/notes reference data (not MVP content types)
- Connection counts (no notes/prompts to connect)

## Consequences

Positive:
- Projects are simpler to understand and maintain
- Focus on knowledge execution rather than project management
- Reduced code complexity

Negative:
- Power users may want kanban or other PM features
- No visual project management
- Harder to see "what's next" across projects

## Alternatives Considered

1. **Full project management** (sprints, assignments, due dates) — Rejected: we're not Jira
2. **Remove projects entirely** — Rejected: projects validate the "knowledge becomes execution" hypothesis
3. **Notes as mini-projects** — Rejected: confusing mental model
