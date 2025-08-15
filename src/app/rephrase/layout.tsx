import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sentence Rephraser',
    description: 'Rephrase your sentences with ease using our AI-powered tool.',
}

export default function RephraseLayout({ children }: { children: React.ReactNode }) {
    return children;
}