import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions as NextAuthOptions);
    if (
      !session?.user ||
      typeof (session.user as { id?: unknown }).id !== "string"
    ) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = (session.user as { id: string }).id;

    const body = await req.json();
    const { name, bio } = body as { name?: string; bio?: string };

    const data: any = {};
    if (typeof name === "string") data.name = name;
    if (typeof bio === "string") data.bio = bio;

    const updated = await prisma.user.update({ where: { id: userId }, data });

    return NextResponse.json({
      ok: true,
      user: {
        id: updated.id,
        name: updated.name,
        bio: updated.bio,
        image: updated.image,
      },
    });
  } catch (err) {
    console.error("profile update error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
