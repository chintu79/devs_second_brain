"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createResource(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const notes = formData.get("notes") as string;
  const reason = formData.get("reason") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !url || !category) {
    return { error: "Title, URL, and Category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const resource = await prisma.resource.create({
      data: {
        title,
        url,
        category,
        tags,
        notes,
        reason,
        userId: session.user.id,
      },
    });

    revalidatePath("/resources");
    return { success: true, resource };
  } catch (error) {
    console.error("Create resource error:", error);
    return { error: "Failed to create resource" };
  }
}

export async function editResource(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;
  const notes = formData.get("notes") as string;
  const reason = formData.get("reason") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !url || !category) {
    return { error: "Title, URL, and Category are required" };
  }

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const existing = await prisma.resource.findUnique({
      where: { id: id as string },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    const resource = await prisma.resource.update({
      where: { id: id as string },
      data: {
        title,
        url,
        category,
        tags,
        notes,
        reason,
        userId: session.user.id,
      },
    });

    revalidatePath("/resources");
    revalidatePath(`/resources/${id}`);
    return { success: true, resource };
  } catch (error) {
    console.error("Edit resource error:", error);
    return { error: "Failed to update resource" };
  }
}

export async function deleteResource(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const existing = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.resource.delete({
      where: { id },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Delete resource error:", error);
    return { error: "Failed to delete resource" };
  }
}

export async function toggleFavorite(id: string, current: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  try {
    const existing = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { error: "Unauthorized" };
    }

    await prisma.resource.update({
      where: { id },
      data: { favorite: !current },
    });

    revalidatePath("/resources");
    return { success: true };
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return { error: "Failed to toggle favorite" };
  }
}
