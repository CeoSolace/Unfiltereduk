// Clear HttpOnly auth cookie
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function POST() {
  cookies().delete('auth_token');
  return NextResponse.json({ success: true });
}
