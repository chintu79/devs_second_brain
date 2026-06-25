"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

interface AnalyticsData {
  totals: { resources: number; prompts: number; notes: number; projects: number; total: number };
  activity: { date: string; count: number }[];
  tagUsage: { name: string; count: number }[];
  streak: number;
  todayCounts: { resources: number; prompts: number; notes: number; projects: number };
  weekCounts: { resources: number; prompts: number; notes: number; projects: number };
}

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "13px",
  },
  itemStyle: { color: "hsl(var(--foreground))" },
  labelStyle: { color: "hsl(var(--muted-foreground))" },
};

export function DashboardInsights({ data }: { data: AnalyticsData }) {
  const totalActions = data.activity.reduce((s, d) => s + d.count, 0);
  const thisWeek = data.weekCounts.resources + data.weekCounts.prompts + data.weekCounts.notes + data.weekCounts.projects;
  const dailyAvg = totalActions > 0 ? (totalActions / 30).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-section-foreground uppercase tracking-[0.1em]">
        Activity
      </h2>

      {/* 30-day sparkline */}
      <div className="rounded-xl border border-border/20 bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            30-Day Activity
          </div>
          <div className="text-xs text-muted-foreground">
            {dailyAvg}/day avg
          </div>
        </div>
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.activity}>
              <defs>
                <linearGradient id="insightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent, #6366f1)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="var(--accent, #6366f1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip {...tooltipStyle} labelFormatter={(v) => String(v).slice(5)} />
              <Area type="monotone" dataKey="count" stroke="var(--accent, #6366f1)" strokeWidth={2} fill="url(#insightGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>{data.streak > 0 ? `${data.streak}-day streak` : "No active streak"}</span>
          <span>{thisWeek} added this week</span>
        </div>
      </div>

      {/* Top tags */}
      {data.tagUsage.length > 0 && (
        <div className="rounded-xl border border-border/20 bg-card p-5">
          <h3 className="text-sm text-muted-foreground mb-3">Most Used Tags</h3>
          <div className="flex flex-wrap gap-2">
            {data.tagUsage.slice(0, 15).map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs bg-muted text-muted-foreground"
              >
                #{t.name}
                <span className="text-[11px] text-muted-foreground/50">{t.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
