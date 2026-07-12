"use client";

import { useReducedMotion, motion } from "framer-motion";
import { cardHover } from "@devventory/motion";

interface KnowledgeTileProps {
  id: string;
  title: string;
  url: string;
  category: string;
  summary: string;
  onSelect: (id: string) => void;
}

export function KnowledgeTile({ id, title, url, category, summary, onSelect }: KnowledgeTileProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      layoutId={`tile-${id}`}
      onClick={() => onSelect(id)}
      className="group relative text-left rounded-xl border border-border/60 bg-card p-5 shadow-sm cursor-pointer outline-none
        transition-colors duration-150
        hover:border-border/30 hover:bg-card/80
        focus-visible:ring-2 focus-visible:ring-[#6366F1]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      whileHover={reduced ? undefined : cardHover}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Category badge */}
      <span className="inline-flex items-center rounded-md bg-[#6366F1]/10 border border-[#6366F1]/20 px-2 py-0.5 text-[10px] font-medium text-[#6366F1] mb-3">
        {category}
      </span>

      <h3 className="text-sm font-semibold text-foreground/90 mb-1.5 line-clamp-2">{title}</h3>
      <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-2 mb-3">{summary}</p>

      <span className="text-[10px] text-muted-foreground/40 truncate">{url}</span>
    </motion.button>
  );
}
