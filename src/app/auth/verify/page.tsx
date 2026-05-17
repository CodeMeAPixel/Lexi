"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");

  const [token, setToken] = useState(tokenParam ?? "");
  const [email, setEmail] = useState(emailParam ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If both token and email are present in the URL, automatically submit verification
    if (tokenParam && emailParam) {
      handleVerify(tokenParam, emailParam);
    }
  }, []);

  async function handleVerify(tkn?: string, mail?: string) {
    const useToken = tkn ?? token;
    const useEmail = mail ?? email;

    setError(null);
    setSuccess(null);

    if (!useToken || !useEmail) {
      setError("Token and email are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: useToken, email: useEmail }),
      });

      const body = await res.json();
      if (!res.ok) {
        setError(body?.error ?? "Verification failed");
        setLoading(false);
        return;
      }

      setSuccess("Email verified successfully. You can now use the dashboard.");
      setLoading(false);

      // Optionally redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1400);
    } catch (err) {
      console.error(err);
      setError("Internal error while verifying. Try again later.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl p-6 mx-auto mt-16">
      <div className="p-6 space-y-4 rounded glass-panel">
        <h1 className="text-2xl font-semibold">Verify your email</h1>
        <p className="text-sm text-gray-400">
          If you followed a verification link, the process should run
          automatically. If not, paste your token and email below.
        </p>

        {success ? (
          <div className="p-4 text-green-800 bg-green-100 border rounded">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="p-4 text-red-800 bg-red-100 border rounded">
            {error}
          </div>
        ) : null}

        {!success && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col gap-3"
          >
            <label className="flex flex-col">
              <span className="mb-1 text-sm text-gray-300">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="input"
                placeholder="you@example.com"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 text-sm text-gray-300">
                Verification Token
              </span>
              <input
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="input"
                placeholder="paste your token here"
              />
            </label>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 font-semibold text-white rounded glass-panel hover:bg-grey-80/80 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify email"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
