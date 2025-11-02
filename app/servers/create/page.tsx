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
          const res = await fetch(`${process.env.RENDER_PUBLIC_URL}/api/servers/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, ownerId: userId }),
          });
          if (res.ok) {
            const { serverId } = await res.json();
            redirect(`/servers/${serverId}`);
          } else {
            throw new Error('Failed to create server');
          }
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Server name"
          className="w-full p-2 bg-gray-800 rounded"
          required
        />
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
