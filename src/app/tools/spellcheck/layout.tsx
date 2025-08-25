import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spelling Checker",
  description: "Check your spelling with ease using our AI-powered tool.",
};

export default function SpellingCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
