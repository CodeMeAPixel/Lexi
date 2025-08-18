"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiArrowLeft } from "react-icons/fi";
import { Sparkles, Info, ShieldCheck, Lock, Gauge } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function DefinerPage() {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [makePublic, setMakePublic] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const streamRef = useRef<ReadableStreamDefaultReader | null>(null);

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!term.trim()) return toast.error("Enter a term");
    setDefinition("");
    setShowResult(false);
    setLoading(true);

    try {
      const res = await fetch("/api/definer/generate", {
        method: "POST",
        body: JSON.stringify({ term }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Generation failed");
        setLoading(false);
        return;
      }

      const reader = res.body!.getReader();
      streamRef.current = reader;
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setDefinition((prev) => prev + chunk);
      }

      setShowResult(true);
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setLoading(false);
      streamRef.current = null;
    }
  }

  async function saveDefiner() {
    if (!definition.trim()) return toast.error("Nothing to save");
    setSaving(true);
    try {
      const res = await fetch("/api/definer/store", {
        method: "POST",
        body: JSON.stringify({ term, definition, isPublic: makePublic }),
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body?.error || "Save failed");
        setSaving(false);
        return;
      }
      // If made public, copy share URL to clipboard and notify user
      if (makePublic && body?.item?.slug) {
        const url = new URL(
          `/results/${body.item.slug}`,
          location.origin,
        ).toString();
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Saved & copied public URL");
        } catch {
          // fallback: open in new tab
          window.open(url, "_blank");
          toast.success("Saved — opened public result");
        }
      } else {
        toast.success("Saved");
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex flex-col w-full">
      <div className="w-full grid-cols-1 gap-6 mt-2 lg:grid-cols-2">
        <div className="w-full p-6 glass-panel">
          {!showResult ? (
            <form onSubmit={generate} className="flex flex-col w-full gap-3">
              <div className="relative flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold leading-tight text-center lg:text-5xl">
                  Definer
                </h1>
                <p className="max-w-2xl mt-2 text-center text-grey-50 sm:text-sm lg:text-base lg:max-w-3xl">
                  Generate concise, clear definitions for terms and concepts —
                  streaming in real time.
                </p>
              </div>

              <div className="field-header">
                <span>Term</span>
                <span className="count">Characters: {term.length}</span>
              </div>

              <input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded input"
                placeholder="e.g. existentialism"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                disabled={loading || !term.trim()}
              >
                {loading ? (
                  <>
                    <span className="inline-block mr-2 spinner" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Define
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-lg rounded-md btn-ghost hover:bg-white/10"
                    onClick={() => {
                      setShowResult(false);
                      setDefinition("");
                    }}
                    title="Back to editor"
                  >
                    <FiArrowLeft />
                  </button>
                  <h2 className="text-xl font-semibold lg:text-2xl">
                    Definition
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!definition) return;
                      await navigator.clipboard.writeText(definition);
                      toast.success("Copied definition");
                    }}
                    className="flex items-center gap-1 p-2 text-sm rounded-md btn-ghost hover:bg-white/10"
                    title="Copy"
                  >
                    <FiCopy className="text-base" />
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-white/4 p-6 text-base lg:text-lg text-white/90 whitespace-pre-wrap min-h-[200px] leading-relaxed">
                {definition || "No definition available."}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="makePublic"
                    type="checkbox"
                    checked={makePublic}
                    onChange={() => setMakePublic((v) => !v)}
                  />
                  <label htmlFor="makePublic" className="text-sm">
                    Make public (creates a shareable URL)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={saveDefiner}
                    className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
                    disabled={saving || !definition.trim()}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <span className="text-sm text-white/60">
                    Save the definition to your account. Toggle to make public.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Right column intentionally left for layout balance or future controls (kept empty) */}
        </div>
      </div>

      {/* FAQ & Info Panel */}
      <section className="flex flex-col w-full gap-4 p-6 mx-auto mt-6 glass-panel">
        <h2 className="mb-2 text-2xl font-bold">Definer FAQ & Info</h2>

        <Accordion>
          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> What does the
                definer do?
              </span>
            }
          >
            The Definer generates short, clear definitions for terms and
            concepts. It aims to preserve the core meaning and avoid adding new
            factual information.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Is the output
                accurate?
              </span>
            }
          >
            The model strives for accuracy but may occasionally produce
            imprecise definitions. Verify critical facts independently before
            relying on them.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" /> Can I edit the
                definition?
              </span>
            }
          >
            Yes — you can copy the generated text, edit it, and save it to your
            account.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" /> Is my input private?
              </span>
            }
          >
            User inputs are processed only to generate the definition. See our
            Privacy Policy for details on data handling and retention.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-400" /> Tips for best
                results
              </span>
            }
          >
            Provide a single term or short phrase for best results. If the term
            is ambiguous, include context to help the model produce a focused
            definition.
          </AccordionItem>
        </Accordion>

        <div className="p-4 mt-4 text-sm border rounded-lg bg-indigo-500/10 border-indigo-400/20">
          <strong>How it works:</strong> The Definer uses an AI model to
          summarize and express the meaning of a term in concise language.
        </div>
      </section>
    </main>
  );
}
