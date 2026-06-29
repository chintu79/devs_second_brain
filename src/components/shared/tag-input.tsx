"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, TagIcon } from "lucide-react";
import { searchTags } from "@/actions/tags";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MAX_TAGS = 3

export function TagInput({ value, onChange, placeholder = `Add tags... (max ${MAX_TAGS})` }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const tags = value ? value.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const tagsRef = useRef(tags);
  useEffect(() => { tagsRef.current = tags; }, [tags]);

  useEffect(() => {
    if (!inputValue.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await searchTags(inputValue.trim());
      const filtered = results.filter((t) => !tagsRef.current.includes(t.name));
      setSuggestions(filtered);
      setOpen(filtered.length > 0);
      setActiveIndex(-1);
    }, 150);
    return () => clearTimeout(timer);
  }, [inputValue]);

  function addTag(name: string) {
    if (tags.includes(name) || tags.length >= MAX_TAGS) return;
    const updated = [...tags, name].join(", ");
    onChange(updated);
    setInputValue("");
    setOpen(false);
    inputRef.current?.focus();
  }

  function removeTag(name: string) {
    const updated = tags.filter((t) => t !== name).join(", ");
    onChange(updated);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        addTag(suggestions[activeIndex].name);
      } else {
        addTag(inputValue.trim());
      }
      return;
    }

    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <div
        className="flex flex-wrap gap-1.5 min-h-9 w-full rounded-md border border-border bg-card px-3 py-1.5 text-sm focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="flex items-center justify-center h-3.5 w-3.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[80px] outline-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground py-0.5"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 left-0 right-0 top-full mt-1 rounded-md border border-border bg-popover shadow-md overflow-hidden"
        >
            {suggestions.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); addTag(s.name); }}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors ${
                  i === activeIndex ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <TagIcon className="h-3.5 w-3.5 shrink-0" />
                <span>{s.name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
