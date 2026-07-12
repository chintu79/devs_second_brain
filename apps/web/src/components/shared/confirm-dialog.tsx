"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure?",
  description,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30"
      onClick={onCancel}
    >
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.12 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-background border border-border/60 rounded-xl shadow-xl p-5 max-w-sm w-full mx-3"
      >
        <h3 className="text-sm font-semibold mb-1.5">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-xs rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-xs rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
