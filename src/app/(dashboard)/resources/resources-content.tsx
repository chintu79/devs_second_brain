"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, GitBranch, ArrowUpDown, Bookmark, Heart, Clock, Link2 } from "lucide-react";
import { ResourceList } from "@/components/resources/resource-list";
import { createResource } from "@/actions/resources";
import { GithubImport } from "@/components/resources/github-import";
import { ResourceReaderPanel } from "@/components/resources/resource-reader-panel";
import { collapsible } from "@/lib/motion";

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
}

function titleFromUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname === "github.com") {
      return u.pathname.split("/").filter(Boolean).slice(0, 2).join("/");
    }
    const parts = u.pathname.split("/").filter(Boolean).filter(s => !s.includes("."));
    const last = parts.pop() || u.hostname.replace("www.", "");
    return last.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
}

export function ResourcesContent({ initialItems, nextCursor, allCategories, allTags }: ResourcesContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");
  const [githubImportOpen, setGithubImportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [catOpen, setCatOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [allResources, setAllResources] = useState<Resource[]>(initialItems);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [urlInput, setUrlInput] = useState("");

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

  function handleTagClick(tag: string) {
    setSelectedTag(tag === selectedTag ? null : tag);
  }

  async function handleUrlSave() {
    const url = urlInput.trim();
    if (!url) return;
    const formData = new FormData();
    formData.set("title", titleFromUrl(url));
    formData.set("url", url);
    formData.set("category", "frontend");
    formData.set("notes", "");
    formData.set("reason", "");
    formData.set("tags", "");
    const result = await createResource(formData);
    if (result.success && result.id) {
      setUrlInput("");
      window.location.href = `/resources?id=${result.id}&new=true`;
    }
  }

  return (
    <>
      <div data-accent="resources" className="absolute inset-0 flex overflow-hidden">
        <aside className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {/* URL Capture */}
            <div className="px-3 pb-3 border-b border-border/20">
              <div className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-card/50 px-2.5 py-1.5 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <Link2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUrlSave(); } }}
                  placeholder="Paste URL..."
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                <button
                  onClick={handleUrlSave}
                  disabled={!urlInput.trim()}
                  className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-primary text-primary-foreground disabled:opacity-30 transition-opacity"
                >
                  Save
                </button>
              </div>
              <button
                onClick={() => setGithubImportOpen(true)}
                aria-label="Import from GitHub"
                className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                <GitBranch className="h-3 w-3" />
                Import from GitHub
              </button>
            </div>

            {/* Browse */}
            <div className="pt-2">
              <h4 className="px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Browse</h4>
              <div className="space-y-0.5">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedTag(null); setShowFavoritesOnly(false); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${!selectedCategory && !selectedTag && !showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  All Resources
                </button>
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedTag(null); setShowFavoritesOnly(!showFavoritesOnly); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Heart className="h-3.5 w-3.5" />
                  Favorites
                </button>
              </div>
            </div>

            {/* Categories — collapsible */}
            {!showFavoritesOnly && (
              <div className="pt-2">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors"
                >
                  {catOpen ? <ArrowUpDown className="h-3 w-3 rotate-180" /> : <ArrowUpDown className="h-3 w-3" />}
                  Categories
                </button>
                <AnimatePresence initial={false}>
                  {catOpen && (
                    <motion.div variants={collapsible} className="overflow-hidden">
                      <div className="space-y-0.5 pt-0.5">
                        {allCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                            className={`sidebar-item w-full text-sm capitalize transition-transform duration-150 hover:scale-[1.02] ${selectedCategory === cat ? "sidebar-item-active" : ""}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Tags — collapsible */}
            {!showFavoritesOnly && allTags.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setTagsOpen(!tagsOpen)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors"
                >
                  {tagsOpen ? <ArrowUpDown className="h-3 w-3 rotate-180" /> : <ArrowUpDown className="h-3 w-3" />}
                  Tags
                </button>
                <AnimatePresence initial={false}>
                  {tagsOpen && (
                    <motion.div variants={collapsible} className="overflow-hidden">
                      <div className="space-y-0.5 pt-0.5">
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${selectedTag === tag ? "sidebar-item-active" : ""}`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Sort */}
            <div className="pt-3 border-t border-border/20">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <ArrowUpDown className="h-3 w-3 text-section-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="flex-1 text-xs bg-transparent text-muted-foreground border-0 cursor-pointer focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        </aside>
        <div className="w-[474px] shrink-0 p-4">
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
            favoritesOnly={showFavoritesOnly}
          />
        </div>
        <AnimatePresence mode="wait">
          {selectedResource && (
            <ResourceReaderPanel
              key={selectedResource.id}
              resource={selectedResource}
              onClose={() => setSelectedId(null)}
              onUpdate={(updated) => setAllResources((prev) => prev.map((r) => r.id === updated.id ? { ...r, ...updated } : r))}
              onTagClick={handleTagClick}
              autoEdit={searchParams.get("new") === "true"}
            />
          )}
        </AnimatePresence>
      </div>
      {githubImportOpen && <GithubImport onClose={() => setGithubImportOpen(false)} />}
    </>
  );
}
