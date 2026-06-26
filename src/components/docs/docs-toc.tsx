"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface TocSection {
  id: string;
  title: string;
  color: string;
}

export function DocsTOC({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  }, []);

  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="space-y-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-section-foreground mb-3 px-3">
          On this page
        </h3>
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => handleClick(s.id)}
            className={`relative flex items-center gap-2 w-full rounded-lg px-3 py-1.5 text-xs text-left transition-all duration-150 ${
              activeId === s.id
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {activeId === s.id && (
              <motion.div
                layoutId="toc-indicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full accent-bg"
                style={{ '--accent-c': s.color } as React.CSSProperties}
                transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
              />
            )}
            <span
              className={`shrink-0 h-1.5 w-1.5 rounded-full accent-bg transition-opacity ${
                activeId === s.id ? "opacity-100" : "opacity-30"
              }`}
              style={{ '--accent-c': s.color } as React.CSSProperties}
            />
            <span className="truncate">{s.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
