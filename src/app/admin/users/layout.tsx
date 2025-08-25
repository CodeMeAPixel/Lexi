import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "User Manager",
    template: "%s - Lexi",
  },
  description: "Manage users, view user activity, and configure user settings.",
};

export default function UserManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
