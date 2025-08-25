"use client";

import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiArrowLeft } from "react-icons/fi";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function SpellcheckPage() {
  const [text, setText] = useState("");
  const [corrected, setCorrected] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [makePublic, setMakePublic] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const streamRef = useRef<ReadableStreamDefaultReader | null>(null);

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim()) return toast.error("Enter some text");
    setCorrected("");
    setShowResult(false);
    setLoading(true);

    try {
      const res = await fetch("/api/spellcheck/generate", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Generation failed");
        setLoading(false);
        return;
      }

      const json = await res.json();
      setCorrected(json.corrected || "");
      setShowResult(true);
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setLoading(false);
      streamRef.current = null;
    }
  }

  async function saveSpellcheck() {
    if (!corrected.trim()) return toast.error("Nothing to save");
    setSaving(true);
    try {
      const res = await fetch("/api/spellcheck/store", {
        method: "POST",
        body: JSON.stringify({
          originalText: text,
          correctedText: corrected,
          isPublic: makePublic,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body?.error || "Save failed");
        setSaving(false);
        return;
      }
      if (makePublic && body?.item?.slug) {
        const url = new URL(
          `/results/${body.item.slug}`,
          location.origin,
        ).toString();
        copyShareUrl(url);
        toast.success("Saved and copied public URL");
      } else {
        toast.success("Saved successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function copyShareUrl(url: string) {
    if (navigator.share) {
      navigator.share({ url, title: "Share this page" }).catch(() => {
        fallbackCopy(url);
      });
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          fallbackCopy(url);
        });
      return;
    }
    fallbackCopy(url);
  }

  function fallbackCopy(url: string) {
    const textarea = document.createElement("textarea");
    textarea.value = url;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Unable to copy. Please copy manually: " + url);
    }
    document.body.removeChild(textarea);
  }

  return (
    <main className="flex flex-col w-full">
      <div className="w-full grid-cols-1 gap-6 mt-2 lg:grid-cols-2">
        <div className="w-full p-6 glass-panel">
          {!showResult ? (
            <form onSubmit={generate} className="flex flex-col w-full gap-3">
              <div className="relative flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold leading-tight text-center lg:text-5xl">
                  Spellcheck
                </h1>
                <p className="max-w-2xl mt-2 text-center text-grey-50 sm:text-sm lg:text-base lg:max-w-3xl">
                  Correct spelling and minor grammar in your text — powered by
                  AI.
                </p>
              </div>

              <div className="field-header">
                <span>Text</span>
                <span className="count">Characters: {text.length}</span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded input min-h-[120px]"
                placeholder="Paste or write text to check"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <span className="inline-block mr-2 spinner" /> Checking…
                  </>
                ) : (
                  "Check"
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
                      setCorrected("");
                    }}
                    title="Back to editor"
                  >
                    <FiArrowLeft />
                  </button>
                  <h2 className="text-xl font-semibold lg:text-2xl">
                    Corrected Text
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyText(corrected)}
                    className="flex items-center gap-1 p-2 text-sm rounded-md btn-ghost hover:bg-white/10"
                    title="Copy"
                  >
                    <FiCopy className="text-base" />
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-white/4 p-6 text-base lg:text-lg text-white/90 whitespace-pre-wrap min-h-[200px] leading-relaxed">
                {corrected || "No corrected text available."}
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
                    onClick={saveSpellcheck}
                    className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
                    disabled={saving || !corrected.trim()}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <span className="text-sm text-white/60">
                    Save the corrected result to your account. Toggle to make
                    public.
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
        <h2 className="mb-2 text-2xl font-bold">Spellcheck FAQ & Info</h2>

        <Accordion>
          <AccordionItem title={"What does Spellcheck do?"}>
            The Spellcheck corrects spelling and minor grammar issues. It may
            also adjust punctuation and small stylistic suggestions.
          </AccordionItem>

          <AccordionItem title={"Is the corrected output always accurate?"}>
            The model is good at surface corrections but may not catch deep
            grammar/contextual issues. Review important text before publishing.
          </AccordionItem>

          <AccordionItem title={"Can I save my results?"}>
            Yes — after generating, you can save corrected results to your
            account and optionally make them public via a share URL.
          </AccordionItem>
        </Accordion>

        <div className="p-4 mt-4 text-sm border rounded-lg bg-indigo-500/10 border-indigo-400/20">
          <strong>How it works:</strong> The Spellcheck uses an AI model to
          correct spelling and tidies up minor grammar issues.
        </div>
      </section>
    </main>
  );
}
