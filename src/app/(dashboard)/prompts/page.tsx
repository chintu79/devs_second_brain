import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PromptsContent } from "./prompts-content";

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
    <PromptsContent prompts={serialized} categories={categories} />
  );
}
