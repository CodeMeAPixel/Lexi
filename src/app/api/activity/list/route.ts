import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function makeUrl(slug?: string | null, shareId?: string | null) {
  if (slug) return `/results/${slug}`;
  if (shareId) return `/results?shareId=${shareId}`;
  return null;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      typeof (session.user as { id?: unknown }).id !== "string"
    ) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const pageSize = Math.min(
      100,
      Math.max(5, Number(url.searchParams.get("pageSize") || "20")),
    );

    const [total, activities] = await Promise.all([
      prisma.userActivity.count({ where: { userId } }),
      prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    // Collect related IDs by tool. Support activities that set relatedId OR include an id/resultId in payload.
    const idsByTool: Record<string, string[]> = {
      REPHRASER: [],
      DEFINER: [],
      SPELLCHECK: [],
      TLDR: [],
    };
    for (const act of activities) {
      const payload = (act.payload as any) || {};
      const raw = act.relatedId ?? payload.id ?? payload.resultId ?? null;
      if (!raw) continue;
      const id = String(raw);
      if (!idsByTool[act.tool]) idsByTool[act.tool] = [];
      idsByTool[act.tool].push(id);
    }

    // Batch fetch referenced models
    const [rephrasers, definers, spellchecks, tldrs] = await Promise.all([
      idsByTool.REPHRASER.length
        ? prisma.rephraser.findMany({
            where: { id: { in: idsByTool.REPHRASER } },
            select: {
              id: true,
              slug: true,
              publicShareId: true,
              isPublic: true,
              userId: true,
              createdAt: true,
            },
          })
        : [],
      idsByTool.DEFINER.length
        ? prisma.definer.findMany({
            where: { id: { in: idsByTool.DEFINER } },
            select: {
              id: true,
              slug: true,
              publicShareId: true,
              isPublic: true,
              authorId: true,
              createdAt: true,
            },
          })
        : [],
      idsByTool.SPELLCHECK.length
        ? prisma.spellcheck.findMany({
            where: { id: { in: idsByTool.SPELLCHECK } },
            select: {
              id: true,
              slug: true,
              publicShareId: true,
              isPublic: true,
              userId: true,
              createdAt: true,
            },
          })
        : [],
      idsByTool.TLDR.length
        ? prisma.tldr.findMany({
            where: { id: { in: idsByTool.TLDR } },
            select: {
              id: true,
              slug: true,
              publicShareId: true,
              isPublic: true,
              userId: true,
              createdAt: true,
            },
          })
        : [],
    ]);

    const lookup = {
      REPHRASER: new Map(rephrasers.map((r: any) => [String(r.id), r])),
      DEFINER: new Map(definers.map((d: any) => [String(d.id), d])),
      SPELLCHECK: new Map(spellchecks.map((s: any) => [String(s.id), s])),
      TLDR: new Map(tldrs.map((t: any) => [String(t.id), t])),
    };

    const items = activities.map((act) => {
      let slug: string | null = null;
      let publicShareId: string | null = null;
      let viewUrl: string | null = null;

      const payload = (act.payload as any) || {};
      const raw = act.relatedId ?? payload.id ?? payload.resultId ?? null;
      const lookupId = raw ? String(raw) : null;

      let resource: any = null;
      if (lookupId) {
        resource =
          lookup[act.tool as keyof typeof lookup]?.get(lookupId) ?? null;
      }

      // Fallback: if we couldn't find by id, try to find a recent resource by the same user (within 60s)
      if (!resource) {
        const when = new Date(act.createdAt).getTime();
        const windowMs = 60_000; // 60 seconds
        if (act.tool === "REPHRASER") {
          resource =
            rephrasers.find(
              (r: any) =>
                String(r.userId) === String(userId) &&
                Math.abs(new Date(r.createdAt).getTime() - when) <= windowMs,
            ) ?? null;
        } else if (act.tool === "DEFINER") {
          resource =
            definers.find(
              (d: any) =>
                String(d.authorId) === String(userId) &&
                Math.abs(new Date(d.createdAt).getTime() - when) <= windowMs,
            ) ?? null;
        } else if (act.tool === "SPELLCHECK") {
          resource =
            spellchecks.find(
              (s: any) =>
                String(s.userId) === String(userId) &&
                Math.abs(new Date(s.createdAt).getTime() - when) <= windowMs,
            ) ?? null;
        } else if (act.tool === "TLDR") {
          resource =
            tldrs.find(
              (t: any) =>
                String(t.userId) === String(userId) &&
                Math.abs(new Date(t.createdAt).getTime() - when) <= windowMs,
            ) ?? null;
        }
      }

      if (resource) {
        slug = resource.slug ?? null;
        publicShareId = resource.publicShareId ?? null;

        const ownerId = (resource as any).userId ?? (resource as any).authorId;
        if (resource.isPublic || ownerId === userId) {
          viewUrl = makeUrl(slug, publicShareId);
        }
      }

      return {
        id: act.id,
        tool: act.tool,
        action: act.action,
        summary: act.summary,
        createdAt: act.createdAt,
        viewUrl,
        slug,
        publicShareId,
      };
    });

    return NextResponse.json({ ok: true, total, page, pageSize, items });
  } catch (err) {
    console.error("activity.list error", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
