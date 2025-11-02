// Stored in unfiltered_auth.subscriptions
export interface Subscription {
  userId: string;
  planId: 'free' | 'plus' | 'nitro' | 'nitro_pro' | 'ultra';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
