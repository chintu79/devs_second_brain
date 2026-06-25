"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const techStackString = formData.get("techStack") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !status) {
    return { error: "Title and status are required" };
  }

  const techStack = techStackString
    ? techStackString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const project = await prisma.project.create({
      data: { title, description: description || "", status, techStack, tags, userId: session.user.id },
    });
    revalidatePath("/projects");
    return { success: true, id: project.id };
  } catch {
    return { error: "Failed to create project" };
  }
}

export async function editProject(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const techStackString = formData.get("techStack") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !status) {
    return { error: "Title and status are required" };
  }

  const techStack = techStackString
    ? techStackString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const tags = tagsString
    ? tagsString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.project.update({
      where: { id },
      data: { title, description: description || "", status, techStack, tags },
    });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };

    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to delete project" };
  }
}

export async function toggleProjectFavorite(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project || project.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.project.update({ where: { id }, data: { favorite: !project.favorite } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to toggle favorite" };
  }
}

export async function saveProjectPlan(id: string, planMd: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.project.update({ where: { id }, data: { planMd } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to save plan" };
  }
}

export async function archiveProject(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };
    const newStatus = existing.status === "archived" ? "planning" : "archived";
    await prisma.project.update({ where: { id }, data: { status: newStatus } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to archive project" };
  }
}
