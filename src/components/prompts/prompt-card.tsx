"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Copy, ExternalLink, MoreHorizontal, Pencil, Trash2, Sparkles } from "lucide-react";
import { cardHover } from "@/lib/motion";
import Link from "next/link";
import { deletePrompt, toggleFavorite, recordPromptUsage } from "@/actions/prompts";
import { PromptDialog } from "@/components/vaults/prompt-dialog";

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

const categoryColors: Record<string, string> = {
  coding: "bg-sky-500/10 text-sky-400",
  debugging: "bg-rose-500/10 text-rose-400",
  architecture: "bg-purple-500/10 text-purple-400",
  testing: "bg-emerald-500/10 text-emerald-400",
  docs: "bg-amber-500/10 text-amber-400",
  writing: "bg-pink-500/10 text-pink-400",
};

export function PromptCard({ prompt: p, selected, onSelect }: PromptCardProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFav, setIsFav] = useState(p.favorite);
  const [copied, setCopied] = useState(false);

  async function handleDelete() {
    if (confirm("Delete this prompt?")) {
      await deletePrompt(p.id);
    }
  }

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    setIsFav(!isFav);
    await toggleFavorite(p.id);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    await navigator.clipboard.writeText(p.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await recordPromptUsage(p.id);
  }

  const preview = p.prompt.split("\n").slice(0, 3).join("\n");
  const catColor = categoryColors[p.category] || "bg-muted text-muted-foreground";

  return (
    <>
      <motion.div
        whileHover={cardHover}
        className={`group relative rounded-xl border bg-card cursor-pointer w-full ${
          selected
            ? "border-primary/40 shadow-[var(--shadow-elevated)]"
            : "border-border hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)]"
        }`}
        onClick={() => onSelect?.(p.id)}
      >
        <div className="px-5 py-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isFav ? "bg-amber-500/10" : "bg-muted"} transition-colors`}>
              <Sparkles className={`h-4 w-4 ${isFav ? "text-amber-400" : "text-secondary-foreground"} transition-colors`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-foreground truncate">{p.title}</h3>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${catColor}`}>{p.category}</span>
                    {p.useCase && <span className="text-xs text-secondary-foreground">{p.useCase}</span>}
                  </div>
                </div>
              </div>

              <pre className="font-sans text-xs text-muted-foreground leading-relaxed mt-2.5 line-clamp-2 bg-muted/40 rounded-lg p-3 whitespace-pre-wrap pointer-events-none">
                {preview}
              </pre>

              <div className="flex items-center gap-3 mt-2.5">
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                    {p.tags.length > 3 && <span className="text-xs text-muted-foreground">+{p.tags.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center gap-3 ml-auto text-xs text-muted-foreground">
                  {p.useCount > 0 && <span>Used {p.useCount} time{p.useCount !== 1 ? "s" : ""}</span>}
                  {p.lastUsedAt && <span>Last used {formatRelative(p.lastUsedAt)}</span>}
                  {p.useCount === 0 && !p.lastUsedAt && <span>Never used</span>}
                </div>
              </div>
            </div>

            {/* Actions — stop propagation to not trigger selection */}
            <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleFavorite}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                  isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100"
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`} />
              </button>
              <button
                onClick={handleCopy}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                title={copied ? "Copied!" : "Copy prompt"}
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
              <Link
                href={`/prompts/${p.id}`}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-lg border border-border bg-card shadow-lg py-1">
                      <button
                        onClick={() => { setOpen(true); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => { handleDelete(); setMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {copied && (
            <div className="absolute top-3 right-3 z-30 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg animate-fade-in">
              Copied!
            </div>
          )}
        </div>
      </motion.div>
      <PromptDialog prompt={p} open={open} onOpenChange={setOpen} />
    </>
  );
}

function formatRelative(date: Date): string {
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
