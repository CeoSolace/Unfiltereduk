// Server list for authenticated users
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectAuthDB } from '@/lib/db';

export default async function ServersPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/');

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch (e) {
    cookies().delete('auth_token');
    redirect('/');
  }

  // Fetch user's servers from global DB
  const authDb = await connectAuthDB();
  const ServerLink = authDb.model('ServerLink', {
    serverId: String,
    ownerId: String,
  });
  const memberships = await authDb.model('ServerMembership', {
    userId: String,
    serverId: String,
  }).find({ userId });

  const ownedServers = await ServerLink.find({ ownerId: userId });
  const joinedServerIds = memberships.map(m => m.serverId);
  const joinedServers = joinedServerIds.length
    ? await ServerLink.find({ serverId: { $in: joinedServerIds } })
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Servers</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create new server */}
        <a
          href="/servers/create"
          className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition"
        >
          <div className="text-4xl mb-2">+</div>
          <p className="text-gray-300">Create Server</p>
        </a>

        {/* Owned servers */}
        {ownedServers.map((srv) => (
          <a
            key={srv.serverId}
            href={`/servers/${srv.serverId}`}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700"
          >
            <div className="font-bold">{srv.name || 'Unnamed'}</div>
            <div className="text-xs text-green-400">Owner</div>
          </a>
        ))}

        {/* Joined servers */}
        {joinedServers.map((srv) => (
          <a
            key={srv.serverId}
            href={`/servers/${srv.serverId}`}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700"
          >
            <div className="font-bold">{srv.name || 'Unnamed'}</div>
            <div className="text-xs text-blue-400">Member</div>
          </a>
        ))}
      </div>
    </div>
  );
}
