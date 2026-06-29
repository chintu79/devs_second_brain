"use client";

import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { KnowledgeSidebar } from "./knowledge-sidebar";
import { KnowledgeInspector } from "./knowledge-inspector";
import { TrendingUp, Hash, Moon, Sparkles, ArrowUpRight } from "lucide-react";

const NOW = Date.now();
const SEVEN_DAYS = NOW - 7 * 86400000;
const THIRTY_DAYS = NOW - 30 * 86400000;

interface TagCount { id: string; name: string; totalCount: number; resourceCount: number; promptCount: number; noteCount: number; projectCount: number; createdAt: Date; }

interface Resource { id: string; title: string; tags: string[]; createdAt: Date; }
interface PromptItem { id: string; title: string; tags: string[]; createdAt: Date; }
interface Note { id: string; title: string; tags: string[]; createdAt: Date; }
interface Project { id: string; title: string; tags: string[]; createdAt: Date; status: string; }

interface KnowledgeWorkspaceProps {
  tags: TagCount[];
  resources: Resource[];
  prompts: PromptItem[];
  notes: Note[];
  projects: Project[];
}

export interface TagWithMeta extends TagCount {
  lastActivity: Date; itemsLast30Days: number; growth: number;
}

function relative(t: Date): string {
  const diff = NOW - t.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function KnowledgeWorkspace({ tags: initialTags, resources, prompts, notes, projects }: KnowledgeWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const [searchQuery, setSearchQuery] = useState("");

  // Compute per-tag metadata from item dates
  const tagsWithMeta = useMemo<TagWithMeta[]>(() => {
    const activity = new Map<string, { lastActivity: number; itemsLast30Days: number }>();
    function record(tagName: string, createdAt: Date) {
      const ts = createdAt.getTime();
      const prev = activity.get(tagName) || { lastActivity: 0, itemsLast30Days: 0 };
      if (ts > prev.lastActivity) prev.lastActivity = ts;
      if (ts > THIRTY_DAYS) prev.itemsLast30Days++;
      activity.set(tagName, prev);
    }
    for (const r of resources) for (const t of r.tags) record(t, r.createdAt);
    for (const p of prompts) for (const t of p.tags) record(t, p.createdAt);
    for (const n of notes) for (const t of n.tags) record(t, n.createdAt);
    for (const p of projects) for (const t of p.tags) record(t, p.createdAt);

    return initialTags.map((t) => {
      const a = activity.get(t.name);
      return {
        ...t,
        lastActivity: a ? new Date(a.lastActivity) : t.createdAt,
        itemsLast30Days: a?.itemsLast30Days || 0,
        growth: t.totalCount > 0 ? Math.round((a?.itemsLast30Days || 0) / t.totalCount * 100) : 0,
      };
    });
  }, [initialTags, resources, prompts, notes, projects]);

  // Search filter
  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return tagsWithMeta;
    const q = searchQuery.toLowerCase();
    return tagsWithMeta.filter((t) => t.name.toLowerCase().includes(q));
  }, [tagsWithMeta, searchQuery]);

  // Collections for sidebar
  const collections = useMemo(() => ({
    frequentlyUsed: [...tagsWithMeta].sort((a, b) => b.totalCount - a.totalCount).slice(0, 10),
    currentlyLearning: [...tagsWithMeta].filter((t) => t.itemsLast30Days > 0).sort((a, b) => b.itemsLast30Days - a.itemsLast30Days),
    recentlyUsed: [...tagsWithMeta].filter((t) => t.lastActivity.getTime() > SEVEN_DAYS).sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()).slice(0, 10),
    dormant: [...tagsWithMeta].filter((t) => t.totalCount > 0 && t.lastActivity.getTime() < THIRTY_DAYS).sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime()),
  }), [tagsWithMeta]);

  // Overview stats
  const overviewStats = useMemo(() => ({
    activeThisWeek: tagsWithMeta.filter(t => t.lastActivity.getTime() > SEVEN_DAYS).length,
    newThisMonth: tagsWithMeta.reduce((s, t) => s + t.itemsLast30Days, 0),
    dormant: tagsWithMeta.filter(t => t.totalCount > 0 && t.lastActivity.getTime() < THIRTY_DAYS).length,
    total: tagsWithMeta.length,
  }), [tagsWithMeta]);

  const trendingTags = useMemo(() =>
    [...tagsWithMeta].filter((t) => t.itemsLast30Days > 0).sort((a, b) => b.itemsLast30Days - a.itemsLast30Days).slice(0, 5),
    [tagsWithMeta],
  );

  const selectedTagData = useMemo(() => {
    if (!selectedTag) return null;
    return tagsWithMeta.find((t) => t.name === selectedTag) || null;
  }, [selectedTag, tagsWithMeta]);

  const connected = useMemo(() => {
    if (!selectedTag) return { resources: [] as Resource[], notes: [] as Note[], prompts: [] as PromptItem[], projects: [] as Project[] };
    return {
      resources: resources.filter((r) => r.tags.includes(selectedTag)),
      notes: notes.filter((n) => n.tags.includes(selectedTag)),
      prompts: prompts.filter((p) => p.tags.includes(selectedTag)),
      projects: projects.filter((p) => p.tags.includes(selectedTag)),
    };
  }, [selectedTag, resources, notes, prompts, projects]);

  const relatedTags = useMemo(() => {
    if (!selectedTag) return [] as { name: string; count: number }[];
    const all = [
      ...connected.resources.flatMap((r) => r.tags),
      ...connected.notes.flatMap((n) => n.tags),
      ...connected.prompts.flatMap((p) => p.tags),
      ...connected.projects.flatMap((p) => p.tags),
    ];
    const counts = new Map<string, number>();
    for (const t of all) {
      if (t === selectedTag) continue;
      counts.set(t, (counts.get(t) || 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);
  }, [selectedTag, connected]);

  const timeline = useMemo(() => {
    if (!selectedTag) return [] as { date: Date; label: string; type: string }[];
    const items: { date: Date; label: string; type: string }[] = [
      ...connected.resources.map((r) => ({ date: r.createdAt, label: r.title, type: "resource" })),
      ...connected.notes.map((n) => ({ date: n.createdAt, label: n.title, type: "note" })),
      ...connected.prompts.map((p) => ({ date: p.createdAt, label: p.title, type: "prompt" })),
      ...connected.projects.map((p) => ({ date: p.createdAt, label: p.title, type: "project" })),
    ];
    return items.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [selectedTag, connected]);

  const suggestions = useMemo(() => {
    if (!selectedTag || !selectedTagData) return [] as string[];
    const s: string[] = [];
    const ageDays = Math.round((NOW - selectedTagData.lastActivity.getTime()) / 86400000);
    if (ageDays > 14) s.push(`You haven't revisited this topic in ${ageDays} days`);
    const totalConnected = connected.resources.length + connected.notes.length + connected.prompts.length + connected.projects.length;
    if (totalConnected > 20 && selectedTagData.itemsLast30Days === 0) s.push(`${totalConnected} items collected but none reviewed recently`);
    if (connected.resources.length > connected.notes.length * 3 && connected.notes.length > 0)
      s.push(`You consume more than you synthesize — try writing more notes about this topic`);
    if (connected.resources.length > 0 && connected.notes.length === 0)
      s.push(`You have resources but no notes yet — distill what you've learned`);

    if (connected.projects.length === 0 && (connected.resources.length + connected.notes.length + connected.prompts.length > 3))
      s.push(`You have knowledge but no project applying it — start building`);
    return s.slice(0, 4);
  }, [selectedTag, selectedTagData, connected]);

  function handleTagSelect(name: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tag", name);
    router.replace(`/knowledge?${params.toString()}`, { scroll: false });
  }

  function handleClose() {
    router.replace("/knowledge", { scroll: false });
  }

  if (initialTags.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6 max-w-sm">
          <Hash className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Topics will emerge naturally as you build your knowledge</p>
          <p className="text-xs text-muted-foreground/60 mt-1 leading-relaxed">
            Tag resources, notes, prompts, and projects with the same topic to create your first knowledge hub
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <KnowledgeSidebar
        collections={collections}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onSelect={handleTagSelect}
        relativeTime={relative}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {selectedTagData ? (
            <KnowledgeInspector
              key={selectedTag}
              tag={selectedTagData}
              connected={connected}
              relatedTags={relatedTags}
              timeline={timeline}
              suggestions={suggestions}
              onClose={handleClose}
              onTagSelect={handleTagSelect}
              relativeTime={relative}
            />
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-sm font-semibold text-foreground mb-0.5">Knowledge Overview</h2>
                <p className="text-xs text-muted-foreground mb-8">{initialTags.length} topics — your personal knowledge map</p>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { label: "Active This Week", value: overviewStats.activeThisWeek, suffix: "topics", icon: TrendingUp, color: "#22C55E" },
                    { label: "New This Month", value: overviewStats.newThisMonth, suffix: "items", icon: Sparkles, color: "#8A56E2" },
                    { label: "Dormant", value: overviewStats.dormant, suffix: "topics", icon: Moon, color: "#D84B64" },
                    { label: "Total Topics", value: overviewStats.total, suffix: "tags", icon: Hash, color: "#C6488C" },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <div key={card.label} className="rounded-xl border border-border/20 bg-card p-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Icon className="h-3.5 w-3.5" style={{ color: card.color }} />
                          <span className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground font-medium">{card.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-semibold text-foreground">{card.value}</span>
                          <span className="text-[11px] text-muted-foreground">{card.suffix}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {trendingTags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <TrendingUp className="h-3.5 w-3.5 text-[#22C55E]" />
                      <span className="text-xs font-medium text-section-foreground uppercase tracking-[0.08em]">Trending Knowledge</span>
                    </div>
                    <div className="rounded-xl border border-border/20 bg-card divide-y divide-border/20 overflow-hidden">
                      {trendingTags.map((t) => (
                        <button key={t.id} onClick={() => handleTagSelect(t.name)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-150 hover:bg-muted/30 group"
                        >
                          <span className="text-[#22C55E] font-medium text-xs shrink-0">+{t.itemsLast30Days}</span>
                          <span className="flex-1 truncate text-foreground/90">{t.name}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">{relative(t.lastActivity)}</span>
                          <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
