import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Lexicon Tools",
    template: "%s - Lexi",
  },
  description:
    "Learn more about Lexi, its features and capabilities and how it can help you.",
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
