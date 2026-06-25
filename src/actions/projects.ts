"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { parseTagNames, buildTagCreate, flattenListTags } from "@/lib/tags";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const techStackString = formData.get("techStack") as string;
  const tagsString = formData.get("tags") as string;

  if (!title || !status) return { error: "Title and status are required" };

  const techStack = techStackString ? techStackString.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const tagNames = parseTagNames(tagsString || "");

  try {
    const project = await prisma.project.create({
      data: {
        title, description: description || "", status, techStack, userId: session.user.id,
        tags: buildTagCreate(tagNames, session.user.id),
      },
    });
    revalidatePath("/projects");
    if (tagNames.length > 0) revalidatePath("/tags");
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

  if (!title || !status) return { error: "Title and status are required" };

  const techStack = techStackString ? techStackString.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const tagNames = parseTagNames(tagsString || "");

  try {
    await prisma.projectTag.deleteMany({ where: { projectId: id } });
    await prisma.project.update({
      where: { id, userId: session.user.id },
      data: { title, description: description || "", status, techStack, tags: buildTagCreate(tagNames, session.user.id) },
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
    await prisma.project.delete({ where: { id, userId: session.user.id } });
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
    const p = await prisma.project.findUnique({ where: { id }, select: { favorite: true, userId: true } });
    if (!p || p.userId !== session.user.id) return { error: "Unauthorized" };
    await prisma.project.update({ where: { id }, data: { favorite: !p.favorite } });
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
    await prisma.project.update({ where: { id, userId: session.user.id }, data: { planMd } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to save plan" };
  }
}

export async function updateProjectStatus(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.project.update({ where: { id, userId: session.user.id }, data: { status } });
  revalidatePath("/projects");
}

export async function archiveProject(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const existing = await prisma.project.findUnique({ where: { id }, select: { status: true, userId: true } });
    if (!existing || existing.userId !== session.user.id) return { error: "Unauthorized" };
    const newStatus = existing.status === "archived" ? "planning" : "archived";
    await prisma.project.update({ where: { id }, data: { status: newStatus } });
    revalidatePath("/projects");
    return { success: true };
  } catch {
    return { error: "Failed to archive project" };
  }
}

export async function fetchMoreProjects(cursor?: string, limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return { items: [], nextCursor: null };

  const items = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: { tags: { include: { tag: true } } },
  });

  const hasMore = items.length > limit;
  if (hasMore) items.pop();

  return {
    items: flattenListTags(items.map((p) => ({ ...p, createdAt: p.createdAt, updatedAt: p.updatedAt }))),
    nextCursor: hasMore ? items[items.length - 1].id : null,
  };
}
