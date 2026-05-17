import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const shareId = url.searchParams.get("shareId");

    if (!slug && !shareId) {
      return NextResponse.json(
        { error: "slug or shareId required" },
        { status: 400 },
      );
    }

    const where = slug ? { slug } : { publicShareId: shareId };
    const item = await prisma.definer.findFirst({ where });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ item });
  } catch (err) {
    console.error("definer.public", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
