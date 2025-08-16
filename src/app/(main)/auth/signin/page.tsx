"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { HiMiniSparkles } from "react-icons/hi2";
import Image from "next/image";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signIn("credentials", { redirect: false, email, password });
            if (res?.ok) {
                toast.success("Signed in");
                router.push("/");
            } else {
                // next-auth returns an error string in res.error when redirect=false
                toast.error((res as any)?.error || "Sign in failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Sign in failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="panel-wide">
            <div className="max-w-2xl p-6 mx-auto glass-panel">
                <div className="flex flex-col items-center mb-6">
                    <Image src="/nameplate.png" alt="Lexi Logo" width={180} height={100} />
                    <h1 className="mb-2 -mt-6 text-3xl font-semibold">Welcome Back 👋</h1>
                    <p className="mb-4 text-sm text-white/70">Lets continue improving your writing.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3" autoComplete="off">
                    {/* hidden dummy fields to discourage browser autofill */}
                    <input type="text" name="__fake_username" autoComplete="username" tabIndex={-1} style={{ display: 'none' }} />
                    <input type="password" name="__fake_password" autoComplete="current-password" tabIndex={-1} style={{ display: 'none' }} />
                    <div className="flex flex-col items-start w-full">
                        <label className="text-xs text-white/70">Email</label>
                        <p className="mb-2 text-xs text-white/60">We will use this to sign you in and send account messages.</p>
                        <input
                            className="w-full input"
                            type="email"
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => (e.currentTarget.readOnly = false)}
                        />
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <label className="text-xs text-white/70">Password</label>
                        <p className="mb-2 text-xs text-white/60">Your account password. Keep it safe.</p>
                        <input
                            className="w-full input"
                            type="password"
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            readOnly
                            onFocus={(e) => (e.currentTarget.readOnly = false)}
                        />
                    </div>

                    <div className="flex justify-end text-sm">
                        <Link href="/auth/forgot" className="underline">Forgot password?</Link>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading || !email || !password}>
                        {loading ? (
                            <>
                                <span className="inline-block mr-2 align-middle">
                                    <span className="spinner" />
                                </span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <HiMiniSparkles size={18} /> Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-4 text-sm text-center">
                    <span>New here? </span>
                    <Link href="/auth/signup" className="underline">Create an account</Link>
                </div>
            </div>
        </main>
    );
}
