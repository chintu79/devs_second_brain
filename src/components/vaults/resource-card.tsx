"use client";

import { useState } from "react";
import { ExternalLink, Pencil, Trash2, Bookmark } from "lucide-react";
import { deleteResource } from "@/actions/resources";
import { ResourceDialog } from "./resource-dialog";

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string | null;
  createdAt: Date;
}

interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (confirm("Delete this resource?")) {
      setDeleting(true);
      await deleteResource(resource.id);
      setDeleting(false);
    }
  }

  let domain = resource.url;
  try {
    domain = new URL(resource.url).hostname.replace("www.", "");
  } catch {}

  return (
    <>
      <div className="group rounded-lg border border-border bg-card p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium leading-tight hover:text-primary transition-colors line-clamp-1 flex items-center gap-1">
                  {resource.title}
                  <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-muted-foreground">{domain}</span>
                  <span className="bg-muted text-[10px] text-muted-foreground px-1.5 py-0.5 rounded">{resource.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button aria-label="Edit resource" className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={() => setOpen(true)}>
                  <Pencil className="h-3 w-3" />
                </button>
                <button aria-label="Delete resource" disabled={deleting} className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-all duration-150 hover:scale-[1.1]" onClick={handleDelete}>
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
            {resource.notes && (
              <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-1 leading-relaxed">{resource.notes}</p>
            )}
            {resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {resource.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{tag}</span>
                ))}
                {resource.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{resource.tags.length - 3}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
      <ResourceDialog resource={resource} open={open} onOpenChange={setOpen} />
    </>
  );
}
