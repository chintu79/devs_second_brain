"use client";

import { forwardRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, Star, Trash2 } from "lucide-react";
import { stagger, fadeInUp } from "@/lib/motion";
import { deleteNote, toggleNoteFavorite } from "@/actions/notes";

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

interface Project {
  id: string;
  title: string;
  tags: string[];
}

interface NoteListProps {
  notes: Note[];
  projects: Project[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onFavorite: () => void;
}

export const NoteList = forwardRef<HTMLDivElement, NoteListProps>(
  function NoteList({ notes, projects, selectedId, onSelect, onDelete, onFavorite }, ref) {
    if (notes.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted mx-auto mb-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-base text-muted-foreground">No notes match this filter</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className="flex-1 overflow-y-auto space-y-1 px-1"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {notes.map((note) => {
          const isSelected = selectedId === note.id;
          const preview = note.content
            .replace(/^#+\s*/gm, "")
            .replace(/[*`~\[\]]/g, "")
            .replace(/\n{2,}/g, " ")
            .trim()
            .slice(0, 120);

          const readingTime = Math.max(1, Math.ceil(note.content.split(/\s+/).filter(Boolean).length / 200));

          const relatedProject = projects.find((p) =>
            p.tags.some((t) => note.tags.includes(t) || note.category === t)
          );

          return (
            <motion.div key={note.id} variants={fadeInUp} className="group relative">
              <button
                onClick={() => onSelect(note.id)}
                className={`w-full text-left rounded-lg p-3.5 transition-all duration-150 ${
                  isSelected
                    ? "bg-primary/10 border border-primary/20 shadow-sm"
                    : "hover:bg-muted/50 hover:border-border/60 hover:scale-[1.01] border border-transparent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                      isSelected ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <FileText className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-medium truncate ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
                        {note.title}
                      </span>
                      {note.favorite && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                    </div>
                    {preview && (
                      <p className="text-sm text-muted-foreground/70 mt-1 line-clamp-2 leading-relaxed">{preview}</p>
                    )}
                    <div className="flex items-center gap-2.5 mt-1.5 text-xs text-muted-foreground">
                      <span className="bg-muted/70 px-1.5 py-0.5 rounded capitalize">{note.category}</span>
                      <span>{formatTimeAgo(note.updatedAt)}</span>
                      <span>{readingTime} min read</span>
                      {relatedProject && (
                        <span className="truncate max-w-[80px] text-primary/60">{relatedProject.title}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
                className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-150"
                title="Delete note"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }
);

function formatTimeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
