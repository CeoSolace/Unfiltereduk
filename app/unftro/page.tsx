"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Get started with core features',
    features: [
      '🔓 Unlimited servers',
      '💬 Text channels',
      '📁 10 uploads/day (5MB)',
      '👥 10 members/server',
      '🛡️ Basic moderation',
      '🔒 End-to-end encrypted DMs'
    ],
    cta: 'Current Plan',
    disabled: true,
    color: 'gray',
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$2.99',
    description: 'More freedom, more expression',
    features: [
      '✨ Everything in Free',
      '⬆️ 50 uploads/day (25MB)',
      '😀 Custom emojis & status',
      '👥 100 members/server',
      '🎨 Profile customization',
      '🔇 Ad-free experience'
    ],
    cta: 'Upgrade',
    disabled: false,
    color: 'blue',
  },
  {
    id: 'unftro',
    name: 'Unftro',
    price: '$4.99',
    description: 'For creators & communities',
    features: [
      '✨ Everything in Plus',
      '🎥 HD video (720p)',
      '🖼️ Animated avatar',
      '📁 100 uploads/day (100MB)',
      '🏆 Global & server badges',
      '🚀 Early feature access'
    ],
    cta: 'Go Unftro',
    disabled: false,
    color: 'purple',
    popular: true,
  },
  {
    id: 'Unftro_pro',
    name: 'Unftro Pro',
    price: '$9.99',
    description: 'Empower your communities',
    features: [
      '✨ Everything in Nitro',
      '⏫ 2 Server Boosts (unlock perks)',
      '🧑‍💻 Priority support',
      '📁 200 uploads/day (200MB)',
      '🎨 Custom themes & banners',
      '🏅 Exclusive Pro badge'
    ],
    cta: 'Boost Now',
    disabled: false,
    color: 'pink',
  },
  {
    id: 'ultra',
    name: 'Ultra',
    price: '$19.99',
    description: 'Ultimate control & status',
    features: [
      '✨ Everything in Nitro Pro',
      '♾️ Unlimited Server Boosts',
      '📞 24/7 live support',
      '📁 500 uploads/day (500MB)',
      '📺 4K streaming',
      '👑 VIP golden badge',
      '🔮 Beta & experimental tools',
      '🌐 Custom domain (Q1 2026)'
    ],
    cta: 'Go Ultra',
    disabled: false,
    color: 'gold',
  },
];

export default function UnftroPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const { id, subscriptionPlan } = await res.json();
          setUserId(id);
          setCurrentPlan(subscriptionPlan || 'free');
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleCheckout = async (planId: string) => {
    if (!userId || planId === 'free') return;
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          planId,
          successUrl: `${window.location.origin}/settings?success=1`,
          cancelUrl: `${window.location.origin}/unftro`,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      alert('Failed to start checkout. Try again.');
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 hover:border-blue-400';
      case 'purple': return 'border-purple-500 hover:border-purple-400';
      case 'pink': return 'border-pink-500 hover:border-pink-400';
      case 'gold': return 'border-yellow-500 hover:border-yellow-400';
      default: return 'border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Unftro
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock the full power of decentralised, encrypted communities.  
            Your data. Your rules. Your status.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative bg-gray-800 rounded-2xl p-6 border transition-all duration-300 ${
                  isPopular 
                    ? 'border-purple-500 scale-105' 
                    : getColorClasses(plan.color)
                } ${
                  isCurrent ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      CURRENT
                    </span>
                  </div>
                )}

                <div className="pt-6">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-400 mb-4 text-sm">{plan.description}</p>
                  <div className="my-5">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <span className="mr-2">•</span>
                        <span dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={plan.disabled || isCurrent}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                      isCurrent
                        ? 'bg-green-600 cursor-default'
                        : plan.disabled
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : plan.id === 'ultra'
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white'
                        : plan.popular
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {isCurrent ? 'Active' : plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Footer */}
        <div className="mt-20 text-center text-gray-500 text-sm">
          <p>All plans include end-to-end encryption, IP anonymisation, and full server ownership.</p>
          <p className="mt-2">Cancel anytime. No hidden fees.</p>
        </div>
      </div>
    </div>
  );
}
