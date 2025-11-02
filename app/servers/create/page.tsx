// app/servers/create/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

export default async function CreateServerPage() {
  const token = cookies().get('auth_token')?.value;
  
  // 🔑 Critical: Redirect if no token
  if (!token) {
    redirect('/login');
  }

  let userId: string;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    userId = payload.id;
  } catch (e) {
    // 🧹 Clean invalid token
    cookies().delete('auth_token');
    redirect('/login');
  }

  // Now safe to use userId
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Server</h1>
      <form action={async (formData) => {
        'use server';
        const name = formData.get('name') as string;
        const res = await fetch('/api/servers/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, ownerId: userId }),
        });
        if (res.ok) {
          const { serverId } = await res.json();
          redirect(`/servers/${serverId}`);
        }
      }}>
        <input
          type="text"
          name="name"
          placeholder="Server name"
          className="w-full p-
