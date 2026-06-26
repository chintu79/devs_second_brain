"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createResource, editResource } from "@/actions/resources";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";
import { TagInput } from "@/components/shared/tag-input";
import { resourceSchema } from "@/lib/schemas";
import { aiSuggestCategory, aiSuggestTags } from "@/actions/ai";

interface Resource {
  id?: string;
  title?: string;
  url?: string;
  category?: string;
  tags?: string[];
  notes?: string | null;
  reason?: string | null;
}

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resource?: Resource;
}

type ResourceFormValues = {
  title: string;
  url: string;
  category: "frontend" | "backend" | "devops" | "database" | "mobile" | "ai" | "design" | "other";
  reason: string;
  tags: string;
  notes: string;
};

export function ResourceDialog({ open, onOpenChange, resource }: ResourceDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!resource?.id;

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title || "",
      url: resource?.url || "",
      category: (resource?.category as ResourceFormValues["category"]) || "other",
      reason: resource?.reason || "",
      tags: resource?.tags?.join(", ") || "",
      notes: resource?.notes || "",
    },
  });

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ResourceFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("url", values.url);
    formData.set("category", values.category);
    formData.set("reason", values.reason || "");
    formData.set("tags", values.tags || "");
    formData.set("notes", values.notes || "");

    const result = isEdit
      ? await editResource(resource!.id!, formData)
      : await createResource(formData);

    if (result?.error) {
      setServerError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? result.id as string : null;
      if (newId && links.length > 0) {
        await batchCreateReferences("resource", newId, links);
      }
      router.refresh();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Resource" : "Add Resource"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the resource details below." : "Save a new resource link."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="My Resource" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" type="url" {...form.register("url")} placeholder="https://example.com" />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>

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
                    form.watch("notes") || form.watch("reason") || "",
                    ["frontend", "backend", "devops", "database", "mobile", "ai", "design", "other"]
                  );
                  setAiLoading(null);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    if (res.category) form.setValue("category", res.category as any);
                  else if (res.error) setServerError(res.error);
                }}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {aiLoading === "category" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
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
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Why are you saving this?</Label>
            <Textarea id="reason" {...form.register("reason")} placeholder="For my voice assistant project, reference for authentication system..." rows={2} />
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
                    form.watch("notes") || form.watch("reason") || ""
                  );
                  setAiLoading(null);
                  if (res.tags) form.setValue("tags", res.tags);
                  else if (res.error) setServerError(res.error);
                }}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {aiLoading === "tags" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Suggest
              </button>
            </div>
            <TagInput value={form.watch("tags")} onChange={(v) => form.setValue("tags", v)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} placeholder="Optional notes..." rows={3} />
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
