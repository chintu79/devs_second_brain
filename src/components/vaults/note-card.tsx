"use client";

import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { deleteNote } from "@/actions/notes";
import { NoteDialog } from "./note-dialog";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
}

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Delete this note?")) {
      setDeleting(true);
      await deleteNote(note.id);
      setDeleting(false);
    }
  }

  const preview = note.content
    .replace(/^#+\s*/gm, "")
    .replace(/[*`~]/g, "")
    .replace(/\n{2,}/g, " ")
    .trim()
    .slice(0, 100);

  const date = new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <>
      <div className="group rounded-lg border border-border bg-card p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium line-clamp-1">{note.title}</span>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button aria-label="Edit note" className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={() => setOpen(true)}>
                  <Pencil className="h-3 w-3" />
                </button>
                <button aria-label="Delete note" disabled={deleting} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={handleDelete}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            {preview && (
              <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-2 leading-relaxed">{preview}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
              <span className="bg-muted px-1.5 py-0.5 rounded">{note.category}</span>
              <span>{date}</span>
              {note.tags.length > 0 && (
                <span className="truncate max-w-[100px]">{note.tags.slice(0, 2).join(" · ")}{note.tags.length > 2 ? "…" : ""}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <NoteDialog note={note} open={open} onOpenChange={setOpen} />
    </>
  );
}
