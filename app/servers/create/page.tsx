// UI to create a new server (triggers /api/servers/create)
import { redirect } from 'next/navigation';

export default function CreateServerPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a Server</h1>
      <form
        action={async (formData) => {
          'use server';
          const name = formData.get('name') as string;
          const token = formData.get('token') as string;

          // Get user ID from JWT (server-only)
          const jwt = (await import('jsonwebtoken')).default;
          const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

          const res = await fetch('/api/servers/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, ownerId: payload.id }),
          });

          if (res.ok) {
            const { serverId } = await res.json();
            redirect(`/servers/${serverId}`);
          } else {
            throw new Error('Creation failed');
          }
        }}
        className="space-y-4"
      >
        <input
          type="hidden"
          name="token"
          value={''} // Will be filled by server action (not exposed to client)
        />
        <div>
          <label className="block mb-1">Server Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 bg-gray-800 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
