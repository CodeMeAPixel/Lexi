import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HiMiniSparkles } from "react-icons/hi2";

export default function AboutPage() {
    return (
        <main className="panel-wide">
            <section className="p-32 mb-20 glass-panel" style={{ padding: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <Image src="/logo.png" alt="Lexi logo" width={56} height={56} />
                    <h1 style={{ margin: 0 }} className="text-4xl font-bold">About Lexi</h1>
                </div>

                <p className="hero-sub" style={{ marginTop: 12 }}>
                    Lexi is short for <strong>Lexicon</strong>: a collection of words and the knowledge around how they're used.
                </p>

                <div className="mt-6 text-lg leading-relaxed">
                    <p>
                        The word "lexicon" comes from the Greek lexikon, meaning "of words." In modern English it usually
                        refers to a vocabulary or the set of words used within a language, a person, or a field of study.
                        Lexi is built around that idea: helping you choose the right words, shape clear sentences, and
                        express ideas with confidence.
                    </p>

                    <p className="mt-12">
                        Our mission is simple: make English clearer and more approachable. Whether you're rewriting a sentence
                        to be more formal, shortening a long message, or finding a more natural phrasing, Lexi offers
                        focused, privacy minded suggestions that keep your original meaning intact.
                    </p>

                    <p className="mt-12">
                        Lexi emphasizes privacy and clarity. We avoid inventing facts, preserve named entities when requested,
                        and surface concise rewrites so you can pick the tone and length that fit your needs.
                    </p>

                    <p className="mt-12">
                        Want to try it? Head over to the Rephraser to rewrite a sentence in seconds. If you have ideas or
                        feedback, we love hearing from users check the footer for contact links.
                    </p>
                </div>

                <div className="flex gap-12 mt-20">
                    <Link href="/rephrase" className="btn-primary">
                        <HiMiniSparkles size={18} />
                        <span>Try the Rephraser</span>
                    </Link>
                    <Link href="/" className="btn-secondary">Back to Home</Link>
                </div>
            </section>
        </main>
    );
}
