// Encrypted message stored in per-server messages collection
export interface EncryptedMessage {
  _id: string;
  channelId: string;
  authorId: string; // global user ID
  content_enc: string; // base64 AES-256-CBC encrypted plaintext
  iv: string; // hex-encoded IV
  signature: string; // RSA signature of content_enc (base64)
  sentAt: Date;
  editedAt?: Date;
}
