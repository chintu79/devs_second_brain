"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@/lib/motion";
import {
  FileText,
  Star,
  Clock,
  Archive,
  ChevronDown,
  Hash,
  Tag,
  Layers,
  Plus,
} from "lucide-react";

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
  categories,
  allTags,
  clusters,
  totalNotes,
  favCount,
  archivedCount,
  activeSection,
  onSectionChange,
  activeCategory,
  onCategoryChange,
  activeTag,
  onTagChange,
  onCreate,
}: NoteSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    clusters: false,
    categories: false,
    tags: false,
  });

  function toggleCollapse(key: string) {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const navItems = [
    { id: "all", label: "All Notes", icon: FileText, count: totalNotes },
    { id: "favorites", label: "Favorites", icon: Star, count: favCount },
    { id: "recent", label: "Recent Notes", icon: Clock, count: null },
    { id: "archived", label: "Archived", icon: Archive, count: archivedCount },
  ];

  return (
    <div className="w-56 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Notes</span>
        <button
          onClick={onCreate}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSectionChange(item.id);
              onCategoryChange(null);
              onTagChange(null);
            }}
            className={`sidebar-item w-full text-sm ${
              activeSection === item.id && !activeCategory && !activeTag ? "sidebar-item-active" : ""
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== null && (
              <span className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{item.count}</span>
            )}
          </button>
        ))}

        <div className="h-px bg-border/30 my-2" />

        {/* Knowledge Clusters */}
        <CollapsibleSection
          label="Knowledge Clusters"
          icon={Layers}
          collapsed={collapsed.clusters}
          onToggle={() => toggleCollapse("clusters")}
        >
          {clusters.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                onCategoryChange(null);
                onTagChange(null);
                onSectionChange(`cluster:${c.name}`);
              }}
              className={`sidebar-item w-full text-sm ${
                activeSection === `cluster:${c.name}` ? "sidebar-item-active" : ""
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
              <span className="flex-1 text-left">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </button>
          ))}
        </CollapsibleSection>

        {/* Categories */}
        <CollapsibleSection
          label="Categories"
          icon={Hash}
          collapsed={collapsed.categories}
          onToggle={() => toggleCollapse("categories")}
        >
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => {
                onCategoryChange(c.name);
                onTagChange(null);
                onSectionChange("all");
              }}
              className={`sidebar-item w-full text-sm ${
                activeCategory === c.name ? "sidebar-item-active" : ""
              }`}
            >
              <span className="flex-1 text-left capitalize">{c.name}</span>
              <span className="text-xs text-muted-foreground">{c.count}</span>
            </button>
          ))}
        </CollapsibleSection>

        {/* Tags */}
        <CollapsibleSection
          label="Tags"
          icon={Tag}
          collapsed={collapsed.tags}
          onToggle={() => toggleCollapse("tags")}
        >
          {allTags.map((t) => (
            <button
              key={t.name}
              onClick={() => {
                onTagChange(t.name);
                onCategoryChange(null);
                onSectionChange("all");
              }}
              className={`sidebar-item w-full text-sm ${
                activeTag === t.name ? "sidebar-item-active" : ""
              }`}
            >
              <span className="flex-1 text-left">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.count}</span>
            </button>
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({
  label,
  icon: Icon,
  collapsed,
  onToggle,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-2">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors"
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 ml-auto transition-transform duration-150 ${collapsed ? "-rotate-90" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            variants={collapsible}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
