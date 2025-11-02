import crypto from 'crypto';
import { connectAuthDB } from './db';
import mongoose from 'mongoose';

// ✅ Define schema and model ONCE (outside function)
const ipRegistrySchema = new mongoose.Schema({
  ip_hash: { type: String, unique: true },
  ip_psi: { type: String, unique: true },
  lastSeen: Date,
});

let IPRegistryModel: mongoose.Model<any>;

async function getIPRegistryModel() {
  if (!IPRegistryModel) {
    const db = await connectAuthDB();
    IPRegistryModel = db.model('IPRegistry', ipRegistrySchema);
  }
  return IPRegistryModel;
}

export async function anonymiseIP(ip: string) {
  const ip_hash = crypto
    .createHmac('sha256', process.env.IP_HASH_PEPPER!)
    .update(ip)
    .digest('hex');

  const IPRegistry = await getIPRegistryModel();

  let record = await IPRegistry.findOne({ ip_hash });
  if (record) {
    await IPRegistry.updateOne({ ip_hash }, { lastSeen: new Date() });
    return { ip_hash, ip_psi: record.ip_psi };
  }

  const ip_psi = `psi_${crypto.randomBytes(8).toString('hex')}`;
  await IPRegistry.create({ ip_hash, ip_psi, lastSeen: new Date() });
  return { ip_hash, ip_psi };
}
