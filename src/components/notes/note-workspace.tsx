"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Plus, ChevronDown, X } from "lucide-react";
import { NoteSidebar } from "./note-sidebar";
import { NoteList } from "./note-list";
import { NoteReaderPanel } from "./note-reader-panel";

import { createNote, deleteNote, toggleNoteFavorite } from "@/actions/notes";

const NOTE_TEMPLATE = "## Ideas\n\n\n## References\n\n\n## Questions\n\n\n## Summary\n";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  favorite: boolean;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Resource {
  id: string;
  title: string;
  url: string;
  tags: string[];
  category: string;
}

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  tags: string[];
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

interface NoteWorkspaceProps {
  notes: Note[];
  resources: Resource[];
  prompts: PromptItem[];
  projects: Project[];
}

export function NoteWorkspace({ notes, resources, prompts, projects }: NoteWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("id");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const PAGE_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  // Compute sidebar data
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((n) => map.set(n.category, (map.get(n.category) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((n) => n.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  const clusters = useMemo(() => {
    const map = new Map<string, number>();
    notes.forEach((n) => {
      const cluster = n.category.charAt(0).toUpperCase() + n.category.slice(1);
      map.set(cluster, (map.get(cluster) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [notes]);

  // Filter notes based on sidebar + search
  const filtered = useMemo(() => {
    let result = [...notes];

    if (activeSection === "favorites") {
      result = result.filter((n) => n.favorite);
    } else if (activeSection === "archived") {
      result = result.filter((n) => n.archived);
    } else if (activeSection === "recent") {
      result = result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 10);
    } else if (activeSection === "all") {
      result = result.filter((n) => !n.archived);
    } else if (activeSection.startsWith("cluster:")) {
      const clusterName = activeSection.replace("cluster:", "");
      result = result.filter(
        (n) => n.category.toLowerCase() === clusterName.toLowerCase()
      );
    }

    if (activeCategory) {
      result = result.filter((n) => n.category === activeCategory);
    }

    if (activeTag) {
      result = result.filter((n) => n.tags.includes(activeTag));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)) ||
          n.category.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [notes, activeSection, activeCategory, activeTag, searchQuery]);

  const displayedNotes = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const flatList = useMemo(() => displayedNotes.map((n) => n.id), [displayedNotes]);

  const selectedNote = useMemo(() => {
    if (!selectedId) return null;
    return notes.find((n) => n.id === selectedId) || null;
  }, [selectedId, notes]);

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("id", id);
      } else {
        params.delete("id");
      }
      const qs = params.toString();
      const url = qs ? `/notes?${qs}` : "/notes";
      router.replace(url, { scroll: false });
    },
    [router, searchParams]
  );


  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleClose() {
    setSelectedId(null);
    listRef.current?.focus();
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const currentIndex = selectedId ? flatList.indexOf(selectedId) : -1;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? 1 : -1;
        let nextIndex = currentIndex + direction;
        if (nextIndex < 0) nextIndex = flatList.length - 1;
        if (nextIndex >= flatList.length) nextIndex = 0;
        setSelectedId(flatList[nextIndex]);
      }

      if (e.key === "Escape" && selectedId) {
        e.preventDefault();
        handleClose();
      }

      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    },
    [selectedId, flatList]
  );

  function handleCreate() {
    const formData = new FormData();
    formData.set("title", "");
    formData.set("content", NOTE_TEMPLATE);
    formData.set("category", "personal");
    formData.set("tags", "");
    createNote(formData).then((result) => {
      if (result.success && result.id) {
        window.location.href = `/notes?id=${result.id}&new=true`;
      }
    });
  }

  function handleTagClick(tag: string) {
    setActiveTag(tag);
  }

  const favCount = notes.filter((n) => n.favorite).length;
  const archivedCount = notes.filter((n) => n.archived).length;

  return (
    <div className="flex h-full" onKeyDown={handleKeyDown}>
      {/* Left sidebar */}
      <NoteSidebar
        categories={categories}
        allTags={allTags}
        clusters={clusters}
        totalNotes={notes.length}
        favCount={favCount}
        archivedCount={archivedCount}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        onCreate={handleCreate}
      />

      {/* Notes list */}
      <div
        className="w-[474px] shrink-0 border-r border-border/50 flex flex-col px-2"
      >
        {/* Search */}
        <div className="px-4 pt-3 pb-2 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <button
                onClick={handleCreate}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 hover:scale-[1.03] transition-all duration-150"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Results count + filter chips */}
        <div className="px-4 py-2 border-b border-border/20 space-y-2">
          <span className="text-xs text-muted-foreground">
            {filtered.length} note{filtered.length !== 1 ? "s" : ""}
            {searchQuery.trim() && <> &middot; searching &ldquo;{searchQuery}&rdquo;</>}
          </span>
          {(activeCategory || activeTag) && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all">
                  {activeCategory}
                  <button onClick={() => setActiveCategory(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/60 transition-all" aria-label="Clear category filter">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {activeTag && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:scale-[1.03] transition-all">
                  #{activeTag}
                  <button onClick={() => setActiveTag(null)} className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted/60 transition-all" aria-label="Clear tag filter">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        <NoteList
          ref={listRef}
          notes={displayedNotes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={(id) => {
            deleteNote(id).then(() => {
              if (selectedIdRef.current === id) {
                router.replace("/notes");
              } else {
                router.refresh();
              }
            });
          }}
          onFavorite={(id) => { toggleNoteFavorite(id).catch(() => toast.error("Failed to toggle favorite")); }}
        />

        {hasMore && (
          <motion.button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="w-full py-2 text-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-all cursor-pointer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)} more
          </motion.button>
        )}
      </div>

      {/* Reader panel */}
      <AnimatePresence mode="wait">
        {selectedNote && (
          <NoteReaderPanel
            key={selectedNote.id}
            note={selectedNote}
            allNotes={notes}
            allResources={resources}
            allPrompts={prompts}
            allProjects={projects}
            onClose={handleClose}
            onUpdate={() => router.refresh()}
            onTagClick={handleTagClick}
            autoEdit={searchParams.get("new") === "true"}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
