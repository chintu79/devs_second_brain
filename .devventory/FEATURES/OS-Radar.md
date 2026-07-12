# OS Radar

> Lightweight discovery of relevant developer resources.

---

## Purpose

OS Radar surfaces trending developer resources (GitHub repos, tools, technologies) that might be relevant to the user's interests.

## Current Scope

- Trending GitHub repos fetched from GitHub API
- Search and filter by category
- Bookmark repos for later
- Save bookmarked repos as References
- Three-column layout: sidebar | feed | detail

## Architecture

- `actions/radar-bookmark.ts` — Bookmark management
- `lib/github.ts` — GitHub trending repos fetcher
- `lib/mock-data.ts` — Fallback data when GitHub API unavailable
- `components/radar/` — Radar workspace components

## What We Removed

- AI-powered recommendations (deferred — no user behavior data yet)
- Advanced personalization (deferred — need usage patterns first)
- "Save to Resources" — radar is self-contained (bookmark = save)

## Future Roadmap

- Personalization based on user's tags and saved references
- More sources (Product Hunt, Hacker News, Dev.to, etc.)
- Weekly digest of new discoveries
- Auto-bookmark based on interest matching
- Trending topics across the user's knowledge graph

## Known Limitations

- Only supports GitHub trending repos (one source)
- No personalization (shows same feed to all users)
- Relies on GitHub API rate limits (with mock fallback)
