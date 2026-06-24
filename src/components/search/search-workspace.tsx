"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Command, Sparkles } from "lucide-react";
import { globalSearch } from "@/actions/search";
import { SearchResultCard } from "./search-result-card";
import { SearchPreviewPanel } from "./search-preview-panel";
import { SearchContextPanel } from "./search-context-panel";

interface SearchWorkspaceProps {
  initialQuery?: string;
  projects: { id: string; title: string; tags: string[] }[];
}

type ResultType = "project" | "resource" | "prompt" | "note";

interface SearchResult {
  id: string;
  title: string;
  type: ResultType;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  url?: string;
  useCase?: string;
  status?: string;
  techStack?: string[];
  favorite?: boolean;
  reason?: string;
  notes?: string;
  useCount?: number;
  createdAt?: string;
  updatedAt?: string;
  projectName?: string;
}

function buildProjectLookup(projects: { id: string; title: string; tags: string[] }[]): Map<string, string> {
  const lookup = new Map<string, string>();
  for (const p of projects) {
    for (const tag of p.tags) {
      lookup.set(tag.toLowerCase(), p.title);
    }
  }
  return lookup;
}

export function SearchWorkspace({ initialQuery, projects }: SearchWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const searchRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(initialQuery || "");
  const [results, setResults] = useState<{ projects: any[]; resources: any[]; prompts: any[]; notes: any[] }>({
    projects: [], resources: [], prompts: [], notes: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<{ id: string; title: string; type: string }[]>([]);

  const projectLookup = useMemo(() => buildProjectLookup(projects), [projects]);

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("id", id);
      } else {
        params.delete("id");
      }
      const qs = params.toString();
      const url = qs ? `/search?${qs}` : "/search";
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ projects: [], resources: [], prompts: [], notes: [] });
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query.trim());
        setResults(data);
        setSearched(true);
        setRecentSearches((prev) => {
          const next = [query.trim(), ...prev.filter((q) => q !== query.trim())];
          return next.slice(0, 5);
        });
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Flatten results into sections
  const sections = useMemo(() => {
    const s: { key: ResultType; label: string; items: SearchResult[] }[] = [];

    const mappedProj: SearchResult[] = (results.projects || []).map((p: any) => ({
      id: p.id, title: p.title, type: "project" as ResultType,
      description: p.description, category: p.status, tags: p.tags,
      status: p.status, techStack: p.techStack, favorite: p.favorite,
      createdAt: p.createdAt?.toISOString?.() || p.createdAt,
      updatedAt: p.updatedAt?.toISOString?.() || p.updatedAt,
    }));
    if (mappedProj.length > 0) s.push({ key: "project", label: "Projects", items: mappedProj });

    const mappedRes: SearchResult[] = (results.resources || []).map((r: any) => {
      const matchedTag = r.tags?.find((t: string) => projectLookup.has(t.toLowerCase()));
      return {
        id: r.id, title: r.title, type: "resource" as ResultType,
        description: r.url, category: r.category, tags: r.tags,
        url: r.url, reason: r.reason, notes: r.notes, favorite: r.favorite,
        projectName: matchedTag ? projectLookup.get(matchedTag.toLowerCase()) : undefined,
        createdAt: r.createdAt?.toISOString?.() || r.createdAt,
      };
    });
    if (mappedRes.length > 0) s.push({ key: "resource", label: "Resources", items: mappedRes });

    const mappedPrompt: SearchResult[] = (results.prompts || []).map((p: any) => {
      const matchedTag = p.tags?.find((t: string) => projectLookup.has(t.toLowerCase()));
      return {
        id: p.id, title: p.title, type: "prompt" as ResultType,
        content: p.prompt, category: p.category, tags: p.tags,
        useCase: p.useCase, favorite: p.favorite, useCount: p.useCount,
        projectName: matchedTag ? projectLookup.get(matchedTag.toLowerCase()) : undefined,
        createdAt: p.createdAt?.toISOString?.() || p.createdAt,
        updatedAt: p.lastUsedAt?.toISOString?.() || p.createdAt?.toISOString?.(),
      };
    });
    if (mappedPrompt.length > 0) s.push({ key: "prompt", label: "Prompts", items: mappedPrompt });

    const mappedNote: SearchResult[] = (results.notes || []).map((n: any) => {
      const matchedTag = n.tags?.find((t: string) => projectLookup.has(t.toLowerCase()));
      return {
        id: n.id, title: n.title, type: "note" as ResultType,
        content: n.content, category: n.category, tags: n.tags,
        favorite: n.favorite,
        projectName: matchedTag ? projectLookup.get(matchedTag.toLowerCase()) : undefined,
        createdAt: n.createdAt?.toISOString?.() || n.createdAt,
        updatedAt: n.updatedAt?.toISOString?.() || n.createdAt?.toISOString?.(),
      };
    });
    if (mappedNote.length > 0) s.push({ key: "note", label: "Notes", items: mappedNote });

    return s;
  }, [results, projectLookup]);

  const allResults = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const selectedResult = useMemo(() => {
    if (!selectedId) return null;
    return allResults.find((r) => r.id === selectedId) || null;
  }, [selectedId, allResults]);

  function handleSelect(id: string) {
    const result = allResults.find((r) => r.id === id);
    if (result) {
      setRecentlyViewed((prev) => {
        const next = [{ id: result.id, title: result.title, type: result.type }, ...prev.filter((r) => r.id !== result.id)];
        return next.slice(0, 10);
      });
    }
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose() {
    setSelectedId(null);
    searchRef.current?.focus();
  }

  function handleSearchClick(q: string) {
    setQuery(q);
    searchRef.current?.focus();
  }

  const totalResults = allResults.length;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex h-full">
      {/* Results area */}
      <div className={`flex flex-col ${selectedResult ? "w-[45%]" : "flex-1"} shrink-0 border-r border-border/50 transition-all duration-200`}>
        {/* Search header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources, prompts, notes, projects..."
              autoFocus={!initialQuery}
              className="flex h-14 w-full rounded-xl border border-border bg-card pl-12 pr-14 text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </div>
          </div>

          {hasQuery && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">
                {loading ? "Searching..." : `${totalResults} result${totalResults !== 1 ? "s" : ""}`}
              </span>
              {!loading && totalResults === 0 && (
                <span className="text-xs text-muted-foreground">for &ldquo;{query}&rdquo;</span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {hasQuery && (
            <div className="px-5 py-4 space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : totalResults === 0 && searched ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground mb-1">No results found</h3>
                  <p className="text-xs text-muted-foreground">Try a different search term</p>
                </div>
              ) : (
                sections.map((section) => (
                  <section key={section.key}>
                    <div className="flex items-center gap-2 mb-3">
                      <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">{section.label}</h2>
                      <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{section.items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <SearchResultCard
                          key={item.id}
                          result={item}
                          selected={selectedId === item.id}
                          onSelect={handleSelect}
                        />
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          )}

          {/* Empty state */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 mb-5">
                <Sparkles className="h-7 w-7 text-primary/60" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Search your second brain</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Find resources, prompts, notes, and projects instantly. Type above to get started.
              </p>
              <div className="flex items-center gap-2 mt-5 text-xs text-muted-foreground">
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                <span>to open command palette</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      <AnimatePresence mode="wait">
        {selectedResult ? (
          <SearchPreviewPanel
            key={selectedResult.id}
            result={selectedResult}
            onClose={handleClose}
          />
        ) : (
          <SearchContextPanel
            recentSearches={recentSearches}
            recentlyViewed={recentlyViewed}
            onSearchClick={handleSearchClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
