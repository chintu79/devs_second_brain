"use client";

import { ArrowRight, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  nextAction: string;
  progress: number;
}

interface ContinueWorkingProps {
  projects: Project[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  Planning: { label: "Planning", color: "#f59e0b" },
  "In Progress": { label: "In Progress", color: "var(--accent, #6366f1)" },
  Review: { label: "Review", color: "#3b82f6" },
  Done: { label: "Done", color: "#22c55e" },
};

export function ContinueWorking({ projects }: ContinueWorkingProps) {
  if (projects.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: "var(--accent-bg)" }}>
            <TrendingUp className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
          </div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>Continue Working</h2>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-muted font-medium">{projects.length} active</span>
        </div>
        <Link href="/projects" className="text-sm font-medium hover:text-foreground hover:scale-[1.02] transition-all duration-150" style={{ color: "var(--accent)" }}>
          All projects
        </Link>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 3).map((project) => {
          const status = statusConfig[project.status] || statusConfig["In Progress"];
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group rounded-xl border border-border bg-card transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]">
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: status.color }} />
                        <h3 className="text-base font-semibold text-foreground group-hover transition-colors truncate">{project.name}</h3>
                        <span className="text-xs font-medium text-secondary-foreground shrink-0">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2.5 text-sm text-secondary-foreground">
                        <span>Next: <span className="text-foreground/80">{project.nextAction}</span></span>
                        <span className="text-muted-foreground">&middot;</span>
                        <span className="flex items-center gap-1.5 text-secondary-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {project.updatedAt}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
                  </div>
                  <div className="mt-4 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(project.progress, 100)}%`, backgroundColor: status.color }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
