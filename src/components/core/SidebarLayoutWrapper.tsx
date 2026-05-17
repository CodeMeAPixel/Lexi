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

  const base =
    "flex w-full overflow-x-hidden transition-[margin,padding] duration-300";
  let style: React.CSSProperties = { minHeight: "calc(100vh - 4rem)" };
  let className = base;

  // On SSR, always use mobile padding to avoid hydration mismatch.
  if (!mounted) {
    className += " px-4 pt-24 pb-10";
    style.marginLeft = 0;
    style.maxWidth = "100vw";
  } else if (isDesktop) {
    className += " px-10 xl:px-14 pt-24 pb-10";
    if (sidebarOpen) {
      style.marginLeft = "19rem";
      style.maxWidth = "calc(100vw - 19rem)";
    } else {
      style.marginLeft = 0;
      style.maxWidth = "100vw";
    }
  } else {
    className += " px-4 pt-24 pb-10";
    style.marginLeft = 0;
    style.maxWidth = "100vw";
  }

  return (
    <>
      <main className={className} style={style}>
        {children}
      </main>
    </>
  );
}
