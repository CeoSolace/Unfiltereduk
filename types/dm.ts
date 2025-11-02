// Stored in unfiltered_dm.dm_channels and dm_messages
export interface DMChannel {
  _id: string;
  participants: string[]; // global user IDs
  createdAt: Date;
  isArchived: boolean; // true only if both users consented
}

export interface DMMessage {
  _id: string;
  channelId: string;
  authorId: string;
  content_enc: string;
  iv: string;
  signature: string;
  sentAt: Date;
}
