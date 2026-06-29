"use client";

import { Star, GitFork, Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";
import type { Repository } from "@/lib/mock-data";
import { GROWTH_CONFIG } from "@/lib/constants";

interface RepositoryCardProps {
  repo: Repository;
  matchingUserTags?: string[];
  onSelect: (id: string) => void;
  onBookmark: (id: string) => void;
}

export function RepositoryCard({ repo, matchingUserTags = [], onSelect, onBookmark }: RepositoryCardProps) {
  const growth = GROWTH_CONFIG[repo.growthIndicator] || GROWTH_CONFIG.stable;
  const GrowthIcon = growth.icon;
  const hasRelevance = matchingUserTags.length > 0;

  return (
    <div
      className="group rounded-xl border border-border bg-card cursor-pointer w-full transition-all duration-150 hover:border-primary/20 hover:shadow-sm"
      onClick={() => onSelect(repo.id)}
    >
      <div className="px-5 py-4">
        <div className="flex items-start gap-4">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <span className="text-sm font-bold text-foreground/60">{repo.owner[0].toUpperCase()}</span>
            {hasRelevance && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-background" title="Matches your stack" />
            )}
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

              {/* Always-visible actions */}
              <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onBookmark(repo.id)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${
                    repo.bookmarked ? "text-amber-400" : "text-muted-foreground hover:text-amber-400"
                  }`}
                  aria-label={repo.bookmarked ? "Remove bookmark" : "Bookmark"}
                >
                  {repo.bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
                </button>
                <a
                  href={repo.url} target="_blank" rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                  aria-label="Open repository"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Why This Matters */}
            {hasRelevance && (
              <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.03] px-3 py-2">
                <p className="text-[11px] text-primary/80 font-medium mb-1.5">Why it matters</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchingUserTags.slice(0, 5).map((tag) => (
                    <span key={tag} className="text-[11px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {repo.highlight && (
              <p className="text-xs text-primary/70 mt-2 leading-relaxed">{repo.highlight}</p>
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
              <div className="flex flex-wrap gap-1.5 mt-3">
                {repo.topics.slice(0, 4).map((topic) => (
                  <span key={topic} className="text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{topic}</span>
                ))}
                {repo.topics.length > 4 && (
                  <span className="text-[11px] text-muted-foreground">+{repo.topics.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
