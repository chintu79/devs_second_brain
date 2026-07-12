import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { fetchMoreKnowledgeItems, type KnowledgeFilter } from "@/actions/knowledge";
import { KnowledgeWorkspace } from "@/components/knowledge/knowledge-workspace";
import { KnowledgeSkeleton } from "@/components/knowledge/knowledge-skeleton";

const VALID_FILTERS: KnowledgeFilter[] = ["favorites", "archive", "trash"];

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const sp = await searchParams;
  const raw = typeof sp.filter === "string" ? sp.filter : null;
  const filter: KnowledgeFilter = VALID_FILTERS.includes(raw as KnowledgeFilter) ? (raw as KnowledgeFilter) : null;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to explore your knowledge.</p>
      </div>
    );
  }

  const initialResult = await fetchMoreKnowledgeItems(undefined, 50, filter);

  return (
    <div data-accent="knowledge" className="absolute inset-0 w-full h-full flex overflow-hidden">
      <Suspense fallback={<KnowledgeSkeleton />}>
        <KnowledgeWorkspace
          key={filter || "all"}
          initialItems={initialResult.items}
          nextCursor={initialResult.nextCursor}
          filter={filter}
        />
      </Suspense>
    </div>
  );
}
