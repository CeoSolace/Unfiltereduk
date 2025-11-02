import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectAuthDB } from '@/lib/db';
import { encryptAESKey } from '@/lib/encryption';

// Cache ServerLink model to prevent OverwriteModelError
let ServerLinkModel: any = null;

async function getServerLinkModel() {
  if (!ServerLinkModel) {
    const authDb = await connectAuthDB();
    const mongoose = (await import('mongoose')).default;
    const schema = new mongoose.Schema({
      serverId: { type: String, unique: true },
      ownerId: String,
      dbName: String,
      dbUri: String,
      encryptedServerKey: String,
    });
    ServerLinkModel = authDb.model('ServerLink', schema);
  }
  return ServerLinkModel;
}

export async function POST(req: NextRequest) {
  try {
    const { name, ownerId } = await req.json();
    if (!name || !ownerId) {
      return NextResponse.json({ error: 'Name and ownerId required' }, { status: 400 });
    }

    // Generate unique server ID and DB name
    const serverId = `srv_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const dbName = `server_${serverId}`;
    const dbUri = `${process.env.MONGO_BASE_URI}${dbName}`;

    // Generate and encrypt per-server AES key
    const serverMessageKey = randomBytes(32).toString('hex');
    const encryptedServerKey = encryptAESKey(serverMessageKey);

    // Save to global auth DB
    const ServerLink = await getServerLinkModel();
    await ServerLink.create({ serverId, ownerId, dbName, dbUri, encryptedServerKey });

    // Create per-server DB and metadata
    const mongoose = (await import('mongoose')).default;
    const newConn = await mongoose.createConnection(dbUri);
    const ServerMeta = newConn.model('ServerMeta', {
      name: { type: String, required: true },
      ownerId: { type: String, required: true },
    });
    await ServerMeta.create({ name, ownerId });

    // Create invites collection (for future use)
    newConn.model('Invite', {
      code: { type: String, unique: true },
      inviterId: String,
      createdAt: { type: Date, default: Date.now },
      uses: { type: Number, default: 0 },
    });

    return NextResponse.json({ serverId, dbName });
  } catch (e: any) {
    console.error('Server creation error:', e);
    return NextResponse.json({ error: 'Server creation failed' }, { status: 500 });
  }
}
