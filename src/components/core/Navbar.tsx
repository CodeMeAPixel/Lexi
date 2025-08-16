"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    FaGithub,
    FaTimes,
    FaHome,
    FaSyncAlt,
    FaInfoCircle,
    FaTwitter,
} from "react-icons/fa";
import Link from "next/link";

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="relative z-50">
            <div className="flex items-center justify-between px-4 py-3 navbar">
                <div className="flex items-center gap-4">
                    <Link
                        href="#"
                        className="flex items-center gap-2 brand"
                        onClick={() => setOpen((v) => !v)}
                    >
                        <Image
                            alt="Logo"
                            src="/logo.png"
                            width={32}
                            height={32}
                        />
                        <span className="text-lg font-semibold brand">
                            Lexi
                        </span>
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

            {/* Sidebar overlay for all screen sizes */}
            {open && (
                <div className="fixed inset-0 z-40 flex bg-grey-100/50 backdrop-blur-lg">
                    {/* backdrop */}
                    <button
                        aria-hidden={true}
                        onClick={() => setOpen(false)}
                        className="absolute bg-grey-80/50"
                        tabIndex={-1}
                    />

                    {/* sidebar */}
                    <aside className="flex flex-col h-full p-4 overflow-y-auto w-72 sm:w-80 glass-panel">
                        <div className="flex items-center justify-between glass-panel">
                            <div className="flex items-center gap-2 brand">
                                <Image
                                    alt="Logo"
                                    src="/logo.png"
                                    width={28}
                                    height={28}
                                />
                                <span className="text-lg font-semibold brand">
                                    Lexi
                                </span>
                            </div>
                            <button
                                aria-label="Close menu"
                                onClick={() => setOpen(false)}
                                className="p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2 mt-6">
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                            >
                                <FaHome size={16} />
                                <span>Home</span>
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                            >
                                <FaInfoCircle size={16} />
                                <span>About</span>
                            </Link>
                            <Link
                                href="/dashboard/rephrase"
                                onClick={() => setOpen(false)}
                                className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                            >
                                <FaSyncAlt size={16} />
                                <span>Rephrase</span>
                            </Link>
                        </nav>

                        {/* footer */}
                        <div className="pt-4 mt-auto border-t border-neutral-800">
                            <a
                                href="https://twitter.com/HeyLexicon"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5"
                            >
                                <FaTwitter />
                                <span>Follow us on Twitter</span>
                            </a>
                            <a
                                href="https://github.com/CodeMeAPixel/Lexi"
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/5"
                            >
                                <FaGithub />
                                <span>Star us on GitHub</span>
                            </a>
                        </div>
                    </aside>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
