import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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

  const [{ items: initialItems, nextCursor }, metaPrompts] = await Promise.all([
    fetchMorePrompts(undefined, 20),
    prisma.prompt.findMany({
      where: { userId },
      select: { category: true },
    }),
  ]);

  const categories = [...new Set(metaPrompts.map((p) => p.category))].sort();

  return (
    <PromptsContent
      initialItems={initialItems}
      nextCursor={nextCursor}
      categories={categories}
    />
  );
}
