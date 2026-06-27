"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, GitBranch, ArrowUpDown, Hash, Tag } from "lucide-react";
import { ResourceList } from "@/components/resources/resource-list";
import { ResourceContextPanel } from "@/components/resources/resource-context-panel";
import { ResourceDialog } from "@/components/vaults/resource-dialog";
import { GithubImport } from "@/components/resources/github-import";
import { ResourceReaderPanel } from "@/components/resources/resource-reader-panel";

interface Resource {
  id: string;
  title: string;
  url: string;
  category: string;
  tags: string[];
  notes: string | null;
  reason: string | null;
  favorite: boolean;
  createdAt: Date;
}

interface ResourcesContentProps {
  initialItems: Resource[];
  nextCursor: string | null;
  allCategories: string[];
  allTags: string[];
  recentNotes: { id: string; title: string }[];
  projects: { id: string; title: string }[];
}

export function ResourcesContent({ initialItems, nextCursor, allCategories, allTags, recentNotes, projects }: ResourcesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [githubImportOpen, setGithubImportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [allResources, setAllResources] = useState<Resource[]>(initialItems);

  const selectedResource = selectedId ? allResources.find((r) => r.id === selectedId) || null : null;

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("id", id);
      else params.delete("id");
      router.replace(`/resources?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <>
      <div data-accent="resources" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
        <aside className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
          <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
            <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Resources</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setGithubImportOpen(true)}
                aria-label="Import from GitHub"
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-muted/60 hover:scale-[1.1] transition-all duration-150"
              >
                <GitBranch className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDialogOpen(true)}
                aria-label="Create new resource"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:scale-[1.1] transition-all duration-150"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            <div className="pt-2">
              <h4 className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Categories</h4>
              <div className="space-y-0.5 pt-0.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`sidebar-item w-full text-sm ${!selectedCategory ? "sidebar-item-active" : ""}`}
                >
                  All
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`sidebar-item w-full text-sm capitalize ${selectedCategory === cat ? "sidebar-item-active" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {allTags.length > 0 && (
              <div className="pt-2">
                <h4 className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Tags</h4>
                <div className="space-y-0.5 pt-0.5">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`sidebar-item w-full text-sm ${selectedTag === tag ? "sidebar-item-active" : ""}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="relative pt-2">
              <h4 className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Sort</h4>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="sidebar-item w-full text-sm"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortBy === "newest" ? "Newest First" : "Oldest First"}
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-20 w-full rounded-lg border border-border bg-card shadow-lg py-1">
                    {(["newest", "oldest"] as const).map((key) => (
                      <button
                        key={key}
                        onClick={() => { setSortBy(key); setSortOpen(false); }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${sortBy === key ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
                      >
                        {key === "newest" ? "Newest First" : "Oldest First"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
        <div className="w-[474px] min-w-0 p-4">
          <ResourceList
            initialItems={initialItems}
            nextCursor={nextCursor}
            allCategories={allCategories}
            allTags={allTags}
            selectedId={selectedId}
            onSelect={setSelectedId}
            selectedCategory={selectedCategory}
            selectedTag={selectedTag}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onTagChange={setSelectedTag}
            onSortChange={setSortBy}
            onItemsUpdate={setAllResources}
          />
        </div>
        {!selectedResource && (
          <ResourceContextPanel
            topResources={initialItems}
            recentNotes={recentNotes}
            projects={projects}
          />
        )}
        <AnimatePresence mode="wait">
          {selectedResource && (
            <ResourceReaderPanel
              key={selectedResource.id}
              resource={selectedResource}
              onClose={() => setSelectedId(null)}
            />
          )}
        </AnimatePresence>
      </div>
      <ResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      {githubImportOpen && <GithubImport onClose={() => setGithubImportOpen(false)} />}
    </>
  );
}
