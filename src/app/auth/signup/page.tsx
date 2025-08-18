"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, handle }),
      });

      if (res.ok) {
        toast.success("Account created, you can login now!");
        router.push("/auth/signin");
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data?.error || "Sign up failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="panel-wide">
      <div className="max-w-2xl p-6 mx-auto glass-panel">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/nameplate.png"
            alt="Lexi Logo"
            width={180}
            height={100}
          />
          <h1 className="mb-2 -mt-6 text-3xl font-semibold">
            Create an account
          </h1>
          <p className="mb-4 text-sm text-white/70">
            Start saving your rewrites and sync preferences.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col gap-3"
          autoComplete="off"
        >
          {/* hidden dummy fields to discourage browser autofill */}
          <input
            type="text"
            name="__fake_username"
            autoComplete="username"
            tabIndex={-1}
            style={{ display: "none" }}
          />
          <input
            type="password"
            name="__fake_password"
            autoComplete="new-password"
            tabIndex={-1}
            style={{ display: "none" }}
          />

          <div className="flex flex-col items-start w-full mb-8">
            <label className="mb-2 text-xs text-white/80">Name</label>
            <p className="mb-2 text-xs text-white/60">
              This will be shown on your profile.
            </p>
            <input
              className="w-full input"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="flex flex-col items-start w-full mb-8">
            <label className="mb-2 text-xs text-white/70">
              Handle / username
            </label>
            <p className="mb-2 text-xs text-white/60">
              Choose a unique handle (letters, numbers, _ and - allowed).
            </p>
            <input
              className="w-full input"
              name="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. lexi_user"
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col items-start w-full mb-8">
            <label className="mb-2 text-xs text-white/70">Email</label>
            <p className="mb-2 text-xs text-white/60">
              We'll use this to sign you in and send account messages.
            </p>
            <input
              className="w-full input"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="off"
              readOnly
              onFocus={(e) => (e.currentTarget.readOnly = false)}
            />
          </div>

          <div className="flex flex-col items-start w-full mb-8">
            <label className="mb-2 text-xs text-white/70">Password</label>
            <p className="mb-2 text-xs text-white/60">
              Choose a strong password (min 8 characters).
            </p>
            <input
              className="w-full input"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              readOnly
              onFocus={(e) => (e.currentTarget.readOnly = false)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !email || !password || !name || !handle}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-sm text-center">
          <span>Already have an account? </span>
          <Link href="/auth/signin" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
