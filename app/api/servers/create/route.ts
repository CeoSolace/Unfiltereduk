import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { encryptAESKey } from '@/lib/encryption';
import getServerLinkModel from '@/models/ServerLink'; // ✅ Import cached model

export async function POST(req: NextRequest) {
  try {
    const { name, ownerId, mongoUri } = await req.json();
    if (!name || !ownerId || !mongoUri) {
      return NextResponse.json({ error: 'Name, ownerId, and mongoUri required' }, { status: 400 });
    }

    const serverId = `srv_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const dbName = `server_${serverId}`;
    const dbUri = mongoUri.endsWith('/') ? `${mongoUri}${dbName}` : `${mongoUri}/${dbName}`;

    const serverMessageKey = randomBytes(32).toString('hex');
    const encryptedServerKey = encryptAESKey(serverMessageKey);

    // ✅ Use cached model — no redefinition
    const ServerLink = await getServerLinkModel();
    await ServerLink.create({ serverId, ownerId, dbName, dbUri, encryptedServerKey });

    // ... rest of your server setup (roles, channels, etc.)
    
    const mongoose = (await import('mongoose')).default;
    const serverConn = await mongoose.createConnection(dbUri);
    // Create ServerMeta, Roles, Categories, Channels here...

    return NextResponse.json({ serverId, dbName });
  } catch (e: any) {
    console.error('Server creation error:', e);
    return NextResponse.json({ error: 'Server creation failed' }, { status: 500 });
  }
}
