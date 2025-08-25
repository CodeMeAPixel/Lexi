import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminMainPage() {
  return (
    <main className="flex-1 py-8 panel-wide">
      <section className="p-6 mx-auto max-w-8xl glass-panel">
        <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/users"
            className="flex flex-col gap-2 p-6 transition rounded-xl glass-panel hover:shadow-lg"
          >
            <span className="text-lg font-semibold">User Manager</span>
            <span className="text-sm text-white/70">
              View, edit, and manage users and roles.
            </span>
          </Link>
          <Link
            href="/admin/activities"
            className="flex flex-col gap-2 p-6 transition rounded-xl glass-panel hover:shadow-lg"
          >
            <span className="text-lg font-semibold">
              Audit Log / Activities
            </span>
            <span className="text-sm text-white/70">
              Review all user and system activities.
            </span>
          </Link>
          {/* Add more admin panels here as needed */}
        </div>
      </section>
    </main>
  );
}
