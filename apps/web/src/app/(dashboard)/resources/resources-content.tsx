"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, GitBranch, ArrowUpDown, Bookmark, Heart, X, Link2 } from "lucide-react";
import { ResourceList } from "@/components/resources/resource-list";
import { createResource } from "@/actions/resources";
import { GithubImport } from "@/components/resources/github-import";
import { ResourceReaderPanel } from "@/components/resources/resource-reader-panel";
import { NotesEditor } from "@/components/resources/notes-editor";
import { collapsible, slideInRight } from "@devventory/motion";

const MIN_SIDEBAR = 220;
const MAX_SIDEBAR = 500;
const DEFAULT_SIDEBAR = 300;
const SIDEBAR_STORAGE_KEY = "resources-sidebar-width";
const NOTES_STORAGE_KEY = "resources-notes";
const PANEL_FRACTION_KEY = "resources-right-panel-fraction";
const DEBOUNCE_MS = 500;
const MIN_PANEL = 0.35;
const MAX_PANEL = 0.75;
const DEFAULT_PANEL = 0.6;

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

  // Sidebar resize
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarWidthRef = useRef(DEFAULT_SIDEBAR);

  // Right panel fraction of available width (0.35-0.75)
  const [panelFraction, setPanelFraction] = useState(DEFAULT_PANEL);
  const panelFractionRef = useRef(DEFAULT_PANEL);
  const containerRef = useRef<HTMLDivElement>(null);

  // Notes remount key
  const [notesKey, setNotesKey] = useState(0);

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

  // Restore persisted widths
  useEffect(() => {
    const savedSidebar = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (savedSidebar) {
      const p = parseInt(savedSidebar);
      if (!isNaN(p)) setSidebarWidth(Math.max(MIN_SIDEBAR, Math.min(MAX_SIDEBAR, p)));
    }
    const savedFraction = localStorage.getItem(PANEL_FRACTION_KEY);
    if (savedFraction) {
      const f = parseFloat(savedFraction);
      if (!isNaN(f)) {
        const clamped = Math.max(MIN_PANEL, Math.min(MAX_PANEL, f));
        setPanelFraction(clamped);
        panelFractionRef.current = clamped;
      }
    }
  }, []);

  const handleNewNote = useCallback(() => {
    localStorage.removeItem(NOTES_STORAGE_KEY);
    setNotesKey((k) => k + 1);
    setSelectedId(null);
  }, [setSelectedId]);

  // Sidebar resize handlers
  const persistSidebar = useCallback((w: number) => {
    const clamped = Math.max(MIN_SIDEBAR, Math.min(MAX_SIDEBAR, w));
    setSidebarWidth(clamped);
    sidebarWidthRef.current = clamped;
    setIsResizing(false);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(clamped));
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const rafRef = useRef(0);
  const lastClickRef = useRef(0);

  const handleSidebarDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastClickRef.current < 300) {
        persistSidebar(DEFAULT_SIDEBAR);
        lastClickRef.current = 0;
        return;
      }
      lastClickRef.current = now;
      isDraggingRef.current = true;
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarWidthRef.current;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      const move = (ev: PointerEvent) => {
        if (!isDraggingRef.current) return;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const delta = ev.clientX - startXRef.current;
          const w = Math.max(MIN_SIDEBAR, Math.min(MAX_SIDEBAR, startWidthRef.current + delta));
          setSidebarWidth(w);
          sidebarWidthRef.current = w;
        });
      };
      const up = () => {
        isDraggingRef.current = false;
        persistSidebar(sidebarWidthRef.current);
        target.releasePointerCapture(e.pointerId);
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    },
    [persistSidebar]
  );

  // Right panel resize
  const panelStartXRef = useRef(0);
  const panelStartFractionRef = useRef(0);
  const panelDraggingRef = useRef(false);
  const panelRafRef = useRef(0);
  const panelLastClickRef = useRef(0);

  const persistPanelFraction = useCallback((f: number) => {
    const clamped = Math.max(MIN_PANEL, Math.min(MAX_PANEL, f));
    setPanelFraction(clamped);
    panelFractionRef.current = clamped;
    localStorage.setItem(PANEL_FRACTION_KEY, String(clamped));
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const handlePanelDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - panelLastClickRef.current < 300) {
        persistPanelFraction(DEFAULT_PANEL);
        panelLastClickRef.current = 0;
        return;
      }
      panelLastClickRef.current = now;
      panelDraggingRef.current = true;
      panelStartXRef.current = e.clientX;
      panelStartFractionRef.current = panelFractionRef.current;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      const containerWidth = containerRef.current?.clientWidth || 1;
      const move = (ev: PointerEvent) => {
        if (!panelDraggingRef.current) return;
        cancelAnimationFrame(panelRafRef.current);
        panelRafRef.current = requestAnimationFrame(() => {
          const delta = ev.clientX - panelStartXRef.current;
          const newFraction = Math.max(MIN_PANEL, Math.min(MAX_PANEL, panelStartFractionRef.current - delta / containerWidth));
          setPanelFraction(newFraction);
          panelFractionRef.current = newFraction;
        });
      };
      const up = () => {
        panelDraggingRef.current = false;
        persistPanelFraction(panelFractionRef.current);
        target.releasePointerCapture(e.pointerId);
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", up);
      };
      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", up);
    },
    [persistPanelFraction]
  );

  const listFlex = 1 - panelFraction;
  const panelFlex = panelFraction;

  return (
    <>
      <div data-accent="resources" className="absolute inset-0 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className="hidden xl:flex h-full shrink-0 bg-sidebar flex-col border-r border-border/50 overflow-hidden relative"
          style={{
            width: sidebarWidth,
            transition: isResizing ? "none" : "width 200ms ease-out",
          }}
        >
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
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

          <div
            onPointerDown={handleSidebarDrag}
            aria-label="Resize sidebar"
            role="separator"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") persistSidebar(sidebarWidth - 20);
              if (e.key === "ArrowRight") persistSidebar(sidebarWidth + 20);
            }}
            className="absolute right-0 top-0 bottom-0 w-[5px] z-20 cursor-col-resize group -mr-px"
          >
            <div className="absolute inset-y-0 right-0 w-[5px] transition-all duration-150 group-hover:bg-primary/40 group-hover:shadow-[0_0_8px_-2px_rgba(99,102,241,0.4)] group-active:bg-primary/60 rounded-full" />
          </div>
        </aside>

        {/* Main area: Resource List + Right Panel */}
        <div ref={containerRef} className="flex-1 min-w-0 flex overflow-hidden">
          {/* Resource List */}
          <div className="min-w-0 overflow-y-auto p-4" style={{ flex: listFlex }}>
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

          {/* Resize handle */}
          <div
            onPointerDown={handlePanelDrag}
            aria-label="Resize panel"
            role="separator"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") persistPanelFraction(panelFraction + 0.05);
              if (e.key === "ArrowRight") persistPanelFraction(panelFraction - 0.05);
            }}
            className="w-[5px] z-10 cursor-col-resize shrink-0 group relative"
          >
            <div className="absolute inset-y-0 left-0 w-[5px] transition-all duration-150 group-hover:bg-primary/40 group-hover:shadow-[0_0_8px_-2px_rgba(99,102,241,0.4)] group-active:bg-primary/60 rounded-full" />
          </div>

          {/* Right Panel */}
          <div className="min-w-0 overflow-hidden" style={{ flex: panelFlex }}>
            <AnimatePresence mode="wait">
              {selectedResource ? (
                <motion.div
                  key="reader"
                  variants={slideInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-full"
                >
                  <ResourceReaderPanel
                    resource={selectedResource}
                    onClose={() => setSelectedId(null)}
                    onUpdate={(updated) => setAllResources((prev) => prev.map((r) => r.id === updated.id ? { ...r, ...updated } : r))}
                    onTagClick={handleTagClick}
                    autoEdit={searchParams.get("new") === "true"}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  className="h-full"
                >
                  <NotesEditor key={notesKey} onNewNote={handleNewNote} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {githubImportOpen && <GithubImport onClose={() => setGithubImportOpen(false)} />}
    </>
  );
}
