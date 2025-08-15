"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiArrowLeft } from "react-icons/fi";

export default function RephraseResultPage() {
    const search = useSearchParams();
    const router = useRouter();

    const text = useMemo(() => search.get("text") || "", [search]);
    const tone = useMemo(() => search.get("tone") || "", [search]);
    const length = useMemo(() => search.get("length") || "", [search]);

    const copy = useCallback(async () => {
        if (!text) return;
        await navigator.clipboard.writeText(text);
        toast.success("Copied result 👏");
    }, [text]);

    return (
        <main className="flex flex-col items-center gap-6 mb-10 panel-wide">
            <div className="w-full max-w-3xl p-6 glass-panel">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 text-lg rounded-md btn-ghost hover:bg-white/10"
                            onClick={() => router.back()}
                            title="Back"
                        >
                            <FiArrowLeft />
                        </button>
                        <h2 className="text-lg font-semibold">Rephrase result</h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {tone && <span className="badge">{tone}</span>}
                        {length && <span className="badge">{length}</span>}
                        <button
                            onClick={copy}
                            className="flex items-center gap-1 p-2 text-sm rounded-md btn-ghost hover:bg-white/10"
                            title="Copy"
                        >
                            <FiCopy className="text-base" />
                        </button>
                    </div>
                </div>

                <div className="rounded-md bg-white/4 p-4 text-sm text-white/90 whitespace-pre-wrap min-h-[120px]">
                    {text || "No result available."}
                </div>

                <div className="mt-4 text-xs text-white/60">
                    You can share this URL to let others view the same result, or copy it to clipboard.
                </div>
            </div>
        </main>
    );
}
