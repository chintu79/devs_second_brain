import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ResourceList } from "@/components/resources/resource-list";
import { ResourceContextPanel } from "@/components/resources/resource-context-panel";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function ResourcesPage({ searchParams }: PageProps) {
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
    <div data-accent="resources" className="flex h-full">
      <div className="flex-1 min-w-0">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Resources</h1>
          <p className="text-sm text-secondary-foreground mt-1">Your developer knowledge library. Store, organize and rediscover valuable resources.</p>
        </div>

        <ResourceList resources={serialized} allCategories={allCategories} allTags={allTags} />
      </div>

      <ResourceContextPanel topResources={serialized} recentNotes={recentNotes} projects={projects} />
    </div>
  );
}
