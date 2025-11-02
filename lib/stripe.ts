import Stripe from 'stripe';
import getUserModel from '@/models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function createCheckoutSession(
  userId: string,
  planId: 'plus' | 'nitro' | 'nitro_pro' | 'ultra',
  successUrl: string,
  cancelUrl: string
) {
  // ✅ Fetch user to get real email
  const User = await getUserModel();
  const user = await User.findById(userId);
  if (!user || !user.email) {
    throw new Error('User or email not found');
  }

  const prices: Record<string, string> = {
    plus: 'price_plus_monthly',
    nitro: 'price_nitro_monthly',
    nitro_pro: 'price_nitro_pro_monthly',
    ultra: 'price_ultra_monthly',
  };

  if (!prices[planId]) {
    throw new Error('Invalid plan ID');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: user.email, // ✅ VALID EMAIL
    line_items: [
      {
        price: prices[planId],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });

  return session.url;
}
