import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectAuthDB, connectServerDB } from '@/lib/db';

export default async function ServerPage({ params }: { params: { id: string } }) {
  const { id: serverId } = params;

  // Auth
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

  // Verify user is member/owner
  const authDb = await connectAuthDB();
  const ServerLink = authDb.model('ServerLink', {
    serverId: String,
    ownerId: String,
    dbUri: String,
  });
  const serverDoc = await ServerLink.findOne({ serverId });
  if (!serverDoc) redirect('/servers');

  // Connect to server DB
  const serverDb = await connectServerDB(serverId, serverDoc.dbUri);
  const ServerMeta = serverDb.model('ServerMeta', { name: String, ownerId: String });
  const meta = await ServerMeta.findOne();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{meta?.name || 'Unnamed Server'}</h1>
      <p className="text-gray-400 mb-6">
        Server ID: {serverId} • Owner: {serverDoc.ownerId === userId ? 'You' : 'Another user'}
      </p>
      <div className="bg-gray-800 p-4 rounded">
        <p className="text-gray-300">🔒 This server’s data is isolated in its own database.</p>
        <p className="text-gray-300 mt-2">💬 Messaging UI coming soon...</p>
      </div>
    </div>
  );
}
