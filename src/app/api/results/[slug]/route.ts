import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    // identify requester (may be undefined)
    const session = await getServerSession(
      authOptions as unknown as NextAuthOptions,
    );
    const user = session?.user as any | undefined;
    const userId = user?.id as string | undefined;

    // Try to find by slug on Rephraser, Definer, or Spellchecker (include small user info)
    const r = await prisma.rephraser.findFirst({
      where: { slug },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });
    if (r && (r.isPublic || (userId && r.userId === userId)))
      return NextResponse.json({
        type: "rephraser",
        item: r,
        user: r.user ?? null,
      });

    const d = await prisma.definer.findFirst({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });
    if (d && (d.isPublic || (userId && d.authorId === userId)))
      return NextResponse.json({
        type: "definer",
        item: d,
        user: d.author ?? null,
      });

    // Spellchecker by slug
    try {
      const s = await prisma.spellcheck.findFirst({
        where: { slug },
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      });
      if (s && (s.isPublic || (userId && s.userId === userId))) {
        return NextResponse.json({
          type: "spellchecker",
          item: s,
          user: s.user ?? null,
        });
      }
    } catch (_e) {
      // ignore if spellchecker table missing
    }

    // Try QuizAttempt via publicShareId (include user + quiz/test)
    const qa = await prisma.quizAttempt.findFirst({
      where: { publicShareId: slug },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
        quiz: { include: { test: true } },
      },
    });
    if (qa)
      return NextResponse.json({
        type: "quizAttempt",
        item: qa,
        user: qa.user ?? null,
      });

    const t = await prisma.test.findFirst({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });
    if (t)
      return NextResponse.json({
        type: "test",
        item: t,
        user: t.author ?? null,
      });

    // fallback: try as share id for rephraser/definer/spellchecker
    const rr = await prisma.rephraser.findFirst({
      where: { publicShareId: slug },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });
    if (rr)
      return NextResponse.json({
        type: "rephraser",
        item: rr,
        user: rr.user ?? null,
      });

    const dd = await prisma.definer.findFirst({
      where: { publicShareId: slug },
      include: {
        author: {
          select: { id: true, name: true, username: true, image: true },
        },
      },
    });
    if (dd)
      return NextResponse.json({
        type: "definer",
        item: dd,
        user: dd.author ?? null,
      });

    try {
      const ss = await prisma.spellcheck.findFirst({
        where: { publicShareId: slug },
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      });
      if (ss) {
        return NextResponse.json({
          type: "spellchecker",
          item: ss,
          user: ss.user ?? null,
        });
      }
    } catch (_e) {
      // ignore if spellchecker table missing
    }

    // Tldr by slug
    try {
      const tl = await prisma.tldr.findFirst({
        where: { slug },
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      });
      if (tl && (tl.isPublic || (userId && tl.userId === userId)))
        return NextResponse.json({
          type: "tldr",
          item: tl,
          user: tl.user ?? null,
        });
    } catch (_e) {
      // ignore if tldr table missing
    }

    // Tldr by publicShareId
    try {
      const tl2 = await prisma.tldr.findFirst({
        where: { publicShareId: slug },
        include: {
          user: {
            select: { id: true, name: true, username: true, image: true },
          },
        },
      });
      if (tl2)
        return NextResponse.json({
          type: "tldr",
          item: tl2,
          user: tl2.user ?? null,
        });
    } catch (_e) {
      // ignore if tldr table missing
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("api.results", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
