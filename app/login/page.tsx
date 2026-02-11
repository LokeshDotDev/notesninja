"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
      } else {
        // Refresh session and redirect
        await getSession();
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-200 via-blue-400 to-blue-700 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div
        className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-600 opacity-80 z-0"
        style={{ clipPath: "ellipse(120% 60% at 50% 0%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-2/3 h-1/3 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 opacity-40 z-0"
        style={{ clipPath: "ellipse(80% 60% at 100% 100%)" }}
      />

      {/* Centered card for login */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto px-2 sm:px-0 py-8">
        <div className="mb-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg tracking-tight">
            Welcome Back
          </h1>
          <p className="text-white/80 text-sm mt-2">Sign in to your account</p>
          </div>

        <div className="w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <span>Don&apos;t have an account? </span>{" "}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-blue-200 via-blue-400 to-blue-700">
          <div className="text-white text-sm">Loading...</div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
