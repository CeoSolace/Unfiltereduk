import { connectAuthDB } from '@/lib/db';
import { Schema, model, Model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  globalRole: { type: String, default: 'user' },
  subscriptionPlan: { type: String, default: 'free' },
  ip_psi: String,
});

let UserModel: Model<any> | null = null;

export default async function getUserModel(): Promise<Model<any>> {
  if (!UserModel) {
    const db = await connectAuthDB();
    UserModel = db.model('User', userSchema);
  }
  return UserModel;
}
