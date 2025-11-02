import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { anonymiseIP } from '@/lib/ipTools';
import getUserModel from '@/models/User'; // ✅ Use cached model

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const ip = req.ip || req.headers.get('x-forwarded-for') || '0.0.0.0';
    const { ip_psi } = await anonymiseIP(ip);

    // ✅ Get model ONCE (no redefinition)
    const User = await getUserModel();

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    await User.updateOne({ _id: user._id }, { ip_psi });

    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return NextResponse.json({ success: true, userId: user._id.toString() });
  } catch (e: any) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
