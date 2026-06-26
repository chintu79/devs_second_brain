"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Markdown } from "@/components/shared/markdown";
import { Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNote, editNote } from "@/actions/notes";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";
import { TagInput } from "@/components/shared/tag-input";
import { noteSchema } from "@/lib/schemas";
import { aiSuggestCategory, aiSuggestTags } from "@/actions/ai";

interface NoteData {
  id?: string;
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: NoteData;
}

type NoteFormValues = {
  title: string;
  content: string;
  category: "personal" | "technical" | "learning" | "meeting" | "idea" | "other";
  tags: string;
};

export function NoteDialog({ open, onOpenChange, note }: NoteDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!note?.id;

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      category: (note?.category as NoteFormValues["category"]) || "technical",
      tags: note?.tags?.join(", ") || "",
    },
  });

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const { errors, isSubmitting } = form.formState;
  const content = form.watch("content");

  async function onSubmit(values: NoteFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("content", values.content || "");
    formData.set("category", values.category);
    formData.set("tags", values.tags || "");

    const result = isEdit
      ? await editNote(note!.id!, formData)
      : await createNote(formData);

    if (result?.error) {
      setServerError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? result.id as string : null;
      if (newId && links.length > 0) {
        await batchCreateReferences("note", newId, links);
      }
      router.refresh();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Note" : "New Note"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update your markdown note." : "Write a new markdown note."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Note title" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreview(!preview)}>
                {preview ? "Edit" : "Preview"}
              </Button>
            </div>
            {preview ? (
              <div className="min-h-[200px] rounded-md border p-4 prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{content}</Markdown>
              </div>
            ) : (
              <Textarea
                id="content"
                {...form.register("content")}
                placeholder="Write your note in markdown..."
                rows={10}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Category</Label>
                <button
                  type="button" disabled={aiLoading !== null}
                  onClick={async () => {
                    setServerError(null);
                    setAiLoading("category");
                    const res = await aiSuggestCategory(
                      form.watch("title"),
                      form.watch("content") || "",
                      ["personal", "technical", "learning", "meeting", "idea", "other"]
                    );
                    setAiLoading(null);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (res.category) form.setValue("category", res.category as any);
                    else if (res.error) setServerError(res.error);
                  }}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {aiLoading === "category" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  Suggest
                </button>
              </div>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="learning">Learning</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <button
                  type="button" disabled={aiLoading !== null}
                  onClick={async () => {
                    setServerError(null);
                    setAiLoading("tags");
                    const res = await aiSuggestTags(
                      form.watch("title"),
                      form.watch("content") || ""
                    );
                    setAiLoading(null);
                    if (res.tags) form.setValue("tags", res.tags);
                    else if (res.error) setServerError(res.error);
                  }}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {aiLoading === "tags" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                  Suggest
                </button>
              </div>
              <TagInput value={form.watch("tags")} onChange={(v) => form.setValue("tags", v)} />
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <LinkPicker selected={links} onChange={setLinks} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
