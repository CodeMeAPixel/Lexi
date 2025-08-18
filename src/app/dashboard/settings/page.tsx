"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await fetch(`/api/me`);
        if (!res.ok) throw new Error("Unauthorized");
        const body = await res.json();
        if (!mounted) return;
        setUser(body.user ?? null);
        setName(body.user?.name ?? "");
        setBio(body.user?.bio ?? "");
        setAvatarPreview(body.user?.image ?? null);
      } catch (err) {
        console.warn("Unable to fetch user", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setAvatarFile(f);
    if (!f) return setAvatarPreview(user?.image ?? null);

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  async function handleUploadAvatar() {
    if (!avatarFile) return toast.error("Select an image first");
    setSubmitting(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.onerror = rej;
        r.readAsDataURL(avatarFile);
      });

      const filename = avatarFile.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const resp = await fetch(`/api/profile/avatar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, filename }),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Upload failed");
      setUser((u: any) => ({ ...u, image: body.url }));
      setAvatarPreview(body.url);
      setAvatarFile(null);
      toast.success("Avatar updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveProfile(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitting(true);
    try {
      const resp = await fetch(`/api/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Save failed");
      setUser((u: any) => ({ ...u, name: body.user.name, bio: body.user.bio }));
      toast.success("Profile updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex-1 py-8 panel-wide">
        <section className="p-12 glass-panel">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="mt-4 text-neutral-400">Loading...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 panel-wide">
      <section className="p-6 mx-auto max-w-8xl glass-panel">
        <header className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <Link href="/dashboard" className="btn-secondary">
            Back
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px,1fr] md:flex md:flex-col items-center justify-center">
          <aside className="col-span-1">
            <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-neutral-900/40">
              <div className="overflow-hidden border rounded-full w-36 h-36 bg-gradient-to-br from-purple-700/30 to-indigo-700/20 border-neutral-800">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name ?? "avatar"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-3xl text-neutral-400">
                    {(user?.name || user?.email || "U")[0]}
                  </div>
                )}
              </div>

              <div className="w-full">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 btn-secondary btn-sm">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <div className="text-xs truncate text-neutral-400">
                    {avatarFile?.name ?? "No file chosen"}
                  </div>
                </div>

                <button
                  onClick={handleUploadAvatar}
                  disabled={!avatarFile || submitting}
                  className="w-full mt-3 btn-primary"
                >
                  {submitting ? "Uploading…" : "Upload avatar"}
                </button>
              </div>
            </div>
          </aside>

          <div className="col-span-1">
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <label className="flex flex-col">
                <span className="text-sm text-neutral-400">Display name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm text-neutral-400">Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-36 input"
                />
              </label>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-3 rounded-full btn-primary"
                >
                  {submitting ? "Saving…" : "Save profile"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name ?? "");
                    setBio(user?.bio ?? "");
                  }}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
