import mongoose from 'mongoose'

const MONGODB_URI: string = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in .env.local')
}

let cached = (global as any).mongoose || { conn: null, promise: null }

export default async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB')
        return mongoose
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}
