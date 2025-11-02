// Server metadata stored in per-server DB (server_<id>.server_meta)
export interface ServerMeta {
  _id: string;
  name: string;
  ownerId: string; // global user ID
  icon?: string; // Cloudinary URL
  createdAt: Date;
  isLocked: boolean; // read-only mode
}

// Link stored in unfiltered_auth.server_links
export interface ServerLink {
  serverId: string;
  ownerId: string;
  dbName: string; // e.g., "server_srv_123"
  dbUri: string; // full MongoDB URI
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  encryptedServerKey: string; // AES-256 key encrypted with platform secret
}
