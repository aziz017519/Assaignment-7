import { createAuthClient } from "better-auth/react";

const configuredURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  "https://bazardor-a07-mhr.vercel.app";

// In the browser, talk to the host that served the page. This makes localhost,
// the production domain, custom domains and Vercel previews work without a
// rebuild; configuredURL is only used when there is no window (build/SSR).
const baseURL =
  typeof window !== "undefined" ? window.location.origin : configuredURL;

export const authClient = createAuthClient({
  baseURL,
});
