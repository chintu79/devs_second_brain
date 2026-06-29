"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Hash, BookOpen, FolderKanban, Lightbulb, FileText, ArrowUpRight, TrendingUp, Sparkles, MoreHorizontal, Merge, Trash2, Brain, Clock, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { deleteTag, mergeTags } from "@/actions/tags";
import type { TagWithMeta } from "./knowledge-workspace";

type Section = "resources" | "notes" | "prompts" | "projects";

interface ConnectedItems {
  resources: { id: string; title: string; createdAt: Date }[];
  notes: { id: string; title: string; createdAt: Date }[];
  prompts: { id: string; title: string; createdAt: Date }[];
  projects: { id: string; title: string; createdAt: Date; status: string }[];
}

interface KnowledgeInspectorProps {
  tag: TagWithMeta;
  connected: ConnectedItems;
  relatedTags: { name: string; count: number }[];
  timeline: { date: Date; label: string; type: string }[];
  suggestions: string[];
  onClose: () => void;
  onTagSelect: (name: string) => void;
  relativeTime: (t: Date) => string;
}

const sectionMeta: Record<string, { label: string; icon: typeof BookOpen; path: string; color: string }> = {
  resources: { label: "Resources", icon: BookOpen, path: "/resources", color: "#14B8A6" },
  notes: { label: "Notes", icon: FileText, path: "/notes", color: "#22C55E" },
  prompts: { label: "Prompts", icon: Lightbulb, path: "/prompts", color: "#F59E0B" },
  projects: { label: "Projects", icon: FolderKanban, path: "/projects", color: "#8B5CF6" },
};

function groupByMonth(items: { date: Date; label: string; type: string }[]) {
  const groups = new Map<string, { label: string; items: typeof items }>();
  for (const item of items) {
    const d = item.date;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const month = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    if (!groups.has(key)) groups.set(key, { label: month, items: [] });
    groups.get(key)!.items.push(item);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a)).slice(0, 6);
}

const typeIcons: Record<string, typeof BookOpen> = {
  resource: BookOpen, note: FileText, prompt: Lightbulb, project: FolderKanban,
};

export function KnowledgeInspector({ tag, connected, relatedTags, timeline, suggestions, onClose, onTagSelect, relativeTime }: KnowledgeInspectorProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [mergeMode, setMergeMode] = useState(false);
  const [mergeTarget, setMergeTarget] = useState("");
  const [deleting, setDeleting] = useState(false);

  const totalConnected = connected.resources.length + connected.notes.length + connected.prompts.length + connected.projects.length;
  const ageDays = Math.round((Date.now() - tag.lastActivity.getTime()) / 86400000);

  const monthlyTimeline = useMemo(() => groupByMonth(timeline), [timeline]);
  const isGrowing = tag.itemsLast30Days > 0;
  const isDormant = !isGrowing && ageDays > 30;

  const knowledgeGaps = useMemo(() => {
    const gaps: string[] = [];
    if (connected.resources.length > 0 && connected.notes.length === 0)
      gaps.push("You've saved resources but haven't written your own notes about this topic yet");
    if (connected.notes.length > 0 && connected.prompts.length === 0)
      gaps.push("You've explored this topic but haven't created prompts to deepen your understanding");
    if (totalConnected > 3 && connected.projects.length === 0)
      gaps.push("Consider starting a project to apply what you've learned");
    if (connected.resources.length > connected.notes.length * 4 && connected.notes.length > 0)
      gaps.push("You consume more than you synthesize — writing notes helps retention");
    return gaps;
  }, [connected, totalConnected]);

  async function handleMerge() {
    if (!mergeTarget.trim()) return;
    try {
      await mergeTags(tag.name, mergeTarget.trim());
      toast.success(`Merged "${tag.name}" into "${mergeTarget.trim()}"`);
      setMergeMode(false);
      onClose();
    } catch { toast.error("Merge failed"); }
  }

  async function handleDelete() {
    if (!confirm(`Delete topic "${tag.name}"? Items will remain but untagged.`)) return;
    setDeleting(true);
    try {
      await deleteTag(tag.id);
      toast.success(`Deleted "${tag.name}"`);
      onClose();
    } catch { toast.error("Delete failed"); }
    finally { setDeleting(false); }
  }

  function goTo(section: string, id: string) {
    router.push(`${sectionMeta[section]?.path || "/"}?id=${id}`);
  }

  const sections: { key: Section; items: { id: string; title: string; createdAt: Date }[] }[] = [
    { key: "notes", items: connected.notes },
    { key: "resources", items: connected.resources },
    { key: "prompts", items: connected.prompts },
    { key: "projects", items: connected.projects },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Hash className="h-5 w-5 shrink-0 text-accent" />
          <h2 className="text-lg font-semibold text-card-foreground truncate">{tag.name}</h2>
          {isGrowing && (
            <span className="text-[11px] text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <TrendingUp className="h-3 w-3" /> Growing
            </span>
          )}
          {isDormant && (
            <span className="text-[11px] text-[#D84B64] bg-[#D84B64]/10 px-2 py-0.5 rounded-full shrink-0">Dormant</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">{totalConnected} {totalConnected === 1 ? "item" : "items"}</span>
          <div className="relative">
            <button onClick={() => setShowActions(!showActions)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-border/40 bg-card shadow-lg py-1 z-10">
                <button onClick={() => { setShowActions(false); setMergeMode(true); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-muted/60 transition-colors">
                  <Merge className="h-3.5 w-3.5" /> Merge into another topic
                </button>
                <button onClick={handleDelete} disabled={deleting} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#D84B64] hover:bg-[#D84B64]/10 transition-colors disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" /> {deleting ? "Deleting..." : "Delete this topic"}
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Status line */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Last active <span className="text-foreground/80 font-medium">{relativeTime(tag.lastActivity)}</span></span>
          <span className="text-muted-foreground/30">|</span>
          <span>{tag.itemsLast30Days > 0 ? `${tag.itemsLast30Days} items this month` : "No recent activity"}</span>
          {tag.growth > 0 && (
            <span className="text-[#22C55E]">{tag.growth}% growth rate</span>
          )}
        </div>

        {/* Merge mode */}
        {mergeMode && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-border/40 bg-card">
            <Merge className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              value={mergeTarget}
              onChange={(e) => setMergeTarget(e.target.value)}
              placeholder="Target topic name..."
              className="flex-1 h-8 text-xs rounded-md border border-border bg-background px-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
            <button onClick={handleMerge} className="h-7 px-3 text-xs font-medium rounded-md bg-accent text-white hover:opacity-90 transition-opacity">Merge</button>
            <button onClick={() => setMergeMode(false)} className="h-7 px-3 text-xs rounded-md text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        )}

        {/* 1. Knowledge Timeline */}
        {monthlyTimeline.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-accent" />
              Learning Timeline
            </h3>
            <div className="rounded-xl border border-border/20 bg-card divide-y divide-border/20 overflow-hidden">
              {monthlyTimeline.map(([key, group]) => (
                <div key={key}>
                  <div className="px-4 py-2 bg-muted/20 text-[11px] font-medium text-muted-foreground uppercase tracking-[0.05em]">{group.label}</div>
                  {group.items.map((item, i) => {
                    const Icon = typeIcons[item.type] || BookOpen;
                    return (
                      <div key={`${item.type}-${item.label}-${i}`} className="flex items-center gap-3 px-4 py-2 text-sm">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" style={{ color: sectionMeta[item.type]?.color }} />
                        <span className="flex-1 truncate text-foreground/80">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{relativeTime(item.date)}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Connected Knowledge */}
        {totalConnected > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.08em] mb-3 flex items-center gap-2">
              <Bookmark className="h-3.5 w-3.5 text-accent" />
              Connected Knowledge
            </h3>
            <div className="space-y-2">
              {sections.map(({ key, items }) => {
                const meta = sectionMeta[key];
                if (!meta) return null;
                const Icon = meta.icon;
                return (
                  <div key={key} className="rounded-xl border border-border/20 bg-card p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5" style={{ color: meta.color }} />
                        <span className="text-xs font-medium text-foreground/80">{meta.label}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{items.length}</span>
                    </div>
                    {items.length > 0 ? (
                      <div className="space-y-0.5">
                        {items.slice(0, 6).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => goTo(key, item.id)}
                            className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-xs text-left text-muted-foreground hover:text-foreground hover:bg-accent/5 transition-all group"
                          >
                            <span className="flex-1 truncate">{item.title}</span>
                            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </button>
                        ))}
                        {items.length > 6 && (
                          <p className="text-[10px] text-muted-foreground/60 px-1.5 pt-0.5">+{items.length - 6} more</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground/60">None yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Knowledge Gaps */}
        {knowledgeGaps.length > 0 && (
          <div className="rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-[#F59E0B]" />
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.08em]">Knowledge Gaps</h3>
            </div>
            <ul className="space-y-1.5">
              {knowledgeGaps.map((g, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-[#F59E0B] mt-0.5 select-none">•</span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 4. Related Topics */}
        {relatedTags.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.08em] mb-2 flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-accent" />
              Related Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {relatedTags.map((rt) => (
                <button
                  key={rt.name}
                  onClick={() => onTagSelect(rt.name)}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-card border border-border/30 text-card-foreground hover:text-accent hover:border-accent/30 transition-all"
                >
                  {rt.name}
                  <span className="text-muted-foreground text-[10px]">{rt.count}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. Suggestions */}
        {suggestions.length > 0 && (
          <div className="rounded-xl border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.08em]">Suggestions</h3>
            </div>
            <ul className="space-y-1.5">
              {suggestions.map((s, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-[#8B5CF6] mt-0.5 select-none">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 6. Metadata (collapsed by default) */}
        <details className="group">
          <summary className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            Topic Metadata
          </summary>
          <div className="mt-2 text-xs text-muted-foreground space-y-1">
            <p>Created {relativeTime(tag.createdAt)}</p>
            <p>{totalConnected} items · {tag.resourceCount} resources · {tag.noteCount} notes · {tag.promptCount} prompts · {tag.projectCount} projects</p>
          </div>
        </details>
      </div>
    </div>
  );
}
