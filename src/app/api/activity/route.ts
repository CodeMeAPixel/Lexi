import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ActivityItem = {
  id: string;
  type: "rephrase" | "quiz_attempt" | "test";
  title: string;
  summary?: string | null;
  createdAt: string;
  meta?: Record<string, unknown> | null;
};

export async function GET() {
  try {
    const session = await getServerSession(
      authOptions as unknown as NextAuthOptions,
    );

    type SessionUserWithId = {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };

    const user = session?.user as SessionUserWithId | undefined;
    if (!user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = user.id as string;

    // Fetch recent user activities (latest 10)
    const activities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        tool: true,
        action: true,
        summary: true,
        payload: true,
        relatedId: true,
        createdAt: true,
      },
    });

    // Fetch recent quiz attempts (latest 4)
    const attempts = await prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { completedAt: "desc" },
      take: 4,
      select: {
        id: true,
        quiz: {
          select: {
            title: true,
            test: {
              select: {
                title: true,
              },
            },
          },
        },
        score: true,
        maxScore: true,
        passed: true,
        startedAt: true,
        completedAt: true,
      },
    });

    // Fetch recent tests created by user (latest 4)
    const tests = await prisma.test.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, title: true, description: true, createdAt: true },
    });

    const items: ActivityItem[] = [];

    for (const act of activities) {
      const tool = act.tool;
      const itemType: ActivityItem["type"] =
        tool === "REPHRASER"
          ? "rephrase"
          : tool === "TEST"
            ? "test"
            : "quiz_attempt";

      // Normalize payload: if it's a JSON string, try to parse it for better display
      let payloadDisplay: string | null = null;
      let parsedPayload: unknown = null;
      try {
        if (typeof act.payload === "string") {
          parsedPayload = JSON.parse(act.payload);
        } else if (act.payload) {
          parsedPayload = act.payload;
        }
      } catch (_err) {
        // if parse fails, fall back to raw string
        payloadDisplay = String(act.payload);
      }

      if (parsedPayload && typeof parsedPayload === "object") {
        const pp = parsedPayload as Record<string, unknown>;
        // Prefer commonly available fields
        if (pp.rewritten && typeof pp.rewritten === "string")
          payloadDisplay = pp.rewritten.slice(0, 200);
        else if (pp.definition && typeof pp.definition === "string")
          payloadDisplay = pp.definition.slice(0, 200);
        else payloadDisplay = JSON.stringify(pp).slice(0, 200);
      }

      // determine a safe title string
      let computedTitle: string = itemType;
      if (act.summary) {
        computedTitle = act.summary.slice(0, 80);
      } else if (parsedPayload && typeof parsedPayload === "object") {
        const pp = parsedPayload as Record<string, unknown>;
        if (typeof pp.title === "string" && pp.title.trim().length > 0)
          computedTitle = pp.title.slice(0, 80);
        else if (
          typeof pp.original === "string" &&
          pp.original.trim().length > 0
        )
          computedTitle = pp.original.slice(0, 80);
      }

      items.push({
        id: act.id,
        type: itemType,
        title: computedTitle,
        summary: act.summary ?? payloadDisplay,
        createdAt: act.createdAt.toISOString(),
        meta: { tool: act.tool, action: act.action, relatedId: act.relatedId },
      });
    }

    for (const a of attempts) {
      const quizTitle = a.quiz?.title ?? a.quiz?.test?.title ?? "Quiz Attempt";
      items.push({
        id: a.id,
        type: "quiz_attempt",
        title: quizTitle,
        summary: `Score: ${a.score}/${a.maxScore} — ${a.passed ? "Passed" : "Failed"}`,
        createdAt: (a.completedAt ?? a.startedAt).toISOString(),
        meta: { passed: a.passed, score: a.score, maxScore: a.maxScore },
      });
    }

    for (const t of tests) {
      items.push({
        id: t.id,
        type: "test",
        title: t.title,
        summary: t.description ?? null,
        createdAt: t.createdAt.toISOString(),
        meta: null,
      });
    }

    // Sort by createdAt desc and cap to 10 items
    items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return NextResponse.json({
      items: items.slice(0, 10),
    });
  } catch (err) {
    console.error("activity API error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
