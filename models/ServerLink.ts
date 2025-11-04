// models/ServerLink.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model, models } from 'mongoose';

const serverLinkSchema = new Schema({
  serverId: { type: String, unique: true },
  ownerId: String,
  dbName: String,
  dbUri: String,
  encryptedServerKey: String,
});

export default async function getServerLinkModel() {
  const db = await connectAuthDB();

  // Use Mongoose's internal cache
  if (models.ServerLink) {
    return models.ServerLink;
  }

  return model('ServerLink', serverLinkSchema);
}
