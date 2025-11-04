// app/(authenticated)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import { connectAuthDB } from '@/lib/db';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  // Fetch user's servers
  const authDb = await connectAuthDB();
  const ServerLink = authDb.model('ServerLink', { serverId: String, ownerId: String, dbName: String });
  const owned = await ServerLink.find({ ownerId: userId }).lean();
  const Membership = authDb.model('ServerMembership', { userId: String, serverId: String });
  const joined = await Membership.find({ userId }).lean();
  const joinedIds = joined.map((j: any) => j.serverId);
  const joinedServers = joinedIds.length
    ? await ServerLink.find({ serverId: { $in: joinedIds } }).lean()
    : [];

  const allServers = [...owned, ...joinedServers];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Left Sidebar - Servers */}
      <div className="w-20 bg-gray-800 flex flex-col items-center py-3 space-y-4">
        {/* Home */}
        <Link href="/servers" className="p-3 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>

        {/* User Servers */}
        <div className="flex flex-col space-y-3">
          {allServers.map((srv: any) => (
            <Link
              key={srv.serverId}
              href={`/servers/${srv.serverId}`}
              className="w-12 h-12 rounded flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
            >
              {srv.dbName?.charAt(7).toUpperCase() || '?'}
            </Link>
          ))}
        </div>

        {/* Friends */}
        <Link href="/dms" className="mt-auto p-3 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>

        {/* Unftro */}
        <Link href="/unftro" className="p-3 rounded-full hover:bg-purple-900/50">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xs font-bold text-white">U</span>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
