import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProjectWorkspace } from "@/components/projects/project-workspace";

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
    prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } }),
    prisma.resource.findMany({ where: { userId }, select: { id: true, title: true, url: true, tags: true, category: true } }),
    prisma.prompt.findMany({ where: { userId }, select: { id: true, title: true, prompt: true, tags: true, category: true } }),
    prisma.note.findMany({ where: { userId }, select: { id: true, title: true, content: true, category: true, tags: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div data-accent="projects" className="flex h-full -m-5 lg:-m-6">
      <ProjectWorkspace
        projects={projects as unknown as any[]}
        resources={resources}
        prompts={prompts}
        notes={notes}
      />
    </div>
  );
}
