"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@/lib/motion";
import {
  FolderKanban,
  Star,
  Clock,
  Archive,
  ChevronDown,
  Tag,
  Layers,
  CircleDot,
  FlaskConical,
  Hammer,
  CheckCircle2,
  Plus,
} from "lucide-react";

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
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    quickFilters: false,
  });

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const navItems = [
    { id: "all", label: "All Projects", icon: FolderKanban, count: total },
    { id: "active", label: "Active", icon: CircleDot, count: activeCount },
    { id: "planning", label: "Planning", icon: Layers, count: planningCount },
    { id: "research", label: "Research", icon: FlaskConical, count: researchCount },
    { id: "building", label: "Building", icon: Hammer, count: buildingCount },
    { id: "completed", label: "Completed", icon: CheckCircle2, count: completedCount },
    { id: "archived", label: "Archived", icon: Archive, count: archivedCount },
    { id: "favorites", label: "Favorites", icon: Star, count: favCount },
  ];

  return (
    <div className="h-[100vh] w-56 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Projects</span>
        <button onClick={onCreate} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:scale-[1.1] transition-all duration-150">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onSectionChange(item.id); onTagChange(null); }}
            className={`sidebar-item w-full text-sm transition-transform duration-150 ${activeSection === item.id && !activeTag ? "sidebar-item-active" : "hover:scale-[1.02]"}`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count !== null && (
              <span className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{item.count}</span>
            )}
          </button>
        ))}

        <div className="h-px bg-border/30 my-2" />

        <CollapsibleSection label="Quick Filters" icon={Tag} collapsed={collapsed.quickFilters} onToggle={() => toggle("quickFilters")}>
          {allTags.map((t) => (
            <button
              key={t.name}
              onClick={() => { onTagChange(activeTag === t.name ? null : t.name); onSectionChange("all"); }}
              className={`sidebar-item w-full text-sm transition-transform duration-150 ${activeTag === t.name ? "sidebar-item-active" : "hover:scale-[1.02]"}`}
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

function CollapsibleSection({ label, icon: Icon, collapsed, onToggle, children }: {
  label: string; icon: React.ComponentType<{ className?: string }>; collapsed: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="pt-2">
      <button onClick={onToggle} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] hover:text-foreground hover:scale-[1.02] transition-all duration-150">
        <Icon className="h-3.5 w-3.5" />
        {label}
        <ChevronDown className={`h-3 w-3 ml-auto transition-transform duration-150 ${collapsed ? "-rotate-90" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div variants={collapsible} className="overflow-hidden">
            <div className="space-y-0.5 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
