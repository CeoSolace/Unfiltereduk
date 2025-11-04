import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function CreateServerPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/login');

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch (e) {
    cookies().delete('auth_token');
    redirect('/login');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a Server</h1>
      <form
        action={async (formData) => {
          'use server';
          const name = formData.get('name') as string;
          const mongoUri = formData.get('mongoUri') as string;

          if (!mongoUri || !mongoUri.startsWith('mongodb')) {
            throw new Error('Valid MongoDB URI required');
          }

          const res = await fetch(`${process.env.RENDER_PUBLIC_URL}/api/servers/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, ownerId: userId, mongoUri }),
          });

          if (res.ok) {
            const { serverId } = await res.json();
            redirect(`/servers/${serverId}`);
          } else {
            const err = await res.json();
            throw new Error(err.error || 'Creation failed');
          }
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1">Server Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Your MongoDB URI (for this server)</label>
          <input
            type="text"
            name="mongoUri"
            placeholder="mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/server_xxx"
            className="w-full p-2 bg-gray-800 rounded font-mono text-sm"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Each server uses its own database. You own and manage this URI.
          </p>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Create Server
        </button>
      </form>
    </div>
  );
}
