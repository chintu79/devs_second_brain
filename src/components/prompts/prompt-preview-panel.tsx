"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Markdown } from "@/components/shared/markdown";
import { X, Star, Copy, Pencil, Trash2, ExternalLink, Sparkles, Hash, Clock, Calendar, Bookmark, Check } from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { deletePrompt, toggleFavorite, recordPromptUsage, editPrompt } from "@/actions/prompts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface PromptPreviewPanelProps {
  prompt: Prompt;
  onClose: () => void;
  onUpdate: () => void;
}

const categoryColors: Record<string, string> = {
  coding: "bg-sky-500/10 text-sky-400",
  debugging: "bg-rose-500/10 text-rose-400",
  architecture: "bg-purple-500/10 text-purple-400",
  testing: "bg-emerald-500/10 text-emerald-400",
  docs: "bg-amber-500/10 text-amber-400",
  writing: "bg-pink-500/10 text-pink-400",
};

export function PromptPreviewPanel({ prompt: initialPrompt, onClose, onUpdate }: PromptPreviewPanelProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(initialPrompt.favorite);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const [copyPending, setCopyPending] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrompt(initialPrompt);
    setIsFav(initialPrompt.favorite);
    setEditing(false);
  }, [initialPrompt]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [prompt.id]);

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    await toggleFavorite(prompt.id);
    setFavPending(false);
  }

  async function handleCopy() {
    if (copyPending) return;
    setCopyPending(true);
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    await recordPromptUsage(prompt.id);
    setCopyPending(false);
    onUpdate();
  }

  async function handleDelete() {
    if (confirm("Delete this prompt?")) {
      setDeleting(true);
      await deletePrompt(prompt.id);
      onClose();
    }
  }

  async function handleEdit(formData: FormData) {
    setSaving(true);
    const result = await editPrompt(prompt.id, formData);
    setSaving(false);
    if (result?.success) {
      setEditing(false);
      setPrompt((prev) => ({
        ...prev,
        title: formData.get("title") as string,
        prompt: formData.get("prompt") as string,
        category: formData.get("category") as string,
        useCase: (formData.get("useCase") as string) || "",
        tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
      }));
      onUpdate();
    }
  }

  const catColor = categoryColors[prompt.category] || "bg-muted text-muted-foreground";

  const contentVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, delay: 0.05 + i * 0.04, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
  };

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="panel-detail outline-none min-h-0"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Prompt</span>
        <div className="flex items-center gap-1">
          {!editing && (
            <>
              <button
                onClick={handleCopy}
                disabled={copyPending}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Copy (⌘+Enter)"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Edit"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <div className="w-px h-4 bg-border/50 mx-1" />
            </>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
            title="Close (ESC)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="flex-1 overflow-y-auto">
          <EditForm prompt={prompt} onSave={handleEdit} onCancel={() => setEditing(false)} saving={saving} />
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Title + actions */}
              <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="flex items-start gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isFav ? "bg-amber-500/10" : "bg-muted"}`}>
                  <Sparkles className={`h-4 w-4 ${isFav ? "text-amber-400" : "text-secondary-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{prompt.title}</h2>
                    <button onClick={handleFavorite} disabled={favPending} aria-label={isFav ? "Unfavorite prompt" : "Favorite prompt"} className={`shrink-0 ${isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"} transition-colors`}>
                      <Star className={`h-4 w-4 ${isFav ? "fill-amber-400" : ""}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2.5 mt-1">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${catColor}`}>{prompt.category}</span>
                    {prompt.useCase && <span className="text-sm text-secondary-foreground">{prompt.useCase}</span>}
                  </div>
                </div>
              </motion.div>

              {/* Usage stats */}
              <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Hash className="h-3.5 w-3.5" />
                    Times Used
                  </div>
                  <p className="text-base font-medium text-foreground">{prompt.useCount}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3.5 w-3.5" />
                    Last Used
                  </div>
                  <p className="text-base font-medium text-foreground">{prompt.lastUsedAt ? formatRelative(prompt.lastUsedAt) : "Never"}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Created
                  </div>
                  <p className="text-base font-medium text-foreground">{formatDate(prompt.createdAt)}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Bookmark className="h-3.5 w-3.5" />
                    Use Case
                  </div>
                  <p className="text-base font-medium text-foreground truncate">{prompt.useCase || "General"}</p>
                </div>
              </motion.div>

              {/* Tags */}
              {prompt.tags.length > 0 && (
                <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible">
                  <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Prompt content as markdown */}
              <motion.div custom={3} variants={contentVariants} initial="hidden" animate="visible">
                <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-2">Prompt</h3>
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="note-prose">
                    <Markdown components={{
                      code: ({ className, children, ...props }) => {
                        const m = /language-(\w+)/.exec(className || "");
                        if (!className || !m) return <code className="inline-code" {...props}>{children}</code>;
                        return (
                          <div className="code-block-wrapper">
                            <div className="code-block-header"><span className="code-block-lang">{m[1]}</span></div>
                            <pre className="code-block has-header"><code className={className} {...props}>{children}</code></pre>
                          </div>
                        );
                      },
                      blockquote: ({ children, ...props }) => <blockquote className="note-blockquote" {...props}>{children}</blockquote>,
                      a: ({ children, href, ...props }) => <a className="note-link" href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                      ul: ({ children, ...props }) => <ul className="note-list" {...props}>{children}</ul>,
                      ol: ({ children, ...props }) => <ol className="note-list" {...props}>{children}</ol>,
                      table: ({ children, ...props }) => <div className="note-table-wrapper"><table className="note-table" {...props}>{children}</table></div>,
                    }}>
                      {prompt.prompt}
                    </Markdown>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="shrink-0 border-t border-border/30 px-5 py-3 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Button onClick={handleCopy} disabled={copyPending} variant="default" size="sm" className="h-9 text-sm gap-1.5">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="h-9 text-sm gap-1.5">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <div className="flex-1" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

function EditForm({
  prompt,
  onSave,
  onCancel,
  saving,
}: {
  prompt: Prompt;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <form action={onSave} className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Title</Label>
        <Input id="edit-title" name="title" defaultValue={prompt.title} required className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-category" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Category</Label>
        <Select name="category" defaultValue={prompt.category}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="debugging">Debugging</SelectItem>
            <SelectItem value="architecture">Architecture</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="docs">Documentation</SelectItem>
            <SelectItem value="writing">Writing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-useCase" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Use Case</Label>
        <Input id="edit-useCase" name="useCase" defaultValue={prompt.useCase} placeholder="Code review, Bug fixing" className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-tags" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Tags</Label>
        <Input id="edit-tags" name="tags" defaultValue={prompt.tags.join(", ")} placeholder="react, typescript" className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-prompt" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Prompt</Label>
        <Textarea id="edit-prompt" name="prompt" defaultValue={prompt.prompt} rows={10} className="text-sm font-mono" required />
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/30 mt-4">
        <Button type="submit" disabled={saving} size="sm" className="h-8 text-xs">
          {saving ? "Saving..." : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} size="sm" className="h-8 text-xs">
          Cancel
        </Button>
      </div>
    </form>
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

function formatDate(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
