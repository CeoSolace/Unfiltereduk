// Server Component: public landing with clear CTAs
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Unfiltered UK
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Decentralised. Encrypted. Community-owned.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
