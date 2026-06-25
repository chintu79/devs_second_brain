"use client";

import { Bookmark, Clock, TrendingUp, Layers, Sparkles } from "lucide-react";
import type { Repository } from "@/lib/mock-data";

interface RadarContextPanelProps {
  savedRepos: Repository[];
  recentlyViewed: Repository[];
  bookmarkedRepos: Repository[];
  trendingRepos: Repository[];
}

export function RadarContextPanel({
  savedRepos, recentlyViewed, bookmarkedRepos, trendingRepos,
}: RadarContextPanelProps) {
  return (
    <div className="w-64 shrink-0 border-l border-border/30 bg-muted/20 overflow-y-auto px-4 py-5 space-y-6">
      {/* Recently Saved */}
      {savedRepos.length > 0 && (
        <ContextSection icon={Bookmark} label="Recently Saved">
          {savedRepos.slice(0, 4).map((r) => (
            <ContextItem key={r.id} label={r.name} subtitle={r.owner} />
          ))}
        </ContextSection>
      )}

      {/* Bookmarks */}
      {bookmarkedRepos.length > 0 && (
        <ContextSection icon={Bookmark} label="Bookmarks">
          {bookmarkedRepos.slice(0, 4).map((r) => (
            <ContextItem key={r.id} label={r.name} subtitle={r.category} />
          ))}
        </ContextSection>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <ContextSection icon={Clock} label="Recently Viewed">
          {recentlyViewed.slice(0, 4).map((r) => (
            <ContextItem key={r.id} label={r.name} subtitle={r.owner} />
          ))}
        </ContextSection>
      )}

      {/* Current Trends */}
      <ContextSection icon={TrendingUp} label="Current Trends">
        {trendingRepos.slice(0, 5).map((r) => (
          <ContextItem key={r.id} label={r.name} subtitle={`${r.stars.toLocaleString()} stars`} />
        ))}
      </ContextSection>

      {/* AI Discovery */}
      <ContextSection icon={Sparkles} label="Why You Might Like">
        <div className="rounded-lg border border-border/40 bg-card p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on your interest in automation and AI, these repositories align with your saved topics.
          </p>
        </div>
      </ContextSection>

      {/* Project Connections */}
      <ContextSection icon={Layers} label="Project Connections">
        <div className="rounded-lg border border-border/40 bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Connect repositories to projects to see them here
          </p>
        </div>
      </ContextSection>
    </div>
  );
}

function ContextSection({
  icon: Icon, label, children,
}: {
  icon: React.ComponentType<{ className?: string }>; label: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ContextItem({ label, subtitle }: { label: string; subtitle?: string }) {
  return (
    <div className="rounded-md px-2 py-1.5 hover:bg-muted/60 hover:scale-[1.02] transition-all duration-150 cursor-pointer">
      <p className="text-sm font-medium text-foreground/90 truncate">{label}</p>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </div>
  );
}
