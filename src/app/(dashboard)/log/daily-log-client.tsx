"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, BookOpen, FileText, Lightbulb, FolderKanban, ArrowUpRight, CalendarDays, Lock, Unlock, Clock, Target } from "lucide-react";
import { InlineEditor } from "@/components/shared/inline-editor";
import { upsertDailyEntry, getDailyEntries } from "@/actions/daily";
import { toast } from "sonner";
import Link from "next/link";

const DAYS_SHORT = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function timeLabel(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

type EntryMap = Record<string, string>;

interface ActivityItem { id: string; title: string; createdAt: Date; }

interface DailyLogClientProps {
  initialEntries: { date: Date; content: string }[];
  todayActivity: { resources: ActivityItem[]; prompts: ActivityItem[]; notes: ActivityItem[]; projects: ActivityItem[]; };
}

const DEFAULT_TEMPLATE = "# Today\n\nHow's your mind today?\n\n---\n\n## What did I work on?\n\n\n## What did I learn?\n\n\n## Wins\n\n\n## Challenges\n\n\n## Ideas\n\n\n## Tomorrow\n\n\n## Random Thoughts\n";

const typeConfig: Record<string, { icon: typeof BookOpen; color: string; href: string }> = {
  resource: { icon: BookOpen, color: "#14B8A6", href: "/resources" },
  note: { icon: FileText, color: "#22C55E", href: "/notes" },
  prompt: { icon: Lightbulb, color: "#F59E0B", href: "/prompts" },
  project: { icon: FolderKanban, color: "#8B5CF6", href: "/projects" },
};

export function DailyLogClient({ initialEntries, todayActivity }: DailyLogClientProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [entries, setEntries] = useState<EntryMap>(() => {
    const m: EntryMap = {};
    for (const e of initialEntries) m[dateKey(new Date(e.date))] = e.content;
    return m;
  });
  const [selectedDate, setSelectedDate] = useState<string>(dateKey(now));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locked, setLocked] = useState(true);

  const todayKey = dateKey(now);
  const isToday = selectedDate === todayKey;
  const hasEntry = !!entries[selectedDate];

  const [content, setContent] = useState(() => {
    const existing = entries[selectedDate];
    if (existing) return existing;
    if (isToday) return DEFAULT_TEMPLATE;
    return "";
  });

  useEffect(() => {
    setLocked(!isToday);
  }, [isToday]);

  // Sync content when date changes
  useEffect(() => {
    const existing = entries[selectedDate];
    if (existing) setContent(existing);
    else if (isToday) setContent(DEFAULT_TEMPLATE);
    else setContent("");
  }, [selectedDate, entries, isToday]);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;

  const loadMonth = useCallback(async (y: number, m: number) => {
    setLoading(true);
    const data = await getDailyEntries(y, m);
    const map: EntryMap = {};
    for (const e of data) map[dateKey(new Date(e.date))] = e.content;
    setEntries(map);
    setLoading(false);
  }, []);

  function handlePrev() {
    const m = month - 1;
    if (m < 1) { setYear(year - 1); setMonth(12); loadMonth(year - 1, 12); }
    else { setMonth(m); loadMonth(year, m); }
  }

  function handleNext() {
    const m = month + 1;
    if (m > 12) { setYear(year + 1); setMonth(1); loadMonth(year + 1, 1); }
    else { setMonth(m); loadMonth(year, m); }
  }

  function goToday() {
    const n = new Date();
    if (n.getFullYear() !== year || n.getMonth() + 1 !== month) {
      setYear(n.getFullYear()); setMonth(n.getMonth() + 1); loadMonth(n.getFullYear(), n.getMonth() + 1);
    }
    selectDate(dateKey(n));
  }

  function selectDate(key: string) {
    setSelectedDate(key);
  }

  async function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) { toast.error("Write something first"); return; }
    setSaving(true);
    const result = await upsertDailyEntry(selectedDate, content);
    if (result.error) toast.error(result.error);
    else {
      setEntries((prev) => ({ ...prev, [selectedDate]: content }));
      setLocked(true);
      toast.success("Saved");
    }
    setSaving(false);
  }

  // Calendar grid
  const emptyCells = [];
  for (let i = 0; i < firstDayIndex; i++) emptyCells.push(<div key={`e-${i}`} />);
  const dayButtons = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(new Date(year, month - 1, d));
    const hasDateEntry = !!entries[key];
    const isTodayDay = key === todayKey;
    const isSel = key === selectedDate;
    dayButtons.push(
      <button key={key} onClick={() => selectDate(key)}
        className={`relative flex items-center justify-center rounded-md text-xs h-7 w-full transition-all duration-150 ${
          isSel ? "bg-accent/15 text-accent font-semibold" : isTodayDay ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        <span>{d}</span>
        {hasDateEntry && <span className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${isSel ? "bg-accent" : "bg-accent/50"}`} />}
      </button>
    );
  }

  // Today's activity feed
  const activityEntries = useMemo(() => {
    if (!isToday) return [];
    return [
      ...todayActivity.resources.map((r) => ({ id: r.id, title: r.title, type: "resource" as const, createdAt: r.createdAt })),
      ...todayActivity.notes.map((n) => ({ id: n.id, title: n.title, type: "note" as const, createdAt: n.createdAt })),
      ...todayActivity.prompts.map((p) => ({ id: p.id, title: p.title, type: "prompt" as const, createdAt: p.createdAt })),
      ...todayActivity.projects.map((p) => ({ id: p.id, title: p.title, type: "project" as const, createdAt: p.createdAt })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [isToday, todayActivity]);

  const hasActivity = activityEntries.length > 0;

  // Insights
  const insights = useMemo(() => {
    if (!content.trim()) return [];
    const items: string[] = [];
    const chars = content.length;
    if (chars > 50) items.push(`${content.split(/\s+/).filter(Boolean).length} words written`);
    const tasks = content.match(/- \[ \]/g);
    if (tasks) items.push(`${tasks.length} open task${tasks.length > 1 ? "s" : ""}`);
    const headings = content.match(/^##\s+(.+)/gm);
    if (headings) items.push(`${headings.length} section${headings.length > 1 ? "s" : ""}`);
    return items;
  }, [content]);

  // Past entries activity summary (for sidebar)
  const allActivityItems = [
    { type: "resource" as const, config: typeConfig.resource, count: todayActivity.resources.length },
    { type: "note" as const, config: typeConfig.note, count: todayActivity.notes.length },
    { type: "prompt" as const, config: typeConfig.prompt, count: todayActivity.prompts.length },
    { type: "project" as const, config: typeConfig.project, count: todayActivity.projects.length },
  ].filter((g) => g.count > 0);

  return (
    <div className="flex h-full" data-accent="notes">
      {/* Calendar sidebar */}
      <div className="h-full w-60 shrink-0 border-r border-border/50 bg-sidebar flex flex-col overflow-y-auto">
        <div className="px-4 pt-4 pb-2 border-b border-border/30">
          <span className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em]">Daily Log</span>
        </div>

        <div className="px-3 pt-3">
          <div className="flex items-center justify-between mb-3">
            <button onClick={handlePrev} aria-label="Previous month" className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="text-xs font-semibold text-foreground">{MONTHS[month - 1]} {year}</span>
            <button onClick={handleNext} aria-label="Next month" className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8"><div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" /></div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-0 mb-1">
                {DAYS_SHORT.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground uppercase tracking-wider py-0.5">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-0">
                {emptyCells}
                {dayButtons}
              </div>
            </>
          )}

          {isToday && allActivityItems.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/30">
              <div className="flex items-center gap-1.5 mb-2">
                <CalendarDays className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Today</span>
              </div>
              <div className="space-y-1">
                {allActivityItems.map((g) => {
                  const Icon = g.config.icon;
                  return (
                    <Link key={g.type} href={g.config.href} className="flex items-center gap-1.5 px-1.5 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all group">
                      <Icon className="h-3 w-3 shrink-0" style={{ color: g.config.color }} />
                      <span className="flex-1 truncate">{g.count} {g.type}{g.count > 1 ? "s" : ""}</span>
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-6 pt-5 pb-2 flex items-center justify-between border-b border-border/30 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">
              {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </h1>
            {isToday && <span className="text-[10px] font-medium text-[#22C55E] bg-[#22C55E]/10 px-1.5 py-0.5 rounded-full">Today</span>}
          </div>
          <div className="flex items-center gap-2">
            {!isToday && (
              <button onClick={goToday} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Jump to today</button>
            )}
            <button onClick={() => setLocked(!locked)} aria-label={locked ? "Unlock" : "Lock"} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || locked}
              className="px-4 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Editor */}
          {!content && !hasEntry && !isToday ? (
            <div className="flex items-center justify-center py-20 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">No entry for this day</p>
                <p className="text-xs text-muted-foreground/60">Past days are read-only. Jump to today to write.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl">
              {!locked && isToday && !hasEntry && (
                <p className="text-xs text-muted-foreground mb-3">Capture today's thoughts before they fade.</p>
              )}
              <InlineEditor content={content} onChange={setContent} editable={!locked} placeholder="Start writing..." />
            </div>
          )}

          {/* Activity Timeline (today only) */}
          {isToday && hasActivity && (
            <div className="max-w-3xl">
              <h2 className="text-[11px] font-semibold text-section-foreground uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Today's Timeline
              </h2>
              <div className="relative pl-6 border-l-2 border-border/40 space-y-3">
                {activityEntries.map((item) => {
                  const cfg = typeConfig[item.type];
                  const Icon = cfg.icon;
                  return (
                    <Link key={`${item.type}-${item.id}`} href={`${cfg.href}?id=${item.id}`}
                      className="relative flex items-center gap-3 text-sm group"
                    >
                      <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: cfg.color, backgroundColor: "var(--color-card, #1a1b1e)" }} />
                      <span className="text-[10px] text-muted-foreground w-10 shrink-0">{timeLabel(item.createdAt)}</span>
                      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: cfg.color }} />
                      <span className="flex-1 truncate text-foreground/80 group-hover:text-foreground transition-colors">{item.title}</span>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Connected Knowledge (today only) */}
          {isToday && hasActivity && (
            <div className="max-w-3xl">
              <h2 className="text-[11px] font-semibold text-section-foreground uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Connected Knowledge
              </h2>
              <div className="flex flex-wrap gap-2">
                {allActivityItems.map((g) => {
                  const Icon = g.config.icon;
                  return (
                    <Link key={g.type} href={g.config.href}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/30 bg-card text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: g.config.color }} />
                      <span>{g.count} {g.type}{g.count > 1 ? "s" : ""}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Insights */}
          {isToday && insights.length > 0 && (
            <details className="max-w-3xl group">
              <summary className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Insights
              </summary>
              <div className="mt-2 rounded-xl border border-[#F59E0B]/20 bg-[#F59E0B]/5 p-4">
                <ul className="space-y-1">
                  {insights.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-[#F59E0B] mt-0.5 select-none">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          )}

          {/* Metadata */}
          {hasEntry && (
            <details className="max-w-3xl group">
              <summary className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                Entry Details
              </summary>
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <p>{content.split(/\s+/).filter(Boolean).length} words · {content.match(/^##\s+(.+)/gm)?.length || 0} sections</p>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
