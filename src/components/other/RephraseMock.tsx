"use client";
import { useEffect, useState } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function RephraseMock() {
  const original = "I went to the store and I bought some apples for the recipe.";
  const rephrases = [
    "I popped into the shop and picked up some apples for the recipe.",
    "I visited the store and purchased apples needed for the recipe.",
    "I grabbed apples from the store for the recipe.",
  ];

  const [phase, setPhase] = useState(0); // index of rephrases
  const [out, setOut] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function runDemo() {
      setRunning(true);
      for (let i = 0; i < rephrases.length && mounted; i++) {
        setPhase(i);
        setOut("");
        const target = rephrases[i];
        // small pause before typing
        await sleep(400);

        for (let j = 0; j < target.length && mounted; j++) {
          setOut((s) => s + target[j]);
          // speed up a little as it goes
          await sleep(8 + Math.random() * 20);
        }

        // hold the completed rephrase
        await sleep(900);
      }

      // small pause then loop
      await sleep(1000);
      if (mounted) {
        setRunning(false);
        // restart after short delay
        await sleep(800);
        if (mounted) runDemo();
      }
    }

    runDemo();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mockup-box p-4 bg-white/6 backdrop-blur-sm border border-white/6 h-80 w-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-red-400" />
      </div>

      <div className="flex-1 flex flex-col justify-start gap-3 overflow-hidden">
        <div className="text-xs text-white/60">Original</div>
        <div className="rounded-md bg-white/4 p-3 text-sm text-white/90" style={{ minHeight: 48 }}>
          {original}
        </div>

        <div className="mt-2 text-xs text-white/60">Rephrase ({phase + 1}/{rephrases.length})</div>
        <div
          className="rounded-md bg-black/60 p-3 text-sm text-white font-medium leading-6 h-28 overflow-auto"
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
          opacity: 0.9;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to { visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
