"use client";

import { useState } from "react";
import { ExternalLink, Heart, Trash2 } from "lucide-react";
import { formatRelative } from "@devventory/utils";
import { deleteResource, toggleFavorite } from "@/actions/resources";
import { toast } from "sonner";
import { RESOURCE_CATEGORY_COLORS } from "@devventory/types";

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

export function ResourceItem({ resource, isSelected, onSelect }: ResourceItemProps) {
  const [isFav, setIsFav] = useState(resource.favorite);
  const [favPending, setFavPending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (deleting) return;
    setDeleting(true);
    await deleteResource(resource.id);
    setDeleting(false);
    toast.success("Resource deleted");
  }

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try {
      await toggleFavorite(resource.id, resource.favorite);
    } catch {
      setIsFav(isFav);
      toast.error("Failed to toggle favorite");
    }
    setFavPending(false);
  }

  let domain = resource.url;
  try {
    domain = new URL(resource.url).hostname.replace("www.", "");
  } catch {}

  const catColor = RESOURCE_CATEGORY_COLORS[resource.category] || "bg-muted text-muted-foreground";

  return (
    <div className={`border-b border-border last:border-b-0 transition-colors ${isSelected ? "bg-primary/[0.04]" : "hover:bg-muted/60"}`}>
      <div
        onClick={() => onSelect?.(resource.id)}
        onKeyDown={(e) => { if (e.key === "Enter") onSelect?.(resource.id); }}
        role="button"
        tabIndex={0}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
          isSelected ? "border-l-2 border-primary" : "border-l-2 border-transparent hover:border-l-2 hover:border-border/30"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium truncate flex-1 ${isSelected ? "text-foreground" : "text-foreground/85"}`}>
                {resource.title}
              </span>
              <button
                onClick={handleFavorite}
                disabled={favPending}
                aria-label={isFav ? "Unfavorite" : "Favorite"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"}`}
              >
                <Heart className={`h-3 w-3 ${isFav ? "fill-amber-400" : ""}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground/50">
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${catColor}`}>{resource.category}</span>
              <span>{domain}</span>
              <span>{formatRelative(resource.createdAt)}</span>
            </div>
            {resource.reason && (
              <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{resource.reason}</p>
            )}
            {resource.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-1.5">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[11px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{tag}</span>
                ))}
                {resource.tags.length > 3 && (
                  <span className="text-[11px] text-muted-foreground/50">+{resource.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Open in new tab"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all disabled:opacity-50"
              aria-label="Delete resource"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


