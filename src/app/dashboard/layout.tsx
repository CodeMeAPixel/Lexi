"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { FaGithub, FaHome, FaCogs, FaSignOutAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
    { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
    { label: "Settings", icon: <FaCogs />, href: "/dashboard/settings" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
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
                <Link
                    href="#"
                    className="flex items-center gap-2 brand"
                    onClick={handleSidebarToggle}
                >
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
                    className={`fixed top-16 left-0 flex flex-col h-[calc(100vh-4rem)] bg-neutral-900/90 border-r border-neutral-800 z-40 glass-panel transition-transform duration-300 backdrop-blur-xl
                    ${isDesktop ? "w-80" : "w-full"}
                    ${sidebarOpen ? "translate-x-0" : isDesktop ? "-translate-x-full" : "-translate-x-full"}`}
                >
                    <div className="flex items-center gap-2 px-4 mt-2">
                        {session?.user?.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <Image
                                alt="Logo"
                                src="/logo.png"
                                width={32}
                                height={32}
                            />
                        )}
                        <span className="font-semibold text-white">
                            {session?.user?.name ?? "User"}
                        </span>
                    </div>
                    <nav className="flex flex-col gap-1 p-2 mt-6">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 text-white rounded hover:bg-white/5"
                                onClick={() =>
                                    !isDesktop && handleSidebarClose()
                                }
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className="p-2 mt-auto border-t border-neutral-800">
                        <button
                            onClick={() => signOut()}
                            className="flex items-center w-full gap-3 px-3 py-2 text-white rounded transition-colors font-semibold border border-red-500/20"
                            style={{
                                background:
                                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                boxShadow:
                                    "0 4px 12px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)";
                                e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)";
                            }}
                        >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && !isDesktop && (
                    <div
                        className="fixed top-16 left-0 right-0 bottom-0 z-30 bg-black/50"
                        onClick={handleSidebarClose}
                    />
                )}

                <main
                    className={`flex-1 overflow-y-auto transition-all duration-300 mt-12 py-6 ${
                        isDesktop
                            ? sidebarOpen
                                ? "ml-80 px-6"
                                : "ml-0 px-4"
                            : "px-4"
                    }`}
                    style={{ minHeight: "calc(100vh - 4rem)" }}
                >
                    {children}
                </main>
            </div>
        </>
    );
}
