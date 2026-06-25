"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { NoteSidebar } from "./note-sidebar";
import { NoteList } from "./note-list";
import { NoteReaderPanel } from "./note-reader-panel";
import { NoteDialog } from "@/components/vaults/note-dialog";
import { useSearchParams, useRouter } from "next/navigation";

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
  const [createOpen, setCreateOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const flatList = useMemo(() => filtered.map((n) => n.id), [filtered]);

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
    setCreateOpen(true);
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
        className={`w-96 shrink-0 border-r border-border/50 flex flex-col px-2 ${selectedId ? "" : "flex-1"
          }`}
      >
        {/* Search */}
        <div className="px-4 pt-3 pb-2 border-b border-border/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex h-9 w-full rounded-md border border-border bg-card pl-9 pr-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <button
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 hover:scale-[1.03] transition-all duration-150"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 border-b border-border/20">
          <span className="text-xs text-muted-foreground">
            {filtered.length} note{filtered.length !== 1 ? "s" : ""}
            {searchQuery.trim() && <> &middot; searching &ldquo;{searchQuery}&rdquo;</>}
          </span>
        </div>

        <NoteList
          ref={listRef}
          notes={filtered}
          projects={projects}
          selectedId={selectedId}
          onSelect={handleSelect}
          onFavorite={() => { }}
        />
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
          />
        )}
      </AnimatePresence>

      <NoteDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
