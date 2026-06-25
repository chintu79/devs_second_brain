"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPrompt(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const prompt = formData.get("prompt") as string;
  const category = formData.get("category") as string;
  const useCase = formData.get("useCase") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !prompt || !category) {
    return { error: "Title, prompt, and category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const created = await prisma.prompt.create({
      data: { title, prompt, category, tags, useCase: useCase || "", userId: session.user.id },
    });
    revalidatePath("/prompts");
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

  if (!title || !prompt || !category) {
    return { error: "Title, prompt, and category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.prompt.update({
      where: { id },
      data: { title, prompt, category, tags, useCase: useCase || "" },
    });
    revalidatePath("/prompts");
    revalidatePath(`/prompts/${id}`);
    return { success: true };
  } catch {
    return { error: "Failed to update prompt" };
  }
}

export async function deletePrompt(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.prompt.delete({ where: { id } });
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
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.prompt.update({
      where: { id },
      data: { favorite: !existing.favorite },
    });
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
    const existing = await prisma.prompt.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.prompt.update({
      where: { id },
      data: {
        useCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });
    revalidatePath("/prompts");
    return { success: true };
  } catch {
    return { error: "Failed to record usage" };
  }
}
