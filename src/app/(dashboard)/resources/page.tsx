import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ResourcesContent } from "./resources-content";

export default async function ResourcesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [resources, recentNotes, projects] = userId
    ? await Promise.all([
        prisma.resource.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 200,
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
      ])
    : [[], [], []];

  const serialized = resources.map((r) => ({
    ...r,
    createdAt: r.createdAt,
    notes: r.notes,
    reason: r.reason,
  }));

  const allCategories = [...new Set(resources.map((r) => r.category))].sort();
  const allTags = [...new Set(resources.flatMap((r) => r.tags))].sort();

  return (
    <ResourcesContent
      resources={serialized}
      allCategories={allCategories}
      allTags={allTags}
      topResources={serialized}
      recentNotes={recentNotes}
      projects={projects}
    />
  );
}
