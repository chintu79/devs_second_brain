"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bookmark, Sparkles, FileText, FolderKanban, X, Link } from "lucide-react";
import { searchLinkItems, type LinkItem } from "@/actions/references";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  resource: { icon: Bookmark, color: "#14B8A6" },
  note: { icon: FileText, color: "#22C55E" },
  prompt: { icon: Sparkles, color: "#F59E0B" },
  project: { icon: FolderKanban, color: "#8B5CF6" },
};

interface LinkPickerProps {
  selected: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  excludeId?: string;
  placeholder?: string;
}

export function LinkPicker({ selected, onChange, excludeId, placeholder = "Search items to link..." }: LinkPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LinkItem[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) { // eslint-disable-next-line react-hooks/set-state-in-effect
    setResults([]); return; }
    const timer = setTimeout(async () => {
      const items = await searchLinkItems(query);
      setResults(items.filter((i) => !(i.type === excludeId && i.id === excludeId)));
    }, 200);
    return () => clearTimeout(timer);
  }, [query, excludeId]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectedIds = new Set(selected.map((i) => `${i.type}:${i.id}`));

  function toggle(item: LinkItem) {
    const key = `${item.type}:${item.id}`;
    if (selectedIds.has(key)) {
      onChange(selected.filter((i) => `${i.type}:${i.id}` !== key));
    } else {
      onChange([...selected, item]);
    }
    setQuery("");
    inputRef.current?.focus();
  }

  function remove(item: LinkItem) {
    onChange(selected.filter((i) => `${i.type}:${i.id}` !== `${item.type}:${item.id}`));
  }

  const grouped: Record<string, LinkItem[]> = {};
  for (const r of results) {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type].push(r);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-1.5 text-xs font-medium text-section-foreground uppercase tracking-[0.1em] mb-2">
        <Link className="h-3 w-3" />
        Links
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map((item) => {
            const cfg = typeConfig[item.type] || typeConfig.resource;
            const Icon = cfg.icon;
            return (
              <span
                key={`${item.type}:${item.id}`}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-muted border border-border"
              >
                <Icon className="h-3 w-3 accent-text" style={{ '--accent-c': cfg.color } as React.CSSProperties} />
                <span className="truncate max-w-[120px]">{item.title}</span>
                <button
                  type="button"
                  onClick={() => remove(item)}
                  className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          placeholder={placeholder}
          className="w-full h-9 rounded-md border border-border bg-muted pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg overflow-hidden">
          {Object.entries(grouped).map(([type, items]) => {
            const cfg = typeConfig[type] || typeConfig.resource;
            const Icon = cfg.icon;
            return (
              <div key={type}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground bg-muted/30 accent-text" style={{ '--accent-c': cfg.color } as React.CSSProperties}>
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-3 w-3" />
                    {type}s
                  </div>
                </div>
                {items.map((item) => {
                  const isSelected = selectedIds.has(`${item.type}:${item.id}`);
                  return (
                    <button
                      key={`${item.type}:${item.id}`}
                      type="button"
                      onClick={() => toggle(item)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-all duration-150 ${
                        isSelected
                          ? "bg-primary/5 text-foreground"
                          : "text-foreground/80 hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 accent-text" style={{ '--accent-c': cfg.color } as React.CSSProperties} />
                      <span className="truncate flex-1">{item.title}</span>
                      {isSelected && (
                        <span className="text-[10px] font-medium text-primary">Linked</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
