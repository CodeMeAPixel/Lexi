import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Rephraser Results',
    description: 'View the results of your rephrased sentences here.',
}

export default function RephraseResultsLayout({ children }: { children: React.ReactNode }) {
    return children;
}