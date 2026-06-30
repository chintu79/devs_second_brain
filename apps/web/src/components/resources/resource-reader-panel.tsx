"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Heart, ExternalLink, Trash2, Globe, Calendar, Copy, Check, Bookmark, ChevronDown, ChevronRight, FolderKanban, FileText, Sparkles, Link2, Lock, Unlock, Loader2, Brain } from "lucide-react";
import { Markdown } from "@devventory/shared";
import { slideInRight } from "@devventory/motion";
import { Backlinks } from "@/components/shared/backlinks";
import { deleteResource, toggleFavorite, editResource } from "@/actions/resources";
import { getReferences, type ItemType } from "@/actions/references";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InlineEditor } from "@/components/shared/inline-editor";
import { TagInput } from "@/components/shared/tag-input";
import { IconBtn } from "@devventory/shared";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@devventory/ui";
import Link from "next/link";
import { useAutosave } from "@/hooks/use-autosave";
import { RESOURCE_CATEGORY_COLORS } from "@devventory/types";

/* ─── Types ─── */

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

interface LinkItem { id: string; type: ItemType; title: string; }
interface ReferenceGroup { type: ItemType; items: LinkItem[]; }

const typeConfig: Record<string, { icon: React.ElementType; color: string; href: (id: string) => string }> = {
  resource: { icon: Bookmark, color: "#14B8A6", href: (id) => `/resources/${id}` },
  note: { icon: FileText, color: "#22C55E", href: (id) => `/notes?id=${id}` },
  prompt: { icon: Sparkles, color: "#F59E0B", href: (id) => `/prompts/${id}` },
  project: { icon: FolderKanban, color: "#8B5CF6", href: (id) => `/projects/${id}` },
};

/* ─── Component ─── */

export function ResourceReaderPanel({
  resource, onClose, onUpdate, onTagClick, autoEdit = false,
}: {
  resource: Resource;
  onClose: () => void;
  onUpdate?: (data: Partial<Resource> & { id: string }) => void;
  onTagClick?: (tag: string) => void;
  autoEdit?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [isFav, setIsFav] = useState(resource.favorite);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(!autoEdit);
  const [editTitle, setEditTitle] = useState(resource.title);
  const [editUrl, setEditUrl] = useState(resource.url);
  const [editCategory, setEditCategory] = useState(resource.category);
  const [editReason, setEditReason] = useState(resource.reason || "");
  const [editNotes, setEditNotes] = useState(resource.notes || "");
  const [editTags, setEditTags] = useState(resource.tags.slice(0, 3).join(", "));
  const [connections, setConnections] = useState<ReferenceGroup[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);

  useEffect(() => {
    getReferences("resource", resource.id).then((groups) => {
      setConnections(groups);
      setConnectionsLoading(false);
    });
  }, [resource.id]);

  useEffect(() => {
    if (locked) {
      setEditTitle(resource.title);
      setEditUrl(resource.url);
      setEditCategory(resource.category);
      setEditReason(resource.reason || "");
      setEditNotes(resource.notes || "");
      setEditTags(resource.tags.slice(0, 3).join(", "));
    }
  }, [resource, locked]);

  async function handleCopy() {
    await navigator.clipboard.writeText(resource.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (deleting) return;
    if (!confirm("Delete this resource?")) return;
    setDeleting(true);
    onClose();
    deleteResource(resource.id).then(() => {
      toast.success("Resource deleted");
      router.refresh();
    }).catch(() => toast.error("Failed to delete"));
  }

  async function handleFavorite() {
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

  const draftData = { title: editTitle, url: editUrl, category: editCategory, reason: editReason, notes: editNotes, tags: editTags };

  const handleAutosave = useCallback(async (data: typeof draftData) => {
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("url", data.url);
    formData.set("category", data.category);
    formData.set("reason", data.reason);
    formData.set("notes", data.notes);
    formData.set("tags", data.tags);
    const result = await editResource(resource.id, formData);
    if (result?.success) {
      onUpdate?.({ id: resource.id, title: data.title, url: data.url, category: data.category, notes: data.notes, reason: data.reason, tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean) });
      router.refresh();
    }
  }, [resource.id, onUpdate, router]);

  const { status, saveNow } = useAutosave({ data: draftData, onSave: handleAutosave, delay: 2000, enabled: !locked });

  function handleToggleLock() {
    if (locked) { setLocked(false); }
    else { saveNow(); setLocked(true); }
  }

  let domain = resource.url;
  try { domain = new URL(resource.url).hostname.replace("www.", ""); } catch {}

  const blended = !locked ? "opacity-50 pointer-events-none" : "";

  return (
    <motion.div variants={slideInRight} initial="initial" animate="animate" exit="exit" className="panel-detail outline-none">
      {/* ─── Header Toolbar ─── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-2">
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-foreground bg-primary/10 hover:bg-primary/20 transition-all">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
          <IconBtn icon={Heart} label={isFav ? "Unfavorite" : "Favorite"} onClick={handleFavorite} disabled={favPending} className={`!h-auto !w-auto gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${isFav ? "bg-amber-500/10 text-amber-400" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"}`}>
            <Heart className={`h-3.5 w-3.5 ${isFav ? "fill-current" : ""}`} /> {isFav ? "Favorited" : "Favorite"}
          </IconBtn>
          <IconBtn icon={Copy} label="Copy URL" onClick={handleCopy} className="!h-auto !w-auto gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60">
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied!" : "Copy URL"}
          </IconBtn>
        </div>
        <div className="flex items-center gap-1">
          {!locked && status !== "idle" && (
            <span className="text-xs mr-2">
              {status === "saving" && <><Loader2 className="h-3 w-3 animate-spin inline mr-1 text-muted-foreground" /><span className="text-muted-foreground">Saving...</span></>}
              {status === "saved" && <span className="text-emerald-400">Saved</span>}
              {status === "error" && <span className="text-red-400">Error saving</span>}
            </span>
          )}
          <IconBtn icon={Lock} label={locked ? "Unlock to edit" : "Lock to save"} onClick={handleToggleLock}>
            {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn icon={Trash2} label="Delete" onClick={handleDelete} disabled={deleting} className="!h-auto !w-auto gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
          <IconBtn icon={X} label="Close" onClick={onClose} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* ─── 1. Header ─── */}
        <div>
          {locked ? (
            <h2 className="text-lg font-semibold text-foreground leading-tight">{resource.title}</h2>
          ) : (
            <input
              className="w-full bg-transparent text-lg font-semibold text-foreground leading-tight outline-none border-b border-border/30 pb-0.5 focus:border-primary/40 transition-colors"
              value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Untitled resource"
            />
          )}
          <div className="flex items-center gap-2.5 mt-2">
            {locked ? (
              <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded capitalize ${RESOURCE_CATEGORY_COLORS[resource.category] || "bg-muted text-muted-foreground"}`}>{resource.category}</span>
            ) : (
              <Select value={editCategory} onValueChange={(v) => v && setEditCategory(v)}>
                <SelectTrigger className="h-6 text-[11px] font-medium px-1.5 py-0.5 rounded capitalize border-border/40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(RESOURCE_CATEGORY_COLORS).map((c) => (
                    <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {locked ? (
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                <Globe className="h-3 w-3" /> {domain} <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <div className="inline-flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground shrink-0" />
                <input className="bg-transparent text-xs text-muted-foreground outline-none border-b border-border/30 focus:border-primary/40 transition-colors min-w-[200px]" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="https://..." />
              </div>
            )}
          </div>
        </div>

        {/* ─── 2. Why I Saved This (always prominent) ─── */}
        {(!locked || resource.reason) && (
          <div>
            <div className="rounded-xl border border-border/60 bg-card/80 p-4">
              <div className="flex items-start gap-2.5">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 mt-0.5">
                  <Heart className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground mb-2">Why I saved this</p>
                  {locked ? (
                    <div className="text-sm text-foreground/80 leading-relaxed">
                      <Markdown>{resource.reason as string}</Markdown>
                    </div>
                  ) : (
                    <InlineEditor content={editReason} onChange={setEditReason} editable placeholder="Why did you save this? Capturing this matters before you forget." />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 3. AI Summary (placeholder) ─── */}
        {locked && (
          <div className={`rounded-xl border border-border/30 bg-muted/20 p-4 ${blended}`}>
            <div className="flex items-start gap-2.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 mt-0.5">
                <Brain className="h-3 w-3 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground mb-1">AI Summary</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {resource.reason
                    ? `Based on your note, this resource relates to "${resource.reason.slice(0, 60)}...". AI-powered summaries and learning recommendations will appear here.`
                    : `Save a reason for this resource and AI will generate an executive summary, difficulty estimate, related technologies, and learning order.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── 4. Personal Notes ─── */}
        {(!locked || resource.notes) && (
          <div className={blended}>
            <div className="border-t border-border/20 pt-4">
              <p className="text-xs font-semibold text-foreground mb-2.5">Personal Notes</p>
              {locked ? (
                <div className="text-sm text-foreground/80 leading-relaxed note-prose">
                  <Markdown>{resource.notes as string}</Markdown>
                </div>
              ) : (
                <InlineEditor content={editNotes} onChange={setEditNotes} editable placeholder="Capture your thoughts, takeaways, and how this connects to your work..." />
              )}
            </div>
          </div>
        )}

        {/* ─── 5. Connected Knowledge ─── */}
        {(!connectionsLoading || connections.length > 0) && (
          <div className={blended}>
            <div className="border-t border-border/20 pt-4 space-y-4">
              {!connectionsLoading && connections.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <Link2 className="h-3 w-3" /> Connected items ({connections.reduce((a, g) => a + g.items.length, 0)})
                  </p>
                  <div className="space-y-2.5">
                    {connections.map((group) => {
                      const cfg = typeConfig[group.type];
                      if (!cfg) return null;
                      const Icon = cfg.icon;
                      return (
                        <div key={group.type}>
                          <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                            <Icon className="h-3 w-3" /> {group.type}s ({group.items.length})
                          </div>
                          <div className="space-y-0.5">
                            {group.items.slice(0, 5).map((item) => (
                              <Link key={`${item.type}:${item.id}`} href={cfg.href(item.id)} className="group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150">
                                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                                <span className="truncate">{item.title}</span>
                              </Link>
                            ))}
                            {group.items.length > 5 && <p className="text-xs text-muted-foreground px-2.5">+{group.items.length - 5} more</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <Backlinks title={resource.title} excludeId={resource.id} />
            </div>
          </div>
        )}

        {/* ─── 6. Tags ─── */}
        <div className={blended}>
          <div className="border-t border-border/20 pt-4">
            <p className="text-xs font-semibold text-foreground mb-2.5">Tags</p>
            {locked ? (
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.map((tag) => (
                  onTagClick ? (
                    <button key={tag} onClick={() => { onTagClick(tag); onClose(); }} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded hover:text-foreground hover:bg-muted hover:scale-[1.03] transition-all duration-150">
                      {tag}
                    </button>
                  ) : (
                    <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">{tag}</span>
                  )
                ))}
              </div>
            ) : (
              <TagInput value={editTags} onChange={setEditTags} placeholder="Add tags..." />
            )}
          </div>
        </div>

        {/* ─── 7. Metadata (collapsed) ─── */}
        <div className={blended}>
          <div className="border-t border-border/20 pt-4">
            <button onClick={() => setMetadataOpen(!metadataOpen)} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-full text-left">
              {metadataOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Details
            </button>
            {metadataOpen && (
              <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />Saved {new Date(resource.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                <div className="flex items-center gap-2"><Globe className="h-3 w-3" />{domain}</div>
                <div className="flex items-center gap-2"><Bookmark className="h-3 w-3" />{resource.category}</div>
                <div className="flex items-center gap-2"><ExternalLink className="h-3 w-3" /><a href={resource.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground truncate transition-colors">{resource.url}</a></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
