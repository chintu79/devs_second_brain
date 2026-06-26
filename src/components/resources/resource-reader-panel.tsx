"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Heart, ExternalLink, Pencil, Trash2, Globe, Calendar, Copy, Check } from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { deleteResource, toggleFavorite } from "@/actions/resources";
import { useRouter } from "next/navigation";
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

export function ResourceReaderPanel({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isFav, setIsFav] = useState(resource.favorite);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(resource.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (deleting) return;
    if (confirm("Delete this resource?")) {
      setDeleting(true);
      await deleteResource(resource.id);
      setDeleting(false);
      onClose();
      router.refresh();
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
  try { domain = new URL(resource.url).hostname.replace("www.", ""); } catch {}

  const catColor: Record<string, string> = {
    frontend: "bg-sky-500/10 text-sky-400",
    backend: "bg-emerald-500/10 text-emerald-400",
    devops: "bg-purple-500/10 text-purple-400",
    database: "bg-amber-500/10 text-amber-400",
    mobile: "bg-rose-500/10 text-rose-400",
    ai: "bg-violet-500/10 text-violet-400",
    design: "bg-pink-500/10 text-pink-400",
  };

  return (
    <motion.div
      variants={slideInRight}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="panel-detail-card"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Resource</span>
        <button onClick={onClose} aria-label="Close panel" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <h2 className="text-lg font-semibold leading-tight">{resource.title}</h2>
          <div className="flex items-center gap-2.5 mt-2">
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${catColor[resource.category] || "bg-muted text-muted-foreground"}`}>{resource.category}</span>
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
              <Globe className="h-3 w-3" />
              {domain}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {resource.reason && (
          <div className="rounded-lg bg-muted/50 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Why I saved this</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{resource.reason}</p>
          </div>
        )}

        {resource.notes && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Notes</p>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{resource.notes}</p>
          </div>
        )}

        {resource.tags.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(resource.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-t border-border/30">
        <button onClick={handleFavorite} disabled={favPending} aria-label={isFav ? "Unfavorite" : "Favorite"}
          className={`flex h-8 items-center gap-1.5 rounded-lg border border-border/40 px-3 text-xs transition-colors ${isFav ? "text-red-400 border-red-400/30" : "text-muted-foreground hover:text-foreground"}`}>
          <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
          {isFav ? "Favorited" : "Favorite"}
        </button>
        <button onClick={() => setEditOpen(true)} className="flex h-8 items-center gap-1.5 rounded-lg border border-border/40 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
        <button onClick={handleCopy} className="flex h-8 items-center gap-1.5 rounded-lg border border-border/40 px-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy URL"}
        </button>
        <button onClick={handleDelete} disabled={deleting} className="flex h-8 items-center gap-1.5 rounded-lg border border-border/40 px-3 text-xs text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors ml-auto">
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </button>
      </div>

      {editOpen && <ResourceDialog resource={resource} open={editOpen} onOpenChange={setEditOpen} />}
    </motion.div>
  );
}
