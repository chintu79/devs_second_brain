import { Suspense } from "react";
import { auth } from "@/lib/auth";
import prisma, { safeQuery } from "@/lib/prisma";
import { fetchMorePrompts } from "@/actions/prompts";
import { PromptsContent } from "./prompts-content";

export default async function PromptsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-muted-foreground">Sign in to view your prompts.</p>
      </div>
    );
  }

  const [initialResult, metaPrompts] = await Promise.all([
    safeQuery("prompts.fetchMore", () => fetchMorePrompts(undefined, 20), { items: [], nextCursor: null }),
    safeQuery("prompts.categories", () => prisma.prompt.findMany({
      where: { userId },
      select: { category: true },
    }), []),
  ]);

  const categories = [...new Set(metaPrompts.map((p) => p.category))].sort();

  return (
    <Suspense fallback={<div className="flex-1" />}>
      <PromptsContent
        initialItems={initialResult.items}
        nextCursor={initialResult.nextCursor}
        categories={categories}
      />
    </Suspense>
  );
}
