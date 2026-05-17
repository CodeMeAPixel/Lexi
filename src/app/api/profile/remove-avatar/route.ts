import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      typeof (session.user as { id?: unknown }).id !== "string"
    ) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;
    await prisma.user.update({ where: { id: userId }, data: { image: null } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("avatar remove error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
