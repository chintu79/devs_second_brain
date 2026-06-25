"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !category) {
    return { error: "Title and category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const note = await prisma.note.create({
      data: { title, content: content || "", category, tags, userId: session.user.id },
    });
    revalidatePath("/notes");
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

  if (!title || !category) {
    return { error: "Title and category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.note.update({
      where: { id },
      data: { title, content: content || "", category, tags },
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
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.note.delete({ where: { id } });
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
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.note.update({
      where: { id },
      data: { favorite: !note.favorite },
    });
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
    const existing = await prisma.note.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.note.update({
      where: { id },
      data: { archived: !existing.archived },
    });
    revalidatePath("/notes");
    return { success: true };
  } catch {
    return { error: "Failed to archive note" };
  }
}
