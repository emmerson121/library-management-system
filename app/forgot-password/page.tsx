"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");


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

if (!email.trim()) {
  setError("Please enter your email address.");
  return;
}

try {
  setLoading(true);

  const response = await fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to process your request."
    );
  }

  setMessage(
    data.message ||
      "If an account exists with this email, a password reset link has been sent."
  );

  setEmail("");
} catch (error) {
  setError(
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again."
  );
} finally {
  setLoading(false);
}


};



return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div className="w-full max-w-md bg-white rounded-xl shadow-sm md:p-8 p-6">


    <h1 className="md:text-2xl text-xl font-bold text-black text-center mb-2">
      Forgot Password?
    </h1>

    <p className="text-gray-500 text-center mb-6">
      Enter your email address and we&apos;ll send you a link to
      reset your password.
    </p>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-gray-700"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          ✅ {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-[#0093cde3] text-white font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>

    <button
      type="button"
      onClick={() => router.push("/login")}
      className="w-full mt-5 text-sm text-[#0093cde3] hover:underline"
    >
      ← Back to Login
    </button>

  </div>
</div>


);
}
