# Browser Extension

> The fastest way to capture URLs with context from any web page.

---

## Purpose

The browser extension is one of the highest-priority features. It enables frictionless capture of external knowledge directly from the browser.

## Current Architecture

### Framework
- Built with [WXT](https://wxt.dev/) (v0.20.27)
- Chrome MV3 manifest
- React 19 for popup UI
- TypeScript throughout

### Structure

```
apps/extension/
├── wxt.config.ts              # WXT configuration
├── entrypoints/
│   ├── background.ts          # Service worker — capture forwarding
│   └── content.ts             # Content script — inline popup, selection floater
├── context-engine/            # Site detection and context extraction
│   ├── types.ts               # Type definitions
│   ├── index.ts               # Context engine entry (SPA navigation detection)
│   ├── capabilities.ts        # Capability registry
│   ├── metadata.ts            # Meta tag extraction (OG, Twitter)
│   ├── ui.ts                  # UI helpers (chips, menus, popups)
│   └── popup.ts               # Inline save dialog
├── providers/                 # Per-site providers
│   ├── registry.ts            # Provider registry
│   ├── github.ts              # GitHub provider (repo, file, PR, issue)
│   ├── youtube.ts             # YouTube provider (video pages)
│   ├── docs.ts                # Documentation sites provider (21+ doc sites)
│   └── generic.ts             # Fallback for any page
└── lib/
    └── types.ts               # Shared payload types
```

### Communication Flow

```
Content Script → chrome.runtime.sendMessage → Background Worker → REST API → Web App
```

1. Content script detects page type via providers
2. Shows inline popup or chip for interaction
3. User saves with optional context note
4. Background worker forwards to `/api/ext/capture`
5. Web app creates Resource record + runs AI enrichment

### API Routes (Extension-facing)

| Route | Purpose |
|-------|---------|
| `/api/ext/capture` | Smart capture — extracts metadata, runs AI |
| `/api/ext/save-resource` | Direct resource save with full AI enrichment |
| `/api/ext/save-note` | Save user note |
| `/api/ext/verify-key` | Verify API key |

### Provider Pattern

Each provider implements:
- `detect()` — returns whether this provider matches the current page
- `getActions()` — returns available actions for this page type
- `mountUI()` — injects UI elements (chip, menu)
- `getChipAnchor()` — returns DOM element to anchor chip to

## What We Removed

- Save-prompt endpoint (prompts feature removed)
- Complex AI chat integration (deferred)

## Future Roadmap

- One-click capture (no popup, just a keyboard shortcut)
- Highlight and annotate on page
- Page snapshot/archive
- Safari and Firefox support
- Context menu (right-click → save to Devventory)

## Known Limitations

- Chrome only (MV3)
- No page snapshot/archive
- No annotation/highlight support yet
- Requires API key configuration for non-authenticated users
