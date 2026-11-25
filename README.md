

## About the project

BazarDor is a small website where you can see the daily price of everyday items in Bangladesh. Rice, lentils, oil, vegetables, fish, meat, eggs, milk and spices are all in one place. For every item you can see today's price, how much it went up or down since yesterday, and the price in different markets.

You can browse by category, sort the items by price, and open any item to see the lowest, highest and average price. The details page is only for logged in users, so you need to sign up or sign in first.

The whole site is written in Bangla and works on mobile, tablet and desktop.

## Technologies used

- Next.js (App Router) for pages and routing
- TypeScript
- Tailwind CSS for styling
- daisyUI for ready made components like buttons
- Better Auth for authentication (email and password, Google, GitHub)
- MongoDB to store users, with the Better Auth MongoDB adapter
- react-hot-toast for toast messages
- react-icons for icons
- react-marquee-text for the scrolling price ticker
- Google Fonts through next/font (Hind Siliguri, Noto Sans Bengali, Geist)
- Vercel for deployment

## Features

1. **Live price ticker.** A strip under the navbar keeps scrolling and shows the emoji, name, price per unit and the up or down percentage of some items. It stops when you hover on it.
2. **Price up and price down sections.** The home page shows the top 6 items whose price went up today and the top 6 whose price went down.
3. **All products with sorting.** Every product is shown as a card in a responsive grid. You can sort by default, price low to high, price high to low, most increased and most decreased. The last two are extra options I added myself.
4. **Category pages.** Each category has its own page with a title, an icon and the same product cards. If the category does not exist, the user sees a friendly 404 page with a button to go back home.
5. **Product details page.** It shows the lowest, highest and average price and a market wise price table. It turns into simple cards on small screens. This page is protected, so a user who is not logged in is sent to the sign in page.
6. **Authentication.** Users can sign up and sign in with email and password, or with Google or GitHub. Errors and success messages are shown with toasts.
7. **Profile and update name.** A logged in user can open the profile page, see their details, change their name and sign out.
8. **Bangla numbers and date.** Prices and percentages use Bangla digits, and the navbar shows today's Bangla date.
9. **Loading and error states.** A loading animation is shown while data is coming, and there is a custom 404 page for wrong links.
10. **Fully responsive.** The navbar, ticker, hero, cards and tables all work well on small, medium and large screens.

## Pages

| Route | What it is | Login needed |
| --- | --- | --- |
| `/` | Home page with hero, price up, price down and all products | No |
| `/category/[slug]` | Products of one category | No |
| `/product-details/[id]` | Full price details of one product | Yes |
| `/signin` | Sign in | No |
| `/signup` | Sign up | No |
| `/profile` | User profile | Yes |
| `/profile/updateProfile` | Change name | Yes |

## How to run it on your computer

1. Clone the repo and go inside the folder.

```bash
git clone <your-repo-link>
cd <project-folder>
```

2. Install the packages.

```bash
npm install
```

3. Copy `.env.example` to `.env.local` in the root folder and fill in the values.

```env
MONGODB_URL=your_mongodb_connection_string
BETTER_AUTH_SECRET=random_secret_at_least_32_characters
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_GOOGLE_CLIENT_ID=your_google_client_id
BETTER_AUTH_GOOGLE_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

`.env.local` is gitignored. The aliases `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` and `NEXT_PUBLIC_BETTER_AUTH_URL` also work, but the names above are the ones to use.

4. Start the dev server.

```bash
npm run dev
```

5. Open http://localhost:3000 in your browser.

## Deploying to Vercel

The build settings live in `vercel.json` (Next.js preset, `npm install`, `npm run build`). Route protection is handled by `src/proxy.ts` through Next.js, so no extra Vercel routing config is needed. See `VERCEL_SETUP.md` for the full checklist.

1. In Vercel, import the GitHub repo and keep the detected settings: Framework Preset **Next.js**, Root Directory `./`, Node.js **22.x**, Build Command `npm run build`, Install Command `npm install`.
2. Open **Project Settings > Environment Variables** and add every key from `.env.example`. Add it to **Production**, **Preview** and **Development** (or use `vercel env pull` after adding Development variables).
3. Keep `BETTER_AUTH_SECRET` identical in all environments. Generate one with `npx auth secret` and store it as a Secret variable.
4. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to `https://bazardor-a07-mhr.vercel.app` (or your custom domain) in Production. Auth URLs are resolved per request, so preview deployments get their own callback URLs automatically.
5. In **Project Settings**, enable **Access to System Environment Variables** so `VERCEL_URL` is available.
6. In the Google and GitHub OAuth app settings, add these callback URLs (add each preview URL you actually use too):

   ```txt
   https://bazardor-a07-mhr.vercel.app/api/auth/callback/google
   https://bazardor-a07-mhr.vercel.app/api/auth/callback/github
   ```

7. Push to the production branch (or run `vercel --prod`). After changing an environment variable, redeploy: existing deployments keep their old values.
8. Check `/`, `/signin`, email sign up/in, Google and GitHub sign in, `/profile` and a protected `/product-details/[id]` page.

## Folder overview

```
src/
  app/
    components/     navbar, hero, footer, ticker, product cards
    category/       category pages
    product-details/ product details page
    signin/ signup/ auth pages
    profile/        profile and update name pages
    api/auth/       Better Auth route
  lib/              auth setup for server and client
  proxy.ts          protects the private routes
```

## Note

I wrote this project and this README myself. I only took some help from AI to make the language and wording of the README better.
