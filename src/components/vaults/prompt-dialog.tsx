"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPrompt, editPrompt } from "@/actions/prompts";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";
import { promptSchema } from "@/lib/schemas";

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

type PromptFormValues = {
  title: string;
  prompt: string;
  category: "coding" | "debugging" | "architecture" | "testing" | "docs" | "other";
  useCase: string;
  tags: string;
};

export function PromptDialog({ open, onOpenChange, prompt }: PromptDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!prompt?.id;

  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: prompt?.title || "",
      prompt: prompt?.prompt || "",
      category: (prompt?.category as PromptFormValues["category"]) || "coding",
      useCase: prompt?.useCase || "",
      tags: prompt?.tags?.join(", ") || "",
    },
  });

  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: PromptFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("prompt", values.prompt);
    formData.set("category", values.category);
    formData.set("useCase", values.useCase || "");
    formData.set("tags", values.tags || "");

    const result = isEdit
      ? await editPrompt(prompt!.id!, formData)
      : await createPrompt(formData);

    if (result?.error) {
      setServerError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? (result as any).id as string : null;
      if (newId && links.length > 0) {
        await batchCreateReferences("prompt", newId, links);
      }
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Code Review Prompt" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea id="prompt" {...form.register("prompt")} placeholder="Write your prompt here..." rows={6} />
            {errors.prompt && <p className="text-xs text-destructive">{errors.prompt.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="useCase">Use Case</Label>
            <Input id="useCase" {...form.register("useCase")} placeholder="e.g. Code review, Bug fixing" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" {...form.register("tags")} placeholder="react, typescript, review" />
          </div>

          <div className="pt-2 border-t border-border/50">
            <LinkPicker selected={links} onChange={setLinks} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : isEdit ? "Update" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
