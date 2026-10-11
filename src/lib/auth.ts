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
  baseURL: authURL,

  trustedOrigins: [
    "https://bazardor-a07-mhr.vercel.app",
  ],

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId:
        process.env.BETTER_AUTH_GOOGLE_CLIENT_ID ?? "",
      clientSecret:
        process.env.BETTER_AUTH_GOOGLE_SECRET ?? "",
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    },
  },
});
