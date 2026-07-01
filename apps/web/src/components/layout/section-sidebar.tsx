"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ease } from "@devventory/motion";
import {
  Link2, MessageSquare, StickyNote, FolderKanban, Radio,
  Bookmark, Heart, Plus, Clock, Star, Hash, Archive,
  Play, Code, HelpCircle, type LucideIcon,
} from "lucide-react";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarConfig {
  label: string;
  accent: string;
  items: SidebarItem[];
}

const sidebarConfigs: Record<string, SidebarConfig> = {
  "/resources": {
    label: "Resources",
    accent: "resources",
    items: [
      { label: "All Resources", href: "/resources", icon: Link2 },
      { label: "Bookmarks", href: "/resources?tab=bookmarks", icon: Bookmark },
      { label: "Favorites", href: "/resources?tab=favorites", icon: Heart },
      { label: "Upload Resource", href: "/resources", icon: Plus },
    ],
  },
  "/notes": {
    label: "Notes",
    accent: "notes",
    items: [
      { label: "All Notes", href: "/notes", icon: StickyNote },
      { label: "Recent", href: "/notes?tab=recent", icon: Clock },
      { label: "Favorites", href: "/notes?tab=favorites", icon: Star },
      { label: "Tags", href: "/notes?tab=tags", icon: Hash },
      { label: "Trash", href: "/notes?tab=trash", icon: Archive },
    ],
  },
  "/projects": {
    label: "Projects",
    accent: "projects",
    items: [
      { label: "All Projects", href: "/projects", icon: FolderKanban },
      { label: "Active", href: "/projects?tab=active", icon: Play },
      { label: "Archived", href: "/projects?tab=archived", icon: Archive },
    ],
  },
  "/prompts": {
    label: "Prompts",
    accent: "prompts",
    items: [
      { label: "My Prompts", href: "/prompts", icon: MessageSquare },
      { label: "Saved", href: "/prompts?tab=saved", icon: Bookmark },
      { label: "Categories", href: "/prompts?tab=categories", icon: Hash },
    ],
  },
  "/radar": {
    label: "Daily Updates",
    accent: "radar",
    items: [
      { label: "Tech News", href: "/radar?tab=tech-news", icon: Radio },
      { label: "Daily DSA", href: "/radar?tab=daily-dsa", icon: Code },
      { label: "Coding Challenges", href: "/radar?tab=coding-challenges", icon: Code },
      { label: "Interview Questions", href: "/radar?tab=interview-questions", icon: HelpCircle },
    ],
  },
};

function getActiveConfig(pathname: string): SidebarConfig | null {
  for (const [prefix, config] of Object.entries(sidebarConfigs)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return config;
  }
  return null;
}

function isItemActive(href: string, pathname: string) {
  const itemPath = href.split("?")[0];
  return itemPath === pathname;
}

export function SectionSidebar() {
  const pathname = usePathname();
  const config = getActiveConfig(pathname);

  return (
    <AnimatePresence mode="wait">
      {config && (
        <motion.aside
          key={config.accent}
          initial={{ x: -240, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -240, opacity: 0 }}
          transition={{ duration: 0.25, ease: ease.decelerate }}
          className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-white/5 bg-background/95 backdrop-blur-xl h-full"
        >
          <div className="flex-1 flex flex-col gap-0.5 p-3 pt-5 overflow-y-auto">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 pb-2 text-muted-foreground/50">
              {config.label}
            </span>
            {config.items.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-accent={config.accent}
                  className={`sidebar-link sidebar-item transition-all duration-250 ${
                    active
                      ? "sidebar-item-active shadow-[0_0_16px_-6px_var(--sidebar-item-accent,#6366f1)]"
                      : "text-sidebar-foreground hover:bg-white/[0.04] hover:text-sidebar-accent-foreground hover:-translate-y-[1px] hover:shadow-[0_0_12px_-8px_var(--sidebar-item-accent,#6366f1)]"
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full shadow-[0_0_6px_1px_var(--sidebar-item-accent,#6366f1)] sidebar-indicator" />
                  )}
                  <Icon className={`h-4 w-4 transition-all duration-250 ${active ? "drop-shadow-[0_0_4px_var(--sidebar-item-accent,#6366f1)]" : ""}`} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
