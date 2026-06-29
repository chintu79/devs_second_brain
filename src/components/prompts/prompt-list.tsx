"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, ChevronDown, X, Sparkles } from "lucide-react";
import { PromptCard } from "./prompt-card";
import { PromptPreviewPanel } from "./prompt-preview-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { fetchMorePrompts, createPrompt } from "@/actions/prompts";
import { fadeInUp, stagger } from "@/lib/motion";

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

interface PromptListProps {
  initialItems: Prompt[];
  nextCursor: string | null;
  categories: string[];
  sortMode?: string;
  selectedCategory?: string | null;
  onCategoryChange?: (cat: string | null) => void;
  onTagClick?: (tag: string) => void;
  favoritesOnly?: boolean;
}

export function PromptList({ initialItems, nextCursor: initialCursor, categories, sortMode, selectedCategory, onCategoryChange, onTagClick, favoritesOnly }: PromptListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [items, setItems] = useState<Prompt[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyboardMode, setKeyboardMode] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setCategory = onCategoryChange || ((cat: string | null) => {});

  async function loadMore() {
    if (loading || !cursor) return;
    setLoading(true);
    const result = await fetchMorePrompts(cursor, 20);
    if (result) {
      setItems((prev) => [...prev, ...result.items]);
      setCursor(result.nextCursor);
    }
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...items];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.prompt.toLowerCase().includes(q) ||
          p.useCase.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (favoritesOnly) {
      result = result.filter((p) => p.favorite);
    }

    if (sortMode === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortMode === "popular") {
      result.sort((a, b) => b.useCount - a.useCount);
    } else if (sortMode === "oldest") {
      result.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    return result;
  }, [items, searchQuery, selectedCategory, sortMode]);

  const flatList = filtered;

  const selectedPrompt = useMemo(() => {
    if (!selectedId) return null;
    return flatList.find((p) => p.id === selectedId) || null;
  }, [selectedId, flatList]);

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("id", id);
      } else {
        params.delete("id");
      }
      const qs = params.toString();
      const url = qs ? `/prompts?${qs}` : "/prompts";
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );


  function handleSelect(id: string) {
    setKeyboardMode(false);
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose() {
    setSelectedId(null);
    listRef.current?.focus();
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = selectedId ? flatList.findIndex((p) => p.id === selectedId) : -1;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setKeyboardMode(true);
        const direction = e.key === "ArrowDown" ? 1 : -1;
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = flatList.length - 1;
        if (nextIndex >= flatList.length) nextIndex = 0;
        setSelectedId(flatList[nextIndex].id);
        cardRefs.current.get(flatList[nextIndex].id)?.scrollIntoView({ block: "nearest" });
      }

      if (e.key === "Escape" && selectedId) {
        e.preventDefault();
        handleClose();
      }

      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && selectedId) {
        e.preventDefault();
        if (selectedPrompt) {
          navigator.clipboard.writeText(selectedPrompt.prompt);
        }
      }
    },
    [selectedId, flatList, selectedPrompt]
  );

  function setCardRef(id: string, el: HTMLDivElement | null) {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }

  const hasSearch = searchQuery.trim().length > 0;
  const hasFilters = !!selectedCategory;

  return (
    <div className="flex h-full gap-0" onKeyDown={handleKeyDown}>
      <div className="w-[474px] shrink-0 transition-all duration-200" ref={listRef} tabIndex={-1}>
        <div className="space-y-4 pr-5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, workflows, agents..."
              className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {hasFilters && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all">
                {selectedCategory}
                <button onClick={() => setCategory(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/60 transition-all">
                  <X className="h-3 w-3" />
                </button>
              </span>
              <button
                onClick={() => setCategory(null)}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            {flatList.length} {flatList.length === 1 ? "prompt" : "prompts"}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              hasSearch={hasSearch}
              searchQuery={searchQuery}
              searchLabel="prompts"
              emptyTitle="Create your first reusable workflow"
              emptyDescription="A prompt is not text. It's reusable knowledge. Start with a template and build your personal toolkit of AI workflows, agents, and system instructions."
              actionLabel="Create your first prompt"
              onCreate={async () => {
              const formData = new FormData();
              formData.set("title", "");
              formData.set("prompt", "");
              formData.set("category", "coding");
              formData.set("useCase", "");
              formData.set("tags", "");
              const result = await createPrompt(formData);
              if (result.success && result.id) {
                window.location.href = `/prompts?id=${result.id}&new=true`;
              }
            }}
            />
          ) : (
            <div className="space-y-2">
              <motion.div variants={stagger.container} initial="hidden" animate="visible">
                {flatList.map((p) => (
                  <motion.div key={p.id} variants={fadeInUp}>
                    <PromptCard
                      prompt={p}
                      selected={selectedId === p.id}
                      onSelect={handleSelect}
                    />
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

      <AnimatePresence mode="wait">
        {selectedPrompt && (
          <PromptPreviewPanel
            key={selectedPrompt.id}
            prompt={selectedPrompt}
            onClose={handleClose}
            onUpdate={() => router.refresh()}
            onTagClick={onTagClick}
            autoEdit={searchParams.get("new") === "true"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
