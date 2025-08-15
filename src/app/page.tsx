"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const RephraseMock = dynamic(() => import("@/components/other/RephraseMock"), { ssr: false });
import FeatureCard from "@/components/other/FeatureCard";
import { FeatureImageSecurity, FeatureImageUI, FeatureImagePractice } from "@/components/other/FeatureImages";
import { HiMiniSparkles } from "react-icons/hi2";

export default function HomePage() {
  return (
    <main className="flex flex-col mb-40 panel-hero gap-36">
      {/* Hero */}
      <section className="glass-panel hero-spotlight" style={{ padding: 40 }}>
        <div className="hero-grid">
          <div className="hero-copy">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Image src="/logo.png" alt="Lexicon logo" width={56} height={56} />
              <h1 style={{ margin: 0, fontSize: 48, lineHeight: 1.02 }}>Lexicon</h1>
            </div>
            <p className="hero-sub" style={{ marginTop: 8 }}>Your personal English coach.</p>

            <p className="hero-lead" style={{ marginTop: 18 }}>
              Rephrase sentences, practice English, and sharpen your writing with AI-powered suggestions tailored to tone and length. Learning tools and tests are coming soon.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <Link href="/rephrase" className="btn-primary">
                <HiMiniSparkles size={18} />
                <span>Try the Rephraser</span>
              </Link>
              <Link href="/skills" className="btn-secondary" aria-disabled="true" disabled>Skills (coming soon)</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="mockup-box">
              <img src="/demos/rephraser.png" alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Why choose section with alternating rows */}
      <section className="relative px-6 py-20 md:px-12 glass-panel">
        <h2 className="text-4xl font-semibold text-center mb-14">Why Choose Lexi</h2>

        <div className="flex flex-col gap-10 md:gap-14">
          {/* Feature 1: Image Left */}
          <div className="flex flex-row items-center gap-8 glass-feature">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImageSecurity />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Security First</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Your sentences stay private. Processing can happen locally and we never add facts or change named entities.
              </p>
            </div>
          </div>

          {/* Feature 2: Image Right */}
          <div className="flex flex-row-reverse items-center gap-8 glass-feature">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImageUI />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Beautiful, Calm UI</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Glassy panels, soft radii, and subtle gradients keep the interface focused and friendly.
              </p>
            </div>
          </div>

          {/* Feature 3: Image Left */}
          <div className="flex flex-row items-center gap-8 glass-feature">
            <div className="flex items-center justify-center md:w-1/3">
              <div className="flex items-center justify-center border shadow-lg w-28 h-28 rounded-2xl bg-white/10 backdrop-blur-lg border-white/20">
                <FeatureImagePractice />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="mb-3 text-2xl font-medium">Practice & Tests</h3>
              <p className="text-lg leading-relaxed opacity-80">
                Interactive exercises and scored tests will help you level up quickly (coming soon).
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
