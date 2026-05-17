"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const RephraseMock = dynamic(() => import("@/components/other/RephraseMock"), {
  ssr: false,
});
import {
  FeatureImageSecurity,
  FeatureImageUI,
  FeatureImagePractice,
} from "@/components/other/FeatureImages";
import { HiMiniSparkles } from "react-icons/hi2";

export default function HomePage() {
  return (
    <main className="flex flex-col w-full max-w-[1280px] mx-auto mb-32 gap-14">
      <section className="px-8 py-14 border glass-panel hero-spotlight border-white/10 md:px-5">
        <div className="hero-grid">
          <div className="hero-copy enter-visible">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Image
                src="/logo.png"
                alt="Lexicon logo"
                width={52}
                height={52}
              />
              <h1
                style={{ margin: 0 }}
                className="text-5xl font-semibold tracking-tight text-white md:text-4xl"
              >
                Lexicon
              </h1>
            </div>
            <p className="inline-flex items-center px-3 py-1 mt-4 text-xs font-medium tracking-wide uppercase border rounded-full border-white/15 bg-white/5 text-white/70">
              Writing assistant suite
            </p>
            <p className="max-w-2xl mt-5 text-xl font-medium leading-snug text-white md:text-lg">
              Professional writing tools with fast AI workflows, sharp output,
              and a focused workspace.
            </p>
            <p className="max-w-2xl mt-4 leading-relaxed text-white/65">
              Rephrase, define, summarize, and polish your text in one place.
              Built for students, teams, and creators who care about clarity.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
              <Link href="/auth" className="btn-primary">
                <HiMiniSparkles size={18} />
                <span>Start Writing Better</span>
              </Link>
              <Link href="/about" className="btn-secondary">
                Explore Lexicon
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 md:grid-cols-1">
              <MetricPill label="Avg. Processing" value="< 2s" />
              <MetricPill label="Suite Tools" value="4" />
              <MetricPill label="Focus" value="Quality" />
            </div>
          </div>

          <div className="hero-visual enter-visible">
            <div className="mockup-box">
              <RephraseMock />
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-8 py-12 border glass-panel border-white/10 md:px-5">
        <h2 className="text-3xl font-semibold tracking-tight text-left text-white md:text-2xl">
          Why teams choose Lexicon
        </h2>
        <p className="mt-3 text-white/65">
          A deliberate interface with practical AI features and predictable
          output quality.
        </p>

        <div className="grid grid-cols-3 gap-5 mt-8 md:grid-cols-1">
          <div className="p-6 border rounded-2xl border-white/10 bg-black/30">
            <div className="flex items-center justify-center w-12 h-12 border rounded-xl border-white/15 bg-white/5">
                <FeatureImageSecurity />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Privacy-first workflows
            </h3>
            <p className="mt-3 leading-relaxed text-white/65">
              Your writing stays yours. Lexicon is designed to preserve meaning
              and avoid accidental fact drift.
            </p>
          </div>

          <div className="p-6 border rounded-2xl border-white/10 bg-black/30">
            <div className="flex items-center justify-center w-12 h-12 border rounded-xl border-white/15 bg-white/5">
                <FeatureImageUI />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Calm visual rhythm
            </h3>
            <p className="mt-3 leading-relaxed text-white/65">
              Black and gray foundations reduce noise, keeping the content and
              your decisions at the center.
            </p>
          </div>

          <div className="p-6 border rounded-2xl border-white/10 bg-black/30">
            <div className="flex items-center justify-center w-12 h-12 border rounded-xl border-white/15 bg-white/5">
                <FeatureImagePractice />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-white">
              Built for progression
            </h3>
            <p className="mt-3 leading-relaxed text-white/65">
              From one-off edits to repeat workflows, Lexicon scales with your
              writing pace.
            </p>
          </div>
        </div>
      </section>

      <section className="px-8 py-12 border glass-panel border-white/10 md:px-5">
        <h2 className="text-3xl font-semibold tracking-tight text-left text-white md:text-2xl">
          Live platform metrics
        </h2>
        <p className="mt-2 text-white/65">
          Transparent usage numbers from your public activity endpoints.
        </p>
        <LexiconStats />
      </section>
    </main>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 border rounded-xl border-white/10 bg-black/35">
      <div className="text-xs uppercase tracking-[0.12em] text-white/55">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
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
    return <div className="mt-6 text-sm text-left text-white/70">Loading stats...</div>;
  if (error)
    return <div className="mt-6 text-sm text-left text-red-400">{error}</div>;
  if (!data) return null;

  const totals = data.totals ?? {};
  const top = data.topPublicDefiners ?? [];
  const popular = data.popularTerms ?? [];
  const maxCount = Math.max(...popular.map((p: any) => p.count), 1);

  return (
    <div className="mt-8 items-center justify-between">
      <div className="grid grid-cols-3 gap-4 mb-10 md:grid-cols-2 sm:grid-cols-1">
        <StatCard label="Public Definitions" value={totals.totalDefiners} />
        <StatCard label="Saved Rephraser Results" value={totals.totalRephrasers} />
        <StatCard label="Registered Users" value={totals.totalUsers} />
        <StatCard label="Spellcheck Runs" value={totals.totalSpellchecks} />
        <StatCard label="Summaries" value={totals.totalTldrs} />
        <StatCard label="Tests" value={totals.totalTests} />
        <StatCard label="Quizzes" value={totals.totalQuizzes} />
        <StatCard label="Quiz Attempts" value={totals.totalQuizAttempts} />
        <StatCard label="Activities" value={totals.totalActivities} />
      </div>

      <div className="mt-10 mb-10 text-left md:col-span-5">
        <h3 className="mb-4 text-xl font-semibold text-white">Recent Public Definitions</h3>
        {top.length === 0 ? (
          <p className="mt-4 text-sm text-white/65">No public definitions yet.</p>
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
                  className="block p-4 transition border rounded-xl border-white/10 bg-black/35 hover:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-base font-semibold text-white truncate">
                      {t.term}
                    </div>
                    <div className="ml-3 text-xs text-white/50">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-white/65">View definition</div>
                </a>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-10 text-left md:col-span-3">
        <h3 className="mb-4 text-xl font-semibold text-white">Popular Terms</h3>
        {popular.length === 0 ? (
          <div className="mt-2 text-sm text-white/65">No popular terms yet.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {popular.map((p: any) => (
              <div
                key={p.term}
                className="flex items-center gap-2 px-4 py-3 border rounded-xl border-white/10 bg-black/35"
              >
                <div className="flex-1 text-sm font-medium text-white truncate">
                  {p.term}
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 rounded bg-white/65"
                    style={{
                      width: `${Math.round((p.count / maxCount) * 60)}px`,
                      minWidth: 8,
                    }}
                  />
                  <span className="ml-1 text-xs text-white/60">{p.count}</span>
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
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="p-6 border rounded-2xl border-white/10 bg-black/35">
      <div className="text-[2rem] font-semibold tracking-tight text-white">
        {value ?? 0}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-[0.08em] text-white/55">
        {label}
      </div>
    </div>
  );
}
