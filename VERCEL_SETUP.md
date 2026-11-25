# Vercel setup checklist

Production site: https://bazardor-a07-mhr.vercel.app

Everything that belongs in the repository is already set up:

- `vercel.json` — Next.js framework preset, `npm install`, `npm run build`, `npm run dev`
- `package.json` — `engines.node >= 20.9.0` (use Node.js 22.x in Vercel)
- `.env.example` — the complete list of environment variables (copy the names, never commit real values)
- `src/lib/auth.ts` — auth URLs are resolved per request, so production, custom domains and Vercel previews all get working callbacks
- `src/lib/auth-client.ts` — the browser client uses the host that served the page
- `src/proxy.ts` — protects `/product-details/*` and `/profile/*`; Next.js handles it, no Vercel routing entry needed

## 1. Project settings

In the Vercel dashboard, open the project and check:

| Setting | Value |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `./` |
| Node.js Version | 22.x |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | leave the Next.js default |
| Function Region | default (`iad1`) is fine; change only if MongoDB is hosted elsewhere |
| System Environment Variables | enable "Access to System Environment Variables" |

## 2. Environment variables

Add these under **Project Settings > Environment Variables**. Use **Secret** for the secrets, **Config** for the URLs. Add each one to Production, Preview and Development (Development is only needed for `vercel dev` / `vercel env pull`).

| Key | Production value | Notes |
| --- | --- | --- |
| `MONGODB_URL` | MongoDB Atlas connection string | Same database is fine for previews, or use a separate DB for Preview |
| `BETTER_AUTH_SECRET` | random string, 32+ chars | Generate with `npx auth secret`; keep the same value in every environment; changing it signs out all users |
| `BETTER_AUTH_URL` | `https://bazardor-a07-mhr.vercel.app` | Server-side fallback URL; the app otherwise derives the URL from the request host |
| `NEXT_PUBLIC_APP_URL` | `https://bazardor-a07-mhr.vercel.app` | Inlined into the browser bundle at build time; not needed in Preview |
| `BETTER_AUTH_GOOGLE_CLIENT_ID` | Google OAuth client ID | Secret-style value, set for all environments |
| `BETTER_AUTH_GOOGLE_SECRET` | Google OAuth client secret | Never commit it |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Set for all environments |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Never commit it |

After changing any variable, **redeploy** — Vercel does not update existing deployments.

If you use the CLI instead of the dashboard:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local   # Development variables
vercel --prod
```

## 3. OAuth callback URLs

In Google Cloud Console (OAuth client) and in the GitHub OAuth app, add:

```txt
https://bazardor-a07-mhr.vercel.app/api/auth/callback/google
https://bazardor-a07-mhr.vercel.app/api/auth/callback/github
```

For any preview deployment where you want social sign-in, also register that preview host with `/api/auth/callback/google` and `/api/auth/callback/github`. Email/password sign-in works on previews without extra OAuth setup.

If you add a custom domain, also set the custom domain as `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` in Production and register its callback URLs.

## 4. Verify a deployment

1. `npm run build` passes locally.
2. Home page and category pages load; the price ticker and cards render.
3. `/signin` and `/signup` work with email/password.
4. Google and GitHub sign-in redirect back and create a session.
5. `/profile` and `/product-details/<id>` redirect to `/signin` when logged out and work when logged in.
6. Sign out works from the profile menu.
