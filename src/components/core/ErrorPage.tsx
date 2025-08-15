"use client";

import React from "react";
import Link from "next/link";

type Props = {
  title?: string;
  message?: string;
  primaryLabel?: string;
  onPrimary?: (() => void) | null;
};

export default function ErrorPage({
  title = "Something went wrong",
  message = "We ran into an unexpected problem. You can try again or go back home.",
  primaryLabel = "Try again",
  onPrimary = null,
}: Props) {
  return (
    <div className="panel-wide glass-panel" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
        <div style={{ width: 96, height: 96 }} className="image loading">
          {/* subtle SVG to match aesthetic */}
          <svg viewBox="0 0 64 64" width="96" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
            <path d="M20 40 L28 28 L36 36 L44 20" stroke="rgba(236,72,153,0.9)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="16" r="2.5" fill="rgba(99,102,241,0.95)" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold" style={{ color: "#fff" }}>{title}</h2>
        <p style={{ color: "rgba(255,255,255,0.72)", maxWidth: 560 }}>{message}</p>

        <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
          {onPrimary ? (
            <button onClick={onPrimary}>
              {primaryLabel}
            </button>
          ) : null}

          <Link href="/" className="" aria-label="Go home">
            <span style={{ display: "inline-block", padding: "10px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600 }}>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
