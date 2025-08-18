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

    // naive issues count
    const issuesCount = Math.max(
      0,
      originalText.split(/\s+/).length - correctedText.split(/\s+/).length,
    );

    const created = await prisma.spellcheck.create({
      data: {
        userId: userId ?? undefined,
        originalText,
        correctedText,
        issuesCount,
        isPublic: !!isPublic,
        publicShareId,
        slug: slugToUse,
      },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("spellcheck.store", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
