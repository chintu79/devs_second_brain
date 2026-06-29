"use client";

import { motion } from "framer-motion";
import {
  X, Star, GitFork, Bookmark, BookmarkCheck, ExternalLink, TrendingUp, Zap, ArrowUp, Clock,
  CheckCircle2, Lightbulb, Wrench, ArrowUpRight, FileText, Link2, Tag, Sparkles,
} from "lucide-react";
import { IconBtn } from "@/components/shared/icon-btn";
import { Button } from "@/components/ui/button";
import { slideInRight, contentReveal } from "@/lib/motion";

import type { Repository } from "@/lib/mock-data";
import { GROWTH_CONFIG } from "@/lib/constants";

interface RepositoryDetailPanelProps {
  repo: Repository;
  onClose: () => void;
  onBookmark: (id: string) => void;
  onSaveToResources: (id: string) => void;
  savedToResources: boolean;
  matchingUserTags: string[];
  relatedRepos: Repository[];
}

export function RepositoryDetailPanel({
  repo, onClose, onBookmark, onSaveToResources,
  savedToResources, matchingUserTags, relatedRepos,
}: RepositoryDetailPanelProps) {
  const growth = GROWTH_CONFIG[repo.growthIndicator] || GROWTH_CONFIG.stable;
  const GrowthIcon = growth.icon;

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="panel-detail"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Repository</span>
          <Button onClick={() => onBookmark(repo.id)} variant={repo.bookmarked ? "default" : "outline"} size="sm" className="h-7 text-[11px] gap-1 px-2.5">
            {repo.bookmarked ? <BookmarkCheck className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
            {repo.bookmarked ? "Saved" : "Bookmark"}
          </Button>
          <Button onClick={() => onSaveToResources(repo.id)} variant={savedToResources ? "default" : "outline"} size="sm" className="h-7 text-[11px] gap-1 px-2.5" disabled={savedToResources}>
            <FileText className="h-3 w-3" />
            {savedToResources ? "Saved" : "Save"}
          </Button>
          <a href={repo.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[11px] font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors">
            <ExternalLink className="h-3 w-3" />
            Open
          </a>
        </div>
        <IconBtn icon={X} label="Close" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <motion.div custom={0} variants={contentReveal} initial="hidden" animate="visible" className="space-y-1">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-base font-bold text-primary">{repo.owner[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{repo.owner}/</span>
                  <h2 className="text-xl font-semibold text-foreground">{repo.name}</h2>
                  <a
                    href={repo.url} target="_blank" rel="noopener noreferrer"
                    aria-label="Open repository"
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-base text-foreground/80 mt-1">{repo.description}</p>
              </div>
            </div>
          </motion.div>

          <motion.div custom={1} variants={contentReveal} initial="hidden" animate="visible" className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="h-4 w-4" />
              {repo.stars.toLocaleString()} stars
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <GitFork className="h-4 w-4" />
              {repo.forks.toLocaleString()} forks
            </span>
            <span className={`flex items-center gap-1.5 font-medium ${growth.color}`}>
              <GrowthIcon className="h-4 w-4" />
              {growth.label}
            </span>
            <span className="text-muted-foreground">{repo.language}</span>
          </motion.div>

          <motion.div custom={2} variants={contentReveal} initial="hidden" animate="visible" className="flex flex-wrap gap-1.5">
            {repo.topics.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{tag}</span>
            ))}
            {repo.topics.length > 3 && <span className="text-xs text-muted-foreground/50">+{repo.topics.length - 3}</span>}
            <span className="text-xs text-muted-foreground bg-muted/70 px-2 py-0.5 rounded capitalize">{repo.category}</span>
          </motion.div>

          {matchingUserTags.length > 0 && (
            <motion.div custom={2.5} variants={contentReveal} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Why This Matters
              </h3>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-2">
                <p className="text-sm text-foreground/80">
                  Matches <span className="font-medium text-foreground">{matchingUserTags.length}</span> {matchingUserTags.length === 1 ? "topic" : "topics"} you follow
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {matchingUserTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded font-medium">{tag}</span>
                  ))}
                  {matchingUserTags.length > 3 && <span className="text-xs text-muted-foreground/50">+{matchingUserTags.length - 3}</span>}
                </div>
              </div>
            </motion.div>
          )}

          {repo.useCases.length > 0 && (
            <motion.div custom={3} variants={contentReveal} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">
                <Lightbulb className="h-3.5 w-3.5 inline mr-1.5" />
                Use Cases
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {repo.useCases.map((uc) => (
                  <div key={uc} className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <CheckCircle2 className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">{uc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {repo.keyFeatures.length > 0 && (
            <motion.div custom={4} variants={contentReveal} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">
                <Wrench className="h-3.5 w-3.5 inline mr-1.5" />
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {repo.keyFeatures.map((kf) => (
                  <div key={kf} className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <span className="text-sm text-foreground/80">{kf}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="h-px bg-border/30" />

          {relatedRepos.length > 0 && (
            <motion.div custom={5} variants={contentReveal} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                Related Repositories
              </h3>
              <div className="space-y-2">
                {relatedRepos.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 hover:border-primary/20 hover:scale-[1.02] transition-all duration-150 cursor-pointer">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                      <span className="text-xs font-bold text-foreground/60">{r.owner[0].toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{r.owner}/{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.stars.toLocaleString()} stars · {r.language}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div custom={6} variants={contentReveal} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {repo.topics.length > 0 ? repo.topics.map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{tag}</span>
              )) : (
                <p className="text-sm text-muted-foreground">No topics listed</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      
    </motion.div>
  );
}
