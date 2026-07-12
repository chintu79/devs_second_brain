"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, FileText, Video, StickyNote, File, Heart, ExternalLink, Loader2 } from "lucide-react";
import { formatRelative } from "@devventory/utils";
import { toggleFavorite } from "@/actions/knowledge";
import { toast } from "sonner";
import type { KnowledgeItemType } from "@/components/resources/readers/reader-registry";

interface KnowledgeCardProps {
  item: KnowledgeItemType;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const TYPE_META: Record<string, { icon: typeof Link; accent: string; label: string }> = {
  link: { icon: Link, accent: "#38bdf8", label: "Reference" },
  reference: { icon: Link, accent: "#38bdf8", label: "Reference" },
  note: { icon: StickyNote, accent: "#34d399", label: "Note" },
  document: { icon: FileText, accent: "#fbbf24", label: "Document" },
  pdf: { icon: File, accent: "#f87171", label: "PDF" },
  tweet: { icon: Link, accent: "#60a5fa", label: "Tweet" },
  video: { icon: Video, accent: "#fb7185", label: "Video" },
};

function getMeta(type: string) {
  return TYPE_META[type] || { icon: FileText, accent: "var(--color-muted-foreground)", label: type };
}

export function KnowledgeCard({ item, isSelected, onSelect }: KnowledgeCardProps) {
  const [isFav, setIsFav] = useState(item.favorite);
  const [favPending, setFavPending] = useState(false);
  const reduced = useReducedMotion();

  let domain = item.domain || "";
  if (!domain && item.url) {
    try { domain = new URL(item.url).hostname.replace("www.", ""); } catch {}
  }

  const meta = getMeta(item.type);
  const Icon = meta.icon;

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation();
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try {
      await toggleFavorite(item.id, item.favorite);
    } catch {
      setIsFav(isFav);
      toast.error("Failed to toggle favorite");
    }
    setFavPending(false);
  }

  return (
    <motion.div
      layoutId={`kcard-${item.id}`}
      onClick={() => onSelect?.(item.id)}
      role="button"
      tabIndex={0}
      aria-current={isSelected ? "true" : undefined}
      onKeyDown={(e) => { if (e.key === "Enter") onSelect?.(item.id); }}
      whileHover={reduced ? undefined : { y: -4, scale: 1.015 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group relative flex gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer h-full ${
        isSelected
          ? "border-accent/50 bg-accent/5 shadow-md ring-1 ring-accent/20"
          : "border-border hover:border-border/70 hover:shadow-sm bg-card"
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60`}
    >
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top row: icon + title + favorite */}
        <div className="flex items-start gap-2">
          <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: meta.accent }} />
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-semibold leading-snug line-clamp-2 ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
              {item.title || "Untitled"}
            </h3>
            {domain && (
              <p className="text-xs text-muted-foreground/50 truncate mt-0.5">{domain}</p>
            )}
          </div>
          <button
            onClick={handleFavorite}
            disabled={favPending}
            aria-label={isFav ? "Unfavorite" : "Favorite"}
            className={`flex items-center justify-center rounded shrink-0 transition-all duration-150 min-w-[44px] min-h-[44px] -mr-2 -mt-2 ${
              isFav ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } hover:bg-muted/50`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
          </button>
        </div>

        {/* Summary */}
        {item.summary && (
          <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-2 mt-2">
            {item.summary}
          </p>
        )}

        {/* Bottom row: type badge + time / actions on hover */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 group-hover:hidden">
            <span
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted/60"
              style={{ color: meta.accent, opacity: 0.7 }}
            >
              {meta.label}
            </span>
            <span className="text-[11px] text-muted-foreground/40">{formatRelative(item.createdAt)}</span>
            {item.captureStatus === "processing" && (
              <span className="inline-flex items-center gap-1 text-[11px] text-warning/70">
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                Enhancing
              </span>
            )}
          </div>

          <div className="hidden group-hover:flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); onSelect?.(item.id); }}
                className="text-[11px] font-medium px-3 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[44px]"
              >
                Open Reader
              </button>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center rounded-md hover:bg-muted/50 transition-colors min-w-[44px] min-h-[44px]"
                aria-label="Open original"
              >
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/60" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
