"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ForgotPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/password/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
            if (res.ok) {
                toast.success('If your account exists, a reset link was sent');
                router.push('/auth/signin');
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data?.error || 'Request failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Request failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="panel-wide">
            <div className="max-w-2xl p-6 mx-auto glass-panel">
                <div className="flex flex-col items-center mb-6">
                    <Image src="/nameplate.png" alt="Lexi Logo" width={180} height={100} />
                    <h1 className="mb-2 -mt-6 text-3xl font-semibold">Forgot your password?</h1>
                    <p className="mb-4 text-sm text-white/70">Enter your email and we'll send a reset link if your account exists.</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3" autoComplete="off">
                    {/* hidden dummy fields to discourage browser autofill */}
                    <input type="text" name="__fake_username" autoComplete="username" tabIndex={-1} style={{ display: 'none' }} />
                    <input type="password" name="__fake_password" autoComplete="current-password" tabIndex={-1} style={{ display: 'none' }} />

                    <div className="flex flex-col items-start w-full">
                        <label className="text-xs text-white/70">Email</label>
                        <p className="text-xs text-white/60 mb-2">We'll send a secure reset link if your account exists.</p>
                        <input className="input w-full" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="off" readOnly onFocus={(e) => (e.currentTarget.readOnly = false)} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading || !email}>
                        {loading ? 'Sending...' : 'Send reset link'}
                    </button>
                </form>
            </div>
        </main>
    );
}
