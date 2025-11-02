// models/ServerLink.ts
import { connectAuthDB } from '@/lib/db';
import { model, Schema } from 'mongoose';

const serverLinkSchema = new Schema({
  serverId: String,
  ownerId: String,
  dbName: String,
  dbUri: String,
  cloudinary: {
    cloudName: String,
    apiKey: String,
    apiSecret: String,
  },
  encryptedServerKey: String,
});

// Get connection and define model once
const authDb = await connectAuthDB();
const ServerLink = authDb.model('ServerLink', serverLinkSchema);

export default ServerLink;
