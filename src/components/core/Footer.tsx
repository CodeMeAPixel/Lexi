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
    <footer className="w-screen -mb-10 footer">
      <div className="px-6 py-12 mx-auto max-w-7xl">
        {/* Top row */}
        <div className="flex flex-row justify-between gap-6 md:flex-col">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Lexi" className="w-9 h-9" />
              <span className="text-2xl font-bold text-white">Lexicon</span>
            </Link>
            <p className="text-sm leading-relaxed text-grey-40/80">
              Helping you choose the right words.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-3 gap-10 sm:grid-cols-3">
            {/* Product */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-grey-40/50">
                <li>
                  <Link
                    href="/dashboard"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/rephrase"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Rephraser
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/definer"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Definer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-grey-40/50 hover:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hey@lexiapp.space"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Changes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-400 uppercase">
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/cookies"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Cookies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-grey-40/50 hover:text-white"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-grey-70/80" />

        {/* Bottom row */}
        <div className="flex flex-row items-center justify-between gap-6 text-sm text-gray-500 md:flex-row">
          <p>© {new Date().getFullYear()} ByteBrush Studios.</p>
          <div className="flex gap-5">
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
