# Dev Second Brain

**A developer-focused knowledge OS.** Save, organize, search, and rediscover resources, AI prompts, notes, and projects — all connected in a single workspace.

> Save. Connect. Retrieve.

---

## Features

| Area | What it does |
|------|--------------|
| **Resources** | Save links, articles, tools, and videos with tags and notes |
| **Prompts** | Reusable AI prompts with variables, versioning, and categories |
| **Notes** | Editor with markdown, tags, and backlinks |
| **Projects** | Long-form project notes with structured plans (PLAN.md) |
| **Radar** | Open Source Radar — trending repos with growth indicators |
| **Search** | Global fuzzy search across all vaults with grouped results |
| **Dashboard** | Continue working, recent activity, knowledge library overview |

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| Database | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Auth | NextAuth v5 (Credentials provider, JWT sessions) |
| Motion | Framer Motion (centralized variants in `src/lib/motion.ts`) |
| Scroll | Lenis (smooth scroll on landing page) |

---

## Getting Started

### 1. Prerequisites

- Node.js 22+
- PostgreSQL database (local or Supabase)
- A `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)

### 2. Install

```bash
git clone <repo-url>
cd dev-second-brain
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dev-second-brain"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Start

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register an account, then explore.

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page (Lenis smooth scroll, animated hero, typewriter) |
| `/login` | Public | Sign in (asymmetrical layout with animated brand panel) |
| `/register` | Public | Create account (matching login design) |
| `/dashboard` | Protected | Continue working, recent activity, knowledge library |
| `/resources` | Protected | Resource vault — links, articles, tools |
| `/prompts` | Protected | Prompt vault — reusable AI prompts |
| `/notes` | Protected | Notes vault — markdown with tags and backlinks |
| `/projects` | Protected | Project vault — ideas, plans, and structured documents |
| `/projects/[id]` | Protected | Project detail with PLAN.md workspace |
| `/radar` | Protected | Open Source Radar — trending repos, growth insights |
| `/search` | Protected | Global search across all vaults (debounced, grouped results) |

### Auth flow

```
Landing  →  Register (/register)  →  Login (/login)  →  Dashboard
                                                          │
                                                    Sidebar "Sign out"
                                                          │
                                                     Landing (/)
```

- Credentials-only (email + password, bcrypt-hashed)
- Sessions via JWT (no database sessions)
- Auth pages use a 40/60 asymmetrical layout: left side with floating knowledge cards, right side with the form

---

## Project Structure

```
src/
├── actions/              # Server actions (auth, resources, prompts, notes, projects, search)
├── app/
│   ├── (auth)/           # Login, register, error, loading
│   ├── (dashboard)/      # Dashboard, resources, prompts, notes, projects, search, radar
│   └── api/auth/         # NextAuth catch-all route
├── components/
│   ├── auth/             # Auth brand panel
│   ├── ui/               # shadcn/ui primitives (button, input, card, label, etc.)
│   ├── layout/           # Sidebar (animated active indicator), navbar (floating pill), dashboard shell
│   ├── dashboard/        # Continue working, recent activity, knowledge library, command bar, context panel
│   ├── landing/          # Hero entrance, typewriter, animated arrow, smooth scroll, fade-in, navbar
│   ├── resources/        # Resource list, filters, context panel
│   ├── prompts/          # Prompt list, filters, card, preview panel, context panel
│   ├── notes/            # Note list, sidebar, reader panel
│   ├── projects/         # Project list, sidebar, workspace
│   ├── radar/            # Radar feed, sidebar, repository card, detail panel, context panel
│   ├── search/           # Search bar, result card, preview panel, context panel
│   ├── shared/           # EmptyState, SearchBar, TagBadge, CopyButton, ScrollReveal
│   └── vaults/           # NoteCard, ResourceCard, ProjectCard, PromptCard
├── lib/                  # Auth config (NextAuth), Prisma client, utils, motion variants, mock data
├── generated/            # Generated Prisma client
└── middleware.ts         # Route protection (redirects unauthenticated users to /login)
```

---

## Design System

### Core philosophy

- **Calm by default** — whitespace is a feature, typography leads, color is tertiary
- **Motion explains** — all animation is intentional (entrance, hierarchy, focus, navigation)
- **Everything is connected** — every page answers "Where is this used?"
- **Build for retrieval** — search is the primary interface

### Theme

- Notion-inspired color system with semantic tokens (`--text-primary`, `--text-muted`, etc.)
- Per-section accent colors (dashboard indigo, resources teal, prompts amber, notes green, projects violet, radar cyan, search red, settings gray)
- Light and dark mode via CSS variables
- Surface elevation layers (surface-0 through surface-4)
- Border hierarchy: `.border-page`, `.border-interactive`, `.border-active`, `.border-hover`

### Motion vocabulary

| Pattern | Usage | Timing |
|---------|-------|--------|
| Blur + fade + slide | Page transitions | 300ms |
| Stagger | Lists, feeds, auth forms | 60ms between items |
| Slide in right | Preview panels, workspaces | 300ms |
| Scale in | Modals, overlays | 200ms |
| Hover lift | Cards, items | 150ms |
| Float | Auth brand cards | 4–6s loop |

All variants centralized in `src/lib/motion.ts`. Hover scale hierarchy: 1.01 (cards) → 1.02 (sidebar) → 1.03 (nav/CTA) → 1.05 (icons) → 1.1 (toolbar).

### Auth experience

- Asymmetrical 40/60 layout (brand panel | form workspace)
- Animated floating cards on the left previewing each vault type
- Staggered Framer Motion entrance (blur in → fade in → slide up)
- Premium 48px inputs with `rounded-xl`, per-page accent focus rings
- Password visibility toggle, forgot password link
- Custom error/loading states matching the new design

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma migrate dev` | Create and apply database migrations |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Encryption secret for NextAuth JWTs |
| `NEXTAUTH_URL` | Yes | Application URL (needed for auth callbacks) |

---

## Deployment

Recommended stack: **Vercel** (frontend) + **Supabase PostgreSQL** (database).

1. Push to GitHub
2. Import into Vercel
3. Set the three environment variables in Vercel dashboard
4. Deploy
