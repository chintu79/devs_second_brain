# Contributing

## Before You Start

1. **Open an issue** for discussion before starting significant work. We don't want you to build something that won't be merged.
2. Check existing issues and PRs to avoid duplication.
3. The project follows a **design manifesto** — read `AGENTS.md` for the full principles. Key points:
   - **Capture frictionlessly**: A thought should never disappear because the interface was slower than the user's brain.
   - **Reveal progressively**: Never show everything at once. One primary action per screen.
   - **Preserve context**: Prefer panels, sheets, split views over full page navigation.
   - **Everything is connected**: No item exists independently. Every page should answer "Where is this used?"
   - **Build for retrieval**: Every saved item should answer "Why did I save this?"

## Development Setup

### Prerequisites

- **Node.js 22+** (use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))
- **pnpm 9+** (`npm install -g pnpm`)
- **Docker** (for PostgreSQL — or have a running Postgres instance)
- **Git**

### Clone and Install

```bash
git clone git@github.com:chintu79/devs_second_brain.git
cd devs_second_brain
pnpm install
```

### Database

```bash
# Start PostgreSQL (Docker)
docker run -d --name devventory-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dev_second_brain \
  -p 5432:5432 \
  postgres:16-alpine

# Or use the Docker Compose setup
cd apps/web && docker compose up db -d
```

### Environment

```bash
cp apps/web/.env.example apps/web/.env
# Edit .env with your database credentials + generate NEXTAUTH_SECRET
```

### Run

```bash
# Web app (http://localhost:3000)
pnpm web:dev

# Extension (HMR)
pnpm ext:dev
```

## Project Architecture

### Monorepo Layout

```
apps/web/           Next.js app — server actions, API routes, components
apps/extension/     Chrome extension — providers, context engine, content scripts
packages/           Shared: motion, types, ui, utils, shared, config
```

### Key Patterns

- **Provider Registry** (`apps/extension/providers/registry.ts`): Adding a new site provider requires one file. The provider self-registers via `register()`.
- **Capability System** (`apps/extension/context-engine/capabilities.ts`): Providers declare capabilities (e.g. `["repository", "code", "summary"]`). The UI renders actions from a central `ACTION_REGISTRY`.
- **Single Capture API**: The extension sends all saves to `POST /api/ext/capture`. The backend classifies the content type.
- **Server Actions**: Web UI uses Next.js server actions (not API routes). API routes are only for the extension.

## Code Guidelines

### General

- **TypeScript everywhere**. No `any` unless unavoidable.
- **Server components by default**. Only add `"use client"` when you need interactivity.
- **Prefer deletion over addition**. If a feature can be simpler, make it simpler.
- **No speculative abstractions**. Don't extract an interface until there's a second implementation.

### Components

- Use Framer Motion variants from `@devventory/motion` (not inline `initial`/`animate`).
- Follow the hover scale hierarchy:
  - 1.01 — cards, items
  - 1.015 — `cardHover` variant (search/repo/prompt cards)
  - 1.02 — sidebar items, context panel links
  - 1.03 — nav links, filter pills, CTA buttons
  - 1.05 — workflow icons
  - 1.1 — toolbar icon buttons
- All interactive hovers: `transition-all duration-150`

### Extension

- Providers go in `apps/extension/providers/`. Each file self-registers.
- The `detect()` method must be fast (no network calls, minimal DOM queries).
- The `extract()` method can be heavier (reads page metadata).
- Capabilities are static arrays — don't compute them at runtime.
- Use `chrome.runtime.sendMessage` (not blob injection) for API calls.

### CSS

- Section accent colors via `data-accent` attribute on page wrappers.
- Use Tailwind utilities. No hand-written CSS except in `globals.css` for variables.
- `packages/ui/` owns shadcn primitives. Don't add new ones to `apps/web/src/components/ui/`.

### Commits

- Write clear, concise commit messages.
- Keep commits focused — one logical change per commit.
- Reference issues in commit messages when applicable.

## Pull Request Process

1. Fork the repo and create a feature branch from `main`.
2. Make your changes.
3. Run validation:
   ```bash
   pnpm lint
   pnpm build
   ```
4. If you changed the extension, build it too:
   ```bash
   pnpm ext:build
   ```
5. Open a PR against `main`.
6. Keep PRs small and focused. A PR should do one thing.

## What Needs Help

- **New providers**: Stack Overflow, ChatGPT, Claude, Reddit, Hacker News, ArXiv
- **Extension polish**: Keyboard shortcuts, tooltips, accessibility
- **AI enrichment**: Better prompts for categorization and summarization
- **Backend classification**: Improve the `/api/ext/capture` classifier
- **Tests**: The project has no tests yet. Start with the extension providers and server actions.
