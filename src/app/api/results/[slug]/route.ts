import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;

    // Try to find by slug on Rephraser or Definer (include small user info)
    const r = await prisma.rephraser.findFirst({
      where: { slug },
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });
    if (r)
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
    if (d)
      return NextResponse.json({
        type: "definer",
        item: d,
        user: d.author ?? null,
      });

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

    // fallback: try as share id for rephraser/definer
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

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (err) {
    console.error("api.results", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
