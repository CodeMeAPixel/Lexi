"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSidebarToggle = () => setSidebarOpen((v) => !v);
    const handleSidebarClose = () => setSidebarOpen(false);

    const { data: session } = useSession();

    return (
        <>
            {/* Header fixed at top */}
            <div className="fixed top-0 left-0 z-50 flex items-center w-full navbar">
                <Link href="#" className="flex items-center gap-2 brand" onClick={handleSidebarToggle}>
                    <Image alt="Logo" src="/logo.png" width={32} height={32} />
                    <span className="text-lg font-semibold brand">Lexi</span>
                </Link>
                <div className="flex items-center gap-4 ml-auto">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://github.com/CodeMeAPixel/Lexi"
                        aria-label="Github"
                        className="flex items-center gap-2"
                    >
                        <FaGithub size={20} />
                        <span className="sm:hidden">Star on GitHub</span>
                    </a>
                </div>
            </div>

            <div className="flex w-full pt-16">
                {/* Sidebar */}
                <aside
                    className={`fixed top-16 left-0 flex flex-col h-[calc(100vh-4rem)] w-80 bg-neutral-900/90 border-r border-neutral-800 z-40 glass-panel transition-transform duration-300 backdrop-blur-xl
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                    ${isDesktop ? '!translate-x-0' : ''}`}
                >
                    <div className="flex items-center gap-2 px-4 mt-2">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full" />
                        ) : (
                            <Image alt="Logo" src="/logo.png" width={32} height={32} />
                        )}
                        <span className="font-semibold text-white">{session?.user?.name ?? "User"}</span>
                    </div>
                    <nav className="flex flex-col gap-1 p-2 mt-6">
                        <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-white rounded hover:bg-white/5">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="10" height="10" rx="2" /></svg>
                            <span>Overview</span>
                        </a>
                        <a href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-white rounded hover:bg-white/5">
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="3" /><path d="M8 1v2M8 13v2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M1 8h2M13 8h2M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42" /></svg>
                            <span>Settings</span>
                        </a>
                    </nav>
                    <div className="p-2 mt-auto border-t border-neutral-800">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center w-full gap-3 px-3 py-2 text-white rounded hover:bg-white/5"
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {!isDesktop && sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50"
                        onClick={handleSidebarClose}
                    />
                )}

                <main
                    className={`
                        flex-1 overflow-y-auto transition-all duration-300
                        mt-12 px-6 py-6
                        ${isDesktop && sidebarOpen ? 'ml-80' : ''}
                    `}
                    style={{ minHeight: 'calc(100vh - 4rem)' }}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
