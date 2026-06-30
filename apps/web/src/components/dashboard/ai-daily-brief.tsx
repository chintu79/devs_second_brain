"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

interface StaleProject { id: string; title: string; updatedAt: Date; }
interface StaleNote { id: string; title: string; updatedAt: Date; }

interface AIDailyBriefProps {
  todayResources: number; todayPrompts: number; todayNotes: number; todayProjects: number;
  staleProjects: StaleProject[]; staleNotes: StaleNote[];
}

const sectionColors: Record<string, string> = {
  resources: "#14B8A6",
  prompts: "#F59E0B",
  notes: "#22C55E",
  projects: "#8B5CF6",
};

export function AIDailyBrief({ todayResources, todayPrompts, todayNotes, todayProjects, staleProjects, staleNotes }: AIDailyBriefProps) {
  const totalToday = todayResources + todayPrompts + todayNotes + todayProjects;
  const hasContent = totalToday > 0 || staleProjects.length > 0 || staleNotes.length > 0;

  if (!hasContent) return null;

  const todayParts: { label: string; count: number; color: string }[] = [];
  if (todayResources > 0) todayParts.push({ label: "resource" + (todayResources > 1 ? "s" : ""), count: todayResources, color: sectionColors.resources });
  if (todayPrompts > 0) todayParts.push({ label: "prompt" + (todayPrompts > 1 ? "s" : ""), count: todayPrompts, color: sectionColors.prompts });
  if (todayNotes > 0) todayParts.push({ label: "note" + (todayNotes > 1 ? "s" : ""), count: todayNotes, color: sectionColors.notes });
  if (todayProjects > 0) todayParts.push({ label: "project" + (todayProjects > 1 ? "s" : ""), count: todayProjects, color: sectionColors.projects });

  return (
    <div className="rounded-xl border border-border/20 bg-card p-4 border-l-2" style={{ borderLeftColor: 'var(--accent)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4" style={{ color: sectionColors.prompts }} />
        <h2 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.12em]">Today&apos;s Brief</h2>
      </div>
      <div className="space-y-2">
        {todayParts.length > 0 && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Added</span>
            {todayParts.map((p, i) => (
              <span key={p.label} className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span style={{ color: p.color }} className="font-medium">{p.count}</span>
                <span>{p.label}</span>
              </span>
            ))}
          </div>
        )}
        {staleProjects.slice(0, 2).map((p) => {
          const days = Math.floor((Date.now() - p.updatedAt.getTime()) / 86400000);
          return (
            <div key={p.id} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionColors.projects }} />
              <span>Project <span className="text-foreground/80 font-medium">&ldquo;{p.title}&rdquo;</span> stale for {days}d</span>
            </div>
          );
        })}
        {staleNotes.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionColors.notes }} />
            <span>{staleNotes.length} note{staleNotes.length > 1 ? "s" : ""} not reviewed in 30+ days</span>
          </div>
        )}
      </div>
      {staleProjects.length > 2 && (
        <Link href="/projects" className="text-xs font-medium hover:underline mt-3 inline-block" style={{ color: 'var(--accent)' }}>
          View {staleProjects.length - 2} more stale project{staleProjects.length - 2 > 1 ? "s" : ""} &rarr;
        </Link>
      )}
    </div>
  );
}
