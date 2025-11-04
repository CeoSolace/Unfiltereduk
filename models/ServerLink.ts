// models/ServerLink.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model, Model } from 'mongoose';

const serverLinkSchema = new Schema({
  serverId: { type: String, unique: true },
  ownerId: String,
  dbName: String,
  dbUri: String,
  encryptedServerKey: String,
});

let ServerLinkModel: Model<any> | null = null;

export default async function getServerLinkModel(): Promise<Model<any>> {
  if (!ServerLinkModel) {
    const db = await connectAuthDB();
    ServerLinkModel = db.model('ServerLink', serverLinkSchema);
  }
  return ServerLinkModel;
}
