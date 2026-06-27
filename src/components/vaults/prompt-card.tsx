"use client";

import { useState } from "react";
import { Star, Pencil, Trash2, Sparkles, Copy, Check } from "lucide-react";
import { deletePrompt, toggleFavorite } from "@/actions/prompts";
import { PromptDialog } from "./prompt-dialog";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  useCase: string;
  favorite: boolean;
  createdAt: Date;
}

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt: p }: PromptCardProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(p.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (confirm("Delete this prompt?")) {
      setDeleting(true);
      await deletePrompt(p.id);
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="group rounded-lg border border-border bg-card overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]">
        <div className="p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium truncate">{p.title}</span>
                  <span className="bg-muted text-[10px] text-muted-foreground px-1.5 py-0.5 rounded shrink-0">{p.category}</span>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <form action={async () => { await toggleFavorite(p.id); }}>
                    <button type="submit" aria-label={p.favorite ? "Unfavorite prompt" : "Favorite prompt"} className={`flex h-7 w-7 items-center justify-center rounded transition-all duration-150 hover:scale-[1.1] ${p.favorite ? "text-amber-400" : "text-muted-foreground hover:text-amber-400 hover:bg-muted"}`}>
                      <Star className={`h-3 w-3 ${p.favorite ? "fill-amber-400" : ""}`} />
                    </button>
                  </form>
                  <button onClick={handleCopy} aria-label={copied ? "Copied" : "Copy to clipboard"} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 hover:scale-[1.1]">
                    {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              {p.useCase && (
                <p className="text-xs text-muted-foreground mt-1">{p.useCase}</p>
              )}
              <pre className="text-xs text-muted-foreground/70 whitespace-pre-wrap font-sans mt-2 line-clamp-2 bg-muted/50 rounded-md p-2 leading-relaxed font-[inherit]">
                {p.prompt}
              </pre>
              {p.tags.length > 0 && (
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                    {p.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{p.tags.length - 3}</span>}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button aria-label="Edit prompt" className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={() => setOpen(true)}>
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button aria-label="Delete prompt" disabled={deleting} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={handleDelete}>
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <PromptDialog prompt={p} open={open} onOpenChange={setOpen} />
    </>
  );
}
