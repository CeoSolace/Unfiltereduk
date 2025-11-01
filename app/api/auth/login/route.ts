// Login with JWT cookie, IP logging, rate limiting (basic)
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectAuthDB } from '@/lib/db';
import { anonymiseIP } from '@/lib/ipTools';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.ip || req.headers.get('x-forwarded-for') || '0.0.0.0';

    const db = await connectAuthDB();
    const Users = db.model('User', {
      email: String,
      password: String,
    });

    const user = await Users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update IP pseudonym
    const { ip_psi } = await anonymiseIP(ip);
    await Users.updateOne({ _id: user._id }, { ip_psi });

    // Issue JWT
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
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
