import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMiniSparkles } from "react-icons/hi2";

export default function AboutPage() {
  return (
    <main className="w-full max-w-5xl mx-auto">
      <section className="mb-6 text-left border rounded-2xl border-white/10 bg-white/[0.02] p-8 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] p-2">
            <Image src="/logo.png" alt="Lexi logo" width={44} height={44} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-white/50">
              About
            </p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Lexicon, built for clear writing
            </h1>
          </div>
        </div>

        <p className="max-w-3xl mt-6 text-base leading-7 text-white/70">
          Lexi is short for <strong className="text-white">Lexicon</strong>: a
          collection of words and the knowledge around how they are used. We
          built Lexicon to help people write with precision, confidence, and a
          clean workflow.
        </p>
      </section>

      <section className="grid gap-4 mb-6 md:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-base font-semibold text-white">Clear output</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Rephrase, define, summarize, and spell-check with focused output
            tuned for practical writing.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-base font-semibold text-white">Respectful AI</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Lexicon is designed to preserve meaning, avoid invented facts, and
            keep your intent at the center.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-base font-semibold text-white">Calm interface</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            A neutral black and gray system keeps attention on your writing and
            the edits that matter.
          </p>
        </article>
      </section>

      <section className="text-left border rounded-2xl border-white/10 bg-white/[0.02] p-8 sm:p-10">
        <div className="max-w-4xl space-y-6 text-[15px] leading-7 text-white/72">
          <p>
            The word lexicon comes from the Greek lexikon, meaning "of words."
            In modern English, it usually refers to the vocabulary used by a
            person, language, or field. Lexicon follows that same core idea:
            helping people choose the right words and shape stronger sentences.
          </p>

          <p>
            Our mission is straightforward: make English clearer and more
            approachable. Whether you are formalizing a message, shortening
            content, or finding a more natural phrasing, Lexicon gives focused
            suggestions while preserving your original meaning.
          </p>

          <p>
            Privacy and clarity remain first principles. We prioritize concise
            rewrites, consistent terminology, and user control over tone and
            length so each suggestion stays usable in real work.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/auth" className="btn-primary">
              <HiMiniSparkles size={18} />
              <span>Get Started</span>
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
