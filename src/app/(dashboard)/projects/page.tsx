import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { ProjectWorkspace } from "@/components/projects/project-workspace";
import { includeTags, flattenListTags } from "@/lib/tags";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to view your projects.</p>
      </div>
    );
  }

  const [projects, resources, prompts, notes] = await Promise.all([
    safeQuery("projects", () => prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("projects.resources", () => prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("projects.prompts", () => prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("projects.notes", () => prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
  ]);

  return (
    <div data-accent="projects" className="absolute inset-0 flex overflow-hidden">
      <Suspense fallback={<div className="flex-1" />}>
        <ProjectWorkspace
          projects={flattenListTags(projects)}
          resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
          prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
          notes={flattenListTags(notes.map((n) => ({ ...n, content: n.content })))}
        />
      </Suspense>
    </div>
  );
}
