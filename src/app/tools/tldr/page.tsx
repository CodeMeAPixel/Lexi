"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiCopy, FiArrowLeft } from "react-icons/fi";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function TldrPage() {
  const [messagesText, setMessagesText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [makePublic, setMakePublic] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function parseMessages(input: string) {
    // Accept multiple messages separated by two newlines, or a single message
    const blocks = input
      .split(/\n\n+/)
      .map((b) => b.trim())
      .filter(Boolean);
    // Heuristic: if block starts with "role:" use that role, otherwise use 'user'
    return blocks.map((b) => {
      const m = b.match(/^\s*(\w+):\s*([\s\S]*)$/);
      if (m) return { role: m[1].toLowerCase(), content: m[2].trim() };
      return { role: "user", content: b };
    });
  }

  async function generate(e?: React.FormEvent) {
    e?.preventDefault();
    const msgs = parseMessages(messagesText);
    if (!msgs.length) return toast.error("Enter at least one message");
    setSummary("");
    setShowResult(false);
    setLoading(true);
    try {
      const res = await fetch("/api/tldr/generate", {
        method: "POST",
        body: JSON.stringify({ messages: msgs }),
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Generation failed");
        setLoading(false);
        return;
      }
      const json = await res.json();
      setSummary(json.summary || "");
      setShowResult(true);
    } catch (err) {
      console.error(err);
      toast.error("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!summary.trim()) return toast.error("Nothing to save");
    setSaving(true);
    try {
      const msgs = parseMessages(messagesText);
      const res = await fetch("/api/tldr/store", {
        method: "POST",
        body: JSON.stringify({ messages: msgs, summary, isPublic: makePublic }),
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
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Saved & copied public URL");
        } catch {
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
          alert("Link copied to clipboard!");
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
      alert("Link copied to clipboard!");
    } catch {
      alert("Unable to copy. Please copy manually: " + url);
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
                  TL;DR (Summarizer)
                </h1>
                <p className="max-w-2xl mt-2 text-center text-grey-50 sm:text-sm lg:text-base lg:max-w-3xl">
                  Paste one or more messages or conversation blocks and get a
                  concise summary.
                </p>
              </div>

              <div className="field-header">
                <span>Messages</span>
                <span className="count">
                  Blocks: {messagesText.split(/\n\n+/).filter(Boolean).length}
                </span>
              </div>

              <textarea
                value={messagesText}
                onChange={(e) => setMessagesText(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border rounded input min-h-[120px]"
                placeholder={
                  "Enter messages. Separate distinct messages with a blank line. Prefix with 'role: text' to set role (optional)."
                }
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                disabled={loading || !messagesText.trim()}
              >
                {loading ? (
                  <>
                    <span className="inline-block mr-2 spinner" /> Summarizing…
                  </>
                ) : (
                  "Summarize"
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
                      setSummary("");
                    }}
                    title="Back to editor"
                  >
                    <FiArrowLeft />
                  </button>
                  <h2 className="text-xl font-semibold lg:text-2xl">Summary</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      if (!summary) return;
                      await navigator.clipboard.writeText(summary);
                      toast.success("Copied summary");
                    }}
                    className="flex items-center gap-1 p-2 text-sm rounded-md btn-ghost hover:bg-white/10"
                    title="Copy"
                  >
                    <FiCopy className="text-base" />
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-white/4 p-6 text-base lg:text-lg text-white/90 whitespace-pre-wrap min-h-[200px] leading-relaxed">
                {summary || "No summary available."}
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
                    onClick={save}
                    className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-700"
                    disabled={saving || !summary.trim()}
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                  <span className="text-sm text-white/60">
                    Save the summarized result to your account. Toggle to make
                    public.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Right column intentionally left empty for layout parity */}
        </div>
      </div>

      <section className="flex flex-col w-full gap-4 p-6 mx-auto mt-6 glass-panel">
        <h2 className="mb-2 text-2xl font-bold">TL;DR FAQ & Info</h2>

        <Accordion>
          <AccordionItem title={"What does TL;DR do?"}>
            The TL;DR tool summarizes one or more messages or conversation
            blocks into a concise paragraph, highlighting main points,
            decisions, and action items. It's ideal for meetings, chat logs,
            support threads, or any long conversation.
          </AccordionItem>

          <AccordionItem title={"How should I format messages?"}>
            <div className="space-y-2">
              <div>
                Separate different messages with a blank line. Optionally prefix
                a block with <code>role: text</code> to indicate speaker role
                (e.g. <code>agent: We'll follow up tomorrow</code>).
              </div>
              <div className="pt-2">
                <strong>Examples:</strong>
              </div>
              <div className="p-2 font-mono text-xs whitespace-pre-wrap rounded bg-black/10">
                {`user: Can you summarize our meeting?

        agent: Sure! We discussed project deadlines and assigned tasks to each team member.

        user: What are my next steps?

        agent: You will prepare the draft by Friday.`}
              </div>
              <div className="p-2 font-mono text-xs whitespace-pre-wrap rounded bg-black/10">
                {`Let's meet next week to review progress.

        I'll send the updated document tomorrow.

        Remember to check the shared folder for resources.`}
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title={"Can I save summaries?"}>
            Yes, after generating, you can save summaries to your account and
            optionally make them public. Public summaries are easy to copy and
            share with others.
          </AccordionItem>

          <AccordionItem title={"Any advanced tips or limitations?"}>
            <ul className="items-start pl-5 space-y-1 text-left list-disc">
              <li>
                For best results, keep each message or block focused and clear.
              </li>
              <li>
                Role prefixes (<code>user:</code>, <code>agent:</code>, etc.)
                help the AI understand context, but are optional.
              </li>
              <li>
                Long or complex conversations may be summarized more generally;
                split into smaller blocks for detailed summaries.
              </li>
              <li>
                AI summaries are concise and may omit minor details always
                review for accuracy.
              </li>
            </ul>
          </AccordionItem>
        </Accordion>

        <div className="p-4 mt-4 text-sm border rounded-lg bg-indigo-500/10 border-indigo-400/20">
          <strong>How it works:</strong> The TL;DR uses an AI model to read the
          supplied messages and produce a concise summary.
        </div>
      </section>
    </main>
  );
}
