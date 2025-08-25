import Link from "next/link";
import React, { useState } from "react";

export function Tabs({
  tabs,
  defaultTab = 0,
  className = "",
  children,
}: {
  tabs: string[];
  defaultTab?: number;
  className?: string;
  children: React.ReactNode[];
}) {
  const [active, setActive] = useState(defaultTab);
  return (
    <div className={className}>
      <div className="flex gap-2 mb-4 border-b border-white/10">
        {tabs.map((tab, i) => {
          const isSecurity = tab.toLowerCase().includes("security");
          const activeClass = isSecurity
            ? "bg-red-700 text-white"
            : "bg-green-800 text-white";
          const inactiveClass = isSecurity
            ? "text-white bg-red-900 hover:bg-red-700 border border-red-700"
            : "text-white bg-blue-500 hover:bg-blue-700";
          return (
            <Link
              key={tab}
              href="#"
              className={`px-4 py-2 font-semibold rounded-t transition focus:outline-none ${active === i ? activeClass : inactiveClass}`}
              onClick={() => setActive(i)}
              aria-selected={active === i}
              aria-controls={`tab-panel-${i}`}
              role="tab"
            >
              {tab}
            </Link>
          );
        })}
      </div>
      <div id={`tab-panel-${active}`} role="tabpanel">
        {children[active]}
      </div>
    </div>
  );
}
