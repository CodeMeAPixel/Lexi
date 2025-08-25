"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function HistoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  async function load(p = 1) {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/activity/list?page=${p}&pageSize=${pageSize}`,
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to load history");
        return;
      }
      const body = await res.json();
      setItems(body.items || []);
      setTotal(body.total || 0);
      setPage(body.page || p);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, []);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="flex-1 py-8 panel-wide">
      <section className="p-6 mx-auto max-w-8xl glass-panel">
        <header className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold">Activity History</h2>
          <Link href="/dashboard" className="btn-secondary">
            Back
          </Link>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-center opacity-80">Loading…</div>
          ) : items.length === 0 ? (
            <div className="p-6 rounded-xl glass-panel">
              <div className="text-sm text-gray-300">No activity found.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex flex-col items-start gap-4 p-3 transition-shadow sm:flex-row sm:items-center rounded-xl glass-panel hover:shadow-lg"
                >
                  <div className="flex items-center justify-center flex-none w-12 h-12 rounded-lg glass-panel">
                    <Clock className="w-5 h-5 text-white/90" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-col min-w-0">
                        <div className="text-sm font-medium truncate line-clamp-3 sm:line-clamp-4">
                          {it.summary ?? it.action}
                        </div>
                        <div className="mt-2 text-xs text-gray-400 sm:mt-0">
                          {new Date(it.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="hidden text-xs text-gray-400 sm:block whitespace-nowrap">
                        {/* desktop time / meta could go here */}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-full mt-3 sm:mt-0 sm:ml-4 sm:w-auto">
                    {it.viewUrl ? (
                      <Link
                        href={it.viewUrl}
                        className="block w-full px-3 py-1 text-sm text-center rounded sm:inline-block btn-primary"
                      >
                        View Result
                      </Link>
                    ) : (
                      <button
                        className="block w-full px-3 py-1 text-sm text-center rounded sm:inline-block btn-ghost"
                        disabled
                      >
                        View Result
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm">
            Page {page} / {pages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(Math.max(1, page - 1))}
              className="px-3 py-1 rounded btn-secondary"
              disabled={page <= 1}
            >
              Prev
            </button>
            <button
              onClick={() => load(Math.min(pages, page + 1))}
              className="px-3 py-1 rounded btn-secondary"
              disabled={page >= pages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
