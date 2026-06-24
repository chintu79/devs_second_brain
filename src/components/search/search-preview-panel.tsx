"use client";

import { motion } from "framer-motion";
import {
  X, FolderKanban, Link2, Sparkles, FileText, Star, Clock, Tag, Calendar,
  ExternalLink, Globe, Hash, Bookmark, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { slideInRight } from "@/lib/motion";

type ResultType = "project" | "resource" | "prompt" | "note";

interface PreviewResult {
  id: string;
  type: ResultType;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
  url?: string;
  useCase?: string;
  status?: string;
  techStack?: string[];
  favorite?: boolean;
  reason?: string;
  notes?: string;
  useCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface SearchPreviewPanelProps {
  result: PreviewResult;
  onClose: () => void;
  relatedLabel?: string;
}

const typeConfig: Record<ResultType, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  project: { icon: FolderKanban, label: "Project", color: "text-blue-400" },
  resource: { icon: Link2, label: "Resource", color: "text-amber-400" },
  prompt: { icon: Sparkles, label: "Prompt", color: "text-purple-400" },
  note: { icon: FileText, label: "Note", color: "text-emerald-400" },
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatRelative(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
}

export function SearchPreviewPanel({ result, onClose }: SearchPreviewPanelProps) {
  const config = typeConfig[result.type];
  const Icon = config.icon;
  const IconColor = config.color;

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 border-l border-border/50 bg-background overflow-hidden flex flex-col min-w-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${IconColor}`} />
          <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">{config.label}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted`}>
                <Icon className={`h-4 w-4 ${IconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground">{result.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded capitalize bg-muted text-muted-foreground`}>
                    {result.category || config.label}
                  </span>
                  {result.favorite && (
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description / Content */}
          {(result.description || result.content) && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                {result.description || (result.content ? result.content.replace(/^#+\s*/gm, "").slice(0, 300) : "")}
              </p>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {result.updatedAt && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  Last Updated
                </div>
                <p className="text-sm font-medium text-foreground">{formatRelative(result.updatedAt)}</p>
              </div>
            )}
            {result.createdAt && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Created
                </div>
                <p className="text-sm font-medium text-foreground">{formatDate(result.createdAt)}</p>
              </div>
            )}
            {result.type === "prompt" && result.useCount !== undefined && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Hash className="h-3.5 w-3.5" />
                  Times Used
                </div>
                <p className="text-sm font-medium text-foreground">{result.useCount}</p>
              </div>
            )}
            {result.type === "resource" && result.url && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Globe className="h-3.5 w-3.5" />
                  URL
                </div>
                <p className="text-sm font-medium text-foreground truncate">{result.url}</p>
              </div>
            )}
            {result.type === "project" && result.status && (
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <FolderKanban className="h-3.5 w-3.5" />
                  Status
                </div>
                <p className="text-sm font-medium text-foreground capitalize">{result.status}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional context */}
          {result.type === "resource" && result.reason && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                Saved For
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.reason}</p>
            </div>
          )}

          {result.type === "resource" && result.notes && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5" />
                Notes
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.notes}</p>
            </div>
          )}

          {result.type === "prompt" && result.useCase && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" />
                Use Case
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.useCase}</p>
            </div>
          )}

          {result.type === "project" && result.techStack && result.techStack.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-2">Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-secondary-foreground">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/30 px-5 py-3 flex items-center gap-2">
        {result.url && (
          <a
            href={result.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>
        )}
      </div>
    </motion.div>
  );
}
