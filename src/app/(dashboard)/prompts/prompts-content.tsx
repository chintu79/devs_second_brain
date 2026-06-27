"use client";

import { useState } from "react";
import { Plus, ArrowUpDown } from "lucide-react";
import { PromptList } from "@/components/prompts/prompt-list";
import { PromptDialog } from "@/components/vaults/prompt-dialog";

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

interface PromptsContentProps {
  initialItems: Prompt[];
  nextCursor: string | null;
  categories: string[];
}

type SortMode = "newest" | "oldest" | "name" | "popular";

export function PromptsContent({ initialItems, nextCursor, categories }: PromptsContentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <>
      <div data-accent="prompts" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
        <aside className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
            <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Prompts</span>
            <button
              onClick={() => setDialogOpen(true)}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.1] transition-all duration-150"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            <div className="pt-2">
              <h4 className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Categories</h4>
              <div className="space-y-0.5 pt-0.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`sidebar-item w-full text-sm capitalize ${selectedCategory === cat ? "sidebar-item-active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative pt-2">
              <h4 className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Sort</h4>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="sidebar-item w-full text-sm"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortLabels[sortMode]}
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-20 w-full rounded-lg border border-border bg-card shadow-lg py-1">
                    {(Object.keys(sortLabels) as SortMode[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortMode(key); setSortOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${sortMode === key ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
                      >
                        {sortLabels[key]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0 p-4">
          <PromptList
            initialItems={initialItems}
            nextCursor={nextCursor}
            categories={categories}
            sortMode={sortMode}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
      <PromptDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

const sortLabels: Record<SortMode, string> = {
  newest: "Newest First",
  oldest: "Oldest First",
  name: "Name (A-Z)",
  popular: "Most Used",
};
