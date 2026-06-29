"use client";

import { forwardRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, Trash2 } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { fadeInUp, stagger } from "@/lib/motion";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onFavorite: (id: string) => void;
}

export const NoteList = forwardRef<HTMLDivElement, NoteListProps>(
  function NoteList({ notes, selectedId, onSelect, onDelete, onFavorite }, ref) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const previews = useMemo(() => {
      const map: Record<string, string> = {};
      for (const note of notes) {
        map[note.id] = note.content
          .replace(/^#+\s*/gm, "")
          .replace(/[*`~\[\]]/g, "")
          .replace(/\n{2,}/g, " ")
          .trim()
          .slice(0, 80);
      }
      return map;
    }, [notes]);

    if (notes.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6 max-w-[220px]">
            <div className="flex justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
            </div>
            <p className="text-sm text-muted-foreground">Capture your first idea</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Everything you write becomes connected knowledge. Start with a template and let the app organize the rest.</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-1 space-y-1"
      >
        {notes.map((note) => {
          const isSelected = selectedId === note.id;
          const preview = previews[note.id];
          const wordCount = note.content.split(/\s+/).filter(Boolean).length;
          const readingTime = Math.max(1, Math.ceil(wordCount / 200));

          return (
            <motion.div
              key={note.id}
              variants={fadeInUp}
              className={`border-b border-border last:border-b-0 transition-colors ${
                isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/60"
              }`}
            >
              <button
                onClick={() => onSelect(note.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] ${
                  isSelected ? "border-l-2 border-primary" : "border-l-2 border-transparent hover:border-l-2 hover:border-border/30"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium truncate flex-1 ${isSelected ? "text-foreground" : "text-foreground/85"}`}>
                        {note.title}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onFavorite(note.id); }}
                        className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${note.favorite ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}
                        aria-label={note.favorite ? "Unfavorite note" : "Favorite note"}
                      >
                        <Star className={`h-3 w-3 ${note.favorite ? "fill-amber-400" : ""}`} />
                      </button>
                    </div>
                    {preview && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{preview}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/50">
                      <span className="inline-flex items-center gap-1 bg-muted/50 px-1.5 py-0.5 rounded capitalize">{note.category}</span>
                      <span>{formatRelative(note.updatedAt)}</span>
                      <span>{readingTime}m</span>
                      {wordCount > 0 && <span>{wordCount}w</span>}
                    </div>
                  </div>
                  <button
                    onClick={async (e) => { e.stopPropagation(); setDeletingId(note.id); try { await onDelete(note.id); } finally { setDeletingId(null); } }}
                    disabled={deletingId === note.id}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Delete note"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);


