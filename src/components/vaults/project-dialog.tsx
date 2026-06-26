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
import { createProject, editProject } from "@/actions/projects";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";
import { TagInput } from "@/components/shared/tag-input";
import { projectSchema } from "@/lib/schemas";
import { aiSuggestTags } from "@/actions/ai";

interface ProjectData {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  techStack?: string[];
  tags?: string[];
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectData;
}

type ProjectFormValues = {
  title: string;
  description: string;
  status: "idea" | "research" | "planning" | "building" | "completed" | "archived";
  techStack: string;
  tags: string;
};

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!project?.id;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      status: (project?.status as ProjectFormValues["status"]) || "idea",
      techStack: project?.techStack?.join(", ") || "",
      tags: project?.tags?.join(", ") || "",
    },
  });

  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const { errors, isSubmitting } = form.formState;

  async function onSubmit(values: ProjectFormValues) {
    setServerError(null);
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description || "");
    formData.set("status", values.status);
    formData.set("techStack", values.techStack || "");
    formData.set("tags", values.tags || "");

    const result = isEdit
      ? await editProject(project!.id!, formData)
      : await createProject(formData);

    if (result?.error) {
      setServerError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? result.id as string : null;
      if (newId && links.length > 0) {
        await batchCreateReferences("project", newId, links);
      }
      router.refresh();
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "New Project"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the project details." : "Create a new project idea."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{serverError}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} placeholder="Project name" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} placeholder="Brief description..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input id="techStack" {...form.register("techStack")} placeholder="React, Node, Postgres" />
            </div>
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
                    form.watch("description") || ""
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
