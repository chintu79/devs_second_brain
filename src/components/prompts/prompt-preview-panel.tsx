"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Markdown } from "@/components/shared/markdown";
import { InlineEditor } from "@/components/shared/inline-editor";
import { TagInput } from "@/components/shared/tag-input";
import {
  X, Star, Copy, Lock, Unlock, Trash2, Hash,
  Clock, Calendar, ChevronDown, ChevronRight, Link2,
  FolderKanban, FileText, Bookmark, Check, MessageSquare,
  Sparkles, Play,
} from "lucide-react";
import { slideInRight } from "@/lib/motion";
import { Backlinks } from "@/components/shared/backlinks";
import { deletePrompt, toggleFavorite, recordPromptUsage, editPrompt } from "@/actions/prompts";
import { getReferences, type ItemType } from "@/actions/references";
import { useAutosave, type SaveStatus } from "@/hooks/use-autosave";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IconBtn } from "@/components/shared/icon-btn";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { PROMPT_CATEGORY_COLORS } from "@/lib/constants";

/* ─── Types ─── */

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

interface LinkItem { id: string; type: ItemType; title: string; }
interface ReferenceGroup { type: ItemType; items: LinkItem[]; }

const typeConfig: Record<string, { icon: React.ElementType; color: string; href: (id: string) => string }> = {
  resource: { icon: Bookmark, color: "#14B8A6", href: (id) => `/resources/${id}` },
  note: { icon: FileText, color: "#22C55E", href: (id) => `/notes?id=${id}` },
  prompt: { icon: Star, color: "#F59E0B", href: (id) => `/prompts/${id}` },
  project: { icon: FolderKanban, color: "#8B5CF6", href: (id) => `/projects/${id}` },
};

const statusLabel: Record<SaveStatus, string> = { idle: "", saving: "Saving\u2026", saved: "Saved", error: "Error saving" };
const statusColor: Record<SaveStatus, string> = { idle: "", saving: "text-muted-foreground", saved: "text-green-400", error: "text-destructive" };

/* ─── Helpers ─── */

function extractVars(text: string): string[] {
  const vars = new Set<string>();
  const re = /\{\{(\w+)\}\}/g;
  let m;
  while ((m = re.exec(text))) vars.add(m[1]);
  return Array.from(vars);
}

function fillVars(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] || `{{${key}}}`);
}

function HighlightedPrompt({ content }: { content: string }) {
  const parts = content.split(/(\{\{[^}]*\}\})/);
  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground/85">
      {parts.map((part, i) =>
        part.startsWith("{{") && part.endsWith("}}") ? (
          <span key={i} className="text-amber-400 bg-amber-400/10 px-0.5 rounded font-medium">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </div>
  );
}

/* ─── Component ─── */

export function PromptPreviewPanel({ prompt: initialPrompt, onClose, onUpdate, onTagClick, autoEdit = false }: PromptPreviewPanelProps) {
  const router = useRouter();
  const [locked, setLocked] = useState(!autoEdit);
  const [isFav, setIsFav] = useState(initialPrompt.favorite);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [favPending, setFavPending] = useState(false);
  const [copyPending, setCopyPending] = useState(false);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [connections, setConnections] = useState<ReferenceGroup[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(true);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState(initialPrompt.title);
  const [category, setCategory] = useState(initialPrompt.category);
  const [useCase, setUseCase] = useState(initialPrompt.useCase);
  const [promptContent, setPromptContent] = useState(initialPrompt.prompt);
  const [tagsString, setTagsString] = useState(initialPrompt.tags.slice(0, 3).join(", "));

  const variables = useMemo(() => extractVars(locked ? prompt.prompt : promptContent), [locked, prompt.prompt, promptContent]);
  const [varValues, setVarValues] = useState<Record<string, string>>({});

  useEffect(() => { setVarValues({}); }, [prompt.id]);

  useEffect(() => {
    const isNew = initialPrompt.id !== prompt.id;
    setPrompt(initialPrompt);
    setIsFav(initialPrompt.favorite);
    setTitle(initialPrompt.title);
    setCategory(initialPrompt.category);
    setUseCase(initialPrompt.useCase);
    setPromptContent(initialPrompt.prompt);
    setTagsString(initialPrompt.tags.slice(0, 3).join(", "));
    if (isNew) setLocked(!autoEdit);
  }, [initialPrompt]);

  useEffect(() => { panelRef.current?.focus(); }, [prompt.id]);

  useEffect(() => {
    getReferences("prompt", prompt.id).then((groups) => {
      setConnections(groups);
      setConnectionsLoading(false);
    });
  }, [prompt.id]);

  const editData = useMemo(() => ({ title, category, useCase, prompt: promptContent, tags: tagsString }), [title, category, useCase, promptContent, tagsString]);

  const handleAutosave = useCallback(async (data: typeof editData) => {
    const fd = new FormData();
    fd.set("title", data.title);
    fd.set("category", data.category);
    fd.set("useCase", data.useCase);
    fd.set("tags", data.tags);
    fd.set("prompt", data.prompt);
    const result = await editPrompt(prompt.id, fd);
    if (!result?.success) throw new Error(result?.error || "Save failed");
    setPrompt((prev) => ({ ...prev, title: data.title, category: data.category, useCase: data.useCase, prompt: data.prompt, tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean) }));
    onUpdate();
  }, [prompt.id, onUpdate]);

  const { status, saveNow } = useAutosave({ data: editData, onSave: handleAutosave, delay: 2000, enabled: !locked });

  async function handleToggleLock() {
    if (locked) { setLocked(false); } else { await saveNow(); setPrompt((prev) => ({ ...prev, title, category, useCase, prompt: promptContent, tags: tagsString.split(",").map((t) => t.trim()).filter(Boolean) })); setLocked(true); }
  }

  async function handleFavorite() {
    if (favPending) return;
    setFavPending(true);
    setIsFav(!isFav);
    try { await toggleFavorite(prompt.id); } catch { setIsFav(isFav); toast.error("Failed to toggle favorite"); }
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

  function handleUseInChat() {
    const text = variables.length > 0 ? fillVars(prompt.prompt, varValues) : prompt.prompt;
    navigator.clipboard.writeText(text);
    window.open("/chat", "_blank");
  }

  async function handleDelete() {
    if (!confirm("Delete this prompt?")) return;
    setDeleting(true);
    onClose();
    deletePrompt(prompt.id).then(() => toast.success("Prompt deleted")).catch(() => toast.error("Failed to delete"));
  }

  const catColor = PROMPT_CATEGORY_COLORS[prompt.category] || "bg-muted text-muted-foreground";
  const showStatus = !locked && status !== "idle";

  /* ─── Render ─── */

  return (
    <motion.div ref={panelRef} tabIndex={-1} variants={slideInRight} initial="initial" animate="animate" exit="exit" className="panel-detail outline-none min-h-0">
      {/* Header Toolbar */}
      <div className={`flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0 transition-opacity ${!locked ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-2">
          {showStatus && <span className={`text-xs ${statusColor[status]}`}>{statusLabel[status]}</span>}
          {locked && (
            <>
              <IconBtn icon={Copy} label="Copy prompt" onClick={handleCopy} disabled={copyPending} className="!h-9 !w-auto gap-1.5 px-3 text-sm">
                <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
              </IconBtn>
              <IconBtn icon={MessageSquare} label="Use in Chat" onClick={handleUseInChat} className="!h-9 !w-auto gap-1.5 px-3 text-sm bg-primary/10 hover:bg-primary/20 text-primary">
                <MessageSquare className="h-4 w-4" /> Use
              </IconBtn>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <IconBtn icon={Star} label={isFav ? "Unfavorite" : "Favorite"} onClick={handleFavorite} disabled={favPending} className={isFav ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"} iconClass={isFav ? "fill-amber-400" : ""} />
          {!locked && (
            <IconBtn icon={Copy} label="Copy prompt" onClick={handleCopy} disabled={copyPending}>
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            </IconBtn>
          )}
          <div className="w-px h-4 bg-border/50 mx-1" />
          <IconBtn icon={Lock} label={locked ? "Unlock to edit" : "Lock"} onClick={handleToggleLock}>
            {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          </IconBtn>
          <IconBtn icon={Trash2} label="Delete" onClick={handleDelete} disabled={deleting} className="!h-9 !w-auto gap-1.5 px-3 text-sm text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> Delete
          </IconBtn>
          <IconBtn icon={X} label="Close" onClick={onClose} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* ─── 1. Title + Category ─── */}
          <div>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                {locked ? (
                  <h2 className="text-lg font-semibold text-foreground">{prompt.title}</h2>
                ) : (
                  <input className="w-full bg-transparent text-lg font-semibold text-foreground outline-none border-b border-border/30 pb-0.5 focus:border-primary/40 transition-colors" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled prompt" />
                )}
                <div className="flex items-center gap-2.5 mt-1">
                  {locked ? (
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize ${catColor}`}>{prompt.category}</span>
                  ) : (
                    <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
                      <SelectTrigger className="h-6 text-xs font-medium px-1.5 py-0.5 rounded capitalize border-border/40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coding">Coding</SelectItem>
                        <SelectItem value="debugging">Debugging</SelectItem>
                        <SelectItem value="architecture">Architecture</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="docs">Documentation</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── 2. Use Case ─── */}
          {(locked ? prompt.useCase : true) && (
            <div>
              <div className="rounded-xl border border-border/60 bg-card/80 p-4">
                <div className="flex items-start gap-2.5">
                  <Hash className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground mb-1">What this solves</p>
                    {locked ? (
                      <p className="text-sm text-foreground/80 leading-relaxed">{prompt.useCase || "Describe what problem this prompt solves."}</p>
                    ) : (
                      <InlineEditor content={useCase} onChange={setUseCase} editable placeholder="Describe the problem this prompt solves..." />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── 3. Prompt Body (with variable highlighting) ─── */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2.5">Prompt</p>
            <div className="rounded-xl border border-border/60 bg-card p-5">
              {locked ? (
                <div className="note-prose">
                  {variables.length > 0 ? <HighlightedPrompt content={prompt.prompt} /> : <Markdown>{prompt.prompt}</Markdown>}
                </div>
              ) : (
                <InlineEditor content={promptContent} onChange={setPromptContent} editable placeholder="Write your prompt..." />
              )}
            </div>
          </div>

          {/* ─── 4. Usage Stats (prominent when used) ─── */}
          {locked && (prompt.useCount > 0 || prompt.lastUsedAt) && (
            <div className={`transition-opacity ${!locked ? "opacity-50" : ""}`}>
              <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1.5"><Hash className="h-3 w-3" /> Used {prompt.useCount} time{prompt.useCount !== 1 ? "s" : ""}</span>
                {prompt.lastUsedAt && (
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Last used {new Date(prompt.lastUsedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                )}
              </div>
            </div>
          )}

          {/* ─── 5. Playground ─── */}
          {locked && variables.length > 0 && (
            <div className="border-t border-border/20 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setPlaygroundOpen(!playgroundOpen)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {playgroundOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <Play className="h-3 w-3" /> Playground ({variables.length} variable{variables.length > 1 ? "s" : ""})
                </button>
              </div>
              {playgroundOpen && (
                <div className="space-y-3 rounded-xl border border-border/40 bg-card p-4">
                  <div className="grid gap-2">
                    {variables.map((v) => (
                      <div key={v} className="flex items-center gap-2">
                        <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded shrink-0">{`{{${v}}}`}</span>
                        <input
                          value={varValues[v] || ""}
                          onChange={(e) => setVarValues((prev) => ({ ...prev, [v]: e.target.value }))}
                          placeholder={`Enter ${v}...`}
                          className="flex-1 h-8 rounded-md border border-border/40 bg-background px-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={async () => {
                        const filled = fillVars(prompt.prompt, varValues);
                        await navigator.clipboard.writeText(filled);
                        toast.success("Filled prompt copied");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                    >
                      <Copy className="h-3 w-3" /> Copy filled
                    </button>
                    <button
                      onClick={() => {
                        const filled = fillVars(prompt.prompt, varValues);
                        navigator.clipboard.writeText(filled);
                        window.open("/chat", "_blank");
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-foreground bg-muted/60 hover:bg-muted/80 transition-all"
                    >
                      <MessageSquare className="h-3 w-3" /> Use in Chat
                    </button>
                  </div>
                  {Object.values(varValues).some(Boolean) && (
                    <div className="border-t border-border/20 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-1.5">Preview</p>
                      <div className="rounded-lg bg-muted/20 p-3">
                        <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/70">
                          <HighlightedPrompt content={fillVars(prompt.prompt, varValues)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── 6. Connected Knowledge ─── */}
          {(!connectionsLoading || connections.length > 0) && (
            <div className={`transition-opacity ${!locked ? "opacity-50" : ""}`}>
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
                <Backlinks title={prompt.title} excludeId={prompt.id} />
              </div>
            </div>
          )}

          {/* ─── 7. Tags ─── */}
          <div className={`transition-opacity ${!locked ? "opacity-50" : ""}`}>
            <div className="border-t border-border/20 pt-4">
              <p className="text-xs font-semibold text-foreground mb-2.5">Tags</p>
              {locked ? (
                <div className="flex flex-wrap gap-1.5">
                  {prompt.tags.map((tag) => (
                    onTagClick ? (
                      <button key={tag} onClick={() => { onTagClick(tag); onClose(); }} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded hover:text-foreground hover:bg-muted hover:scale-[1.03] transition-all duration-150">{tag}</button>
                    ) : (
                      <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">{tag}</span>
                    )
                  ))}
                </div>
              ) : (
                <TagInput value={tagsString} onChange={setTagsString} placeholder="Add tags..." />
              )}
            </div>
          </div>

          {/* ─── 8. Metadata (collapsed) ─── */}
          <div className={`transition-opacity ${!locked ? "opacity-50" : ""}`}>
            <div className="border-t border-border/20 pt-4">
              <button onClick={() => setMetadataOpen(!metadataOpen)} className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                {metadataOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Details
              </button>
              {metadataOpen && (
                <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Created {new Date(prompt.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                  <div className="flex items-center gap-2"><Hash className="h-3 w-3" /> Category: {prompt.category}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PromptPreviewPanelProps {
  prompt: Prompt;
  onClose: () => void;
  onUpdate: () => void;
  onTagClick?: (tag: string) => void;
  autoEdit?: boolean;
}
