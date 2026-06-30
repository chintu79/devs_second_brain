"use client";

import { useState } from "react";
import { Plus, ArrowUpDown, Bookmark, Star } from "lucide-react";
import { createPrompt } from "@/actions/prompts";
import { PromptList } from "@/components/prompts/prompt-list";

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

const PROMPT_TEMPLATE = "## Role\n\n## Context\n\n## Instructions\n\n## Constraints\n\n## Variables\n\n## Expected Output\n";

export function PromptsContent({ initialItems, nextCursor, categories }: PromptsContentProps) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [catOpen, setCatOpen] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  function handleTagClick(tag: string) {}

  async function handleCreate() {
    const formData = new FormData();
    formData.set("title", "");
    formData.set("prompt", PROMPT_TEMPLATE);
    formData.set("category", "coding");
    formData.set("useCase", "");
    formData.set("tags", "");
    const result = await createPrompt(formData);
    if (result.success && result.id) {
      window.location.href = `/prompts?id=${result.id}&new=true`;
    }
  }

  return (
    <>
      <div data-accent="prompts" className="absolute inset-0 flex overflow-hidden">
        <aside className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {/* New Prompt */}
            <div className="px-3 pb-2 border-b border-border/20">
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]"
              >
                <Plus className="h-3.5 w-3.5" />
                New Prompt
              </button>
            </div>

            {/* Browse */}
            <div className="pt-1">
              <h4 className="px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Browse</h4>
              <div className="space-y-0.5">
                <button
                  onClick={() => { setSelectedCategory(null); setShowFavoritesOnly(false); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${!selectedCategory && !showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  All Prompts
                </button>
                <button
                  onClick={() => { setSelectedCategory(null); setShowFavoritesOnly(!showFavoritesOnly); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Star className="h-3.5 w-3.5" />
                  Favorites
                </button>
              </div>
            </div>

            {/* Categories — collapsible */}
            {!showFavoritesOnly && (
              <div className="pt-2">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-all"
                >
                  {catOpen ? <ArrowUpDown className="h-3 w-3 rotate-180" /> : <ArrowUpDown className="h-3 w-3" />}
                  Categories
                </button>
                {catOpen && (
                  <div className="space-y-0.5 pt-0.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                        className={`sidebar-item w-full text-sm capitalize transition-transform duration-150 hover:scale-[1.02] ${selectedCategory === cat ? "sidebar-item-active" : ""}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sort */}
            <div className="pt-3 border-t border-border/20">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <ArrowUpDown className="h-3 w-3 text-section-foreground" />
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="flex-1 text-xs bg-transparent text-muted-foreground border-0 cursor-pointer focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="popular">Most Used</option>
                </select>
              </div>
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
            onTagClick={handleTagClick}
            favoritesOnly={showFavoritesOnly}
          />
        </div>
      </div>
    </>
  );
}
