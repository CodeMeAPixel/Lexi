import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summarizer",
  description:
    "Summarize text or conversations with ease using our AI-powered tool.",
};

export default function SummarizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
