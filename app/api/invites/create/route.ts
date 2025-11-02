import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectAuthDB, connectServerDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = cookies().get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { serverId } = await req.json();
  if (!serverId) return NextResponse.json({ error: 'serverId required' }, { status: 400 });

  // Get server DB URI
  const authDb = await connectAuthDB();
  const ServerLink = authDb.model('ServerLink', { serverId: String, dbUri: String });
  const serverDoc = await ServerLink.findOne({ serverId });
  if (!serverDoc) return NextResponse.json({ error: 'Server not found' }, { status: 404 });

  // Connect to server DB
  const serverDb = await connectServerDB(serverId, serverDoc.dbUri);
  const Invite = serverDb.model('Invite', {
    code: String,
    inviterId: String,
    createdAt: Date,
  });

  // Generate unique code (8 chars)
  const code = randomBytes(5).toString('hex').substring(0, 8);
  await Invite.create({ code, inviterId: userId });

  const inviteLink = `${process.env.RENDER_PUBLIC_URL}/invite/${code}`;
  return NextResponse.json({ code, inviteLink });
}
