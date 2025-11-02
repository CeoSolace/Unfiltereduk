// Stripe Checkout session creation (no webhooks)
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function createCheckoutSession(
  userId: string,
  planId: 'free' | 'plus' | 'nitro' | 'nitro_pro' | 'ultra',
  successUrl: string,
  cancelUrl: string
) {
  const prices: Record<string, string> = {
    plus: 'price_plus_monthly',
    nitro: 'price_nitro_monthly',
    nitro_pro: 'price_nitro_pro_monthly',
    ultra: 'price_ultra_monthly',
  };

  if (planId === 'free') {
    throw new Error('Cannot checkout free plan');
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userId, // Temporary — in real app, map to user email
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
