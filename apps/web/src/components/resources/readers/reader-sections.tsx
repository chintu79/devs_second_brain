"use client";

import { InlineEditor } from "@/components/shared/inline-editor";
import { TagInput } from "@/components/shared/tag-input";
import { Backlinks } from "@/components/shared/backlinks";
import { Markdown } from "@devventory/shared";

/* ─── Notes Section ─── */

interface NotesSectionProps {
  notes: string;
  editNotes: string;
  locked: boolean;
  blended: string;
  onChange: (v: string) => void;
}

export function NotesSection({ notes, editNotes, locked, blended, onChange }: NotesSectionProps) {
  if (!locked && !notes && !editNotes) return null;
  return (
    <section className={locked && !notes ? "hidden" : ""}>
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-2">
        Why I Saved This
      </h3>
      {locked ? (
        <div className="text-sm text-foreground/80 leading-relaxed note-prose">
          <Markdown>{notes}</Markdown>
        </div>
      ) : (
        <div className={blended}>
          <InlineEditor content={editNotes} onChange={onChange} editable placeholder="Why did you save this?" />
        </div>
      )}
    </section>
  );
}

/* ─── Summary Section ─── */

interface SummarySectionProps {
  summary: string | null;
}

export function SummarySection({ summary }: SummarySectionProps) {
  if (!summary) return null;
  return (
    <section>
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-2">Summary</h3>
      <p className="text-sm text-foreground/70 leading-relaxed">{summary}</p>
    </section>
  );
}

/* ─── Metadata Section ─── */

interface MetadataSectionProps {
  type: string;
  domain: string | null;
  createdAt: Date;
  tags: string[];
  editTags: string;
  locked: boolean;
  blended: string;
  dotColor: string;
  typeLabel: string;
  onTagClick?: (tag: string) => void;
  onTagsChange: (v: string) => void;
  onClose: () => void;
}

export function MetadataSection({
  type, domain, createdAt, tags, editTags, locked, blended,
  dotColor, typeLabel, onTagClick, onTagsChange, onClose,
}: MetadataSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2.5 text-xs text-muted-foreground/60">
        <span className={`inline-block h-2 w-2 rounded-full ${dotColor}`} />
        <span className="text-[11px] font-medium uppercase tracking-wider">{typeLabel}</span>
        {domain && <span>{domain}</span>}
        <span>{new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>

      <div className={blended}>
        {locked ? (
          tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                onTagClick ? (
                  <button key={tag} onClick={() => { onTagClick(tag); onClose(); }}
                    className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded hover:text-foreground hover:bg-muted transition-colors">
                    {tag}
                  </button>
                ) : (
                  <span key={tag} className="text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">{tag}</span>
                )
              ))}
            </div>
          )
        ) : (
          <TagInput value={editTags} onChange={onTagsChange} placeholder="Add tags..." />
        )}
      </div>
    </section>
  );
}

/* ─── Backlinks Section ─── */

interface BacklinksSectionProps {
  title: string;
  excludeId: string;
  blended: string;
}

export function BacklinksSection({ title, excludeId, blended }: BacklinksSectionProps) {
  return (
    <section className={blended}>
      <Backlinks title={title} excludeId={excludeId} />
    </section>
  );
}
