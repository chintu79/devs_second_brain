import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NoteWorkspace } from "@/components/notes/note-workspace";
import { includeTags, flattenListTags } from "@/lib/tags";

export default async function NotesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to view your notes.</p>
      </div>
    );
  }

  const [notes, resources, prompts, projects] = await Promise.all([
    prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, ...includeTags }),
    prisma.resource.findMany({ where: { userId }, ...includeTags }),
    prisma.prompt.findMany({ where: { userId }, ...includeTags }),
    prisma.project.findMany({ where: { userId }, ...includeTags }),
  ]);

  return (
    <div data-accent="notes" className="flex h-full -m-5 lg:-m-6">
      <NoteWorkspace
        notes={flattenListTags(notes) as unknown as any[]}
        resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
        prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
        projects={flattenListTags(projects.map((p) => ({ ...p, description: p.description })))}
      />
    </div>
  );
}
