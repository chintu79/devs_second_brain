# AI

> AI should quietly improve existing workflows, not create new ones.

---

## Purpose

AI in Devventory is limited to making capture and organization faster. No AI chat, no AI agents, no complex workflows.

## Current Scope

### Metadata Generation
- On capture, extract: title, description, OG tags from URL
- AI generates: category, tags, summary

### AI Functions (lib/ai.ts)
- `suggestCategory(title, content)` — Returns best category from predefined list
- `suggestTags(title, content, url?)` — Returns relevant tags
- `summarizeContent(title, content)` — Returns 1-2 sentence summary
- `suggestTechnologies(title, content)` — For dev content, extracts tech stack
- `suggestDifficulty(title, content)` — beginner/intermediate/advanced
- `suggestKeywords(title, content)` — Important terms

### Integration Points
- Browser extension capture → AI enrichment → create Reference
- Manual save → AI enrichment → update Reference

### Backend
- OpenRouter API (configurable model)
- Minimal streaming (not needed for single-shot enrichment)
- Fallback to defaults if AI is unavailable

## What We Removed

- AI Chat (`/api/chat`) — full streaming chat removed from MVP
- AI workspace — no dedicated AI page
- AI agents — no complex workflow automation
- Knowledge graph AI — no graph in MVP
- Recommendations engine — no user behavior data yet

## Future Roadmap

- Auto-tagging based on existing tag patterns
- Related knowledge suggestions
- Duplicate detection
- Content summarization for saved references
- Weekly AI-generated digest

## Known Limitations

- Requires OpenRouter API key (user configurable)
- No local/offline AI support
- No caching of AI results (re-runs on each enrichment)
- AI is "best effort" — users must verify generated metadata
