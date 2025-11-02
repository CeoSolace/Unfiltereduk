// Unified settings: profile, subscription, DM archiving, security
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { connectAuthDB } from '@/lib/db';

export default async function SettingsPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/');
  
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const userId = payload.id;

  const authDb = await connectAuthDB();
  const User = authDb.model('User', { subscriptionPlan: String });
  const user = await User.findById(userId);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subscription */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">Subscription</h2>
          <p className="text-gray-300 mb-3">Current: <span className="capitalize">{user.subscriptionPlan}</span></p>
          <a
            href="/settings/subscription"
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
          <button className="text-red-400 hover:underline text-sm">Log out of all sessions</button>
        </div>
      </div>
    </div>
  );
}
