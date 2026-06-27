"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ChevronDown } from "lucide-react";
import { ResourceItem } from "./resource-item";
import { ResourceFilters } from "./resource-filters";
import { ResourceEmpty } from "./resource-empty";
import { ResourceDialog } from "@/components/vaults/resource-dialog";
import { fetchMoreResources } from "@/actions/resources";
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
  initialItems: Resource[];
  nextCursor: string | null;
  allCategories: string[];
  allTags: string[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  selectedCategory?: string | null;
  selectedTag?: string | null;
  sortBy?: "newest" | "oldest";
  onCategoryChange?: (cat: string | null) => void;
  onTagChange?: (tag: string | null) => void;
  onSortChange?: (sort: "newest" | "oldest") => void;
  onItemsUpdate?: (items: Resource[]) => void;
}

export function ResourceList({ initialItems, nextCursor: initialCursor, allCategories, allTags, selectedId, onSelect, selectedCategory = null, selectedTag = null, sortBy = "newest", onCategoryChange, onTagChange, onSortChange, onItemsUpdate }: ResourceListProps) {
  const [items, setItems] = useState<Resource[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const setCategory = onCategoryChange || ((cat: string | null) => {});
  const setTag = onTagChange || ((tag: string | null) => {});
  const changeSort = onSortChange || ((sort: "newest" | "oldest") => {});
  const [dialogOpen, setDialogOpen] = useState(false);

  async function loadMore() {
    if (loading || !cursor) return;
    setLoading(true);
    const result = await fetchMoreResources(cursor, 20);
    if (result) {
      const updated = [...items, ...result.items];
      setItems(updated);
      onItemsUpdate?.(updated);
      setCursor(result.nextCursor);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...items];

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
  }, [items, searchQuery, selectedCategory, selectedTag, sortBy]);

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

          <ResourceFilters
            allCategories={allCategories}
            allTags={allTags}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            sortBy={sortBy}
            onCategoryChange={setCategory}
            onTagChange={setTag}
            onSortChange={changeSort}
          />

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{items.length} resources</span>
            <span className="text-border">&middot;</span>
            <span>{filtered.length} shown</span>
            {sections.favorites.length > 0 && (
              <>
                <span className="text-border">&middot;</span>
                <span className="text-amber-400">{sections.favorites.length} favorites</span>
              </>
            )}
          </div>

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
                        <ResourceItem resource={r} isSelected={selectedId === r.id} onSelect={onSelect} />
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
                        <ResourceItem resource={r} isSelected={selectedId === r.id} onSelect={onSelect} />
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
                        <ResourceItem resource={r} isSelected={selectedId === r.id} onSelect={onSelect} />
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
                        <ResourceItem resource={r} isSelected={selectedId === r.id} onSelect={onSelect} />
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
                        <ResourceItem resource={r} isSelected={selectedId === r.id} onSelect={onSelect} />
                      </motion.div>
                    ))}
                  </motion.div>
                </Section>
              )}

              {cursor && (
                <div className="flex justify-center pt-2 pb-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:scale-[1.02] transition-all duration-150 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    {loading ? "Loading..." : "Load more"}
                  </button>
                </div>
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
