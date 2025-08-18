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
    const session = (await getServerSession(
      authOptions as NextAuthOptions,
    )) as unknown as { user?: { id?: string } } | null;
    const body = await req.json();

    const { term, definition, isPublic = false, slug } = body;
    if (!term || !definition)
      return NextResponse.json(
        { error: "term and definition required" },
        { status: 400 },
      );

    const userId = session?.user?.id ?? null;
    const publicShareId = `d_${shortId()}`;
    const slugToUse = slug || `d-${shortId()}`;

    const created = await prisma.definer.create({
      data: {
        term,
        definition,
        authorId: userId ?? undefined,
        isPublic: !!isPublic,
        publicShareId,
        slug: slugToUse,
      },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (err) {
    console.error("definer.store", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
