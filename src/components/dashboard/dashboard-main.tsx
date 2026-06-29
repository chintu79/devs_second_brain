"use client";

import { motion } from "framer-motion";
import { Bookmark, MessageSquare, StickyNote, FolderKanban, Sparkles, ArrowRight, Hash, Clock } from "lucide-react";
import Link from "next/link";
import { fadeInUp, stagger } from "@/lib/motion";

/* ─── Types ─── */

interface ContinueItem {
  id: string; title: string; type: "resource" | "prompt" | "note" | "project"; updatedAt: Date;
}
interface TimelineItem {
  id: string; type: "resource" | "prompt" | "note" | "project"; title: string; href: string; createdAt: Date;
}
interface StaleProject { id: string; title: string; updatedAt: Date; }
interface StaleNote { id: string; title: string; updatedAt: Date; }

interface DashboardMainProps {
  continueItems: ContinueItem[];
  todayCounts: { resources: number; prompts: number; notes: number; projects: number };
  staleProjects: StaleProject[];
  staleNotes: StaleNote[];
  recentItems: TimelineItem[];
  plan: string | null;
  analytics?: { totalResources: number; totalNotes: number; totalPrompts: number; totalProjects: number; streak: number } | null;
}

/* ─── Config ─── */

const typeCfg: Record<string, { icon: typeof Bookmark; color: string; href: string }> = {
  resource: { icon: Bookmark, color: "#14B8A6", href: "/resources" },
  prompt: { icon: MessageSquare, color: "#F59E0B", href: "/prompts" },
  note: { icon: StickyNote, color: "#22C55E", href: "/notes" },
  project: { icon: FolderKanban, color: "#8B5CF6", href: "/projects" },
};

function sectionHeading(children: string) {
  return <h2 className="text-xs font-semibold uppercase tracking-[0.12em] mb-3 text-section-foreground">{children}</h2>;
}

/* ─── Sections ─── */

function ContinueWorkingSection({ items }: { items: ContinueItem[] }) {
  if (items.length === 0) return null;
  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Continue Working")}
      <div className="rounded-xl border border-border/15 bg-card divide-y divide-border/10 overflow-hidden">
        {items.map((item) => {
          const cfg = typeCfg[item.type];
          const Icon = cfg.icon;
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={`${cfg.href}?id=${item.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition-all duration-150 hover:bg-muted/20 group border-l-[3px]"
              style={{ borderLeftColor: cfg.color }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: `${cfg.color}12` }}>
                <Icon className="h-4 w-4" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground/90 truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground/60 mt-px">{formatRelative(item.updatedAt)}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-muted-foreground/70 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 duration-200 shrink-0" />
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function TodaysFocusSection({ plan }: { plan: string | null }) {
  if (!plan) return null;
  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Today's Focus")}
      <div className="rounded-xl border border-border/15 bg-card px-4 py-3.5 border-l-[3px]" style={{ borderLeftColor: "var(--accent)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
            <Hash className="h-4 w-4" style={{ color: "var(--accent)" }} />
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">{plan}</p>
        </div>
        <Link href="/log" className="inline-flex items-center gap-1 text-xs font-medium mt-2.5 ml-11 transition-all hover:opacity-70" style={{ color: "var(--accent)" }}>
          View full plan <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}

function AIDailyBriefSection({ todayCounts, staleProjects, staleNotes }: {
  todayCounts: { resources: number; prompts: number; notes: number; projects: number };
  staleProjects: StaleProject[]; staleNotes: StaleNote[];
}) {
  const totalToday = todayCounts.resources + todayCounts.prompts + todayCounts.notes + todayCounts.projects;
  const hasContent = totalToday > 0 || staleProjects.length > 0 || staleNotes.length > 0;
  if (!hasContent) return null;

  const counts: { label: string; count: number; color: string }[] = [];
  if (todayCounts.resources > 0) counts.push({ label: "Resources", count: todayCounts.resources, color: "#14B8A6" });
  if (todayCounts.prompts > 0) counts.push({ label: "Prompts", count: todayCounts.prompts, color: "#F59E0B" });
  if (todayCounts.notes > 0) counts.push({ label: "Notes", count: todayCounts.notes, color: "#22C55E" });
  if (todayCounts.projects > 0) counts.push({ label: "Projects", count: todayCounts.projects, color: "#8B5CF6" });

  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Daily Brief")}
      <div className="rounded-xl border border-border/15 bg-card p-4 space-y-3 border-l-[3px]" style={{ borderLeftColor: "var(--accent)" }}>
        {counts.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="text-xs font-medium text-foreground/70">Saved today</span>
            {counts.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-medium text-sm" style={{ color: c.color }}>{c.count}</span>
                <span className="text-muted-foreground/60">{c.label}</span>
              </span>
            ))}
          </div>
        )}

        {staleProjects.slice(0, 1).map((p) => {
          const days = Math.floor((Date.now() - p.updatedAt.getTime()) / 86400000);
          return (
            <div key={p.id} className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/10 pt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              <span>&ldquo;{p.title}&rdquo; hasn&apos;t been updated in {days} days</span>
            </div>
          );
        })}

        {staleNotes.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-border/10 pt-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
            <span>{staleNotes.length} note{staleNotes.length > 1 ? "s" : ""} not reviewed in 30+ days</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RecentActivitySection({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) return null;
  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Recent Activity")}
      <div className="rounded-xl border border-border/15 bg-card divide-y divide-border/10 overflow-hidden">
        {items.map((item) => {
          const cfg = typeCfg[item.type];
          const Icon = cfg.icon;
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-muted/20"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md shrink-0" style={{ backgroundColor: `${cfg.color}10` }}>
                <Icon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
              </div>
              <span className="text-sm text-foreground/85 truncate flex-1">{item.title}</span>
              <span className="text-[11px] text-muted-foreground/60 shrink-0">{formatRelative(item.createdAt)}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function KnowledgeInsightsSection({ staleNotes, analytics }: {
  staleNotes: StaleNote[]; analytics?: DashboardMainProps["analytics"];
}) {
  if (!analytics) return null;
  const dormantNoteCount = staleNotes.length;
  const totalItems = (analytics.totalResources ?? 0) + (analytics.totalNotes ?? 0) + (analytics.totalPrompts ?? 0) + (analytics.totalProjects ?? 0);
  if (totalItems === 0) return null;

  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Knowledge Insights")}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/notes" className="rounded-xl border border-border/15 bg-card p-3.5 transition-all duration-150 hover:bg-muted/20 group">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#22C55E]/10">
              <StickyNote className="h-3.5 w-3.5 text-[#22C55E]" />
            </div>
            <span className="text-xs font-medium text-foreground/80">Dormant Notes</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{dormantNoteCount}</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Not reviewed in 30+ days</p>
        </Link>
        <Link href="/knowledge" className="rounded-xl border border-border/15 bg-card p-3.5 transition-all duration-150 hover:bg-muted/20 group">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 12%, transparent)" }}>
              <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
            </div>
            <span className="text-xs font-medium text-foreground/80">Knowledge Base</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{totalItems}</p>
          <p className="text-[11px] text-muted-foreground/60 mt-0.5">Items across all vaults</p>
        </Link>
      </div>
    </motion.div>
  );
}

function WeeklyProgressSection({ analytics }: { analytics?: DashboardMainProps["analytics"] }) {
  if (!analytics) return null;
  return (
    <motion.div variants={fadeInUp}>
      {sectionHeading("Weekly Progress")}
      <div className="rounded-xl border border-border/15 bg-card p-4 text-center">
        <div className="flex items-center justify-center gap-6">
          <div>
            <p className="text-2xl font-semibold text-foreground">{analytics.streak}</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">day streak</p>
          </div>
          <div className="w-px h-10 bg-border/20" />
          <Link href="/resources" className="text-left group">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{analytics.totalResources}</p>
            <p className="text-xs text-muted-foreground/60">resources</p>
          </Link>
          <div className="w-px h-10 bg-border/20" />
          <Link href="/notes" className="text-left group">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{analytics.totalNotes}</p>
            <p className="text-xs text-muted-foreground/60">notes</p>
          </Link>
          <div className="w-px h-10 bg-border/20" />
          <Link href="/prompts" className="text-left group">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{analytics.totalPrompts}</p>
            <p className="text-xs text-muted-foreground/60">prompts</p>
          </Link>
          <div className="w-px h-10 bg-border/20" />
          <Link href="/projects" className="text-left group">
            <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{analytics.totalProjects}</p>
            <p className="text-xs text-muted-foreground/60">projects</p>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */

export function DashboardMain({
  continueItems, todayCounts, staleProjects, staleNotes, recentItems, plan, analytics,
}: DashboardMainProps) {
  const sections = [
    { id: "continue", component: <ContinueWorkingSection items={continueItems} /> },
    { id: "focus", component: <TodaysFocusSection plan={plan} /> },
    { id: "brief", component: <AIDailyBriefSection todayCounts={todayCounts} staleProjects={staleProjects} staleNotes={staleNotes} /> },
    { id: "recent", component: <RecentActivitySection items={recentItems} /> },
    { id: "insights", component: <KnowledgeInsightsSection staleNotes={staleNotes} analytics={analytics} /> },
    { id: "progress", component: <WeeklyProgressSection analytics={analytics} /> },
  ].filter((s) => s.component !== null);

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {sections.map((s) => <div key={s.id}>{s.component}</div>)}
    </motion.div>
  );
}

/* ─── Helper ─── */

function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(d);
}
