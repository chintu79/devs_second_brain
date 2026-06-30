"use client";

import { motion } from "framer-motion";
import {
  X, FolderKanban, Link2, Sparkles, FileText, Star, Clock, Tag, Calendar,
  ExternalLink, Globe, Hash, Bookmark, Lightbulb,
} from "lucide-react";
import { IconBtn } from "@devventory/shared";
import { slideInRight } from "@devventory/motion";
import { formatDate, formatRelative } from "@devventory/utils";
import { TYPE_CONFIG } from "@devventory/types";

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
  matchReason?: string;
  relatedItems?: PreviewResult[];
  onClose: () => void;
  relatedLabel?: string;
}

export function SearchPreviewPanel({ result, matchReason, relatedItems, onClose }: SearchPreviewPanelProps) {
  const config = TYPE_CONFIG[result.type];
  const Icon = config.icon;
  const IconColor = config.color;

  return (
    <motion.div
      variants={slideInRight}
      initial="initial"
      animate="animate"
      exit="exit"
      className="panel-detail"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${IconColor}`} />
          <span className="text-xs text-section-foreground uppercase tracking-[0.1em] font-semibold">{config.label}</span>
          {result.url && (
            <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium border border-border bg-card text-foreground hover:bg-muted transition-colors ml-2">
              <ExternalLink className="h-3 w-3" />
              Open
            </a>
          )}
        </div>
        <IconBtn icon={X} label="Close" onClick={onClose} />
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

          {/* Match reason */}
          {matchReason && (
            <div className="rounded-lg border border-border/60 bg-primary/5 p-3">
              <p className="text-xs text-primary/70 italic">
                Matches because {matchReason}
              </p>
            </div>
          )}

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

          {/* Connected Knowledge */}
          {relatedItems && relatedItems.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-section-foreground uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                Connected Knowledge
              </h3>
              <div className="space-y-2">
                {relatedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/30 bg-muted/20">
                    {TYPE_CONFIG[item.type] && (() => {
                      const cfg = TYPE_CONFIG[item.type];
                      return <cfg.icon className={`h-3.5 w-3.5 shrink-0 ${cfg.color}`} />;
                    })()}
                    <span className="text-sm text-foreground/80 truncate">{item.title}</span>
                    {item.tags && item.tags.length > 0 && (
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-auto">
                        {item.tags.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      
    </motion.div>
  );
}
