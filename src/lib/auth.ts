import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not set");
}

const authURL = process.env.BETTER_AUTH_URL;

if (!authURL || !URL.canParse(authURL)) {
  throw new Error(
    "BETTER_AUTH_URL is missing or invalid. Please check your environment variables."
  );
}

const productionURL = "https://bazardor-a07-mhr.vercel.app";

const hostFromURL = (value?: string) => {
  if (!value || !URL.canParse(value)) return null;
  try {
    return new URL(value).host;
  } catch {
    return null;
  }
};

// Allow the real host of each request (production, custom domains and every
// Vercel preview URL), while keeping BETTER_AUTH_URL as the fallback.
const allowedHosts = [
  hostFromURL(authURL),
  hostFromURL(productionURL),
  hostFromURL(process.env.NEXT_PUBLIC_APP_URL),
  hostFromURL(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  "*.vercel.app",
  "localhost:3000",
].filter((host): host is string => Boolean(host));

const trustedOrigins = [
  productionURL,
  authURL,
  "https://*.vercel.app",
  "http://localhost:3000",
];

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(mongoUrl, {
    maxPoolSize: 5,
  });

globalForMongo.mongoClient = client;

const db = client.db("bazar-dor-web");

export const auth = betterAuth({
  baseURL: {
    allowedHosts: [...new Set(allowedHosts)],
    fallback: authURL,
    protocol: "auto",
  },

  trustedOrigins: [...new Set(trustedOrigins)],

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId:
        process.env.BETTER_AUTH_GOOGLE_CLIENT_ID ??
        process.env.GOOGLE_CLIENT_ID ??
        "",
      clientSecret:
        process.env.BETTER_AUTH_GOOGLE_SECRET ??
        process.env.GOOGLE_CLIENT_SECRET ??
        "",
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
});
