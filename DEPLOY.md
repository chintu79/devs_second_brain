# Deployment

## Architecture

```
devventory
├── apps/web/        Next.js 16 app (App Router, Turbopack)
├── apps/extension/  Chrome MV3 extension (WXT)
└── packages/        6 shared packages (motion, ui, types, utils, shared, config)
```

The **web app** is a full-stack Next.js application. The **extension** is a separate Chrome extension. They share types and utilities through the monorepo packages.

---

## Option 1 — Docker (local / self-hosted)

### Prerequisites
- Docker + Docker Compose

### Run

```bash
git clone git@github.com:chintu79/devs_second_brain.git
cd devs_second_brain/apps/web
docker compose up --build
```

Open http://localhost:3000, register an account.

### Production

Edit `docker-compose.yml` to set real secrets, then run detached:

```bash
docker compose up --build -d
```

---

## Option 2 — Render (cloud, easiest)

Follow [RENDER_DEPLOY.md](./RENDER_DEPLOY.md) — one-click deploy from GitHub.

Key settings:
- **Build**: `npm install && npm run build`
- **Start**: `npm start`
- **DB**: Render PostgreSQL or external (Neon, Supabase)

Render auto-deploys on every `git push` to the tracked branch.

---

## Option 3 — Vercel + Neon (production-grade)

### Web app

1. Push to GitHub
2. Import repo in Vercel
3. Set framework to **Next.js**
4. Add environment variables (from `.env.example`)
5. For database, use [Neon](https://neon.tech) (serverless Postgres with `@prisma/adapter-neon`)
6. Build command: `npx prisma generate && next build`
7. Deploy

### Environment variables on Vercel

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Neon connection string (pooled) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `GITHUB_TOKEN` | Optional — GitHub PAT for Radar |
| `OPENROUTER_API_KEY` | Optional — for AI chat |

> **Note**: Prisma client is generated at build time. The Neon adapter (`@prisma/adapter-neon`) is used in production for WebSocket-compatible connections through serverless functions.

---

## Option 4 — Manual (VPS)

Requirements: Node.js 22+, PostgreSQL 16+, pnpm

```bash
# Clone and install
git clone git@github.com:chintu79/devs_second_brain.git
cd devs_second_brain
pnpm install

# Setup database
createdb dev_second_brain
cp apps/web/.env.example apps/web/.env
# Edit .env with your DB credentials + secrets

# Generate Prisma client and push schema
cd apps/web
npx prisma generate
npx prisma db push

# Build and start
pnpm build
pnpm start
```

### Process manager (pm2)

```bash
npm install -g pm2
pm2 start apps/web/node_modules/.bin/next --name devventory -- start -p 3000
pm2 save
pm2 startup
```

---

## Extension Deployment

### Development

```bash
cd apps/extension
pnpm ext:dev   # WXT dev server with HMR
```

### Build

```bash
pnpm ext:build
```

Output: `apps/extension/.output/chrome-mv3/`

### Load unpacked (development / testing)

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select `apps/extension/.output/chrome-mv3/`

### Package for Chrome Web Store

```bash
cd apps/extension
pnpm zip   # creates .output/*.zip
```

Upload the `.zip` to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

### Notes

- The extension uses `<all_urls>` — removed in favor of specific host patterns to avoid Cloudflare challenges
- Content script auto-injects on GitHub, YouTube, and doc sites
- On other sites, click the toolbar icon to activate
