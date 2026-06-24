"use client";

import { X } from "lucide-react";

interface PromptFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
}

export function PromptFilters({ categories, selectedCategory, onCategoryChange }: PromptFiltersProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
          !selectedCategory
            ? "bg-primary/10 text-primary"
            : "bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
            selectedCategory === cat
              ? "bg-primary/10 text-primary"
              : "bg-muted text-secondary-foreground hover:text-foreground hover:bg-muted/80"
          }`}
        >
          {cat}
        </button>
      ))}
      {selectedCategory && (
        <button
          onClick={() => onCategoryChange(null)}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
