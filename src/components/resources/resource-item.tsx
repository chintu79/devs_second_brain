"use client";

import { useState } from "react";
import { ExternalLink, Heart, Archive, MoreHorizontal, Pencil, Trash2, Bookmark } from "lucide-react";
import { deleteResource, toggleFavorite } from "@/actions/resources";
import { ResourceDialog } from "@/components/vaults/resource-dialog";

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string | null;
  reason: string | null;
  favorite: boolean;
  createdAt: Date;
}

interface ResourceItemProps {
  resource: Resource;
  isSelected?: boolean;
  onSelect?: (id: string | null) => void;
}

const categoryColors: Record<string, string> = {
  frontend: "bg-sky-500/10 text-sky-400",
  backend: "bg-emerald-500/10 text-emerald-400",
  devops: "bg-purple-500/10 text-purple-400",
  database: "bg-amber-500/10 text-amber-400",
  mobile: "bg-rose-500/10 text-rose-400",
  ai: "bg-violet-500/10 text-violet-400",
  design: "bg-pink-500/10 text-pink-400",
};

export function ResourceItem({ resource, isSelected, onSelect }: ResourceItemProps) {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFav, setIsFav] = useState(resource.favorite);
  const [favPending, setFavPending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (deleting) return;
    if (confirm("Delete this resource?")) {
      setDeleting(true);
      await deleteResource(resource.id);
      setDeleting(false);
    }
  }

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    await toggleFavorite(resource.id, resource.favorite);
    setFavPending(false);
  }

  let domain = resource.url;
  try {
    domain = new URL(resource.url).hostname.replace("www.", "");
  } catch {}

  const catColor = categoryColors[resource.category] || "bg-muted text-muted-foreground";

  return (
    <>
      <div className={`group relative rounded-xl border bg-card w-full transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] ${isSelected ? "border-primary/40 bg-primary/[0.02]" : "border-border"}`}>
        <div className="px-5 py-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isFav ? "bg-primary/10" : "bg-muted"} transition-colors`}>
              <Bookmark className={`h-4 w-4 ${isFav ? "text-primary" : "text-secondary-foreground"} transition-colors`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Title + Domain */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <button onClick={() => onSelect?.(resource.id)} className="text-left group/title">
                    <h3 className="text-base font-semibold text-foreground group-hover/title:text-primary transition-colors truncate">
                      {resource.title}
                    </h3>
                  </button>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${catColor}`}>{resource.category}</span>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1">
                      {domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Reason - context first */}
              {resource.reason && (
                <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <span className="text-xs font-medium text-secondary-foreground shrink-0">Saved for:</span>
                  <span className="text-xs text-foreground/80 leading-relaxed">{resource.reason}</span>
                </div>
              )}

              {/* Tags + Date */}
              <div className="flex items-center gap-3 mt-2.5">
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                    ))}
                    {resource.tags.length > 4 && (
                      <span className="text-[11px] text-muted-foreground">+{resource.tags.length - 4}</span>
                    )}
                  </div>
                )}
                <span className="text-xs text-muted-foreground ml-auto">{formatDate(resource.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={handleFavorite}
                disabled={favPending}
                aria-label={isFav ? "Unfavorite" : "Favorite"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                  isFav ? "text-red-400 hover:text-red-300" : "text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
              </button>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open in new tab"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="More options"
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
                        disabled={deleting}
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
        </div>
      </div>
      <ResourceDialog resource={resource} open={open} onOpenChange={setOpen} />
    </>
  );
}

function formatDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
