"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, ArrowUpDown, Bookmark, Star } from "lucide-react";
import { createPrompt } from "@/actions/prompts";
import { PromptList } from "@/components/prompts/prompt-list";
import { PromptPreviewPanel } from "@/components/prompts/prompt-preview-panel";
import { NotesEditor } from "@/components/resources/notes-editor";
import { collapsible, slideInRight } from "@devventory/motion";

const MIN_SIDEBAR = 220;
const MAX_SIDEBAR = 500;
const DEFAULT_SIDEBAR = 300;
const SIDEBAR_STORAGE_KEY = "prompts-sidebar-width";
const NOTES_STORAGE_KEY = "prompts-notes";
const PANEL_FRACTION_KEY = "prompts-right-panel-fraction";
const MIN_PANEL = 0.35;
const MAX_PANEL = 0.75;
const DEFAULT_PANEL = 0.6;

interface Prompt {
  id: string;
  title: string;
  prompt: string;
  category: string;
  tags: string[];
  useCase: string;
  favorite: boolean;
  useCount: number;
  lastUsedAt: Date | null;
  createdAt: Date;
}

interface PromptsContentProps {
  initialItems: Prompt[];
  nextCursor: string | null;
  categories: string[];
}

type SortMode = "newest" | "oldest" | "name" | "popular";

const PROMPT_TEMPLATE = "## Role\n\n## Context\n\n## Instructions\n\n## Constraints\n\n## Variables\n\n## Expected Output\n";

export function PromptsContent({ initialItems, nextCursor, categories }: PromptsContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [catOpen, setCatOpen] = useState(true);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [allPrompts, setAllPrompts] = useState<Prompt[]>(initialItems);
  const [notesKey, setNotesKey] = useState(0);

  // Sidebar resize
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarWidthRef = useRef(DEFAULT_SIDEBAR);

  // Right panel fraction
  const [panelFraction, setPanelFraction] = useState(DEFAULT_PANEL);
  const panelFractionRef = useRef(DEFAULT_PANEL);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPrompt = selectedId ? allPrompts.find((p) => p.id === selectedId) || null : null;

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("id", id);
      else params.delete("id");
      router.replace(`/prompts?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  async function handleCreate() {
    const formData = new FormData();
    formData.set("title", "");
    formData.set("prompt", PROMPT_TEMPLATE);
    formData.set("category", "coding");
    formData.set("useCase", "");
    formData.set("tags", "");
    const result = await createPrompt(formData);
    if (result.success && result.id) {
      window.location.href = `/prompts?id=${result.id}&new=true`;
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

  // Sidebar resize
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
      <div data-accent="prompts" className="absolute inset-0 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className="hidden xl:flex h-full shrink-0 bg-sidebar flex-col border-r border-border/50 overflow-hidden relative"
          style={{
            width: sidebarWidth,
            transition: isResizing ? "none" : "width 200ms ease-out",
          }}
        >
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            <div className="px-3 pb-2 border-b border-border/20">
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]"
              >
                <Plus className="h-3.5 w-3.5" />
                New Prompt
              </button>
            </div>

            <div className="pt-1">
              <h4 className="px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Browse</h4>
              <div className="space-y-0.5">
                <button
                  onClick={() => { setSelectedCategory(null); setShowFavoritesOnly(false); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${!selectedCategory && !showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  All Prompts
                </button>
                <button
                  onClick={() => { setSelectedCategory(null); setShowFavoritesOnly(!showFavoritesOnly); }}
                  className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${showFavoritesOnly ? "sidebar-item-active" : ""}`}
                >
                  <Star className="h-3.5 w-3.5" />
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
                        {categories.map((cat) => (
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

            <div className="pt-3 border-t border-border/20">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <ArrowUpDown className="h-3 w-3 text-section-foreground" />
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="flex-1 text-xs bg-transparent text-muted-foreground border-0 cursor-pointer focus:outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="popular">Most Used</option>
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

        {/* Main area */}
        <div ref={containerRef} className="flex-1 min-w-0 flex overflow-hidden">
          {/* Prompt List */}
          <div className="min-w-0 overflow-y-auto p-4" style={{ flex: listFlex }}>
            <PromptList
              initialItems={initialItems}
              nextCursor={nextCursor}
              categories={categories}
              sortMode={sortMode}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onTagClick={() => {}}
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
              {selectedPrompt ? (
                <motion.div
                  key="reader"
                  variants={slideInRight}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="h-full"
                >
                  <PromptPreviewPanel
                    prompt={selectedPrompt}
                    onClose={() => setSelectedId(null)}
                    onUpdate={() => router.refresh()}
                    onTagClick={() => {}}
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
                  <NotesEditor
                    key={notesKey}
                    onNewNote={handleNewNote}
                    storageKey={NOTES_STORAGE_KEY}
                    placeholder="Start writing your prompt..."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
