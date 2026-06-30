"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function globalSearch(query: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!query?.trim()) {
      return { resources: [], prompts: [], notes: [], projects: [] };
    }

    const q = query.trim();

    if (!userId) {
      return { resources: [], prompts: [], notes: [], projects: [] };
    }

    const [resources, prompts, notes, projects] = await Promise.all([
      prisma.resource.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { url: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      include: { tags: { include: { tag: true } } },
      take: 10,
    }),
    prisma.prompt.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { prompt: { contains: q, mode: "insensitive" } },
          { useCase: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      include: { tags: { include: { tag: true } } },
      take: 10,
    }),
    prisma.note.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
        ],
      },
      include: { tags: { include: { tag: true } } },
      take: 10,
    }),
    prisma.project.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { tags: { some: { tag: { name: { contains: q, mode: "insensitive" } } } } },
          { techStack: { has: q } },
        ],
      },
      include: { tags: { include: { tag: true } } },
      take: 10,
    }),
  ]);

  function flattenTags(items: { tags: { tag: { id: string; name: string } }[] }[]) {
    return items.map((item) => ({
      ...item,
      tags: item.tags.map((t) => t.tag.name),
    }));
  }

    return {
      resources: flattenTags(resources),
      prompts: flattenTags(prompts),
      notes: flattenTags(notes),
      projects: flattenTags(projects),
    };
  } catch {
    return { resources: [], prompts: [], notes: [], projects: [] };
  }
}
