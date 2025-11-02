import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import getUserModel from '@/models/User';

export default async function SettingsPage() {
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

  const User = await getUserModel();
  const user = await User.findById(userId);
  if (!user) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">Subscription</h2>
          <p className="text-gray-300 mb-3">Current: <span className="capitalize">{user.subscriptionPlan}</span></p>
          <a
            href="/unftro"
            className="text-blue-400 hover:underline text-sm"
          >
            Change plan →
          </a>
        </div>

        {/* DM Archiving */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">DM Archiving</h2>
          <p className="text-gray-300 mb-3">Permanent storage (dual consent)</p>
          <label className="inline-flex items-center">
            <input type="checkbox" className="mr-2" defaultChecked={false} />
            <span className="text-sm">Enable for new DMs</span>
          </label>
        </div>

        {/* Security */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">Security</h2>
          <form action={async () => {
            'use server';
            cookies().delete('auth_token');
            redirect('/');
          }}>
            <button
              type="submit"
              className="text-red-400 hover:underline text-sm"
            >
              Log out of all sessions
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
