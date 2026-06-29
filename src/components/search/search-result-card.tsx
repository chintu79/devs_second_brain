"use client";

import { FolderKanban, Link2, Sparkles, FileText, Clock, Star, Tag } from "lucide-react";
import { formatRelative } from "@/lib/utils";
import { TYPE_CONFIG } from "@/lib/constants";

type ResultType = "project" | "resource" | "prompt" | "note";

interface BaseResult {
  id: string;
  title: string;
  type: ResultType;
  category?: string;
  tags?: string[];
  description?: string;
  content?: string;
  updatedAt?: string;
  createdAt?: string;
  favorite?: boolean;
  projectName?: string;
}

interface SearchResultCardProps {
  result: BaseResult;
  matchReason?: string;
  selected?: boolean;
  onSelect: (id: string) => void;
}

const typeConfig: Record<ResultType, { icon: React.ComponentType<{ className?: string }>; label: string; color: string; border: string }> = {
  ...TYPE_CONFIG,
  project: { ...TYPE_CONFIG.project, color: "text-blue-400", border: "border-l-blue-400/40" },
  resource: { ...TYPE_CONFIG.resource, color: "text-amber-400", border: "border-l-amber-400/40" },
  prompt: { ...TYPE_CONFIG.prompt, color: "text-purple-400", border: "border-l-purple-400/40" },
  note: { ...TYPE_CONFIG.note, color: "text-emerald-400", border: "border-l-emerald-400/40" },
};



function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + "…";
}

export function SearchResultCard({ result, matchReason, selected, onSelect }: SearchResultCardProps) {
  const config = typeConfig[result.type];
  const Icon = config.icon;
  const preview = result.description || result.content || "";

  return (
    <div
      className={`group relative rounded-xl border bg-card cursor-pointer border-l-2 w-full transition-all duration-150 hover:scale-[1.01] ${
        selected ? "border-primary/40 border-l-primary shadow-sm" : `border-border ${config.border} hover:border-primary/20 hover:shadow-sm`
      }`}
      onClick={() => onSelect(result.id)}
    >
      <div className="px-4 py-3.5">
        <div className="flex items-start gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? "bg-primary/10" : "bg-muted"}`}>
            <Icon className={`h-4 w-4 ${selected ? "text-primary" : config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                {config.label}
              </span>
              <h3 className="text-sm font-semibold text-foreground truncate">{result.title}</h3>
              {result.favorite && <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />}
            </div>

            {preview && (
              <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-2 leading-relaxed">
                {truncate(preview.replace(/^#+\s*/gm, "").replace(/[*`~\[\]]/g, ""), 160)}
              </p>
            )}

            {matchReason && (
              <p className="text-[11px] text-primary/60 mt-1.5 italic">Matches because {matchReason}</p>
            )}

            <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-muted-foreground">
              {result.category && (
                <span className="bg-muted/70 px-1.5 py-0.5 rounded capitalize">{result.category}</span>
              )}
              {result.projectName && (
                <span className="flex items-center gap-1 text-primary/60">
                  <FolderKanban className="h-3 w-3" />
                  {result.projectName}
                </span>
              )}
              {result.updatedAt && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelative(result.updatedAt)}
                </span>
              )}
              {result.tags && result.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{result.tags.slice(0, 2).join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
