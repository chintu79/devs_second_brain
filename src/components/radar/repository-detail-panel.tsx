"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X, Star, GitFork, Bookmark, BookmarkCheck, ExternalLink, TrendingUp, Zap, Sparkles, Clock,
  CheckCircle2, Lightbulb, Wrench, ArrowUpRight, FileText, Link2, Layers, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { slideInRight } from "@/lib/motion";
import { createResource } from "@/actions/resources";
import type { Repository } from "@/lib/mock-data";

interface RepositoryDetailPanelProps {
  repo: Repository;
  onClose: () => void;
  onBookmark: (id: string) => void;
}

const growthConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  trending: { label: "Trending", icon: TrendingUp, color: "text-emerald-400" },
  hot: { label: "Hot", icon: Zap, color: "text-amber-400" },
  rising: { label: "Rising", icon: Sparkles, color: "text-sky-400" },
  stable: { label: "Stable", icon: Clock, color: "text-muted-foreground" },
  new: { label: "New", icon: Sparkles, color: "text-purple-400" },
};

const relatedRepos = [
  { name: "langchain", owner: "langchain-ai", category: "AI" },
  { name: "crewai", owner: "crewai", category: "Agents" },
  { name: "browser-use", owner: "browser-use", category: "Agents" },
];

export function RepositoryDetailPanel({ repo, onClose, onBookmark }: RepositoryDetailPanelProps) {
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
    if (!result?.error) setSaved(true);
    setSaving(false);
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.25, delay: 0.05 + i * 0.04, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
    }),
  };

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 border-l border-border/50 bg-background overflow-hidden flex flex-col min-w-0"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">Repository</span>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="space-y-1">
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
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-base text-foreground/80 mt-1">{repo.description}</p>
              </div>
            </div>
          </motion.div>

          <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="flex items-center gap-4 text-sm">
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

          <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible" className="flex flex-wrap gap-1.5">
            {repo.topics.map((tag) => (
              <span key={tag} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{tag}</span>
            ))}
            <span className="text-xs text-muted-foreground bg-muted/70 px-2 py-0.5 rounded capitalize">{repo.category}</span>
          </motion.div>

          {repo.useCases.length > 0 && (
            <motion.div custom={3} variants={contentVariants} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">
                <Lightbulb className="h-3.5 w-3.5 inline mr-1.5" />
                Use Cases
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {repo.useCases.map((uc, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <CheckCircle2 className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">{uc}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {repo.keyFeatures.length > 0 && (
            <motion.div custom={4} variants={contentVariants} initial="hidden" animate="visible">
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3">
                <Wrench className="h-3.5 w-3.5 inline mr-1.5" />
                Key Features
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {repo.keyFeatures.map((kf, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <span className="text-sm text-foreground/80">{kf}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="h-px bg-border/30" />

          <motion.div custom={5} variants={contentVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" />
              Related Repositories
            </h3>
            <div className="space-y-2">
              {relatedRepos.map((r, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 hover:border-primary/20 transition-colors cursor-pointer">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <span className="text-xs font-bold text-foreground/60">{r.owner[0].toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.owner}/{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div custom={6} variants={contentVariants} initial="hidden" animate="visible">
            <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Project Connections
            </h3>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
              <p className="text-sm text-muted-foreground">Attach this repository to a project to track connections</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="shrink-0 border-t border-border/30 px-5 py-3 pb-10 flex items-center gap-2">
        <Button
          onClick={() => onBookmark(repo.id)}
          variant={repo.bookmarked ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs gap-1.5"
        >
          {repo.bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          {repo.bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button
          onClick={handleSaveToResources}
          variant={saved ? "default" : "secondary"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          disabled={saving || saved}
        >
          <Plus className={`h-3.5 w-3.5 ${saving ? "animate-spin" : ""}`} />
          {saved ? "Saved to Resources" : saving ? "Saving..." : "Save to Resources"}
        </Button>
        <a
          href={repo.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open Repository
        </a>
      </div>
    </motion.div>
  );
}
