import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fetchMoreResources } from "@/actions/resources";
import { ResourcesContent } from "./resources-content";
import { includeTags, flattenListTags } from "@/lib/tags";

export default async function ResourcesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to view your resources.</p>
      </div>
    );
  }

  const [{ items: initialItems, nextCursor }, metaResources, recentNotes, projects] = await Promise.all([
    fetchMoreResources(undefined, 20),
    prisma.resource.findMany({
      where: { userId },
      ...includeTags,
    }),
    prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    }),
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    }),
  ]);

  const allCategories = [...new Set(metaResources.map((r) => r.category))].sort();
  const allTags = [...new Set(flattenListTags(metaResources as any).flatMap((r) => r.tags))].sort();

  return (
    <ResourcesContent
      initialItems={initialItems}
      nextCursor={nextCursor}
      allCategories={allCategories}
      allTags={allTags}
      recentNotes={recentNotes}
      projects={projects}
    />
  );
}
