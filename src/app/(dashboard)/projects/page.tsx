import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
    prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, ...includeTags }),
    prisma.resource.findMany({ where: { userId }, ...includeTags }),
    prisma.prompt.findMany({ where: { userId }, ...includeTags }),
    prisma.note.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, ...includeTags }),
  ]);

  return (
    <div data-accent="projects" className="flex h-full -m-5 lg:-m-6">
      <ProjectWorkspace
        projects={flattenListTags(projects) as unknown as any[]}
        resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
        prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
        notes={flattenListTags(notes.map((n) => ({ ...n, content: n.content })))}
      />
    </div>
  );
}
