"use server";

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/action-utils";

export async function getTagsWithCounts() {
  try {
    const userId = await requireAuth();
    if (!userId) return [];

    const tags = await prisma.tag.findMany({
      where: { userId },
      include: { _count: { select: { items: true } } },
      orderBy: { name: "asc" },
    });

    return tags.map((t) => ({
      id: t.id,
      name: t.name,
      count: t._count.items,
      createdAt: t.createdAt,
    }));
  } catch {
    return [];
  }
}

export async function searchTags(query: string) {
  try {
    const userId = await requireAuth();
    if (!userId) return [];

    const tags = await prisma.tag.findMany({
      where: { userId, name: { contains: query, mode: "insensitive" } },
      select: { id: true, name: true },
      take: 10,
      orderBy: { name: "asc" },
    });

    return tags;
  } catch {
    return [];
  }
}
