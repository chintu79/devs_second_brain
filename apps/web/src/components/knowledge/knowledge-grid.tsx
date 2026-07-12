"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, Inbox } from "lucide-react";
import { KnowledgeCard } from "./knowledge-card";
import { fetchMoreKnowledgeItems } from "@/actions/knowledge";
import { useProcessingPoller } from "@/hooks/use-processing-poller";
import { stagger } from "@devventory/motion";
import { useSafeVariants } from "@/hooks/use-safe-variants";
import type { KnowledgeItemType as BaseItem } from "@/components/resources/readers/reader-registry";

interface KnowledgeItemType extends BaseItem {
  collectionIds?: string[];
}

interface KnowledgeGridProps {
  initialItems: KnowledgeItemType[];
  nextCursor: string | null;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  selectedTag?: string | null;
  onTagChange?: (tag: string | null) => void;
  collectionId?: string | null;
  onCollectionChange?: (id: string | null) => void;
  filter?: string | null;
  onFilterChange?: (filter: string | null) => void;
}

export function KnowledgeGrid({
  initialItems, nextCursor: initialCursor, selectedId, onSelect,
  selectedTag = null, onTagChange, collectionId = null, onCollectionChange, filter, onFilterChange,
}: KnowledgeGridProps) {
  const [items, setItems] = useState<KnowledgeItemType[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gridVariants = useSafeVariants(stagger.container);

  useProcessingPoller(items, (id, status) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, captureStatus: status } : i)));
  });

  async function loadMore() {
    if (loading || !cursor) return;
    setLoading(true);
    const result = await fetchMoreKnowledgeItems(cursor, 20);
    if (result) {
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...items];
    if (selectedTag) result = result.filter((r) => r.tags.includes(selectedTag));
    if (collectionId) result = result.filter((r) => r.collectionIds?.includes(collectionId));
    return result;
  }, [items, selectedTag, collectionId]);

  const hasFilters = selectedTag || collectionId || filter;
  const FILTER_LABELS: Record<string, string> = { favorites: "Favorites", recent: "Recent", archive: "Archive", trash: "Trash" };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!onSelect || filtered.length === 0) return;
      const currentIndex = selectedId ? filtered.findIndex((r) => r.id === selectedId) : -1;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        let nextIndex = currentIndex + 1;
        if (nextIndex >= filtered.length) nextIndex = 0;
        onSelect(filtered[nextIndex].id);
        cardRefs.current.get(filtered[nextIndex].id)?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        let nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = filtered.length - 1;
        onSelect(filtered[nextIndex].id);
        cardRefs.current.get(filtered[nextIndex].id)?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Escape" && selectedId) {
        e.preventDefault();
        onSelect(null);
      }
    },
    [selectedId, filtered, onSelect]
  );

  return (
    <div ref={gridRef} tabIndex={-1} onKeyDown={handleKeyDown} className="outline-none overflow-y-auto h-full w-full">
      <div className="p-5 w-full">
        {hasFilters && (
          <div className="flex items-center gap-2 mb-4">
            {selectedTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted/50 text-muted-foreground/80">
                #{selectedTag}
                <button onClick={() => onTagChange?.(null)} aria-label="Remove tag filter" className="flex items-center justify-center min-w-[44px] min-h-[44px] -my-1.5 -mr-1 hover:text-foreground">&times;</button>
              </span>
            )}
            {collectionId && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted/50 text-muted-foreground/80">
                Collection
                <button onClick={() => onCollectionChange?.(null)} aria-label="Remove collection filter" className="flex items-center justify-center min-w-[44px] min-h-[44px] -my-1.5 -mr-1 hover:text-foreground">&times;</button>
              </span>
            )}
            {filter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-muted/50 text-muted-foreground/80">
                {FILTER_LABELS[filter] || filter}
                <button onClick={() => onFilterChange?.(null)} aria-label="Clear filter" className="flex items-center justify-center min-w-[44px] min-h-[44px] -my-1.5 -mr-1 hover:text-foreground">&times;</button>
              </span>
            )}
            <button onClick={() => { onTagChange?.(null); onCollectionChange?.(null); }} className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors">
              Clear
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-5">
              <Inbox className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1.5">Nothing saved yet</h3>
            <p className="text-sm text-secondary-foreground max-w-sm leading-relaxed">
              Capture your first link, note, or document.
            </p>
          </motion.div>
        )}

        {filtered.length > 0 && (
          <>
            {!hasFilters && (
              <div className="mb-3">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            <motion.div
              className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,280px)] auto-rows-[200px] gap-3 w-full"
              variants={gridVariants}
              initial={gridVariants ? "hidden" : undefined}
              animate={gridVariants ? "visible" : undefined}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((r, i) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className="h-full"
                    ref={(el) => { if (el) cardRefs.current.set(r.id, el as HTMLDivElement); else cardRefs.current.delete(r.id); }}
                  >
                    <KnowledgeCard
                      item={r}
                      isSelected={r.id === selectedId}
                      onSelect={(id) => {
                        onSelect?.(id);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
              {cursor && !loading && (
                <motion.button
                  key="load-more"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={loadMore}
                  aria-busy={false}
                  className="w-full flex items-center justify-center gap-1.5 py-4 mt-2 text-xs text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  Load more
                </motion.button>
              )}

              {loading && (
                <motion.div
                  key="spinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  aria-live="polite"
                  className="flex items-center justify-center py-4"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" aria-label="Loading more items" />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
