import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorization",
  description: "Login or create an account to access exclusive features.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center w-full h-full max-w-4xl mx-auto mt-4">
      {children}
    </div>
  );
}
