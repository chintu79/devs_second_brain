"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  X,
  Star,
  Copy,
  Check,
  Lock,
  Unlock,
  Trash2,
  Clock,
  FileText,
  Sparkles,
  Link2,
  Layers,
  Bot,
} from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { formatRelative, formatDate } from "@/lib/utils";
import { deleteNote, toggleNoteFavorite, editNote } from "@/actions/notes";
import { toast } from "sonner";
import { aiSummarize } from "@/actions/ai";
import { useRouter } from "next/navigation";
import { IconBtn } from "@/components/shared/icon-btn";
import { InlineEditor } from "@/components/shared/inline-editor";
import { TagInput } from "@/components/shared/tag-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAutosave } from "@/hooks/use-autosave";
import { NOTE_CATEGORY_COLORS } from "@/lib/constants";

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
  onTagClick?: (tag: string) => void;
  autoEdit?: boolean;
}

export function NoteReaderPanel({
  note: initialNote,
  allNotes,
  allResources,
  allPrompts,
  allProjects,
  onClose,
  onUpdate,
  onTagClick,
  autoEdit = false,
}: NoteReaderPanelProps) {
  const router = useRouter();
  const [note, setNote] = useState(initialNote);
  const [isFav, setIsFav] = useState(initialNote.favorite);
  const [locked, setLocked] = useState(!autoEdit);
  const [draftTitle, setDraftTitle] = useState(initialNote.title);
  const [draftContent, setDraftContent] = useState(initialNote.content);
  const [draftCategory, setDraftCategory] = useState(initialNote.category);
  const [draftTags, setDraftTags] = useState(initialNote.tags.slice(0, 3).join(", "));
  const [deleting, setDeleting] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [favPending, setFavPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const readingProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const autosaveData = { title: draftTitle, content: draftContent, category: draftCategory, tags: draftTags };
  const { status: saveStatus, saveNow } = useAutosave({
    data: autosaveData,
    onSave: async (data) => {
      const fd = new FormData();
      fd.set("title", data.title);
      fd.set("content", data.content);
      fd.set("category", data.category);
      fd.set("tags", data.tags);
      const result = await editNote(note.id, fd);
      if (result?.success) {
        setNote((prev) => ({
          ...prev,
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
          updatedAt: new Date(),
        }));
        onUpdate();
      }
    },
    enabled: !locked,
    delay: 2000,
  });

  useEffect(() => {
    const isNew = initialNote.id !== note.id;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNote(initialNote);
    setIsFav(initialNote.favorite);
    if (isNew) setLocked(!autoEdit);
    setDraftTitle(initialNote.title);
    setDraftContent(initialNote.content);
    setDraftCategory(initialNote.category);
    setDraftTags(initialNote.tags.slice(0, 3).join(", "));
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [initialNote]);

  useEffect(() => {
    panelRef.current?.focus();
  }, [note.id]);

  async function handleCopy() {
    await navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try {
      await toggleNoteFavorite(note.id);
    } catch {
      setIsFav(isFav);
      toast.error("Failed to toggle favorite");
    }
    setFavPending(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this note?")) return;
    setDeleting(true);
    onClose();
    deleteNote(note.id).then(() => {
      toast.success("Note deleted");
    }).catch(() => toast.error("Failed to delete"));
  }

  async function handleSummarize() {
    if (summarizing || summary) return;
    setSummarizing(true);
    const res = await aiSummarize(note.content);
    setSummarizing(false);
    if (res.summary) setSummary(res.summary);
  }

  async function handleToggleLock() {
    if (locked) {
      setLocked(false);
    } else {
      await saveNow();
      setLocked(true);
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

  const backlinks = allNotes.filter((n) => n.id !== note.id && new RegExp(`\\b${note.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(n.content)).slice(0, 3);

  const wordCount = note.content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

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
      {/* Header with actions */}
      <div className={`flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0 transition-opacity duration-200 ${!locked ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-2">
          {!locked && saveStatus !== "idle" && (
            <span className={`text-xs ${
              saveStatus === "saving" ? "text-muted-foreground" :
              saveStatus === "saved" ? "text-green-400" :
              "text-destructive"
            }`}>
              {saveStatus === "saving" ? "Saving..." :
               saveStatus === "saved" ? "Saved" :
               "Error"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn icon={Star} label={isFav ? "Unfavorite" : "Favorite"} onClick={handleFavorite} disabled={favPending} className={isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"} iconClass={isFav ? "fill-amber-400" : ""} />
          <IconBtn icon={Bot} label={summary ? "Summary available" : "AI Summarize"} onClick={handleSummarize} disabled={summarizing} className={summary ? "text-primary" : "text-muted-foreground hover:text-foreground"} />
          <IconBtn icon={Copy} label="Copy" onClick={handleCopy} className="text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn icon={Lock} label={locked ? "Unlock to edit" : "Lock and save"} onClick={handleToggleLock}>
            {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn icon={Trash2} label="Delete" onClick={handleDelete} disabled={deleting} className="text-destructive hover:bg-destructive/10">
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
          <div className="w-px h-4 bg-border/50 mx-1" />
          <IconBtn icon={X} label="Close" onClick={onClose} />
        </div>
      </div>

      {/* Reading progress bar */}
      <motion.div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 to-primary origin-left z-10" style={{ scaleX: readingProgress }} />

      {/* Content area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="flex h-full">
          {/* Reader / Editor */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <article className="max-w-[68ch] mx-auto px-8 py-8">
              {/* Title */}
              {locked ? (
                <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-4 leading-snug">{note.title}</h1>
              ) : (
                <input
                  className="w-full bg-transparent text-2xl font-semibold tracking-tight text-foreground leading-snug outline-none border-b border-border/30 pb-0.5 mb-4 focus:border-primary/40 transition-colors"
                  value={draftTitle}
                  onChange={e => setDraftTitle(e.target.value)}
                  placeholder="Untitled note"
                />
              )}

              {/* Consolidated metadata */}
              <div className={`flex items-center gap-2 text-xs text-muted-foreground mb-8 flex-wrap ${!locked ? "opacity-50" : ""}`}>
                {locked ? (
                  <span className={`px-1.5 py-0.5 rounded capitalize ${NOTE_CATEGORY_COLORS[note.category] || "bg-muted text-muted-foreground"}`}>
                    {note.category}
                  </span>
                ) : (
                  <Select value={draftCategory} onValueChange={v => v && setDraftCategory(v)}>
                    <SelectTrigger className="h-5 text-[11px] font-medium px-1.5 py-0.5 rounded capitalize border-border/40">
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
                )}
                <span className="text-muted-foreground/30">&middot;</span>
                <Clock className="h-3 w-3" />
                <span>{readingTime} min read</span>
                <span className="text-muted-foreground/30">&middot;</span>
                <span>{wordCount} words</span>
                <span className="text-muted-foreground/30">&middot;</span>
                <span>Updated {formatRelative(note.updatedAt)}</span>
                <span className="text-muted-foreground/30">&middot;</span>
                <span>Created {formatDate(note.createdAt)}</span>
              </div>

              {/* Content (appears right after title — no interruptions) */}
              <InlineEditor content={locked ? note.content : draftContent} onChange={setDraftContent} editable={!locked} placeholder="Start writing..." />

              {/* Tags */}
              <div className="mt-8">
                {locked ? (
                  note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => onTagClick?.(tag)}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  <TagInput value={draftTags} onChange={setDraftTags} placeholder="Add tags..." />
                )}
              </div>

              {/* AI Summary (appears after content) */}
              {summary && (
                <div className={`mt-8 rounded-lg border border-primary/20 bg-primary/[0.03] p-4 ${!locked ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-1.5 text-xs text-primary font-semibold uppercase tracking-[0.1em] mb-2">
                    <Bot className="h-3.5 w-3.5" />
                    AI Summary
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{summary}</p>
                </div>
              )}
            </article>
          </div>

          {/* Context panel */}
          <div className="w-60 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-6 transition-opacity duration-200 opacity-50">
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
                        <ContextItem key={n.id} label={n.title} subtitle={n.category} onClick={() => { onClose?.(); setTimeout(() => router.push(`/notes?id=${n.id}`), 50); }} />
                      ))}
                    </ContextSection>
                  )}

                  {relatedResources.length > 0 && (
                    <ContextSection icon={Link2} label="Resources">
                      {relatedResources.map((r) => (
                        <ContextItem key={r.id} label={r.title} subtitle={r.category} onClick={() => router.push(`/resources?id=${r.id}`)} />
                      ))}
                    </ContextSection>
                  )}

                  {relatedPrompts.length > 0 && (
                    <ContextSection icon={Sparkles} label="Prompts">
                      {relatedPrompts.map((p) => (
                        <ContextItem key={p.id} label={p.title} subtitle={p.category} onClick={() => router.push(`/prompts?id=${p.id}`)} />
                      ))}
                    </ContextSection>
                  )}

                  {relatedProjects.length > 0 && (
                    <ContextSection icon={Layers} label="Projects">
                      {relatedProjects.map((p) => (
                        <ContextItem key={p.id} label={p.title} subtitle={p.tags.slice(0, 2).join(", ")} onClick={() => router.push(`/projects?id=${p.id}`)} />
                      ))}
                    </ContextSection>
                  )}

                  {backlinks.length > 0 && (
                    <ContextSection icon={FileText} label="Backlinks">
                      {backlinks.map((n) => (
                        <ContextItem key={n.id} label={n.title} subtitle="References this note" onClick={() => { onClose?.(); setTimeout(() => router.push(`/notes?id=${n.id}`), 50); }} />
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
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onTagClick?.(tag)}
                      className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-muted text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {relatedNotes.length === 0 &&
              relatedResources.length === 0 &&
              relatedPrompts.length === 0 &&
              relatedProjects.length === 0 &&
              backlinks.length === 0 && (
              <div>
                <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-2">Connections</h3>
                <p className="text-xs text-muted-foreground/60">As your knowledge grows, related notes, resources, and projects will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      
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

function ContextItem({ label, subtitle, onClick }: { label: string; subtitle?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left rounded-md px-2 py-1.5 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 cursor-pointer">
      <p className="text-sm font-medium text-foreground/90 truncate">{label}</p>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </button>
  );
}


