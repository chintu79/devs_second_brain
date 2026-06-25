"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ResourceItem } from "./resource-item";
import { ResourceFilters } from "./resource-filters";
import { ResourceEmpty } from "./resource-empty";
import { ResourceDialog } from "@/components/vaults/resource-dialog";
import { stagger, fadeInUp } from "@/lib/motion";

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

interface ResourceListProps {
  resources: Resource[];
  allCategories: string[];
  allTags: string[];
}

type SortBy = "newest" | "oldest" | "recently-opened";

export function ResourceList({ resources, allCategories, allTags }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...resources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.url.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q) ||
          r.reason?.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q)) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (selectedTag) {
      result = result.filter((r) => r.tags.includes(selectedTag));
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return result;
  }, [resources, searchQuery, selectedCategory, selectedTag, sortBy]);

  const sections = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      favorites: filtered.filter((r) => r.favorite),
      today: filtered.filter((r) => !r.favorite && r.createdAt >= today),
      thisWeek: filtered.filter((r) => !r.favorite && r.createdAt < today && r.createdAt >= thisWeek),
      thisMonth: filtered.filter((r) => !r.favorite && r.createdAt < thisWeek && r.createdAt >= thisMonth),
      earlier: filtered.filter((r) => !r.favorite && r.createdAt < thisMonth),
    };
  }, [filtered]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <>
      <div className="space-y-5">
          {/* Large Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources, repositories, articles..."
              className="flex h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 items-center gap-2 hidden sm:flex">
              <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-muted">⌘K</kbd>
            </div>
          </div>

          {/* Filters */}
          <ResourceFilters
            allCategories={allCategories}
            allTags={allTags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSortChange={setSortBy}
          />

          {/* Section counts */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{resources.length} resources</span>
            <span className="text-border">&middot;</span>
            <span>{filtered.length} shown</span>
            {sections.favorites.length > 0 && (
              <>
                <span className="text-border">&middot;</span>
                <span className="text-red-400">{sections.favorites.length} favorites</span>
              </>
            )}
          </div>

          {/* Resource sections */}
          {filtered.length === 0 ? (
            <ResourceEmpty hasSearch={hasSearch} searchQuery={searchQuery} onCreate={() => setDialogOpen(true)} />
          ) : (
            <div className="space-y-10">
              {sections.favorites.length > 0 && (
                <Section label="Favorites" count={sections.favorites.length}>
                  <motion.div
                    variants={stagger.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {sections.favorites.map((r) => (
                      <motion.div key={r.id} variants={fadeInUp}>
                        <ResourceItem resource={r} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}

              {sections.today.length > 0 && (
                <Section label="Today" count={sections.today.length}>
                  <motion.div
                    variants={stagger.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {sections.today.map((r) => (
                      <motion.div key={r.id} variants={fadeInUp}>
                        <ResourceItem resource={r} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}

              {sections.thisWeek.length > 0 && (
                <Section label="This Week" count={sections.thisWeek.length}>
                  <motion.div
                    variants={stagger.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {sections.thisWeek.map((r) => (
                      <motion.div key={r.id} variants={fadeInUp}>
                        <ResourceItem resource={r} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}

              {sections.thisMonth.length > 0 && (
                <Section label="This Month" count={sections.thisMonth.length}>
                  <motion.div
                    variants={stagger.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {sections.thisMonth.map((r) => (
                      <motion.div key={r.id} variants={fadeInUp}>
                        <ResourceItem resource={r} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}

              {sections.earlier.length > 0 && (
                <Section label="Earlier" count={sections.earlier.length}>
                  <motion.div
                    variants={stagger.container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    {sections.earlier.map((r) => (
                      <motion.div key={r.id} variants={fadeInUp}>
                        <ResourceItem resource={r} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}
            </div>
          )}
        </div>

      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

function Section({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">{label}</h2>
        <span className="text-[11px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{count}</span>
      </div>
      {children}
    </section>
  );
}
