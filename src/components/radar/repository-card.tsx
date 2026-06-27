"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, GitFork, Bookmark, BookmarkCheck, ArrowUpRight, TrendingUp, Zap, Sparkles, Clock, Plus } from "lucide-react";
import { toast } from "sonner";
import { cardHover } from "@/lib/motion";
import { createResource } from "@/actions/resources";
import type { Repository } from "@/lib/mock-data";

interface RepositoryCardProps {
  repo: Repository;
  selected?: boolean;
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
}

const growthConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  trending: { label: "Trending", icon: TrendingUp, color: "text-emerald-400" },
  hot: { label: "Hot", icon: Zap, color: "text-amber-400" },
  rising: { label: "Rising", icon: Sparkles, color: "text-sky-400" },
  stable: { label: "Stable", icon: Clock, color: "text-muted-foreground" },
  new: { label: "New", icon: Sparkles, color: "text-purple-400" },
};

export function RepositoryCard({ repo, selected, onSelect, onBookmark }: RepositoryCardProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const growth = growthConfig[repo.growthIndicator] || growthConfig.stable;
  const GrowthIcon = growth.icon;

  async function handleSaveToResources() {
    if (saving || saved) return;
    setSaving(true);
    const formData = new FormData();
    formData.set("title", `${repo.owner}/${repo.name}`);
    formData.set("url", repo.url);
    formData.set("category", "other");
    formData.set("notes", repo.description);
    formData.set("tags", repo.topics.slice(0, 5).join(", "));
    formData.set("reason", `Saved from Open Source Radar — ${repo.stars.toLocaleString()} stars, trending in ${repo.category}`);
    const result = await createResource(formData);
    if (!result?.error) {
      setSaved(true);
      toast.success("Saved to Resources");
    } else {
      toast.error(result.error || "Failed to save");
    }
    setSaving(false);
  }

  return (
    <motion.div
      whileHover={cardHover}
      className={`group relative rounded-xl border bg-card cursor-pointer w-full ${
          selected
            ? "border-primary/40 shadow-sm"
            : "border-border hover:border-primary/20 hover:shadow-sm"
        }`}
      onClick={() => onSelect(repo.id)}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-primary/10" : "bg-muted"}`}>
            <span className="text-sm font-bold text-foreground/60">{repo.owner[0].toUpperCase()}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{repo.owner}/</span>
                  <h3 className="text-base font-semibold text-foreground truncate">{repo.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground/80 mt-1 line-clamp-2 leading-relaxed">{repo.description}</p>
              </div>
            </div>

            {repo.highlight && (
              <p className="text-xs text-primary/70 mt-2 italic leading-relaxed">{repo.highlight}</p>
            )}
            {repo.savedBy && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-amber-400/80 bg-amber-400/5 px-1.5 py-0.5 rounded">Saved by {repo.savedBy}</span>
                {repo.highlight && <span className="text-xs text-muted-foreground/70 italic">{repo.highlight}</span>}
              </div>
            )}

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mt-3">
              <span className="text-xs text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded capitalize">{repo.category}</span>
              <span className="text-xs text-muted-foreground">{repo.language}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5" />
                {repo.stars.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <GitFork className="h-3.5 w-3.5" />
                {repo.forks.toLocaleString()}
              </span>
              <span className={`flex items-center gap-1 text-xs font-medium ${growth.color}`}>
                <GrowthIcon className="h-3.5 w-3.5" />
                {growth.label}
              </span>
            </div>

            {repo.topics.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {repo.topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{topic}</span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="text-[11px] text-muted-foreground">+{repo.topics.length - 4}</span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onBookmark(repo.id)}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                repo.bookmarked ? "text-amber-400" : "text-muted-foreground hover:text-amber-400 opacity-0 group-hover:opacity-100"
              }`}
              aria-label={repo.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              {repo.bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleSaveToResources}
              disabled={saving || saved}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                saved
                  ? "text-emerald-400"
                  : "text-muted-foreground hover:text-emerald-400 opacity-0 group-hover:opacity-100"
              }`}
              aria-label={saved ? "Saved to Resources" : "Save to Resources"}
            >
              <Plus className={`h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />
            </button>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
              aria-label="Open repository"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
