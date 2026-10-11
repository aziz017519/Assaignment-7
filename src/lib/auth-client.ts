import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "https://assaignment-7-rcl4ak2xz-aziz017519-7030.vercel.app");

export const authClient = createAuthClient({
  baseURL,
});
