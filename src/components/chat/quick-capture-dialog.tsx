"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Link2, StickyNote, MessageSquare, FolderKanban, Loader2, ArrowUp,
} from "lucide-react";
import { TagInput } from "@/components/shared/tag-input";
import { createResource } from "@/actions/resources";
import { createNote } from "@/actions/notes";
import { createPrompt } from "@/actions/prompts";
import { createProject } from "@/actions/projects";

type CaptureType = "resource" | "note" | "prompt" | "project";

const typeMeta: Record<CaptureType, { label: string; icon: React.ElementType; color: string }> = {
  resource: { label: "Resource", icon: Link2, color: "text-[#14B8A6]" },
  note: { label: "Note", icon: StickyNote, color: "text-[#22C55E]" },
  prompt: { label: "Prompt", icon: MessageSquare, color: "text-[#F59E0B]" },
  project: { label: "Project", icon: FolderKanban, color: "text-[#8B5CF6]" },
};

interface QuickCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickCaptureDialog({ open, onOpenChange }: QuickCaptureDialogProps) {
  const router = useRouter();
  const [type, setType] = useState<CaptureType>("note");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [tagStr, setTagStr] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle("");
      setUrl("");
      setContent("");
      setTagStr("");
      setType("note");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);

    try {
      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("tags", tagStr);

      if (type === "resource") {
        fd.set("url", url.trim());
        fd.set("notes", content);
        fd.set("category", "other");
        fd.set("reason", "");
        await createResource(fd);
      } else if (type === "note") {
        fd.set("content", content);
        fd.set("category", "general");
        await createNote(fd);
      } else if (type === "prompt") {
        fd.set("prompt", content);
        fd.set("category", "general");
        await createPrompt(fd);
      } else if (type === "project") {
        fd.set("description", content);
        fd.set("techStack", "");
        fd.set("planMd", "");
        await createProject(fd);
      }

      toast.success(`${typeMeta[type].label} saved`);
      router.refresh();
      onOpenChange(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [title, type, url, content, tagStr, router, onOpenChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    },
    [handleSave, onOpenChange]
  );

  if (!open) return null;

  const Icon = typeMeta[type].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Type selector */}
        <div className="flex border-b border-border/30">
          {(Object.entries(typeMeta) as [CaptureType, typeof typeMeta[CaptureType]][]).map(
            ([key, meta]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all ${
                  type === key
                    ? "bg-primary/5 accent-text border-b-2"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-b-2 border-transparent"
                }`}
                style={type === key ? { '--accent-c': 'var(--accent, #6366f1)', borderBottomColor: 'var(--accent-c)' } as React.CSSProperties : undefined}
              >
                <meta.icon className={`h-3.5 w-3.5 ${type === key ? meta.color : ""}`} />
                {meta.label}
              </button>
            )
          )}
        </div>

        {/* Form */}
        <div className="p-4 space-y-3">
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === "resource" ? "Article / repo title..." :
              type === "prompt" ? "Prompt title..." :
              type === "project" ? "Project name..." :
              "Note title..."
            }
            className="w-full h-10 rounded-lg border border-border/50 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
          />

          {type === "resource" && (
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL (https://...)"
              className="w-full h-10 rounded-lg border border-border/50 bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === "resource" ? "Notes about this resource..." :
              type === "prompt" ? "Paste your prompt..." :
              type === "project" ? "Project description..." :
              "Write your note..."
            }
            rows={4}
            className="w-full resize-none rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
          />

          <TagInput value={tagStr} onChange={setTagStr} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-muted/20">
          <span className="text-[11px] text-muted-foreground">
            <kbd className="rounded border border-border/50 bg-card px-1 py-0.5 mx-0.5">⌘</kbd>
            <kbd className="rounded border border-border/50 bg-card px-1 py-0.5 mx-0.5">⏎</kbd> to save
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || saving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-foreground/10 text-foreground hover:bg-foreground/20 transition-all disabled:opacity-30"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ArrowUp className="h-3.5 w-3.5" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
