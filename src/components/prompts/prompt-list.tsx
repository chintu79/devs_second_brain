"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PromptCard } from "./prompt-card";
import { PromptPreviewPanel } from "./prompt-preview-panel";
import { PromptFilters } from "./prompt-filters";
import { PromptEmpty } from "./prompt-empty";
import { PromptDialog } from "@/components/vaults/prompt-dialog";
import { stagger, fadeInUp } from "@/lib/motion";

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
  prompts: Prompt[];
  categories: string[];
}

export function PromptList({ prompts, categories }: PromptListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const filtered = useMemo(() => {
    let result = [...prompts];

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

    return result;
  }, [prompts, searchQuery, selectedCategory]);

  const sections = useMemo(() => {
    return {
      favorites: filtered.filter((p) => p.favorite),
      recent: filtered.filter((p) => !p.favorite && p.lastUsedAt).sort((a, b) => (b.lastUsedAt?.getTime() || 0) - (a.lastUsedAt?.getTime() || 0)),
      all: filtered.filter((p) => !p.favorite && !p.lastUsedAt),
    };
  }, [filtered]);

  const flatList = useMemo(() => {
    return [...sections.favorites, ...sections.recent, ...sections.all];
  }, [sections]);

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
  const total = prompts.length;
  const favCount = prompts.filter((p) => p.favorite).length;
  const usedRecently = prompts.filter((p) => p.lastUsedAt).length;

  return (
    <div className="flex h-full gap-0" onKeyDown={handleKeyDown}>
      {/* List side */}
      <div className={`flex-1 min-w-0 ${selectedId ? "border-r border-border/50" : ""} transition-all duration-200`} ref={listRef} tabIndex={-1}>
        <div className="space-y-5 pr-5">
          {/* Large Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, workflows, agents..."
              className="flex h-12 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 items-center gap-2 hidden sm:flex">
            </div>
          </div>

          {/* Filters */}
          <PromptFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>{total} prompt{total !== 1 ? "s" : ""}</span>
            {favCount > 0 && (
              <>
                <span className="text-border">&middot;</span>
                <span className="text-amber-400">{favCount} favorite{favCount !== 1 ? "s" : ""}</span>
              </>
            )}
            {usedRecently > 0 && (
              <>
                <span className="text-border">&middot;</span>
                <span>{usedRecently} recently used</span>
              </>
            )}
          </div>

          {/* Prompt sections */}
          {filtered.length === 0 ? (
            <PromptEmpty hasSearch={hasSearch} searchQuery={searchQuery} onCreate={() => setDialogOpen(true)} />
          ) : (
            <div className="space-y-8">
              {sections.favorites.length > 0 && (
                <Section label="Pinned" count={sections.favorites.length}>
                  {sections.favorites.map((p) => (
                    <motion.div key={p.id} variants={fadeInUp}>
                      <PromptCard
                        prompt={p}
                        selected={selectedId === p.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))}
                </Section>
              )}

              {sections.recent.length > 0 && (
                <Section label="Recently Used" count={sections.recent.length}>
                  {sections.recent.map((p) => (
                    <motion.div key={p.id} variants={fadeInUp}>
                      <PromptCard
                        prompt={p}
                        selected={selectedId === p.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))}
                </Section>
              )}

              {sections.all.length > 0 && (
                <Section label="All Prompts" count={sections.all.length}>
                  {sections.all.map((p) => (
                    <motion.div key={p.id} variants={fadeInUp}>
                      <PromptCard
                        prompt={p}
                        selected={selectedId === p.id}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview panel */}
      <AnimatePresence mode="wait">
        {selectedPrompt && (
          <PromptPreviewPanel
            key={selectedPrompt.id}
            prompt={selectedPrompt}
            onClose={handleClose}
            onUpdate={() => router.refresh()}
          />
        )}
      </AnimatePresence>

      <PromptDialog open={dialogOpen} onOpenChange={setDialogOpen} />
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
      <motion.div
        className="space-y-3"
        variants={stagger.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-30px" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
