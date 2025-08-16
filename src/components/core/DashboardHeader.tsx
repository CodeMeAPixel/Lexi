"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaChartBar, FaUserCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const DashboardHeader = ({ onSidebarToggle, sidebarOpen }: { onSidebarToggle?: () => void; sidebarOpen?: boolean }) => (
    <nav className="relative z-50 w-full border-b bg-neutral-950 border-neutral-800">
        <div className="flex items-center justify-between px-4 py-3 navbar">
            <div className="flex items-center gap-4">
                {/* Sidebar toggle button for mobile */}
                {onSidebarToggle && (
                    <button
                        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                        onClick={onSidebarToggle}
                        className="p-2 mr-2 border rounded lg:hidden bg-neutral-900 border-neutral-800"
                    >
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                )}
                <Link href="/dashboard" className="flex items-center gap-2 brand">
                    <Image alt="Logo" src="/logo.png" width={32} height={32} />
                    <span className="text-lg font-semibold brand">Lexi</span>
                </Link>
            </div>
            <div className="flex items-center gap-4">
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
    </nav>
);

export default DashboardHeader;
