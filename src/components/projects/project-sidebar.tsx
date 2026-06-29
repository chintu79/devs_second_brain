"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@/lib/motion";
import { FolderKanban, Star, CircleDot, Layers, FlaskConical, Hammer, CheckCircle2, Archive, Tag, Plus, ArrowUpDown, Bookmark } from "lucide-react";

interface ProjectSidebarProps {
  total: number;
  activeCount: number;
  planningCount: number;
  researchCount: number;
  buildingCount: number;
  completedCount: number;
  archivedCount: number;
  favCount: number;
  allTags: { name: string; count: number }[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  onCreate: () => void;
}

export function ProjectSidebar({
  total, activeCount, planningCount, researchCount, buildingCount, completedCount, archivedCount, favCount,
  allTags, activeSection, onSectionChange, activeTag, onTagChange, onCreate,
}: ProjectSidebarProps) {
  const [tagsOpen, setTagsOpen] = useState(false);

  return (
    <div className="hidden xl:flex h-full w-56 shrink-0 bg-sidebar flex-col border-r border-border/50">
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Create */}
        <div className="px-3 pb-2 border-b border-border/20">
          <button onClick={onCreate} aria-label="Create new project" className="inline-flex items-center gap-1.5 w-full px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-all hover:scale-[1.03]">
            <Plus className="h-3.5 w-3.5" />
            New Project
          </button>
        </div>

        {/* Browse */}
        <div className="pt-1">
          <h4 className="px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Browse</h4>
          <div className="space-y-0.5">
            <button onClick={() => { onSectionChange("all"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "all" && !activeTag ? "sidebar-item-active" : ""}`}>
              <Bookmark className="h-3.5 w-3.5" />
              All Projects
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{total}</span>
            </button>
            <button onClick={() => { onSectionChange("active"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "active" ? "sidebar-item-active" : ""}`}>
              <CircleDot className="h-3.5 w-3.5" />
              Active
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{activeCount}</span>
            </button>
            <button onClick={() => { onSectionChange("planning"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "planning" ? "sidebar-item-active" : ""}`}>
              <Layers className="h-3.5 w-3.5" />
              Planning
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{planningCount}</span>
            </button>
            <button onClick={() => { onSectionChange("research"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "research" ? "sidebar-item-active" : ""}`}>
              <FlaskConical className="h-3.5 w-3.5" />
              Research
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{researchCount}</span>
            </button>
            <button onClick={() => { onSectionChange("building"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "building" ? "sidebar-item-active" : ""}`}>
              <Hammer className="h-3.5 w-3.5" />
              Building
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{buildingCount}</span>
            </button>
            <button onClick={() => { onSectionChange("completed"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "completed" ? "sidebar-item-active" : ""}`}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{completedCount}</span>
            </button>
            <button onClick={() => { onSectionChange("archived"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "archived" ? "sidebar-item-active" : ""}`}>
              <Archive className="h-3.5 w-3.5" />
              Archived
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{archivedCount}</span>
            </button>
            <button onClick={() => { onSectionChange("favorites"); onTagChange(null); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeSection === "favorites" ? "sidebar-item-active" : ""}`}>
              <Star className="h-3.5 w-3.5" />
              Favorites
              <span className="ml-auto text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{favCount}</span>
            </button>
          </div>
        </div>

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
                      <button key={t.name} onClick={() => { onTagChange(activeTag === t.name ? null : t.name); onSectionChange("all"); }} className={`sidebar-item w-full text-sm transition-transform duration-150 hover:scale-[1.02] ${activeTag === t.name ? "sidebar-item-active" : ""}`}>
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
