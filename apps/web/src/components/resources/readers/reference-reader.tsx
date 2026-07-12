"use client";

import { ExternalLink } from "lucide-react";
import { Markdown } from "@devventory/shared";
import { InlineEditor } from "@/components/shared/inline-editor";
import { NotesSection, SummarySection, MetadataSection, BacklinksSection } from "./reader-sections";
import { DOT_COLORS } from "@/lib/tags";
import type { ReaderProps } from "./reader-registry";

const PROVIDER_LABELS: Record<string, string> = {
  "youtube.com": "YouTube", "youtu.be": "YouTube",
  "github.com": "GitHub", "twitter.com": "X", "x.com": "X",
  "instagram.com": "Instagram", "reddit.com": "Reddit",
  "linkedin.com": "LinkedIn", "medium.com": "Medium",
  "substack.com": "Substack",
};

export function ReferenceReader({
  item, locked, blended, editTitle, editNotes, editTags,
  onEditTitle, onEditNotes, onEditTags, onTagClick, onClose,
}: ReaderProps) {
  let domain = item.domain || "";
  if (!domain && item.url) {
    try { domain = new URL(item.url).hostname.replace("www.", ""); } catch {}
  }
  const providerLabel = PROVIDER_LABELS[domain] || domain;
  const dotColor = DOT_COLORS[item.type] || "bg-muted-foreground/20";
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

  return (
    <div>
      {/* Hero */}
      <div className="px-6 pt-6 pb-4 border-b border-border/40">
        {locked ? (
          <h1 className="text-xl font-semibold leading-snug">{item.title || "Untitled"}</h1>
        ) : (
          <input
            className="w-full bg-transparent text-xl font-semibold leading-snug outline-none border-b border-transparent pb-0.5 focus:border-foreground/20 transition-colors"
            value={editTitle} onChange={(e) => onEditTitle(e.target.value)} placeholder="Untitled"
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className="text-xs font-medium">{providerLabel}</span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground/60">{typeLabel}</span>
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

      <div className="px-6 py-5 space-y-6">
        <SummarySection summary={item.summary} />

        {/* Content (if exists as body text) */}
        {item.content && (
          <section>
            {locked ? (
              <div className="text-sm text-foreground/80 leading-relaxed note-prose">
                <Markdown>{item.content}</Markdown>
              </div>
            ) : (
              <div className={blended}>
                <InlineEditor content={item.content} onChange={() => {}} editable={false} />
              </div>
            )}
          </section>
        )}

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
