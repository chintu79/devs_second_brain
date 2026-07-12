"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseTagNames, flattenItemTags, flattenItemCollections } from "@/lib/tags";
import { requireAuth } from "@/lib/action-utils";

export async function editKnowledgeItem(id: string, formData: FormData) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const notes = formData.get("notes") as string;
  const tagsString = formData.get("tags") as string;

  if (!title) return { error: "Title is required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    await prisma.knowledgeTag.deleteMany({ where: { itemId: id } });

    await prisma.knowledgeItem.update({
      where: { id, userId },
      data: {
        title, content: content || null,
        notes: notes || null,
        tags: tagNames.length > 0
          ? {
              create: await Promise.all(tagNames.map(async (name) => {
                const tag = await prisma.tag.upsert({
                  where: { name_userId: { name, userId } },
                  create: { name, userId },
                  update: {},
                });
                return { tagId: tag.id };
              })),
            }
          : undefined,
      },
    });

    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to update knowledge item" };
  }
}

export async function deleteKnowledgeItem(id: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    await prisma.knowledgeItem.update({
      where: { id, userId },
      data: { status: "trashed", deletedAt: new Date() },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to delete knowledge item" };
  }
}

export async function archiveKnowledgeItem(id: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    await prisma.knowledgeItem.update({
      where: { id, userId },
      data: { status: "archived", archivedAt: new Date() },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to archive knowledge item" };
  }
}

export async function restoreKnowledgeItem(id: string) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    await prisma.knowledgeItem.update({
      where: { id, userId },
      data: { status: "active", archivedAt: null, deletedAt: null },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to restore knowledge item" };
  }
}

export async function touchKnowledgeItem(id: string) {
  const userId = await requireAuth();
  if (!userId) return;
  try {
    await prisma.knowledgeItem.updateMany({
      where: { id, userId },
      data: { lastOpenedAt: new Date() },
    });
  } catch {}
}

export async function toggleFavorite(id: string, current: boolean) {
  const userId = await requireAuth();
  if (!userId) return { error: "Not authenticated" };

  try {
    await prisma.knowledgeItem.update({
      where: { id, userId },
      data: { favorite: !current },
    });
    revalidatePath("/knowledge");
    return { success: true };
  } catch {
    return { error: "Failed to toggle favorite" };
  }
}

export type KnowledgeFilter = "favorites" | "archive" | "trash" | null;

export async function fetchMoreKnowledgeItems(cursor?: string, limit = 20, filter?: KnowledgeFilter) {
  const userId = await requireAuth();
  if (!userId) return { items: [], nextCursor: null };

  const where: { userId: string; status: string; favorite?: true } = { userId, status: "active" };
  if (filter === "favorites") {
    where.favorite = true;
  } else if (filter === "archive") {
    where.status = "archived";
  } else if (filter === "trash") {
    where.status = "trashed";
  }

  const items = await prisma.knowledgeItem.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      tags: { include: { tag: true } },
      collections: { select: { collectionId: true } },
      capture: { select: { status: true } },
    },
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    items: items.map(({ capture, ...rest }) => ({
      ...flattenItemCollections(flattenItemTags({ ...rest, createdAt: rest.createdAt })),
      captureStatus: capture?.status ?? null,
    })),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}