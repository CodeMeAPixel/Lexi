import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "View and update your profile and settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
