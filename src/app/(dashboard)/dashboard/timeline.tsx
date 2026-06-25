"use client";

import { Bookmark, MessageSquare, StickyNote, FolderKanban, Clock } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
  id: string;
  type: "resource" | "prompt" | "note" | "project";
  title: string;
  href: string;
  createdAt: Date;
}

interface DashboardTimelineProps {
  items: TimelineItem[];
}

const typeConfig = {
  resource: { icon: Bookmark, color: "#14b8a6", label: "Resource" },
  prompt: { icon: MessageSquare, color: "#f59e0b", label: "Prompt" },
  note: { icon: StickyNote, color: "#22c55e", label: "Note" },
  project: { icon: FolderKanban, color: "#8b5cf6", label: "Project" },
};

export function DashboardTimeline({ items }: DashboardTimelineProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-3">
        Recently Added
      </h2>
      <div className="rounded-xl border border-border/20 bg-card divide-y divide-border/20 overflow-hidden">
        {items.map((item) => {
          const config = typeConfig[item.type];
          const Icon = config.icon;
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-muted/30 hover:scale-[1.005]"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md shrink-0"
                style={{ backgroundColor: `${config.color}12` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
              </div>
              <span className="text-sm text-foreground/90 truncate flex-1">{item.title}</span>
              <span className="text-[11px] text-muted-foreground">{formatRelative(item.createdAt)}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function formatRelative(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
