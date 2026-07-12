"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  Brain,
  FolderOpen,
  Hash,
  FileText,
  ExternalLink,
  Settings,
  Plus,
  Clock,
  Loader2,
  Bookmark,
} from "lucide-react";
import { globalSearch } from "@/actions/search";
import { getCollectionTree } from "@/actions/collections";
import { fetchMoreKnowledgeItems } from "@/actions/knowledge";
import { quickCapture } from "@/actions/capture";
import type { CollectionNode } from "@/actions/collections";

interface PaletteItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  group: "knowledge" | "collections" | "recent" | "actions";
  onSelect: () => void;
}

interface RecentItem {
  id: string;
  title: string;
  type: string;
}

const QUICK_ACTIONS: PaletteItem[] = [
  {
    id: "capture", label: "Capture URL", description: "Save a link to your knowledge", icon: <Plus className="h-4 w-4" />,
    group: "actions", onSelect: () => {},
  },
  {
    id: "settings", label: "Preferences", description: "Manage your account and settings", icon: <Settings className="h-4 w-4" />,
    group: "actions", onSelect: () => {},
  },
  {
    id: "knowledge", label: "All Knowledge", description: "Browse everything you've saved", icon: <Brain className="h-4 w-4" />,
    group: "actions", onSelect: () => {},
  },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  link: <ExternalLink className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
  document: <FileText className="h-4 w-4" />,
  pdf: <Bookmark className="h-4 w-4" />,
  video: <Bookmark className="h-4 w-4" />,
};

const GROUP_LABELS: Record<string, string> = {
  knowledge: "Knowledge",
  collections: "Collections",
  recent: "Recent",
  actions: "Quick Actions",
};

const GROUP_ORDER = ["knowledge", "collections", "recent", "actions"];

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; title: string; type: string }[]>([]);
  const [collections, setCollections] = useState<CollectionNode[]>([]);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    getCollectionTree().then(setCollections).catch(() => {});
    fetchMoreKnowledgeItems(undefined, 5).then((r) => {
      setRecentItems(r.items.map((i) => ({ id: i.id, title: i.title, type: i.type })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const res = await globalSearch(q);
      setSearchResults(res.results.map((r) => ({ id: r.id, title: r.title, type: r.type })));
      setSearching(false);
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const allItems = useMemo(() => {
    const items: PaletteItem[] = [];
    const q = query.trim().toLowerCase();

    if (q.length >= 2) {
      for (const r of searchResults) {
        items.push({
          id: r.id, label: r.title, description: r.type,
          icon: TYPE_ICONS[r.type] || <FileText className="h-4 w-4" />,
          group: "knowledge",
          onSelect: () => { router.push(`/knowledge?id=${r.id}`); onClose(); },
        });
      }
    }

    const matchedCollections = q.length >= 2
      ? flattenCollections(collections).filter((c) => c.name.toLowerCase().includes(q))
      : [];

    for (const c of matchedCollections) {
      items.push({
        id: c.id, label: c.name, icon: <FolderOpen className="h-4 w-4" />,
        group: "collections",
        onSelect: () => { router.push(`/knowledge?collection=${c.id}`); onClose(); },
      });
    }

    if (q.length < 2) {
      for (const r of recentItems) {
        items.push({
          id: r.id, label: r.title, description: r.type,
          icon: TYPE_ICONS[r.type] || <FileText className="h-4 w-4" />,
          group: "recent",
          onSelect: () => { router.push(`/knowledge?id=${r.id}`); onClose(); },
        });
      }
    }

    for (const a of QUICK_ACTIONS) {
      if (q.length >= 2 && !a.label.toLowerCase().includes(q)) continue;
      items.push({
        ...a,
        onSelect: () => {
          if (a.id === "capture") {
            const url = prompt("Paste a URL to save:");
            if (url) quickCapture(url).then(() => router.refresh());
          } else if (a.id === "settings") {
            router.push("/settings");
          } else {
            router.push("/knowledge");
          }
          onClose();
        },
      });
    }

    return items;
  }, [query, searchResults, collections, recentItems, router, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === "Enter" && allItems[selectedIndex]) {
      allItems[selectedIndex].onSelect();
    }
  }, [allItems, selectedIndex, onClose]);

  const grouped = useMemo(() => {
    const groups = new Map<string, PaletteItem[]>();
    for (const item of allItems) {
      if (!groups.has(item.group)) groups.set(item.group, []);
      groups.get(item.group)!.push(item);
    }
    return GROUP_ORDER.filter((g) => groups.has(g)).map((g) => ({ group: g, items: groups.get(g)! }));
  }, [allItems]);

  let globalIndex = 0;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced ? {} : { opacity: 1 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-50"
    >
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="fixed inset-0 flex items-start justify-center pt-[12vh] pointer-events-none">
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96, y: -8 }}
          animate={reduced ? {} : { opacity: 1, scale: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl bg-background border border-border/60 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
        >
          <div className="flex items-center gap-3 px-4 h-12 border-b border-border/40">
            <Search className="h-4 w-4 text-muted-foreground/50 shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search knowledge, collections, actions..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/30"
            />
            {searching && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground/50" />}
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground/40 bg-muted/50 border">
              ESC
            </kbd>
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {grouped.length === 0 && !searching && (
              <div className="flex flex-col items-center py-10 text-muted-foreground/50">
                <Search className="h-6 w-6 mb-2" />
                <p className="text-sm">Start typing to search</p>
              </div>
            )}

            {searching && allItems.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
              </div>
            )}

            {grouped.map(({ group, items }) => {
              const startIndex = globalIndex;
              globalIndex += items.length;
              return (
                <div key={group}>
                  <div className="px-4 py-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
                      {GROUP_LABELS[group]}
                    </span>
                  </div>
                  {items.map((item, i) => {
                    const idx = startIndex + i;
                    return (
                      <button
                        key={item.id}
                        onClick={item.onSelect}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors ${
                          idx === selectedIndex ? "bg-accent/15" : "hover:bg-accent/8"
                        }`}
                      >
                        <span className={`shrink-0 ${idx === selectedIndex ? "text-foreground" : "text-muted-foreground/50"}`}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm truncate ${idx === selectedIndex ? "text-foreground font-medium" : "text-foreground/85"}`}>
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-[11px] text-muted-foreground/50 truncate">{item.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function flattenCollections(nodes: CollectionNode[]): CollectionNode[] {
  const result: CollectionNode[] = [];
  for (const n of nodes) {
    result.push(n);
    result.push(...flattenCollections(n.children));
  }
  return result;
}
