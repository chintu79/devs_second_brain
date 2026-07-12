"use client";

import { ExternalLink, Film } from "lucide-react";
import { Markdown } from "@devventory/shared";
import { InlineEditor } from "@/components/shared/inline-editor";
import { NotesSection, SummarySection, MetadataSection, BacklinksSection } from "./reader-sections";
import { DOT_COLORS } from "@/lib/tags";
import type { ReaderProps } from "./reader-registry";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || null;
}

export function VideoReader({
  item, locked, blended, editTitle, editNotes, editTags,
  onEditTitle, onEditNotes, onEditTags, onTagClick, onClose,
}: ReaderProps) {
  let domain = item.domain || "";
  if (!domain && item.url) {
    try { domain = new URL(item.url).hostname.replace("www.", ""); } catch {}
  }
  const dotColor = DOT_COLORS[item.type] || "bg-muted-foreground/20";
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  const youtubeId = item.url ? getYouTubeId(item.url) : null;

  return (
    <div>
      {/* Embedded player */}
      {youtubeId && (
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={item.title}
          />
        </div>
      )}

      <div className="px-6 pt-5 pb-6 space-y-6">
        {/* Title row */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {locked ? (
              <h1 className="text-lg font-semibold leading-snug">{item.title || "Untitled"}</h1>
            ) : (
              <input
                className="w-full bg-transparent text-lg font-semibold leading-snug outline-none border-b border-transparent pb-0.5 focus:border-foreground/20 transition-colors"
                value={editTitle} onChange={(e) => onEditTitle(e.target.value)} placeholder="Untitled"
              />
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <Film className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-xs text-muted-foreground/60">{typeLabel}</span>
              {domain && <span className="text-xs text-muted-foreground/50">{domain}</span>}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <ExternalLink className="h-3 w-3" /> Open original
                </a>
              )}
            </div>
          </div>
        </div>

        <SummarySection summary={item.summary} />

        <NotesSection
          notes={item.notes || ""}
          editNotes={editNotes}
          locked={locked}
          blended={blended}
          onChange={onEditNotes}
        />

        <BacklinksSection title={item.title} excludeId={item.id} blended={blended} />

        <MetadataSection
          type={item.type} domain={domain} createdAt={item.createdAt}
          tags={item.tags} editTags={editTags} locked={locked} blended={blended}
          dotColor={dotColor} typeLabel={typeLabel}
          onTagClick={onTagClick} onTagsChange={onEditTags} onClose={onClose}
        />
      </div>
    </div>
  );
}
