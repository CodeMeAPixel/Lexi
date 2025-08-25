import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/admin/activities?userId=&tool=&action=&page=&pageSize=
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    !session.user ||
    (session.user as { role?: string }).role !== "ADMIN"
  ) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || undefined;
  const tool = searchParams.get("tool") || undefined;
  const action = searchParams.get("action") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

  const where: any = {};
  if (userId) where.userId = userId;
  if (tool) where.tool = tool;
  if (action) where.action = action;

  const [items, total] = await Promise.all([
    prisma.userActivity.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.userActivity.count({ where }),
  ]);

  return Response.json({ items, total, page, pageSize });
}
