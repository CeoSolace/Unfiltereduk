// models/ServerMembership.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model } from 'mongoose';

const serverMembershipSchema = new Schema({
  userId: { type: String, required: true },
  serverId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

serverMembershipSchema.index({ userId: 1, serverId: 1 }, { unique: true });

let cachedModel: any = null;
let cachedConn: any = null;

export default async function getServerMembershipModel() {
  const conn = await connectAuthDB();

  // Critical: Only use cached model if from the SAME connection
  if (cachedConn === conn && cachedModel) {
    return cachedModel;
  }

  // Use connection-specific model cache
  if (conn.models.ServerMembership) {
    cachedModel = conn.models.ServerMembership;
  } else {
    cachedModel = conn.model('ServerMembership', serverMembershipSchema);
  }

  cachedConn = conn;
  return cachedModel;
}
