"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@/lib/motion";
import {
  Radio,
  Sparkles,
  Globe,
  Layout,
  Server,
  Container,
  Smartphone,
  Terminal,
  Database,
  Bot,
  Wrench,
  Cloud,
  Bookmark,
  Archive,
  Clock,
  ChevronDown,
  Search,
} from "lucide-react";

interface RadarSidebarProps {
  categories: { id: string; label: string; count?: number }[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  bookmarkedCount: number;
  savedCount: number;
  recentlyViewedCount: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Radio,
  ai: Sparkles,
  agents: Bot,
  frontend: Layout,
  backend: Server,
  devops: Container,
  flutter: Smartphone,
  linux: Terminal,
  datascience: Database,
  devtools: Wrench,
  infrastructure: Cloud,
};

export function RadarSidebar({
  categories,
  activeSection,
  onSectionChange,
  bookmarkedCount,
  savedCount,
  recentlyViewedCount,
}: RadarSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    explore: false,
  });

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const personalItems = [
    { id: "bookmarked", label: "Bookmarks", icon: Bookmark, count: bookmarkedCount },
    { id: "saved", label: "Saved Repositories", icon: Archive, count: savedCount },
    { id: "viewed", label: "Previously Viewed", icon: Clock, count: recentlyViewedCount },
  ];

  return (
    <div className="w-56 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Radar</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {/* Personal items */}
        {personalItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`sidebar-item w-full text-sm transition-transform duration-150 ${activeSection === item.id ? "sidebar-item-active" : "hover:scale-[1.02]"}`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.count > 0 && (
              <span className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{item.count}</span>
            )}
          </button>
        ))}

        <div className="h-px bg-border/30 my-2" />

        {/* Explore section */}
        <CollapsibleSection
          label="Explore"
          icon={Search}
          collapsed={collapsed.explore}
          onToggle={() => toggle("explore")}
        >
          {categories.map((cat) => {
            const Icon = iconMap[cat.id] || Radio;
            return (
              <button
                key={cat.id}
                onClick={() => onSectionChange(cat.id)}
                className={`sidebar-item w-full text-sm ${activeSection === cat.id ? "sidebar-item-active" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{cat.label}</span>
                {cat.count !== undefined && (
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                )}
              </button>
            );
          })}
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({
  label, icon: Icon, collapsed, onToggle, children,
}: {
  label: string; icon: React.ComponentType<{ className?: string }>; collapsed: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="pt-2">
      <button onClick={onToggle} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] hover:text-foreground transition-colors">
        <Icon className="h-3.5 w-3.5" />
        {label}
        <ChevronDown className={`h-3.5 w-3.5 ml-auto transition-transform duration-150 ${collapsed ? "-rotate-90" : ""}`} />
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
