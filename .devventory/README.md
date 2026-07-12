# Devventory — Internal Engineering Documentation

This folder is the engineering knowledge base for the Devventory project.

It exists **only** for development purposes and should not appear in the application UI.

Open this folder directly in Obsidian for the best experience.

## Structure

```
.devventory/
├── README.md              # This file
├── ROADMAP.md             # Release planning
├── CHANGELOG.md           # Human-readable change log
├── ARCHITECTURE.md        # System architecture & data flow
├── MVP_SCOPE.md           # MVP definition & boundaries
├── FEATURES/              # Per-feature documentation
├── DECISIONS/             # Architecture Decision Records
└── NOTES/                 # Research, problems, ideas
```

## Conventions

- All documents are clean Markdown (Obsidian-compatible)
- Use wikilinks `[[like this]]` for cross-references
- Use callouts (`> [!note]`) for highlights
- Use Mermaid for diagrams
- A feature is not complete until its documentation is updated

## Quick Links

| Area | File |
|------|------|
| Where we're going | [[ROADMAP.md]] |
| What changed | [[CHANGELOG.md]] |
| How it works | [[ARCHITECTURE.md]] |
| What's in scope | [[MVP_SCOPE.md]] |
| Key decisions | [[DECISIONS/0001-knowledge-first.md]] |
| Current problems | [[NOTES/Problems.md]] |
