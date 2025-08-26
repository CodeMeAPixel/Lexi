"use client";
import React, { useEffect, useState } from "react";

interface Monitor {
  name: string;
  status: string;
  tag?: string;
  description?: string;
}

const STATUS_COLORS: Record<string, string> = {
  UP: "bg-green-500",
  ACTIVE: "bg-green-500",
  DEGRADED: "bg-yellow-500",
  DOWN: "bg-red-500",
  NONE: "bg-gray-400",
};

const STATUS_API_TOKEN = process.env.NEXT_PUBLIC_STATUS_API_TOKEN;

export default function StatusIndicator() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setMonitors(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Unable to fetch status");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <span className="text-xs text-gray-400">Loading status...</span>;
  if (error) return <span className="text-xs text-red-500">{error}</span>;

  // Show overall status (first monitor or aggregate)
  const main = monitors[0];
  const color = main
    ? STATUS_COLORS[main.status] || STATUS_COLORS.NONE
    : STATUS_COLORS.NONE;

  // Map status to user-friendly label
  const statusLabel = main
    ? main.status === "ACTIVE" || main.status === "UP"
      ? "ONLINE"
      : main.status === "DEGRADED"
        ? "DEGRADED"
        : main.status === "DOWN"
          ? "OFFLINE"
          : main.status
    : "Unknown";

  return (
    <span className="flex items-center gap-2 text-xs">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <a
        href="https://status.lexiapp.space"
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-grey-40/60 hover:text-white"
      >
        {statusLabel}
      </a>
    </span>
  );
}
