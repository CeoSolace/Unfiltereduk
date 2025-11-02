import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectAuthDB } from '@/lib/db';
import { anonymiseIP } from '@/lib/ipTools';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();
    if (!email || !password || !username) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const ip = req.ip || req.headers.get('x-forwarded-for') || '0.0.0.0';
    const { ip_psi } = await anonymiseIP(ip);

    const db = await connectAuthDB();
    const User = db.model('User', {
      email: { type: String, unique: true },
      username: { type: String, unique: true },
      password: String,
      globalRole: { type: String, default: 'user' },
      subscriptionPlan: { type: String, default: 'free' },
      ip_psi: String,
    });

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json({ error: 'Email or username already used' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      username,
      password: hashed,
      ip_psi,
    });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({ success: true, userId: user._id.toString() });
  } catch (e: any) {
    console.error('Registration error:', e);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
