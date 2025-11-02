// Home page: redirect logged-in users, show auth form to guests
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AuthForm from '@/components/AuthForm';

export default async function HomePage() {
  // Check for valid JWT in HttpOnly cookie
  const token = cookies().get('auth_token')?.value;
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      // Authenticated → go to server dashboard
      redirect('/servers');
    } catch (e) {
      // Invalid token → clear and show login
      cookies().delete('auth_token');
    }
  }

  // Unauthenticated → show login form (with switch to register)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Unfiltered UK</h1>
        <p className="text-gray-400">Decentralised. Encrypted. Yours.</p>
      </div>
      <AuthForm mode="login" />
      <p className="mt-6 text-gray-500 text-sm">
        New here?{' '}
        <button
          onClick={() => {
            document.cookie = 'auth_mode=register; path=/';
            window.location.reload();
          }}
          className="text-blue-400 hover:underline"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}
