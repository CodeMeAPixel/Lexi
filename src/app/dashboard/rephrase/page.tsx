"use client";

import { FiEdit } from "react-icons/fi";
import SegmentedControl from "@/components/other/SegmentedControl";
import { useState, useRef, useCallback } from "react";
import RephraseSettings from "@/components/other/RephraseSettings";
import { HiCog8Tooth, HiMiniSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

    const toneControlRef = useRef<HTMLDivElement>(null);
    const lengthControlRef = useRef<HTMLDivElement>(null);

    // copy handled on dedicated result page

    const buildPrompt = useCallback(() => {
        const parts: string[] = [];
        parts.push(`Rephrase the sentence: "${input}"`);
        parts.push(
            `Preserve the original meaning${preserveEntities ? ", named entities (names, dates, numbers)" : ""}${preservePunctuation ? ", and punctuation" : ""}.`
        );
        parts.push(
            type === "Casual"
                ? "Use a casual tone."
                : `Use a ${type.toLowerCase()} tone.`
        );

        if (length === "short") {
            parts.push("Make it shorter while keeping the same meaning.");
        } else if (length === "medium") {
            parts.push("Make it moderately shorter or clearer as appropriate.");
        } else if (length === "long") {
            parts.push(
                "Expand slightly for clarity while preserving the meaning."
            );
        }

        if (extraInstructions?.trim()) {
            parts.push(extraInstructions.trim());
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
                let finalText = "";
                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        finalText += decoder.decode(value);
                    }
                }

                const params = new URLSearchParams();
                params.set("text", finalText);
                params.set("tone", type);
                params.set("length", length);

                router.push(`/dashboard/rephrase/result?${params.toString()}`);
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
        <main className="w-full flex justify-center items-start">
            <form
                onSubmit={submit}
                className="flex flex-col w-full gap-3 p-6 mt-2 glass-panel"
            >
                <div className="relative flex flex-col items-center justify-center">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight">
                        Sentence Rephraser!
                    </h1>
                    <p className="mt-2 text-center text-grey-50 sm:text-sm lg:text-base max-w-2xl lg:max-w-3xl">
                        Rephrase sentences with the tone you want. Crisp
                        results, streaming in real time.
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
                        if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
                            submit();
                    }}
                    className="input cursor-text placeholder-grey-60 sm:placeholder:text-sm min-h-[200px]"
                    rows={8}
                    placeholder="Type or paste a sentence… Press Ctrl/⌘ + Enter to rewrite."
                />

                {/* Previously the full-width Settings button lived here; moved to header for a cleaner layout */}
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
