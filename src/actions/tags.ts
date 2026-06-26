"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getTagsWithCounts() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userId = session.user.id;

    const tags = await prisma.tag.findMany({
    where: { userId },
    include: {
      _count: {
        select: { resources: true, prompts: true, notes: true, projects: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return tags.map((t) => ({
    id: t.id,
    name: t.name,
    resourceCount: t._count.resources,
    promptCount: t._count.prompts,
    noteCount: t._count.notes,
    projectCount: t._count.projects,
    totalCount: t._count.resources + t._count.prompts + t._count.notes + t._count.projects,
    createdAt: t.createdAt,
  }));
  } catch {
    return [];
  }
}

export async function searchTags(query: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const tags = await prisma.tag.findMany({
    where: { userId: session.user.id, name: { contains: query, mode: "insensitive" } },
    select: { id: true, name: true },
    take: 10,
    orderBy: { name: "asc" },
  });

    return tags;
  } catch {
    return [];
  }
}

export async function mergeTags(sourceId: string, targetId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  if (sourceId === targetId) throw new Error("Cannot merge a tag into itself");

  const userId = session.user.id;

  const [source, target] = await Promise.all([
    prisma.tag.findFirst({ where: { id: sourceId, userId } }),
    prisma.tag.findFirst({ where: { id: targetId, userId } }),
  ]);

  if (!source || !target) throw new Error("Tag not found");

  // Move resource links
  const resourceLinks = await prisma.resourceTag.findMany({ where: { tagId: sourceId } });
  for (const link of resourceLinks) {
    const existing = await prisma.resourceTag.findFirst({
      where: { tagId: targetId, resourceId: link.resourceId },
    });
    if (!existing) {
      await prisma.resourceTag.create({ data: { tagId: targetId, resourceId: link.resourceId } });
    }
  }
  await prisma.resourceTag.deleteMany({ where: { tagId: sourceId } });

  // Move prompt links
  const promptLinks = await prisma.promptTag.findMany({ where: { tagId: sourceId } });
  for (const link of promptLinks) {
    const existing = await prisma.promptTag.findFirst({
      where: { tagId: targetId, promptId: link.promptId },
    });
    if (!existing) {
      await prisma.promptTag.create({ data: { tagId: targetId, promptId: link.promptId } });
    }
  }
  await prisma.promptTag.deleteMany({ where: { tagId: sourceId } });

  // Move note links
  const noteLinks = await prisma.noteTag.findMany({ where: { tagId: sourceId } });
  for (const link of noteLinks) {
    const existing = await prisma.noteTag.findFirst({
      where: { tagId: targetId, noteId: link.noteId },
    });
    if (!existing) {
      await prisma.noteTag.create({ data: { tagId: targetId, noteId: link.noteId } });
    }
  }
  await prisma.noteTag.deleteMany({ where: { tagId: sourceId } });

  // Move project links
  const projectLinks = await prisma.projectTag.findMany({ where: { tagId: sourceId } });
  for (const link of projectLinks) {
    const existing = await prisma.projectTag.findFirst({
      where: { tagId: targetId, projectId: link.projectId },
    });
    if (!existing) {
      await prisma.projectTag.create({ data: { tagId: targetId, projectId: link.projectId } });
    }
  }
  await prisma.projectTag.deleteMany({ where: { tagId: sourceId } });

  await prisma.tag.delete({ where: { id: sourceId } });
  revalidatePath("/tags");
}

export async function deleteTag(tagId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.tag.delete({ where: { id: tagId } });
  revalidatePath("/tags");
}
