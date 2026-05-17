import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s - Lexi Admin",
  },
  description: "View the admin panel, manage users, view audit logs and more.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
