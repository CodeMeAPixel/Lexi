"use client";

import React, { useEffect, useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import toast from "react-hot-toast";
import Link from "next/link";
import { Sparkles, Trash, Upload } from "lucide-react";

export default function SettingsPage() {
  const [simplifyData, setSimplifyData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDataPanel, setShowDataPanel] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);

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
        setUsername(body.user?.username ?? "");
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
        body: JSON.stringify({ name, username, bio }),
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Save failed");
      setUser((u: any) => ({
        ...u,
        name: body.user.name,
        username: body.user.username,
        bio: body.user.bio,
      }));
      toast.success("Profile updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveAvatar() {
    setSubmitting(true);
    try {
      const resp = await fetch("/api/profile/remove-avatar", {
        method: "POST",
      });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Failed to remove avatar");
      setAvatarPreview(null);
      setAvatarFile(null);
      setUser((u: any) => ({ ...u, image: null }));
      toast.success("Avatar removed");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to remove avatar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownloadData() {
    setSubmitting(true);
    try {
      const resp = await fetch("/api/profile/download");
      if (!resp.ok) throw new Error("Failed to download data");
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "lexi-user-data.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Data downloaded");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to download data");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAccount() {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;
    setSubmitting(true);
    try {
      const resp = await fetch("/api/profile/delete", { method: "POST" });
      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Failed to delete account");
      toast.success("Account deleted. Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to delete account");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleViewData() {
    setLoadingUserData(true);
    setShowDataPanel(true);
    try {
      const resp = await fetch("/api/profile/data");
      if (!resp.ok) throw new Error("Failed to fetch user data");
      const data = await resp.json();
      setUserData(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to fetch user data");
      setUserData(null);
    } finally {
      setLoadingUserData(false);
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

        <Tabs tabs={["Profile", "Security"]}>
          {/* Profile Tab */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr,320px] md:flex md:flex-col items-center justify-center">
            <form
              onSubmit={handleSaveProfile}
              className="flex flex-col col-span-1 gap-4"
            >
              <label className="flex flex-col text-left items-left justify-left">
                <span className="mb-2 text-sm text-neutral-400">
                  Display name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </label>
              <label className="flex flex-col text-left items-left justify-left">
                <span className="mb-2 text-sm text-neutral-400">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  maxLength={32}
                  pattern="^[a-zA-Z0-9_.-]+$"
                  title="Alphanumeric, dot, underscore, dash only"
                />
              </label>
              <label className="flex flex-col text-left items-left justify-left">
                <span className="mb-2 text-sm text-neutral-400">Biography</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-36 input"
                />
              </label>
              <div className="flex gap-4 mt-4 justify-left items-left">
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
                    setUsername(user?.username ?? "");
                    setBio(user?.bio ?? "");
                  }}
                  className="btn-secondary"
                >
                  Reset
                </button>
              </div>
            </form>
            {/* Avatar uploader, right side on large screens */}
            <aside className="flex flex-col items-center col-span-1 gap-4 p-4 rounded-lg lg:items-start bg-neutral-900/40">
              <div className="flex flex-row items-center w-full gap-6">
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
                <div className="flex flex-col w-full gap-2">
                  <label className="inline-flex items-center gap-2 btn-secondary btn-sm">
                    <Sparkles className="w-4 h-4" />
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleUploadAvatar}
                    disabled={!avatarFile || submitting}
                    className="btn-primary"
                  >
                    <Upload className="w-4 h-4" />
                    {submitting ? "Uploading…" : "Upload avatar"}
                  </button>
                  <button
                    type="button"
                    className="flex text-center text-white justify-left btn-error items-left"
                    disabled={submitting || !avatarPreview}
                    onClick={handleRemoveAvatar}
                  >
                    <Trash className="flex items-center justify-center w-4 h-4" />
                    Remove image
                  </button>
                  <div className="text-xs truncate text-neutral-400">
                    {avatarFile?.name ??
                      (avatarPreview ? "Image set" : "No file chosen")}
                  </div>
                </div>
              </div>
            </aside>
          </div>
          {/* Security Tab */}
          <div className="flex flex-col gap-6">
            <h3 className="mb-2 text-xl font-bold">Security & Data</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">View your data</span>
                <button
                  className="btn-secondary hover:bg-grey-60"
                  type="button"
                  disabled={loadingUserData}
                  onClick={() => {
                    if (showDataPanel) {
                      setShowDataPanel(false);
                    } else {
                      handleViewData();
                    }
                  }}
                >
                  {loadingUserData
                    ? "Loading…"
                    : showDataPanel
                      ? "Hide Data"
                      : "View Data"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  Download a copy of your data
                </span>
                <button
                  className="btn-secondary hover:bg-grey-60"
                  type="button"
                  onClick={handleDownloadData}
                  disabled={submitting}
                >
                  Download Data
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">
                  Delete your account and all data
                </span>
                <button
                  className="text-red-400 btn-error"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={submitting}
                >
                  Delete Data
                </button>
              </div>
            </div>
            {/* Add more security/data controls as needed */}
            {showDataPanel && (
              <div className="p-6 mt-6 border-2 border-red-500 rounded-lg bg-neutral-900/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-bold">Your Data</h4>
                  <button
                    className="btn-secondary btn-sm hover:bg-grey-60"
                    onClick={() => setSimplifyData((v) => !v)}
                  >
                    {simplifyData ? "Show All" : "Hide Sensitive"}
                  </button>
                </div>
                <div className="overflow-auto max-h-[40vh] text-xs bg-neutral-800 rounded p-4 text-left">
                  {loadingUserData ? (
                    <div>Loading…</div>
                  ) : userData ? (
                    <pre
                      style={{ whiteSpace: "pre-wrap" }}
                      dangerouslySetInnerHTML={{
                        __html: highlightJson(
                          JSON.stringify(
                            simplifyData
                              ? simplifyUserData(userData)
                              : userData,
                            null,
                            2,
                          ),
                        ),
                      }}
                    />
                  ) : (
                    <div className="text-red-400">Failed to load data.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </section>
    </main>
  );
  // Highlight JSON syntax for display
  function highlightJson(json: string) {
    if (!json) return "";

    return (
      json
        // Keys
        .replace(/"(.*?)":/g, '<span style="color:#7dd3fc">"$1"</span>:')
        // Strings (values only, not keys)
        .replace(/: "(.*?)"/g, ': <span style="color:#a3e635">"$1"</span>')
        // Numbers
        .replace(
          /\b(-?\d+(?:\.\d+)?)\b/g,
          '<span style="color:#f472b6">$1</span>',
        )
        // Booleans
        .replace(/\b(true|false)\b/g, '<span style="color:#fbbf24">$1</span>')
        // Null
        .replace(/\bnull\b/g, '<span style="color:#f87171">null</span>')
    );
  }

  // Remove or obfuscate sensitive fields from user data
  function simplifyUserData(data: any) {
    if (!data || typeof data !== "object") return data;
    const clone = JSON.parse(JSON.stringify(data));

    function obfuscate(obj: any) {
      for (const key in obj) {
        if (sensitiveFields.includes(key)) {
          obj[key] = "[hidden]";
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          obfuscate(obj[key]);
        }
      }
    }

    // Common sensitive fields to obfuscate
    const sensitiveFields = [
      "password",
      "hashedPassword",
      "hash",
      "email",
      "token",
      "accessToken",
      "refreshToken",
      "secret",
      "phone",
      "address",
      "ssn",
    ];
    obfuscate(clone);
    return clone;
  }
}
