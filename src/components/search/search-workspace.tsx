"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Command, Sparkles } from "lucide-react";
import { globalSearch } from "@/actions/search";
import { SearchResultCard } from "./search-result-card";
import { SearchPreviewPanel } from "./search-preview-panel";

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

const FILTER_OPTIONS = [
  { key: "all", label: "Everything" },
  { key: "note", label: "Notes" },
  { key: "resource", label: "Resources" },
  { key: "prompt", label: "Prompts" },
  { key: "project", label: "Projects" },
] as const;

function computeMatchReason(query: string, item: SearchResult): string {
  if (!query.trim()) return "";
  const q = query.toLowerCase();
  const reasons: string[] = [];
  if (item.title?.toLowerCase().includes(q)) reasons.push(`title contains "${query}"`);
  for (const tag of item.tags || []) {
    if (tag.toLowerCase().includes(q) || q.includes(tag.toLowerCase())) {
      reasons.push(`tagged "${tag}"`);
    }
  }
  if (item.content?.toLowerCase().includes(q)) reasons.push("content matches");
  if (item.description?.toLowerCase().includes(q)) reasons.push("description matches");
  if (item.category?.toLowerCase().includes(q)) reasons.push(`category: ${item.category}`);
  return reasons[0] || "";
}

function getRelatedItems(item: SearchResult, allItems: SearchResult[]): SearchResult[] {
  if (!item.tags || item.tags.length === 0) return [];
  const tagSet = new Set(item.tags.map((t) => t.toLowerCase()));
  return allItems
    .filter((r) => r.id !== item.id && r.tags?.some((t) => tagSet.has(t.toLowerCase())))
    .slice(0, 5);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<{ projects: any[]; resources: any[]; prompts: any[]; notes: any[] }>({
    projects: [], resources: [], prompts: [], notes: [],
  });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialQuery);
  const [activeFilter, setActiveFilter] = useState<string>("all");

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

  // Debounced search with stale-request guard
  useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults({ projects: [], resources: [], prompts: [], notes: [] });
      setSearched(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query.trim());
        if (cancelled) return;
        setResults(data);
        setSearched(true);
      } catch {
        if (cancelled) return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Flatten results into sections
  const sections = useMemo(() => {
    const s: { key: ResultType; label: string; items: SearchResult[] }[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedProj: SearchResult[] = (results.projects || []).map((p: any) => ({
      id: p.id, title: p.title, type: "project" as ResultType,
      description: p.description, category: p.status, tags: p.tags,
      status: p.status, techStack: p.techStack, favorite: p.favorite,
      createdAt: p.createdAt?.toISOString?.() || p.createdAt,
      updatedAt: p.updatedAt?.toISOString?.() || p.updatedAt,
    }));
    if (mappedProj.length > 0) s.push({ key: "project", label: "Projects", items: mappedProj });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedPrompt: SearchResult[] = (results.prompts || []).map((p: any) => {
      const matchedTag = p.tags?.find((t: string) => projectLookup.has(t.toLowerCase()));
      return {
        id: p.id, title: p.title, type: "prompt" as ResultType,
        content: p.prompt, category: p.category, tags: p.tags,
        useCase: p.useCase, favorite: p.favorite, useCount: p.useCount,
        projectName: matchedTag ? projectLookup.get(matchedTag.toLowerCase()) : undefined,
        createdAt: p.createdAt?.toISOString?.() || p.createdAt?.toISOString?.(),
        updatedAt: p.lastUsedAt?.toISOString?.() || p.createdAt?.toISOString?.(),
      };
    });
    if (mappedPrompt.length > 0) s.push({ key: "prompt", label: "Prompts", items: mappedPrompt });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // Filter sections based on active filter
  const filteredSections = useMemo(() => {
    if (activeFilter === "all") return sections;
    return sections.filter((s) => s.key === activeFilter);
  }, [sections, activeFilter]);

  // AI Summary: counts and top topics
  const summary = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;
    for (const s of sections) {
      counts[s.key] = s.items.length;
      total += s.items.length;
    }
    const tagFreq = new Map<string, number>();
    for (const s of sections) {
      for (const item of s.items) {
        for (const tag of item.tags || []) {
          tagFreq.set(tag, (tagFreq.get(tag) || 0) + 1);
        }
      }
    }
    const topTags = [...tagFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);
    const sectionCount = Object.keys(counts).filter((k) => counts[k] > 0).length;
    return { total, sectionCount, counts, topTags };
  }, [sections]);

  // Best match = first result across all sections
  const bestMatch = allResults.length > 0 ? allResults[0] : null;

  // Match reasons for all results
  const matchReasons = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of allResults) {
      map.set(item.id, computeMatchReason(query, item));
    }
    return map;
  }, [allResults, query]);

  const selectedResult = useMemo(() => {
    if (!selectedId) return null;
    return allResults.find((r) => r.id === selectedId) || null;
  }, [selectedId, allResults]);

  // Related items for preview panel
  const relatedItems = useMemo(() => {
    if (!selectedResult) return [];
    return getRelatedItems(selectedResult, allResults);
  }, [selectedResult, allResults]);

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose() {
    setSelectedId(null);
    searchRef.current?.focus();
  }

  const totalResults = allResults.length;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex h-full">
      {/* Results area */}
      <div className="flex flex-col flex-1 shrink-0 border-r border-border/50 transition-all duration-200">
        {/* Search header */}
        <div className="px-6 pt-6 pb-4 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources, prompts, notes, projects..."
              autoFocus={!initialQuery}
              className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
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

          {/* Filter chips */}
          {hasQuery && !loading && totalResults > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setActiveFilter(opt.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === opt.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
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
                  <h3 className="text-sm font-medium text-foreground mb-1">Nothing matched exactly</h3>
                  <p className="text-xs text-muted-foreground mb-6">Try a different search term, or browse by section.</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {FILTER_OPTIONS.filter((o) => o.key !== "all").map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => router.push(`/${opt.key}s`)}
                        className="px-3 py-1.5 rounded-lg border border-border/40 text-xs text-muted-foreground hover:text-foreground hover:border-border/70 hover:bg-muted/40 transition-all"
                      >
                        Browse {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* AI Summary */}
                  {summary.total > 0 && (
                    <div className="rounded-xl border border-border/20 bg-card/30 px-5 py-3.5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Summary</span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        Found <strong>{summary.total}</strong> results across <strong>{summary.sectionCount}</strong> sections.
                        {summary.topTags.length > 0 && (
                          <> Top topics: <span className="text-primary/80">{summary.topTags.join(", ")}</span>.</>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Best Match */}
                  {activeFilter === "all" && bestMatch && (
                    <section>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Best Match</h2>
                      </div>
                      <SearchResultCard
                        result={bestMatch}
                        matchReason={matchReasons.get(bestMatch.id) || ""}
                        selected={selectedId === bestMatch.id}
                        onSelect={handleSelect}
                      />
                    </section>
                  )}

                  {/* Remaining results grouped */}
                  {filteredSections.map((section) => {
                    // Skip Best Match in grouped results if already shown above
                    const items = section.items.filter(
                      (item) => !(activeFilter === "all" && bestMatch && item.id === bestMatch.id)
                    );
                    if (items.length === 0) return null;
                    return (
                      <section key={section.key}>
                        <div className="flex items-center gap-2 mb-3">
                          <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">{section.label}</h2>
                          <span className="text-xs text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{items.length}</span>
                        </div>
                        <div className="space-y-2">
                          {items.map((item) => (
                            <SearchResultCard
                              key={item.id}
                              result={item}
                              matchReason={matchReasons.get(item.id) || ""}
                              selected={selectedId === item.id}
                              onSelect={handleSelect}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {/* Empty state */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center px-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 mb-5">
                <Sparkles className="h-7 w-7 text-primary/60" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Explore your knowledge</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Find and discover connections across your notes, prompts, resources, and projects.
              </p>
              <div className="flex items-center gap-2 mt-5 text-xs text-muted-foreground">
                <kbd className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
                <span>to open command palette</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview panel */}
      <AnimatePresence mode="wait">
        {selectedResult && (
          <SearchPreviewPanel
            key={selectedResult.id}
            result={selectedResult}
            matchReason={matchReasons.get(selectedResult.id) || ""}
            relatedItems={relatedItems}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
