"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNote, editNote } from "@/actions/notes";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";

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

export function NoteDialog({ open, onOpenChange, note }: NoteDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState(note?.content || "");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!note?.id;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    formData.set("content", content);

    const result = isEdit
      ? await editNote(note!.id!, formData)
      : await createNote(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? (result as any).id as string : null;
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
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={note?.title || ""} placeholder="Note title" required />
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
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note in markdown..."
                rows={10}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={note?.category || "technical"}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={note?.tags?.join(", ") || ""} placeholder="react, tutorial" />
            </div>
          </div>

          <div className="pt-2 border-t border-border/50">
            <LinkPicker selected={links} onChange={setLinks} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
