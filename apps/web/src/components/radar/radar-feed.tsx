"use client";

import { useMemo, useRef } from "react";
import { Search, Radio, TrendingUp, Sparkles } from "lucide-react";
import { RepositoryCard } from "./repository-card";
import type { Repository } from "@/lib/mock-data";

interface RadarFeedProps {
  repos: Repository[];
  sections: { id: string; label: string; repos: Repository[] }[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onBookmark: (id: string) => void;
  relevantCount: number;
}

export function RadarFeed({
  repos, sections, searchQuery, onSearchChange, onBookmark, relevantCount,
}: RadarFeedProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    const matched = repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
    );
    return [{ id: "search", label: `Results for "${searchQuery}"`, repos: matched }];
  }, [repos, sections, searchQuery]);

  const isEmpty = filteredSections.length === 0 || (filteredSections.length === 1 && filteredSections[0].repos.length === 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-background px-5 pt-4 pb-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search repositories, technologies, categories..."
            className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="px-5 py-4 pb-12 space-y-8">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
              <Radio className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">Nothing important changed for your current interests today</h3>
            <p className="text-sm text-muted-foreground">Try a different section or check back tomorrow</p>
          </div>
        ) : (
          <>
            {/* Daily Brief header */}
            {!searchQuery && (
              <div className="rounded-xl border border-border/20 bg-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-semibold text-foreground">Today's Brief</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  {relevantCount > 0
                    ? `${relevantCount} ${relevantCount === 1 ? "update matters" : "updates matter"} to you today.`
                    : "No updates matched your topics today."}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                  {relevantCount > 0 && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3 text-primary" /> {relevantCount} relevant</span>}
                  <span>{repos.length} total repositories</span>
                </div>
              </div>
            )}

            {/* Progressive sections */}
            {filteredSections.map((section) => (
              <section key={section.id} className="w-full">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">{section.label}</h2>
                  <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{section.repos.length}</span>
                </div>
                <div className="space-y-3">
                  {section.repos.map((repo) => (
                    <RepositoryCard
                      key={repo.id}
                      repo={repo}
                      matchingUserTags={(repo as any).matchingUserTags}
                      onSelect={(id) => window.open(repo.url, "_blank")}
                      onBookmark={onBookmark}
                    />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
