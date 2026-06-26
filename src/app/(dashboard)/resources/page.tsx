import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { fetchMoreResources } from "@/actions/resources";
import { ResourcesContent } from "./resources-content";

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

  const [initialResult, categories, resourceTags, recentNotes, projects] = await Promise.all([
    safeQuery("resources.fetchMore", () => fetchMoreResources(undefined, 20), { items: [], nextCursor: null }),
    safeQuery("resources.categories", () => prisma.resource.findMany({ where: { userId }, distinct: ["category"], select: { category: true } }), []),
    safeQuery("resources.tags", () => prisma.resourceTag.findMany({ where: { resource: { userId } }, include: { tag: { select: { name: true } } }, take: 500 }), []),
    safeQuery("resources.recentNotes", () => prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    }), []),
    safeQuery("resources.recentProjects", () => prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, title: true },
    }), []),
  ]);

  const allCategories = categories.map((c) => c.category).sort();
  const allTags = [...new Set(resourceTags.map((rt) => rt.tag.name))].sort();

  return (
    <ResourcesContent
      initialItems={initialResult.items}
      nextCursor={initialResult.nextCursor}
      allCategories={allCategories}
      allTags={allTags}
      recentNotes={recentNotes}
      projects={projects}
    />
  );
}
