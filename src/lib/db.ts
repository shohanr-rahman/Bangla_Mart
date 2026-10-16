import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as unknown as {
  mongooseCache?: Cache;
};

const cache: Cache =
  globalForMongoose.mongooseCache ??
  (globalForMongoose.mongooseCache = {
    conn: null,
    promise: null,
  });

export async function connectDB() {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  cache.promise ??= mongoose.connect(uri, {
    bufferCommands: false,
  });

  cache.conn = await cache.promise;
  return cache.conn;
}
