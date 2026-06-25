"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTagNames, buildTagCreate, flattenListTags } from "@/lib/tags";

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !category) return { error: "Title and category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    const note = await prisma.note.create({
      data: {
        title, content: content || "", category, userId: session.user.id,
        tags: buildTagCreate(tagNames, session.user.id),
      },
    });
    revalidatePath("/notes");
    if (tagNames.length > 0) revalidatePath("/tags");
    return { success: true, id: note.id };
  } catch {
    return { error: "Failed to create note" };
  }
}

export async function editNote(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !category) return { error: "Title and category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    await prisma.noteTag.deleteMany({ where: { noteId: id } });
    await prisma.note.update({
      where: { id, userId: session.user.id },
      data: { title, content: content || "", category, tags: buildTagCreate(tagNames, session.user.id) },
    });
    revalidatePath("/notes");
    return { success: true };
  } catch {
    return { error: "Failed to update note" };
  }
}

export async function deleteNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.note.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/notes");
    return { success: true };
  } catch {
    return { error: "Failed to delete note" };
  }
}

export async function toggleNoteFavorite(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const note = await prisma.note.findUnique({ where: { id }, select: { favorite: true, userId: true } });
    if (!note || note.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.note.update({ where: { id }, data: { favorite: !note.favorite } });
    revalidatePath("/notes");
    return { success: true };
  } catch {
    return { error: "Failed to toggle favorite" };
  }
}

export async function archiveNote(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const note = await prisma.note.findUnique({ where: { id }, select: { archived: true, userId: true } });
    if (!note || note.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.note.update({ where: { id }, data: { archived: !note.archived } });
    revalidatePath("/notes");
    return { success: true };
  } catch {
    return { error: "Failed to archive note" };
  }
}

export async function fetchMoreNotes(cursor?: string, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return { items: [], nextCursor: null };

  const items = await prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    items: flattenListTags(items.map((n) => ({ ...n, createdAt: n.createdAt, updatedAt: n.updatedAt }))),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}
