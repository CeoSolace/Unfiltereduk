// Lists DM channels; creates new DMs via user ID
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectDMDB } from '@/lib/db';

export default async function DMInbox() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/');
  
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const userId = payload.id;

  const dmDb = await connectDMDB();
  const DMChannel = dmDb.model('DMChannel', {
    participants: [String],
    createdAt: Date,
  });

  const channels = await DMChannel.find({ participants: userId });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Direct Messages</h1>
      <div className="space-y-2">
        {channels.map((ch) => (
          <a
            key={ch._id}
            href={`/dms/${ch._id}`}
            className="block p-3 bg-gray-800 rounded hover:bg-gray-700"
          >
            {/* In real app: resolve participant usernames */}
            <span className="text-gray-300">Chat with user {ch.participants.find(id => id !== userId)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
