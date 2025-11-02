// Global user stored in unfiltered_auth.users
export interface GlobalUser {
  _id: string;
  email: string;
  username: string;
  password: string; // bcrypt hash
  globalRole: 'user' | 'moderator' | 'owner';
  subscriptionPlan: 'free' | 'plus' | 'nitro' | 'nitro_pro' | 'ultra';
  badges: string[]; // e.g., ['verified', 'nitro']
  ip_psi: string; // pseudonym from ip_registry
  createdAt: Date;
  serverConsent: string[]; // serverId list user has consented to
}
