"use client";

import { useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ResourceReaderPanel } from "@/components/resources/resource-reader-panel";
import type { KnowledgeItemType } from "@/components/resources/readers/reader-registry";

interface ReaderOverlayProps {
  item: KnowledgeItemType;
  onClose: () => void;
}

export function ReaderOverlay({ item, onClose }: ReaderOverlayProps) {
  const reduced = useReducedMotion();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-background/80 hidden sm:block backdrop-blur-sm"
        onClick={handleClose}
      />
      <motion.div
        layoutId={`kcard-${item.id}`}
        className="absolute inset-0 flex items-start sm:items-center justify-center sm:pt-12 sm:pb-8 sm:px-4"
        transition={reduced ? { duration: 0.2 } : {
          type: "spring",
          damping: 28,
          stiffness: 300,
          mass: 0.8,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-full sm:max-w-[780px] sm:max-h-[85vh] h-full sm:h-auto bg-card shadow-2xl border-0 sm:border sm:border-border/50 overflow-hidden flex flex-col sm:rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex sm:hidden items-center justify-center pt-2 pb-1">
            <div className="w-8 h-1 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="flex-1 overflow-hidden flex flex-col">
            <ResourceReaderPanel item={item} onClose={handleClose} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
