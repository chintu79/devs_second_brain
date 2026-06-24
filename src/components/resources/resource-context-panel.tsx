import { StickyNote, FolderKanban, Bookmark, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ContextPanelProps {
  topResources: Array<{ id: string; title: string }>;
  recentNotes: Array<{ id: string; title: string }>;
  projects: Array<{ id: string; title: string }>;
}

export function ResourceContextPanel({ topResources, recentNotes, projects }: ContextPanelProps) {
  return (
    <aside className="hidden xl:flex w-[280px] shrink-0 flex-col border-l border-border/50 bg-background overflow-y-auto">
      <div className="p-5 space-y-8">
        {/* Related Resources */}
        {topResources.length > 1 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Recent Resources</h3>
              <Link href="/resources" className="text-[10px] font-medium text-section-foreground hover:text-foreground transition-colors">
                View all
              </Link>
            </div>
            <div className="space-y-1">
              {topResources.slice(1, 5).map((r) => (
                <Link
                  key={r.id}
                  href={`/resources/${r.id}`}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                >
                  <Bookmark className="h-3.5 w-3.5 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{r.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Notes */}
        {recentNotes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Notes</h3>
              <Link href="/notes" className="text-[10px] font-medium text-section-foreground hover:text-foreground transition-colors">
                All notes
              </Link>
            </div>
            <div className="space-y-1">
              {recentNotes.slice(0, 4).map((n) => (
                <Link
                  key={n.id}
                  href="/notes"
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                >
                  <StickyNote className="h-3.5 w-3.5 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{n.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-semibold text-section-foreground uppercase tracking-[0.12em]">Projects</h3>
              <Link href="/projects" className="text-[10px] font-medium text-section-foreground hover:text-foreground transition-colors">
                All projects
              </Link>
            </div>
            <div className="space-y-1">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-foreground/80 hover:text-foreground hover:bg-muted/40 hover:scale-[1.02] transition-all duration-150"
                >
                  <FolderKanban className="h-3.5 w-3.5 shrink-0 text-secondary-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
