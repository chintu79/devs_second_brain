"use client";

import { Bookmark, StickyNote, FolderKanban, Clock, Activity } from "lucide-react";
import Link from "next/link";

interface RecentActivityProps {
  resources: Array<{ id: string; title: string; createdAt: Date }>;
  notes: Array<{ id: string; title: string; createdAt: Date }>;
  projects: Array<{ id: string; title: string; status: string; createdAt: Date }>;
}

const typeAccents: Record<string, string> = {
  resource: "text-amber-400",
  note: "text-emerald-400",
  project: "text-purple-400",
};

export function RecentActivity({ resources, notes, projects }: RecentActivityProps) {
  const items: Array<{ icon: React.ElementType; label: string; href: string; time: string; type: string }> = [];

  resources.slice(0, 3).forEach((r) => {
    items.push({ icon: Bookmark, label: `Saved "${r.title}"`, href: "/resources", time: formatRelative(r.createdAt), type: "resource" });
  });
  notes.slice(0, 3).forEach((n) => {
    items.push({ icon: StickyNote, label: `Wrote "${n.title}"`, href: "/notes", time: formatRelative(n.createdAt), type: "note" });
  });
  projects.slice(0, 2).forEach((p) => {
    items.push({ icon: FolderKanban, label: `Updated "${p.title}"`, href: `/projects/${p.id}`, time: formatRelative(p.createdAt), type: "project" });
  });

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Recent Activity</h2>
          <span className="text-[11px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{items.length}</span>
        </div>
        <Link href="/search" className="text-xs font-medium text-muted-foreground hover:text-foreground hover:scale-[1.02] transition-all duration-150">
          View all
        </Link>
      </div>

      <div className="rounded-lg border border-border/60 bg-card divide-y divide-border/40 overflow-hidden">
        {items.slice(0, 5).map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-muted/30 hover:scale-[1.01]"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded shrink-0 bg-muted">
                <Icon className={`h-3.5 w-3.5 ${typeAccents[item.type] || "text-muted-foreground"}`} />
              </div>
              <span className="flex-1 text-sm text-foreground/90 truncate">{item.label}</span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                {item.time}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
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
