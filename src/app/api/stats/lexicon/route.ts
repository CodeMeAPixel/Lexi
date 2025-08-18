import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public site-wide "Lexicon" stats: counts and top terms
export async function GET() {
  try {
    // Total counts (expanded)
    const [
      totalRephrasers,
      totalDefiners,
      totalUsers,
      totalSpellchecks,
      totalTests,
      totalQuizzes,
      totalQuizAttempts,
      totalActivities,
    ] = await Promise.all([
      prisma.rephraser.count(),
      prisma.definer.count(),
      prisma.user.count(),
      prisma.spellcheck.count(),
      prisma.test.count(),
      prisma.quiz.count(),
      prisma.quizAttempt.count(),
      prisma.userActivity.count(),
    ]);

    // Top public definers (most recent public definitions, capped)
    const topPublicDefiners = await prisma.definer.findMany({
      where: { isPublic: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        term: true,
        slug: true,
        publicShareId: true,
        createdAt: true,
      },
    });

    // Popular terms by occurrence (simple aggregation using grouping)
    // Prisma does not support GROUP BY with arbitrary fields across databases in the same way as SQL,
    // so we'll approximate popularity by counting identical terms in Definer table.
    const popularTermsRaw = await prisma.$queryRaw`
            SELECT term, count(*) as count
            FROM "Definer"
            WHERE "isPublic" = true
            GROUP BY term
            ORDER BY count DESC
            LIMIT 10
        `;

    const popularTerms = Array.isArray(popularTermsRaw)
      ? popularTermsRaw.map((r: any) => ({
          term: r.term,
          count: Number(r.count),
        }))
      : [];

    return NextResponse.json({
      ok: true,
      totals: {
        totalRephrasers,
        totalDefiners,
        totalUsers,
        totalSpellchecks,
        totalTests,
        totalQuizzes,
        totalQuizAttempts,
        totalActivities,
      },
      topPublicDefiners,
      popularTerms,
    });
  } catch (err) {
    console.error("stats.lexicon error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
