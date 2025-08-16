"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardPage() {
    const { data: session, status } = useSession();

    if (status === "loading") return <div className="p-6">Loading...</div>;

    return (
        <main className="flex flex-col gap-24 mb-40 panel-hero">
            {/* Hero Section */}
            <section
                className="glass-panel hero-spotlight"
                style={{ padding: 40 }}
            >
                <div className="hero-grid">
                    <div className="hero-copy">
                        <h1
                            style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}
                            className="font-semibold"
                        >
                            Welcome back
                            {session?.user?.name
                                ? `, ${session.user.name}`
                                : ""}{" "}
                            👋
                        </h1>
                        <p className="mt-2 text-lg text-gray-400 hero-sub">
                            Your dashboard for quick actions and recent
                            activity.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="relative px-6 py-12 md:px-12 glass-panel">
                <h2 className="mb-8 text-2xl font-semibold">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <Link
                        href="/dashboard/rephrase"
                        className="p-6 transition rounded-xl glass-panel hover:shadow-lg"
                    >
                        <div className="text-base font-medium">Rephraser</div>
                        <div className="mt-2 text-sm text-gray-400">
                            Open the sentence rephraser to craft better writing.
                        </div>
                    </Link>

                    <div className="p-6 rounded-xl glass-panel">
                        <div className="text-base font-medium">
                            Saved Drafts
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                            You have no saved drafts yet.
                        </div>
                    </div>

                    <div className="p-6 rounded-xl glass-panel">
                        <div className="text-base font-medium">Account</div>
                        <div className="mt-2 text-sm text-gray-400">
                            Manage your profile and preferences.
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="relative px-6 py-12 md:px-12 glass-panel">
                <h2 className="mb-8 text-2xl font-semibold">Recent Activity</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="p-6 rounded-xl glass-panel">
                        <h3 className="mb-2 font-medium">Recent Activity</h3>
                        <div className="text-sm text-gray-400">
                            No activity yet — start by creating a rephrase.
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
