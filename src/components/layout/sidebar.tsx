"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import {
  LayoutDashboard,
  Link2,
  MessageSquare,
  StickyNote,
  FolderKanban,
  Radio,
  Search,
  Settings,
  LogOut,
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
  { href: "/radar", label: "OS Radar", icon: Radio, accent: "radar" },
  { href: "/search", label: "Search", icon: Search, accent: "search" },
];

const sectionAccents: Record<string, { navLabel: string; wsLabel: string }> = {
  dashboard: { navLabel: "Navigation", wsLabel: "Workspace" },
  resources: { navLabel: "Navigation", wsLabel: "Workspace" },
  prompts: { navLabel: "Navigation", wsLabel: "Workspace" },
  notes: { navLabel: "Navigation", wsLabel: "Workspace" },
  projects: { navLabel: "Navigation", wsLabel: "Workspace" },
  radar: { navLabel: "Navigation", wsLabel: "Workspace" },
  search: { navLabel: "Navigation", wsLabel: "Workspace" },
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-[240px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-sidebar-border">
        <div className="flex h-7 w-7 items-center justify-center rounded-md shrink-0" style={{ backgroundColor: "var(--accent, #6366f1)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3a6 6 0 0 0-6 6v1h12V9a6 6 0 0 0-6-6z" />
            <path d="M8 14v1a4 4 0 0 0 8 0v-1" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--sidebar-item-accent, #fafafa)" }}>Dev Second Brain</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col gap-0.5 p-3 pt-5 overflow-y-auto">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 pb-2" style={{ color: "color-mix(in srgb, var(--sidebar-item-accent, #a1a1aa) 60%, transparent)" }}>
          Navigation
        </span>
        <LayoutGroup id="nav-group">
          {sidebarLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                data-accent={link.accent}
                className={`sidebar-link sidebar-item ${isActive ? "sidebar-item-active" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full"
                    style={{ backgroundColor: "var(--sidebar-item-accent, #6366f1)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </LayoutGroup>

        <div className="divider-sidebar mx-3" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] px-3 pb-2" style={{ color: "color-mix(in srgb, var(--sidebar-item-accent, #a1a1aa) 60%, transparent)" }}>
          Workspace
        </span>
        <LayoutGroup id="workspace-group">
          {sidebarLinks.slice(4).map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                data-accent={link.accent}
                className={`sidebar-link sidebar-item ${isActive ? "sidebar-item-active" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="workspace-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full"
                    style={{ backgroundColor: "var(--sidebar-item-accent, #6366f1)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 28, mass: 0.9 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </LayoutGroup>
      </div>

      {/* Profile / Settings */}
      <div className="border-t border-sidebar-border/50 p-3">
        <div className="space-y-0.5">
          <Link
            href="/settings"
            data-accent="settings"
            className="sidebar-link sidebar-item text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <ThemeToggle variant="sidebar" />
          <form action={logout}>
            <button type="submit" className="sidebar-item w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
