import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Definer",
  description: "Define your words with ease using our AI-powered tool.",
};

export default function WordDefinerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
