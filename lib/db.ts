// lib/db.ts
import mongoose from 'mongoose';

let authConn: mongoose.Connection | null = null;

export async function connectAuthDB(): Promise<mongoose.Connection> {
  // Reuse if already connected
  if (authConn && authConn.readyState === 1) {
    return authConn;
  }

  if (!process.env.AUTH_DB_URI) {
    throw new Error('AUTH_DB_URI is missing');
  }

  // Close old dead connection
  if (authConn) {
    await authConn.close();
  }

  authConn = mongoose.createConnection(process.env.AUTH_DB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });

  authConn.on('connected', () => {
    console.log('Connected to Auth DB');
  });

  authConn.on('error', (err) => {
    console.error('Auth DB connection error:', err);
  });

  return authConn;
}
