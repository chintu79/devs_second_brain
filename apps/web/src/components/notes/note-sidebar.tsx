"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@devventory/motion";
import { FileText, Star, Clock, Archive, Hash, Tag, Layers, Plus, ArrowUpDown, Bookmark } from "lucide-react";

interface NoteSidebarProps {
  categories: { name: string; count: number }[];
  allTags: { name: string; count: number }[];
  clusters: { name: string; count: number }[];
  totalNotes: number;
  favCount: number;
  archivedCount: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  onCreate: () => void;
}

export function NoteSidebar({
  categories, allTags, clusters, totalNotes, favCount, archivedCount,
  activeSection, onSectionChange, activeCategory, onCategoryChange, activeTag, onTagChange, onCreate,
}: NoteSidebarProps) {
  const [catOpen, setCatOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [clusterOpen, setClusterOpen] = useState(false);

  return (
    <div className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Create */}
        <div className="px-3 pb-2 border-b border-border/20">
          <button onClick={onCreate} aria-label="Create new note" className="inline-flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
            <Plus className="h-3.5 w-3.5" />
            New Note
          </button>
        </div>

        {/* Browse */}
        <div className="pt-1">
          <h4 className="px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Browse</h4>
          <div className="space-y-0.5">
            <button onClick={() => { onSectionChange("all"); onCategoryChange(null); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "all" && !activeCategory && !activeTag ? "sidebar-item-active" : ""}`}>
              <Bookmark className="h-3.5 w-3.5" />
              All Notes
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{totalNotes}</span>
            </button>
            <button onClick={() => { onSectionChange("favorites"); onCategoryChange(null); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "favorites" ? "sidebar-item-active" : ""}`}>
              <Star className="h-3.5 w-3.5" />
              Favorites
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{favCount}</span>
            </button>
            <button onClick={() => { onSectionChange("recent"); onCategoryChange(null); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "recent" ? "sidebar-item-active" : ""}`}>
              <Clock className="h-3.5 w-3.5" />
              Recent
            </button>
            <button onClick={() => { onSectionChange("archived"); onCategoryChange(null); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "archived" ? "sidebar-item-active" : ""}`}>
              <Archive className="h-3.5 w-3.5" />
              Archived
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{archivedCount}</span>
            </button>
          </div>
        </div>

        {/* Clusters */}
        {clusters.length > 0 && (
          <div className="pt-2">
            <button onClick={() => setClusterOpen(!clusterOpen)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-all">
              <Layers className="h-3.5 w-3.5" />
              Clusters
              <ArrowUpDown className={`h-3 w-3 ml-auto transition-transform duration-150 ${clusterOpen ? "" : "rotate-180"}`} />
            </button>
            <AnimatePresence initial={false}>
              {clusterOpen && (
                <motion.div variants={collapsible} className="overflow-hidden">
                  <div className="space-y-0.5 pt-0.5">
                    {clusters.map((c) => (
                      <button key={c.name} onClick={() => { onCategoryChange(null); onTagChange(null); onSectionChange(`cluster:${c.name}`); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === `cluster:${c.name}` ? "sidebar-item-active" : ""}`}>
                        <span className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                        <span className="flex-1 text-left">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.count}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="pt-2">
            <button onClick={() => setCatOpen(!catOpen)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-all">
              <Hash className="h-3.5 w-3.5" />
              Categories
              <ArrowUpDown className={`h-3 w-3 ml-auto transition-transform duration-150 ${catOpen ? "" : "rotate-180"}`} />
            </button>
            <AnimatePresence initial={false}>
              {catOpen && (
                <motion.div variants={collapsible} className="overflow-hidden">
                  <div className="space-y-0.5 pt-0.5">
                    {categories.map((c) => (
                      <button key={c.name} onClick={() => { onCategoryChange(c.name); onTagChange(null); onSectionChange("all"); }} className={`sidebar-item w-full text-sm capitalize transition-transform duration-150 hover:scale-[1.02] ${activeCategory === c.name ? "sidebar-item-active" : ""}`}>
                        <span className="flex-1 text-left">{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.count}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="pt-2">
            <button onClick={() => setTagsOpen(!tagsOpen)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-all">
              <Tag className="h-3.5 w-3.5" />
              Tags
              <ArrowUpDown className={`h-3 w-3 ml-auto transition-transform duration-150 ${tagsOpen ? "" : "rotate-180"}`} />
            </button>
            <AnimatePresence initial={false}>
              {tagsOpen && (
                <motion.div variants={collapsible} className="overflow-hidden">
                  <div className="space-y-0.5 pt-0.5">
                    {allTags.map((t) => (
                      <button key={t.name} onClick={() => { onTagChange(t.name); onCategoryChange(null); onSectionChange("all"); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeTag === t.name ? "sidebar-item-active" : ""}`}>
                        <span className="flex-1 text-left">{t.name}</span>
                        <span className="text-xs text-muted-foreground">{t.count}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
