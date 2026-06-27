"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Heart, ExternalLink, Pencil, Trash2, Globe, Calendar, Copy, Check, Bookmark, Save } from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { deleteResource, toggleFavorite, editResource } from "@/actions/resources";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isFav, setIsFav] = useState(resource.favorite);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(resource.title);
  const [editUrl, setEditUrl] = useState(resource.url);
  const [editCategory, setEditCategory] = useState(resource.category);
  const [editReason, setEditReason] = useState(resource.reason || "");
  const [editNotes, setEditNotes] = useState(resource.notes || "");
  const [editTags, setEditTags] = useState(resource.tags.join(", "));

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

  async function handleEdit() {
    setSaving(true);
    const formData = new FormData();
    formData.set("title", editTitle);
    formData.set("url", editUrl);
    formData.set("category", editCategory);
    formData.set("reason", editReason);
    formData.set("notes", editNotes);
    formData.set("tags", editTags);
    const result = await editResource(resource.id, formData);
    setSaving(false);
    if (result?.success) {
      setEditing(false);
      router.refresh();
    }
  }

  async function handleCancel() {
    setEditing(false);
    setEditTitle(resource.title);
    setEditUrl(resource.url);
    setEditCategory(resource.category);
    setEditReason(resource.reason || "");
    setEditNotes(resource.notes || "");
    setEditTags(resource.tags.join(", "));
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

  const contentVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="panel-detail outline-none"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Resource</span>
        <div className="flex items-center gap-1">
          {!editing && (
            <button onClick={() => setEditing(true)} aria-label="Edit resource" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
          <button onClick={onClose} aria-label="Close panel" className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Title</label>
            <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">URL</label>
            <Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="h-9 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Category</label>
            <Select value={editCategory} onValueChange={(v) => v && setEditCategory(v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(catColor).map((c) => (
                  <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Why I saved this</label>
            <Textarea value={editReason} onChange={(e) => setEditReason(e.target.value)} rows={3} className="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Notes</label>
            <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={4} className="text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Tags</label>
            <Input value={editTags} onChange={(e) => setEditTags(e.target.value)} placeholder="react, typescript" className="h-9 text-sm" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleEdit} disabled={saving} size="sm" className="h-9 text-sm gap-1">
              <Save className="h-4 w-4" />{saving ? "Saving..." : "Save"}
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="h-9 text-sm">Cancel</Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible">
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isFav ? "bg-primary/10" : "bg-muted"}`}>
                  <Bookmark className={`h-4 w-4 ${isFav ? "text-primary" : "text-secondary-foreground"}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground leading-tight">{resource.title}</h2>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded capitalize ${catColor[resource.category] || "bg-muted text-muted-foreground"}`}>{resource.category}</span>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                      <Globe className="h-3 w-3" />
                      {domain}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {resource.reason && (
              <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible">
                <div className="rounded-lg bg-muted/50 px-4 py-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Why I saved this</p>
                  <p className="text-sm text-foreground/80 leading-relaxed">{resource.reason}</p>
                </div>
              </motion.div>
            )}

            {resource.notes && (
              <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{resource.notes}</p>
                </div>
              </motion.div>
            )}

            {resource.tags.length > 0 && (
              <motion.div custom={3} variants={contentVariants} initial="hidden" animate="visible">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div custom={4} variants={contentVariants} initial="hidden" animate="visible">
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/20">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          </div>

          <div className="shrink-0 flex items-center gap-2 px-5 py-3 border-t border-border/30">
            <button
              onClick={handleFavorite}
              disabled={favPending}
              aria-label={isFav ? "Unfavorite" : "Favorite"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isFav ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} />
              {isFav ? "Favorited" : "Favorite"}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Delete resource"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
