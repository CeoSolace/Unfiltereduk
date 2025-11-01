// Register new user with bcrypt hash, IP anonymisation, and JWT cookie
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectAuthDB } from '@/lib/db';
import { anonymiseIP } from '@/lib/ipTools';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = await req.json();
    const ip = req.ip || req.headers.get('x-forwarded-for') || '0.0.0.0';

    // Connect to auth DB
    const db = await connectAuthDB();
    const Users = db.model('User', {
      email: String,
      password: String,
      username: String,
      globalRole: { type: String, default: 'user' },
      subscriptionPlan: { type: String, default: 'free' },
    });

    // Check existing
    const existing = await Users.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return NextResponse.json({ error: 'User exists' }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    // Anonymise IP
    const { ip_psi } = await anonymiseIP(ip);

    // Create user
    const user = await Users.create({
      email,
      username,
      password: hashed,
      ip_psi,
    });

    // Issue JWT (HttpOnly)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({ success: true, userId: user._id });
  } catch (e) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
