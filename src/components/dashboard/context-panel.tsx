"use client";

import { Clock, StickyNote, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContextPanelProps {
  recentActivity: string[];
  recentNotes: Array<{ id: string; title: string }>;
}

export function ContextPanel({ recentActivity, recentNotes }: ContextPanelProps) {
  return (
    <aside className="hidden xl:flex w-[300px] shrink-0 flex-col border-l border-border/50 bg-background overflow-y-auto">
      <div className="p-6 space-y-10">
        {/* Activity */}
        {recentActivity.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em] mb-4">Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted shrink-0 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{activity}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{i === 0 ? "Just now" : `${i + 1}h ago`}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notes */}
        {recentNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em]">Notes</h3>
              <Link href="/notes" className="text-xs font-medium text-section-foreground hover:text-foreground transition-colors">
                All notes
              </Link>
            </div>
            <div className="space-y-1">
              {recentNotes.slice(0, 4).map((note) => (
                <Link
                  key={note.id}
                  href="/notes"
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/40 transition-all"
                >
                  <StickyNote className="h-4 w-4 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{note.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty hint */}
        {recentActivity.length === 0 && recentNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </aside>
  );
}
