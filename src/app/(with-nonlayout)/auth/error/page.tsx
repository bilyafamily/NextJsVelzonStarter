"use client";

import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          Authentication Error
        </h1>
        <p className="mb-6 text-gray-700">
          An error occurred during authentication. Please try again.
        </p>
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Sign In
        </Link>
      </div>
    </main>
  );
}
