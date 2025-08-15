import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn more about Lexi, its features and capabilities and how it can help you.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children;
}