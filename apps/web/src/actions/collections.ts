"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/action-utils";

export interface CollectionNode {
  id: string;
  name: string;
  parentId: string | null;
  sortOrder: number;
  children: CollectionNode[];
  itemCount: number;
}

export async function getCollectionTree(): Promise<CollectionNode[]> {
  const userId = await requireAuth();
  if (!userId) return [];

  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { items: true } } },
    });

    const map = new Map<string, CollectionNode>();
    const roots: CollectionNode[] = [];

    for (const c of collections) {
      map.set(c.id, { id: c.id, name: c.name, parentId: c.parentId, sortOrder: c.sortOrder, children: [], itemCount: c._count.items });
    }

    for (const c of collections) {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  } catch {
    return [];
  }
}

export async function createCollection(name: string, parentId?: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };

  try {
    await prisma.collection.create({
      data: { name: trimmed, parentId: parentId || null, userId },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to create collection" };
  }
}

export async function renameCollection(id: string, name: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Name is required" };

  try {
    await prisma.collection.updateMany({
      where: { id, userId },
      data: { name: trimmed },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to rename collection" };
  }
}

export async function deleteCollection(id: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Unauthorized" };

  try {
    const col = await prisma.collection.findUnique({
      where: { id },
      select: { parentId: true, userId: true },
    });
    if (!col || col.userId !== userId) return { error: "Not found" };

    await prisma.collection.updateMany({
      where: { parentId: id, userId },
      data: { parentId: col.parentId },
    });

    await prisma.collection.delete({ where: { id } });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to delete collection" };
  }
}
