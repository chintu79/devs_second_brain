# Deploy to Render

## Prerequisites

- A [Render](https://render.com) account (GitHub login)
- Your repo pushed to GitHub

## 1. Create a PostgreSQL Database (if not already hosted)

1. Render Dashboard → **New +** → **PostgreSQL**
2. Name it, select region (closest to you), free tier works for small apps
3. After creation, copy the **Internal Database URL** from the Connection Details

## 2. Deploy the Web Service

1. Render Dashboard → **New +** → **Web Service**
2. **Connect your GitHub repo** — grant permission and select this repository
3. Use these settings:

   | Field | Value |
   |-------|-------|
   | Name | `dev-second-brain` (or anything) |
   | Language | `Node` |
   | Branch | `main` |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |
   | Plan | Free (Hobby) |

4. **Add Environment Variables** (click **Advanced** → **Add Environment Variable**):

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Internal Database URL from step 1 |
   | `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
   | `NEXTAUTH_URL` | `https://your-app-name.onrender.com` |

5. Click **Create Web Service**

## 3. Auto-deploys

Render watches your branch. Every `git push` triggers a new build and deploy. No manual steps.

## Troubleshooting

- **Build fails** → Check build logs for missing env vars or build errors
- **App crashes on start** → Ensure `DATABASE_URL` is the _internal_ Render URL, not `localhost`
- **NextAuth errors** → Verify `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your Render URL exactly
- **DB connection refused** → If using external DB, use the External Database URL instead; make sure the DB accepts connections from Render's IP range
