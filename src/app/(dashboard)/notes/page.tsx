import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NoteWorkspace } from "@/components/notes/note-workspace";

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
    prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.resource.findMany({
      where: { userId },
      select: { id: true, title: true, url: true, tags: true, category: true },
    }),
    prisma.prompt.findMany({
      where: { userId },
      select: { id: true, title: true, prompt: true, tags: true, category: true },
    }),
    prisma.project.findMany({
      where: { userId },
      select: { id: true, title: true, description: true, tags: true },
    }),
  ]);

  return (
    <div data-accent="notes" className="flex h-full -m-5 lg:-m-6">
      <NoteWorkspace
        notes={notes as unknown as any[]}
        resources={resources}
        prompts={prompts}
        projects={projects}
      />
    </div>
  );
}
