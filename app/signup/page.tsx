"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import meridian from "@/img/meridian.png"
import "@/app/styles.css"

export default function SignupPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

    // Validation
    if (!title.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          email: email.trim().toLowerCase(),
          password,

          // Student is the default role.
          // The user cannot change this from the UI.
          role: "student",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Signup failed. Please try again."
        );
      }

      setMessage(
        data.message ||
          "Account created successfully! Redirecting to login..."
      );

      // Clear form
      setTitle("");
      setEmail("");
      setPassword("");

      // Go to login after successful signup
      setTimeout(() => {
        router.push("/login");
      }, 1200);
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
    <main className="min-h-screen bg-[#0093cde3] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden md:flex bg-[#0093cde3] text-white p-12 flex-col justify-center">
          <div className="lib-logo1">
            <Image className="lib-logo" src={meridian} alt="SIgn up logo" />
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Meridian University
          </h1>

          <p className="text-white/90 leading-relaxed">
            Create your student library account and gain
            access to our library resources. Borrow books,
            manage your returns and explore our collection.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          <div className="mb-8">
            <h2 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
              Create an account
            </h2>

            <p className="text-gray-500 mt-2">
              Create your student library account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FULL NAME */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                text-black outline-none focus:border-[#0093cde3]
                focus:ring-2 focus:ring-[#0093cde3]/20
                disabled:bg-gray-100"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                autoComplete="email"
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                text-black outline-none focus:border-[#0093cde3]
                focus:ring-2 focus:ring-[#0093cde3]/20
                disabled:bg-gray-100"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
  <input
    id="password"
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Create a password"
    autoComplete="new-password"
    disabled={loading}
    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300
    text-black outline-none focus:border-[#0093cde3]
    focus:ring-2 focus:ring-[#0093cde3]/20
    disabled:bg-gray-100"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    disabled={loading}
    className="absolute right-4 top-1/2 -translate-y-1/2
    text-gray-500 hover:text-gray-700"
    aria-label={showPassword ? "Hide password" : "Show password"}
  >
    {showPassword ? (
      /* OPEN EYE — password is visible */
      <svg
        width="18"
        height="18"
        viewBox="0 0 576 512"
        fill="#07142cf2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zm0 384a160 160 0 1 1 0-320 160 160 0 0 1 0 320zm0-64a96 96 0 1 0 0-192 96 96 0 0 0 0 192z" />
      </svg>
    ) : (
      /* CROSSED EYE — password is hidden/dotted */
      <svg
        width="18"
        height="18"
        viewBox="0 0 640 512"
        fill="#07142cf2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L38.8 5.1zM288 96c-14.5 0-28.5 2.3-41.6 6.6l39.1 30.7c1.5-.2 3-.3 4.5-.3 35.3 0 64 28.7 64 64 0 1.5-.1 3-.3 4.5l39.1 30.7c4.3-13.1 6.6-27.1 6.6-41.6 0-61.9-50.1-112-112-112zm0 224c-35.3 0-64-28.7-64-64 0-1.5.1-3 .3-4.5l-39.1-30.7c-4.3 13.1-6.6 27.1-6.6 41.6 0 61.9 50.1 112 112 112 14.5 0 28.5-2.3 41.6-6.6l-39.1-30.7c-1.5.2-3 .3-4.5.3zM288 32c-80.8 0-145.5 36.8-192.6 80.6-28.7 26.7-51.8 56.5-68.9 84.1l47.3 37.1C91.7 183.5 151.8 96 288 96c35.5 0 66.5 7.7 93.8 20.1l50.8 39.8c17.3 13.5 34.1 28.4 49.4 43.1 15.7 15.1 30 30.7 42.3 45.4-12.3 14.7-26.6 30.3-42.3 45.4-15.3 14.7-32.1 29.6-49.4 43.1l38.4 30.1c28.7-26.7 51.8-56.5 68.9-84.1 3.3-5.4 3.3-12.2 0-17.6-17.1-27.6-40.2-57.4-68.9-84.1C416.5 68.8 351.8 32 288 32z" />
      </svg>
    )}
  </button>
</div>
            </div>

            {/* ACCOUNT TYPE */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Role
              </label>

              <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                <span className="text-sm text-gray-700">
                  Student
                </span>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
                ✅ {message}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#0093cde3]
              text-white font-semibold hover:opacity-90
              disabled:opacity-50 transition"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-500 mt-7">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-[#0093cde3] hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}