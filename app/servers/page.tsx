import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectAuthDB } from '@/lib/db';

// Define models ONCE
let ServerLinkModel: any;
let ServerMembershipModel: any;

async function getModels() {
  if (!ServerLinkModel) {
    const db = await connectAuthDB();
    const schema = new (await import('mongoose')).Schema({
      serverId: String,
      ownerId: String,
      dbName: String,
    });
    ServerLinkModel = db.model('ServerLink', schema);
  }
  if (!ServerMembershipModel) {
    const db = await connectAuthDB();
    const schema = new (await import('mongoose')).Schema({
      userId: String,
      serverId: String,
    });
    ServerMembershipModel = db.model('ServerMembership', schema);
  }
  return { ServerLinkModel, ServerMembershipModel };
}

export default async function ServersPage() {
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

  const { ServerLinkModel, ServerMembershipModel } = await getModels();
  
  const owned = await ServerLinkModel.find({ ownerId: userId }).lean();
  const memberships = await ServerMembershipModel.find({ userId }).lean();
  const joinedIds = memberships.map((m: any) => m.serverId);
  const joined = joinedIds.length
    ? await ServerLinkModel.find({ serverId: { $in: joinedIds } }).lean()
    : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Servers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/servers/create"
          className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-blue-500 transition"
        >
          <div className="text-4xl mb-2">+</div>
          <p className="text-gray-300">Create Server</p>
        </a>
        {[...owned, ...joined].map((srv: any) => (
          <a
            key={srv.serverId}
            href={`/servers/${srv.serverId}`}
            className="bg-gray-800 p-4 rounded hover:bg-gray-700"
          >
            <div className="font-bold">{srv.dbName?.replace('server_', '') || 'Unnamed'}</div>
            <div className="text-xs text-gray-400">{owned.some((o: any) => o.serverId === srv.serverId) ? 'Owner' : 'Member'}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
