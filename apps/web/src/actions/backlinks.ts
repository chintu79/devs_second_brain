"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/action-utils";

export type Backlink = {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
};

export async function getBacklinks(title: string, excludeId: string): Promise<Backlink[]> {
  const userId = await requireAuth();
  if (!userId || !title) return [];

  const items = await prisma.knowledgeItem.findMany({
    where: {
      userId,
      content: { contains: title },
      id: { not: excludeId },
      status: "active",
    },
    select: { id: true, title: true, type: true, createdAt: true },
    take: 10,
  });

  return items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
