"use client";


import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaChartBar, FaUserCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const dashboardLinks = [
    { href: "/dashboard", icon: <FaChartBar size={16} />, label: "Overview" },
    { href: "/dashboard/settings", icon: <FaUserCog size={16} />, label: "Settings" },
];

const DashboardSidebar = ({ open }: { open: boolean }) => {
    const { data: session } = useSession();

    return (
        <aside
            className={`fixed top-[4rem] left-0 flex flex-col h-[calc(100vh-4rem)] w-72 max-w-xs bg-grey-80/80 border-r border-neutral-800 glass-panel z-40 transition-transform duration-300
            ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:flex`}
        >
            <div className="flex items-center gap-2 px-4 mt-6">
                {session?.user?.image ? (
                    <Image alt={session.user.name || "User"} src={session.user.image} width={32} height={32} className="rounded-full" />
                ) : (
                    <Image alt="Logo" src="/logo.png" width={32} height={32} />
                )}
                <span className="font-semibold">{session?.user?.name ?? "User"}</span>
            </div>
            <nav className="flex flex-col gap-1 p-2 mt-6">
                {dashboardLinks.map(({ href, icon, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5"
                    >
                        {icon}
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-2 mt-auto border-t border-neutral-800">
                <button
                    href="https://github.com/CodeMeAPixel/Lexi"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
