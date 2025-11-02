import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectDMDB } from '@/lib/db';

export default async function DMInbox() {
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

  // 2. Connect to DM database
  const dmDb = await connectDMDB();

  // 3. Define DMChannel model (safe: inside request, but not recompiled due to Mongoose caching)
  const DMChannel = dmDb.model('DMChannel', {
    participants: [String],
    createdAt: { type: Date, default: Date.now },
  });

  // 4. Fetch user's DM channels
  const channels = await DMChannel.find({ participants: userId }).lean();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Direct Messages</h1>
      
      {channels.length === 0 ? (
        <p className="text-gray-400">No messages yet. Start a conversation!</p>
      ) : (
        <div className="space-y-3">
          {channels.map((ch: any) => {
            // Find the other participant
            const otherUser = ch.participants.find((id: string) => id !== userId) || 'Unknown';
            return (
              <a
                key={ch._id.toString()}
                href={`/dms/${ch._id}`}
                className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                <div className="font-medium">Chat with {otherUser.substring(0, 8)}...</div>
                <div className="text-sm text-gray-400">Click to open</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
