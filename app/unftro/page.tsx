// "Unftro" = your branded name for the 5-tier subscription system
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';

const PLANS = [
  { id: 'free', name: 'Free', price: '$0', features: ['Base chat', '10 uploads/day'] },
  { id: 'plus', name: 'Plus', price: '$2.99/mo', features: ['50 uploads/day', 'Custom status'] },
  { id: 'nitro', name: 'Nitro', price: '$4.99/mo', features: ['Animated avatar', 'HD streams', '100 uploads/day'] },
  { id: 'nitro_pro', name: 'Nitro Pro', price: '$9.99/mo', features: ['Server boosts (2)', 'Priority support'] },
  { id: 'ultra', name: 'Ultra', price: '$19.99/mo', features: ['Unlimited boosts', 'VIP badge', '24/7 support'] },
];

export default async function UnftroPage() {
  const token = cookies().get('auth_token')?.value;
  if (!token) redirect('/');

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  const userId = payload.id;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Unftro</h1>
        <p className="text-gray-400">Unlock everything on Unfiltered UK</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`bg-gray-800 rounded-lg p-6 flex flex-col ${
              plan.id === 'nitro' ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-2xl mb-4">{plan.price}</p>
            <ul className="text-sm text-gray-300 mb-6 space-y-1">
              {plan.features.map((f, i) => (
                <li key={i}>✓ {f}</li>
              ))}
            </ul>
            {plan.id === 'free' ? (
              <button
                disabled
                className="py-2 bg-gray-700 rounded text-gray-500"
              >
                Current Plan
              </button>
            ) : (
              <form
                action={async () => {
                  'use server';
                  const { createCheckoutSession } = await import('@/lib/stripe');
                  const url = await createCheckoutSession(
                    userId,
                    plan.id as any,
                    `${process.env.RENDER_PUBLIC_URL}/settings?success=1`,
                    `${process.env.RENDER_PUBLIC_URL}/unftro?cancelled=1`
                  );
                  if (url) redirect(url);
                }}
              >
                <button
                  type="submit"
                  className="py-2 bg-blue-600 hover:bg-blue-500 rounded"
                >
                  Upgrade
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
