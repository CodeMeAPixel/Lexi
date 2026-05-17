import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import type { NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(
    authOptions as unknown as NextAuthOptions,
  );
  if (
    !session?.user ||
    typeof (session.user as { id?: unknown }).id !== "string" ||
    (session.user as { role?: string }).role !== "ADMIN"
  ) {
    return null;
  }
  return session;
}

export async function GET(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error("admin.users.list", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { id, role } = body as any;
    if (!id || !role)
      return NextResponse.json(
        { error: "id and role required" },
        { status: 400 },
      );
    if (!["ADMIN", "USER"].includes(role))
      return NextResponse.json({ error: "invalid role" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id },
      data: { role } as any,
      select: { id: true, role: true },
    });
    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    console.error("admin.users.update", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await requireAdmin();
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "id required" }, { status: 400 });

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin.users.delete", err);
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
