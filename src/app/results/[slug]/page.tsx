import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Results",
  description: "View public tool usage results!",
};

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch the normalized resource from our API route
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/results/${encodeURIComponent(slug)}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    if (res.status === 404) notFound();
    throw new Error("Failed to fetch result");
  }

  const payload = await res.json();
  const { type, item, user } = payload;

  let content: React.ReactNode = null;
  switch (type) {
    case "rephraser":
      content = <RephraserView item={item} user={user} />;
      break;
    case "definer":
      content = <DefinerView item={item} user={user} />;
      break;
    case "tldr":
      content = <TldrView item={item} user={user} />;
      break;
    case "quizAttempt":
      content = <QuizAttemptView item={item} user={user} />;
      break;
    case "test":
      content = <TestView item={item} user={user} />;
      break;
    default:
      content = (
        <div className="p-6 rounded glass-panel">
          <h2 className="text-lg font-medium">Unknown Result</h2>
          <p className="mt-2 text-sm text-white/70">
            This result type is not supported.
          </p>
        </div>
      );
  }

  return (
    <main className="w-full px-6 py-12 mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 mt-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 overflow-hidden rounded-full bg-white/5">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || user.username}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs">
                      {(user.name || user.username || "").slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="text-sm">
                  <div className="text-white/60">Shared by</div>
                  <div className="font-medium">
                    {user.name || user.username}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-white/60">Shared publicly</div>
            )}

            {item?.slug ? (
              <div className="ml-auto text-sm">
                <div className="text-white/60">Result ID</div>
                <div className="mt-1 text-sm">
                  <a
                    className="underline"
                    href={`${process.env.NEXT_PUBLIC_APP_URL || ""}/results/${item.slug}`}
                  >
                    {item.slug}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Primary content */}
      <section className="mb-6">{content}</section>

      {/* Secondary panels */}
      <section className="gap-4">
        <div className="p-6 text-left rounded glass-panel">
          <h4 className="mb-2 text-2xl font-medium">Additional Details</h4>
          <div className="text-sm text-white/70 glass-panel">
            <div>
              Type: <span className="font-medium">{type}</span>
            </div>
            {item?.createdAt && (
              <div className="mt-1">
                Created:{" "}
                <span className="font-medium">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            )}
            {item?.isPublic !== undefined && (
              <div className="mt-1">
                Public:{" "}
                <span className="font-medium">
                  {item.isPublic ? "Yes" : "No"}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function RephraserView({ item, user }: any) {
  return (
    <div className="p-6 text-left rounded glass-panel">
      <h1 className="mb-6 text-2xl font-extrabold sm:text-4xl">
        Rephraser results
      </h1>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="text-sm font-medium text-white/80">Original</h3>
          <div className="mt-2 text-sm whitespace-pre-wrap text-white/70">
            {item.originalText}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-white/80">Rewritten</h3>
          <div className="mt-2 text-sm whitespace-pre-wrap text-white/90">
            {item.rewrittenText}
          </div>
        </div>
      </div>
    </div>
  );
}

function DefinerView({ item }: any) {
  return (
    <div className="p-6 text-left rounded glass-panel">
      <h1 className="mb-6 text-2xl font-extrabold sm:text-4xl">
        Define: {item.term}
      </h1>
      <div className="text-sm prose text-white/70">
        <p>{item.definition}</p>
      </div>
    </div>
  );
}

function TldrView({ item, user }: any) {
  // item.messages is stored as JSON — render as a conversation history if present
  const messages: Array<{ role?: string; content?: string }> =
    item.messages || [];

  return (
    <div className="p-6 text-left rounded glass-panel">
      <h1 className="mb-6 text-2xl font-extrabold sm:text-4xl">
        TL;DR Summary
      </h1>

      <div className="mb-4 text-sm text-white/70">
        <div className="mb-2 font-medium">Summary</div>
        <div className="whitespace-pre-wrap text-white/90">{item.summary}</div>
      </div>

      {messages.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-medium text-white/80">
            Source Messages
          </h3>
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="p-3 rounded bg-white/3">
                <div className="text-xs text-white/60">
                  {(m.role || "user").toUpperCase()}
                </div>
                <div className="mt-1 text-sm whitespace-pre-wrap">
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizAttemptView({ item }: any) {
  return (
    <div className="p-6 text-left rounded glass-panel">
      <h1 className="mb-6 text-2xl font-extrabold sm:text-4xl">Quiz Attempt</h1>
      <div className="text-sm">Quiz: {item.quiz?.title}</div>
      <div className="mt-3 text-sm">
        Score: {item.score}/{item.maxScore} —{" "}
        {item.passed ? "Passed" : "Failed"}
      </div>
    </div>
  );
}

function TestView({ item }: any) {
  return (
    <div className="p-6 text-left rounded glass-panel">
      <h1 className="mb-6 text-2xl font-extrabold sm:text-4xl">Test</h1>
      <div className="text-sm">{item.description}</div>
    </div>
  );
}
