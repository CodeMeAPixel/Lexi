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
        <main className="w-full flex justify-center items-start">
            <div className="w-full p-6 glass-panel">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            className="p-2 text-lg rounded-md btn-ghost hover:bg-white/10"
                            onClick={() => router.back()}
                            title="Back"
                        >
                            <FiArrowLeft />
                        </button>
                        <h2 className="text-xl lg:text-2xl font-semibold">
                            Rephrase result
                        </h2>
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

                <div className="rounded-md bg-white/4 p-6 text-base lg:text-lg text-white/90 whitespace-pre-wrap min-h-[200px] leading-relaxed">
                    {text || "No result available."}
                </div>

                <div className="mt-6 text-sm text-white/60">
                    You can share this URL to let others view the same result,
                    or copy it to clipboard.
                </div>
            </div>
        </main>
    );
}
