import { randomBytes, createCipheriv, createDecipheriv, createHash } from 'crypto';

function getAES256KeyFromSecret(secret: string): Buffer {
  // SHA-256 hash ensures 32-byte key
  return createHash('sha256').update(secret, 'utf8').digest();
}

export function encryptAESKey(aesKey: string) {
  const iv = randomBytes(16);
  const key = getAES256KeyFromSecret(process.env.JWT_SECRET!);
  const cipher = createCipheriv('aes-256-cbc', key, iv);
  const encrypted = cipher.update(aesKey, 'utf8', 'hex');
  const final = cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}${final}`;
}

export function decryptAESKey(encryptedData: string) {
  const [ivHex, encrypted] = encryptedData.split(':');
  const key = getAES256KeyFromSecret(process.env.JWT_SECRET!);
  const decipher = createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
  const decrypted = decipher.update(encrypted, 'hex', 'utf8');
  const final = decipher.final('utf8');
  return decrypted + final;
}
