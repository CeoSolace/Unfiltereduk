// Create new server: generate DB URI, Cloudinary keys, AES key, store in server_links
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectAuthDB } from '@/lib/db';
import { encryptAESKey } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  try {
    const { name, ownerId, cloudName, apiKey, apiSecret } = await req.json();

    // Generate unique server ID
    const serverId = `srv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const dbName = `server_${serverId}`;

    // Generate per-server AES key
    const serverMessageKey = randomBytes(32).toString('hex');

    // Encrypt key with platform secret before storage
    const encryptedKey = encryptAESKey(serverMessageKey);

    // Build DB URI
    const dbUri = `${process.env.MONGO_BASE_URI}${dbName}`;

    // Store in global auth DB
    const authDb = await connectAuthDB();
    const ServerLink = authDb.model('ServerLink', {
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

    await ServerLink.create({
      serverId,
      ownerId,
      dbName,
      dbUri,
      cloudinary: {
        cloudName: cloudName || process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: apiKey || process.env.CLOUDINARY_API_KEY,
        apiSecret: apiSecret || process.env.CLOUDINARY_API_SECRET,
      },
      encryptedServerKey,
    });

    // Also create server_meta in new DB
    const mongoose = (await import('mongoose')).default;
    const newConn = await mongoose.createConnection(dbUri);
    const ServerMeta = newConn.model('ServerMeta', {
      name: String,
      ownerId: String,
      createdAt: { type: Date, default: Date.now },
    });
    await ServerMeta.create({ name, ownerId });

    return NextResponse.json({ serverId, dbName });
  } catch (e) {
    return NextResponse.json({ error: 'Server creation failed' }, { status: 500 });
  }
}
