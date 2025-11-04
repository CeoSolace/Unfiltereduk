// models/ServerMembership.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model, models } from 'mongoose';

const serverMembershipSchema = new Schema({
  userId: { type: String, required: true },
  serverId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

// Optional: Add compound index for performance
serverMembershipSchema.index({ userId: 1, serverId: 1 }, { unique: true });

export default async function getServerMembershipModel() {
  const db = await connectAuthDB();

  // Use Mongoose's per-connection model cache
  const modelName = 'ServerMembership';
  if (db.models[modelName]) {
    return db.models[modelName];
  }

  return db.model(modelName, serverMembershipSchema);
}
