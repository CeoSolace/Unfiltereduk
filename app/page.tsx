import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AuthForm from '@/components/AuthForm';
import AuthToggle from '@/components/AuthToggle'; // ✅

export default async function HomePage() {
  const token = cookies().get('auth_token')?.value;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      redirect('/servers');
    } catch (e) {
      cookies().delete('auth_token');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Unfiltered UK</h1>
        <p className="text-gray-400">Decentralised. Encrypted. Yours.</p>
      </div>
      <AuthForm mode="login" />
      <AuthToggle /> {/* ✅ Safe: self-contained Client Component */}
    </div>
  );
}
