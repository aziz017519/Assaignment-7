import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not set");
}

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

const client =
    globalForMongo.mongoClient ??
    new MongoClient(process.env.MONGODB_URL, {
        maxPoolSize: 5,
    });

globalForMongo.mongoClient = client;

const db = client.db("bazar-dor-web");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
        "https://bazardor-a07-mhr.vercel.app",
        "https://*.vercel.app",
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
    },
    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET as string,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },
    database: mongodbAdapter(db),
});