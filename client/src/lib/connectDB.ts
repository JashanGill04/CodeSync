import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

// Define a proper type for the cache object
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

// Extend the NodeJS global object to store mongoose cache
declare global {
  // This is required for hot-reload support in Next.js
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use a single global instance to prevent re-connection during hot reloads
const cached: MongooseCache = global.mongoose || {
  conn: null,
  promise: null,
};

global.mongoose = cached;

export default async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => {
      console.log("✅ Connected to MongoDB");
      return mongooseInstance.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
