# Dashboard

> The continuation page. Answers "What should I work on next?"

---

## Purpose

The Dashboard is not an analytics dashboard. It exists to help users continue where they left off.

## Philosophy

The dashboard should answer three questions:

1. What should I continue working on?
2. What did I recently capture?
3. Is anything stale?

## Current Scope

Two sections:

### Continue Working
- Top 5 items (projects + references) sorted by most recently updated
- Projects link directly to `/projects?id=X`
- References link directly to `/knowledge?id=X`
- Each item shows type icon, title, relative timestamp

### Recent Captures
- Last 5 references sorted by creation date
- Quick access to recently saved content
- Each item shows type icon, title, relative timestamp

## What We Removed

- Streak counter (motivational, not functional)
- Daily Brief (today's activity summary)
- Weekly Progress (item counts by type)
- Knowledge Insights (dormant notes, total items)
- Daily log integration (removed as separate feature)
- Analytics graphs and charts

## Future Roadmap

- "Stale items" section (things not reviewed in 30+ days)
- Customizable sections (user picks what to show)
- Quick capture widget (one-click URL save)
- Weekly digest (what you saved this week)

## Known Limitations

- No customization (sections are fixed)
- No "stale items" warning yet
- No quick-capture widget
