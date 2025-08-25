"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CustomToast from "@/components/core/CustomToast";

export default function AdminUserActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function updateRole(role: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success(`User ${role === "ADMIN" ? "promoted" : "demoted"}!`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser() {
    toast.custom((t) => (
      <CustomToast
        toast={{
          ...t,
          type: "error",
          message: (
            <span className="text-sm">
              Delete user? This is <b>irreversible</b>.
            </span>
          ),
          duration: 8000,
          action: [
            <button
              key="confirm"
              className="px-3 py-1 text-sm font-medium rounded"
              style={{ background: "#dc2626", color: "#fff" }}
              onClick={async () => {
                toast.dismiss(t.id);
                setLoading(true);
                try {
                  const res = await fetch(`/api/admin/users?id=${userId}`, {
                    method: "DELETE",
                  });
                  if (!res.ok) throw new Error("failed");
                  toast.success("User deleted!");
                  router.refresh();
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete user");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              Confirm
            </button>,
            <button
              key="cancel"
              className="px-3 py-1 text-sm font-medium rounded"
              style={{ background: "#e5e7eb", color: "#374151" }}
              onClick={() => toast.dismiss(t.id)}
              disabled={loading}
            >
              Cancel
            </button>,
          ],
        }}
      />
    ));
  }

  return (
    <div className="flex flex-row w-full gap-2 sm:flex-row sm:items-center sm:gap-2">
      {currentRole !== "ADMIN" ? (
        <button
          type="button"
          onClick={() => updateRole("ADMIN")}
          disabled={loading}
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white border rounded-md shadow-sm bg-gradient-to-br from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 border-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          Promote
        </button>
      ) : (
        <button
          type="button"
          onClick={() => updateRole("USER")}
          disabled={loading}
          className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-black border rounded-md shadow-sm bg-gradient-to-br from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 disabled:opacity-50 border-amber-300/20 focus:outline-none focus:ring-2 focus:ring-amber-300/30"
        >
          Demote
        </button>
      )}

      <button
        type="button"
        onClick={deleteUser}
        disabled={loading}
        className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-white border rounded-md shadow-sm bg-gradient-to-br from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 border-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-400/30"
      >
        Delete
      </button>
    </div>
  );
}
