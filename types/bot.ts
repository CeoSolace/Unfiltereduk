// Stored in unfiltered_auth.bots
export interface Bot {
  _id: string;
  ownerId: string; // global user ID
  name: string;
  description: string;
  hashedToken: string; // SHA-256(botId + secret)
  permissions: string[]; // subset of PERMISSIONS
  servers: string[]; // serverId list where installed
  createdAt: Date;
  isActive: boolean;
}
