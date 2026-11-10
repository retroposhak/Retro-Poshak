import mongoose from 'mongoose';
import { env } from './env.js';

// Cache the connection globally so it persists across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail immediately if not connected instead of buffering
      serverSelectionTimeoutMS: 5000, // Try for 5s, then fail (instead of default 30s)
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Keep pool small per function instance
    };

    cached.promise = mongoose.connect(env.mongoUri, opts).then((mongoose) => {
      console.log('[db] MongoDB connected');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDB() {
  // Only disconnect locally; on Vercel, let the connection persist
  if (process.env.NODE_ENV !== 'production') {
    await mongoose.disconnect();
  }
}