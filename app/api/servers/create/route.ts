import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { connectAuthDB } from '@/lib/db';
import { encryptAESKey } from '@/lib/encryption';

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
    const { name, ownerId, mongoUri } = await req.json();
    if (!name || !ownerId || !mongoUri) {
      return NextResponse.json({ error: 'Name, ownerId, and mongoUri required' }, { status: 400 });
    }

    const serverId = `srv_${Date.now()}_${randomBytes(4).toString('hex')}`;
    const dbName = `server_${serverId}`;
    // Use user-provided URI + append DB name
    const dbUri = mongoUri.endsWith('/') ? `${mongoUri}${dbName}` : `${mongoUri}/${dbName}`;

    const serverMessageKey = randomBytes(32).toString('hex');
    const encryptedServerKey = encryptAESKey(serverMessageKey);

    const ServerLink = await getServerLinkModel();
    await ServerLink.create({ serverId, ownerId, dbName, dbUri, encryptedServerKey });

    // Connect to USER'S MongoDB
    const mongoose = (await import('mongoose')).default;
    const serverConn = await mongoose.createConnection(dbUri);

    // 1. Create ServerMeta
    const ServerMeta = serverConn.model('ServerMeta', {
      name: { type: String, required: true },
      ownerId: { type: String, required: true },
    });
    await ServerMeta.create({ name, ownerId });

    // 2. Create Roles
    const Role = serverConn.model('Role', {
      name: String,
      color: String,
      permissions: [String],
      rank: Number,
    });
    await Role.create([
      { name: 'Owner', color: '#FF5555', permissions: ['*'], rank: 100, _id: 'owner' },
      { name: 'Member', color: '#AAAAAA', permissions: ['send_messages', 'read_messages'], rank: 1, _id: 'member' },
    ]);

    // 3. Create Categories & Channels
    const Category = serverConn.model('Category', {
      name: String,
      position: Number,
    });

    const Channel = serverConn.model('Channel', {
      name: String,
      type: { type: String, enum: ['text', 'voice'] },
      categoryId: String,
      position: Number,
    });

    // Premade structure
    const categories = [
      { name: 'General', position: 0 },
      { name: 'Community', position: 1 },
    ];

    const channelsPerCategory = [
      { name: 'welcome', type: 'text' },
      { name: 'general-chat', type: 'text' },
    ];

    for (const [catIndex, catData] of categories.entries()) {
      const category = await Category.create({ ...catData });
      for (const chanData of channelsPerCategory) {
        await Channel.create({
          name: chanData.name,
          type: chanData.type,
          categoryId: category._id,
          position: 0,
        });
      }
    }

    return NextResponse.json({ serverId, dbName });
  } catch (e: any) {
    console.error('Server creation error:', e);
    return NextResponse.json({ error: 'Server creation failed' }, { status: 500 });
  }
}
