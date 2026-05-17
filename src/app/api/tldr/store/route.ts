import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function shortId() {
  return Math.random().toString(36).slice(2, 9);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, summary, isPublic } = body as any;
    if (!summary || typeof summary !== "string")
      return NextResponse.json({ error: "summary required" }, { status: 400 });

    // optional: store user if authenticated
    const session = await getServerSession(authOptions as NextAuthOptions);
    let userId: string | null = null;
    if (session && typeof (session.user as { id?: unknown }).id === "string") {
      userId = (session.user as { id: string }).id;
    }

    // Save to Tldr model (create migration for this model). We assume the
    // Prisma model Tldr mirrors Spellcheck (original messages stored as JSON).
    // Ensure messages are JSON-serializable (avoid storing "[object Object],[object Object]")
    const safeMessages = messages
      ? JSON.parse(JSON.stringify(messages))
      : undefined;

    const created = await prisma.tldr.create({
      data: {
        userId: userId ?? undefined,
        messages: safeMessages ?? undefined,
        summary,
        isPublic: !!isPublic,
        publicShareId: isPublic ? shortId() : undefined,
        slug: isPublic ? `tldr-${shortId()}` : undefined,
      },
    });

    // Record activity
    try {
      if (userId) {
        await prisma.userActivity.create({
          data: {
            userId,
            tool: "TLDR",
            action: "COMPLETED",
            summary: summary.slice(0, 200),
            // no need to include type in payload now that ActivityTool has TLDR
            payload: JSON.stringify({
              isPublic: !!isPublic,
              summary: summary.slice(0, 200),
            }) as any,
            relatedId: created.id,
          },
        });
      }
    } catch (err) {
      console.error("tldr.store activity save failed", err);
    }

    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("tldr.store", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
