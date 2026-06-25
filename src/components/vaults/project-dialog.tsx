"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProject, editProject } from "@/actions/projects";
import { batchCreateReferences, type LinkItem } from "@/actions/references";
import { LinkPicker } from "@/components/shared/link-picker";

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

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const isEdit = !!project?.id;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = isEdit
      ? await editProject(project!.id!, formData)
      : await createProject(formData);

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      const newId = !isEdit && "id" in result ? (result as any).id as string : null;
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
        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title || ""} placeholder="Project name" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={project?.description || ""} placeholder="Brief description..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={project?.status || "idea"}>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma separated)</Label>
              <Input id="techStack" name="techStack" defaultValue={project?.techStack?.join(", ") || ""} placeholder="React, Node, Postgres" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={project?.tags?.join(", ") || ""} placeholder="web, saas, ai" />
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
