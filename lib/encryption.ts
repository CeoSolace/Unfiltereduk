import crypto from 'crypto';
import NodeRSA from 'node-rsa';

const platformPrivateKey = process.env.PLATFORM_PRIVATE_KEY!;
const platformPublicKey = process.env.PLATFORM_PUBLIC_KEY!;

export function encryptMessage(plaintext: string, serverKey: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(serverKey, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return { content_enc: encrypted.toString('base64'), iv: iv.toString('hex') };
}

export function decryptMessage(ciphertext: string, iv: string, serverKey: string) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(serverKey, 'hex'), Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64')), decipher.final()]);
  return decrypted.toString();
}

export function signMessage(encryptedPayload: string) {
  const key = new NodeRSA(platformPrivateKey, 'private');
  return key.sign(encryptedPayload, 'base64', 'utf8');
}

export function verifySignature(encryptedPayload: string, signature: string) {
  const key = new NodeRSA(platformPublicKey, 'public');
  return key.verify(encryptedPayload, signature, 'utf8', 'base64');
}

export function encryptAESKey(aesKey: string) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET!);
  let encrypted = cipher.update(aesKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decryptAESKey(encryptedKey: string) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.JWT_SECRET!);
  let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
