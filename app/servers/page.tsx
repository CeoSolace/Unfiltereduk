import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectAuthDB } from '@/lib/db';

// Define schemas and models ONCE at module level (outside request handlers)
const serverLinkSchema = new mongoose.Schema({
  serverId: String,
  ownerId: String,
  dbName: String,
  createdAt: { type: Date, default: Date.now },
});

const serverMembershipSchema = new mongoose.Schema({
  userId: String,
  serverId: String,
  joinedAt: { type: Date, default: Date.now },
});

let ServerLink: mongoose.Model<any>;
let ServerMembership: mongoose.Model<any>;

// Initialize models once
async function initModels() {
  if (!ServerLink || !ServerMembership) {
    const authDb = await connectAuthDB();
    ServerLink = authDb.model('ServerLink', serverLinkSchema);
    ServerMembership = authDb.model('ServerMembership', serverMembershipSchema);
  }
}

export default async function ServersPage() {
  // 1. Authenticate user
  const token = cookies().get('auth_token')?.value;
  if (!token) {
    redirect('/login');
  }

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch (e) {
    cookies().delete('auth_token');
    redirect('/login');
  }

  // 2. Initialize models (safe, idempotent)
  await initModels();

  // 3. Fetch user's servers
  const ownedServers = await ServerLink.find({ ownerId: userId }).lean();
  const memberships = await ServerMembership.find({ userId }).lean();
  const joinedServerIds = memberships.map((m: any) => m.serverId);
  const joinedServers = joinedServerIds.length
    ? await ServerLink.find({ serverId: { $in: joinedServerIds } }).lean()
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
        {ownedServers.map((srv: any) => (
          <a
            key={srv.serverId}
            href={`/servers/${srv.serverId}`}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700"
          >
            <div className="font-bold">{srv.dbName.replace('server_', '') || 'Unnamed'}</div>
            <div className="text-xs text-green-400">Owner</div>
          </a>
        ))}

        {/* Joined servers */}
        {joinedServers.map((srv: any) => (
          <a
            key={srv.serverId}
            href={`/servers/${srv.serverId}`}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700"
          >
            <div className="font-bold">{srv.dbName.replace('server_', '') || 'Unnamed'}</div>
            <div className="text-xs text-blue-400">Member</div>
          </a>
        ))}
      </div>
    </div>
  );
}
