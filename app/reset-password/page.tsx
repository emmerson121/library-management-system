"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
const router = useRouter();
const searchParams = useSearchParams();

const [token, setToken] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

useEffect(() => {
const resetToken = searchParams.get("token");


if (resetToken) {
  setToken(resetToken);
} else {
  setError("Password reset token is missing.");
}


}, [searchParams]);

useEffect(() => {
  if (!error && !success) return;

  const timer = setTimeout(() => {
    setError("");
    setSuccess("");
  }, 5000);

  return () => clearTimeout(timer);
}, [error, success]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!token) {
    setError("Invalid or missing reset token.");
    return;
  }

  if (!password || !confirmPassword) {
    setError("Password and confirm password are required.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        password: password,
        confirmPassword: confirmPassword,
      }),
    });

    const data = await response.json();

    console.log("RESET PASSWORD RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to reset password"
      );
    }

    setSuccess(
      "Password reset successfully. You can now log in."
    );

    setPassword("");
    setConfirmPassword("");

  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div className="w-full max-w-md bg-white rounded-xl shadow-sm md:p-8 p-6">


    <h1 className="md:text-2xl text-xl font-bold text-black text-center mb-2">
      Reset Password
    </h1>

    <p className="text-gray-500 text-center mb-6">
      Enter your new password below.
    </p>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-gray-700"
        >
          New Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          autoComplete="new-password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-semibold text-gray-700"
        >
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Confirm new password"
          autoComplete="new-password"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black outline-none focus:border-[#0093cde3]"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          ✅ {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !token}
        className="w-full py-3 rounded-lg bg-[#0093cde3] text-white font-semibold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>

    <button
      type="button"
      onClick={() => router.push("/BookUI")}
      className="w-full mt-5 text-sm text-[#0093cde3] hover:underline"
    >
      ← Back to Library
    </button>

  </div>
</div>


);
}

export default function ResetPasswordPage() { 
  
  return ( 
    <Suspense 
      fallback={ 
        <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
          <p className="text-gray-500"> 
            Loading reset password page... 
            </p> 
        </div>
         } > 
         <ResetPasswordContent /> 
         </Suspense> 
        ); 
      }
