import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PromptList } from "@/components/prompts/prompt-list";

export default async function PromptsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const prompts = userId
    ? await prisma.prompt.findMany({
        where: { userId },
        orderBy: [{ favorite: "desc" }, { lastUsedAt: "desc" }, { createdAt: "desc" }],
      })
    : [];

  const serialized = prompts.map((p) => ({
    ...p,
    createdAt: p.createdAt,
    lastUsedAt: p.lastUsedAt,
  }));

  const categories = [...new Set(prompts.map((p) => p.category))].sort();

  return (
    <div data-accent="prompts" className="flex h-full">
      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Prompt Library</h1>
          <p className="text-sm text-secondary-foreground mt-1">Your reusable AI workflows. Store prompts, templates, system instructions, and agent workflows.</p>
        </div>

        <PromptList prompts={serialized} categories={categories} />
      </div>
    </div>
  );
}
