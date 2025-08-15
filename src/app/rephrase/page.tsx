"use client";

import { FiEdit } from "react-icons/fi";
import SegmentedControl from "@/components/other/SegmentedControl";
import { useState, useRef, useCallback } from "react";
import { HiMiniSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";

type LengthType = "short" | "medium" | "long" | "original";
type ToneType = "Casual" | "Formal" | "Informal" | "Creative";

export default function Rephraser() {
  const [length, setLength] = useState<LengthType>("short");
  const [type, setType] = useState<ToneType>("Casual");
  const [sentence, setSentence] = useState("");
  const [input, setInput] = useState("hello");
  const [isLoading, setIsLoading] = useState(false);

  const toneControlRef = useRef<HTMLDivElement>(null);
  const lengthControlRef = useRef<HTMLDivElement>(null);

  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(sentence);
    toast("Copied to clipboard", {
      icon: "👏",
    });
  }, [sentence]);

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];
    parts.push(`Rephrase the sentence: "${input}"`);
    parts.push(
      "Preserve the original meaning, named entities (names, dates, numbers), and punctuation."
    );
    parts.push(
      type === "Casual" ? "Use a casual tone." : "Use a formal tone."
    );

    if (length === "short") {
      parts.push("Make it shorter while keeping the same meaning.");
    } else if (length === "medium") {
      parts.push("Make it moderately shorter or clearer as appropriate.");
    } else if (length === "long") {
      parts.push("Expand slightly for clarity while preserving the meaning.");
    }

    parts.push(
      "Do not add new facts or information. Return only the rewritten sentence."
    );
    return parts.join(" ");
  }, [input, type, length]);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;

      setSentence("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/rephraser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: buildPrompt() }),
        });

        if (!response.ok || !response.body) {
          toast.error("Failed to rephrase the sentence");
          throw new Error(response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunkValue = decoder.decode(value);
            setSentence((prev) => prev + chunkValue);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [buildPrompt, input]
  );

  return (
    <main className="flex flex-col items-center gap-6 mb-10 panel-wide">
      <h1 className="flex flex-col gap-3 text-5xl font-bold text-center leading-11 sm:text-4xl">
        Write better, faster with Lexi!
      </h1>
      <p className="-mt-2 text-center text-grey-50 sm:text-sm max-w-4/6">
        Rephrase sentences with the tone you want. Crisp results, streaming in
        real time.
      </p>

      <form
        onSubmit={submit}
        className="flex flex-col w-full gap-3 p-6 mt-2 glass-panel"
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <label className="block mb-2 text-xs text-white/70">Tone</label>
            <SegmentedControl
              name="tone"
              callback={(val: ToneType) => setType(val)}
              controlRef={toneControlRef}
              defaultIndex={0}
              segments={[
                { label: "Casual", value: "Casual", ref: useRef() },
                { label: "Formal", value: "Formal", ref: useRef() },
                { label: "Creative", value: "Creative", ref: useRef() },
              ]}
            />
          </div>

          <div style={{ width: 260 }}>
            <label className="block mb-2 text-xs text-white/70">Length</label>
            <SegmentedControl
              name="length"
              callback={(val: LengthType) => setLength(val)}
              controlRef={lengthControlRef}
              defaultIndex={0}
              segments={[
                { label: "Short", value: "short", ref: useRef() },
                { label: "Medium", value: "medium", ref: useRef() },
                { label: "Long", value: "long", ref: useRef() },
                { label: "Original", value: "original", ref: useRef() },
              ]}
            />
          </div>
        </div>

        <div className="field-header">
          <span>Your sentence</span>
          <span className="count">{input.length}</span>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
          }}
          className="input cursor-text placeholder-grey-60 sm:placeholder:text-sm"
          rows={5}
          placeholder="Type or paste a sentence… Press Ctrl/⌘ + Enter to rewrite."
        />

        <button
          type="submit"
          className="flex flex-row items-center justify-center gap-2 sm:text-sm disabled:cursor-not-allowed"
          disabled={isLoading || !input}
          style={{ width: "100%" }}
        >
          {isLoading ? (
            <>
              <span className="inline-block mr-2 align-middle">
                <span className="spinner" />
              </span>
              Generating...
            </>
          ) : (
            <>
              <HiMiniSparkles size={18} /> Rewrite
            </>
          )}
        </button>
      </form>

      {sentence && (
        <div className="result-card">
          <div className="result-header">
            <span>Result</span>
            <div className="result-meta">
              <span className="badge">{type}</span>
              <span className="badge">
                {length === "short"
                  ? "Shorter"
                  : length === "medium"
                    ? "Medium"
                    : length === "long"
                      ? "Longer"
                      : "Original"}
              </span>
              <button
                onClick={copy}
                className="copy-btn"
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="result-body">{sentence}</div>
        </div>
      )}
    </main>
  );
}
