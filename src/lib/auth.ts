
import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not configured");
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ?? new MongoClient(uri);

globalForMongo.mongoClient = client;

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "buyer",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = (user as { role?: unknown }).role;
          let role = requested === "seller" ? "seller" : "buyer";

          const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

          if (adminEmail && user.email.toLowerCase() === adminEmail) {
            role = "admin";
          }

          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (data) => {
          const rest = { ...(data as Record<string, unknown>) };
          delete rest.role;
          return { data: rest };
        },
      },
    },
  },
  plugins: [nextCookies()],
});

