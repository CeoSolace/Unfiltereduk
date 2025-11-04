// models/ServerLink.ts
import { connectAuthDB } from '@/lib/db';
import { Schema, model } from 'mongoose';

const serverLinkSchema = new Schema({
  serverId: { type: String, unique: true },
  ownerId: String,
  dbName: String,
  dbUri: String,
  encryptedServerKey: String,
});

let cachedModel: any = null;
let cachedConn: any = null;

export default async function getServerLinkModel() {
  const conn = await connectAuthDB();

  if (cachedConn === conn && cachedModel) {
    return cachedModel;
  }

  if (conn.models.ServerLink) {
    cachedModel = conn.models.ServerLink;
  } else {
    cachedModel = conn.model('ServerLink', serverLinkSchema);
  }

  cachedConn = conn;
  return cachedModel;
}
