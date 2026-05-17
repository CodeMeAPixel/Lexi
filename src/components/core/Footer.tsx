"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { useSidebar } from "./SidebarContext";

const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const isAdmin = pathname?.startsWith("/admin");
  const isTool = pathname?.startsWith("/tools");
  const { sidebarOpen } = useSidebar();
  if (isDashboard || isAdmin || isTool || sidebarOpen) return null;

  return (
    <footer className="w-screen border-t border-white/10 bg-black/30 backdrop-blur">
      <div className="px-6 py-12 mx-auto max-w-7xl">
        {/* Top row */}
        <div className="flex flex-row justify-between gap-6 md:flex-col">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Lexi" className="w-9 h-9" />
              <span className="text-2xl font-bold text-white">Lexicon</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/58">
              Precision writing tools with a fast workflow and a calm interface.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
            {/* Product */}
            <div>
              <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-white/60 hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/rephrase"
                    className="text-white/60 hover:text-white"
                  >
                    Rephraser
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/definer"
                    className="text-white/60 hover:text-white"
                  >
                    Definer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-white/60 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="https://nodebyte.co.uk/contact"
                    className="text-white/60 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-white/60 hover:text-white"
                  >
                    Changes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="https://nodebyte.co.uk/legal/privacy"
                    className="text-white/60 hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://nodebyte.co.uk/legal/cookies"
                    className="text-white/60 hover:text-white"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://nodebyte.co.uk/legal/terms"
                    className="text-white/60 hover:text-white"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10" />

        {/* Bottom row */}
        <div className="flex flex-row items-center justify-between gap-6 text-sm text-white/45 md:flex-row">
          <p>© {new Date().getFullYear()} NodeByte LTD.</p>
          <div className="flex items-center gap-5">
            <a
              target="_blank"
              href="https://github.com/CodeMeAPixel/Lexi"
              aria-label="Github"
              className="hover:text-white"
            >
              <FaGithub size={18} />
            </a>
            <a
              target="_blank"
              href="https://twitter.com/HeyLexicon"
              aria-label="Twitter"
              className="hover:text-white"
            >
              <FaTwitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
