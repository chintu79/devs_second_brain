"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collapsible } from "@/lib/motion";
import {
  Radio, Sparkles, Globe, Layout, Server, Container, Smartphone,
  Terminal, Database, Bot, Wrench, Cloud, Bookmark, Clock,
  ChevronDown, Search, GitBranch, Gem, Layers, User,
} from "lucide-react";
import { GithubImport } from "@/components/resources/github-import";

interface RadarSidebarProps {
  categories: { id: string; label: string; count?: number }[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  bookmarkedCount: number;
  recentlyViewedCount: number;
  forYouCount: number;
  myStackCount: number;
  gemsCount: number;
  userTags: string[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Globe,
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
  categories, activeSection, onSectionChange,
  bookmarkedCount, recentlyViewedCount,
  forYouCount, myStackCount, gemsCount, userTags,
}: RadarSidebarProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    explore: true,
  });
  const [githubImportOpen, setGithubImportOpen] = useState(false);

  const toggle = (key: string) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  const personalItems = [
    { id: "for-you", label: "For You", icon: Layers, count: forYouCount },
    { id: "all", label: "Trending Today", icon: Globe, count: 0 },
    { id: "gems", label: "Hidden Gems", icon: Gem, count: gemsCount },
    ...(userTags.length > 0 ? [{ id: "my-stack", label: "My Stack", icon: User, count: myStackCount }] : []),
  ];

  const browseItems = [
    { id: "bookmarked", label: "Saved", icon: Bookmark, count: bookmarkedCount },
    { id: "viewed", label: "Recently Viewed", icon: Clock, count: recentlyViewedCount },
  ];

  return (
    <div className="w-56 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border/30">
        <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Radar</span>
        <button
          onClick={() => setGithubImportOpen(true)}
          aria-label="Import from GitHub"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
        >
          <GitBranch className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <div className="px-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.12em]">Personal</div>
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

        <div className="px-3 pb-1 text-[10px] font-semibold text-sidebar-foreground/40 uppercase tracking-[0.12em]">Browse</div>
        {browseItems.map((item) => (
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
      {githubImportOpen && <GithubImport onClose={() => setGithubImportOpen(false)} />}
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
      <button onClick={onToggle} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-all">
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
