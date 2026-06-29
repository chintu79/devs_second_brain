"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { toggleBookmark, getBookmarkedRepoIds, getBookmarkedRepos } from "@/actions/radar-bookmark";
import { toast } from "sonner";
import { RadarSidebar } from "./radar-sidebar";
import { RadarFeed } from "./radar-feed";
import type { Repository } from "@/lib/mock-data";

interface RadarWorkspaceProps {
  repos: Repository[];
  sections: { id: string; label: string; repos: Repository[] }[];
  categories: { id: string; label: string; count?: number }[];
  userTags: string[];
}

export function RadarWorkspace({ repos, sections, categories, userTags }: RadarWorkspaceProps) {
  const [, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState(userTags.length > 0 ? "for-you" : "all");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [savedRepos, setSavedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    Promise.all([
      getBookmarkedRepoIds(),
      getBookmarkedRepos(),
    ]).then(([ids, saved]) => {
      setBookmarked(ids);
      setSavedRepos(saved);
    });
  }, [repos]);

  function handleBookmark(id: string) {
    const repo = repos.find((r) => r.id === id);
    if (!repo) return;
    const repoData = JSON.stringify(repo);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    const isBookmarking = !bookmarked.has(id);
    startTransition(() => {
      toggleBookmark(id, repoData).then((isBookmarked) => {
        if (isBookmarked) {
          const fullRepo = repos.find((r) => r.id === id);
          if (fullRepo) setSavedRepos((prev) => [{ ...fullRepo, bookmarked: true, saved: false }, ...prev]);
          toast.success("Bookmarked");
        } else {
          setSavedRepos((prev) => prev.filter((r) => r.id !== id));
          toast.success("Bookmark removed");
        }
      }).catch(() => {
        setBookmarked((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
        toast.error("Failed to update bookmark");
      });
    });
  }

  const userTagSet = useMemo(() => new Set(userTags.map((t) => t.toLowerCase())), [userTags]);

  // Enrich repos with relevance and matching tags
  const enrichedRepos = useMemo(
    () => repos.map((r) => {
      const matching = (r.topics || []).filter((t) => userTagSet.has(t.toLowerCase()));
      const langMatch = r.language ? userTagSet.has(r.language.toLowerCase()) : false;
      const catMatch = r.category ? userTagSet.has(r.category.toLowerCase()) : false;
      return {
        ...r,
        bookmarked: bookmarked.has(r.id),
        relevanceScore: matching.length * 3 + (langMatch ? 2 : 0) + (catMatch ? 1 : 0),
        matchingUserTags: [...matching, ...(langMatch ? [r.language] : [])],
      };
    }),
    [repos, bookmarked, userTagSet]
  );

  const forYouRepos = useMemo(
    () => enrichedRepos.filter((r) => r.relevanceScore > 0).sort((a, b) => b.relevanceScore - a.relevanceScore),
    [enrichedRepos]
  );

  const myStackRepos = useMemo(
    () => enrichedRepos.filter((r) => r.relevanceScore > 0),
    [enrichedRepos]
  );

  const hiddenGemsRepos = useMemo(
    () => enrichedRepos.filter((r) => (r.growthIndicator === "rising" || r.growthIndicator === "new") && r.stars < 5000),
    [enrichedRepos]
  );

  const filteredRepos = useMemo(() => {
    if (activeSection === "all") return enrichedRepos;
    if (activeSection === "bookmarked" || activeSection === "saved") return savedRepos.map((r) => enrichedRepos.find((er) => er.id === r.id)).filter(Boolean) as typeof enrichedRepos;
    if (activeSection === "for-you") return forYouRepos;
    if (activeSection === "my-stack") return myStackRepos;
    if (activeSection === "gems") return hiddenGemsRepos;
    return enrichedRepos.filter((r) => {
      const catSlug = r.category.toLowerCase().replace(/\s+/g, "");
      return catSlug === activeSection || categories.some((c) => c.id === activeSection && catSlug === c.label.toLowerCase().replace(/\s+/g, ""));
    });
  }, [enrichedRepos, activeSection, savedRepos, forYouRepos, myStackRepos, hiddenGemsRepos, categories]);

  // Build brief-style sections
  const feedSections = useMemo(() => {
    if (activeSection !== "all") {
      const label = getSectionLabel(activeSection);
      return [{ id: activeSection, label, repos: filteredRepos }];
    }
    const result: { id: string; label: string; repos: typeof enrichedRepos }[] = [];
    if (savedRepos.length > 0) {
      const sr = savedRepos.map((r) => enrichedRepos.find((er) => er.id === r.id)).filter(Boolean) as typeof enrichedRepos;
      if (sr.length > 0) result.push({ id: "saved", label: "My Saved", repos: sr });
    }
    const highPriority = enrichedRepos.filter((r) => r.relevanceScore > 2);
    if (highPriority.length > 0) result.push({ id: "high", label: "High Priority", repos: highPriority });
    result.push({ id: "for-you", label: "For You", repos: forYouRepos });
    for (const s of sections) {
      if (s.repos.length > 0) {
        result.push({ ...s, repos: s.repos.map((r) => enrichedRepos.find((er) => er.id === r.id) || r) as typeof enrichedRepos });
      }
    }
    return result;
  }, [sections, filteredRepos, activeSection, savedRepos, enrichedRepos, forYouRepos]);

  const relevantCount = enrichedRepos.filter((r) => r.relevanceScore > 0).length;

  return (
    <div className="flex h-full">
      <RadarSidebar
        categories={categories}
        activeSection={activeSection}
        onSectionChange={(s) => { setActiveSection(s); }}
        bookmarkedCount={bookmarked.size}
        recentlyViewedCount={0}
        forYouCount={forYouRepos.length}
        myStackCount={myStackRepos.length}
        gemsCount={hiddenGemsRepos.length}
        userTags={userTags}
      />

      <RadarFeed
        repos={filteredRepos}
        sections={feedSections}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onBookmark={handleBookmark}
        relevantCount={relevantCount}
      />
    </div>
  );
}

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    all: "Trending Today", "for-you": "For You", "my-stack": "My Stack", gems: "Discovery",
    ai: "Artificial Intelligence", agents: "Agent Frameworks", frontend: "Frontend",
    backend: "Backend", devops: "DevOps", flutter: "Flutter", linux: "Linux",
    datascience: "Data Science", devtools: "Developer Tools", infrastructure: "Infrastructure",
    bookmarked: "Saved", saved: "Saved Repositories", viewed: "Recently Viewed",
  };
  return labels[section] || section;
}
