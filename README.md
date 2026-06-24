# Dev Second Brain

A developer-focused knowledge management platform. Save, organize, search, and rediscover resources, prompts, notes, and projects.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL + Prisma 7 (with `@prisma/adapter-pg`)
- **Auth:** NextAuth v5 (Credentials + JWT)

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/dashboard` | Protected | Overview stats and recent activity |
| `/resources` | Protected | Resource vault (links, articles, tools) |
| `/prompts` | Protected | Prompt vault (reusable AI prompts) |
| `/notes` | Protected | Notes vault (markdown notes) |
| `/projects` | Protected | Project vault (ideas and plans) |
| `/projects/[id]` | Protected | Project detail with PLAN.md |
| `/radar` | Protected | Open Source Radar (trending repos) |
| `/search` | Protected | Global search across all vaults |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── actions/        # Server actions (auth, resources, prompts, notes, projects, search)
├── app/            # Next.js App Router pages and layouts
│   ├── (auth)/     # Login and register pages
│   ├── (dashboard)/# Protected pages with sidebar layout
│   └── api/        # NextAuth API route
├── components/
│   ├── ui/         # shadcn/ui primitives
│   ├── layout/     # Navbar, Sidebar, Shell
│   ├── vaults/     # Vault-specific components (cards, dialogs)
│   └── shared/     # EmptyState, SearchBar, TagBadge, CopyButton
├── generated/      # Generated Prisma client
├── lib/            # Auth config, Prisma client, utils, mock data
└── middleware.ts   # Route protection
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma migrate dev` | Create and apply migrations |

## Deployment

Recommended: Vercel (frontend) + Supabase PostgreSQL (database).

Set the following environment variables:

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — Encryption secret for NextAuth
- `NEXTAUTH_URL` — Production URL
