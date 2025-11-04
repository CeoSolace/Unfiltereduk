import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import getServerLinkModel from '@/models/ServerLink';
import getServerMembershipModel from '@/models/ServerMembership';
import Link from 'next/link';

// Optional: Add types for better safety
interface ServerLink {
  serverId: string;
  ownerId: string;
  dbName: string;
  dbUri: string;
  encryptedServerKey: string;
}

interface ServerMembership {
  serverId: string;
  userId: string;
}

export default async function ServersPage() {
  // === 1. Authentication ===
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    redirect('/login');
  }

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch (error) {
    cookies().delete('auth_token');
    redirect('/login');
  }

  // === 2. Get Models (Safe: uses Mongoose internal caching) ===
  const ServerLink = await getServerLinkModel();
  const ServerMembership = await getServerMembershipModel();

  // === 3. Fetch Owned Servers ===
  const owned: ServerLink[] = await ServerLink.find({ ownerId: userId }).lean();

  // === 4. Fetch Joined Servers via Memberships ===
  const memberships: ServerMembership[] = await ServerMembership.find({ userId }).lean();
  const joinedServerIds = memberships.map((m) => m.serverId);

  const joined: ServerLink[] = joinedServerIds.length
    ? await ServerLink.find({ serverId: { $in: joinedServerIds } }).lean()
    : [];

  // === 5. Combine & Deduplicate (optional, but safe) ===
  const allServers = [...owned, ...joined];
  const uniqueServers = Array.from(
    new Map(allServers.map((s) => [s.serverId, s])).values()
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Servers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create New Server Card */}
        <Link
          href="/servers/create"
          className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors flex flex-col items-center justify-center"
        >
          <div className="text-4xl mb-2">+</div>
          <p className="text-gray-300">Create Server</p>
        </Link>

        {/* Render All Servers */}
        {uniqueServers.map((srv) => {
          const isOwner = owned.some((o) => o.serverId === srv.serverId);
          const displayName = srv.dbName?.replace('server_', '') || 'Unnamed Server';

          return (
            <Link
              key={srv.serverId}
              href={`/servers/${srv.serverId}`}
              className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="font-bold text-white">{displayName}</div>
              <div className="text-xs text-gray-400 mt-1">
                {isOwner ? 'Owner' : 'Member'}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Optional: Empty State */}
      {uniqueServers.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No servers yet. Create one to get started!
        </p>
      )}
    </div>
  );
}
