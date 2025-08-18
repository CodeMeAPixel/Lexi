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
    <main className="flex flex-col gap-24 mb-40 panel-hero">
      {/* Email verification banner */}
      {isVerified === false && (
        <div className="flex items-center justify-between w-full gap-4 px-6 py-3 mb-6 border rounded glass-panel animate-fade-in">
          <div className="flex items-center gap-3">
            <Mail className="flex-none w-5 h-5 text-[#FBBF24]" />
            <span>
              <strong className="text-[#FBBF24]">Email not verified.</strong>{" "}
              Please verify your email to unlock all dashboard features.
            </span>
          </div>
          <button
            className="px-4 py-2 font-semibold text-white transition-colors rounded glass-panel hover:bg-[#fbbf24] hover:text-grey-100"
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
      <section className="glass-panel hero-spotlight" style={{ padding: 40 }}>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1
              style={{ margin: 0, fontSize: 36, lineHeight: 1.1 }}
              className="font-semibold"
            >
              Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}{" "}
              👋
            </h1>
            <p className="mt-2 text-lg text-gray-400 hero-sub">
              Here you can view your account settings and more.
            </p>
          </div>
        </div>
      </section>

      {/* User Stats Section */}
      <section className="relative px-4 py-8 sm:px-6 md:px-12 glass-panel animate-fade-in">
        <h2 className="mb-8 text-2xl font-semibold text-center">Your Stats</h2>
        {statsLoading ? (
          <div className="text-sm text-center opacity-80">Loading stats…</div>
        ) : statsError ? (
          <div className="text-sm text-center text-red-400">{statsError}</div>
        ) : userStats ? (
          <div className="grid grid-cols-3 gap-6 md:grid-cols-3">
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
      <section className="relative px-4 py-8 sm:px-6 md:px-12 glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold sm:text-2xl">Recent Activity</h2>
          <div className="text-sm text-grey-40/80 sm:block">Over 30 days.</div>
        </div>

        {activity.length === 0 ? (
          <div className="p-4 sm:p-6 rounded-xl glass-panel">
            <div className="text-sm text-gray-40/80">
              There is nothing to see here yet — try generating or saving a
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
    blue: "text-blue-400",
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
    pink: "text-pink-400",
  };
  return (
    <div className="flex flex-col items-center justify-center p-6 shadow-lg glass-panel rounded-2xl">
      <div className={`text-3xl font-bold drop-shadow ${colorMap[color]}`}>
        {value ?? 0}
      </div>
      <div className="mt-2 text-base font-medium opacity-80">{label}</div>
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
  else if (tool === "TEST") ((Icon = BookOpen), (toolLabel = "Test"));
  else if (tool === "QUIZ") ((Icon = Sparkles), (toolLabel = "Quiz"));
  else if (tool === "PRACTICE") ((Icon = Sparkles), (toolLabel = "Practice"));

  return (
    <div className="flex flex-row items-center gap-4 p-4 transition-shadow rounded-xl glass-panel hover:shadow-lg">
      <div className="flex items-center justify-center flex-none w-12 h-12 rounded-lg glass-panel">
        <Icon className="w-5 h-5 text-white/90" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-300 px-2 py-0.5 rounded bg-grey-80">
                {toolLabel}
              </span>
              {action && (
                <span className="text-xs text-gray-200 px-2 py-0.5 rounded bg-grey-80">
                  {action}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap">
            {timeAgo(item.createdAt)} ago
          </div>
        </div>
        {item.summary && (
          <div className="mt-3 overflow-hidden text-sm text-left text-gray-300 max-h-20 text-ellipsis line-clamp-4">
            {item.summary}
          </div>
        )}
      </div>
    </div>
  );
}
