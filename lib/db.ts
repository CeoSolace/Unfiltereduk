import mongoose from 'mongoose';

// Connection caches
let authConn: mongoose.Connection | null = null;
let dmConn: mongoose.Connection | null = null;
const serverConns = new Map<string, mongoose.Connection>();

/**
 * Connect to the global authentication database (unfiltered_auth)
 */
export async function connectAuthDB() {
  if (!authConn) {
    authConn = await mongoose.createConnection(process.env.AUTH_DB_URI!);
  }
  return authConn;
}

/**
 * Connect to the global DM database (unfiltered_dm)
 */
export async function connectDMDB() {
  if (!dmConn) {
    dmConn = await mongoose.createConnection(process.env.DM_DB_URI!);
  }
  return dmConn;
}

/**
 * Connect to a per-server database (server_<id>)
 * Each server has its own isolated MongoDB database
 */
export async function connectServerDB(serverId: string, dbUri: string) {
  if (!serverConns.has(serverId)) {
    const conn = await mongoose.createConnection(dbUri);
    serverConns.set(serverId, conn);
  }
  return serverConns.get(serverId)!;
}
