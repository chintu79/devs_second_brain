"use client";

import { useState, useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { RadarSidebar } from "./radar-sidebar";
import { RadarFeed } from "./radar-feed";
import { RepositoryDetailPanel } from "./repository-detail-panel";
import { RadarContextPanel } from "./radar-context-panel";
import type { Repository } from "@/lib/mock-data";

interface RadarWorkspaceProps {
  repos: Repository[];
  sections: { id: string; label: string; repos: Repository[] }[];
  categories: { id: string; label: string; count?: number }[];
}

export function RadarWorkspace({ repos, sections, categories }: RadarWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("id", id);
        setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 20));
      } else {
        params.delete("id");
      }
      const qs = params.toString();
      const url = qs ? `/radar?${qs}` : "/radar";
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose() {
    setSelectedId(null);
  }

  function handleBookmark(id: string) {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Filter repos by active section
  const filteredRepos = useMemo(() => {
    if (activeSection === "all") return repos;
    if (activeSection === "bookmarked") return repos.filter((r) => bookmarked.has(r.id));
    if (activeSection === "saved") return [];
    if (activeSection === "viewed") return recentlyViewed.map((id) => repos.find((r) => r.id === id)).filter(Boolean) as Repository[];
    return repos.filter((r) => {
      const catMatch = r.category.toLowerCase().replace(/\s+/g, "") === activeSection;
      const idMatch = activeSection === "hidden" ? r.savedBy === "Few Developers" : false;
      const recentMatch = activeSection === "recent" ? r.growthIndicator === "new" : false;
      return catMatch || idMatch || recentMatch;
    });
  }, [repos, activeSection, bookmarked, recentlyViewed]);

  // Build feed sections from filtered repos
  const feedSections = useMemo(() => {
    if (activeSection !== "all") {
      return [{ id: "filtered", label: getSectionLabel(activeSection), repos: filteredRepos }];
    }
    return sections;
  }, [sections, filteredRepos, activeSection]);

  // Enrich repos with bookmark state
  const enrichedRepos = useMemo(
    () => repos.map((r) => ({ ...r, bookmarked: bookmarked.has(r.id) })),
    [repos, bookmarked]
  );

  const enrichedFiltered = useMemo(
    () => filteredRepos.map((r) => ({ ...r, bookmarked: bookmarked.has(r.id) })),
    [filteredRepos, bookmarked]
  );

  const enrichedSections = useMemo(
    () => feedSections.map((s) => ({
      ...s,
      repos: s.repos.map((r) => ({ ...r, bookmarked: bookmarked.has(r.id) })),
    })),
    [feedSections, bookmarked]
  );

  const selectedRepo = useMemo(() => {
    if (!selectedId) return null;
    return enrichedRepos.find((r) => r.id === selectedId) || null;
  }, [selectedId, enrichedRepos]);

  // Context panel data
  const bookmarkedRepos = useMemo(() => enrichedRepos.filter((r) => r.bookmarked), [enrichedRepos]);
  const viewedRepos = useMemo(
    () => recentlyViewed.map((id) => enrichedRepos.find((r) => r.id === id)).filter(Boolean) as Repository[],
    [recentlyViewed, enrichedRepos]
  );
  const trendingRepos = useMemo(
    () => enrichedRepos.filter((r) => r.growthIndicator === "trending" || r.growthIndicator === "hot"),
    [enrichedRepos]
  );

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <RadarSidebar
        categories={categories}
        activeSection={activeSection}
        onSectionChange={(s) => { setActiveSection(s); setSelectedId(null); }}
        bookmarkedCount={bookmarked.size}
        recentlyViewedCount={recentlyViewed.length}
      />

      {/* Feed */}
      <div className={`flex flex-col ${selectedId ? "w-[45%]" : "flex-1"} shrink-0 border-r border-border/50 transition-all duration-200`}>
        <RadarFeed
          repos={enrichedFiltered}
          sections={enrichedSections}
          selectedId={selectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelect={handleSelect}
          onBookmark={handleBookmark}
        />
      </div>

      {/* Right panel: Detail or Context */}
      <AnimatePresence mode="wait">
        {selectedRepo ? (
          <RepositoryDetailPanel
            key={selectedRepo.id}
            repo={selectedRepo}
            onClose={handleClose}
            onBookmark={handleBookmark}
          />
        ) : (
          <RadarContextPanel
            recentlyViewed={viewedRepos}
            bookmarkedRepos={bookmarkedRepos}
            trendingRepos={trendingRepos}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    all: "All Repositories",
    ai: "Artificial Intelligence",
    agents: "Agent Frameworks",
    frontend: "Frontend",
    backend: "Backend",
    devops: "DevOps",
    flutter: "Flutter",
    linux: "Linux",
    datascience: "Data Science",
    devtools: "Developer Tools",
    infrastructure: "Infrastructure",
    hidden: "Hidden Gems",
    recent: "Recently Released",
    bookmarked: "Bookmarked",
    saved: "Saved Repositories",
    viewed: "Previously Viewed",
  };
  return labels[section] || section;
}
