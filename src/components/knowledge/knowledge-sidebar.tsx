"use client";

import { Search, Hash, TrendingUp, Clock, Moon, Sparkles } from "lucide-react";
import type { TagWithMeta } from "./knowledge-workspace";

interface Collection {
  label: string; icon: typeof Hash; tags: TagWithMeta[]; color: string;
}

interface KnowledgeSidebarProps {
  collections: {
    frequentlyUsed: TagWithMeta[];
    currentlyLearning: TagWithMeta[];
    recentlyUsed: TagWithMeta[];
    dormant: TagWithMeta[];
  };
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedTag: string | null;
  onSelect: (name: string) => void;
  relativeTime: (t: Date) => string;
}

export function KnowledgeSidebar({
  collections, searchQuery, onSearchChange, selectedTag, onSelect, relativeTime,
}: KnowledgeSidebarProps) {
  const sections: Collection[] = [
    { label: "Currently Learning", icon: Sparkles, tags: collections.currentlyLearning, color: "#22C55E" },
    { label: "Frequently Used", icon: TrendingUp, tags: collections.frequentlyUsed, color: "#8B5CF6" },
    { label: "Recently Used", icon: Clock, tags: collections.recentlyUsed, color: "#14B8A6" },
    { label: "Dormant", icon: Moon, tags: collections.dormant, color: "#D84B64" },
  ];

  return (
    <div className="h-full w-72 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Knowledge Map</span>
      </div>

      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search topics..."
            className="w-full h-8 rounded-md border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-3">
        {!searchQuery.trim() ? sections.map((section) => {
          if (section.tags.length === 0) return null;
          const Icon = section.icon;
          return (
            <div key={section.label}>
              <div className="flex items-center gap-1.5 px-3 py-1.5">
                <Icon className="h-3 w-3" style={{ color: section.color }} />
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{section.label}</span>
                <span className="text-[10px] text-muted-foreground/50 ml-auto">{section.tags.length}</span>
              </div>
              <div className="space-y-0.5">
                {section.tags.map((tag) => {
                  const active = selectedTag === tag.name;
                  return (
                    <button
                      key={tag.id}
                      onClick={() => onSelect(tag.name)}
                      className={`sidebar-item w-full text-sm ${active ? "sidebar-item-active" : "hover:scale-[1.02]"}`}
                    >
                      <Hash className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left truncate">{tag.name}</span>
                      <span className={`text-[10px] font-medium shrink-0 ${section.label === "Currently Learning" ? "text-[#22C55E]" : "text-muted-foreground"}`}>
                        {section.label === "Currently Learning" ? `+${tag.itemsLast30Days}` : section.label === "Dormant" ? relativeTime(tag.lastActivity) : tag.totalCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }) : (
          <div className="space-y-0.5 pt-1">
            {collections.frequentlyUsed.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className="text-xs text-muted-foreground">No matching topics</p>
              </div>
            ) : (
              collections.frequentlyUsed.slice(0, 30).map((tag) => {
                const active = selectedTag === tag.name;
                return (
                  <button
                    key={tag.id}
                    onClick={() => onSelect(tag.name)}
                    className={`sidebar-item w-full text-sm ${active ? "sidebar-item-active" : "hover:scale-[1.02]"}`}
                  >
                    <Hash className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left truncate">{tag.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{tag.totalCount}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
