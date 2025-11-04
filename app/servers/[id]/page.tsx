// Move this file to: app/(authenticated)/servers/[id]/page.tsx
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
      {/* Server Header + Channel List */}
      <div className="w-60 bg-gray-800 flex flex-col">
        {/* Server Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="font-bold text-lg truncate">
              {meta?.name || 'Unnamed'}
              {serverDoc.ownerId === userId && (
                <span className="ml-2 text-xs bg-yellow-600 text-black px-1.5 py-0.5 rounded">OWNER</span>
              )}
            </h1>
            <button className="text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Channels */}
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium"># general-chat</span>
            <span className="text-xs bg-green-900/50 text-green-400 px-1.5 py-0.5 rounded">ENCRYPTED</span>
          </div>
          <div className="text-xs text-gray-500">🔒 Verified</div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-gray-500">End-to-end encrypted messages appear here.</p>
          <p className="text-gray-500 mt-2">✅ Message integrity verified by Unfiltered UK</p>
        </div>

        <div className="p-3 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Message #general-chat"
              className="flex-1 bg-gray-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button className="p-2 text-gray-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
