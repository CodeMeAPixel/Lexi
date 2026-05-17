"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Mail, Clock, FileText, BookOpen, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined); // undefined while loading
  const [activity, setActivity] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Determine verified state using session first
  useEffect(() => {
    if (status === "authenticated") {
      const emailVerified = (session?.user as any)?.emailVerified;
      if (typeof emailVerified === "boolean") {
        setIsVerified(emailVerified);
      } else {
        // fallback fetch
        fetch("/api/me")
          .then((res) => res.json())
          .then((data) => setIsVerified(Boolean(data?.user?.emailVerified)))
          .catch(() => setIsVerified(false));
      }
    } else {
      setIsVerified(undefined);
    }
  }, [status, session]);

  // fetch user stats
  useEffect(() => {
    if (status !== "authenticated") return;
    let mounted = true;

    setStatsLoading(true);
    setStatsError(null);

    fetch("/api/stats/user")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json();
      })
      .then((body) => mounted && setUserStats(body?.stats ?? null))
      .catch(() => mounted && setStatsError("Could not load stats"))
      .finally(() => mounted && setStatsLoading(false));

    return () => {
      mounted = false;
    };
  }, [status]);

  // fetch recent activity
  useEffect(() => {
    if (status !== "authenticated") return;
    let mounted = true;

    fetch("/api/activity")
      .then((res) => res.json())
      .then((body) => {
        if (!mounted) return;
        setActivity(Array.isArray(body?.items) ? body.items : []);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [status]);

  // Send verification email
  const handleSendVerification = async () => {
    setVerifying(true);
    setVerificationSent(false);
    try {
      const res = await fetch("/api/auth/verify/request", { method: "POST" });
      if (res.ok) setVerificationSent(true);
    } catch (err) {
      // optionally handle error
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto">
      {/* Email verification banner */}
      {isVerified === false && (
        <div className="flex flex-wrap items-center justify-between w-full gap-3 px-5 py-4 border rounded-xl border-amber-300/25 bg-amber-400/[0.06]">
          <div className="flex items-center gap-3">
            <Mail className="flex-none w-5 h-5 text-[#FBBF24]" />
            <span className="text-sm text-white/80">
              <strong className="text-[#FBBF24]">Email not verified.</strong>{" "}
              Please verify your email to unlock all features.
            </span>
          </div>
          <button
            className="px-4 py-2 text-sm font-semibold transition-colors rounded-md border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.1]"
            onClick={handleSendVerification}
            disabled={verifying || verificationSent}
          >
            {verificationSent
              ? "Verification Sent!"
              : verifying
                ? "Sending..."
                : "Send Verification Email"}
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-8 sm:px-8 sm:py-10">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] uppercase text-white/45">
              Dashboard
            </p>
            <h1 className="m-0 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}{" "}
              👋
            </h1>
            <p className="max-w-2xl mt-3 text-base leading-7 text-white/65">
              Track your recent activity, monitor usage, and manage account
              controls from one clean workspace.
            </p>
          </div>
        </div>
      </section>

      {/* User Stats Section */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-6 sm:px-7 sm:py-8">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">Your Stats</h2>
        {statsLoading ? (
          <div className="text-sm opacity-80">Loading stats...</div>
        ) : statsError ? (
          <div className="text-sm text-red-400">{statsError}</div>
        ) : userStats ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Definitions"
              value={userStats.definersCount}
              color="blue"
            />
            <StatCard
              label="Rephraser Results"
              value={userStats.rephrasersCount}
              color="green"
            />
            <StatCard
              label="Public Results"
              value={userStats.totalPublicResults}
              color="purple"
            />
            <StatCard
              label="Activities"
              value={userStats.activitiesCount}
              color="purple"
            />
            <StatCard
              label="Quiz Attempts"
              value={userStats.quizAttemptsCount}
              color="yellow"
            />
            <StatCard
              label="Tests Created"
              value={userStats.testsCreatedCount}
              color="pink"
            />
          </div>
        ) : null}
      </section>

      {/* Recent Activity */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold sm:text-2xl">Recent Activity</h2>
            <div className="text-sm text-white/50 sm:block">Last 30 days</div>
        </div>

        {activity.length === 0 ? (
            <div className="p-4 border rounded-xl border-white/10 bg-white/[0.02] sm:p-6">
              <div className="text-sm text-white/60">
                There is nothing to see here yet. Try generating or saving a
              rephrase or definition.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupActivities(activity).map((group) => (
              <div key={group.label}>
                <div className="mb-3 text-xs font-medium tracking-wide text-left uppercase text-grey-40/80">
                  {group.label}
                </div>
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                  {group.items.map((item: any) => (
                    <ActivityCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// --- Helper components/functions ---

function groupActivities(items: any[]) {
  const groups: Record<string, any[]> = {
    Today: [],
    Yesterday: [],
    "This week": [],
    Earlier: [],
  };
  const now = new Date();
  for (const it of items) {
    const created = new Date(it.createdAt);
    const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 1 && created.getDate() === now.getDate())
      groups["Today"].push(it);
    else if (diff < 2) groups["Yesterday"].push(it);
    else if (diff < 7) groups["This week"].push(it);
    else groups["Earlier"].push(it);
  }
  const order = ["Today", "Yesterday", "This week", "Earlier"];
  return order
    .map((label) => ({ label, items: groups[label] }))
    .filter((g) => g.items.length > 0);
}

function timeAgo(iso?: string) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "text-white",
    green: "text-white",
    purple: "text-white",
    yellow: "text-white",
    pink: "text-white",
  };
  return (
    <div className="flex flex-col items-start justify-center rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className={`text-3xl font-bold drop-shadow ${colorMap[color]}`}>
        {value ?? 0}
      </div>
      <div className="mt-2 text-sm font-medium text-white/65">{label}</div>
    </div>
  );
}

function ActivityCard({ item }: { item: any }) {
  const tool = item?.meta?.tool ?? null;
  const action = item?.meta?.action ?? null;

  let Icon = Clock;
  let toolLabel = "Activity";
  if (tool === "REPHRASER") ((Icon = FileText), (toolLabel = "Rephraser"));
  else if (tool === "DEFINER") ((Icon = Sparkles), (toolLabel = "Definer"));
  else if (tool === "TLDR") ((Icon = FileText), (toolLabel = "TL;DR"));
  else if (tool === "TEST") ((Icon = BookOpen), (toolLabel = "Test"));
  else if (tool === "QUIZ") ((Icon = Sparkles), (toolLabel = "Quiz"));
  else if (tool === "PRACTICE") ((Icon = Sparkles), (toolLabel = "Practice"));

  return (
    <div className="flex flex-row items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
      <div className="flex items-center justify-center flex-none w-10 h-10 rounded-md border border-white/10 bg-white/[0.02]">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/75 px-2 py-0.5 rounded border border-white/10 bg-white/[0.03]">
                {toolLabel}
              </span>
              {action && (
                <span className="text-xs text-white/60 px-2 py-0.5 rounded border border-white/10 bg-white/[0.02]">
                  {action}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-white/45 whitespace-nowrap">
            {timeAgo(item.createdAt)} ago
          </div>
        </div>
        {item.summary && (
          <div className="mt-2 overflow-hidden text-sm text-left text-white/65 max-h-20 text-ellipsis line-clamp-4">
            {item.summary}
          </div>
        )}
      </div>
    </div>
  );
}
