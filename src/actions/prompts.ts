"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTagNames, buildTagCreate, flattenListTags } from "@/lib/tags";

export async function createPrompt(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const prompt = formData.get("prompt") as string;
  const category = formData.get("category") as string;
  const useCase = formData.get("useCase") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !prompt || !category) return { error: "Title, prompt, and category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    const created = await prisma.prompt.create({
      data: { title, prompt, category, useCase: useCase || "", userId: session.user.id, tags: buildTagCreate(tagNames, session.user.id) },
    });
    revalidatePath("/prompts");
    if (tagNames.length > 0) revalidatePath("/tags");

    return { success: true, id: created.id };
  } catch {
    return { error: "Failed to create prompt" };
  }
}

export async function editPrompt(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const prompt = formData.get("prompt") as string;
  const category = formData.get("category") as string;
  const useCase = formData.get("useCase") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !prompt || !category) return { error: "Title, prompt, and category are required" };

  const tagNames = parseTagNames(tagsString || "");

  try {
    await prisma.promptTag.deleteMany({ where: { promptId: id } });
    await prisma.prompt.update({
      where: { id, userId: session.user.id },
      data: { title, prompt, category, useCase: useCase || "", tags: buildTagCreate(tagNames, session.user.id) },
    });
    revalidatePath("/prompts");

    return { success: true };
  } catch {
    return { error: "Failed to update prompt" };
  }
}

export async function deletePrompt(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.prompt.delete({ where: { id, userId: session.user.id } });
    revalidatePath("/prompts");

    return { success: true };
  } catch {
    return { error: "Failed to delete prompt" };
  }
}

export async function toggleFavorite(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.prompt.findUnique({ where: { id }, select: { favorite: true, userId: true } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.prompt.update({ where: { id }, data: { favorite: !existing.favorite } });
    revalidatePath("/prompts");

    return { success: true };
  } catch {
    return { error: "Failed to toggle favorite" };
  }
}

export async function recordPromptUsage(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await prisma.prompt.update({
      where: { id, userId: session.user.id },
      data: { useCount: { increment: 1 }, lastUsedAt: new Date() },
    });
    revalidatePath("/prompts");

    return { success: true };
  } catch {
    return { error: "Failed to record usage" };
  }
}

export async function fetchMorePrompts(cursor?: string, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return { items: [], nextCursor: null };

  const items = await prisma.prompt.findMany({
    where: { userId: session.user.id },
    orderBy: [{ favorite: "desc" }, { lastUsedAt: "desc" }, { createdAt: "desc" }],
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    items: flattenListTags(items.map((p) => ({ ...p, createdAt: p.createdAt, lastUsedAt: p.lastUsedAt }))),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}
