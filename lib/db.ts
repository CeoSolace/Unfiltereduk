import mongoose from 'mongoose';

let authConn: mongoose.Connection | null = null;
const authModels = new Map<string, mongoose.Model>();

export async function connectAuthDB() {
  if (!authConn) {
    authConn = await mongoose.createConnection(process.env.AUTH_DB_URI!);
  }
  return authConn;
}

// Safe model getter
export async function getAuthModel<T>(name: string, schema: mongoose.Schema) {
  if (!authModels.has(name)) {
    const conn = await connectAuthDB();
    authModels.set(name, conn.model<T>(name, schema));
  }
  return authModels.get(name) as mongoose.Model<T>;
}
