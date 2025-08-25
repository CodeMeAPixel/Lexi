"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useSidebar } from "./SidebarContext";
import {
  FaGithub,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaSyncAlt,
  FaInfoCircle,
  FaTwitter,
  FaSignOutAlt,
  FaUserCircle,
  FaDoorOpen,
  FaCog,
  FaQuestionCircle,
  FaUpload,
  FaDiscord,
  FaHistory,
  FaUserShield,
} from "react-icons/fa";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  AtomIcon,
  FileText,
  LogsIcon,
  Sparkles,
  SpeechIcon,
  SpellCheck,
} from "lucide-react";
import { HiSparkles } from "react-icons/hi2";

function SectionGroup({
  title,
  children,
  defaultOpen = false,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(Boolean(defaultOpen));

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex items-center justify-between w-full px-3 py-1 text-xs font-bold tracking-wide text-left uppercase bg-transparent border-0 outline-none appearance-none text-neutral-400 hover:bg-transparent focus:bg-transparent active:bg-transparent"
        style={{ backgroundColor: "transparent" }}
        aria-expanded={open}
      >
        <span>{title}</span>
        <FaChevronDown
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="flex flex-col gap-2 mt-2">{children}</div>}
    </div>
  );
}

function Navbar() {
  const {
    sidebarOpen: open,
    setSidebarOpen: setOpen,
    toggleSidebar,
  } = useSidebar();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/admin");

  const { data: session } = useSession();

  // Navbar renders on all pages; dashboard/admin layout should reuse the shared sidebar

  return (
    <nav className="z-50 flex w-full mb-20">
      <div className="fixed flex items-center justify-between py-3 navbar">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="flex items-center gap-2 brand"
            onClick={toggleSidebar}
          >
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

      {/* Sidebar overlay for all screen sizes */}
      {open && (
        <div className="fixed top-16 left-0 h-[calc(100vh-4.5rem)] mt-4 -z-10 overflow-auto">
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
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Lexicon"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 text-sm rounded-full bg-white/10">
                    <img
                      src="/logo.png"
                      alt="Lexicon"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
                <span className="text-lg font-semibold brand">
                  {session?.user?.name ?? "Lexicon"}
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

            {/* Sections: show Dashboard & Tools first for authenticated users */}
            {/* Collapsible behavior added but styling preserved */}
            {session?.user && (
              <nav className="flex flex-col gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-1 text-xs font-bold tracking-wide text-left uppercase text-neutral-400"
                  style={{ display: "none" }}
                >
                  {/* invisible placeholder to preserve spacing/styling */}
                </button>
              </nav>
            )}

            {session?.user ? (
              <SectionGroup title="Main Links" defaultOpen={false}>
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
                  href="/changelog"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaUpload size={16} />
                  <span>Changes</span>
                </Link>
                <Link
                  href="https://discord.gg/Vv2bdC44Ge"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaDiscord size={16} />
                  <span>Discord</span>
                </Link>
              </SectionGroup>
            ) : (
              <nav className="flex flex-col gap-2 mt-6">
                <span className="px-3 py-1 text-xs font-bold tracking-wide text-left uppercase text-neutral-400">
                  Main Links
                </span>
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
                  href="/changelog"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaUpload size={16} />
                  <span>Changes</span>
                </Link>
                <Link
                  href="https://discord.gg/Vv2bdC44Ge"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaDiscord size={16} />
                  <span>Discord</span>
                </Link>
              </nav>
            )}

            {/* Admin links for authenticated users */}
            {session?.user &&
              (session.user as { role?: string }).role === "ADMIN" && (
                <SectionGroup
                  title="Admin Panel"
                  defaultOpen={false}
                  className="mt-8"
                >
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                  >
                    <FaInfoCircle size={16} />
                    <span>Overview</span>
                    <span className="text-xs text-green-500">(NEW)</span>
                  </Link>
                  <Link
                    href="/admin/activities"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                  >
                    <LogsIcon size={16} />
                    <span>Audit Logs</span>
                    <span className="text-xs text-green-500">(NEW)</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                  >
                    <FaUserShield size={16} />
                    <span>User Manager</span>
                    <span className="text-xs text-green-500">(NEW)</span>
                  </Link>
                </SectionGroup>
              )}

            {/* Dashboard links for authenticated users */}
            {session?.user && (
              <SectionGroup
                title="Dashboard"
                defaultOpen={true}
                className="mt-8"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaUserCircle size={16} />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/dashboard/history"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FaHistory size={16} />
                  <span>History</span>
                  <span className="text-xs text-green-500">(NEW)</span>
                </Link>
              </SectionGroup>
            )}

            {/* Tool links for authenticated users */}
            {session?.user && (
              <SectionGroup title="Tools" defaultOpen={true} className="mt-8">
                <Link
                  href="/tools/rephrase"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <FileText size={16} />
                  <span>Rephraser</span>
                </Link>
                <Link
                  href="/tools/spellcheck"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <SpellCheck size={16} />
                  <span>Spellcheck</span>
                </Link>
                <Link
                  href="/tools/tldr"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <SpeechIcon size={16} />
                  <span>Summarizer</span>
                  <span className="text-xs text-green-500">(NEW)</span>
                </Link>
                <Link
                  href="/tools/definer"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-start w-full gap-3 px-3 py-2 rounded hover:bg-white/5"
                >
                  <Sparkles size={16} />
                  <span>Definer</span>
                </Link>
              </SectionGroup>
            )}

            {/* footer: sign out for authenticated, social for unauthenticated */}
            <div className="pt-4 mt-auto border-t border-neutral-800">
              {session?.user ? (
                <>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="flex items-center w-full gap-2 px-3 py-2 text-left bg-white rounded text-grey-100 hover:bg-white/80"
                    >
                      <FaSignOutAlt />
                      <span>Settings</span>
                    </Link>
                    <Link
                      href="#"
                      onClick={() => {
                        setOpen(false);
                        signOut();
                      }}
                      className="flex items-center w-full gap-2 px-3 py-2 text-left bg-red-600 rounded hover:bg-red-700/60"
                    >
                      <FaSignOutAlt />
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    onClick={() => {
                      setOpen(false);
                    }}
                    className="flex items-center w-full gap-2 px-3 py-2 text-left bg-green-600 rounded hover:bg-green-700/60"
                  >
                    <HiSparkles />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
