"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import meridian from "@/img/meridian.png"
import "@/app/styles.css"

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

useEffect(() => {
  if (!message && !error) return;

  const timer = setTimeout(() => {
    setMessage("");
    setError("");
  }, 5000);

  return () => clearTimeout(timer);
}, [message, error]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
localStorage.setItem("user", JSON.stringify(data.user));


  const pendingBookId = localStorage.getItem("pendingBorrowBookId");

  if (pendingBookId) {
    localStorage.removeItem("pendingBorrowBookId");

    router.replace(
    `/dashboard/borrow?bookId=${pendingBookId}`
  );

  } else {
    router.replace("/dashboard/overview");
  }

  } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0093cde3] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex bg-[#0093cde3] text-white p-12 flex-col justify-center">
          <div className="lib-logo1">
            <Image className="lib-logo" src={meridian} alt="" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Meridian University
          </h1>

          <p className="text-white/90 leading-relaxed">
            Welcome to the Meridian University Library.
            Sign in to access your account, borrow books,
            manage returns and explore our library resources.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          <div className="mb-8">
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-2">
              Sign in to your library account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                text-black outline-none focus:border-[#0093cde3]
                focus:ring-2 focus:ring-[#0093cde3]/20"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#0093cde3] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                text-black outline-none focus:border-[#0093cde3]
                focus:ring-2 focus:ring-[#0093cde3]/20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            {message && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                ✅ {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#0093cde3]
              text-white font-semibold hover:opacity-90
              disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#0093cde3] hover:underline"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}