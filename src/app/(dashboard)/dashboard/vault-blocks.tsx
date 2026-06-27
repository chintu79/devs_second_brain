"use client";

import { Bookmark, Sparkles, StickyNote, FolderKanban } from "lucide-react";
import Link from "next/link";

interface VaultItem {
  id: string;
  title: string;
  createdAt: Date;
  status?: string;
}

interface VaultBlockData {
  count: number;
  items: VaultItem[];
}

interface DashboardVaultBlocksProps {
  resources: VaultBlockData;
  prompts: VaultBlockData;
  notes: VaultBlockData;
  projects: VaultBlockData & { items: (VaultItem & { status?: string })[] };
}

const vaultConfig = [
  { key: "resources", label: "Resources", icon: Bookmark, href: "/resources", accent: "#14b8a6", bg: "rgba(20, 184, 166, 0.08)" },
  { key: "prompts", label: "Prompts", icon: Sparkles, href: "/prompts", accent: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)" },
  { key: "notes", label: "Notes", icon: StickyNote, href: "/notes", accent: "#22c55e", bg: "rgba(34, 197, 94, 0.08)" },
  { key: "projects", label: "Projects", icon: FolderKanban, href: "/projects", accent: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)" },
] as const;

const projectStatusColors: Record<string, string> = {
  idea: "#a1a1aa",
  research: "#06b6d4",
  planning: "#f59e0b",
  building: "#6366f1",
  completed: "#22c55e",
  archived: "#71717a",
};

export function DashboardVaultBlocks({ resources, prompts, notes, projects }: DashboardVaultBlocksProps) {
  const data: Record<string, VaultBlockData & { items: VaultItem[] }> = { resources, prompts, notes, projects };

  return (
    <div className="grid grid-cols-4 gap-4 z-20">
      {vaultConfig.map((config) => {
        const block = data[config.key];
        const Icon = config.icon;
        const lastItem = block.items[0];

        return (
          <Link key={config.key} href={config.href} className="group" style={{ '--accent-c': config.accent } as React.CSSProperties}>
            <div className="rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01] h-full flex flex-col accent-border-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg accent-bg-15">
                  <Icon className="h-4 w-4 accent-text" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{config.label}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-semibold accent-text">{block.count}</span>
                    <span className="text-xs text-muted-foreground">{block.count === 1 ? "item" : "items"}</span>
                  </div>
                </div>
              </div>

              {lastItem && (
                <div className="text-xs text-muted-foreground truncate">
                  Last: <span className="text-foreground/70">{lastItem.title}</span>
                </div>
              )}

              {/* Project status badges */}
              {config.key === "projects" && block.items.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {block.items.map((p) => {
                    const color = projectStatusColors[p.status || ""] || "#a1a1aa";
                    return (
                      <span
                        key={p.id}
                        className="text-[10px] px-1.5 py-0.5 rounded capitalize accent-badge"
                        style={{ '--accent-c': color } as React.CSSProperties}
                      >
                        {p.status}
                      </span>
                    );
                  })}
                </div>
              )}

              {block.count === 0 && (
                <p className="text-xs text-muted-foreground mt-auto">No items yet</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
