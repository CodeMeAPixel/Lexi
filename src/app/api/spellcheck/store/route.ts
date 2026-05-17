import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function shortId() {
  try {
    return crypto.randomUUID().slice(0, 8);
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as NextAuthOptions);
    const body = await req.json();

    const { originalText, correctedText, isPublic = false, slug } = body;
    if (!originalText || !correctedText) {
      return NextResponse.json(
        { error: "originalText and correctedText are required" },
        { status: 400 },
      );
    }

    const userId =
      session && typeof (session.user as { id?: unknown }).id === "string"
        ? (session.user as { id: string }).id
        : null;
    const publicShareId = `s_${shortId()}`;
    const slugToUse = slug || `s-${shortId()}`;

    // naive issues count and words fixed
    const origWords = originalText.split(/\s+/);
    const corrWords = correctedText.split(/\s+/);
    let issuesCount = 0;
    let wordsFixed = 0;
    // Compare word by word for changes
    for (let i = 0; i < Math.min(origWords.length, corrWords.length); i++) {
      if (origWords[i] !== corrWords[i]) {
        issuesCount++;
        wordsFixed++;
      }
    }
    // Add any extra words removed/added
    issuesCount += Math.abs(origWords.length - corrWords.length);

    const created = await prisma.spellcheck.create({
      data: {
        user: userId ? { connect: { id: userId } } : undefined,
        originalText,
        correctedText,
        issuesCount,
        wordsFixed,
        isPublic: !!isPublic,
        publicShareId,
        slug: slugToUse,
      },
    });
    try {
      if (userId) {
        await prisma.userActivity.create({
          data: {
            userId,
            tool: "SPELLCHECK",
            action: "COMPLETED",
            summary: correctedText.slice(0, 200),
            payload: JSON.stringify({ issuesCount, wordsFixed }) as any,
            relatedId: created.id,
          },
        });
      }
    } catch (err) {
      console.error("spellcheck.store activity save failed", err);
    }

    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("spellcheck.store", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
