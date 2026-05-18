"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useSidebar } from "./SidebarContext";
import {
  FaGithub,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaHome,
  FaInfoCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaUpload,
  FaDiscord,
  FaHistory,
  FaUserShield,
} from "react-icons/fa";
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
        onClick={() => setOpen((state) => !state)}
        className="flex w-full items-center justify-between px-3 py-1 text-left text-xs font-bold uppercase tracking-wide text-neutral-400"
        aria-expanded={open}
      >
        <span>{title}</span>
        <FaChevronDown
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-2 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

function Navbar() {
  const {
    sidebarOpen: open,
    setSidebarOpen: setOpen,
    toggleSidebar,
    isDesktop,
  } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);

  const isVerified = (session?.user as { emailVerified?: boolean } | undefined)
    ?.emailVerified;
  const isAdmin =
    (session?.user as { role?: string } | undefined)?.role === "ADMIN";

  useEffect(() => {
    if (!isDesktop) {
      setOpen(false);
    }
  }, [pathname, isDesktop, setOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", onKeyDown);
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!session?.user) {
        if (mounted) {
          setProfileImage(null);
          setProfileName(null);
        }
        return;
      }

      try {
        const res = await fetch("/api/me", { cache: "no-store" });
        if (!res.ok) return;
        const body = await res.json();
        if (!mounted) return;
        setProfileImage(body?.user?.image ?? null);
        setProfileName(body?.user?.name ?? null);
      } catch {
        // Keep session-derived fallback values when profile fetch fails.
      }
    }

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [session?.user, pathname]);

  const displayName = profileName ?? session?.user?.name ?? "Guest";
  const displayImage = profileImage ?? session?.user?.image ?? null;

  const mainLinks = useMemo(
    () => [
      { href: "/", label: "Home", icon: <FaHome size={15} /> },
      { href: "/about", label: "About", icon: <FaInfoCircle size={15} /> },
      {
        href: "/changelog",
        label: "Changelog",
        icon: <FaUpload size={15} />,
      },
      {
        href: "https://discord.gg/nodebyte",
        label: "Discord",
        icon: <FaDiscord size={15} />,
        external: true,
      },
    ],
    [],
  );

  const toolLinks = useMemo(
    () => [
      {
        href: "/tools/rephrase",
        label: "Rephraser",
        icon: <FileText size={15} />,
      },
      {
        href: "/tools/spellcheck",
        label: "Spellcheck",
        icon: <SpellCheck size={15} />,
      },
      {
        href: "/tools/tldr",
        label: "Summarizer",
        icon: <SpeechIcon size={15} />,
      },
      {
        href: "/tools/definer",
        label: "Definer",
        icon: <Sparkles size={15} />,
      },
    ],
    [],
  );

  const linkClass = (href: string) => {
    const isActive =
      href !== "/" ? pathname?.startsWith(href) : pathname === "/";
    if (isActive) {
      return "flex items-center justify-start gap-3 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white";
    }
    return "flex items-center justify-start gap-3 rounded-md border border-transparent px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/10 hover:bg-white/5 hover:text-white";
  };

  const renderLink = (item: {
    href: string;
    label: string;
    icon: React.ReactNode;
    external?: boolean;
  }) => {
    if (item.external) {
      return (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noreferrer"
          onClick={() => setOpen(false)}
          className={linkClass(item.href)}
        >
          {item.icon}
          <span>{item.label}</span>
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setOpen(false)}
        className={linkClass(item.href)}
      >
        {item.icon}
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="navbar px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            {open ? <FaTimes size={15} /> : <FaBars size={15} />}
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Image alt="Logo" src="/logo.png" width={30} height={30} />
            <span className="text-base font-semibold tracking-tight text-white">
              Lexicon
            </span>
          </Link>
        </div>

        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/CodeMeAPixel/Lexi"
          aria-label="Github"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <FaGithub size={16} />
          <span className="hidden sm:inline">Star on GitHub</span>
        </a>
      </div>

      {!isDesktop && open && (
        <button
          aria-label="Close sidebar backdrop"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/65 backdrop-blur-[2px]"
        />
      )}

      <aside
        className={`fixed bottom-4 left-4 top-[74px] z-40 w-[18rem] overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b0c]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-[130%]"}`}
      >
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
          <div className="flex items-center gap-2">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/10">
                <img
                  src="/logo.png"
                  alt="Lexicon"
                  className="h-8 w-8 rounded-full"
                />
              </div>
            )}
            <span className="max-w-[10.5rem] truncate text-sm font-semibold text-white">
              {displayName}
            </span>
          </div>
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white"
          >
            <FaTimes size={13} />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          <SectionGroup title="Main" defaultOpen={true}>
            {mainLinks.map((item) => renderLink(item))}
          </SectionGroup>

          {session?.user && (
            <SectionGroup title="Dashboard" defaultOpen={true}>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={linkClass("/dashboard")}
              >
                <FaUserCircle size={15} />
                <span>Overview</span>
              </Link>
              {isVerified && (
                <Link
                  href="/dashboard/history"
                  onClick={() => setOpen(false)}
                  className={linkClass("/dashboard/history")}
                >
                  <FaHistory size={15} />
                  <span>History</span>
                </Link>
              )}
            </SectionGroup>
          )}

          {session?.user && isVerified && (
            <SectionGroup title="Tools" defaultOpen={true}>
              {toolLinks.map((item) => renderLink(item))}
            </SectionGroup>
          )}

          {session?.user && isAdmin && (
            <SectionGroup title="Admin" defaultOpen={false}>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className={linkClass("/admin")}
              >
                <AtomIcon size={15} />
                <span>Overview</span>
              </Link>
              <Link
                href="/admin/activities"
                onClick={() => setOpen(false)}
                className={linkClass("/admin/activities")}
              >
                <LogsIcon size={15} />
                <span>Audit Logs</span>
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setOpen(false)}
                className={linkClass("/admin/users")}
              >
                <FaUserShield size={15} />
                <span>User Manager</span>
              </Link>
            </SectionGroup>
          )}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          {session?.user ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard/settings"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/[0.09]"
              >
                <FaUserCircle size={14} />
                <span>Settings</span>
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  signOut();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <FaSignOutAlt size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/[0.06] hover:text-white"
            >
              <HiSparkles size={14} />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </aside>
    </nav>
  );
}

export default Navbar;
