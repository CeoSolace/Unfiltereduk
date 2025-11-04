// models/ServerMembership.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model, Model } from 'mongoose';

const schema = new Schema({
  userId: { type: String, required: true },
  serverId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

let ServerMembershipModel: Model<any> | null = null;

export default async function getServerMembershipModel(): Promise<Model<any>> {
  if (!ServerMembershipModel) {
    const db = await connectAuthDB();
    ServerMembershipModel = db.model('ServerMembership', schema);
  }
  return ServerMembershipModel;
}
