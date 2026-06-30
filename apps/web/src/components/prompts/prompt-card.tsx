"use client";

import { useState } from "react";
import { Star, Copy, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { deletePrompt, toggleFavorite, recordPromptUsage } from "@/actions/prompts";
import { toast } from "sonner";
import { formatRelative } from "@devventory/utils";
import { PROMPT_CATEGORY_COLORS } from "@devventory/types";

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  useCase: string;
  favorite: boolean;
  useCount: number;
  lastUsedAt: Date | null;
  createdAt: Date;
}

interface PromptCardProps {
  prompt: Prompt;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function PromptCard({ prompt: p, selected, onSelect }: PromptCardProps) {
  const [isFav, setIsFav] = useState(p.favorite);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    await deletePrompt(p.id);
    setDeleting(false);
    toast.success("Prompt deleted");
  }

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try {
      await toggleFavorite(p.id);
    } catch {
      setIsFav(isFav);
      toast.error("Failed to toggle favorite");
    }
    setFavPending(false);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(p.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await recordPromptUsage(p.id);
  }

  const preview = p.prompt.split("\n").slice(0, 3).join("\n");
  const catColor = PROMPT_CATEGORY_COLORS[p.category] || "bg-muted text-muted-foreground";

  return (
    <div className={`border-b border-border last:border-b-0 transition-colors ${selected ? "bg-primary/[0.04]" : "hover:bg-muted/60"}`}>
      <button
        onClick={() => onSelect?.(p.id)}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] ${
          selected ? "border-l-2 border-primary" : "border-l-2 border-transparent hover:border-l-2 hover:border-border/30"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium truncate flex-1 ${selected ? "text-foreground" : "text-foreground/85"}`}>
                {p.title}
              </span>
              <button
                onClick={handleFavorite}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}
                aria-label={isFav ? "Unfavorite" : "Favorite"}
              >
                <Star className={`h-3 w-3 ${isFav ? "fill-amber-400" : ""}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/50">
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded capitalize ${catColor}`}>{p.category}</span>
              {p.useCase && <span className="truncate max-w-[180px]">{p.useCase}</span>}
              <span>{formatRelative(p.createdAt)}</span>
            </div>
            <pre className="font-sans text-xs text-muted-foreground/60 leading-relaxed mt-1 line-clamp-2 whitespace-pre-wrap pointer-events-none">
              {preview}
            </pre>
            {p.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {p.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
                {p.tags.length > 3 && <span className="text-[11px] text-muted-foreground/50">+{p.tags.length - 3}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              title={copied ? "Copied!" : "Copy prompt"}
              aria-label="Copy prompt"
            >
              <Copy className="h-3 w-3" />
            </button>
            <Link
              href={`/prompts/${p.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Open prompt page"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
              aria-label="Delete prompt"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
        {copied && (
          <div className="absolute top-3 right-3 z-30 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg animate-fade-in">
            Copied!
          </div>
        )}
      </button>
    </div>
  );
}


