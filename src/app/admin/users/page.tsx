import React from "react";
import { prisma } from "@/lib/prisma";
import AdminUserActions from "../components/AdminUserActions";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      image: true,
    },
  });

  return (
    <main className="flex-1 py-8 panel-wide">
      <section className="p-6 mx-auto max-w-8xl glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Manager</h1>
          <a href="/admin" className="btn-secondary">
            Back
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-3">
          {users.map((u) => (
            <div
              key={u.id}
              className="p-4 border rounded-xl glass-panel border-white/6"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {u.image ? (
                    <div className="w-12 h-12 overflow-hidden rounded-full bg-neutral-800">
                      <Image
                        src={u.image}
                        alt={u.name || u.email || "User avatar"}
                        width={48}
                        height={48}
                        className="object-cover w-12 h-12"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 font-semibold text-white rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                      {(
                        (u.name || u.email || "U").charAt(0) || "U"
                      ).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold truncate">
                      {u.name || "—"}
                    </div>
                    <div className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/80">
                      {u.role}
                    </div>
                  </div>
                  <div className="text-sm truncate text-white/70">
                    {u.email || "—"}
                  </div>
                  <div className="mt-1 text-xs truncate text-white/60">
                    Created: {new Date(u.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-3 sm:flex sm:items-center sm:justify-end">
                <div className="w-full sm:w-auto">
                  <AdminUserActions userId={u.id} currentRole={u.role} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
