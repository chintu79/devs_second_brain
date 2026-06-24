"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPrompt, editPrompt } from "@/actions/prompts";

interface PromptData {
  id?: string;
  title?: string;
  prompt?: string;
  category?: string;
  tags?: string[];
  useCase?: string;
}

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: PromptData;
}

export function PromptDialog({ open, onOpenChange, prompt }: PromptDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!prompt?.id;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = isEdit
      ? await editPrompt(prompt!.id!, formData)
      : await createPrompt(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.refresh();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Prompt" : "Save Prompt"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the prompt details below." : "Save a reusable AI prompt."}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={prompt?.title || ""} placeholder="Code Review Prompt" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" name="prompt" defaultValue={prompt?.prompt || ""} placeholder="Write your prompt here..." rows={6} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={prompt?.category || "coding"}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="debugging">Debugging</SelectItem>
                <SelectItem value="architecture">Architecture</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="docs">Documentation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case</Label>
            <Input id="useCase" name="useCase" defaultValue={prompt?.useCase || ""} placeholder="e.g. Code review, Bug fixing" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={prompt?.tags?.join(", ") || ""} placeholder="react, typescript, review" />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
