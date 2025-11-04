// app/(authenticated)/servers/[id]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectServerDB } from '@/lib/db';
import getServerLinkModel from '@/models/ServerLink';
import Link from 'next/link';

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

  const ServerLink = await getServerLinkModel();
  const serverDoc = await ServerLink.findOne({ serverId });
  if (!serverDoc) redirect('/servers');

  const serverDb = await connectServerDB(serverId, serverDoc.dbUri);
  const ServerMeta = serverDb.model('ServerMeta', { name: String, ownerId: String });
  const meta = await ServerMeta.findOne();

  const Category = serverDb.model('Category', { name: String, position: Number });
  const Channel = serverDb.model('Channel', { name: String, categoryId: String, type: String });
  const categories = await Category.find().sort({ position: 1 }).lean();
  const channels = await Channel.find().lean();
  const channelsByCat = categories.map(cat => ({
    ...cat,
    channels: channels.filter(ch => ch.categoryId?.toString() === cat._id.toString())
  }));

  return (
    <div className="flex flex-1">
      <div className="w-60 bg-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg truncate">
              {meta?.name || 'Unnamed'}
              {serverDoc.ownerId === userId && (
                <span className="ml-2 text-xs bg-yellow-600 text-black px-1.5 py-0.5 rounded">OWNER</span>
              )}
            </h1>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {channelsByCat.map((cat) => (
            <div key={cat._id} className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1">{cat.name}</div>
              {cat.channels.map((chan) => (
                <Link
                  key={chan._id}
                  href="#"
                  className="flex items-center space-x-2 px-2 py-1.5 rounded hover:bg-gray-700 text-gray-300"
                >
                  <span>#</span>
                  <span className="truncate">{chan.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-2">
          <span className="font-medium"># general-chat</span>
          <span className="text-xs bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">ENCRYPTED</span>
          <span className="text-xs text-gray-500 ml-auto">🔒 Verified</span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-gray-500">End-to-end encrypted messages appear here.</p>
        </div>
        <div className="p-3 border-t border-gray-800">
          <input
            type="text"
            placeholder="Message #general-chat"
            className="w-full bg-gray-800 rounded px-3 py-2 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
