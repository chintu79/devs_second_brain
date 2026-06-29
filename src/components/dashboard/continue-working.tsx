"use client";

import { Bookmark, MessageSquare, StickyNote, FolderKanban, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContinueItem {
  id: string; title: string; type: "resource" | "prompt" | "note" | "project"; updatedAt: Date;
}

interface ContinueWorkingProps { items: ContinueItem[]; }

const typeCfg: Record<string, { icon: typeof Bookmark; color: string; href: string }> = {
  resource: { icon: Bookmark, color: "#14B8A6", href: "/resources" },
  prompt: { icon: MessageSquare, color: "#F59E0B", href: "/prompts" },
  note: { icon: StickyNote, color: "#22C55E", href: "/notes" },
  project: { icon: FolderKanban, color: "#8B5CF6", href: "/projects" },
};

function relative(t: Date): string {
  const diff = Date.now() - t.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function ContinueWorking({ items }: ContinueWorkingProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-3">
        Continue Working
      </h2>
      <div className="rounded-xl border border-border/20 bg-card divide-y divide-border/20 overflow-hidden">
        {items.map((item) => {
          const cfg = typeCfg[item.type];
          const Icon = cfg.icon;
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={`${cfg.href}?id=${item.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-muted/30 group border-l-2"
              style={{ borderLeftColor: cfg.color }}
            >
              <div
                className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
                style={{ backgroundColor: `${cfg.color}18` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
              </div>
              <span className="text-sm text-foreground/90 truncate flex-1">{item.title}</span>
              <span className="text-[11px] text-muted-foreground shrink-0">{relative(item.updatedAt)}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
