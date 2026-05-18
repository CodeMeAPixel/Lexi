"use client";
import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type DemoStep = {
  tool: "Rephrase" | "Spellcheck" | "Summarize" | "Definer";
  inputLabel: string;
  input: string;
  output: string;
};

const DEMO_STEPS: DemoStep[] = [
  {
    tool: "Rephrase",
    inputLabel: "Original",
    input: "I went to the store and I bought some apples for the recipe.",
    output: "I grabbed apples from the store for the recipe.",
  },
  {
    tool: "Spellcheck",
    inputLabel: "Input",
    input: "Their going too improve there writing fast.",
    output: "They're going to improve their writing fast.",
  },
  {
    tool: "Summarize",
    inputLabel: "Source",
    input:
      "Lexicon helps users rephrase text, check spelling, summarize writing, and define terms with focused AI workflows.",
    output:
      "Lexicon offers focused AI tools for rewriting, spelling, summarization, and definitions.",
  },
  {
    tool: "Definer",
    inputLabel: "Term",
    input: "Pragmatic",
    output: "Practical and focused on real-world results over theory.",
  },
];

export default function RephraseMock() {
  const [phase, setPhase] = useState(0);
  const [out, setOut] = useState("");
  const [running, setRunning] = useState(false);
  const current = DEMO_STEPS[phase];

  useEffect(() => {
    let mounted = true;

    async function runDemo() {
      setRunning(true);
      for (let i = 0; i < DEMO_STEPS.length && mounted; i++) {
        setPhase(i);
        setOut("");
        const target = DEMO_STEPS[i].output;
        await sleep(350);

        for (let j = 0; j < target.length && mounted; j++) {
          setOut((s) => s + target[j]);
          await sleep(9 + Math.random() * 16);
        }

        await sleep(1100);
      }

      await sleep(900);
      if (mounted) {
        setRunning(false);
        await sleep(650);
        if (mounted) runDemo();
      }
    }

    runDemo();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.085] to-white/[0.03] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_75%_5%,rgba(255,255,255,0.14),transparent_45%)]" />

      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400/90" />
          <div className="w-2 h-2 rounded-full bg-amber-300/90" />
          <div className="w-2 h-2 rounded-full bg-rose-400/90" />
        </div>
        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
          Preview
        </div>
      </div>

      <div className="relative flex flex-wrap gap-2 pb-3 mb-3 border-b border-white/10">
        {DEMO_STEPS.map((step, idx) => (
          <span
            key={step.tool}
            className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${idx === phase ? "border-white/25 bg-white/10 text-white" : "border-white/10 bg-white/[0.02] text-white/50"}`}
          >
            {step.tool}
          </span>
        ))}
      </div>

      <div className="relative flex flex-col flex-1 gap-3 overflow-hidden">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
          {current.inputLabel}
        </div>
        <div className="min-h-[64px] rounded-lg border border-white/10 bg-black/20 p-3 text-sm leading-relaxed text-white/88">
          {current.input}
        </div>

        <div className="mt-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
          <span>Output</span>
          <span>
            {phase + 1}/{DEMO_STEPS.length}
          </span>
        </div>
        <div
          className="h-[112px] overflow-auto rounded-lg border border-white/10 bg-black/45 p-3 text-sm font-medium leading-6 text-white"
          aria-live="polite"
        >
          <span>{out}</span>
          <span className="blinking-cursor">{running ? "|" : ""}</span>
        </div>
      </div>

      <style jsx>{`
        .blinking-cursor {
          display: inline-block;
          margin-left: 2px;
          opacity: 0.8;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
