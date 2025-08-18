"use client";

import { useState, useCallback } from "react";
import RephraseSettings from "@/components/other/RephraseSettings";
import { HiCog8Tooth, HiMiniSparkles } from "react-icons/hi2";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Sparkles, ShieldCheck, Lock, Gauge, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiCopy, FiArrowLeft } from "react-icons/fi";

type LengthType = "short" | "medium" | "long" | "original";
type ToneType = "Casual" | "Formal" | "Informal" | "Creative";

export default function Rephraser() {
  const [length, setLength] = useState<LengthType>("short");
  const [type, setType] = useState<ToneType>("Casual");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preserveEntities, setPreserveEntities] = useState(true);
  const [preservePunctuation, setPreservePunctuation] = useState(true);
  const [extraInstructions, setExtraInstructions] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [resultText, setResultText] = useState("");
  const [resultTone, setResultTone] = useState<ToneType | string>(type);
  const [resultLength, setResultLength] = useState<LengthType | string>(length);
  const [showResult, setShowResult] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [makePublic, setMakePublic] = useState(false);

  // copy handled on dedicated result page

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];
    parts.push(`Rephrase the sentence: "${input}"`);
    parts.push(
      `Preserve the original meaning${preserveEntities ? ", named entities (names, dates, numbers)" : ""}${preservePunctuation ? ", and punctuation" : ""}.`,
    );
    parts.push(
      type === "Casual"
        ? "Use a casual tone."
        : `Use a ${type.toLowerCase()} tone.`,
    );

    if (length === "short") {
      parts.push("Make it shorter while keeping the same meaning.");
    } else if (length === "medium") {
      parts.push("Make it moderately shorter or clearer as appropriate.");
    } else if (length === "long") {
      parts.push("Expand slightly for clarity while preserving the meaning.");
    }

    if (extraInstructions?.trim()) {
      parts.push(extraInstructions.trim());
    }

    parts.push(
      "Do not add new facts or information. Return only the rewritten sentence.",
    );
    return parts.join(" ");
  }, [input, type, length]);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim()) return;

      setIsLoading(true);

      try {
        const response = await fetch("/api/rephraser/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: buildPrompt(),
            original: input,
            tone: type,
            length,
            preserveEntities,
            preservePunctuation,
            extraInstructions,
          }),
        });

        if (!response.ok || !response.body) {
          toast.error("Failed to rephrase the sentence");
          throw new Error(response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let finalText = "";
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            finalText += decoder.decode(value);
          }
        }

        // Show result inline instead of redirecting
        setResultText(finalText);
        setResultTone(type);
        setResultLength(length);
        setShowResult(true);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [buildPrompt, input],
  );

  return (
    <main className="flex flex-col items-start justify-center w-full">
      <div className="w-full grid-cols-1 gap-6 mt-2 lg:grid-cols-2">
        <div className="w-full p-6 glass-panel">
          {!showResult ? (
            <form onSubmit={submit} className="flex flex-col w-full gap-3">
              <div className="relative flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold leading-tight text-center lg:text-5xl xl:text-6xl">
                  Sentence Rephraser!
                </h1>
                <p className="max-w-2xl mt-2 text-center text-grey-50 sm:text-sm lg:text-base lg:max-w-3xl">
                  Rephrase sentences with the tone you want. Crisp results,
                  streaming in real time.
                </p>

                {/* Compact settings button in header (top-right) for sm+; hidden on mobile to prevent overlap */}
                <button
                  onClick={() => setSettingsOpen(true)}
                  aria-label="Open settings"
                  className="absolute items-center justify-center p-2 transition-colors rounded-md md:inline-flex top-3 right-3 hover:bg-white/5 sm:hidden"
                  title="Settings"
                  type="button"
                >
                  <HiCog8Tooth size={18} />
                </button>

                {/* Mobile-friendly settings button to avoid overlapping the header text */}
                <div className="justify-center hidden w-full mt-3 md:flex">
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm transition-colors rounded-md bg-white/5 hover:bg-white/8"
                    type="button"
                  >
                    <HiCog8Tooth size={16} /> Settings
                  </button>
                </div>
              </div>

              <div className="field-header">
                <span>Your sentence</span>
                <span className="count">Word Count: {input.length}</span>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
                }}
                className="input cursor-text placeholder-grey-60 sm:placeholder:text-sm min-h-[200px]"
                rows={8}
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
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 text-lg rounded-md btn-ghost hover:bg-white/10"
                    onClick={() => {
                      setShowResult(false);
                      setResultText("");
                    }}
                    title="Back to editor"
                  >
                    <FiArrowLeft />
                  </button>
                  <h2 className="text-xl font-semibold lg:text-2xl">
                    Rephrase result
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {resultTone && <span className="badge">{resultTone}</span>}
                  {resultLength && (
                    <span className="badge">{resultLength}</span>
                  )}
                  <button
                    onClick={async () => {
                      if (!resultText) return;
                      await navigator.clipboard.writeText(resultText);
                      toast.success("Copied result 👏");
                    }}
                    className="flex items-center gap-1 p-2 text-sm rounded-md btn-ghost hover:bg-white/10"
                    title="Copy"
                  >
                    <FiCopy className="text-base" />
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-white/4 p-6 text-base lg:text-lg text-white/90 whitespace-pre-wrap min-h-[200px] leading-relaxed">
                {resultText || "No result available."}
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!resultText) return;
                      setIsSaving(true);
                      try {
                        const resp = await fetch("/api/rephraser/store", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            originalText: input,
                            rewrittenText: resultText,
                            tone: resultTone,
                            length: resultLength,
                            preserveEntities,
                            preservePunctuation,
                            extraInstructions,
                            isPublic: makePublic,
                          }),
                        });

                        const created = await resp.json();
                        if (!resp.ok) throw new Error("Failed to save");
                        // If made public, copy share URL to clipboard and notify user
                        if (makePublic && created?.item?.slug) {
                          const url = new URL(
                            `/results/${created.item.slug}`,
                            location.origin,
                          ).toString();
                          try {
                            await navigator.clipboard.writeText(url);
                            toast.success("Saved & copied public URL");
                          } catch {
                            window.open(url, "_blank");
                            toast.success("Saved — opened public result");
                          }
                        } else {
                          toast.success("Saved to your account");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Save failed");
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    className="px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>

                  {makePublic ? (
                    <span className="text-sm text-white/60">
                      Public link will be created and copied to your clipboard.
                    </span>
                  ) : (
                    <span className="text-sm text-white/60">
                      Save privately to your account. Toggle to make public.
                    </span>
                  )}
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
        <h2 className="mb-2 text-2xl font-bold">Rephraser FAQ & Info</h2>

        <Accordion>
          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> What does the
                rephraser do?
              </span>
            }
          >
            The rephraser is an AI-powered tool that rewrites your sentence
            while preserving its original meaning. You can adjust the tone and
            length to fit your needs, making your writing more clear, concise,
            or expressive. It’s perfect for emails, social posts, academic
            writing, and more.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400" /> Can I control
                the tone and length?
              </span>
            }
          >
            Absolutely! You can choose from Casual, Formal, Informal, or
            Creative tones to match your audience or style. For length, select
            Short (condensed), Medium (balanced), Long (expanded), or Original.
            These options help you tailor the output for any context.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" /> Does it keep names,
                dates, and punctuation?
              </span>
            }
          >
            Yes! By default, the rephraser preserves named entities (like names,
            dates, and numbers) and punctuation to ensure your meaning stays
            intact. You can toggle these options in the settings if you want
            more flexibility.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-yellow-400" /> How fast is it?
              </span>
            }
          >
            The rephraser streams results in real time, so you see your
            rewritten sentence appear almost instantly. This makes it easy to
            experiment and iterate quickly.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" /> Is my data private?
              </span>
            }
          >
            Yes. Your sentences are processed securely and are never stored or
            shared. We value your privacy and do not use your data for any
            purpose other than generating your requested output.
          </AccordionItem>

          <AccordionItem
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Tips for best
                results
              </span>
            }
          >
            <ul className="pl-4 space-y-1 list-disc">
              <li>Be clear and specific with your input sentence.</li>
              <li>
                Use extra instructions for special requests (e.g., "Make it
                sound friendly").
              </li>
              <li>Choose the tone and length that best fit your audience.</li>
              <li>
                Review the output and adjust settings as needed for your use
                case.
              </li>
            </ul>
          </AccordionItem>
        </Accordion>

        <div className="p-4 mt-4 text-sm border rounded-lg bg-indigo-500/10 border-indigo-400/20">
          <strong>How it works:</strong> The rephraser uses advanced AI to
          rewrite your sentence based on your selected options. It does not add
          new facts or information, and always aims to preserve your intent.
        </div>
      </section>

      <RephraseSettings
        open={settingsOpen}
        tone={type}
        length={length}
        preserveEntities={preserveEntities}
        preservePunctuation={preservePunctuation}
        extra={extraInstructions}
        onClose={() => setSettingsOpen(false)}
        onSave={(v) => {
          setType(v.tone as ToneType);
          setLength(v.length as LengthType);
          setPreserveEntities(v.preserveEntities);
          setPreservePunctuation(v.preservePunctuation);
          setExtraInstructions(v.extra || "");
        }}
      />
    </main>
  );
}
