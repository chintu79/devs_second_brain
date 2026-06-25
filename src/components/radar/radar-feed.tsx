"use client";

import { useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Radio } from "lucide-react";
import { RepositoryCard } from "./repository-card";
import { stagger, fadeInUp } from "@/lib/motion";
import type { Repository } from "@/lib/mock-data";

interface RadarFeedProps {
  repos: Repository[];
  sections: { id: string; label: string; repos: Repository[] }[];
  selectedId: string | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
  onSave: (id: string) => void;
}

export function RadarFeed({
  repos, sections, selectedId, searchQuery, onSearchChange, onSelect, onBookmark, onSave,
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto" onKeyDown={handleKeyDown}>
      {/* Search */}
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

      {/* Feed */}
      <div className="px-5 py-4 pb-12 space-y-8">
        {filteredSections.length === 0 || (filteredSections.length === 1 && filteredSections[0].repos.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
              <Radio className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">No repositories found</h3>
            <p className="text-sm text-muted-foreground">Try a different search or filter</p>
          </div>
        ) : (
          filteredSections.map((section) => (
            <Section key={section.id} label={section.label} count={section.repos.length}>
              {section.repos.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
                  Nothing to show yet in this section
                </div>
              ) : (
                <motion.div
                  className="space-y-3"
                  variants={stagger.container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-30px" }}
                >
                  {section.repos.map((repo) => (
                    <motion.div key={repo.id} variants={fadeInUp}>
                      <RepositoryCard
                        repo={repo}
                        selected={selectedId === repo.id}
                        onSelect={onSelect}
                        onBookmark={onBookmark}
                        onSave={onSave}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Section>
          ))
        )}
      </div>
    </div>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">{label}</h2>
        <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{count}</span>
      </div>
      {children}
    </section>
  );
}
