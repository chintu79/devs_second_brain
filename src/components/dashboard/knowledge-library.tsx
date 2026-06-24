"use client";

import { Bookmark, Sparkles, StickyNote, FolderKanban } from "lucide-react";
import Link from "next/link";

interface VaultEntry {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
  count: number;
  lastAdded: string | null;
  status: string;
  accent: string;
}

interface KnowledgeLibraryProps {
  counts: Record<string, number>;
  lastAdded: Record<string, { title: string } | null>;
}

const vaultAccents: Record<string, { accent: string; bg: string }> = {
  resources: { accent: "#14b8a6", bg: "rgba(20, 184, 166, 0.08)" },
  prompts: { accent: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)" },
  notes: { accent: "#22c55e", bg: "rgba(34, 197, 94, 0.08)" },
  projects: { accent: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)" },
};

export function KnowledgeLibrary({ counts, lastAdded }: KnowledgeLibraryProps) {
  const vaults: VaultEntry[] = [
    { key: "resources", label: "Resources", icon: Bookmark, href: "/resources", count: counts.resources ?? 0, lastAdded: lastAdded.resources?.title ?? null, status: getStatus(counts.resources ?? 0), accent: "#14b8a6" },
    { key: "prompts", label: "Prompts", icon: Sparkles, href: "/prompts", count: counts.prompts ?? 0, lastAdded: lastAdded.prompts?.title ?? null, status: getStatus(counts.prompts ?? 0), accent: "#f59e0b" },
    { key: "notes", label: "Notes", icon: StickyNote, href: "/notes", count: counts.notes ?? 0, lastAdded: lastAdded.notes?.title ?? null, status: getStatus(counts.notes ?? 0), accent: "#22c55e" },
    { key: "projects", label: "Projects", icon: FolderKanban, href: "/projects", count: counts.projects ?? 0, lastAdded: lastAdded.projects?.title ?? null, status: getStatus(counts.projects ?? 0), accent: "#8b5cf6" },
  ];

  if (vaults.every((v) => v.count === 0)) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Knowledge Library</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {vaults.map((vault) => {
          const Icon = vault.icon;
          const va = vaultAccents[vault.key] || { accent: "#6366f1", bg: "rgba(99, 102, 241, 0.08)" };
          return (
            <Link key={vault.key} href={vault.href}>
              <div
                className="group rounded-lg border border-border/60 bg-card p-4 transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)]"
                style={{ borderLeftColor: va.accent, borderLeftWidth: 2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: va.bg }}
                  >
                    <Icon className="h-4 w-4" style={{ color: va.accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{vault.label}</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-semibold" style={{ color: va.accent }}>{vault.count}</span>
                  <span className="text-xs text-muted-foreground">{vault.count === 1 ? "item" : "items"}</span>
                </div>
                {vault.lastAdded && (
                  <div className="text-xs text-muted-foreground mt-1.5 truncate">
                    Last: <span className="text-foreground/70">{vault.lastAdded}</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getStatus(count: number): string {
  if (count === 0) return "Empty";
  if (count === 1) return "1 item";
  return `${count} items`;
}
