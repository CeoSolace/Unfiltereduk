import { connectAuthDB } from '@/lib/db';
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: String,
  globalRole: { type: String, default: 'user' },
  subscriptionPlan: { type: String, default: 'free' },
  ip_psi: String,
});

let UserModel: any;

export default async function getUserModel() {
  if (!UserModel) {
    const db = await connectAuthDB();
    UserModel = db.model('User', userSchema);
  }
  return UserModel;
}
