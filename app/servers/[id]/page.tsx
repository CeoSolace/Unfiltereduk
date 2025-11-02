// app/servers/[id]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectServerDB } from '@/lib/db';
import getServerLinkModel from '@/models/ServerLink'; // ✅ Import cached model

export default async function ServerPage({ params }: { params: { id: string } }) {
  const { id: serverId } = params;

  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch {
    cookies().delete('auth_token');
    redirect('/login');
  }

  // ✅ Use cached model — no redefinition
  const ServerLink = await getServerLinkModel();
  const serverDoc = await ServerLink.findOne({ serverId });
  if (!serverDoc) redirect('/servers');

  const serverDb = await connectServerDB(serverId, serverDoc.dbUri);
  const ServerMeta = serverDb.model('ServerMeta', { name: String, ownerId: String });
  const meta = await ServerMeta.findOne();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{meta?.name || 'Unnamed Server'}</h1>
    </div>
  );
}
