import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectAuthDB } from '@/lib/db';
import { encryptAESKey } from '@/lib/encryption';

export async function POST(req: NextRequest) {
  try {
    const { name, ownerId } = await req.json();
    if (!name || !ownerId) {
      return NextResponse.json({ error: 'Name and ownerId required' }, { status: 400 });
    }

    const serverId = `srv_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const dbName = `server_${serverId}`;
    const dbUri = `${process.env.MONGO_BASE_URI}${dbName}`;

    const serverMessageKey = randomBytes(32).toString('hex');
    const encryptedServerKey = encryptAESKey(serverMessageKey);

    const authDb = await connectAuthDB();
    const ServerLink = authDb.model('ServerLink', {
      serverId: String,
      ownerId: String,
      dbName: String,
      dbUri: String,
      encryptedServerKey: String,
    });

    await ServerLink.create({ serverId, ownerId, dbName, dbUri, encryptedServerKey });

    const mongoose = (await import('mongoose')).default;
    const newConn = await mongoose.createConnection(dbUri);
    const ServerMeta = newConn.model('ServerMeta', { name: String, ownerId: String });
    await ServerMeta.create({ name, ownerId });

    return NextResponse.json({ serverId, dbName });
  } catch (e: any) {
    console.error('Server creation error:', e);
    return NextResponse.json({ error: 'Server creation failed' }, { status: 500 });
  }
}
