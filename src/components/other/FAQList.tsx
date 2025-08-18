"use client";

import React, { useState } from "react";
import { HiQuestionMarkCircle, HiOutlineChevronDown } from "react-icons/hi2";

type FAQItem = {
    question: string;
    answer: React.ReactNode;
};

export default function FAQList({ items, defaultOpenIndex = -1 }: { items: FAQItem[]; defaultOpenIndex?: number }) {
    const [openIndex, setOpenIndex] = useState<number>(defaultOpenIndex);

    return (
        <div className="space-y-2">
            {items.map((it, i) => {
                const isOpen = openIndex === i;
                return (
                    <div key={i} className="overflow-hidden rounded-md">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-transparent">
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                                className="flex items-center w-full gap-3 text-left"
                            >
                                <HiQuestionMarkCircle className="text-sky-500" />
                                <span className="font-medium">{it.question}</span>
                            </button>

                            <HiOutlineChevronDown className={`ml-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </div>

                        <div className={`px-3 pb-3 pt-2 text-sm text-gray-600 dark:text-gray-300 ${isOpen ? "block" : "hidden"}`}>
                            {it.answer}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
