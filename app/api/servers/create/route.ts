// app/api/servers/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { encryptAESKey } from '@/lib/encryption';
import getServerLinkModel from '@/models/ServerLink';

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

    const ServerLink = await getServerLinkModel();
    await ServerLink.create({ serverId, ownerId, dbName, dbUri, encryptedServerKey });

    const mongoose = (await import('mongoose')).default;
    const serverConn = await mongoose.createConnection(dbUri);

    // ServerMeta
    const ServerMeta = serverConn.model('ServerMeta', {
      name: { type: String, required: true },
      ownerId: { type: String, required: true },
    });
    await ServerMeta.create({ name, ownerId });

    // Roles
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

    // Categories & Channels
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

    const categories = [
      { name: 'General', position: 0 },
      { name: 'Community', position: 1 },
    ];
    const channels = [
      { name: 'welcome', type: 'text' },
      { name: 'general-chat', type: 'text' },
    ];

    for (const cat of categories) {
      const createdCat = await Category.create(cat);
      for (const chan of channels) {
        await Channel.create({ ...chan, categoryId: createdCat._id });
      }
    }

    // Invite model (for future use)
    serverConn.model('Invite', {
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
