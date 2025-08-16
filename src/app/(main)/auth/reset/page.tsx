"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ResetPage() {
    const params = useSearchParams();
    const token = params.get('token') || '';
    const email = params.get('email') || '';

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // optional: validate token presence
    }, []);

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirm) return toast.error('Passwords do not match');
        setLoading(true);
        try {
            let body: any;
            if (token) {
                body = { token, email, password };
            } else {
                body = { currentPassword, password };
            }

            const res = await fetch('/api/auth/password/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (res.ok) {
                toast.success('Password updated');
                router.push('/auth/signin');
            } else {
                const data = await res.json().catch(() => ({}));
                toast.error(data?.error || 'Reset failed');
            }
        } catch (err) {
            console.error(err);
            toast.error('Reset failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="panel-wide">
            <div className="max-w-2xl p-6 mx-auto glass-panel">
                <div className="flex flex-col items-center mb-6">
                    <Image src="/nameplate.png" alt="Lexi Logo" width={180} height={100} />
                    <h1 className="mb-2 -mt-6 text-3xl font-semibold">Reset password</h1>
                    <p className="mb-4 text-sm text-white/70">{token ? (
                        <>Set a new password for <strong>{email}</strong></>
                    ) : (
                        <>Confirm your current password and set a new one.</>
                    )}</p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-3" autoComplete="off">
                    {/* hidden dummy fields to discourage browser autofill */}
                    <input type="text" name="__fake_username" autoComplete="username" tabIndex={-1} style={{ display: 'none' }} />
                    <input type="password" name="__fake_password" autoComplete="new-password" tabIndex={-1} style={{ display: 'none' }} />
                    {!token && (
                        <div className="flex flex-col items-start w-full">
                            <label className="text-xs text-white/70">Current password</label>
                            <p className="text-xs text-white/60 mb-2">We need your current password to confirm it's you.</p>
                            <input className="input w-full" name="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter your current password" autoComplete="current-password" readOnly onFocus={(e) => (e.currentTarget.readOnly = false)} />
                        </div>
                    )}

                    <div className="flex flex-col items-start w-full">
                        <label className="text-xs text-white/70">New password</label>
                        <p className="text-xs text-white/60 mb-2">Choose a strong new password (min 8 characters).</p>
                        <input className="input w-full" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" readOnly onFocus={(e) => (e.currentTarget.readOnly = false)} />
                    </div>

                    <div className="flex flex-col items-start w-full">
                        <label className="text-xs text-white/70">Confirm password</label>
                        <p className="text-xs text-white/60 mb-2" />
                        <input className="input w-full" name="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" readOnly onFocus={(e) => (e.currentTarget.readOnly = false)} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading || !password || !confirm || (!token && !currentPassword)}>
                        {loading ? 'Resetting...' : 'Reset password'}
                    </button>
                </form>
            </div>
        </main>
    );
}
