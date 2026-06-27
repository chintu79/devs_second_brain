# Dev Second Brain

A developer-focused knowledge OS. Save, organize, search, and rediscover resources, AI prompts, notes, and projects — all connected through tags and surfaced through context panels.

> Save. Connect. Retrieve.

---

## For Users

### What you can do

| Area | What it does |
|------|--------------|
| **Resources** | Save links, articles, tools, and videos with category, tags, and personal notes |
| **Prompts** | Reusable AI prompts with variables, versioning, categories, and copy-to-clipboard |
| **Notes** | Markdown editor with tags, backlinks, and a sidebar browser |
| **Projects** | Long-form project docs with structured PLAN.md workspaces and milestones |
| **Radar** | Open Source Radar — trending repos with growth indicators (Hot / Trending / Rising) |
| **Search** | Global fuzzy search across all vaults with type-colored grouped results and a preview panel |
| **Dashboard** | Hero greeting, Continue Working, Recent Activity timeline, Knowledge Library vault cards |
| **Chat** | AI chat with vault-aware context — ask questions about your saved items |
| **Graph** | Interactive knowledge graph visualizing tag/item relationships |
| **Quick Capture** | Cmd+Shift+K to save anything without leaving your current page |
| **Sections** | Per-section accent colors, collapsible sidebars, animated panels |

### Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette / global search |
| `Cmd+Shift+K` | Open Quick Capture modal |
| `Esc` | Close panels, modals, and palettes |

---

## For Contributors

### Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| Database | PostgreSQL + Prisma (with `@prisma/adapter-pg`) |
| Auth | NextAuth v5 (Credentials provider, JWT sessions) |
| Animation | Framer Motion (centralized variants in `src/lib/motion.ts`) |

### Prerequisites

Install these before starting:

| Software | Download |
|----------|----------|
| **Node.js 22+** | [nodejs.org](https://nodejs.org) (includes npm) |
| **Git** | [git-scm.com/downloads](https://git-scm.com/downloads) |
| **PostgreSQL 16+** | [postgresql.org/download](https://www.postgresql.org/download/) — or use [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Docker](https://docs.docker.com/get-docker/) for quick setup |

### Setup

```bash
git clone <repo-url>
cd dev-second-brain
npm install
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npx prisma generate
npx prisma db push
npm run dev
```

Open http://localhost:3000, register an account, and explore.

### Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Encryption secret for JWT (run `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Yes | Application URL (e.g. `http://localhost:3000`) |
| `GITHUB_TOKEN` | No | GitHub personal access token for Radar (higher rate limits) |
| `OPENROUTER_API_KEY` | No | OpenRouter key for AI chat features |
| `OPENROUTER_MODEL` | No | Model override (default: `meta-llama/llama-3.2-3b-instruct:free`) |

### Project structure

```
src/
├── actions/            # Server actions (auth, CRUD, search)
├── app/
│   ├── (auth)/         # Login, register
│   ├── (dashboard)/    # Dashboard, vaults, search, radar, chat, docs
│   └── api/            # NextAuth + API routes
├── components/
│   ├── auth/           # Auth page components
│   ├── ui/             # shadcn/ui primitives
│   ├── layout/         # Sidebar, navbar, shell
│   ├── dashboard/      # Command bar, activity, vault cards
│   ├── landing/        # Landing page hero, features, arrows
│   ├── resources/      # List, filters, reader panel, context panel
│   ├── prompts/        # List, filters, card, preview panel, context panel
│   ├── notes/          # List, sidebar, reader panel
│   ├── projects/       # List, sidebar, workspace panel
│   ├── radar/          # Feed, sidebar, repo card, detail panel, context panel
│   ├── search/         # Search bar, result card, preview panel, context panel
│   ├── chat/           # Chat UI, context panel, workspace
│   ├── docs/           # TOC, reading progress bar
│   ├── shared/         # EmptyState, ScrollReveal, etc.
│   └── vaults/         # NoteCard, ResourceCard, ProjectCard, PromptCard
├── lib/                # Auth config, Prisma client, utils, motion variants, mock data
├── generated/          # Generated Prisma client
└── middleware.ts       # Route protection
```

### Design conventions

- **Animations**: All Framer Motion variants centralized in `src/lib/motion.ts`. Use shared variants (`fadeInUp`, `slideInRight`, `stagger`, `cardHover`) instead of inline `initial`/`animate` objects.
- **Hover scale hierarchy**: 1.01 (cards), 1.015 (cardHover variant), 1.02 (sidebar/context), 1.03 (nav/CTA), 1.05 (icons), 1.1 (toolbar). Always `transition-all duration-150`.
- **Section accent colors**: Applied via `data-accent` attribute on page wrappers. Colors defined in `globals.css` as CSS variables.
- **Panels**: Detail/preview panels use `w-[800px]` (`.panel-detail`), context panels use `w-[320px]` (`.panel-context`), sidebars use `w-56`.
- **Editing**: Inline in preview panels for existing items. Create still uses a dialog.
- **Page height**: All pages use `calc(100vh - var(--header-height))` with `--header-height: 56px`.
- **Server components by default**, client components only where interactivity is needed.

### Contributing

1. Open an issue for discussion before starting significant work.
2. Fork the repo and create a feature branch.
3. Run `npm run lint` and `npx tsc --noEmit` before committing.
4. Keep changes focused — prefer deletion over addition.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db push` | Push schema to database |

---

## License

MIT
