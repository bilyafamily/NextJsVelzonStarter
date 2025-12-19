"use client"; // Required for Next.js 13+ App Router

import { QueryObserverResult } from "@tanstack/react-query";
import { TriangleAlertIcon, LucideArrowUpSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  error: string | Error;
  isLoading: boolean;
  refresh: () => Promise<QueryObserverResult<any, Error>>;
}

export default function ErrorPage({
  error,
  refresh,
  isLoading,
}: ErrorPageProps) {
  const router = useRouter();
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <TriangleAlertIcon className="h-6 w-6 text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">{errorMessage}</p>

        <div className="flex gap-3 justify-center">
          {isLoading ? (
            <button
              onClick={refresh}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <LucideArrowUpSquare className="h-4 w-4" />
              Try again
            </button>
          ) : (
            <button
              onClick={() => router.refresh()}
              className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <LucideArrowUpSquare className="h-4 w-4" />
              Refresh
            </button>
          )}

          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}
