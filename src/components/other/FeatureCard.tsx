"use client";
import { useEffect, useRef, useState } from "react";

export default function FeatureCard({
  title,
  children,
  reverse = false,
  icon,
  delayMs = 0,
}: {
  title: string;
  children: React.ReactNode;
  reverse?: boolean;
  icon?: React.ReactNode;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`feature-row ${reverse ? "reverse" : ""}`}>
      <div
        className={`feature-text ${visible ? "enter-visible" : "enter-hidden"}`}
        style={{ transitionDelay: `${visible ? delayMs : 0}ms` }}
      >
        <h3>{title}</h3>
        <p>{children}</p>
      </div>
      <div
        className={`feature-visual ${visible ? "enter-visible" : "enter-hidden"}`}
        style={{ transitionDelay: `${visible ? delayMs + 80 : 0}ms` }}
      >
        <div className="mockup-box small" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
