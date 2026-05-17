"use client";

import { useState } from "react";

type AccordionItemProps = {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function AccordionItem({
  title,
  children,
  defaultOpen,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(!!defaultOpen);

  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-3 text-base font-medium text-left transition-colors hover:text-indigo-400"
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-6 mb-6 glass-panel"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="pb-3 overflow-hidden text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Accordion({ children, className }: AccordionProps) {
  return (
    <div className={`w-full divide-y divide-white/5 ${className || ""}`}>
      {children}
    </div>
  );
}
