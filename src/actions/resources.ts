"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTagNames, buildTagCreate, flattenListTags } from "@/lib/tags";

export async function createResource(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const notes = formData.get("notes") as string;
  const reason = formData.get("reason") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !url || !category) return { error: "Title, URL, and Category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    const resource = await prisma.resource.create({
      data: {
        title, url, category, notes, reason,
        userId: session.user.id,
        tags: buildTagCreate(tagNames, session.user.id),
      },
    });
    revalidatePath("/resources");
    if (tagNames.length > 0) revalidatePath("/tags");

    return { success: true, id: resource.id };
  } catch {
    return { error: "Failed to create resource" };
  }
}

export async function editResource(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const notes = formData.get("notes") as string;
  const reason = formData.get("reason") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !url || !category) return { error: "Title, URL, and Category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    await prisma.resourceTag.deleteMany({ where: { resourceId: id } });
    await prisma.resource.update({
      where: { id, userId: session.user.id },
      data: { title, url, category, notes, reason, tags: buildTagCreate(tagNames, session.user.id) },
    });
    revalidatePath("/resources");

    return { success: true };
  } catch {
    return { error: "Failed to update resource" };
  }
}

export async function deleteResource(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.resource.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/resources");

    return { success: true };
  } catch {
    return { error: "Failed to delete resource" };
  }
}

export async function toggleFavorite(id: string, current: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.resource.update({ where: { id, userId: session.user.id }, data: { favorite: !current } });
    revalidatePath("/resources");

    return { success: true };
  } catch {
    return { error: "Failed to toggle favorite" };
  }
}

export async function fetchMoreResources(cursor?: string, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return { items: [], nextCursor: null };

  const items = await prisma.resource.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    items: flattenListTags(items.map((r) => ({ ...r, createdAt: r.createdAt, notes: r.notes, reason: r.reason }))),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}
