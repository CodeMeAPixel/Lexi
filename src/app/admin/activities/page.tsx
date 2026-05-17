import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = searchParams ? await searchParams : {};
  const page = parseInt(
    Array.isArray(params.page) ? params.page[0] : params.page || "1",
    10,
  );
  const pageSize = parseInt(
    Array.isArray(params.pageSize)
      ? params.pageSize[0]
      : params.pageSize || "20",
    10,
  );
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  const tool = Array.isArray(params.tool) ? params.tool[0] : params.tool;
  const action = Array.isArray(params.action)
    ? params.action[0]
    : params.action;

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
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="w-full max-w-6xl mx-auto">
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Audit Log / Activities</h1>
          <Link href="/admin" className="btn-secondary">
            Back
          </Link>
        </div>
        <div className="mb-4 text-sm text-white/45">Filters and search coming soon.</div>
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/20">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/60">User</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/60">Tool</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/60">Action</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/60">Summary</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white/60">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-white/50"
                  >
                    No activities found.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id} className="border-b border-white/5 align-top">
                    <td className="px-3 py-2">
                      {a.user?.name || a.user?.email || a.userId}
                    </td>
                    <td className="px-3 py-2">{a.tool}</td>
                    <td className="px-3 py-2">{a.action}</td>
                    <td className="px-3 py-2 max-w-[320px] truncate text-white/70">
                      {a.summary || "—"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-white/50">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-white/60">
            Page {page} / {pages}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`?page=${Math.max(1, page - 1)}&pageSize=${pageSize}`}
              className="px-3 py-1 rounded btn-secondary"
              aria-disabled={page <= 1}
            >
              Prev
            </Link>
            <Link
              href={`?page=${Math.min(pages, page + 1)}&pageSize=${pageSize}`}
              className="px-3 py-1 rounded btn-secondary"
              aria-disabled={page >= pages}
            >
              Next
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
