"use client";

import { FileText } from "lucide-react";
import { Markdown } from "@devventory/shared";
import { InlineEditor } from "@/components/shared/inline-editor";
import { NotesSection, SummarySection, MetadataSection, BacklinksSection } from "./reader-sections";
import { DOT_COLORS } from "@/lib/tags";
import type { ReaderProps } from "./reader-registry";

export function DocumentReader({
  item, locked, blended, editTitle, editContent, editNotes, editTags,
  onEditTitle, onEditContent, onEditNotes, onEditTags, onTagClick, onClose,
}: ReaderProps) {
  const dotColor = DOT_COLORS[item.type] || "bg-muted-foreground/20";
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

  const words = (item.content || "").split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(words / 200));

  return (
    <div>
      {/* Document header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/40">
        <div className="flex items-center gap-2 text-xs text-muted-foreground/50 mb-2">
          <FileText className="h-3.5 w-3.5" />
          <span>{typeLabel}</span>
          <span>·</span>
          <span>{words} words</span>
          <span>·</span>
          <span>{readTime} min read</span>
        </div>
        {locked ? (
          <h1 className="text-xl font-semibold leading-snug">{item.title || "Untitled"}</h1>
        ) : (
          <input
            className="w-full bg-transparent text-xl font-semibold leading-snug outline-none border-b border-transparent pb-0.5 focus:border-foreground/20 transition-colors"
            value={editTitle} onChange={(e) => onEditTitle(e.target.value)} placeholder="Untitled"
          />
        )}
      </div>

      <div className="px-6 py-5 space-y-6">
        <SummarySection summary={item.summary} />

        {/* Primary content — immersive */}
        <section>
          {locked ? (
            item.content ? (
              <div className="max-w-none text-sm text-foreground/85 leading-[1.75] note-prose">
                <Markdown>{item.content}</Markdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground/50 italic">No content</p>
            )
          ) : (
            <div className={blended}>
              <InlineEditor content={editContent} onChange={onEditContent} editable placeholder="Write your document..." />
            </div>
          )}
        </section>

        <hr className="border-border/40" />

        <NotesSection
          notes={item.notes || ""}
          editNotes={editNotes}
          locked={locked}
          blended={blended}
          onChange={onEditNotes}
        />

        <BacklinksSection title={item.title} excludeId={item.id} blended={blended} />

        <MetadataSection
          type={item.type} domain={null} createdAt={item.createdAt}
          tags={item.tags} editTags={editTags} locked={locked} blended={blended}
          dotColor={dotColor} typeLabel={typeLabel}
          onTagClick={onTagClick} onTagsChange={onEditTags} onClose={onClose}
        />
      </div>
    </div>
  );
}
