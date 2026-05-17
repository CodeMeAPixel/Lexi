"use client";

import React from "react";
import toast from "react-hot-toast";

export default function SharerInfoClient({
  user,
  slug,
}: {
  user?: any;
  slug?: string;
}) {
  const publicUrl = slug
    ? `${process.env.NEXT_PUBLIC_APP_URL || ""}/results/${slug}`
    : null;

  const copy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      toast.success("Copied URL");
    } catch (err) {
      console.error(err);
      toast.error("Unable to copy");
    }
  };

  return (
    <div className="flex items-center gap-4 mt-3">
      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-white/10">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || user.username}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs">
                {(user.name || user.username || "U")[0]}
              </span>
            )}
          </div>
          <div className="text-sm">
            <div className="font-medium">{user.name || user.username}</div>
            <div className="text-white/60">Shared by</div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-white/60">Shared publicly</div>
      )}

      {publicUrl && (
        <div className="ml-auto text-sm">
          <div className="text-white/60">Public URL</div>
          <div className="flex items-center gap-2 mt-1">
            <a className="underline" href={publicUrl}>
              {publicUrl}
            </a>
            <button
              onClick={copy}
              className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
