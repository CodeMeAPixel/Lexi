import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(
      authOptions as unknown as NextAuthOptions,
    );
    const user = session?.user as any | undefined;
    if (!user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = String(user.id);

    // Basic counts
    const [
      rephrasersCount,
      definersCount,
      activitiesCount,
      tldrCount,
      quizAttemptsCount,
      testsCreatedCount,
      publicRephrasersCount,
      publicDefinersCount,
    ] = await Promise.all([
      prisma.rephraser.count({ where: { userId } }),
      prisma.definer.count({ where: { authorId: userId } }),
      prisma.userActivity.count({ where: { userId } }),
      // user's TLDR summaries
      prisma.tldr.count({ where: { userId } }).catch(() => 0),
      prisma.quizAttempt.count({ where: { userId } }),
      prisma.test.count({ where: { authorId: userId } }),
      prisma.rephraser.count({ where: { isPublic: true } }),
      prisma.definer.count({ where: { isPublic: true } }),
    ]);

    const totalPublicResults = publicRephrasersCount + publicDefinersCount;
    const publicTldrsCount = await prisma.tldr.count().catch(() => 0);
    const totalPublicResultsWithTldr = totalPublicResults + publicTldrsCount;

    // Recent activity (latest 8)
    const recentActivities = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        tool: true,
        action: true,
        summary: true,
        payload: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      stats: {
        rephrasersCount,
        definersCount,
        tldrCount,
        activitiesCount,
        quizAttemptsCount,
        testsCreatedCount,
        totalPublicResults: totalPublicResultsWithTldr,
      },
      recentActivities,
    });
  } catch (err) {
    console.error("stats.user error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
