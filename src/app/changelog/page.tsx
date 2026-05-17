"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function ChangelogPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [releases, setReleases] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/changelog")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (!json || json.error) {
          setError(json?.error || "Failed to load changelog");
        } else {
          setReleases(json.releases ?? []);
        }
      })
      .catch((err) => {
        if (mounted) setError("Failed to load changelog");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="flex flex-col gap-24 mb-40 panel-hero">
      <section className="glass-panel hero-spotlight" style={{ padding: 40 }}>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 className="text-4xl font-bold leading-tight">Changelog</h1>
            <p className="mt-2 text-lg text-gray-400 hero-sub">
              See what's new and improved in Lexi.
            </p>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-8 sm:px-6 md:px-12 glass-panel">
        <h2 className="mb-8 text-2xl font-semibold text-center">
          Release History
        </h2>
        {loading ? (
          <div className="text-sm text-center opacity-80">
            Loading changelog…
          </div>
        ) : error ? (
          <div className="text-sm text-center text-red-400">{error}</div>
        ) : releases.length === 0 ? (
          <div className="text-sm text-center opacity-80">
            No releases found.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {releases.map((rel: any) => (
              <div key={rel.id} className="p-6 shadow glass-panel rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">
                      {rel.name || rel.tag_name}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-500/10 text-blue-400">
                      {rel.target_commitish}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <Link
                      href={rel.html_url}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                    >
                      View on GitHub <FiExternalLink className="inline-block" />
                    </Link>
                    {/* Show exactly one badge below the link: prerelease > latest > draft */}
                    {rel.prerelease ? (
                      <span className="mt-1 px-2 py-0.5 text-xs rounded bg-yellow-500/10 text-yellow-500">
                        Pre-release
                      </span>
                    ) : rel.isLatest ? (
                      <span className="mt-1 px-2 py-0.5 text-xs rounded bg-green-500/10 text-green-500 font-semibold">
                        Latest
                      </span>
                    ) : rel.draft ? (
                      <span className="mt-1 px-2 py-0.5 text-xs rounded bg-gray-500/10 text-gray-400">
                        Draft
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  {rel.author?.avatar_url && (
                    <img
                      src={rel.author.avatar_url}
                      alt={rel.author.login}
                      className="border rounded-full w-7 h-7 border-white/20"
                    />
                  )}
                  {rel.author?.login && (
                    <Link
                      href={rel.author.html_url}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-blue-300 hover:underline"
                    >
                      {rel.author.login}
                    </Link>
                  )}
                  <span className="text-xs opacity-70">
                    {new Date(rel.published_at).toLocaleDateString()}
                  </span>
                </div>
                <ReleaseBodyGrid body={rel.body} />
                {Array.isArray(rel.assets) && rel.assets.length > 0 && (
                  <div className="mt-4">
                    <h4 className="mb-2 text-xs font-semibold">Assets</h4>
                    <ul className="space-y-1">
                      {rel.assets.map((asset: any) => (
                        <li key={asset.id}>
                          <Link
                            href={asset.browser_download_url}
                            target="_blank"
                            rel="noopener"
                            className="text-xs text-blue-400 hover:underline"
                          >
                            {asset.name}
                          </Link>
                          <span className="ml-2 text-xs opacity-60">
                            ({Math.round(asset.size / 1024)} KB)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// Simple markdown to HTML (for release body)
function markdownToHtml(md: string) {
  if (!md) return "";
  // Minimal: convert line breaks, basic links, bold, italics
  let html = md
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
  return html;
}

// Parse markdown changelog body into sections and render as grid
function ReleaseBodyGrid({ body }: { body: string }) {
  if (!body) return null;
  // Parse sections: look for '### Added', '### Changed', etc.
  const sectionOrder = ["Added", "Changed", "Fixed", "Removed"];
  const regex =
    /### (Added|Changed|Fixed|Removed)[\r\n]+([\s\S]*?)(?=(###|$))/g;
  const sections: { label: string; items: string[] }[] = [];
  let match;
  while ((match = regex.exec(body))) {
    const label = match[1];
    const content = match[2].trim();
    const items = content
      .split(/\n\s*-/)
      .map((s) => s.replace(/^-/, "").trim())
      .filter(Boolean);
    sections.push({ label, items });
  }
  // Ensure all sections are present in order
  const gridSections = sectionOrder.map(
    (label) => sections.find((s) => s.label === label) || { label, items: [] },
  );
  return (
    <div className="grid grid-cols-4 gap-2 mt-4 text-left md:grid-cols-1">
      {gridSections.map(({ label, items }) => (
        <div key={label} className="flex flex-col gap-2 glass-panel">
          <div className="mb-1 text-lg font-extrabold">{label}</div>
          {items.length === 0 ? (
            <div className="text-xs opacity-60">No entries.</div>
          ) : (
            <ul className="space-y-1 text-sm list-disc list-inside">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
