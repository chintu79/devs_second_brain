"use client";

import { X } from "lucide-react";

interface ResourceFiltersProps {
  allCategories: string[];
  allTags: string[];
  selectedCategory: string | null;
  selectedTag: string | null;
  sortBy: "newest" | "oldest";
  onCategoryChange: (cat: string | null) => void;
  onTagChange: (tag: string | null) => void;
  onSortChange: (sort: "newest" | "oldest") => void;
}

export function ResourceFilters({
  allCategories,
  allTags,
  selectedCategory,
  selectedTag,
  sortBy,
  onCategoryChange,
  onTagChange,
  onSortChange,
}: ResourceFiltersProps) {
  const hasActiveFilters = selectedCategory || selectedTag;

  return (
    <div className="space-y-3">
      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
            !selectedCategory
              ? "bg-primary/10 text-primary"
              : "bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.03]"
          }`}
        >
          All
        </button>
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 capitalize ${
              selectedCategory === cat
                ? "bg-primary/10 text-primary"
                : "bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80 hover:scale-[1.03]"
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="w-px h-4 bg-border/50 mx-1" />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
          className="px-2 py-1 rounded-lg text-xs font-medium bg-muted text-secondary-foreground border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Tag pills */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(selectedTag === tag ? null : tag)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all duration-150 ${
                selectedTag === tag
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/60 hover:scale-[1.03]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => { onCategoryChange(null); onTagChange(null); }}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all duration-150"
        >
          <X className="h-3 w-3" />
          Clear filters
        </button>
      )}
    </div>
  );
}
