import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadBufferToBucket } from "@/lib/bucket";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
    const { dataUrl, filename } = body;
    if (!dataUrl || !filename)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    // dataUrl expected like: data:image/png;base64,....
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match)
      return NextResponse.json({ error: "Invalid dataUrl" }, { status: 400 });

    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    const key = `avatars/${userId}/${Date.now()}-${filename}`;
    const url = await uploadBufferToBucket(key, buffer, contentType);

    // update user
    await prisma.user.update({ where: { id: userId }, data: { image: url } });

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("avatar upload error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
