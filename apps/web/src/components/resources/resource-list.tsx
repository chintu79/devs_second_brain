"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ChevronDown, X, Bookmark } from "lucide-react";
import { ResourceItem } from "./resource-item";
import { EmptyState } from "@devventory/shared";
import { fetchMoreResources, createResource } from "@/actions/resources";
import { fadeInUp, stagger } from "@devventory/motion";

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
  favoritesOnly?: boolean;
}

export function ResourceList({ initialItems, nextCursor: initialCursor, selectedId, onSelect, selectedCategory = null, selectedTag = null, sortBy = "newest", onCategoryChange, onTagChange, onItemsUpdate, favoritesOnly }: ResourceListProps) {
  const [items, setItems] = useState<Resource[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const setCategory = onCategoryChange || ((cat: string | null) => {});
  const setTag = onTagChange || ((tag: string | null) => {});


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

    if (favoritesOnly) {
      result = result.filter((r) => r.favorite);
    }

    result.sort((a, b) => {
      if (sortBy === "newest") return b.createdAt.getTime() - a.createdAt.getTime();
      return a.createdAt.getTime() - b.createdAt.getTime();
    });

    return result;
  }, [items, searchQuery, selectedCategory, selectedTag, sortBy]);

  const hasSearch = searchQuery.trim().length > 0;
  const hasFilters = selectedCategory || selectedTag;
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onSelect || filtered.length === 0) return;
      const currentIndex = selectedId ? filtered.findIndex((r) => r.id === selectedId) : -1;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = filtered.length - 1;
        if (nextIndex >= filtered.length) nextIndex = 0;
        const nextId = filtered[nextIndex].id;
        onSelect(nextId);
        cardRefs.current.get(nextId)?.scrollIntoView({ block: "nearest" });
      }

      if (e.key === "Escape" && selectedId) {
        e.preventDefault();
        onSelect(null);
      }
    },
    [selectedId, filtered, onSelect]
  );

  function setCardRef(id: string, el: HTMLDivElement | null) {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }

  return (
    <div ref={listRef} tabIndex={-1} onKeyDown={handleKeyDown} className="outline-none">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, repositories, articles..."
            className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 items-center gap-2 hidden sm:flex">
            <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-muted">⌘K</kbd>
          </div>
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all">
                {selectedCategory}
                <button onClick={() => setCategory(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/60 transition-all">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all">
                {selectedTag}
                <button onClick={() => setTag(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/60 transition-all">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => { setCategory(null); setTag(null); }}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Count */}
        <div className="text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            hasSearch={hasSearch}
            searchQuery={searchQuery}
            searchLabel="resources"
            emptyTitle="Nothing saved yet"
            emptyDescription="Paste your first repository, article, video, or documentation. Every resource you save becomes part of your developer knowledge."
            actionLabel="Add Resource"
            onCreate={async () => {
              const formData = new FormData();
              formData.set("title", "");
              formData.set("url", "");
              formData.set("category", "frontend");
              formData.set("notes", "");
              formData.set("reason", "");
              formData.set("tags", "");
              const result = await createResource(formData);
              if (result.success && result.id) {
                window.location.href = `/resources?id=${result.id}&new=true`;
              }
            }}
          />
        ) : (
          <div className="space-y-2">
            <motion.div variants={stagger.container} initial="hidden" animate="visible" className="divide-y divide-border/20">
              {filtered.map((r) => (
                <motion.div key={r.id} variants={fadeInUp} ref={(el) => setCardRef(r.id, el as HTMLDivElement | null)}>
                  <ResourceItem resource={r} isSelected={r.id === selectedId} onSelect={onSelect} />
                </motion.div>
              ))}
            </motion.div>

            {cursor && (
              <div className="pt-4 pb-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="w-full py-2 text-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all cursor-pointer disabled:opacity-50"
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
    </div>
  );
}
