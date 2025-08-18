"use client";

import React from "react";

export default function GlobalLoader({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[60vh] animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 border-4 border-t-4 rounded-full border-neutral-800 border-t-primary animate-spin" />
        <div className="absolute border-2 rounded-full inset-2 border-neutral-700" />
        <div className="absolute rounded-full inset-4 bg-gradient-to-br from-primary/30 to-neutral-900/60" />
      </div>
      <span className="text-lg font-semibold text-neutral-300 drop-shadow-lg">
        {message || "Loading..."}
      </span>
    </div>
  );
}
