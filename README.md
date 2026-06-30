# Dev Second Brain

A developer-focused knowledge OS. Save, organize, search, and rediscover resources, AI prompts, notes, and projects — all connected through tags and surfaced through context panels. Includes a **Chrome extension** for one-click capture from any page.

> Capture. Connect. Retrieve.

---

## Features

| Area | What it does |
|------|--------------|
| **Resources** | Save links, articles, tools, videos with category, tags, and personal notes |
| **Prompts** | Reusable AI prompts with variables, categories, and copy-to-clipboard |
| **Notes** | Markdown editor with tags, backlinks, and a sidebar browser |
| **Projects** | Long-form project docs with structured PLAN.md workspaces and milestones |
| **Radar** | Open Source Radar — trending repos with growth indicators (Hot / Trending / Rising) |
| **Search** | Global fuzzy search across all vaults with grouped results and preview panel |
| **Dashboard** | Hero greeting, Continue Working, Recent Activity timeline, Knowledge Library |
| **Chat** | AI chat with vault-aware context — ask questions about your saved items |
| **Graph** | Interactive knowledge graph visualizing tag/item relationships |
| **Extension** | Chrome extension — contextual chips on GitHub, YouTube, docs; text selection float button |

---

## Quick Start (Docker)

```bash
git clone git@github.com:chintu79/devs_second_brain.git
cd devs_second_brain/apps/web
docker compose up --build
```

Open http://localhost:3000, register an account.

> See [DEPLOY.md](./DEPLOY.md) for all deployment options (Render, Vercel, VPS, extension).

---

## Project Structure

```
devventory
├── apps/
│   ├── web/                    # Next.js 16 web application
│   │   ├── src/
│   │   │   ├── actions/        # Server actions (CRUD, search, auth)
│   │   │   ├── app/            # App Router pages + API routes
│   │   │   │   ├── (auth)/     # Login, register
│   │   │   │   ├── (dashboard)/# Dashboard, vaults, radar, search, chat, docs
│   │   │   │   └── api/        # API routes (NextAuth, ext, chat)
│   │   │   ├── components/     # React components by domain
│   │   │   ├── hooks/          # Custom hooks (use-autosave)
│   │   │   └── lib/            # Auth, Prisma, AI, GitHub, tags, motion
│   │   ├── prisma/             # Schema + migrations
│   │   └── Dockerfile
│   │
│   └── extension/              # Chrome MV3 browser extension (WXT)
│       ├── entrypoints/        # background.ts, content.ts
│       ├── providers/          # GitHub, YouTube, Docs, Generic + Registry
│       ├── context-engine/     # Capability system, popup, UI, metadata
│       └── lib/                # Types, messages
│
├── packages/
│   ├── motion/                 # Framer Motion variants (fadeInUp, slideInRight, stagger)
│   ├── types/                  # Zod schemas + category constants
│   ├── ui/                     # shadcn/ui primitives (Button, Dialog, Command, Select)
│   ├── shared/                 # EmptyState, ErrorCard, IconBtn, Markdown
│   ├── utils/                  # cn(), formatDate(), formatRelative()
│   └── config/                 # Shared tsconfig
│
├── DEPLOY.md                   # Full deployment guide
├── CONTRIBUTING.md             # Contribution guidelines
└── RENDER_DEPLOY.md            # Render-specific instructions
```

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + Base UI |
| Database | PostgreSQL + Prisma (Neon adapter for serverless) |
| Auth | NextAuth v5 (Credentials provider, JWT) |
| Animation | Framer Motion (centralized variants in `@devventory/motion`) |
| AI | OpenRouter (chat, summarization, enrichment) |
| Extension | WXT 0.20 (Chrome MV3) |
| Monorepo | pnpm workspaces + Turborepo |

---

## Environment Variables

See `apps/web/.env.example` for all variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | — | JWT encryption secret |
| `NEXTAUTH_URL` | Yes | — | App URL (e.g. `http://localhost:3000`) |
| `GITHUB_TOKEN` | No | — | GitHub PAT for Radar (higher rate limits) |
| `OPENROUTER_API_KEY` | No | — | OpenRouter key for AI chat/enrichment |
| `OPENROUTER_MODEL` | No | `meta-llama/llama-3.2-3b-instruct:free` | Model override |

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode (Turborepo) |
| `pnpm build` | Build all apps |
| `pnpm lint` | ESLint across all apps |
| `pnpm web:dev` | Web app dev server only |
| `pnpm web:build` | Web app production build |
| `pnpm ext:dev` | Extension dev server (HMR) |
| `pnpm ext:build` | Extension production build |
| `pnpm clean` | Clean all caches |

---

## Design Conventions

- **Animations**: All Framer Motion variants in `packages/motion/src/motion.ts`. Use shared variants (`fadeInUp`, `slideInRight`, `stagger`, `cardHover`) instead of inline `initial`/`animate` objects.
- **Hover scale hierarchy**: 1.01 (cards), 1.015 (cardHover), 1.02 (sidebar), 1.03 (nav/CTA), 1.05 (icons), 1.1 (toolbar). `transition-all duration-150`.
- **Section accent colors**: Applied via `data-accent` attribute. Defined in `globals.css`.
- **Server components by default**, client components only where interactivity is needed.
- **Provider registry**: Adding a new site to the extension requires one provider file + `register()`.

---

## License

MIT
