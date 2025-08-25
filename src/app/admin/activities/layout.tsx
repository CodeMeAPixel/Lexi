import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs",
  description:
    "View and manage audit logs for user activity and system events.",
};

export default function AuditLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
