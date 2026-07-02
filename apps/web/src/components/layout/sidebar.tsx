"use client";

import { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Link2,
  MessageSquare,
  StickyNote,
  FolderKanban,
  Tags,
  Radio,
  Search,
  Bot,
  GitGraph,
  Settings,
  LogOut,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/actions/auth";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: string;
}

export const sidebarLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, accent: "dashboard" },
  { href: "/resources", label: "Resources", icon: Link2, accent: "resources" },
  { href: "/prompts", label: "Prompts", icon: MessageSquare, accent: "prompts" },
  { href: "/notes", label: "Notes", icon: StickyNote, accent: "notes" },
  { href: "/projects", label: "Projects", icon: FolderKanban, accent: "projects" },
  { href: "/knowledge", label: "Knowledge", icon: Tags, accent: "knowledge" },
  { href: "/log", label: "Daily Log", icon: Calendar, accent: "notes" },
  { href: "/radar", label: "Daily Updates", icon: Radio, accent: "radar" },
  { href: "/graph", label: "Graph", icon: GitGraph, accent: "graph" },
  { href: "/chat", label: "AI Chat", icon: Bot, accent: "chat" },
  { href: "/search", label: "Explore", icon: Search, accent: "search" },
];

export const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-white/5 bg-background/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-white/5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md shrink-0 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] shadow-sm shadow-[#6366F1]/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z" />
            <path d="M8 14v1a4 4 0 0 0 8 0v-1" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight text-sidebar-primary-foreground">Dev Second Brain</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-0.5 p-3 pt-5 overflow-y-auto">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 pb-2 text-muted-foreground/50">
          Navigation
        </span>
        {sidebarLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                data-accent={link.accent}
                className={`sidebar-link sidebar-item transition-all duration-250 ${
                  isActive
                    ? "sidebar-item-active shadow-[0_0_16px_-6px_var(--sidebar-item-accent,#6366f1)]"
                    : "text-sidebar-foreground hover:bg-white/[0.04] hover:text-sidebar-accent-foreground hover:-translate-y-[1px] hover:shadow-[0_0_12px_-8px_var(--sidebar-item-accent,#6366f1)]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full shadow-[0_0_6px_1px_var(--sidebar-item-accent,#6366f1)] sidebar-indicator" />
                )}
                <Icon className={`h-4 w-4 transition-all duration-250 ${isActive ? "drop-shadow-[0_0_4px_var(--sidebar-item-accent,#6366f1)]" : "group-hover:drop-shadow-[0_0_4px_var(--sidebar-item-accent,#6366f1)]"}`} />
                {link.label}
              </Link>
            );
          })}

        <div className="h-px bg-white/[0.06] mx-3 my-2" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 pb-2 text-muted-foreground/50">
          Workspace
        </span>
        {sidebarLinks.slice(4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                data-accent={link.accent}
                className={`sidebar-link sidebar-item transition-all duration-250 ${
                  isActive
                    ? "sidebar-item-active shadow-[0_0_16px_-6px_var(--sidebar-item-accent,#6366f1)]"
                    : "text-sidebar-foreground hover:bg-white/[0.04] hover:text-sidebar-accent-foreground hover:-translate-y-[1px] hover:shadow-[0_0_12px_-8px_var(--sidebar-item-accent,#6366f1)]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full shadow-[0_0_6px_1px_var(--sidebar-item-accent,#6366f1)] sidebar-indicator" />
                )}
                <Icon className={`h-4 w-4 transition-all duration-250 ${isActive ? "drop-shadow-[0_0_4px_var(--sidebar-item-accent,#6366f1)]" : ""}`} />
                {link.label}
              </Link>
            );
          })}
      </div>

      {/* Profile / Preferences */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="space-y-0.5">
          <Link
            href="/settings"
            data-accent="settings"
            className="sidebar-link sidebar-item text-sidebar-foreground hover:bg-white/[0.04] hover:text-sidebar-accent-foreground hover:-translate-y-[1px] transition-all duration-250"
          >
            <Settings className="h-4 w-4" />
            Preferences
          </Link>
          <ThemeToggle variant="sidebar" />
          <form action={logout}>
            <button type="submit" className="sidebar-item w-full text-sidebar-foreground hover:bg-white/[0.04] hover:text-sidebar-accent-foreground hover:-translate-y-[1px] transition-all duration-250">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
});
