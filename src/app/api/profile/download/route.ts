import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      typeof (session.user as { id?: unknown }).id !== "string"
    ) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activities: true,
        rephrasers: true,
        definers: true,
        quizAttempts: true,
        testsCreated: true,
        quizzesCreated: true,
        Spellcheck: true,
        tldrs: true,
      },
    });
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return new Response(JSON.stringify(user, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=lexi-user-data.json`,
      },
    });
  } catch (err) {
    console.error("download user data error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
