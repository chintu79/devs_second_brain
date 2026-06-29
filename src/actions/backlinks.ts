"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type Backlink = {
  id: string;
  title: string;
  type: "note" | "resource" | "prompt" | "project";
  createdAt: Date;
};

export async function getBacklinks(title: string, excludeId: string): Promise<Backlink[]> {
  const session = await auth();
  if (!session?.user?.id || !title) return [];
  const userId = session.user.id;

  const [notes, resources, prompts, projects] = await Promise.all([
    prisma.note.findMany({
      where: { userId, content: { contains: title }, NOT: { id: excludeId } },
      select: { id: true, title: true, createdAt: true },
      take: 5,
    }),
    prisma.resource.findMany({
      where: { userId, OR: [{ notes: { contains: title } }, { reason: { contains: title } }], NOT: { id: excludeId } },
      select: { id: true, title: true, createdAt: true },
      take: 5,
    }),
    prisma.prompt.findMany({
      where: { userId, OR: [{ prompt: { contains: title } }, { useCase: { contains: title } }], NOT: { id: excludeId } },
      select: { id: true, title: true, createdAt: true },
      take: 5,
    }),
    prisma.project.findMany({
      where: { userId, planMd: { contains: title }, NOT: { id: excludeId } },
      select: { id: true, title: true, createdAt: true },
      take: 5,
    }),
  ]);

  return [
    ...notes.map((n) => ({ ...n, type: "note" as const })),
    ...resources.map((r) => ({ ...r, type: "resource" as const })),
    ...prompts.map((p) => ({ ...p, type: "prompt" as const })),
    ...projects.map((p) => ({ ...p, type: "project" as const })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
