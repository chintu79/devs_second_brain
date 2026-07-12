"use client";

import { Markdown } from "@devventory/shared";
import { InlineEditor } from "@/components/shared/inline-editor";
import { NotesSection, MetadataSection, BacklinksSection } from "./reader-sections";
import { DOT_COLORS } from "@/lib/tags";
import type { ReaderProps } from "./reader-registry";

export function NoteReader({
  item, locked, blended, editTitle, editContent, editNotes, editTags,
  onEditTitle, onEditContent, onEditNotes, onEditTags, onTagClick, onClose,
}: ReaderProps) {
  const dotColor = DOT_COLORS[item.type] || "bg-muted-foreground/20";
  const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);

  return (
    <div>
      <div className="max-w-2xl mx-auto px-8 py-8">
        {/* Title */}
        {locked ? (
          <h1 className="text-2xl font-semibold leading-snug mb-6">{item.title || "Untitled"}</h1>
        ) : (
          <input
            className="w-full bg-transparent text-2xl font-semibold leading-snug outline-none border-b border-transparent pb-1 mb-6 focus:border-foreground/20 transition-colors"
            value={editTitle} onChange={(e) => onEditTitle(e.target.value)} placeholder="Untitled"
          />
        )}

        {/* Content — primary focus, distraction-free */}
        {locked ? (
          item.content ? (
            <div className="text-base text-foreground/85 leading-[1.75] note-prose">
              <Markdown>{item.content}</Markdown>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/50 italic">Empty note</p>
          )
        ) : (
          <div className={blended}>
            <InlineEditor content={editContent} onChange={onEditContent} editable placeholder="Start writing..." />
          </div>
        )}

        {/* Divider before context */}
        {(item.notes || item.tags.length > 0) && (
          <hr className="my-8 border-border/40" />
        )}

        <div className="space-y-6">
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
    </div>
  );
}
