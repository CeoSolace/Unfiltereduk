// lib/db.ts
import mongoose from 'mongoose';

let authConn: mongoose.Connection | null = null;
let dmConn: mongoose.Connection | null = null;
const serverConns = new Map<string, mongoose.Connection>();

/**
 * Connects to the Auth database (singleton per process)
 */
export async function connectAuthDB(): Promise<mongoose.Connection> {
  if (authConn?.readyState === 1) {
    return authConn;
  }

  if (!process.env.AUTH_DB_URI) {
    throw new Error('AUTH_DB_URI is not defined in environment variables');
  }

  authConn = mongoose.createConnection(process.env.AUTH_DB_URI, {
    // Recommended options
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  console.log('Connected to Auth DB');
  return authConn;
}

/**
 * Connects to the DM database (singleton)
 */
export async function connectDMDB(): Promise<mongoose.Connection> {
  if (dmConn?.readyState === 1) {
    return dmConn;
  }

  if (!process.env.DM_DB_URI) {
    throw new Error('DM_DB_URI is not defined');
  }

  dmConn = mongoose.createConnection(process.env.DM_DB_URI, {
    maxPoolSize: 10,
  });

  console.log('Connected to DM DB');
  return dmConn;
}

/**
 * Connects to a per-server database (cached by serverId)
 */
export async function connectServerDB(serverId: string, dbUri: string): Promise<mongoose.Connection> {
  if (!serverId || !dbUri) {
    throw new Error('serverId and dbUri are required');
  }

  if (serverConns.has(serverId)) {
    const conn = serverConns.get(serverId)!;
    if (conn.readyState === 1) return conn;
  }

  const conn = mongoose.createConnection(dbUri, {
    maxPoolSize: 5, // Lower per server
  });

  serverConns.set(serverId, conn);
  console.log(`Connected to server DB: ${serverId}`);
  return conn;
}

/**
 * Optional: Graceful shutdown
 */
export function closeAllConnections() {
  return Promise.all([
    authConn?.close(false),
    dmConn?.close(false),
    ...Array.from(serverConns.values()).map((conn) => conn.close(false)),
  ]);
}
