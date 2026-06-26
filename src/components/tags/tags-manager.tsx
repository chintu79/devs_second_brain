"use client";

import { useState, useEffect, useCallback } from "react";
import { getTagsWithCounts, mergeTags, deleteTag } from "@/actions/tags";
import { Search, Trash2, Merge, Tags, Hash, Loader2, X, Link2, MessageSquare, StickyNote, FolderKanban } from "lucide-react";
import { toast } from "sonner";

const typeIcons = {
  resources: Link2,
  prompts: MessageSquare,
  notes: StickyNote,
  projects: FolderKanban,
} as const;

const typeColors = {
  resources: "text-[#14B8A6]",
  prompts: "text-[#F59E0B]",
  notes: "text-[#22C55E]",
  projects: "text-[#8B5CF6]",
} as const;

interface TagWithCounts {
  id: string;
  name: string;
  resourceCount: number;
  promptCount: number;
  noteCount: number;
  projectCount: number;
  totalCount: number;
  createdAt: Date;
}

export default function TagsManager() {
  const [tags, setTags] = useState<TagWithCounts[]>([]);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mergeTarget, setMergeTarget] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [merging, setMerging] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    const data = await getTagsWithCounts();
    setTags(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTags();
  }, [fetchTags]);

  const filtered = tags.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMerge() {
    if (selectedIds.size !== 2) {
      toast.error("Select exactly 2 tags to merge");
      return;
    }
    const [a, b] = Array.from(selectedIds);
    setMergeTarget(a);
  }

  async function confirmMerge() {
    if (!mergeTarget) return;
    const sourceId = mergeTarget;
    const [targetId] = Array.from(selectedIds).filter((id) => id !== mergeTarget);
    if (!targetId) {
      toast.error("Select a target tag");
      return;
    }
    setMerging(true);
    try {
      await mergeTags(sourceId, targetId);
      await fetchTags();
      setSelectedIds(new Set());
      setMergeTarget(null);
      toast.success("Tags merged");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to merge");
    }
    setMerging(false);
  }

  const typeKeys = ["resources", "prompts", "notes", "projects"] as const;

  return (
      <div data-accent="tags">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl accent-bg" style={{ '--accent-c': 'var(--accent, #ec4899)' } as React.CSSProperties}>
            <Tags className="h-5 w-5 accent-text" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-[#FAFAFA]">Tags</h1>
            <p className="text-sm text-[#A1A1AA]">{tags.length} tag{tags.length !== 1 ? "s" : ""} across your vault</p>
          </div>
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full h-10 rounded-xl border border-border/20 bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-[#71717A] focus:outline-none focus:border-border/60 transition-colors"
            />
          </div>
          {selectedIds.size > 0 && (
            <>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
              <button
                onClick={handleMerge}
                disabled={selectedIds.size !== 2}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Merge className="h-3.5 w-3.5" />
                Merge ({selectedIds.size})
              </button>
            </>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#71717A]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#71717A]">
            <Hash className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm">{search ? "No matching tags" : "No tags yet"}</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((tag) => {
              const isSelected = selectedIds.has(tag.id);
              const isTarget = mergeTarget === tag.id;

              return (
                <div
                  key={tag.id}
                  className={`group relative rounded-xl border p-4 transition-all duration-150 ${
                    isSelected
                      ? "border-primary/60 bg-primary/5"
                      : "border-border/20 bg-card hover:border-border/60 hover:shadow-sm"
                  }`}
                >
                  {isTarget && (
                    <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                      Merge into this
                    </div>
                  )}

                  <button
                    onClick={() => toggleSelect(tag.id)}
                    className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/40 opacity-0 group-hover:opacity-100 hover:border-border/60"
                    }`}
                  >
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>

                  <div className="flex items-center gap-2 mb-3 pr-6" style={{ '--accent-c': 'var(--accent, #ec4899)' } as React.CSSProperties}>
                    <Hash className="h-4 w-4 shrink-0 accent-text" />
                    <span className="font-medium text-sm text-[#F4F4F5] truncate">{tag.name}</span>
                    <span className="ml-auto shrink-0 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[11px] font-medium accent-text">
                      {tag.totalCount}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {typeKeys.map((type) => {
                      const count = tag[`${type}Count` as keyof typeof tag] as number;
                      if (count === 0) return null;
                      const Icon = typeIcons[type];
                      return (
                        <span key={type} className="inline-flex items-center gap-1 text-[11px] text-[#A1A1AA]">
                          <Icon className={`h-3 w-3 ${typeColors[type]}`} />
                          {count}
                        </span>
                      );
                    })}
                  </div>

                  <button
                    onClick={async () => {
                      setDeletingId(tag.id);
                      try {
                        await deleteTag(tag.id);
                        await fetchTags();
                        toast.success("Tag deleted");
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Failed to delete");
                      }
                      setDeletingId(null);
                    }}
                    disabled={deletingId === tag.id}
                    aria-label="Delete tag"
                    className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-md text-[#71717A] opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400 transition-all duration-150 disabled:opacity-50"
                  >
                    {deletingId === tag.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {mergeTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-border/20 bg-card p-6 shadow-xl">
              <h3 className="text-sm font-semibold text-[#FAFAFA] mb-2">Merge Tags</h3>
              <p className="text-sm text-[#A1A1AA] mb-4">
                All items from{" "}
                <span className="text-[#F4F4F5] font-medium">
                  {tags.find((t) => t.id === mergeTarget)?.name}
                </span>{" "}
                will be merged into the selected target tag. The source tag will be deleted.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setMergeTarget(null)}
                  className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-4 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMerge}
                  disabled={merging}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {merging && <Loader2 className="h-4 w-4 animate-spin" />}
                  Merge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
