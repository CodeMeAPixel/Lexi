"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const RephraseMock = dynamic(() => import("@/components/other/RephraseMock"), {
  ssr: false,
});
import FeatureCard from "@/components/other/FeatureCard";
import {
  FeatureImageSecurity,
  FeatureImageUI,
  FeatureImagePractice,
} from "@/components/other/FeatureImages";
import { HiMiniSparkles } from "react-icons/hi2";

export default function HomePage() {
  return (
    <main className="flex flex-col mb-40 panel-hero gap-36">
      {/* Hero */}
      <section className="p-40 glass-panel hero-spotlight">
        <div className="hero-grid">
          <div className="hero-copy">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Image
                src="/logo.png"
                alt="Lexicon logo"
                width={56}
                height={56}
              />
              <h1 style={{ margin: 0, fontSize: 48, lineHeight: 1.02 }}>
                Lexicon
              </h1>
            </div>
            <p className="hero-lead" style={{ marginTop: 18 }}>
              Refine your grammar abilities using cutting edge AI technology
              that offers personalized suggestions. Get ready to impress with
              your improved writing skills!
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Link href="/auth" className="btn-primary">
                <HiMiniSparkles size={18} />
                <span>Get Started</span>
              </Link>
              <Link
                href="/about"
                className="btn-secondary"
                aria-disabled="true"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mockup-box">
              <RephraseMock />
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section with alternating rows */}
      <section className="relative px-6 py-20 md:px-12 glass-panel">
        <h2 className="text-4xl font-semibold text-center mb-14">
          Why Choose Lexi
        </h2>

        <div className="flex flex-col gap-10 md:gap-14">
          {/* Feature 1: Image Left */}
          <div className="flex flex-row items-center gap-8 text-left glass-panel">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImageSecurity />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Security First</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Your sentences stay private. Processing can happen locally and
                we never add facts or change named entities.
              </p>
            </div>
          </div>

          {/* Feature 2: Image Right */}
          <div className="flex flex-row-reverse items-center gap-8 text-right glass-panel">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImageUI />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Beautiful, Calm UI</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Glassy panels, soft radii, and subtle gradients keep the
                interface focused and friendly.
              </p>
            </div>
          </div>

          {/* Feature 3: Image Left */}
          <div className="flex flex-row items-center gap-8 text-left glass-panel">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImagePractice />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Practice & Tests</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Interactive exercises and scored tests will help you level up
                quickly (coming soon).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lexicon stats */}
      <section className="px-6 py-12 md:px-12 glass-panel">
        <h2 className="mb-8 text-3xl font-semibold text-center">Statistics</h2>
        <LexiconStats />
      </section>
    </main>
  );
}

function LexiconStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/stats/lexicon")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (!json || json.error) {
          setError(json?.error || "Failed to load");
        } else {
          setData(json);
        }
      })
      .catch((err) => {
        console.error("lexicon stats fetch", err);
        if (mounted) setError("Failed to load");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return <div className="text-sm text-center opacity-80">Loading stats…</div>;
  if (error)
    return <div className="text-sm text-center text-red-400">{error}</div>;
  if (!data) return null;

  const totals = data.totals ?? {};
  const top = data.topPublicDefiners ?? [];
  const popular = data.popularTerms ?? [];
  const maxCount = Math.max(...popular.map((p: any) => p.count), 1);

  return (
    <div className="items-center justify-between">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Public Definitions"
          value={totals.totalDefiners}
          color="blue"
        />
        <StatCard
          label="Saved Rephraser Results"
          value={totals.totalRephrasers}
          color="green"
        />
        <StatCard
          label="Registered Users"
          value={totals.totalUsers}
          color="yellow"
        />
        <StatCard
          label="Spellcheck Runs"
          value={totals.totalSpellchecks}
          color="purple"
        />
        <StatCard
          label="Summaries (TL;DR)"
          value={totals.totalTldrs}
          color="teal"
        />
        <StatCard label="Tests" value={totals.totalTests} color="pink" />
        <StatCard label="Quizzes" value={totals.totalQuizzes} color="blue" />
        <StatCard
          label="Quiz Attempts"
          value={totals.totalQuizAttempts}
          color="green"
        />
        <StatCard
          label="Activities"
          value={totals.totalActivities}
          color="purple"
        />
      </div>

      {/* Recent public definitions */}
      <div className="mt-10 mb-10 text-left md:col-span-5">
        <h3 className="mb-4 text-xl font-semibold">
          Recent Public Definitions
        </h3>
        {top.length === 0 ? (
          <p className="mt-4 text-sm opacity-80">No public definitions yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
            {top.map((t: any) => {
              const href = t.slug
                ? `/results/${t.slug}`
                : `/results?shareId=${t.publicShareId}`;
              return (
                <a
                  key={t.id}
                  href={href}
                  className="block p-4 transition border shadow glass-panel rounded-xl border-white/10 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold truncate">
                      {t.term}
                    </div>
                    <div className="ml-3 text-xs opacity-60">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-xs opacity-70">View definition</div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Popular terms */}
      <div className="mt-10 text-left md:col-span-3">
        <h3 className="mb-4 text-xl font-semibold">Popular Terms</h3>
        {popular.length === 0 ? (
          <div className="mt-2 text-sm opacity-80">No popular terms yet.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {popular.map((p: any) => (
              <div key={p.term} className="flex items-center gap-2 glass-panel">
                <div className="flex-1 text-sm font-medium truncate">
                  {p.term}
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 rounded bg-blue-300/60"
                    style={{
                      width: `${Math.round((p.count / maxCount) * 60)}px`,
                      minWidth: 8,
                    }}
                  />
                  <span className="ml-1 text-xs opacity-70">{p.count}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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
    <div
      className={`glass-panel p-6 flex flex-col items-center justify-center rounded-2xl shadow-lg`}
    >
      <div className={`text-3xl font-bold drop-shadow ${colorMap[color]}`}>
        {value ?? 0}
      </div>
      <div className="mt-2 text-base font-medium opacity-80">{label}</div>
    </div>
  );
}
