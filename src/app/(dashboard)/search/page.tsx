import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SearchWorkspace } from "@/components/search/search-workspace";
import { includeTags, flattenListTags } from "@/lib/tags";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  let projects: { id: string; title: string; tags: string[] }[] = [];
  if (userId) {
    const raw = await prisma.project.findMany({
      where: { userId },
      take: 500,
      ...includeTags,
    });
    projects = flattenListTags(raw).map((p) => ({ id: p.id, title: p.title, tags: p.tags }));
  }

  return (
    <div data-accent="search" className="absolute inset-0 flex overflow-hidden">
      <Suspense fallback={<div className="flex-1" />}>
        <SearchWorkspace initialQuery={q} projects={projects} />
      </Suspense>
    </div>
  );
}
