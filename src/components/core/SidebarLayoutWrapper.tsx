"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "./SidebarContext";

export default function SidebarLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen, isDesktop } = useSidebar();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const base = "flex py-10 overflow-hidden transition-all duration-300 w-full";
  let style: React.CSSProperties = { minHeight: "calc(100vh - 4rem)" };
  let className = base;

  // On SSR, always use mobile padding to avoid hydration mismatch
  if (!mounted) {
    className += " px-4";
    style.marginLeft = 0;
    style.maxWidth = "100vw";
  } else if (isDesktop) {
    className += " px-20";
    if (sidebarOpen) {
      style.marginLeft = "20rem";
      style.maxWidth = "calc(100vw - 20rem)";
    } else {
      style.marginLeft = 0;
      style.maxWidth = "100vw";
    }
  } else {
    if (sidebarOpen) {
      className += " px-4 blur-xl bg-grey-100";
      style.marginLeft = 0;
      style.maxWidth = "100vw";
    } else {
      className += " px-4";
      style.marginLeft = 0;
      style.maxWidth = "100vw";
    }
  }

  return (
    <>
      <main className={className} style={style}>
        {children}
      </main>
    </>
  );
}
