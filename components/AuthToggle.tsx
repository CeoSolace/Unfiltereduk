"use client";

export default function AuthToggle() {
  const switchToRegister = () => {
    document.cookie = 'auth_mode=register; path=/';
    window.location.reload();
  };

  return (
    <p className="mt-6 text-gray-500 text-sm">
      New here?{' '}
      <button
        onClick={switchToRegister}
        className="text-blue-400 hover:underline"
      >
        Create an account
      </button>
    </p>
  );
}
