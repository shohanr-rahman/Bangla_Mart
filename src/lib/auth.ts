import dns from "node:dns";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

// কিছু নেটওয়ার্কে DNS আটকে যায়, তাই local-এ Google DNS ব্যবহার করছি
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}





const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

const client =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.MONGODB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

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
          // সাইন আপে শুধু buyer বা seller গ্রহণযোগ্য, admin কখনো নয়
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
          // সাইন আপের পর কেউ নিজের role বদলাতে পারবে না
          const rest = { ...(data as Record<string, unknown>) };
          delete rest.role;
          return { data: rest };
        },
      },
    },
  },
  plugins: [nextCookies()],







});