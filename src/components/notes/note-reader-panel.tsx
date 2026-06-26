"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Markdown } from "@/components/shared/markdown";
import {
  X,
  Star,
  Copy,
  Check,
  Pencil,
  Trash2,
  Clock,
  FileText,
  Sparkles,
  Link2,
  Layers,
  Bot,
} from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { deleteNote, toggleNoteFavorite, editNote } from "@/actions/notes";
import { aiSummarize } from "@/actions/ai";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Resource {
  id: string;
  title: string;
  url: string;
  tags: string[];
  category: string;
}

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface NoteReaderPanelProps {
  note: Note;
  allNotes: Note[];
  allResources: Resource[];
  allPrompts: PromptItem[];
  allProjects: Project[];
  onClose: () => void;
  onUpdate: () => void;
}

const categoryColors: Record<string, string> = {
  personal: "bg-sky-500/10 text-sky-400",
  technical: "bg-purple-500/10 text-purple-400",
  learning: "bg-emerald-500/10 text-emerald-400",
  meeting: "bg-amber-500/10 text-amber-400",
  idea: "bg-pink-500/10 text-pink-400",
};

export function NoteReaderPanel({
  note: initialNote,
  allNotes,
  allResources,
  allPrompts,
  allProjects,
  onClose,
  onUpdate,
}: NoteReaderPanelProps) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote);
  const [isFav, setIsFav] = useState(initialNote.favorite);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  async function handleCopy() {
    await navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNote(initialNote);
    setIsFav(initialNote.favorite);
    setEditing(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [initialNote]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [note.id]);

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    await toggleNoteFavorite(note.id);
    setFavPending(false);
  }

  async function handleDelete() {
    if (confirm("Delete this note?")) {
      setDeleting(true);
      await deleteNote(note.id);
      onClose();
    }
  }

  async function handleSummarize() {
    if (summarizing || summary) return;
    setSummarizing(true);
    const res = await aiSummarize(note.content);
    setSummarizing(false);
    if (res.summary) setSummary(res.summary);
  }

  async function handleEdit(formData: FormData) {
    setSaving(true);
    const result = await editNote(note.id, formData);
    setSaving(false);
    if (result?.success) {
      setEditing(false);
      setNote((prev) => ({
        ...prev,
        title: formData.get("title") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as string,
        tags: (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean),
        updatedAt: new Date(),
      }));
      onUpdate();
    }
  }

  // Compute related items
  const relatedNotes = allNotes
    .filter((n) => n.id !== note.id)
    .filter((n) => n.tags.some((t) => note.tags.includes(t)) || n.category === note.category)
    .slice(0, 5);

  const relatedResources = allResources
    .filter((r) => r.tags.some((t) => note.tags.includes(t)) || r.category === note.category)
    .slice(0, 3);

  const relatedPrompts = allPrompts
    .filter((p) => p.tags.some((t) => note.tags.includes(t)) || p.category === note.category)
    .slice(0, 3);

  const relatedProjects = allProjects
    .filter((p) => p.tags.some((t) => note.tags.includes(t)))
    .slice(0, 3);

  const backlinks = allNotes.filter((n) => n.id !== note.id && n.content.includes(note.title)).slice(0, 3);

  const readingTime = Math.max(1, Math.ceil(note.content.split(/\s+/).filter(Boolean).length / 200));

  return (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="panel-detail outline-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Note</span>
        <div className="flex items-center gap-1">
          {!editing && (
            <>
              <button
                onClick={handleFavorite}
                disabled={favPending}
                aria-label={isFav ? "Unfavorite note" : "Favorite note"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isFav ? "fill-amber-400" : ""}`} />
              </button>
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                aria-label={summary ? "Summary available" : "Summarize"}
                className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                  summary ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bot className={`h-3.5 w-3.5 ${summarizing ? "animate-pulse" : ""}`} />
              </button>
              <button
                onClick={() => setEditing(true)}
                aria-label="Edit note"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <div className="w-px h-4 bg-border/50 mx-1" />
            </>
          )}
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {editing ? (
          <EditForm note={note} onSave={handleEdit} onCancel={() => setEditing(false)} saving={saving} />
        ) : (
          <div className="flex h-full">
            {/* Reader */}
            <div className="flex-1 min-w-0 overflow-y-auto">
              <article className="max-w-[68ch] mx-auto px-8 py-8">
                {/* Meta header */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <span className={`px-1.5 py-0.5 rounded capitalize ${categoryColors[note.category] || "bg-muted text-muted-foreground"}`}>
                    {note.category}
                  </span>
                  <span>&middot;</span>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{readingTime} min read</span>
                  <span>&middot;</span>
                  <span>Updated {formatTimeAgo(note.updatedAt)}</span>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-8 leading-snug">
                  {note.title}
                </h1>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-8">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Summary */}
                {summary && (
                  <div className="mb-8 rounded-lg border border-primary/20 bg-primary/[0.03] p-4">
                    <div className="flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-[0.1em] mb-2">
                      <Bot className="h-3.5 w-3.5" />
                      AI Summary
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>
                  </div>
                )}

                {/* Markdown content */}
                <div className="note-prose">
                  <Markdown components={{
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      const isInline = !className && !match;
                      if (isInline) return <code className="inline-code" {...props}>{children}</code>;
                      return (
                        <div className="code-block-wrapper">
                          {match && <div className="code-block-header"><span className="code-block-lang">{match[1]}</span></div>}
                          <pre className={`code-block ${match ? "has-header" : ""}`}><code className={className} {...props}>{children}</code></pre>
                        </div>
                      );
                    },
                    blockquote: ({ children, ...props }) => <blockquote className="note-blockquote" {...props}>{children}</blockquote>,
                    a: ({ children, href, ...props }) => <a className="note-link" href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>,
                    ul: ({ children, ...props }) => <ul className="note-list" {...props}>{children}</ul>,
                    ol: ({ children, ...props }) => <ol className="note-list" {...props}>{children}</ol>,
                    table: ({ children, ...props }) => <div className="note-table-wrapper"><table className="note-table" {...props}>{children}</table></div>,
                  }}>
                    {note.content}
                  </Markdown>
                </div>

                {/* Footer meta */}
                <div className="mt-12 pt-6 border-t border-border/30 text-xs text-muted-foreground">
                  Created {formatDate(note.createdAt)} &middot; Last updated {formatTimeAgo(note.updatedAt)}
                </div>
              </article>
            </div>

            {/* Context panel */}
            <div className="w-60 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-6">
              {(relatedNotes.length > 0 ||
                relatedResources.length > 0 ||
                relatedPrompts.length > 0 ||
                relatedProjects.length > 0 ||
                backlinks.length > 0) && (
                <div>
                  <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-3">
                    Connections
                  </h3>
                  <div className="space-y-4">
                    {relatedNotes.length > 0 && (
                      <ContextSection icon={FileText} label="Related Notes">
                        {relatedNotes.map((n) => (
                          <ContextItem key={n.id} label={n.title} subtitle={n.category} />
                        ))}
                      </ContextSection>
                    )}

                    {relatedResources.length > 0 && (
                      <ContextSection icon={Link2} label="Resources">
                        {relatedResources.map((r) => (
                          <ContextItem key={r.id} label={r.title} subtitle={r.category} />
                        ))}
                      </ContextSection>
                    )}

                    {relatedPrompts.length > 0 && (
                      <ContextSection icon={Sparkles} label="Prompts">
                        {relatedPrompts.map((p) => (
                          <ContextItem key={p.id} label={p.title} subtitle={p.category} />
                        ))}
                      </ContextSection>
                    )}

                    {relatedProjects.length > 0 && (
                      <ContextSection icon={Layers} label="Projects">
                        {relatedProjects.map((p) => (
                          <ContextItem key={p.id} label={p.title} subtitle={p.tags.slice(0, 2).join(", ")} />
                        ))}
                      </ContextSection>
                    )}

                    {backlinks.length > 0 && (
                      <ContextSection icon={FileText} label="Backlinks">
                        {backlinks.map((n) => (
                          <ContextItem key={n.id} label={n.title} subtitle="References this note" />
                        ))}
                      </ContextSection>
                    )}
                  </div>
                </div>
              )}

              {note.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!editing && (
        <div className="shrink-0 border-t border-border/30 px-5 py-2 flex items-center gap-2">
          <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <button
            onClick={handleCopy}
            className="flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ContextSection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ContextItem({ label, subtitle }: { label: string; subtitle?: string }) {
  return (
    <div className="rounded-md px-2 py-1.5 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 cursor-pointer">
      <p className="text-sm font-medium text-foreground/90 truncate">{label}</p>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </div>
  );
}

function EditForm({
  note,
  onSave,
  onCancel,
  saving,
}: {
  note: Note;
  onSave: (data: FormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <form action={onSave} className="max-w-[68ch] mx-auto px-8 py-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-title" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Title</Label>
        <Input id="edit-title" name="title" defaultValue={note.title} required className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-category" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Category</Label>
        <Select name="category" defaultValue={note.category}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="idea">Idea</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-tags" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Tags</Label>
        <Input id="edit-tags" name="tags" defaultValue={note.tags.join(", ")} placeholder="react, typescript" className="h-9 text-sm" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="edit-content" className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Content (Markdown)</Label>
        <Textarea id="edit-content" name="content" defaultValue={note.content} rows={20} className="text-sm font-mono leading-relaxed" required />
      </div>

      <div className="flex items-center gap-2 pt-2">
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

function formatTimeAgo(date: Date): string {
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
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
