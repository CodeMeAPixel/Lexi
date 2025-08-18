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

    const {
      originalText,
      rewrittenText,
      tone,
      length,
      preservedEntities = false,
      preservedPunctuation = false,
      extraInstructions,
      isPublic = false,
      slug,
    } = body;

    if (!originalText || !rewrittenText) {
      return NextResponse.json(
        { error: "originalText and rewrittenText are required" },
        { status: 400 },
      );
    }

    const userId =
      session && typeof (session.user as { id?: unknown }).id === "string"
        ? (session.user as { id: string }).id
        : null;

    // create publicShareId and optionally slug
    const publicShareId = `r_${shortId()}`;
    const slugToUse = slug || `r-${shortId()}`;
    // Normalize incoming tone/length (map human strings like "Casual" or "short" -> enum keys)
    const VALID_TONES = ["CASUAL", "FORMAL", "INFORMAL", "CREATIVE"];
    const VALID_LENGTHS = ["SHORT", "MEDIUM", "LONG", "ORIGINAL"];

    const mapTone = (t: any) => {
      if (!t) return undefined;
      const up = String(t).toUpperCase();
      return VALID_TONES.includes(up) ? up : undefined;
    };

    const mapLength = (l: any) => {
      if (!l) return undefined;
      const up = String(l).toUpperCase();
      return VALID_LENGTHS.includes(up) ? up : undefined;
    };

    const created = await prisma.rephraser.create({
      data: {
        userId: userId ?? undefined,
        originalText,
        rewrittenText,
        tone: mapTone(tone) as any,
        length: mapLength(length) as any,
        preservedEntities: !!preservedEntities,
        preservedPunctuation: !!preservedPunctuation,
        extraInstructions: extraInstructions ?? undefined,
        isPublic: !!isPublic,
        publicShareId,
        slug: slugToUse,
      },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("rephraser.store", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
