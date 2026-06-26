import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
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
    safeQuery("notes", () => prisma.note.findMany({ where: { userId }, orderBy: { updatedAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("notes.resources", () => prisma.resource.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("notes.prompts", () => prisma.prompt.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
    safeQuery("notes.projects", () => prisma.project.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200, ...includeTags }), []),
  ]);

  return (
    <div data-accent="notes" className="flex h-full -m-5 lg:-m-6">
      <Suspense fallback={<div className="flex-1" />}>
        <NoteWorkspace
          notes={flattenListTags(notes)}
          resources={flattenListTags(resources.map((r) => ({ ...r, url: r.url, category: r.category })))}
          prompts={flattenListTags(prompts.map((p) => ({ ...p, prompt: p.prompt })))}
          projects={flattenListTags(projects.map((p) => ({ ...p, description: p.description })))}
        />
      </Suspense>
    </div>
  );
}
