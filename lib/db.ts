import mongoose from 'mongoose';

let authConn: mongoose.Connection | null = null;
let dmConn: mongoose.Connection | null = null;
const serverConns = new Map<string, mongoose.Connection>();

export async function connectAuthDB() {
  if (!authConn) {
    authConn = await mongoose.createConnection(process.env.AUTH_DB_URI!, {
      // useNewUrlParser: true,       // ❌ Remove deprecated options
      // useUnifiedTopology: true,    // ❌
    });
  }
  return authConn;
}

// ✅ THIS MUST EXIST AND BE EXPORTED
export async function connectDMDB() {
  if (!dmConn) {
    dmConn = await mongoose.createConnection(process.env.DM_DB_URI!, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
  }
  return dmConn;
}

export async function connectServerDB(serverId: string, dbUri: string) {
  if (!serverConns.has(serverId)) {
    const conn = await mongoose.createConnection(dbUri);
    serverConns.set(serverId, conn);
  }
  return serverConns.get(serverId)!;
}
