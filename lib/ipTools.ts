// IP anonymisation: HMAC hash + pseudonym registry
import crypto from 'crypto';
import { connectAuthDB } from './db';

export async function anonymiseIP(ip: string) {
  // Layer 1: HMAC-SHA256 with pepper
  const ip_hash = crypto
    .createHmac('sha256', process.env.IP_HASH_PEPPER!)
    .update(ip)
    .digest('hex');

  const authDb = await connectAuthDB();
  const IPRegistry = authDb.model('IPRegistry', {
    ip_hash: { type: String, unique: true },
    ip_psi: { type: String, unique: true },
    firstSeen: { type: Date, default: Date.now },
    lastSeen: Date,
  });

  // Try to find existing pseudonym
  let record = await IPRegistry.findOne({ ip_hash });
  if (record) {
    // Update last seen
    await IPRegistry.updateOne({ ip_hash }, { lastSeen: new Date() });
    return { ip_hash, ip_psi: record.ip_psi };
  }

  // Create new pseudonym
  const ip_psi = `psi_${crypto.randomBytes(8).toString('hex')}`;
  await IPRegistry.create({ ip_hash, ip_psi, lastSeen: new Date() });

  return { ip_hash, ip_psi };
}
