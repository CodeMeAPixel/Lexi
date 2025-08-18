"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  FaGithub,
  FaHome,
  FaCogs,
  FaSignOutAlt,
  FaDoorOpen,
  FaTimes,
} from "react-icons/fa";
import { HiChatBubbleLeft } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
  { label: "Overview", icon: <FaHome />, href: "/dashboard" },
  {
    label: "Rephraser",
    icon: <HiChatBubbleLeft />,
    href: "/dashboard/rephrase",
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // dashboard layout delegates sidebar control to the global SidebarProvider
  const [isDesktop, setIsDesktop] = useState(false);
  const { data: session } = useSession();

  const router = useRouter();
  const goHome = () => router.push("/");

  const [verifying, setVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // fetch latest user info from server (includes emailVerified)
  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) return;
        const body = await res.json();
        if (!mounted) return;
        setIsVerified(!!body?.user?.emailVerified);
      } catch (e) {
        // ignore
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, [session]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return children;
}
