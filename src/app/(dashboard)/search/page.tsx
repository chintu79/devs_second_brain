import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { SearchWorkspace } from "@/components/search/search-workspace";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const session = await auth();
  const userId = session?.user?.id;

  let projects: { id: string; title: string; tags: string[] }[] = [];
  if (userId) {
    projects = await prisma.project.findMany({
      where: { userId },
      select: { id: true, title: true, tags: true },
    });
  }

  return (
    <div data-accent="search" className="-m-5 lg:-m-6 h-[calc(100vh-var(--header-height,0px))] flex overflow-hidden">
      <SearchWorkspace initialQuery={q} projects={projects} />
    </div>
  );
}
